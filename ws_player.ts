import { sleep } from "https://deno.land/x/sleep@v1.2.0/mod.ts";

import { Record } from "./ws_recorder.ts";

const logfile = "data/log_1655963453598.json";
const rawJson = Deno.readTextFileSync(logfile);
const data = JSON.parse(rawJson) as Record[];

const socket = new WebSocket("ws://127.0.0.1:19999/");

socket.onmessage = (m) => console.log(`socket message: [${m.data}]`);
socket.onerror = (e) => console.log("socket errored:", e);
socket.onclose = () => console.log("socket closed");

socket.onopen = async () => {
  console.log("socket opened");
  const startTime = new Date().getTime();

  // untilの時間までsleepする
  const sleepUntil = async (until: number) => {
    const elapsed = new Date().getTime() - startTime;
    const sleepTime = until - elapsed;
    if (sleepTime > 0) {
      await sleep(sleepTime / 1000);
    }
  };

  for (const record of data) {
    await sleepUntil(record.timestamp);
    socket.send(record.message as string);
  }
  socket.close();
};
