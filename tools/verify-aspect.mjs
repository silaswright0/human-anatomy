const port = 9348;
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
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true });
  return result.result?.result?.value;
}
await send("Runtime.enable");
await send("Page.enable");
await send("Page.navigate", { url: "http://127.0.0.1:8772/?v=aspect" });
const deadline = Date.now() + 90000;
let status = null;
while (Date.now() < deadline) {
  status = await evaluate(`({
    buttons: document.querySelectorAll("[data-view]").length,
    label: document.querySelector(".aspect-name")?.textContent || "",
    left: document.querySelector(".orient span")?.textContent || "",
    plate: document.querySelector(".plate-view")?.textContent || "",
    canvases: document.querySelectorAll("canvas").length,
    loading: document.querySelectorAll("[data-loading]").length
  })`);
  if (status && status.canvases >= 1 && status.loading === 0 && status.label) break;
  await new Promise((r) => setTimeout(r, 800));
}
console.log("before", JSON.stringify(status));
const box = await evaluate(`(() => { const r = document.querySelector("canvas").getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
await send("Input.dispatchMouseEvent", { type: "mousePressed", x: box.x, y: box.y, button: "left", clickCount: 1 });
await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: box.x - 520, y: box.y, button: "left" });
await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: box.x - 520, y: box.y, button: "left", clickCount: 1 });
await new Promise((r) => setTimeout(r, 400));
const after = await evaluate(`({
  label: document.querySelector(".aspect-name")?.textContent || "",
  left: document.querySelector(".orient span")?.textContent || "",
  right: document.querySelectorAll(".orient span")[1]?.textContent || "",
  plate: document.querySelector(".plate-view")?.textContent || "",
  buttons: document.querySelectorAll("button[data-view]").length
})`);
console.log("after", JSON.stringify(after));
ws.close();
