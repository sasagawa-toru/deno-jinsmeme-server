import { serve } from "https://deno.land/std@0.142.0/http/server.ts";

interface Record {
  timestamp: number;
  message: unknown;
}

function handler(req: Request): Response {
  const messages: Record[] = [];
  const startTime = new Date().getTime();

  let response, socket: WebSocket;
  try {
    ({ response, socket } = Deno.upgradeWebSocket(req));
  } catch {
    return new Response("request isn't trying to upgrade to websocket.");
  }
  socket.onopen = () => console.log("socket opened");
  socket.onmessage = (msg: MessageEvent<unknown>) => {
    const record = {
      timestamp: new Date().getTime() - startTime,
      message: msg.data,
    };
    messages.push(record);
  };
  socket.onerror = (e) => console.log("socket errored:", e);
  socket.onclose = () => {
    console.log("socket closed");
    const filename = `data/log_${startTime}.json`;
    Deno.writeTextFileSync(filename, JSON.stringify(messages));
  };
  return response;
}

serve(handler, { hostname: "0.0.0.0", port: 19999 });
