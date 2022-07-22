import { serve } from "https://deno.land/std@0.142.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.142.0/http/file_server.ts";

import { handleMessage } from "./memedata.ts";

const guiSockets: WebSocket[] = [];

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  switch (url.pathname) {
    // Loggerアプリからの接続先(WebSocket)
    case "/": {
      let response, socket: WebSocket;
      try {
        ({ response, socket } = Deno.upgradeWebSocket(req));
      } catch {
        return new Response("request isn't trying to upgrade to websocket.");
      }
      socket.onmessage = handleMessage(guiSockets);
      return response;
    }

    // HTML画面を表示(staticコンテンツ)
    case "/gui": {
      return await serveFile(req, "gui.html");
    }

    // HTML画面からの接続先(WebSocket)
    case "/gui-socket": {
      let response, socket: WebSocket;
      try {
        ({ response, socket } = Deno.upgradeWebSocket(req));
      } catch {
        return new Response("request isn't trying to upgrade to websocket.");
      }
      socket.onclose = () => {
        const idx = guiSockets.findIndex((x) => x === socket);
        guiSockets.splice(idx, 1);
      };
      guiSockets.push(socket);
      return response;
    }

    // 画像表示(staticコンテンツ)
    case "/face.png": {
      return await serveFile(req, "face.png");
    }

    default:
      return new Response("Not Found", { status: 404 });
  }
}

serve(handler, { hostname: "0.0.0.0", port: 19999 });
