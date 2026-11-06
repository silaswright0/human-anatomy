(function () {
  const state = {
    sex: "both",
    view: "anterior",
    enabled: new Set(window.ATLAS_SYSTEMS.map((system) => system.id)),
    selection: null,
  };

  const figures = document.getElementById("figures");
  const inspector = document.getElementById("inspector");
  const systemsEl = document.getElementById("systems");
  const tip = document.getElementById("tip");
  const searchInput = document.getElementById("q");
  const results = document.getElementById("results");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const anims = new WeakMap();
  let hi = 0;
  let hashLock = false;
  let chipSig = "";
  let searchIndex = [];
  let tipKey = "";
  let tipW = 280;
  let tipH = 140;

  window.ATLAS_CATALOG_READY = new Promise((resolve, reject) => {
    const start = () => {
      if (window.ATLAS_MESH_LIST) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "js/catalog.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("catalog"));
      document.head.appendChild(script);
    };
    requestAnimationFrame(() => requestAnimationFrame(start));
  });

  tip.innerHTML = `<p class="tip-kicker"></p><h3></h3><p class="latin"></p><p class="overview"></p><p class="also" hidden></p>`;
  const tipKicker = tip.querySelector(".tip-kicker");
  const tipTitle = tip.querySelector("h3");
  const tipLatin = tip.querySelector(".latin");
  const tipOverview = tip.querySelector(".overview");
  const tipAlso = tip.querySelector(".also");

  function esc(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[ch]));
  }

  function systemById(id) {
    return window.ATLAS_SYSTEMS.find((system) => system.id === id);
  }

  function systemNames(ids) {
    return ids.map((id) => systemById(id)?.name || id).join(" · ");
  }

  function displayName(id, side) {
    const part = window.ATLAS_PARTS[id];
    if (!part) return id;
    if (!side) return part.name;
    const which = side === "patient-right" ? "Dexter" : "Sinister";
    return `${which} ${part.name.charAt(0).toLowerCase()}${part.name.slice(1)}`;
  }

  function parseVB(value) {
    const [x, y, w, h] = value.split(/[\s,]+/).map(Number);
    return { x, y, w, h };
  }

  function fmtVB(box) {
    return [box.x, box.y, box.w, box.h].map((n) => Math.round(n * 10) / 10).join(" ");
  }

  function setVB(svg, box) {
    svg.setAttribute("viewBox", fmtVB(box));
  }

  function animateViewBox(svg, to) {
    const prev = anims.get(svg);
    if (prev) cancelAnimationFrame(prev);
    const from = parseVB(svg.getAttribute("viewBox"));
    if (reduced) {
      setVB(svg, to);
      return;
    }
    const t0 = performance.now();
    const ms = 560;
    function frame(now) {
      const k = Math.min(1, (now - t0) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      setVB(svg, {
        x: from.x + (to.x - from.x) * e,
        y: from.y + (to.y - from.y) * e,
        w: from.w + (to.w - from.w) * e,
        h: from.h + (to.h - from.h) * e,
      });
      if (k < 1) anims.set(svg, requestAnimationFrame(frame));
      else anims.delete(svg);
    }
    anims.set(svg, requestAnimationFrame(frame));
  }

  function partEnabled(id) {
    const part = window.ATLAS_PARTS[id];
    return part.systems.some((system) => state.enabled.has(system));
  }

  function renderChips() {
    const sig = [...state.enabled].sort().join(",");
    if (sig === chipSig && systemsEl.childElementCount) return;
    chipSig = sig;
    systemsEl.innerHTML = window.ATLAS_SYSTEMS.map((system) => `
      <button type="button" class="chip" data-system="${system.id}" style="--c:${system.color}" aria-pressed="${state.enabled.has(system.id)}">
        <span class="swatch"></span>${esc(system.name)}
      </button>`).join("") + `<button type="button" class="texty" data-all="1">All systems</button>`;
  }

  function updateSexButtons() {
    document.querySelectorAll("[data-sex]").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.sex === state.sex ? "true" : "false");
    });
  }

  function orientMarks() {
    if (state.view === "posterior") return ["Sinister", "Posterior", "Dexter"];
    return ["Dexter", "Anterior", "Sinister"];
  }

  function aspectPhrase(view) {
    return view === "posterior" ? "Posterior aspect" : "Anterior aspect";
  }

  function updateViewButtons() {
    const plateView = document.querySelector(".plate-view");
    if (plateView) plateView.textContent = aspectPhrase(state.view);
  }

  function describeCard(card, view) {
    const marks = view === "posterior" ? ["Sinister", "Posterior aspect", "Dexter"] : ["Dexter", "Anterior aspect", "Sinister"];
    const spans = card.querySelectorAll(".orient > span");
    if (spans[0]) spans[0].textContent = marks[0];
    if (spans[1]) spans[1].textContent = marks[2];
    const name = card.querySelector(".aspect-name");
    if (name) name.textContent = marks[1];
    const caption = card.querySelector(".caption");
    if (caption) caption.textContent = caption.textContent.replace(/anterior|posterior/, view);
  }

  function buildCard(sex) {
    const marks = orientMarks();
    const label = sex === "female" ? "Female" : "Male";
    const gap = sex === "female"
      ? "The HuBMAP female set has no meshes for this system."
      : "The male set has no meshes for this system.";
    const reference = sex === "female"
      ? "HuBMAP organs, pelvis, and eye muscles, plus BodyParts3D vessels, nerves, and gut fitted to those organs. The skeleton and the other muscles are the shared body wall."
      : "BodyParts3D organs, vessels, pelvis, and eye muscles, plus HuBMAP structures fitted to that body. The skeleton and the other muscles are the shared body wall, with Z-Anatomy muscles where BodyParts3D has none.";
    const card = document.createElement("article");
    card.className = "figure-card";
    card.dataset.sex = sex;
    card.innerHTML = `
      <div class="orient">
        <span>${marks[0]}</span>
        <p class="aspect-name">${marks[1]} aspect</p>
        <span>${marks[2]}</span>
      </div>
      <button type="button" class="whole" hidden>Whole body</button>
      <div class="body-view" data-sex="${sex}"></div>
      <p class="coverage" hidden>${gap}</p>
      <p class="caption">${label} · adult · ${state.view}</p>
      <p class="source-note">${reference}</p>`;
    return card;
  }

  function syncCards() {
    const sexes = state.sex === "both" ? ["female", "male"] : [state.sex];
    const visible = new Set(sexes);
    for (const sex of ["female", "male"]) {
      let card = figures.querySelector(`.figure-card[data-sex="${sex}"]`);
      if (!visible.has(sex)) {
        if (card) card.hidden = true;
        continue;
      }
      if (!card) {
        card = buildCard(sex);
        const male = figures.querySelector('.figure-card[data-sex="male"]');
        if (sex === "female" && male) figures.insertBefore(card, male);
        else figures.appendChild(card);
      }
      card.hidden = false;
      describeCard(card, state.view);
      const view = card.querySelector(".body-view");
      if (window.ATLAS_VIEW && !view.querySelector("canvas")) window.ATLAS_VIEW.mount(view, sex);
      else if (window.ATLAS_VIEW && window.ATLAS_VIEW.touch) window.ATLAS_VIEW.touch(sex);
    }
    figures.dataset.count = String(sexes.length);
    applyVisibility();
    applySelectionVisuals();
    updateViewButtons();
  }

  function applyVisibility() {
    if (window.ATLAS_VIEW) window.ATLAS_VIEW.setSystems(state.enabled, state.selection);
  }

  function applySelectionVisuals() {
    document.querySelectorAll(".figure-card").forEach((card) => card.classList.remove("is-quiet"));
    const sel = state.selection;
    if (!sel || state.sex !== "both") return;
    document.querySelectorAll(".figure-card").forEach((card) => {
      if (card.dataset.sex !== sel.sex) card.classList.add("is-quiet");
    });
  }

  function zoomToSelection() {
    const sel = state.selection;
    if (!sel || !window.ATLAS_VIEW) return;
    const card = document.querySelector(`.figure-card[data-sex="${sel.sex}"]`);
    if (!card) return;
    window.ATLAS_VIEW.focus(sel.sex, sel.id);
    card.querySelector(".whole").hidden = false;
  }

  function unzoom() {
    if (window.ATLAS_VIEW) window.ATLAS_VIEW.reset();
    document.querySelectorAll(".whole").forEach((button) => {
      button.hidden = true;
    });
  }

  function clearSelection() {
    state.selection = null;
    unzoom();
    applyVisibility();
    applySelectionVisuals();
    renderInspector();
    setHash();
  }

  function resolveSex(part, preferred) {
    const need = part.sex || "both";
    if (need !== "both") {
      if (state.sex !== "both" && state.sex !== need) state.sex = need;
      return need;
    }
    if (preferred && (state.sex === "both" || state.sex === preferred)) {
      return state.sex === "both" ? preferred : state.sex;
    }
    return state.sex === "both" ? "female" : state.sex;
  }

  function select(target, stack, opts) {
    const part = window.ATLAS_PARTS[target.id];
    if (!part) return;
    const before = state.sex;
    const viewBefore = state.view;
    const sex = resolveSex(part, target.sex);
    const aspect = part.aspect || "both";
    if (aspect !== "both") state.view = aspect;
    const side = target.side || part.side || null;
    part.systems.forEach((system) => state.enabled.add(system));
    const items = (stack || []).map((item) => ({
      id: item.id,
      side: item.side || null,
      sex: item.sex || sex,
      depth: item.depth == null ? (window.ATLAS_PARTS[item.id]?.depth || 0) : item.depth,
      ghost: !!item.ghost,
    }));
    state.selection = { id: target.id, side, sex, stack: items, shared: !!target.shared };
    if (!items.some((item) => item.id === target.id && (item.side || null) === side)) {
      state.selection.stack.push({
        id: target.id,
        side,
        sex,
        depth: part.depth || 0,
        ghost: false,
      });
    }
    if (state.view !== viewBefore && window.ATLAS_VIEW) window.ATLAS_VIEW.setAspect(state.view);
    if (state.sex !== before || !document.querySelector(".body-view")) syncCards();
    else {
      applyVisibility();
      applySelectionVisuals();
      if (state.view !== viewBefore) {
        document.querySelectorAll(".figure-card").forEach((card) => describeCard(card, state.view));
      }
    }
    renderChips();
    updateSexButtons();
    zoomToSelection(opts && opts.instant ? false : true);
    renderInspector();
    setHash();
    if (opts && opts.focus) document.getElementById("plate-title")?.focus();
  }

  function setSex(sex) {
    if (state.sex === sex) return;
    state.sex = sex;
    if (state.selection) {
      const part = window.ATLAS_PARTS[state.selection.id];
      const need = part.sex || "both";
      if (need !== "both" && sex !== "both" && sex !== need) state.selection = null;
      else if (sex !== "both") state.selection.sex = sex;
      else if (need !== "both") state.selection.sex = need;
    }
    syncCards();
    renderChips();
    updateSexButtons();
    if (state.selection) zoomToSelection(false);
    renderInspector();
    setHash();
  }

  function setView(view) {
    if (state.view === view || (view !== "anterior" && view !== "posterior")) return;
    state.view = view;
    if (state.selection) {
      const aspect = window.ATLAS_PARTS[state.selection.id].aspect || "both";
      if (aspect !== "both" && aspect !== view) state.selection = null;
    }
    updateViewButtons();
    document.querySelectorAll(".figure-card").forEach((card) => describeCard(card, state.view));
    if (window.ATLAS_VIEW) window.ATLAS_VIEW.setAspect(state.view);
    if (state.selection) zoomToSelection();
    else renderInspector();
    setHash();
  }

  function afterFilter() {
    const drop = state.selection && !partEnabled(state.selection.id);
    if (drop) {
      state.selection = null;
      unzoom();
    }
    applyVisibility();
    applySelectionVisuals();
    renderChips();
    if (drop || !state.selection) renderInspector();
    if (drop) setHash();
  }

  function toggleSystem(id) {
    if (state.enabled.has(id)) state.enabled.delete(id);
    else state.enabled.add(id);
    afterFilter();
  }

  function soloSystem(id) {
    state.enabled = new Set([id]);
    afterFilter();
  }

  function partsAt(event) {
    const seen = new Set();
    const found = [];
    document.elementsFromPoint(event.clientX, event.clientY).forEach((el) => {
      if (!el.closest) return;
      const part = el.closest(".part");
      if (!part) return;
      const svg = part.closest("svg");
      if (!svg) return;
      const sideEl = el.closest("[data-side]");
      const side = sideEl && part.contains(sideEl) ? sideEl.dataset.side : null;
      const key = `${svg.dataset.sex}|${part.dataset.id}|${side || ""}`;
      if (seen.has(key)) return;
      seen.add(key);
      const opacity = Number(part.style.opacity || part.dataset.baseOpacity || 1);
      if (opacity < 0.04) return;
      found.push({
        id: part.dataset.id,
        side,
        sex: svg.dataset.sex,
        depth: Number(part.dataset.depth || 0),
        ghost: part.dataset.ghost === "1" && opacity < 0.5,
        el: sideEl && part.contains(sideEl) ? sideEl : part,
        group: part,
      });
    });
    if (!found.length) return [];
    const sex = found[0].sex;
    return found.filter((item) => item.sex === sex);
  }

  function pick(stack) {
    return stack.find((item) => item.id !== "skin" && !item.ghost)
      || stack.find((item) => item.id !== "skin")
      || stack[0]
      || null;
  }

  function hideTip() {
    tip.hidden = true;
    document.querySelectorAll(".is-hot").forEach((node) => node.classList.remove("is-hot"));
  }

  function showTip(event, chosen, stack) {
    const part = window.ATLAS_PARTS[chosen.id];
    if (!part) return hideTip();
    const others = stack
      .filter((item) => !(item.id === chosen.id && item.side === chosen.side))
      .sort((a, b) => a.depth - b.depth)
      .slice(0, 3)
      .map((item) => displayName(item.id, item.side));
    const sideBit = chosen.side
      ? (chosen.side === "patient-right" ? "Dexter" : "Sinister")
      : "";
    const key = `${chosen.id}|${chosen.side || ""}|${others.join("|")}`;
    if (key !== tipKey) {
      tipKey = key;
      tipKicker.textContent = `${systemNames(part.systems)}${sideBit ? " · " + sideBit : ""}`;
      tipTitle.textContent = displayName(chosen.id, chosen.side);
      tipLatin.textContent = part.latin || "";
      tipOverview.textContent = part.overview || "";
      tipAlso.hidden = others.length === 0;
      if (others.length) tipAlso.textContent = `Also in this line of sight: ${others.join(", ")}`;
      tip.hidden = false;
      tipW = tip.offsetWidth;
      tipH = tip.offsetHeight;
    } else if (tip.hidden) tip.hidden = false;
    const stage = document.querySelector(".stage");
    const rect = stage.getBoundingClientRect();
    let x = event.clientX - rect.left + 16;
    let y = event.clientY - rect.top + 18;
    const maxX = Math.max(8, stage.clientWidth - tipW - 8);
    const maxY = Math.max(8, stage.clientHeight - tipH - 8);
    if (x > maxX) x = event.clientX - rect.left - tipW - 12;
    tip.style.transform = `translate3d(${Math.max(8, Math.min(x, maxX))}px, ${Math.max(8, Math.min(y, maxY))}px, 0)`;
    if (chosen.el) {
      document.querySelectorAll(".is-hot").forEach((node) => node.classList.remove("is-hot"));
      chosen.el.classList.add("is-hot");
    }
  }

  let raf = 0;
  let lastEvent = null;
  figures.addEventListener("pointermove", (event) => {
    if (event.target.closest(".body-view")) return;
    if (event.pointerType === "touch") return;
    lastEvent = event;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      if (!lastEvent) return;
      const stack = partsAt(lastEvent);
      const chosen = pick(stack);
      if (!chosen) {
        hideTip();
        return;
      }
      showTip(lastEvent, chosen, stack);
    });
  });
  figures.addEventListener("pointerleave", hideTip);

  figures.addEventListener("atlas-aspect", (event) => {
    const view = event.detail;
    const card = event.target.closest(".figure-card");
    if (card) describeCard(card, view);
    if (state.view === view) return;
    state.view = view;
    if (state.selection) {
      const locked = window.ATLAS_PARTS[state.selection.id].aspect || "both";
      if (locked !== "both" && locked !== view) {
        state.selection = null;
        applyVisibility();
        applySelectionVisuals();
      }
    }
    updateViewButtons();
    if (state.selection) zoomToSelection();
    else renderInspector();
    setHash();
  });

  figures.addEventListener("click", (event) => {
    if (event.target.closest(".whole")) {
      unzoom();
      return;
    }
    if (event.target.closest(".body-view")) return;
    if (!event.target.closest(".body-svg")) return;
    const stack = partsAt(event);
    const chosen = pick(stack);
    if (!chosen) return;
    select(chosen, stack);
  });

  figures.addEventListener("atlas-pick", (event) => {
    const detail = event.detail;
    if (!detail) return;
    select({ id: detail.id, side: detail.side, sex: detail.sex, shared: !!detail.shared }, detail.stack || []);
  });

  figures.addEventListener("atlas-hover", (event) => {
    const detail = event.detail;
    if (!detail) {
      hideTip();
      return;
    }
    showTip(detail.event, detail.chosen, detail.stack || []);
  });

  document.getElementById("sexes").addEventListener("click", (event) => {
    const button = event.target.closest("[data-sex]");
    if (button) setSex(button.dataset.sex);
  });

  systemsEl.addEventListener("dblclick", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;
    event.preventDefault();
    soloSystem(chip.dataset.system);
  });

  systemsEl.addEventListener("click", (event) => {
    if (event.target.closest("[data-all]")) {
      state.enabled = new Set(window.ATLAS_SYSTEMS.map((system) => system.id));
      afterFilter();
      return;
    }
    const chip = event.target.closest(".chip");
    if (!chip) return;
    if (event.detail > 1) soloSystem(chip.dataset.system);
    else toggleSystem(chip.dataset.system);
  });

  inspector.addEventListener("click", (event) => {
    if (event.target.closest("[data-close]")) {
      clearSelection();
      return;
    }
    const systemButton = event.target.closest("[data-system]");
    if (systemButton) {
      if (event.detail > 1) soloSystem(systemButton.dataset.system);
      else toggleSystem(systemButton.dataset.system);
      return;
    }
    const go = event.target.closest("[data-goto]");
    if (!go) return;
    const id = go.dataset.goto;
    const part = window.ATLAS_PARTS[id];
    if (!part) return;
    const side = go.dataset.side || null;
    const preferred = go.dataset.sex || null;
    const stack = state.selection ? state.selection.stack : [];
    select({ id, side, sex: preferred }, stack);
  });

  function card(color, inner) {
    return `<div class="inspector-card"><div class="accent" style="background:${color}"></div><div class="inspector-body">${inner}</div></div>`;
  }

  function renderInspector() {
    const sel = state.selection;
    if (!sel) {
      inspector.innerHTML = card("#e4c27a", `
        <p class="sys-kicker">${state.view === "posterior" ? "Dorsal" : "Ventral"}</p>
        <h2 id="plate-title" tabindex="-1">${state.view === "posterior" ? "Posterior aspect" : "Anterior aspect"}</h2>
        <p class="panel-overview">${state.view === "posterior"
          ? "The dorsal surface of the adult. Spinous processes and the kidneys lie near this surface. The scapulae and the superficial muscles of the shared wall cover them on both plates. Each plate keeps its own pelvis and reproductive organs."
          : "The ventral surface of the adult. The sternum and the abdominal organs lie near this surface, with the lungs on either side of the mediastinum. Both plates show the shared rib cage, limbs, and muscles. The female plate keeps the HuBMAP organs. The male plate keeps the named vessels."}</p>
        <h3>Organ systems</h3>
        <ul class="intro-list">
          ${window.ATLAS_SYSTEMS.map((system) => `
            <li>
              <button type="button" class="sys-link" data-system="${system.id}" style="border-left-color:${system.color}">
                <span><b>${esc(system.name)}</b><span>${esc(system.blurb)}</span></span>
              </button>
            </li>`).join("")}
        </ul>`);
      return;
    }

    const part = window.ATLAS_PARTS[sel.id];
    const color = systemById(part.systems[0])?.color || "#e4c27a";
    const stats = (part.stats || []).map((stat) => `
      <div class="stat"><b>${esc(stat.value)}</b><span>${esc(stat.label)}</span></div>`).join("");
    const sections = (part.sections || []).map((section) => {
      const paragraphs = (section.paragraphs || []).map((paragraph) => `<p>${esc(paragraph)}</p>`).join("");
      const list = section.list
        ? `<ul>${section.list.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`
        : "";
      return `<section class="prose"><h3>${esc(section.title)}</h3>${paragraphs}${list}</section>`;
    }).join("");
    const los = [...sel.stack].sort((a, b) => a.depth - b.depth);
    const losHtml = los.length > 1 ? `
      <h3>In this line of sight</h3>
      <div class="los">
        ${los.map((item) => {
          const current = item.id === sel.id && (item.side || null) === (sel.side || null);
          return `<button type="button" data-goto="${esc(item.id)}" ${item.side ? `data-side="${esc(item.side)}"` : ""} data-sex="${esc(item.sex)}" class="${current ? "is-current" : ""}">${esc(displayName(item.id, item.side))}</button>`;
        }).join("")}
      </div>` : "";
    const related = (part.related || []).filter((id) => window.ATLAS_PARTS[id]).map((id) => {
      const other = window.ATLAS_PARTS[id];
      const sex = other.sex && other.sex !== "both" ? other.sex : sel.sex;
      return `<button type="button" data-goto="${esc(id)}" data-sex="${esc(sex)}">${esc(other.name)}</button>`;
    }).join("");
    const sideName = sel.side === "patient-right" ? "Dexter" : sel.side === "patient-left" ? "Sinister" : "";
    const wallSystem = part.systems && (part.systems[0] === "skeletal" || part.systems[0] === "muscular");
    const sharedWall = !!(sel.shared && wallSystem);

    inspector.innerHTML = card(color, `
      <p class="sys-kicker">${esc(systemNames(part.systems))} · ${esc(sel.sex)} · ${esc(state.view)}${sideName ? " · " + sideName : ""}</p>
      <h2 id="plate-title" tabindex="-1">${esc(displayName(sel.id, sel.side))}</h2>
      <p class="latin-line">${esc(part.latin || "")}</p>
      <p class="panel-overview">${esc(part.overview)}</p>
      ${sharedWall ? `<p class="panel-overview">Shared body wall. This mesh is drawn on both plates. On the female plate it is fitted to the HuBMAP organs.</p>` : ""}
      ${stats ? `<div class="stats">${stats}</div>` : ""}
      ${losHtml}
      ${sections}
      ${related ? `<h3>Related structures</h3><div class="related">${related}</div>` : ""}
      <div class="panel-tools"><button type="button" class="texty" data-close="1">Close</button></div>
      <p class="disclaimer">Typical adult teaching values where a written account exists. A study aid: it cannot diagnose or treat illness.</p>`);
    inspector.querySelector(".inspector-card").scrollTop = 0;
  }

  function hideResults() {
    results.hidden = true;
    searchInput.setAttribute("aria-expanded", "false");
  }

  function buildSearchIndex() {
    const aliasOf = new Map();
    const groups = window.ATLAS_ALIAS || {};
    Object.keys(groups).forEach((key) => {
      groups[key].forEach((item) => {
        let list = aliasOf.get(item.id);
        if (!list) {
          list = [];
          aliasOf.set(item.id, list);
        }
        list.push(key.toLowerCase());
      });
    });
    searchIndex = Object.entries(window.ATLAS_PARTS).map(([id, part]) => {
      const aliases = (part.aliases || []).map((alias) => alias.toLowerCase());
      const keys = aliasOf.get(id) || [];
      return {
        id,
        part,
        name: part.name.toLowerCase(),
        latin: (part.latin || "").toLowerCase(),
        aliases,
        keys,
        blob: [part.name, part.latin || "", ...(part.aliases || []), ...keys, ...(part.systems || [])].join(" ").toLowerCase(),
      };
    });
  }

  function searchMatches(query) {
    const q = query.trim().toLowerCase();
    if (!q || !searchIndex.length) return [];
    const found = [];
    for (const entry of searchIndex) {
      if (!entry.blob.includes(q)) continue;
      let score = 4;
      if (entry.name === q || entry.keys.includes(q)) score = 0;
      else if (entry.name.startsWith(q)) score = 1;
      else if (entry.latin.startsWith(q)) score = 2;
      else if (entry.aliases.some((alias) => alias.startsWith(q))) score = 3;
      found.push({ id: entry.id, part: entry.part, score });
    }
    found.sort((a, b) => a.score - b.score || a.part.name.localeCompare(b.part.name));
    return found.slice(0, 8);
  }

  function renderResults() {
    const matches = searchMatches(searchInput.value);
    if (!matches.length) {
      hideResults();
      return;
    }
    hi = Math.min(hi, matches.length - 1);
    results.innerHTML = matches.map((match, index) => {
      const sideWord = match.part.side === "patient-right" ? "dexter" : match.part.side === "patient-left" ? "sinister" : "";
      const badge = [match.part.sex && match.part.sex !== "both" ? match.part.sex : "both plates", sideWord].filter(Boolean).join(" · ");
      return `<li class="${index === hi ? "is-hi" : ""}" role="option"><button type="button" data-pick="${esc(match.id)}"><b>${esc(match.part.name)}</b><span class="sub">${esc(match.part.latin || "")} · ${esc(systemNames(match.part.systems))} · ${esc(badge)}</span></button></li>`;
    }).join("");
    results.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");
  }

  searchInput.addEventListener("input", () => {
    hi = 0;
    renderResults();
  });

  searchInput.addEventListener("keydown", (event) => {
    const items = [...results.querySelectorAll("[data-pick]")];
    if (event.key === "ArrowDown" && items.length) {
      hi = Math.min(items.length - 1, hi + 1);
      renderResults();
      event.preventDefault();
    } else if (event.key === "ArrowUp" && items.length) {
      hi = Math.max(0, hi - 1);
      renderResults();
      event.preventDefault();
    } else if (event.key === "Enter") {
      const pickId = items[hi]?.dataset.pick;
      if (pickId) {
        event.preventDefault();
        chooseSearch(pickId);
      }
    } else if (event.key === "Escape") {
      hideResults();
    }
  });

  results.addEventListener("click", (event) => {
    const button = event.target.closest("[data-pick]");
    if (button) chooseSearch(button.dataset.pick);
  });

  function chooseSearch(id) {
    hideResults();
    searchInput.value = "";
    const part = window.ATLAS_PARTS[id];
    const sex = part.sex && part.sex !== "both" ? part.sex : (state.sex === "both" ? "female" : state.sex);
    const system = part.systems && part.systems[0];
    const shared = part.sex === "both" && (part.source === "bodyparts3d" || part.source === "z-anatomy") && (system === "skeletal" || system === "muscular");
    select({ id, side: part.side || null, sex, shared }, [], { focus: true });
  }

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search")) hideResults();
  });

  document.addEventListener("keydown", (event) => {
    const typing = document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA");
    if (event.key === "/" && !typing) {
      event.preventDefault();
      searchInput.focus();
      return;
    }
    if (event.key === "Escape" && !typing) {
      const zoomed = document.querySelector(".whole:not([hidden])");
      if (zoomed) unzoom();
      else if (state.selection) clearSelection();
    }
  });

  function setHash() {
    let next = "";
    if (state.selection) {
      next = `${state.selection.sex}/${state.view}/${state.selection.id}${state.selection.side ? `/${state.selection.side}` : ""}`;
    } else {
      const bits = [];
      if (state.sex !== "both") bits.push(state.sex);
      if (state.view !== "anterior") bits.push(state.view);
      next = bits.join("/");
    }
    const current = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (current === next) return;
    hashLock = true;
    const url = next ? `#${next}` : location.pathname + location.search;
    history.replaceState(null, "", url);
    hashLock = false;
  }

  function applyHash() {
    const raw = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (!raw) {
      syncCards();
      renderInspector();
      return;
    }
    let sex = state.sex;
    let view = "anterior";
    let id = "";
    let side = "";
    raw.split("/").forEach((bit) => {
      if (bit === "female" || bit === "male" || bit === "both") sex = bit;
      else if (bit === "anterior" || bit === "posterior") view = bit;
      else if (bit === "patient-right" || bit === "patient-left") side = bit;
      else if (window.ATLAS_PARTS[bit] || (window.ATLAS_ALIAS && window.ATLAS_ALIAS[bit])) id = bit;
    });
    if (id && window.atlasResolve) {
      const resolved = window.atlasResolve(id, side, sex);
      if (resolved) {
        id = resolved.id;
        side = resolved.side || "";
        if (sex === "both" && resolved.sex) sex = resolved.sex;
      }
    }
    state.sex = sex;
    state.view = view;
    syncCards();
    updateSexButtons();
    updateViewButtons();
    if (id) {
      const part = window.ATLAS_PARTS[id];
      const preferred = side ? sex : (part.sex && part.sex !== "both" ? part.sex : sex);
      select({ id, side: side || null, sex: preferred === "both" ? "female" : preferred }, [], { instant: true });
    } else renderInspector();
  }

  window.addEventListener("hashchange", () => {
    if (!hashLock) applyHash();
  });

  renderChips();
  updateSexButtons();
  updateViewButtons();
  renderInspector();
  if (!location.hash) syncCards();
  window.ATLAS_CATALOG_READY.then(() => {
    buildSearchIndex();
    if (location.hash) applyHash();
    else if (searchInput.value) renderResults();
  }).catch((err) => console.error(err));
  window.mountAds();
})();
