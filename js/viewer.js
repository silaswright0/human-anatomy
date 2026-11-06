import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

const cache = new Map();
const views = new Map();
let looping = false;
let aspect = "anterior";

const SOFT = { integumentary: 0.16, muscular: 0.4 };

function loadModel(url) {
  if (!cache.has(url)) cache.set(url, loader.loadAsync(url));
  return cache.get(url);
}

function systemColor(systems) {
  const list = window.ATLAS_SYSTEMS || [];
  const hit = list.find((system) => system.id === systems[0]);
  return new THREE.Color(hit ? hit.color : "#eadcc8");
}

function resize(state) {
  const width = state.container.clientWidth || 320;
  const height = state.container.clientHeight || 480;
  state.renderer.setSize(width, height, false);
  state.camera.aspect = width / Math.max(height, 1);
  state.camera.updateProjectionMatrix();
  state.dirty = true;
}

function placeCamera(state) {
  const target = state.target;
  const radius = state.radius;
  const phi = state.phi;
  const theta = state.theta;
  state.camera.position.set(
    target.x + radius * Math.sin(phi) * Math.sin(theta),
    target.y + radius * Math.cos(phi),
    target.z + radius * Math.sin(phi) * Math.cos(theta)
  );
  state.camera.lookAt(target);
  state.key.position.copy(state.camera.position);
}

function ease(state) {
  const goal = state.goal;
  if (!goal) return;
  const step = 0.14;
  state.theta += (goal.theta - state.theta) * step;
  state.phi += (goal.phi - state.phi) * step;
  state.radius += (goal.radius - state.radius) * step;
  state.target.lerp(goal.target, step);
  const settled = Math.abs(goal.theta - state.theta) < 0.004
    && Math.abs(goal.phi - state.phi) < 0.004
    && Math.abs(goal.radius - state.radius) < 0.01
    && state.target.distanceTo(goal.target) < 0.004;
  if (settled) {
    state.theta = goal.theta;
    state.phi = goal.phi;
    state.radius = goal.radius;
    state.target.copy(goal.target);
    state.goal = null;
  }
  state.dirty = true;
}

function prepare(object, sex) {
  object.traverse((node) => {
    if (!node.isMesh) return;
    const part = window.ATLAS_PARTS[node.name];
    const systems = part && part.systems && part.systems.length ? part.systems : ["skeletal"];
    const material = new THREE.MeshLambertMaterial({
      color: systemColor(systems),
      emissive: new THREE.Color(0x000000),
      transparent: true,
      opacity: 1,
      depthWrite: true,
      side: THREE.DoubleSide,
    });
    node.material = material;
    node.userData.atlas = {
      id: node.name,
      systems,
      side: part ? part.side || null : null,
      sex,
    };
  });
}

function fit(state) {
  const box = new THREE.Box3().setFromObject(state.root);
  if (box.isEmpty()) return;
  const size = box.getSize(new THREE.Vector3());
  if (size.y < size.z * 0.5 && size.z > 0.2) {
    state.root.rotation.x = -Math.PI / 2;
  }
  const again = new THREE.Box3().setFromObject(state.root);
  const span = again.getSize(new THREE.Vector3());
  const center = again.getCenter(new THREE.Vector3());
  const height = Math.max(span.y, 0.001);
  if (height > 5 || height < 0.4) {
    const scale = 1.7 / height;
    state.root.scale.multiplyScalar(scale);
    state.root.position.sub(center.multiplyScalar(scale));
  } else {
    state.root.position.sub(center);
  }
  let sternum = null;
  let vertebra = null;
  state.root.traverse((node) => {
    if (!node.isMesh) return;
    const name = node.name || "";
    if (!sternum && /sternum/i.test(name)) sternum = node;
    if (!vertebra && /vertebra/i.test(name)) vertebra = node;
  });
  if (sternum && vertebra) {
    const front = new THREE.Box3().setFromObject(sternum).getCenter(new THREE.Vector3()).z;
    const back = new THREE.Box3().setFromObject(vertebra).getCenter(new THREE.Vector3()).z;
    if (back > front) state.root.rotation.y += Math.PI;
  }
  const fitted = new THREE.Box3().setFromObject(state.root);
  const fittedCenter = fitted.getCenter(new THREE.Vector3());
  state.root.position.sub(fittedCenter);
  const fittedSize = new THREE.Box3().setFromObject(state.root).getSize(new THREE.Vector3());
  const fov = (state.camera.fov * Math.PI) / 180;
  const radius = (fittedSize.y * 0.58) / Math.tan(fov / 2);
  state.radius = radius;
  state.theta = aspect === "posterior" ? Math.PI : 0;
  state.phi = 1.48;
  state.target.set(0, 0, 0);
  state.home = {
    theta: state.theta,
    phi: state.phi,
    radius,
    target: state.target.clone(),
  };
  state.dirty = true;
}

