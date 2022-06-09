export const handleMessage = (msg: MessageEvent<unknown>) => {
  const rawJson = msg.data as string;
  const data = JSON.parse(rawJson);
  console.log(`yaw:${data.yaw}, pitch:${data.pitch}, roll:${data.roll}`);
};
