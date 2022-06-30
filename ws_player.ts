import { sleep } from "https://deno.land/x/sleep@v1.2.0/mod.ts";
import { parse } from "https://deno.land/std@0.145.0/flags/mod.ts";

import { Record } from "./ws_recorder.ts";

const parsedArgs = parse(Deno.args);

const logfile = "data/log_1655963453598.json";
const rawJson = Deno.readTextFileSync(logfile);
const data = JSON.parse(rawJson) as Record[];

const socket = new WebSocket("ws://127.0.0.1:19999/");

socket.onmessage = (m) => console.log(`socket message: [${m.data}]`);
socket.onerror = (e) => console.log("socket errored:", e);
socket.onclose = () => console.log("socket closed");

socket.onopen = async () => {
  console.log("socket opened");
  let startTime!: number;

  // untilの時間までsleepする
  const sleepUntil = async (until: number) => {
    const elapsed = new Date().getTime() - startTime;
    const sleepTime = until - elapsed;
    if (sleepTime > 0) {
      await sleep(sleepTime / 1000);
    }
  };

  while (true) {
    startTime = new Date().getTime();
    for (const record of data) {
      await sleepUntil(record.timestamp);
      socket.send(record.message as string);
    }
    // --oneshotで実行した場合は1回で終了
    if (parsedArgs.oneshot) {
      break;
    }
  }
  socket.close();
};
