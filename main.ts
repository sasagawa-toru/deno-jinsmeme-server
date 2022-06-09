import { serve } from "https://deno.land/std@0.142.0/http/server.ts";

import { handleMessage } from "./memedata.ts";

function handler(req: Request): Response {
  let response, socket: WebSocket;
  try {
    ({ response, socket } = Deno.upgradeWebSocket(req));
  } catch {
    return new Response("request isn't trying to upgrade to websocket.");
  }
  socket.onopen = () => console.log("socket opened");
  socket.onmessage = handleMessage;
  socket.onerror = (e) => console.log("socket errored:", e);
  socket.onclose = () => console.log("socket closed");
  return response;
}

serve(handler, { hostname: "0.0.0.0", port: 19999 });