function eachMesh(state, visit) {
  state.root.traverse((node) => {
    if (node.isMesh && node.userData.atlas) visit(node);
  });
}

function paintSystems(state, enabled, selection) {
  const solo = enabled.size === 1;
  let visible = 0;
  eachMesh(state, (node) => {
    const info = node.userData.atlas;
    const on = info.systems.some((system) => enabled.has(system));
    const selected = selection && selection.id === info.id && selection.sex === state.sex;
    const hot = state.hot === info.id;
    let opacity = 0;
    if (on) {
      const base = SOFT[info.systems[0]] == null ? 0.92 : SOFT[info.systems[0]];
      opacity = selected ? 1 : (solo ? 1 : base);
      if (selection && !selected) opacity *= 0.38;
    }
    node.visible = opacity > 0.03;
    node.material.opacity = opacity;
    node.material.depthWrite = opacity > 0.55;
    node.material.transparent = opacity < 0.98;
    node.material.emissive.set(selected ? 0x5a4318 : hot ? 0x3a2c12 : 0x000000);
    if (node.visible) visible += 1;
  });
  const note = state.container.parentElement && state.container.parentElement.querySelector(".coverage");
  if (note) note.hidden = visible > 0;
  state.dirty = true;
}

function raycast(state, event) {
  const rect = state.canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  state.raycaster.setFromCamera({ x, y }, state.camera);
  const meshes = [];
  eachMesh(state, (node) => {
    if (node.visible) meshes.push(node);
  });
  return state.raycaster.intersectObjects(meshes, false).slice(0, 8).map((hit, index) => ({
    id: hit.object.userData.atlas.id,
    side: hit.object.userData.atlas.side,
    sex: state.sex,
    depth: index,
    ghost: hit.object.material.opacity < 0.5,
  }));
}

function bind(state) {
  const canvas = state.canvas;
  canvas.addEventListener("pointerdown", (event) => {
    state.drag = { x: event.clientX, y: event.clientY, moved: false, theta: state.theta, phi: state.phi };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (state.drag) {
      const dx = event.clientX - state.drag.x;
      const dy = event.clientY - state.drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) state.drag.moved = true;
      state.goal = null;
      state.theta = state.drag.theta - dx * 0.008;
      state.phi = Math.min(2.6, Math.max(0.35, state.drag.phi + dy * 0.006));
      state.dirty = true;
      return;
    }
    if (!state.ready) return;
    const stack = raycast(state, event);
    const chosen = stack.find((item) => item.id !== "skin" && !item.ghost) || stack[0] || null;
    state.hot = chosen ? chosen.id : null;
    paintSystems(state, state.enabled, state.selection);
    state.container.dispatchEvent(new CustomEvent("atlas-hover", {
      bubbles: true,
      detail: chosen ? { event, chosen, stack } : null,
    }));
  });
  canvas.addEventListener("pointerup", (event) => {
    if (state.drag) canvas.releasePointerCapture(event.pointerId);
    state.drag = state.drag && state.drag.moved ? state.drag : null;
  });
  canvas.addEventListener("pointerleave", () => {
    if (state.drag) return;
    state.hot = null;
    paintSystems(state, state.enabled, state.selection);
    state.container.dispatchEvent(new CustomEvent("atlas-hover", { bubbles: true, detail: null }));
  });
  canvas.addEventListener("click", (event) => {
    if (state.drag && state.drag.moved) {
      state.drag = null;
      return;
    }
    state.drag = null;
    const stack = raycast(state, event);
    const chosen = stack.find((item) => item.id !== "skin" && !item.ghost) || stack.find((item) => item.id !== "skin") || stack[0];
    if (!chosen) return;
    state.container.dispatchEvent(new CustomEvent("atlas-pick", {
      bubbles: true,
      detail: { id: chosen.id, side: chosen.side, sex: state.sex, stack },
    }));
  });
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    state.goal = null;
    state.radius = Math.min(state.home.radius * 2.4, Math.max(0.18, state.radius * (event.deltaY > 0 ? 1.08 : 0.92)));
    state.dirty = true;
  }, { passive: false });
}

