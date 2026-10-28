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

  function updateViewButtons() {
    document.querySelectorAll("[data-view]").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.view === state.view ? "true" : "false");
    });
    const plateView = document.querySelector(".plate-view");
    if (plateView) plateView.textContent = state.view === "posterior" ? "Posterior aspect" : "Anterior aspect";
  }

  function renderFigures() {
    const sexes = state.sex === "both" ? ["female", "male"] : [state.sex];
    const marks = orientMarks();
    figures.dataset.count = String(sexes.length);
    figures.innerHTML = sexes.map((sex) => {
      const label = sex === "female" ? "Female" : "Male";
      const aspect = state.view === "posterior" ? "posterior" : "anterior";
      return `<article class="figure-card" data-sex="${sex}">
        <div class="orient">
          <span>${marks[0]}</span>
          <div class="seg seg-aspect" role="group" aria-label="Aspect">
            <button type="button" data-view="anterior" aria-pressed="${state.view === "anterior"}">Anterior</button>
            <button type="button" data-view="posterior" aria-pressed="${state.view === "posterior"}">Posterior</button>
          </div>
          <span>${marks[2]}</span>
        </div>
        <button type="button" class="whole" hidden>Whole body</button>
        ${window.renderBody(sex, state.view)}
        <p class="caption">${label} · adult · ${aspect}</p>
      </article>`;
    }).join("");
    applyVisibility();
    applySelectionVisuals();
    updateViewButtons();
  }

  function applyVisibility() {
    const solo = state.enabled.size === 1;
    document.querySelectorAll(".body-svg .part").forEach((part) => {
      const systems = part.dataset.systems.split(" ").filter(Boolean);
      const on = systems.some((system) => state.enabled.has(system));
      const base = Number(part.dataset.baseOpacity || 1);
      const svg = part.closest("svg");
      const selected = state.selection
        && part.dataset.id === state.selection.id
        && svg.dataset.sex === state.selection.sex;
      let opacity = 0;
      if (selected) opacity = 1;
      else if (on) opacity = solo ? 1 : base;
      if (state.selection && !selected && opacity > 0) opacity *= 0.42;
      part.style.opacity = String(opacity);
      part.style.pointerEvents = opacity < 0.04 ? "none" : "auto";
    });
  }

  function applySelectionVisuals() {
    document.querySelectorAll(".is-selected").forEach((node) => node.classList.remove("is-selected"));
    document.querySelectorAll(".figure-card").forEach((card) => card.classList.remove("is-quiet"));
    const sel = state.selection;
    if (!sel) return;
    const svg = document.querySelector(`.body-svg[data-sex="${sel.sex}"]`);
    if (!svg) return;
    const group = svg.querySelector(`.part[data-id="${CSS.escape(sel.id)}"]`);
    if (group) {
      group.classList.add("is-selected");
      if (sel.side) group.querySelector(`[data-side="${sel.side}"]`)?.classList.add("is-selected");
    }
    if (state.sex === "both") {
      document.querySelectorAll(".figure-card").forEach((card) => {
        if (card.dataset.sex !== sel.sex) card.classList.add("is-quiet");
      });
    }
  }

  function zoomToSelection(animate) {
    const sel = state.selection;
    if (!sel) return;
    const svg = document.querySelector(`.body-svg[data-sex="${sel.sex}"]`);
    if (!svg) return;
    const group = svg.querySelector(`.part[data-id="${CSS.escape(sel.id)}"]`);
    if (!group) return;
    const el = sel.side ? (group.querySelector(`[data-side="${sel.side}"]`) || group) : group;
    let box;
    try {
      box = el.getBBox();
    } catch (err) {
      return;
    }
    if (!box || (!box.width && !box.height)) return;
    const pad = 40;
    let x = box.x - pad;
    let y = box.y - pad;
    let w = box.width + pad * 2;
    let h = box.height + pad * 2;
    const minW = 180;
    const minH = 200;
    if (w < minW) {
      x -= (minW - w) / 2;
      w = minW;
    }
    if (h < minH) {
      y -= (minH - h) / 2;
      h = minH;
    }
    if (w / h < 0.82) {
      const next = h * 0.82;
      x -= (next - w) / 2;
      w = next;
    }
    svg.dataset.zoomed = "1";
    const card = svg.closest(".figure-card");
    card.querySelector(".whole").hidden = false;
    const to = { x, y, w, h };
    if (animate === false || reduced) setVB(svg, to);
    else animateViewBox(svg, to);
  }

  function unzoom() {
    document.querySelectorAll(".body-svg").forEach((svg) => {
      if (svg.dataset.zoomed === "1") {
        svg.dataset.zoomed = "0";
        const home = parseVB(svg.dataset.home);
        if (reduced) setVB(svg, home);
        else animateViewBox(svg, home);
      }
      const card = svg.closest(".figure-card");
      card.querySelector(".whole").hidden = true;
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
    part.systems.forEach((system) => state.enabled.add(system));
    const items = (stack || []).map((item) => ({
      id: item.id,
      side: item.side || null,
      sex: item.sex || sex,
      depth: item.depth == null ? (window.ATLAS_PARTS[item.id]?.depth || 0) : item.depth,
      ghost: !!item.ghost,
    }));
    state.selection = { id: target.id, side: target.side || null, sex, stack: items };
    if (!items.some((item) => item.id === target.id && item.side === (target.side || null))) {
      state.selection.stack.push({
        id: target.id,
        side: target.side || null,
        sex,
        depth: part.depth || 0,
        ghost: false,
      });
    }
    if (state.sex !== before || state.view !== viewBefore || !document.querySelector(".body-svg")) renderFigures();
    else {
      applyVisibility();
      applySelectionVisuals();
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
    renderFigures();
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
    renderFigures();
    if (state.selection) zoomToSelection(false);
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
    tip.innerHTML = `
      <p class="tip-kicker">${esc(systemNames(part.systems))}${sideBit ? " · " + esc(sideBit) : ""}</p>
      <h3>${esc(displayName(chosen.id, chosen.side))}</h3>
      <p class="latin">${esc(part.latin || "")}</p>
      <p class="overview">${esc(part.overview)}</p>
      ${others.length ? `<p class="also">Also in this line of sight: ${esc(others.join(", "))}</p>` : ""}`;
    tip.hidden = false;
    const stage = document.querySelector(".stage");
    const rect = stage.getBoundingClientRect();
    let x = event.clientX - rect.left + 16;
    let y = event.clientY - rect.top + 18;
    const maxX = Math.max(8, stage.clientWidth - tip.offsetWidth - 8);
    const maxY = Math.max(8, stage.clientHeight - tip.offsetHeight - 8);
    if (x > maxX) x = event.clientX - rect.left - tip.offsetWidth - 12;
    tip.style.left = `${Math.max(8, Math.min(x, maxX))}px`;
    tip.style.top = `${Math.max(8, Math.min(y, maxY))}px`;
    document.querySelectorAll(".is-hot").forEach((node) => node.classList.remove("is-hot"));
    chosen.el.classList.add("is-hot");
  }

  let raf = 0;
  let lastEvent = null;
  figures.addEventListener("pointermove", (event) => {
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

  figures.addEventListener("click", (event) => {
    const viewButton = event.target.closest("[data-view]");
    if (viewButton) {
      setView(viewButton.dataset.view);
      return;
    }
    if (event.target.closest(".whole")) {
      unzoom();
      return;
    }
    if (!event.target.closest(".body-svg")) return;
    const stack = partsAt(event);
    const chosen = pick(stack);
    if (!chosen) return;
    select(chosen, stack);
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
          ? "The dorsal surface of the adult. Spinous processes, scapulae, and kidneys lie near this surface. Trapezius, latissimus dorsi, gluteus maximus, and the hamstrings cover them."
          : "The ventral surface of the adult. The sternum, heart, and abdominal viscera lie near this surface, with the lungs on either side of the mediastinum."}</p>
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

    inspector.innerHTML = card(color, `
      <p class="sys-kicker">${esc(systemNames(part.systems))} · ${esc(sel.sex)} · ${esc(state.view)}${sideName ? " · " + sideName : ""}</p>
      <h2 id="plate-title" tabindex="-1">${esc(displayName(sel.id, sel.side))}</h2>
      <p class="latin-line">${esc(part.latin || "")}</p>
      <p class="panel-overview">${esc(part.overview)}</p>
      ${stats ? `<div class="stats">${stats}</div>` : ""}
      ${losHtml}
      ${sections}
      ${related ? `<h3>Related structures</h3><div class="related">${related}</div>` : ""}
      <div class="panel-tools"><button type="button" class="texty" data-close="1">Close</button></div>
      <p class="disclaimer">Typical adult teaching values. This plate is simplified and not to scale. A study aid: it cannot diagnose or treat illness.</p>`);
    inspector.querySelector(".inspector-card").scrollTop = 0;
  }

  function hideResults() {
    results.hidden = true;
    searchInput.setAttribute("aria-expanded", "false");
  }

  function searchMatches(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return Object.entries(window.ATLAS_PARTS).map(([id, part]) => {
      const name = part.name.toLowerCase();
      const latin = (part.latin || "").toLowerCase();
      const aliases = part.aliases || [];
      const blob = [name, latin, ...aliases.map((alias) => alias.toLowerCase()), ...(part.systems || [])].join(" ");
      if (!blob.includes(q)) return null;
      let score = 4;
      if (name === q) score = 0;
      else if (name.startsWith(q)) score = 1;
      else if (latin.startsWith(q)) score = 2;
      else if (aliases.some((alias) => alias.toLowerCase().startsWith(q))) score = 3;
      return { id, part, score };
    }).filter(Boolean).sort((a, b) => a.score - b.score || a.part.name.localeCompare(b.part.name)).slice(0, 8);
  }

  function renderResults() {
    const matches = searchMatches(searchInput.value);
    if (!matches.length) {
      hideResults();
      return;
    }
    hi = Math.min(hi, matches.length - 1);
    results.innerHTML = matches.map((match, index) => {
      const badge = match.part.sex && match.part.sex !== "both" ? match.part.sex : "both plates";
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
    select({ id, side: null, sex }, [], { focus: true });
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
      const zoomed = document.querySelector('.body-svg[data-zoomed="1"]');
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
      renderFigures();
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
      else if (window.ATLAS_PARTS[bit]) id = bit;
    });
    state.sex = sex;
    state.view = view;
    renderFigures();
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
  if (location.hash) applyHash();
  else {
    renderFigures();
    renderInspector();
  }
  window.mountAds();
})();
