const port = Number(process.argv[2] || 9345);
const list = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
const page = list.find((target) => target.type === "page");
if (!page) {
  console.log("no page", JSON.stringify(list).slice(0, 400));
  process.exit(1);
}
const ws = new WebSocket(page.webSocketDebuggerUrl);
let seq = 0;
const pending = new Map();
const logs = [];
await new Promise((resolve) => {
  ws.addEventListener("open", resolve);
});
ws.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
    return;
  }
  if (message.method === "Runtime.exceptionThrown") {
    logs.push("EXC " + (message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text));
  }
  if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
    logs.push("ERR " + message.params.args.map((arg) => arg.value || arg.description || "").join(" "));
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
await send("Page.navigate", { url: process.argv[3] || "http://127.0.0.1:8772/?v=3d" });
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });

async function evalJson(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.result?.exceptionDetails) {
    logs.push("EVAL " + result.result.exceptionDetails.text);
    return null;
  }
  return result.result?.result?.value;
}

const deadline = Date.now() + 90000;
let status = null;
while (Date.now() < deadline) {
  status = await evalJson(`({
    canvases: document.querySelectorAll("canvas").length,
    loading: document.querySelectorAll("[data-loading]").length,
    failed: document.querySelectorAll("[data-error]").length,
    title: document.querySelector("#plate-title")?.textContent || ""
  })`);
  if (status && status.canvases >= 2 && status.loading === 0) break;
  await new Promise((r) => setTimeout(r, 1500));
}
console.log("status", JSON.stringify(status));

await evalJson(`location.hash = "#male/anterior/calcaneus/patient-right"`);
await new Promise((r) => setTimeout(r, 800));
const heel = await evalJson(`({
  title: document.querySelector("#plate-title")?.textContent || "",
  hash: location.hash,
  overview: document.querySelector(".panel-overview")?.textContent || "",
  whole: !document.querySelector('.figure-card[data-sex="male"] .whole')?.hidden
})`);
console.log("heel", JSON.stringify(heel));

await evalJson(`document.querySelector('.figure-card [data-view="posterior"]').click()`);
await new Promise((r) => setTimeout(r, 600));
const back = await evalJson(`document.querySelector(".plate-view")?.textContent || ""`);
console.log("aspect", back);

await evalJson(`location.hash = "#female/anterior/heart"`);
await new Promise((r) => setTimeout(r, 800));
const heart = await evalJson(`({
  title: document.querySelector("#plate-title")?.textContent || "",
  overview: document.querySelector(".panel-overview")?.textContent || "",
  sex: document.querySelector(".sys-kicker")?.textContent || ""
})`);
console.log("heart", JSON.stringify(heart));

await evalJson(`location.hash = "#female/anterior/uterus"`);
await new Promise((r) => setTimeout(r, 600));
const uterus = await evalJson(`document.querySelector("#plate-title")?.textContent || ""`);
console.log("uterus", uterus);

await evalJson(`document.querySelector('[data-system="skeletal"]').dispatchEvent(new MouseEvent("dblclick", { bubbles: true }))`);
await new Promise((r) => setTimeout(r, 400));
const skeletal = await evalJson(`({
  pressed: document.querySelector('[data-system="skeletal"]')?.getAttribute("aria-pressed"),
  others: [...document.querySelectorAll(".chip")].filter((chip) => chip.getAttribute("aria-pressed") === "true").map((chip) => chip.dataset.system),
  femaleGap: document.querySelector('.figure-card[data-sex="female"] .coverage')?.hidden
})`);
console.log("skeletal", JSON.stringify(skeletal));

const ads = await evalJson(`({
  left: document.querySelector('[data-ad-slot="left"]')?.getBoundingClientRect().width || 0,
  right: document.querySelector('[data-ad-slot="right"]')?.getBoundingClientRect().width || 0
})`);
console.log("ads-wide", JSON.stringify(ads));

const shot = await send("Page.captureScreenshot", { format: "png" });
const fs = await import("fs");
fs.writeFileSync(process.env.TEMP + "\\atlas-3d-wide.png", Buffer.from(shot.result.data, "base64"));

await send("Emulation.setDeviceMetricsOverride", { width: 900, height: 900, deviceScaleFactor: 1, mobile: false });
await new Promise((r) => setTimeout(r, 400));
const narrow = await evalJson(`({
  left: getComputedStyle(document.querySelector(".ad-rail")).display,
  banner: document.querySelector('[data-ad-slot="bottom"]')?.getBoundingClientRect().height || 0,
  columns: getComputedStyle(document.querySelector(".figures")).gridTemplateColumns
})`);
console.log("narrow", JSON.stringify(narrow));
const shot2 = await send("Page.captureScreenshot", { format: "png" });
fs.writeFileSync(process.env.TEMP + "\\atlas-3d-narrow.png", Buffer.from(shot2.result.data, "base64"));
console.log("logs", logs.slice(0, 12));
ws.close();