async function fill(state, sex) {
  state.container.dataset.loading = "1";
  const urls = sex === "female" ? ["models/female.glb"] : ["models/male.glb", "models/supplement.glb"];
  for (const url of urls) {
    try {
      const gltf = await loadModel(url);
      const clone = gltf.scene.clone(true);
      prepare(clone, sex);
      state.root.add(clone);
    } catch (err) {
      if (!url.includes("supplement")) {
        state.container.dataset.error = "1";
        console.error(err);
      }
    }
  }
  fit(state);
  state.ready = true;
  delete state.container.dataset.loading;
  paintSystems(state, state.enabled, state.selection);
  if (state.pendingFocus) {
    const pending = state.pendingFocus;
    state.pendingFocus = null;
    focus(state.sex, pending);
  }
}

function mount(container, sex) {
  const previous = views.get(sex);
  if (previous) {
    previous.renderer.dispose();
    views.delete(sex);
  }
  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 80);
  const root = new THREE.Group();
  scene.add(root);
  scene.add(new THREE.AmbientLight(0xffffff, 0.62));
  scene.add(new THREE.HemisphereLight(0xfff6ec, 0x1a2433, 0.55));
  const key = new THREE.DirectionalLight(0xfff4e8, 1.05);
  scene.add(key);
  const state = {
    sex,
    container,
    canvas,
    renderer,
    scene,
    camera,
    root,
    key,
    raycaster: new THREE.Raycaster(),
    theta: 0,
    phi: 1.22,
    radius: 3.2,
    target: new THREE.Vector3(0, 0.05, 0),
    home: { theta: 0, phi: 1.22, radius: 3.2, target: new THREE.Vector3(0, 0.05, 0) },
    goal: null,
    hot: null,
    enabled: new Set(window.ATLAS_SYSTEMS.map((system) => system.id)),
    selection: null,
    ready: false,
    dirty: true,
    drag: null,
  };
  views.set(sex, state);
  resize(state);
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(() => resize(state)).observe(container);
  bind(state);
  if (!looping) {
    looping = true;
    const tick = () => {
      requestAnimationFrame(tick);
      views.forEach((view) => {
        ease(view);
        if (!view.dirty) return;
        placeCamera(view);
        view.renderer.render(view.scene, view.camera);
        view.dirty = false;
      });
    };
    requestAnimationFrame(tick);
  }
  fill(state, sex);
}

function aspectTheta(view) {
  return view === "posterior" ? Math.PI : 0;
}

window.ATLAS_VIEW = {
  mount,
  unmountAll() {
    views.forEach((state) => {
      state.root.traverse((node) => {
        if (node.isMesh && node.material) node.material.dispose();
      });
      state.renderer.dispose();
    });
    views.clear();
  },
  setSystems(enabled, selection) {
    views.forEach((state) => {
      state.enabled = enabled;
      state.selection = selection;
      paintSystems(state, enabled, selection);
    });
  },
  setAspect(view) {
    aspect = view === "posterior" ? "posterior" : "anterior";
    const theta = aspectTheta(aspect);
    views.forEach((state) => {
      state.goal = {
        theta,
        phi: state.phi,
        radius: state.radius,
        target: state.target.clone(),
      };
      state.home.theta = theta;
    });
  },
  focus(sex, id) {
    const state = views.get(sex);
    if (!state) return false;
    if (!state.ready) {
      state.pendingFocus = id;
      return false;
    }
    let mesh = null;
    eachMesh(state, (node) => {
      if (!mesh && node.userData.atlas.id === id) mesh = node;
    });
    if (!mesh) return false;
    const box = new THREE.Box3().setFromObject(mesh);
    if (box.isEmpty()) return false;
    const center = box.getCenter(new THREE.Vector3());
    const span = box.getSize(new THREE.Vector3());
    const radius = Math.max(span.x, span.y, span.z, 0.05) * 2.4;
    state.goal = { theta: state.theta, phi: Math.min(state.phi, 1.35), radius, target: center };
    state.zoomed = true;
    return true;
  },
  reset() {
    views.forEach((state) => {
      state.zoomed = false;
      state.goal = {
        theta: state.home.theta,
        phi: state.home.phi,
        radius: state.home.radius,
        target: state.home.target.clone(),
      };
    });
  },
  zoomed() {
    let on = false;
    views.forEach((state) => {
      if (state.zoomed) on = true;
    });
    return on;
  },
};
