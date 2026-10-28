/* Schematic anterior plates.
   Patient's right is drawn on the viewer's left, as in clinical imaging.
   Coordinates are shared by both sexes; shoulder, waist, hip, and the
   reproductive organs change. Organs overlap on purpose: a flat plate
   stacks structures that sit one behind another in a real body.
*/
(function () {
  const HOME = "-76 0 552 1020";

  function metrics(sex) {
    const female = sex === "female";
    return {
      cx: 200,
      headRx: female ? 38 : 44,
      headRy: female ? 50 : 54,
      headCy: 76,
      neckW: female ? 18 : 30,
      shoulder: female ? 102 : 150,
      torsoTop: female ? 86 : 102,
      waist: female ? 70 : 94,
      hip: female ? 126 : 90,
      handX: female ? 156 : 168,
      breast: female,
    };
  }

  function pose(sex) {
    const m = metrics(sex);
    const c = m.cx;
    const lerp = (a, b, t) => a + (b - a) * t;
    const shoulder = (sign) => [c + sign * m.shoulder * 0.78, 198];
    const hand = (sign) => [c + sign * m.handX, 528];
    const elbow = (sign) => {
      const s = shoulder(sign);
      const h = hand(sign);
      return [lerp(s[0], h[0], 0.46), lerp(s[1], h[1], 0.46)];
    };
    const wrist = (sign) => {
      const e = elbow(sign);
      const h = hand(sign);
      return [lerp(e[0], h[0], 0.62), lerp(e[1], h[1], 0.62)];
    };
    const hip = (sign) => [c + sign * Math.max(m.hip * 0.42, 52), 598];
    const ankle = (sign) => [c + sign * 46, 868];
    const knee = (sign) => {
      const h = hip(sign);
      const a = ankle(sign);
      return [lerp(h[0], a[0], 0.52) + sign * 2, lerp(h[1], a[1], 0.5)];
    };
    return { m, c, shoulder, hand, elbow, wrist, hip, ankle, knee };
  }

  function n(v) {
    return Math.round(v * 10) / 10;
  }

  function line(x1, y1, x2, y2, w, color) {
    return `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  }

  function ell(cx, cy, rx, ry, attrs) {
    return `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" ${attrs}/>`;
  }

  function ellipsePath(cx, cy, rx, ry) {
    return `M ${n(cx - rx)} ${n(cy)} A ${n(rx)} ${n(ry)} 0 1 0 ${n(cx + rx)} ${n(cy)} A ${n(rx)} ${n(ry)} 0 1 0 ${n(cx - rx)} ${n(cy)} Z`;
  }

  function group(id, inner, plateOverride) {
    const p = window.ATLAS_PARTS[id];
    if (!p) return "";
    const plate = plateOverride == null ? (p.plate == null ? 1 : p.plate) : plateOverride;
    return `<g class="part" data-id="${id}" data-systems="${p.systems.join(" ")}" data-depth="${p.depth}" data-base-opacity="${plate}" data-ghost="${p.ghost ? "1" : "0"}" style="opacity:${plate}">${inner}</g>`;
  }

  function pair(id, patientRight, patientLeft, plateOverride) {
    return group(
      id,
      `<g data-side="patient-right">${patientRight}</g><g data-side="patient-left">${patientLeft}</g>`,
      plateOverride
    );
  }

  function filled(d, fill) {
    return `<path d="${d}" fill="${fill}" stroke="rgba(255,246,236,0.32)" stroke-width="1" stroke-linejoin="round"/>`;
  }

  function hitStroke(d, width) {
    return `<path d="${d}" fill="none" stroke="transparent" stroke-width="${width}" stroke-linecap="round"/>`;
  }

  const FINGERS = [
    { id: "index-finger", spread: 1.15, len: 36, w: 7.2 },
    { id: "middle-finger", spread: 0.38, len: 42, w: 7.6 },
    { id: "ring-finger", spread: -0.38, len: 36, w: 7.0 },
    { id: "little-finger", spread: -1.15, len: 28, w: 5.8 },
  ];

    const TOES = [
    { id: "hallux", slot: 2.05, len: 16, w: 6.6 },
    { id: "second-toe", slot: 0.7, len: 13, w: 4.3 },
    { id: "third-toe", slot: -0.35, len: 12, w: 3.9 },
    { id: "fourth-toe", slot: -1.3, len: 11, w: 3.5 },
    { id: "little-toe", slot: -2.2, len: 9, w: 3.1 },
  ];

  function handFrame(P, sign) {
    const wrist = P.wrist(sign);
    const hand = P.hand(sign);
    const dx = hand[0] - wrist[0];
    const dy = hand[1] - wrist[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    let lx = -uy;
    let ly = ux;
    if (lx * sign < 0) {
      lx = -lx;
      ly = -ly;
    }
    return { hand, ux, uy, lx, ly };
  }

  function fingerGeom(P, sign, spec) {
    const f = handFrame(P, sign);
    const h = f.hand;
    const bx = h[0] + f.ux * 16 + f.lx * spec.spread * 8.6;
    const by = h[1] + f.uy * 16 + f.ly * spec.spread * 8.6;
    let dx = f.ux + f.lx * spec.spread * 0.08;
    let dy = f.uy + f.ly * spec.spread * 0.08;
    const mag = Math.hypot(dx, dy) || 1;
    dx /= mag;
    dy /= mag;
    return { x1: bx, y1: by, x2: bx + dx * spec.len, y2: by + dy * spec.len, w: spec.w, dx, dy };
  }

  function thumbGeom(P, sign) {
    const f = handFrame(P, sign);
    const h = f.hand;
    const x1 = h[0] + f.ux * 4 + f.lx * 10;
    const y1 = h[1] + f.uy * 4 + f.ly * 10;
    let dx = f.ux * 0.72 + f.lx * 0.7;
    let dy = f.uy * 0.72 + f.ly * 0.7;
    const mag = Math.hypot(dx, dy) || 1;
    dx /= mag;
    dy /= mag;
    const len = 22;
    return { x1, y1, x2: x1 + dx * len, y2: y1 + dy * len, w: 8, dx, dy };
  }

  function toeGeom(P, sign, spec) {
    const an = P.ankle(sign);
    const medial = -sign;
    const x1 = an[0] + medial * spec.slot * 6.8 + sign * 1.2;
    const y1 = an[1] + 52;
    const x2 = x1 + medial * spec.slot * 0.45;
    const y2 = y1 + spec.len;
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    return { x1, y1, x2, y2, w: spec.w, dx: (x2 - x1) / len, dy: (y2 - y1) / len };
  }

  function earPath(m, sign) {
    const y = m.headCy + 4;
    const ax = m.cx + sign * (m.headRx - 10);
    const s = sign;
    const o = ax + s * 18;
    return [
      `M ${n(ax)} ${n(y - 16)}`,
      `C ${n(ax + s * 10)} ${n(y - 22)}, ${n(o)} ${n(y - 14)}, ${n(o)} ${n(y - 2)}`,
      `C ${n(o)} ${n(y + 12)}, ${n(ax + s * 12)} ${n(y + 20)}, ${n(ax + s * 2)} ${n(y + 16)}`,
      `Q ${n(ax - s * 1)} ${n(y + 12)}, ${n(ax + s * 2)} ${n(y + 6)}`,
      `C ${n(ax + s * 8)} ${n(y + 4)}, ${n(ax + s * 8)} ${n(y - 6)}, ${n(ax + s * 2)} ${n(y - 8)}`,
      `C ${n(ax)} ${n(y - 10)}, ${n(ax)} ${n(y - 14)}, ${n(ax)} ${n(y - 16)} Z`,
    ].join(" ");
  }

  function torsoPath(m) {
    const c = m.cx;
    const top = m.torsoTop;
    const w = m.waist;
    const h = m.hip;
    return [
      `M ${c} 148`,
      `C ${c + 22} 148, ${c + top} 166, ${c + top + 4} 196`,
      `C ${c + top + 8} 246, ${c + top - 6} 300, ${c + w + 10} 352`,
      `C ${c + w + 2} 408, ${c + w} 448, ${c + w + 6} 492`,
      `C ${c + h - 8} 524, ${c + h} 552, ${c + h - 6} 574`,
      `C ${c + h - 24} 592, ${c + 32} 606, ${c + 14} 612`,
      `Q ${c} 620, ${c - 14} 612`,
      `C ${c - 32} 606, ${c - h + 24} 592, ${c - h + 6} 574`,
      `C ${c - h} 552, ${c - h + 8} 524, ${c - w - 6} 492`,
      `C ${c - w} 448, ${c - w - 2} 408, ${c - w - 10} 352`,
      `C ${c - top + 6} 300, ${c - top - 8} 246, ${c - top - 4} 196`,
      `C ${c - top} 166, ${c - 22} 148, ${c} 148 Z`,
    ].join(" ");
  }

  function maskShapes(sex, P, view) {
    const m = P.m;
    const c = m.cx;
    const bits = [];
    bits.push(ell(c, m.headCy, m.headRx, m.headRy, `fill="#fff"`));
    bits.push(`<path d="${earPath(m, -1)}" fill="#fff"/>`);
    bits.push(`<path d="${earPath(m, 1)}" fill="#fff"/>`);
    bits.push(line(c, 112, c, 168, m.neckW, "#fff"));
    bits.push(`<path d="${torsoPath(m)}" fill="#fff"/>`);
    if (m.breast && view !== "posterior") {
      bits.push(ell(c - 70, 236, 36, 28, `fill="#fff"`));
      bits.push(ell(c + 70, 236, 36, 28, `fill="#fff"`));
      bits.push(ell(c - 62, 262, 42, 32, `fill="#fff"`));
      bits.push(ell(c + 62, 262, 42, 32, `fill="#fff"`));
    }
    if (view === "posterior") {
      const gx = Math.max(m.hip * 0.42, 48);
      bits.push(ell(c - gx, 648, 40, 46, `fill="#fff"`));
      bits.push(ell(c + gx, 648, 40, 46, `fill="#fff"`));
    }
    [-1, 1].forEach((sign) => {
      const s = P.shoulder(sign);
      const e = P.elbow(sign);
      const w = P.wrist(sign);
      const h = P.hand(sign);
      bits.push(ell(c + sign * m.shoulder, 196, 28, 32, `fill="#fff"`));
      bits.push(line(s[0], s[1], e[0], e[1], 42, "#fff"));
      bits.push(line(e[0], e[1], w[0], w[1], 30, "#fff"));
      bits.push(ell(h[0], h[1] + 6, 16, 15, `fill="#fff"`));
      const thumb = thumbGeom(P, sign);
      bits.push(line(thumb.x1, thumb.y1, thumb.x2, thumb.y2, thumb.w, "#fff"));
      FINGERS.forEach((spec) => {
        const g = fingerGeom(P, sign, spec);
        bits.push(line(g.x1, g.y1, g.x2, g.y2, g.w, "#fff"));
      });
      const hp = P.hip(sign);
      const kn = P.knee(sign);
      const an = P.ankle(sign);
      bits.push(line(hp[0], hp[1], kn[0], kn[1], 54, "#fff"));
      bits.push(line(kn[0], kn[1], an[0], an[1], 34, "#fff"));
      bits.push(ell(an[0], an[1] + 8, 16, 16, `fill="#fff"`));
      bits.push(ell(an[0] + sign * 1, an[1] + 30, 17, 16, `fill="#fff"`));
      bits.push(ell(an[0] + sign * 2, an[1] + 50, 20, 12, `fill="#fff"`));
      TOES.forEach((spec) => {
        const g = toeGeom(P, sign, spec);
        bits.push(line(g.x1, g.y1, g.x2, g.y2, g.w, "#fff"));
      });
    });
    return bits.join("");
  }

  function skinHits(sex, P, view) {
    const m = P.m;
    const c = m.cx;
    const bits = [];
    const hit = `fill="transparent"`;
    bits.push(ell(c, m.headCy, m.headRx, m.headRy, hit));
    bits.push(`<path d="${earPath(m, -1)}" fill="transparent"/>`);
    bits.push(`<path d="${earPath(m, 1)}" fill="transparent"/>`);
    bits.push(line(c, 112, c, 168, m.neckW, "transparent"));
    bits.push(`<path d="${torsoPath(m)}" fill="transparent"/>`);
    if (m.breast && view !== "posterior") {
      bits.push(ell(c - 70, 236, 36, 28, hit));
      bits.push(ell(c + 70, 236, 36, 28, hit));
      bits.push(ell(c - 62, 262, 42, 32, hit));
      bits.push(ell(c + 62, 262, 42, 32, hit));
    }
    if (view === "posterior") {
      const gx = Math.max(m.hip * 0.42, 48);
      bits.push(ell(c - gx, 648, 40, 46, hit));
      bits.push(ell(c + gx, 648, 40, 46, hit));
    }
    [-1, 1].forEach((sign) => {
      const s = P.shoulder(sign);
      const e = P.elbow(sign);
      const w = P.wrist(sign);
      const h = P.hand(sign);
      bits.push(line(s[0], s[1], e[0], e[1], 42, "transparent"));
      bits.push(line(e[0], e[1], w[0], w[1], 30, "transparent"));
      bits.push(ell(h[0], h[1] + 6, 16, 15, hit));
      const thumb = thumbGeom(P, sign);
      bits.push(line(thumb.x1, thumb.y1, thumb.x2, thumb.y2, thumb.w + 2, "transparent"));
      FINGERS.forEach((spec) => {
        const g = fingerGeom(P, sign, spec);
        bits.push(line(g.x1, g.y1, g.x2, g.y2, g.w + 2, "transparent"));
      });
      const hp = P.hip(sign);
      const kn = P.knee(sign);
      const an = P.ankle(sign);
      bits.push(line(hp[0], hp[1], kn[0], kn[1], 54, "transparent"));
      bits.push(line(kn[0], kn[1], an[0], an[1], 34, "transparent"));
      bits.push(ell(an[0], an[1] + 8, 16, 16, hit));
      bits.push(ell(an[0] + sign * 1, an[1] + 30, 17, 16, hit));
      bits.push(ell(an[0] + sign * 2, an[1] + 50, 20, 12, hit));
      TOES.forEach((spec) => {
        const g = toeGeom(P, sign, spec);
        bits.push(line(g.x1, g.y1, g.x2, g.y2, g.w + 2, "transparent"));
      });
    });
    return bits.join("");
  }

  function bone(sex) {
    return `url(#${sex}-bone)`;
  }

  function muscle(sex) {
    return `url(#${sex}-muscle)`;
  }

  function spine(sex, posterior) {
    const fill = bone(sex);
    const bits = [];
    let y = 128;
    const spec = [
      [7, 9, 4, posterior ? 18 : 14],
      [12, 11, 4, posterior ? 20 : 16],
      [5, 15, 5, posterior ? 26 : 22],
    ];
    spec.forEach(([count, h, gap, w]) => {
      for (let i = 0; i < count; i++) {
        bits.push(`<rect x="${200 - w / 2}" y="${n(y)}" width="${w}" height="${h}" rx="2" fill="${fill}"/>`);
        if (posterior) {
          bits.push(`<path d="M ${200 - 3} ${n(y + h / 2)} h 6 l 5 0 l -8 4 z" fill="${fill}"/>`);
        }
        y += h + gap;
      }
    });
    return bits.join("");
  }

  function individualRibs(sex) {
    const stroke = bone(sex);
    const m = metrics(sex);
    const edge = m.torsoTop - 6;
    const bits = [];
    for (let i = 0; i < 12; i++) {
      const y0 = 176 + i * 13;
      const slope = 3.2 + i * 0.42;
      const front = i < 7 ? 18 : i < 10 ? 26 + (i - 6) * 10 : edge * 0.62;
      const path = (sign) => {
        const X = (lat) => n(200 + sign * lat);
        const wallY = n(y0 + slope * 0.48);
        const endY = n(y0 + slope);
        return `M ${X(15)} ${n(y0)} Q ${X(edge * 0.62)} ${n(y0 + slope * 0.12)} ${X(edge)} ${wallY} Q ${X((edge + front) / 2)} ${n(y0 + slope * 0.78)} ${X(front)} ${endY}`;
      };
      const draw = (sign) => {
        const d = path(sign);
        const X = (lat) => n(200 + sign * lat);
        const endY = n(y0 + slope);
        let cartilage = "";
        if (i < 7) {
          cartilage = `<path d="M ${X(front)} ${endY} L ${X(11)} ${n(y0 + slope + 1.2)}" fill="none" stroke="#efe0c8" stroke-width="1.8" stroke-linecap="round"/>`;
        } else if (i < 10) {
          cartilage = `<path d="M ${X(front)} ${endY} Q ${X(front - 6)} ${n(endY - 6)} ${X(22)} ${n(176 + 6 * 13 + 3.2 + 6 * 0.42)}" fill="none" stroke="#efe0c8" stroke-width="1.7" stroke-linecap="round"/>`;
        }
        return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round"/>${cartilage}${hitStroke(d, 8)}`;
      };
      bits.push(pair(`rib-${i + 1}`, draw(-1), draw(1)));
    }
    return bits.join("");
  }

  function defs(sex, view) {
    const g = (id, stops) => {
      const inner = stops
        .map(([o, color]) => `<stop offset="${o}" stop-color="${color}"/>`)
        .join("");
      return `<linearGradient id="${sex}-${id}" x1="0" y1="0" x2="1" y2="1">${inner}</linearGradient>`;
    };
    return `
      <filter id="${sex}-edge" x="-12%" y="-8%" width="124%" height="116%" color-interpolation-filters="sRGB">
        <feMorphology in="SourceAlpha" operator="dilate" radius="2.6" result="dilated"/>
        <feComposite in="dilated" in2="SourceAlpha" operator="out" result="ring"/>
        <feFlood flood-color="#f6e4d8" flood-opacity="0.9" result="color"/>
        <feComposite in="color" in2="ring" operator="in"/>
      </filter>
      <filter id="${sex}-plinth" x="-40%" y="-80%" width="180%" height="260%">
        <feGaussianBlur stdDeviation="3"/>
      </filter>
      ${g("bone", [[0, "#f7f1e6"], [1, "#d9cbb6"]])}
      ${g("muscle", [[0, "#e07a84"], [1, "#9d3d4d"]])}
      ${g("nerve", [[0, "#f3e2a0"], [1, "#c6a24e"]])}
      ${g("brain", [[0, "#f6d5cf"], [1, "#d7a29a"]])}
      ${g("heart", [[0, "#f07180"], [1, "#8f2436"]])}
      ${g("lung", [[0, "#f3c9d2"], [1, "#c88898"]])}
      ${g("liver", [[0, "#c47a62"], [1, "#7a3e32"]])}
      ${g("stomach", [[0, "#f0d2a8"], [1, "#c49564"]])}
      ${g("bowel", [[0, "#f0d3b0"], [1, "#d2a57a"]])}
      ${g("colon", [[0, "#e2b07a"], [1, "#b5814e"]])}
      ${g("kidney", [[0, "#e08b80"], [1, "#9a403c"]])}
      ${g("gland", [[0, "#f0d48a"], [1, "#c4923e"]])}
      ${g("lymph", [[0, "#c5d2b8"], [1, "#6e8f72"]])}
      ${g("spleen", [[0, "#b5838a"], [1, "#6e4458"]])}
      ${g("artery", [[0, "#f06868"], [1, "#b4232c"]])}
      ${g("vein", [[0, "#8aa4d6"], [1, "#3e5694"]])}
      ${g("portal", [[0, "#b79ad4"], [1, "#6d4e86"]])}
      ${g("reprof", [[0, "#f0b7c8"], [1, "#c46b8c"]])}
      ${g("reprom", [[0, "#e7d0bc"], [1, "#b89174"]])}
      ${g("bladder", [[0, "#f0c2b4"], [1, "#c48474"]])}
      <mask id="${sex}-body" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="-80" y="-10" width="560" height="1060">
        <rect x="-80" y="-10" width="560" height="1060" fill="#000"/>
        ${maskShapes(sex, pose(sex), view)}
      </mask>
    `;
  }

  function face(sex, m) {
    const c = m.cx;
    const y = m.headCy;
    const ink = `fill="none" stroke="#3a2c28" stroke-opacity="0.7" stroke-width="1.4" stroke-linecap="round"`;
    let extra = "";
    if (sex === "male") {
      extra = ell(c - 30, 232, 3.2, 2.4, `fill="#6a4038" fill-opacity="0.45"`) +
        ell(c + 30, 232, 3.2, 2.4, `fill="#6a4038" fill-opacity="0.45"`);
    }
    return `
      <g class="features">
        <path d="M ${c - 28} ${y - 18} Q ${c - 16} ${y - 24} ${c - 6} ${y - 18}" ${ink}/>
        <path d="M ${c + 6} ${y - 18} Q ${c + 16} ${y - 24} ${c + 28} ${y - 18}" ${ink}/>
        <path d="M ${c} ${y + 6} L ${c} ${y + 22}" ${ink}/>
        <path d="M ${c - 8} ${y + 34} Q ${c} ${y + 40} ${c + 8} ${y + 34}" ${ink}/>
        <path d="M ${c - m.headRx + 6} ${y - 36} Q ${c} ${y - 58} ${c + m.headRx - 6} ${y - 36}" fill="none" stroke="#2a221e" stroke-opacity="0.28" stroke-width="2"/>
        <circle cx="${c}" cy="452" r="2.2" fill="none" stroke="#3a2c28" stroke-opacity="0.35"/>
        ${extra}
      </g>
    `;
  }

  function renderBody(sex, view) {
    const posterior = view === "posterior";
    const late = [];
    const place = (html, onTopWhenPosterior) => {
      if (posterior && onTopWhenPosterior) late.push(html);
      else layers.push(html);
    };
    const P = pose(sex);
    const m = P.m;
    const c = m.cx;
    const layers = [];

    layers.push(`<ellipse class="plinth" cx="${c}" cy="978" rx="90" ry="8" fill="#000" opacity="0.35" filter="url(#${sex}-plinth)"/>`);
    layers.push(`<rect class="shell" x="-80" y="-10" width="560" height="1060" fill="#f0cbb8" fill-opacity="0.28" mask="url(#${sex}-body)"/>`);
    layers.push(group("skin", skinHits(sex, P, view)));
    layers.push(`<g mask="url(#${sex}-body)">`);

    layers.push(group("spinal-cord", `
      <path d="M 200 104 C 200 160, 198 240, 200 300 C 202 340, 200 370, 200 392" fill="none" stroke="url(#${sex}-nerve)" stroke-width="5" stroke-linecap="round"/>
      <path d="M 200 392 L 188 470 M 200 392 L 200 490 M 200 392 L 214 468 M 200 400 L 176 500 M 200 400 L 226 496" fill="none" stroke="url(#${sex}-nerve)" stroke-width="1.3" stroke-linecap="round" opacity="0.85"/>
      ${hitStroke("M 200 104 C 200 160, 198 240, 200 300 C 202 340, 200 370, 200 392", 12)}
    `));

    const armNerve = (sign) => {
      const e = P.elbow(sign);
      const w = P.wrist(sign);
      return `M ${200 + sign * 14} 164 Q ${n(c + sign * 78)} 210 ${n(e[0])} ${n(e[1])} T ${n(w[0])} ${n(w[1])}`;
    };
    const legNerve = (sign) => {
      const kn = P.knee(sign);
      const an = P.ankle(sign);
      return `M ${200 + sign * 12} 500 Q ${n(c + sign * 24)} 560 ${n(kn[0] - sign * 4)} ${n(kn[1])} T ${n(an[0] - sign * 3)} ${n(an[1] - 24)}`;
    };
    layers.push(group("peripheral-nerves", `
      <path d="${armNerve(-1)}" fill="none" stroke="url(#${sex}-nerve)" stroke-width="1.7"/>
      <path d="${armNerve(1)}" fill="none" stroke="url(#${sex}-nerve)" stroke-width="1.7"/>
      <path d="${legNerve(-1)}" fill="none" stroke="url(#${sex}-nerve)" stroke-width="1.7"/>
      <path d="${legNerve(1)}" fill="none" stroke="url(#${sex}-nerve)" stroke-width="1.7"/>
      ${hitStroke(armNerve(-1), 10)}
      ${hitStroke(armNerve(1), 10)}
      ${hitStroke(legNerve(-1), 10)}
      ${hitStroke(legNerve(1), 10)}
    `));

    place(group("vertebral-column", spine(sex, posterior), posterior ? 1 : null), true);
    const sacrum = group("sacrum", `
      <path d="M 182 500 Q 200 478 218 500 L 212 548 Q 200 562 188 548 Z" fill="${bone(sex)}"/>
      <path class="detail" d="M 200 492 V 546 M 190 512 H 210 M 192 528 H 208" stroke="rgba(90,70,58,0.35)" stroke-width="0.8"/>
    `);
    const coccyx = group("coccyx", `
      <path d="M 194 552 L 200 578 L 206 552 Z" fill="${bone(sex)}"/>
    `);
    if (posterior) late.push(sacrum, coccyx);
    else { layers.push(sacrum); layers.push(coccyx); }
    layers.push(individualRibs(sex));

    layers.push(group("sternum", `
      <path d="M 190 168 H 210 L 208 196 H 192 Z" fill="${bone(sex)}"/>
      <path d="M 193 200 H 207 L 206 268 H 194 Z" fill="${bone(sex)}"/>
      <path d="M 196 272 H 204 L 200 292 Z" fill="${bone(sex)}"/>
    `));

    const clav = (sign) => {
      const end = c + sign * m.shoulder;
      return `<path d="M ${c + sign * 12} 176 Q ${c + sign * 60} 166 ${end} 188" fill="none" stroke="${bone(sex)}" stroke-width="5" stroke-linecap="round"/>`;
    };
    layers.push(pair("clavicle", clav(-1), clav(1)));

    const scap = (sign) => {
      const reach = posterior ? m.shoulder - 4 : m.shoulder - 18;
      const x = c + sign * reach;
      if (!posterior) {
        return `<path d="M ${x} 188 L ${x + sign * 8} 250 L ${x - sign * 22} 230 Z" fill="${bone(sex)}" opacity="0.85"/>`;
      }
      return `<path d="M ${x - sign * 8} 178 L ${x + sign * 18} 214 L ${x + sign * 4} 286 L ${x - sign * 34} 258 Z" fill="${bone(sex)}"/>
        <path d="M ${x - sign * 20} 214 L ${x + sign * 16} 204" fill="none" stroke="rgba(255,248,240,0.55)" stroke-width="3.2" stroke-linecap="round"/>`;
    };
    place(pair("scapula", scap(-1), scap(1), posterior ? 0.95 : null), true);

    const hum = (sign) => {
      const s = P.shoulder(sign);
      const e = P.elbow(sign);
      return line(s[0], s[1] + 16, e[0], e[1], 8, bone(sex)) +
        `<circle cx="${n(s[0])}" cy="${n(s[1] + 10)}" r="7" fill="${bone(sex)}"/>`;
    };
    layers.push(pair("humerus", hum(-1), hum(1)));

    const rad = (sign) => {
      const e = P.elbow(sign);
      const w = P.wrist(sign);
      const ox = sign * -6;
      return line(e[0] + ox, e[1], w[0] + ox, w[1], 5, bone(sex));
    };
    const uln = (sign) => {
      const e = P.elbow(sign);
      const w = P.wrist(sign);
      const ox = sign * 6;
      return line(e[0] + ox, e[1], w[0] + ox, w[1], 5.5, bone(sex));
    };
    layers.push(pair("radius", rad(-1), rad(1)));
    layers.push(pair("ulna", uln(-1), uln(1)));

    layers.push(group("pelvis", pelvis(sex, m)));

    const fem = (sign) => {
      const hp = P.hip(sign);
      const kn = P.knee(sign);
      return `<circle cx="${n(hp[0])}" cy="${n(hp[1] - 6)}" r="9" fill="${bone(sex)}"/>` +
        line(hp[0], hp[1], kn[0], kn[1] - 12, 9, bone(sex));
    };
    layers.push(pair("femur", fem(-1), fem(1)));

    const pat = (sign) => {
      const kn = P.knee(sign);
      return ell(kn[0], kn[1] - 6, 7, 9, `fill="${bone(sex)}"`);
    };
    if (!posterior) layers.push(pair("patella", pat(-1), pat(1)));

    const tib = (sign) => {
      const kn = P.knee(sign);
      const an = P.ankle(sign);
      return line(kn[0] - sign * 3, kn[1] + 6, an[0] - sign * 2, an[1], 7, bone(sex));
    };
    const fib = (sign) => {
      const kn = P.knee(sign);
      const an = P.ankle(sign);
      return line(kn[0] + sign * 8, kn[1] + 10, an[0] + sign * 8, an[1], 4, bone(sex));
    };
    layers.push(pair("tibia", tib(-1), tib(1)));
    layers.push(pair("fibula", fib(-1), fib(1)));
    const skeleton = limbSkeleton(sex, P, posterior);
    layers.push(skeleton.main);
    if (skeleton.late) late.push(skeleton.late);
    layers.push(digits(sex, P, posterior));

    layers.push(group("skull", skull(sex, m, posterior)));
    layers.push(mandible(sex, m, posterior));
    const hy = m.neckW / 2 - 2.2;
    layers.push(group("hyoid", `
      <path d="M ${n(c - hy)} 140 Q ${c} ${n(136)} ${n(c + hy)} 140 L ${n(c + hy - 1.4)} 148 Q ${c} ${n(144)} ${n(c - hy + 1.4)} 148 Z" fill="${bone(sex)}"/>
      <path d="M ${n(c - hy + 0.4)} 146 Q ${n(c - hy + 0.2)} 154 ${n(c - hy + 1.6)} 158 M ${n(c + hy - 0.4)} 146 Q ${n(c + hy - 0.2)} 154 ${n(c + hy - 1.6)} 158" fill="none" stroke="${bone(sex)}" stroke-width="1.6" stroke-linecap="round"/>
    `));
    layers.push(group("nasal-cavity", `
      <path d="M ${c - 6} 78 C ${c - 10} 86, ${c - 8} 98, ${c} 100 C ${c + 8} 98, ${c + 10} 86, ${c + 6} 78 C ${c + 2} 82, ${c - 2} 82, ${c - 6} 78 Z" fill="#d7c2b4" fill-opacity="0.55"/>
      <path class="detail" d="M ${c} 82 V 98" stroke="rgba(90,70,58,0.45)" stroke-width="1"/>
    `));
    if (!posterior) {
      layers.push(group("tongue", `
        <path d="M ${c - 11} 104 C ${c - 11} 114, ${c + 11} 114, ${c + 11} 104 C ${c + 5} 110, ${c - 5} 110, ${c - 11} 104 Z" fill="#e7b0a8"/>
        <path class="detail" d="M ${c} 104 V 112" stroke="rgba(120,60,60,0.35)" stroke-width="0.8"/>
      `));
    }
    const gland = (x, y, rx, ry) => ell(x, y, rx, ry, `fill="url(#${sex}-gland)" stroke="rgba(255,246,236,0.28)" stroke-width="0.8"`);
    layers.push(pair(
      "parotid",
      gland(c - 22, 96, 4.2, 7),
      gland(c + 22, 96, 4.2, 7)
    ));
    layers.push(pair(
      "submandibular",
      gland(c - 16, 118, 4.5, 3.6),
      gland(c + 16, 118, 4.5, 3.6)
    ));
    layers.push(brain(sex));
    layers.push(group("pituitary", `
      <circle cx="200" cy="118" r="3.2" fill="url(#${sex}-gland)"/>
      <circle cx="200" cy="118" r="8" fill="transparent"/>
    `));
    layers.push(group("pineal", `
      <circle cx="200" cy="92" r="2.6" fill="url(#${sex}-gland)"/>
      <circle cx="200" cy="92" r="7" fill="transparent"/>
    `));
    const cerebellum = group("cerebellum", `
      <ellipse cx="200" cy="108" rx="22" ry="11" fill="url(#${sex}-brain)"/>
      <path class="detail" d="M 184 104 Q 196 114 200 104 T 216 108" fill="none" stroke="rgba(140,70,80,0.45)"/>
      <path class="detail" d="M 186 112 Q 200 120 214 112" fill="none" stroke="rgba(140,70,80,0.45)"/>
    `, posterior ? 1 : 0.5);
    if (posterior) late.push(cerebellum);
    else layers.push(cerebellum);

    layers.push(group("esophagus", `
      <path d="M 204 148 C 206 190, 210 260, 214 330" fill="none" stroke="url(#${sex}-stomach)" stroke-width="5" stroke-linecap="round"/>
      ${hitStroke("M 204 148 C 206 190, 210 260, 214 330", 12)}
    `));

    layers.push(group("thoracic-duct", `
      <path d="M 210 490 C 212 400, 216 280, 220 168" fill="none" stroke="url(#${sex}-lymph)" stroke-width="2.2" stroke-linecap="round"/>
      ${hitStroke("M 210 490 C 212 400, 216 280, 220 168", 8)}
    `));
    layers.push(group("cisterna-chyli", `
      <path d="M 206 496 C 202 504, 206 516, 214 514 C 220 510, 216 498, 210 494 Z" fill="url(#${sex}-lymph)"/>
    `));
    layers.push(group("hypothalamus", `
      <ellipse cx="200" cy="108" rx="8" ry="3.2" fill="url(#${sex}-gland)" fill-opacity="0.9"/>
      <ellipse cx="200" cy="108" rx="10" ry="5" fill="transparent"/>
    `));
    layers.push(group("aorta", aorta(sex)));
    layers.push(group("vena-cava", vena(sex)));
    layers.push(namedVessels(sex, P));

    place(pair("kidney", kidneySide(sex, "patient-right"), kidneySide(sex, "patient-left"), posterior ? 1 : null), true);
    place(pair("adrenal", adrenal(sex, "patient-right"), adrenal(sex, "patient-left")), true);
    layers.push(pair("ureter", ureterSide(sex, "patient-right"), ureterSide(sex, "patient-left")));
    layers.push(group("portal-vein", `
      <path d="M 190 430 C 182 408, 170 392, 160 378" fill="none" stroke="url(#${sex}-portal)" stroke-width="4" stroke-linecap="round"/>
      ${hitStroke("M 190 430 C 182 408, 170 392, 160 378", 10)}
    `));

    layers.push(group("pancreas", filled(
      "M 164 392 C 190 384, 226 388, 256 400 C 260 408, 232 416, 198 412 C 174 408, 158 402, 164 392 Z",
      `url(#${sex}-gland)`
    )));

    layers.push(group("spleen", ell(278, 362, 13, 20, `fill="url(#${sex}-spleen)" stroke="rgba(255,246,236,0.3)" stroke-width="1"`)));

    layers.push(group("liver", filled(
      "M 128 336 C 120 358, 124 384, 148 398 C 176 412, 208 398, 214 370 C 218 344, 190 328, 158 326 C 140 324, 130 328, 128 336 Z",
      `url(#${sex}-liver)`
    ) + `<path class="detail" d="M 156 334 C 150 360, 154 384, 160 400" fill="none" stroke="rgba(255,236,220,0.35)" stroke-width="1.2"/>`));

    layers.push(group("bile-duct", `
      <path d="M 172 400 C 176 412, 184 424, 190 436" fill="none" stroke="#c4b36a" stroke-width="2.4" stroke-linecap="round"/>
      ${hitStroke("M 172 400 C 176 412, 184 424, 190 436", 5)}
    `));

    layers.push(group("gallbladder", filled(
      "M 166 386 C 176 386, 180 400, 172 414 C 164 424, 154 412, 156 400 C 158 390, 160 386, 166 386 Z",
      "#7f8f4e"
    )));

    layers.push(group("stomach", filled(
      "M 208 334 C 236 322, 268 340, 262 372 C 256 404, 236 418, 220 404 C 208 394, 200 364, 206 346 C 200 336, 202 332, 208 334 Z",
      `url(#${sex}-stomach)`
    ) + `<path class="detail" d="M 228 348 Q 248 366, 240 392" fill="none" stroke="rgba(120,70,40,0.28)" stroke-width="1.1"/>`));

    layers.push(group("duodenum", `
      <path d="M 214 408 C 196 414, 176 424, 170 442 C 166 460, 176 474, 194 470 C 208 466, 214 452, 210 440" fill="none" stroke="url(#${sex}-bowel)" stroke-width="7" stroke-linecap="round"/>
      ${hitStroke("M 214 408 C 196 414, 176 424, 170 442 C 166 460, 176 474, 194 470", 12)}
    `));

    layers.push(group("large-intestine", `
      <path d="M 158 492 C 150 460, 158 434, 174 424 C 196 412, 232 414, 250 428 C 268 442, 272 474, 262 508 C 252 534, 228 548, 206 540" fill="none" stroke="url(#${sex}-colon)" stroke-width="13" stroke-linecap="round"/>
      ${hitStroke("M 158 492 C 150 460, 158 434, 174 424 C 196 412, 232 414, 250 428 C 268 442, 272 474, 262 508 C 252 534, 228 548, 206 540", 18)}
    `));

    layers.push(group("appendix", `
      <path d="M 156 486 C 144 496, 138 510, 144 520" fill="none" stroke="url(#${sex}-colon)" stroke-width="3" stroke-linecap="round"/>
      ${hitStroke("M 156 486 C 144 496, 138 510, 144 520", 10)}
    `));
    layers.push(group("cecum", filled(
      "M 150 472 C 136 480, 138 506, 156 510 C 170 506, 168 478, 154 470 C 148 466, 150 468, 150 472 Z",
      `url(#${sex}-colon)`
    )));

    layers.push(group("small-intestine", `
      <g fill="url(#${sex}-bowel)" stroke="rgba(255,246,236,0.28)" stroke-width="1">
        <ellipse cx="188" cy="456" rx="14" ry="9" transform="rotate(-16 188 456)"/>
        <ellipse cx="212" cy="468" rx="15" ry="9" transform="rotate(14 212 468)"/>
        <ellipse cx="180" cy="482" rx="13" ry="8" transform="rotate(10 180 482)"/>
        <ellipse cx="208" cy="494" rx="14" ry="8" transform="rotate(-14 208 494)"/>
        <ellipse cx="186" cy="508" rx="12" ry="8" transform="rotate(18 186 508)"/>
        <ellipse cx="210" cy="518" rx="11" ry="7" transform="rotate(-8 210 518)"/>
      </g>
    `));

    layers.push(group("rectum", `
      <path d="M 206 546 C 208 570, 204 600, 200 624" fill="none" stroke="url(#${sex}-colon)" stroke-width="8" stroke-linecap="round"/>
      ${hitStroke("M 206 546 C 208 570, 204 600, 200 624", 14)}
    `));

    const lungR = "M 114 210 C 100 244, 104 300, 126 332 C 148 352, 176 340, 188 308 C 198 274, 186 230, 162 212 C 144 198, 124 198, 114 210 Z";
    const lungL = "M 216 208 C 238 194, 290 208, 300 242 C 308 276, 294 318, 270 334 C 252 346, 236 324, 240 296 C 244 270, 226 236, 216 208 Z";
    layers.push(pair(
      "lung",
      filled(lungR, `url(#${sex}-lung)`) + `<path class="detail" d="M 132 248 Q 158 268 150 314" fill="none" stroke="rgba(120,50,70,0.28)"/>`,
      filled(lungL, `url(#${sex}-lung)`) + `<path class="detail" d="M 274 246 Q 252 274 260 312" fill="none" stroke="rgba(120,50,70,0.28)"/>`
    ));

    layers.push(group("diaphragm", `
      <path d="M 108 338 Q 150 306, 190 326 Q 238 348, 302 328" fill="none" stroke="${muscle(sex)}" stroke-width="6" stroke-linecap="round"/>
      ${hitStroke("M 108 338 Q 150 306, 190 326 Q 238 348, 302 328", 8)}
    `));

    layers.push(group("heart", [
      filled(
        "M 200 252 C 190 256, 184 268, 184 282 C 184 296, 196 308, 210 308 L 232 296 C 242 286, 244 270, 236 258 C 228 248, 214 244, 206 250 C 200 252, 198 250, 200 252 Z",
        `url(#${sex}-heart)`
      ),
      `<path class="detail" d="M 190 268 C 204 276, 218 270, 234 258" fill="none" stroke="rgba(255,236,236,0.65)" stroke-width="1.3"/>`,
      `<path class="detail" d="M 208 272 C 216 282, 224 290, 232 298" fill="none" stroke="rgba(255,236,236,0.8)" stroke-width="1.5"/>`,
    ].join(""), posterior ? 0.42 : null));

    layers.push(group("pulmonary-trunk", `
      <path d="M 206 268 C 216 254, 228 246, 240 252" fill="none" stroke="url(#${sex}-artery)" stroke-width="5" stroke-linecap="round"/>
      ${hitStroke("M 206 268 C 216 254, 228 246, 240 252", 10)}
    `));

    layers.push(group("thymus", filled(
      "M 184 176 C 200 168, 220 176, 214 202 C 208 214, 192 214, 186 200 C 180 188, 180 180, 184 176 Z",
      `url(#${sex}-lymph)`
    )));

    layers.push(group("trachea", `
      <path d="M 196 150 H 204 V 222 H 196 Z" fill="#f4efe6" stroke="rgba(90,70,60,0.35)" stroke-width="1"/>
      <path class="detail" d="M 197 160 H 203 M 197 172 H 203 M 197 184 H 203 M 197 196 H 203 M 197 208 H 203" stroke="rgba(90,70,60,0.35)" stroke-width="1"/>
    `));
    const bronchus = (side) => {
      const d = side === "patient-right"
        ? "M 196 220 C 172 238, 158 258, 152 276"
        : "M 204 220 C 226 236, 244 254, 254 272";
      return `<path d="${d}" fill="none" stroke="#f4efe6" stroke-width="4" stroke-linecap="round"/>` + hitStroke(d, 10);
    };
    layers.push(pair("bronchus", bronchus("patient-right"), bronchus("patient-left")));

    const larW = sex === "male" ? 20 : 15;
    layers.push(group("larynx", filled(
      `M ${200 - larW} 132 Q 200 122 ${200 + larW} 132 L ${200 + larW - 4} 156 Q 200 164 ${200 - larW + 4} 156 Z`,
      "#efe6dc"
    )));
    layers.push(group("pharynx", `
      <path d="M 194 126 H 206 V 158 H 194 Z" fill="#f0d2c4" fill-opacity="0.92" stroke="rgba(90,60,50,0.3)"/>
    `));
    layers.push(group("epiglottis", filled(
      "M 200 120 C 208 124, 208 134, 200 138 C 192 134, 192 124, 200 120 Z",
      "#f4e6dc"
    )));

    layers.push(group("thyroid", `
      ${ell(184, 178, 8, 12, `fill="url(#${sex}-gland)" stroke="rgba(255,246,236,0.3)" stroke-width="1"`)}
      ${ell(216, 178, 8, 12, `fill="url(#${sex}-gland)" stroke="rgba(255,246,236,0.3)" stroke-width="1"`)}
      <path d="M 192 182 H 208" stroke="url(#${sex}-gland)" stroke-width="4" stroke-linecap="round"/>
    `));
    layers.push(group("parathyroid", `
      ${ell(180, 172, 2, 2.4, `fill="url(#${sex}-gland)"`)}
      ${ell(182, 186, 2, 2.4, `fill="url(#${sex}-gland)"`)}
      ${ell(220, 172, 2, 2.4, `fill="url(#${sex}-gland)"`)}
      ${ell(218, 186, 2, 2.4, `fill="url(#${sex}-gland)"`)}
      <circle cx="180" cy="172" r="5" fill="transparent"/>
      <circle cx="220" cy="186" r="5" fill="transparent"/>
    `));

    if (sex === "female") layers.push(femaleRepro(sex));
    else layers.push(maleRepro(sex));

    layers.push(group("bladder", ell(200, 578, 22, 15, `fill="url(#${sex}-bladder)" stroke="rgba(255,246,236,0.35)" stroke-width="1"`)));

    layers.push(posterior ? posteriorMuscles(sex, P) : muscles(sex, P));
    layers.push(masseters(sex, m));
    if (posterior) layers.push(sciatic(sex, P));
    if (!posterior && sex === "female") layers.push(mammary(sex));
    layers.push(lymphNodes(sex, P));
    late.forEach((html) => layers.push(html));
    layers.push(ears(sex, m, posterior));
    layers.push(`</g>`);
    layers.push(urethra(sex));
    if (!posterior && sex === "female") layers.push(vulva(sex));
    if (!posterior && sex === "male") layers.push(maleExternal(sex));
    if (!posterior) layers.push(eyes(sex, m));

    layers.push(`<rect class="shell" x="-80" y="-10" width="560" height="1060" fill="#000" mask="url(#${sex}-body)" filter="url(#${sex}-edge)"/>`);
    layers.push(posterior ? occiput(sex, m) : face(sex, m));

    const aspectName = posterior ? "posterior" : "anterior";
    return `<svg class="body-svg${posterior ? " is-back" : ""}" data-sex="${sex}" data-home="${HOME}" viewBox="${HOME}" role="img" aria-label="Schematic ${aspectName} view of an adult ${sex} body" preserveAspectRatio="xMidYMid meet">
      <defs>${defs(sex, view)}</defs>
      ${layers.join("\n")}
    </svg>`;
  }

  function longBone(x1, y1, x2, y2, w, fill) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;
    const neck = Math.max(1.2, w * 0.42);
    const base = w * 0.78;
    const head = w * 0.62;
    const b = [x1 + ux * base, y1 + uy * base];
    const h = [x2 - ux * head, y2 - uy * head];
    const d = [
      `M ${n(b[0] + px * neck)} ${n(b[1] + py * neck)}`,
      `L ${n(h[0] + px * neck)} ${n(h[1] + py * neck)}`,
      `L ${n(h[0] - px * neck)} ${n(h[1] - py * neck)}`,
      `L ${n(b[0] - px * neck)} ${n(b[1] - py * neck)} Z`,
    ].join(" ");
    return `<path d="${d}" fill="${fill}" stroke="rgba(255,248,240,0.45)" stroke-width="0.45"/>`
      + `<circle cx="${n(x1)}" cy="${n(y1)}" r="${n(base)}" fill="${fill}" stroke="rgba(255,248,240,0.4)" stroke-width="0.4"/>`
      + `<circle cx="${n(x2)}" cy="${n(y2)}" r="${n(head)}" fill="${fill}" stroke="rgba(255,248,240,0.4)" stroke-width="0.4"/>`;
  }

  function footPt(an, medial, ml, dist) {
    return [an[0] + medial * ml, an[1] + dist];
  }

  function limbSkeleton(sex, P, posterior) {
    const fill = bone(sex);
    const edge = `fill="${fill}" stroke="rgba(255,248,240,0.5)" stroke-width="0.45"`;
    const hit = (x, y, r) => `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="transparent"/>`;
    const side = { "-1": {}, "1": {} };

    [-1, 1].forEach((sign) => {
      const key = String(sign);
      const an = P.ankle(sign);
      const medial = -sign;
      const at = (ml, dist) => footPt(an, medial, ml, dist);
      const put = (id, html) => { side[key][id] = html; };
      const nav = at(5.2, 14);
      const cub = at(-6.4, 16);
      const cunM = at(6.2, 20);
      const cunI = at(2.1, 19.4);
      const cunL = at(-1.5, 20);
      const smooth = (pts) => {
        const p = pts.map(([ml, dist]) => at(ml, dist));
        const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        const m0 = mid(p[p.length - 1], p[0]);
        let d = `M ${n(m0[0])} ${n(m0[1])}`;
        for (let i = 0; i < p.length; i++) {
          const a = p[i];
          const b = p[(i + 1) % p.length];
          const m = mid(a, b);
          d += ` Q ${n(a[0])} ${n(a[1])} ${n(m[0])} ${n(m[1])}`;
        }
        return d + " Z";
      };
      put("calcaneus", `<path d="${smooth([
        [-9, -4], [-12, 2], [-8, 11], [-2, 16],
        [3, 13], [6, 8], [12, 5], [9, 0],
        [3, -3], [-3, -6],
      ])}" ${edge}/>${hit(at(-2, -2)[0], at(-2, -2)[1], 8)}`);
      put("talus", `<path d="${smooth([
        [-4, 2], [-2, 8], [2, 12], [8, 9],
        [5, 4], [1, 1], [-3, 0],
      ])}" ${edge}/>`);
      put("navicular", ell(nav[0], nav[1], 4.6, 2.6, edge) + hit(nav[0], nav[1], 5));
      put("cuboid", ell(cub[0], cub[1], 3.8, 3.3, edge) + hit(cub[0], cub[1], 5));
      put("medial-cuneiform", ell(cunM[0], cunM[1], 2.7, 2.3, edge) + hit(cunM[0], cunM[1], 4));
      put("intermediate-cuneiform", ell(cunI[0], cunI[1], 1.7, 1.9, edge) + hit(cunI[0], cunI[1], 3.5));
      put("lateral-cuneiform", ell(cunL[0], cunL[1], 2.2, 2.1, edge) + hit(cunL[0], cunL[1], 3.8));

      const metas = [
        { id: "metatarsal-1", slot: 2.05, w: 4.4, base: 4.6 },
        { id: "metatarsal-2", slot: 0.7, w: 3.1, base: 2.2 },
        { id: "metatarsal-3", slot: -0.35, w: 2.9, base: -0.4 },
        { id: "metatarsal-4", slot: -1.3, w: 2.8, base: -2.6 },
        { id: "metatarsal-5", slot: -2.2, w: 2.7, base: -5.2 },
      ];
      metas.forEach((spec) => {
        const toe = toeGeom(P, sign, spec);
        const base = at(spec.base, 23);
        let html = longBone(base[0], base[1], toe.x1, toe.y1, spec.w, fill);
        if (spec.id === "metatarsal-5") {
          const bump = at(spec.base - 2.2, 24);
          html += `<circle cx="${n(bump[0])}" cy="${n(bump[1])}" r="2.1" fill="${fill}"/>`;
        }
        put(spec.id, html);
      });

      const f = handFrame(P, sign);
      const w = P.wrist(sign);
      const place = (lat, dist) => [w[0] + f.lx * lat + f.ux * dist, w[1] + f.ly * lat + f.uy * dist];
      const blob = (lat, dist, rx, ry, rot) => {
        const [x, y] = place(lat, dist);
        return ell(x, y, rx, ry, `${edge} transform="rotate(${n(rot * sign)} ${n(x)} ${n(y)})"`) + hit(x, y, Math.max(rx, ry) + 1.2);
      };
      const carpals = [
        { id: "scaphoid", lat: 6.2, dist: 3.6, rx: 4.2, ry: 2.5, rot: 52 },
        { id: "lunate", lat: 1.2, dist: 2.4, rx: 2.6, ry: 2.3, rot: -18 },
        { id: "triquetrum", lat: -3.4, dist: 3.2, rx: 2.5, ry: 2.2, rot: 24 },
        { id: "pisiform", lat: -5.6, dist: 0.4, rx: 1.9, ry: 1.9, rot: 0, anterior: true },
        { id: "trapezium", lat: 7.4, dist: 10.6, rx: 3.1, ry: 2.5, rot: 28 },
        { id: "trapezoid", lat: 2.8, dist: 11.2, rx: 2.2, ry: 2.1, rot: 8 },
        { id: "capitate", lat: -0.8, dist: 11.6, rx: 2.9, ry: 3.2, rot: 6 },
        { id: "hamate", lat: -4.8, dist: 10.4, rx: 2.8, ry: 2.5, rot: -18 },
      ];
      carpals.forEach((boneSpec) => {
        if (boneSpec.anterior && posterior) return;
        let html = blob(boneSpec.lat, boneSpec.dist, boneSpec.rx, boneSpec.ry, boneSpec.rot);
        if (boneSpec.id === "hamate") {
          const [hx, hy] = place(boneSpec.lat - 1.5, boneSpec.dist + 1.1);
          html += `<circle cx="${n(hx)}" cy="${n(hy)}" r="1.35" fill="${fill}" stroke="rgba(255,248,240,0.4)" stroke-width="0.4"/>`;
        }
        if (boneSpec.id === "lunate") {
          const [x, y] = place(boneSpec.lat, boneSpec.dist);
          html += `<path d="M ${n(x - f.lx * 1.6)} ${n(y - f.ly * 1.6)} Q ${n(x + f.ux * 1.8)} ${n(y + f.uy * 1.8)} ${n(x + f.lx * 1.5)} ${n(y + f.ly * 1.5)}" fill="none" stroke="rgba(90,70,58,0.4)" stroke-width="0.8"/>`;
        }
        if (boneSpec.id === "scaphoid") {
          const [x, y] = place(boneSpec.lat, boneSpec.dist);
          html += `<path d="M ${n(x - f.ux * 2.2)} ${n(y - f.uy * 2.2)} Q ${n(x + f.lx * 1.2)} ${n(y + f.ly * 1.2)} ${n(x + f.ux * 2.4)} ${n(y + f.uy * 2.4)}" fill="none" stroke="rgba(90,70,58,0.28)" stroke-width="0.7"/>`;
        }
        put(boneSpec.id, html);
      });

      const fingers = [
        { id: "metacarpal-1", spec: null, w: 3.6 },
        { id: "metacarpal-2", spec: FINGERS[0], w: 3.2 },
        { id: "metacarpal-3", spec: FINGERS[1], w: 3.3 },
        { id: "metacarpal-4", spec: FINGERS[2], w: 3.1 },
        { id: "metacarpal-5", spec: FINGERS[3], w: 2.8 },
      ];
      fingers.forEach((meta) => {
        if (meta.id === "metacarpal-1") {
          const thumb = thumbGeom(P, sign);
          const x1 = w[0] + f.lx * 8.2 + f.ux * 12;
          const y1 = w[1] + f.ly * 8.2 + f.uy * 12;
          put(meta.id, longBone(x1, y1, thumb.x1, thumb.y1, meta.w, fill));
          return;
        }
        const finger = fingerGeom(P, sign, meta.spec);
        const x1 = w[0] + f.lx * meta.spec.spread * 6.4 + f.ux * 16;
        const y1 = w[1] + f.ly * meta.spec.spread * 6.4 + f.uy * 16;
        put(meta.id, longBone(x1, y1, finger.x1, finger.y1, meta.w, fill));
      });
    });

    const ids = Object.keys(side["-1"]);
    const main = [];
    const lateBits = [];
    ids.forEach((id) => {
      const html = pair(id, side["-1"][id], side["1"][id] || "");
      if (posterior && id === "calcaneus") lateBits.push(html);
      else main.push(html);
    });
    return { main: main.join(""), late: lateBits.join("") };
  }

  function digits(sex, P, posterior) {
    const mark = (g, two) => {
      const len = Math.hypot(g.x2 - g.x1, g.y2 - g.y1) || 1;
      const segs = len < 13
        ? [[0.14, 0.82]]
        : two
          ? [[0.08, 0.48], [0.56, 0.9]]
          : [[0.06, 0.36], [0.42, 0.66], [0.72, 0.9]];
      const bones = segs.map(([a, b]) => line(
        g.x1 + g.dx * len * a,
        g.y1 + g.dy * len * a,
        g.x1 + g.dx * len * b,
        g.y1 + g.dy * len * b,
        Math.max(1.7, g.w * 0.32),
        bone(sex)
      )).join("");
      const tipX = g.x2 - g.dx * Math.min(3.2, len * 0.18);
      const tipY = g.y2 - g.dy * Math.min(3.2, len * 0.18);
      const angle = Math.atan2(g.dy, g.dx) * 180 / Math.PI;
      const nail = posterior ? "" : ell(
        tipX,
        tipY,
        Math.max(1.6, g.w * 0.42),
        Math.max(1.3, g.w * 0.28),
        `fill="#f7f3ee" stroke="#3a2c28" stroke-opacity="0.4" stroke-width="0.6" transform="rotate(${n(angle)} ${n(tipX)} ${n(tipY)})"`
      );
      return line(g.x1, g.y1, g.x2, g.y2, g.w, "#f3d4c4") + bones + nail;
    };
    const bits = [
      pair("thumb", mark(thumbGeom(P, -1), true), mark(thumbGeom(P, 1), true)),
    ];
    FINGERS.forEach((spec) => {
      bits.push(pair(spec.id, mark(fingerGeom(P, -1, spec), false), mark(fingerGeom(P, 1, spec), false)));
    });
    TOES.forEach((spec) => {
      bits.push(pair(spec.id, mark(toeGeom(P, -1, spec), spec.id === "hallux"), mark(toeGeom(P, 1, spec), spec.id === "hallux")));
    });
    return bits.join("");
  }

  function ears(sex, m, posterior) {
    const one = (sign) => {
      const y = m.headCy + 4;
      const ax = m.cx + sign * (m.headRx - 10);
      const s = sign;
      const fold = posterior ? "" : `
        <path class="detail" d="M ${n(ax + s * 4)} ${n(y - 8)} C ${n(ax + s * 12)} ${n(y - 4)}, ${n(ax + s * 12)} ${n(y + 8)}, ${n(ax + s * 4)} ${n(y + 8)}" fill="none" stroke="#3a2c28" stroke-opacity="0.6" stroke-width="1.2"/>
      `;
      return `<path d="${earPath(m, sign)}" fill="#f0cbb8" stroke="#3a2c28" stroke-opacity="0.7" stroke-width="1.2"/>${fold}`;
    };
    return pair("ear", one(-1), one(1));
  }

  function skull(sex, m, posterior) {
    const c = m.cx;
    const y = m.headCy;
    if (posterior) {
      return `
        <path d="${ellipsePath(c, y - 2, 36, 44)}" fill="${bone(sex)}"/>
        <path d="M ${c - 10} ${y + 18} Q ${c} ${y + 34} ${c + 10} ${y + 18}" fill="none" stroke="rgba(90,70,58,0.35)" stroke-width="2" stroke-linecap="round"/>
        <circle cx="${c}" cy="${y + 16}" r="2.4" fill="rgba(90,70,58,0.35)"/>
      `;
    }
    const d = [
      ellipsePath(c, y - 10, 34, 34),
      ellipsePath(c - 15, y - 6, 8, 5.5),
      ellipsePath(c + 15, y - 6, 8, 5.5),
      ellipsePath(c, y + 8, 4.2, 7),
    ].join(" ");
    return `<path d="${d}" fill="${bone(sex)}" fill-rule="evenodd"/>`;
  }

  function brain(sex) {
    return group("brain", `
      <ellipse cx="200" cy="72" rx="31" ry="36" fill="url(#${sex}-brain)"/>
      <path class="detail" d="M 200 42 V 104" stroke="rgba(140,70,80,0.35)" stroke-width="1.2"/>
      <path class="detail" d="M 176 60 Q 190 50 200 66 T 226 58" fill="none" stroke="rgba(140,70,80,0.4)" stroke-width="1"/>
      <path class="detail" d="M 174 84 Q 192 74 208 88 T 226 82" fill="none" stroke="rgba(140,70,80,0.4)" stroke-width="1"/>
      <path d="M 190 102 Q 200 118 210 102" fill="url(#${sex}-brain)"/>
    `);
  }

  function kidneySide(sex, side) {
    const right = side === "patient-right";
    const cx = right ? 152 : 250;
    const cy = right ? 452 : 426;
    const hilum = right ? cx + 6 : cx - 6;
    const d = `${ellipsePath(cx, cy, 14, 26)} ${ellipsePath(hilum, cy + 1, 4, 6)}`;
    return `
      <path d="${d}" fill="url(#${sex}-kidney)" fill-rule="evenodd" stroke="rgba(255,246,236,0.3)" stroke-width="1"/>
    `;
  }

  function ureterSide(sex, side) {
    const right = side === "patient-right";
    const cx = right ? 152 : 250;
    const cy = right ? 452 : 426;
    const d = right
      ? `M ${cx} ${cy + 22} C ${cx - 2} 510, 188 540, 190 568`
      : `M ${cx} ${cy + 22} C ${cx + 2} 500, 214 540, 210 568`;
    return `<path d="${d}" fill="none" stroke="url(#${sex}-kidney)" stroke-width="3" stroke-linecap="round"/>` + hitStroke(d, 10);
  }

  function adrenal(sex, side) {
    const right = side === "patient-right";
    const cx = right ? 154 : 248;
    const cy = right ? 422 : 396;
    return filled(
      `M ${cx} ${cy} l 8 -5 l 3 7 l -10 4 Z`,
      `url(#${sex}-gland)`
    );
  }

  function aorta(sex) {
    const d = "M 214 250 C 214 214, 252 196, 236 228 C 230 242, 228 260, 226 300 L 222 470 L 214 520 M 214 520 L 196 536 M 214 520 L 232 536";
    const branches = "M 228 210 L 214 188 M 236 206 L 236 184 M 244 210 L 258 190";
    return `
      <path d="${d}" fill="none" stroke="url(#${sex}-artery)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${branches}" fill="none" stroke="url(#${sex}-artery)" stroke-width="3" stroke-linecap="round"/>
      ${hitStroke(d, 14)}
    `;
  }

  function vena(sex) {
    const d = "M 186 520 C 184 460, 188 360, 190 280 M 176 206 C 184 226, 190 240, 196 258";
    return `
      <path d="${d}" fill="none" stroke="url(#${sex}-vein)" stroke-width="6" stroke-linecap="round"/>
      ${hitStroke(d, 14)}
    `;
  }

  function pelvis(sex, m) {
    const w = sex === "female" ? 116 : 96;
    const arch = sex === "female" ? 34 : 20;
    const c = 200;
    const d = `
      M ${c} 520
      L ${c - w} 508
      Q ${c - w - 8} 548 ${c - w + 16} 590
      Q ${c - 70} 612 ${c - arch} 600
      L ${c - 8} 608
      L ${c + 8} 608
      L ${c + arch} 600
      Q ${c + 70} 612 ${c + w - 16} 590
      Q ${c + w + 8} 548 ${c + w} 508
      L ${c} 520 Z`;
    const holes = `
      ${ellipsePath(c - w * 0.45, 575, 14, 16)}
      ${ellipsePath(c + w * 0.45, 575, 14, 16)}`;
    return `<path d="${d} ${holes}" fill="${bone(sex)}" fill-rule="evenodd"/>`;
  }

  function femaleRepro(sex) {
    const tube = (side) => {
      const right = side === "patient-right";
      const d = right
        ? "M 188 548 C 170 536, 156 548, 150 566"
        : "M 212 548 C 230 536, 244 548, 250 566";
      return `<path d="${d}" fill="none" stroke="url(#${sex}-reprof)" stroke-width="3.2" stroke-linecap="round"/>` +
        hitStroke(d, 10);
    };
    const ovary = (side) => {
      const right = side === "patient-right";
      const x = right ? 150 : 250;
      return ell(x, 578, 7, 10, `fill="url(#${sex}-reprof)" stroke="rgba(255,246,236,0.35)" stroke-width="1"`);
    };
    return [
      group("uterus", filled(
        "M 200 552 C 214 552, 220 566, 214 582 C 208 594, 192 594, 186 582 C 180 566, 186 552, 200 552 Z",
        `url(#${sex}-reprof)`
      )),
      pair("uterine-tube", tube("patient-right"), tube("patient-left")),
      pair("ovary", ovary("patient-right"), ovary("patient-left")),
      group("vagina", `
        <path d="M 200 596 V 652" fill="none" stroke="url(#${sex}-reprof)" stroke-width="6" stroke-linecap="round"/>
        ${hitStroke("M 200 596 V 652", 12)}
      `),
    ].join("");
  }

  function urethra(sex) {
    const d = sex === "female" ? "M 200 592 V 652" : "M 200 592 V 728";
    return group("urethra", `
      <path d="${d}" fill="none" stroke="#e7b8a4" stroke-width="2.6" stroke-linecap="round"/>
      ${hitStroke(d, 4)}
    `);
  }

  function vulva(sex) {
    return group("vulva", `
      <path d="M 188 648 C 180 676, 186 706, 200 714 C 214 706, 220 676, 212 648" fill="none" stroke="url(#${sex}-reprof)" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M 194 658 C 190 680, 196 700, 200 704 C 204 700, 210 680, 206 658" fill="none" stroke="#c46b8c" stroke-width="2" stroke-linecap="round"/>
      <circle cx="200" cy="654" r="2.6" fill="#c46b8c"/>
      <circle cx="200" cy="680" r="14" fill="transparent"/>
    `);
  }

  function eyes(sex, m) {
    const c = m.cx;
    const y = m.headCy;
    const eye = (sign) => `
      <ellipse cx="${c + sign * 16}" cy="${y - 4}" rx="7" ry="4.2" fill="#f7f4ef" stroke="#3a2c28" stroke-opacity="0.55" stroke-width="1"/>
      <circle cx="${c + sign * 16}" cy="${y - 4}" r="1.7" fill="#2c2422"/>
      <ellipse cx="${c + sign * 16}" cy="${y - 4}" rx="9" ry="7" fill="transparent"/>
    `;
    return pair("eye", eye(-1), eye(1));
  }

  function mammary(sex) {
    const gland = (side) => {
      const right = side === "patient-right";
      const x = right ? 136 : 264;
      const y = 252;
      const dir = right ? -1 : 1;
      return `
        <ellipse cx="${x}" cy="${y}" rx="30" ry="24" fill="url(#${sex}-reprof)" fill-opacity="0.55"/>
        <path d="M ${x} ${y + 6} C ${x + dir * 12} ${y - 16}, ${x + dir * 22} ${y - 4}, ${x + dir * 6} ${y + 14} M ${x + 2} ${y - 2} C ${x - dir * 18} ${y - 18}, ${x - dir * 6} ${y + 16}, ${x + 4} ${y + 8}" fill="none" stroke="#a85a6c" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="${x}" cy="${y + 8}" r="3.6" fill="#8d4456"/>
        <circle cx="${x}" cy="${y}" r="24" fill="transparent"/>
      `;
    };
    return pair("mammary", gland("patient-right"), gland("patient-left"));
  }

  function maleRepro(sex) {
    const duct = (side) => {
      const right = side === "patient-right";
      const d = right
        ? "M 186 700 C 168 650, 160 620, 176 588 C 186 568, 190 556, 192 546"
        : "M 214 700 C 232 650, 240 620, 224 588 C 214 568, 210 556, 208 546";
      return `<path d="${d}" fill="none" stroke="url(#${sex}-reprom)" stroke-width="2.6"/>` + hitStroke(d, 10);
    };
    return [
      pair("ductus-deferens", duct("patient-right"), duct("patient-left")),
      group("prostate", ell(200, 612, 10, 7, `fill="url(#${sex}-reprom)" stroke="rgba(255,246,236,0.35)" stroke-width="1"`)),
      pair("seminal-vesicle",
        ell(186, 598, 8, 5, `fill="url(#${sex}-reprom)" transform="rotate(-18 186 598)"`),
        ell(214, 598, 8, 5, `fill="url(#${sex}-reprom)" transform="rotate(18 214 598)"`)
      ),
      pair("bulbourethral",
        ell(192, 622, 2.2, 1.8, `fill="url(#${sex}-reprom)"`),
        ell(208, 622, 2.2, 1.8, `fill="url(#${sex}-reprom)"`)
      ),
    ].join("");
  }

  function maleExternal(sex) {
    const testis = (side) => {
      const x = side === "patient-right" ? 186 : 214;
      return ell(x, 708, 13, 17, `fill="url(#${sex}-reprom)" stroke="rgba(255,246,236,0.4)" stroke-width="1"`);
    };
    return [
      `<ellipse class="detail" cx="200" cy="710" rx="34" ry="28" fill="#e7d0bc" fill-opacity="0.55" stroke="rgba(90,60,48,0.35)" stroke-width="1.2"/>`,
      pair("testis", testis("patient-right"), testis("patient-left")),
      pair("epididymis",
        `<path d="M 170 698 C 164 712, 168 726, 178 720" fill="none" stroke="url(#${sex}-reprom)" stroke-width="3.4" stroke-linecap="round"/>${ell(168, 712, 3.4, 9, `fill="url(#${sex}-reprom)"`)}`,
        `<path d="M 230 698 C 236 712, 232 726, 222 720" fill="none" stroke="url(#${sex}-reprom)" stroke-width="3.4" stroke-linecap="round"/>${ell(232, 712, 3.4, 9, `fill="url(#${sex}-reprom)"`)}`
      ),
      group("penis", `
        <path d="M 190 636 H 210 V 724 Q 200 738 190 724 Z" fill="url(#${sex}-reprom)" stroke="rgba(90,60,48,0.28)" stroke-width="1"/>
        <ellipse cx="200" cy="730" rx="11" ry="8" fill="#c4a088"/>
        <path class="detail" d="M 200 646 V 728" stroke="rgba(90,60,50,0.4)" stroke-width="1.3"/>
      `),
    ].join("");
  }

  function occiput(sex, m) {
    const c = m.cx;
    const y = m.headCy;
    const ink = `fill="none" stroke="#3a2c28" stroke-opacity="0.55" stroke-width="1.4" stroke-linecap="round"`;
    return `
      <g class="features">
        <path d="M ${c - m.headRx + 8} ${y - 28} Q ${c} ${y - 56} ${c + m.headRx - 8} ${y - 28}" fill="none" stroke="#2a221e" stroke-opacity="0.4" stroke-width="3"/>
        <path d="M ${c} ${y + 8} v 10" ${ink}/>
      </g>
    `;
  }

  function posteriorMuscles(sex, P) {
    const c = P.m.cx;
    const fill = muscle(sex);
    const trap = (sign) => {
      const outer = c + sign * P.m.shoulder * 0.82;
      return `<path d="M ${c + sign * 10} 128 L ${outer} 196 L ${c + sign * 36} 248 L ${c + sign * 16} 430 L ${c + sign * 8} 168 Z" fill="${fill}"/>`;
    };
    const lat = (sign) => {
      const arm = c + sign * P.m.shoulder * 0.62;
      return `<path d="M ${c + sign * 18} 340 L ${arm} 250 L ${c + sign * (P.m.hip * 0.72)} 520 L ${c + sign * 14} 560 Z" fill="${fill}"/>`;
    };
    const tri = (sign) => {
      const s = P.shoulder(sign);
      const e = P.elbow(sign);
      const mx = (s[0] + e[0]) / 2;
      const my = (s[1] + e[1]) / 2;
      return ell(mx, my, 12, 32, `fill="${fill}" transform="rotate(${sign * 8} ${n(mx)} ${n(my)})"`);
    };
    const glut = (sign) => ell(c + sign * Math.max(P.m.hip * 0.40, 44), 652, 34, 42, `fill="${fill}"`);
    const ham = (sign) => {
      const hp = P.hip(sign);
      const kn = P.knee(sign);
      const mx = (hp[0] + kn[0]) / 2;
      const my = (hp[1] + kn[1]) / 2;
      return ell(mx, my, 15, 52, `fill="${fill}"`);
    };
    const calf = (sign) => {
      const kn = P.knee(sign);
      const an = P.ankle(sign);
      const mx = (kn[0] + an[0]) / 2;
      const my = (kn[1] + an[1]) / 2 - 8;
      return ell(mx, my, 13, 40, `fill="${fill}"`);
    };
    const del = (sign) => ell(c + sign * P.m.shoulder, 198, 22, 26, `fill="${fill}"`);
    return [
      pair("deltoid", del(-1), del(1)),
      pair("trapezius", trap(-1), trap(1)),
      pair("latissimus", lat(-1), lat(1)),
      pair("triceps", tri(-1), tri(1)),
      pair("gluteus-maximus", glut(-1), glut(1)),
      pair("hamstrings", ham(-1), ham(1)),
      pair("soleus", soleus(-1), soleus(1)),
      pair("gastrocnemius", calf(-1), calf(1)),
      pair("gluteus-medius",
        ell(c - Math.max(P.m.hip * 0.52, 50), 604, 18, 14, `fill="${fill}"`),
        ell(c + Math.max(P.m.hip * 0.52, 50), 604, 18, 14, `fill="${fill}"`)
      ),
    ].join("");
    function soleus(sign) {
      const kn = P.knee(sign);
      const an = P.ankle(sign);
      return ell((kn[0] + an[0]) / 2, (kn[1] + an[1]) / 2 + 10, 15, 32, `fill="${fill}"`);
    }
  }

  function muscles(sex, P) {
    const c = P.m.cx;
    const del = (sign) => ell(c + sign * P.m.shoulder, 198, 22, 26, `fill="${muscle(sex)}" stroke="rgba(255,246,236,0.25)" stroke-width="0.8"`);
    const bic = (sign) => {
      const s = P.shoulder(sign);
      const e = P.elbow(sign);
      const mx = (s[0] + e[0]) / 2;
      const my = (s[1] + e[1]) / 2;
      return ell(mx, my, 11, 28, `fill="${muscle(sex)}" transform="rotate(${sign * 8} ${n(mx)} ${n(my)})"`);
    };
    const quad = (sign) => {
      const hp = P.hip(sign);
      const kn = P.knee(sign);
      const mx = (hp[0] + kn[0]) / 2;
      const my = (hp[1] + kn[1]) / 2 - 10;
      return ell(mx, my, 16, 48, `fill="${muscle(sex)}"`);
    };
    const scm = (sign) => {
      const x1 = c + sign * 16;
      const x2 = c + sign * (P.m.shoulder * 0.55);
      return line(x1, 128, x2, 188, 7, muscle(sex));
    };
    const pec = (sign) => {
      const inner = c + sign * 36;
      const outer = c + sign * (P.m.shoulder * 0.7);
      return `<path d="M ${inner} 196 Q ${c + sign * 70} 210 ${outer} 230 Q ${c + sign * 80} 250 ${inner} 236 Z" fill="${muscle(sex)}"/>`;
    };
    const rectus = (sign) => {
      const x = c + sign * 16;
      return `<path d="M ${x - 12} 330 H ${x + 8} V 560 H ${x - 12} Z" fill="${muscle(sex)}"/>
        <path class="detail" d="M ${x - 12} 380 H ${x + 8} M ${x - 12} 430 H ${x + 8} M ${x - 12} 480 H ${x + 8}" stroke="rgba(255,236,230,0.35)"/>`;
    };
    const oblique = (sign) => {
      const x = c + sign * (P.m.waist + 8);
      return `<path d="M ${x} 340 Q ${x + sign * 10} 420 ${x - sign * 6} 500 Q ${x - sign * 20} 460 ${x - sign * 16} 360 Z" fill="${muscle(sex)}"/>`;
    };
    return [
      pair("deltoid", del(-1), del(1)),
      pair("biceps", bic(-1), bic(1)),
      pair("quadriceps", quad(-1), quad(1)),
      pair("scm", scm(-1), scm(1)),
      pair("pectoralis", pec(-1), pec(1)),
      pair("rectus-abdominis", rectus(-1), rectus(1)),
      pair("external-oblique", oblique(-1), oblique(1)),
      pair("sartorius", sart(-1), sart(1)),
      pair("tibialis-anterior", tibialis(-1), tibialis(1)),
    ].join("");
    function sart(sign) {
      const kn = P.knee(sign);
      const d = `M ${c + sign * Math.max(P.m.hip * 0.48, 46)} 526 C ${c + sign * 24} 640, ${kn[0] - sign * 14} ${kn[1] - 16}, ${kn[0] - sign * 6} ${kn[1] + 8}`;
      return `<path d="${d}" fill="none" stroke="${muscle(sex)}" stroke-width="4.6" stroke-linecap="round"/>` + hitStroke(d, 10);
    }
    function tibialis(sign) {
      const kn = P.knee(sign);
      const an = P.ankle(sign);
      const d = `M ${kn[0] + sign * 7} ${kn[1] + 18} L ${an[0] - sign * 5} ${an[1] + 6}`;
      return `<path d="${d}" fill="none" stroke="${muscle(sex)}" stroke-width="5" stroke-linecap="round"/>` + hitStroke(d, 10);
    }
  }

  function mandible(sex, m, posterior) {
    const c = m.cx;
    const y = m.headCy;
    const k = m.headRx / 44;
    const x = (v) => n(c + v * k);
    const yy = (v) => n(y + v * k);
    const fill = bone(sex);
    const d = posterior
      ? `M ${x(-16)} ${yy(20)} L ${x(-24)} ${yy(10)} L ${x(-22)} ${yy(34)} Q ${x(0)} ${yy(44)} ${x(22)} ${yy(34)} L ${x(24)} ${yy(10)} L ${x(16)} ${yy(20)} Q ${x(0)} ${yy(30)} ${x(-16)} ${yy(20)} Z`
      : `M ${x(-24)} ${yy(20)} L ${x(-28)} ${yy(12)} Q ${x(-14)} ${yy(36)} ${x(0)} ${yy(46)} Q ${x(14)} ${yy(36)} ${x(28)} ${yy(12)} L ${x(24)} ${yy(20)} Q ${x(16)} ${yy(34)} ${x(0)} ${yy(36)} Q ${x(-16)} ${yy(34)} ${x(-24)} ${yy(20)} Z`;
    return group("mandible", `<path d="${d}" fill="${fill}" stroke="rgba(255,248,240,0.45)" stroke-width="0.6"/>`);
  }

  function namedVessels(sex, P) {
    const artery = `url(#${sex}-artery)`;
    const vein = `url(#${sex}-vein)`;
    const tube = (d, color) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round"/>` + hitStroke(d, 8);
    const carotid = (sign) => tube(`M ${200 + sign * 4} 208 C ${200 + sign * 5} 184, ${200 + sign * 6} 162, ${200 + sign * 4} 142`, artery);
    const jugular = (sign) => tube(`M ${200 + sign * 8} 204 C ${200 + sign * 8} 180, ${200 + sign * 7} 158, ${200 + sign * 6} 140`, vein);
    const femoral = (sign) => {
      const hp = P.hip(sign);
      const kn = P.knee(sign);
      return tube(`M ${hp[0] - sign * 8} ${hp[1] + 10} L ${kn[0] - sign * 10} ${kn[1] - 2}`, artery);
    };
    return [
      pair("carotid", carotid(-1), carotid(1)),
      pair("jugular", jugular(-1), jugular(1)),
      pair("femoral-artery", femoral(-1), femoral(1)),
    ].join("");
  }

  function masseters(sex, m) {
    const c = m.cx;
    const y = m.headCy;
    const fill = muscle(sex);
    const k = m.headRx / 44;
    const one = (sign) => {
      const x = c + sign * 16 * k;
      return `<path d="M ${n(x)} ${n(y + 16 * k)} L ${n(x + sign * 10 * k)} ${n(y + 20 * k)} L ${n(x + sign * 8 * k)} ${n(y + 36 * k)} L ${n(x - sign * 2 * k)} ${n(y + 32 * k)} Z" fill="${fill}"/>`;
    };
    return pair("masseter", one(-1), one(1));
  }

  function sciatic(sex, P) {
    const color = `url(#${sex}-nerve)`;
    const one = (sign) => {
      const hp = P.hip(sign);
      const kn = P.knee(sign);
      const d = `M ${hp[0] + sign * 2} ${hp[1] + 24} C ${hp[0]} ${(hp[1] + kn[1]) / 2}, ${kn[0] + sign * 3} ${kn[1] - 24}, ${kn[0] - sign * 2} ${kn[1] + 6}`;
      return `<path d="${d}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>` + hitStroke(d, 10);
    };
    return pair("sciatic", one(-1), one(1));
  }

  function lymphNodes(sex, P) {
    const dot = (x, y) => `<circle cx="${n(x)}" cy="${n(y)}" r="3.4" fill="url(#${sex}-lymph)" stroke="rgba(255,246,236,0.3)" stroke-width="0.6"/>`;
    const c = P.m.cx;
    const bits = [];
    [-1, 1].forEach((sign) => {
      bits.push(dot(c + sign * 28, 150));
      bits.push(dot(c + sign * 36, 162));
      bits.push(dot(c + sign * (P.m.shoulder - 10), 230));
      bits.push(dot(c + sign * (P.m.hip * 0.55), 545));
    });
    return group("lymph-nodes", bits.join(""));
  }

  window.ATLAS_HOME = HOME;
  window.renderBody = renderBody;
})();
