# deno-jinjmeme-server

JINS MEMEのデータを受信するdeno製WebSocketサーバー

## サーバー起動

    deno run --watch --allow-net --allow-read main.ts

ブラウザーで http://127.0.0.1:19999/gui を開く。

## WebSocketレコーダー起動

    deno run --allow-net --allow-write ws_recorder.ts

## WebSocketプレイヤー起動

    deno run --allow-net --allow-read ws_player.ts

ループせず1回で終了する場合は以下。

    deno run --allow-net --allow-read ws_player.ts --oneshot
