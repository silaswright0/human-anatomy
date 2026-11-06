const port = 9348;
const list = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
const page = list.find((target) => target.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
let seq = 0;
const pending = new Map();
const logs = [];
await new Promise((resolve) => ws.addEventListener("open", resolve));
ws.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
    return;
  }
  if (message.method === "Runtime.exceptionThrown") logs.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
  if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
    logs.push(message.params.args.map((arg) => arg.value || arg.description || "").join(" "));
  }
});
function send(method, params = {}) {
  const id = ++seq;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
}
await send("Runtime.enable");
await send("Page.enable");
const fileUrl = "file:///C:/Silas%20Coding/2026%20coding/big3/human-anatomy/index.html?v=file2";
await send("Page.navigate", { url: fileUrl });
const deadline = Date.now() + 120000;
let status = null;
while (Date.now() < deadline) {
  const result = await send("Runtime.evaluate", {
    expression: `({ href: location.href, canvases: document.querySelectorAll("canvas").length, loading: document.querySelectorAll("[data-loading]").length, errors: document.querySelectorAll("[data-error]").length, note: document.querySelector(".load-error")?.textContent || "" })`,
    returnByValue: true,
  });
  status = result.result?.result?.value;
  if (status && status.canvases >= 2 && status.loading === 0) break;
  if (status && status.errors > 0 && status.loading === 0) break;
  await new Promise((r) => setTimeout(r, 1500));
}
console.log(JSON.stringify(status));
console.log(logs.slice(0, 6).join("\n"));
ws.close();
