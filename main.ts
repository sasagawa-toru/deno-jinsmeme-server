import { serve } from "https://deno.land/std@0.142.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.142.0/http/file_server.ts";

import { handleMessage } from "./memedata.ts";

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  if (url.pathname === "/meme") {
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
  } else if (url.pathname === "/gui") {
    return await serveFile(req, "gui.html");
  } else {
    return new Response("Not Found", { status: 404 });
  }
}

serve(handler, { hostname: "0.0.0.0", port: 19999 });
