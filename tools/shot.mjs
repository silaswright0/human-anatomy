const port = 9346;
const list = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
const page = list.find((target) => target.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
let seq = 0;
const pending = new Map();
await new Promise((resolve) => ws.addEventListener("open", resolve));
ws.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
});
function send(method, params = {}) {
  const id = ++seq;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
}
const fs = await import("fs");
await send("Runtime.enable");
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: "http://127.0.0.1:8772/?v=3d2" });
const deadline = Date.now() + 90000;
let status = null;
while (Date.now() < deadline) {
  const result = await send("Runtime.evaluate", {
    expression: `({ canvases: document.querySelectorAll('canvas').length, loading: document.querySelectorAll('[data-loading]').length, cards: document.querySelectorAll('.figure-card').length })`,
    returnByValue: true,
  });
  status = result.result?.result?.value;
  if (status && status.canvases >= 2 && status.loading === 0) break;
  await new Promise((r) => setTimeout(r, 1500));
}
console.log("both", JSON.stringify(status));
const shot = await send("Page.captureScreenshot", { format: "png" });
fs.writeFileSync(process.env.TEMP + "\\atlas-3d-both.png", Buffer.from(shot.result.data, "base64"));
await send("Runtime.evaluate", { expression: `document.querySelector('#sexes [data-sex="male"]').click()`, returnByValue: true });
const maleDeadline = Date.now() + 60000;
while (Date.now() < maleDeadline) {
  const result = await send("Runtime.evaluate", {
    expression: `({ loading: document.querySelectorAll('[data-loading]').length, cards: document.querySelectorAll('.figure-card').length })`,
    returnByValue: true,
  });
  const maleStatus = result.result?.result?.value;
  if (maleStatus && maleStatus.cards === 1 && maleStatus.loading === 0) break;
  await new Promise((r) => setTimeout(r, 1000));
}
const male = await send("Page.captureScreenshot", { format: "png" });
fs.writeFileSync(process.env.TEMP + "\\atlas-3d-male.png", Buffer.from(male.result.data, "base64"));
console.log("shots written");
ws.close();
