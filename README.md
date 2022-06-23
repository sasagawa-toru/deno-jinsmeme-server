# deno-jinjmeme-server

JINS MEMEのデータを受信するdeno製WebSocketサーバー

## サーバー起動

    deno run --watch --allow-net --allow-read main.ts

## WebSocketレコーダー起動

    deno run --allow-net --allow-write ws_recorder.ts

## WebSocketプレイヤー起動

    deno run --allow-net --allow-read ws_player.ts
