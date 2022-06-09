export const handleMessage = (guiSockets: WebSocket[]) => {
  return (msg: MessageEvent<unknown>) => {
    const rawJson = msg.data as string;
    const data = JSON.parse(rawJson);
    console.log(`yaw:${data.yaw}, pitch:${data.pitch}, roll:${data.roll}`);
    guiSockets.forEach((sock) => sock.send(rawJson));
  };
};
