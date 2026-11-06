import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { acceleratedRaycast, computeBatchedBoundsTree, disposeBatchedBoundsTree, CENTER } from "three-mesh-bvh";

THREE.Mesh.prototype.raycast = acceleratedRaycast;
THREE.BatchedMesh.prototype.raycast = acceleratedRaycast;
THREE.BatchedMesh.prototype.computeBoundsTree = computeBatchedBoundsTree;
THREE.BatchedMesh.prototype.disposeBoundsTree = disposeBatchedBoundsTree;

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

const cache = new Map();
const views = new Map();
const jobs = [];
let looping = false;
let pumping = false;
let aspect = "anterior";

const SOFT = { integumentary: 0.16, muscular: 0.4 };
const CHUNK_VERTS = 700000;
const scratchColor = new THREE.Color();
const warm = new THREE.Color(0xffe2a8);
const scratchVec = new THREE.Vector3();
const scratchVec2 = new THREE.Vector3();
const scratchVec4 = new THREE.Vector4();
const scratchBox = new THREE.Box3();
const scratchBox2 = new THREE.Box3();
const scratchMat = new THREE.Matrix4();
const rootInverse = new THREE.Matrix4();

function loadModel(url) {
  if (!cache.has(url)) cache.set(url, loader.loadAsync(url));
  return cache.get(url);
}

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  const step = 1 << 20;
  return new Promise((resolve) => {
    let index = 0;
    const run = () => {
      const end = Math.min(index + step, binary.length);
      for (let i = index; i < end; i += 1) bytes[i] = binary.charCodeAt(i);
      index = end;
      if (index < binary.length) setTimeout(run, 0);
      else resolve(bytes.buffer);
    };
    run();
  });
}

function parseModel(buffer) {
  return new Promise((resolve, reject) => {
    loader.parse(buffer, "", resolve, reject);
  });
}

function loadWallFit() {
  if (window.ATLAS_WALL_FIT) return Promise.resolve(window.ATLAS_WALL_FIT);
  const key = "wall-fit";
  if (!cache.has(key)) {
    cache.set(key, location.protocol === "file:"
      ? new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "models/female-wall.data.js";
        script.onload = () => resolve(window.ATLAS_WALL_FIT);
        script.onerror = () => reject(new Error("Missing wall fit"));
        document.head.appendChild(script);
      })
      : fetch("models/female-wall.json").then((res) => {
        if (!res.ok) throw new Error("Missing wall fit");
        return res.json();
      }));
  }
  return cache.get(key);
}

function loadPackedModel(name) {
  const key = `packed:${name}`;
  if (!cache.has(key)) {
    cache.set(key, new Promise((resolve, reject) => {
      const run = async () => {
        const packed = window.ATLAS_MODEL_B64 && window.ATLAS_MODEL_B64[name];
        if (!packed) {
          reject(new Error(`Missing packed model ${name}`));
          return;
        }
        const buffer = await decodeBase64(packed);
        window.ATLAS_MODEL_B64[name] = "";
        parseModel(buffer).then(resolve, reject);
      };
      if (window.ATLAS_MODEL_B64 && window.ATLAS_MODEL_B64[name]) {
        run();
        return;
      }
      const script = document.createElement("script");
      script.src = `models/${name}.data.js`;
      script.onload = () => run();
      script.onerror = () => reject(new Error(`Missing packed model ${name}`));
      document.head.appendChild(script);
    }));
  }
  return cache.get(key);
}

function showLoadError(container) {
  container.dataset.error = "1";
  let note = container.querySelector(".load-error");
  if (!note) {
    note = document.createElement("p");
    note.className = "load-error";
    container.appendChild(note);
  }
  note.textContent = location.protocol === "file:"
    ? "The browser blocked the models because this page was opened as a file."
    : "The reference model could not be loaded.";
}

function systemColor(systems) {
  const list = window.ATLAS_SYSTEMS || [];
  const hit = list.find((system) => system.id === systems[0]);
  return new THREE.Color(hit ? hit.color : "#eadcc8");
}

function baseOpacity(systems) {
  const soft = SOFT[systems[0]];
  return soft == null ? 1 : soft;
}

function shown(state) {
  return state.container.clientWidth > 1 && state.container.clientHeight > 1;
}

function resize(state) {
  const width = state.container.clientWidth;
  const height = state.container.clientHeight;
  if (width < 2 || height < 2) return;
  state.renderer.setSize(width, height, false);
  state.camera.aspect = width / height;
  state.camera.updateProjectionMatrix();
  state.dirty = true;
}

function setQuality(state, cap) {
  const next = Math.min(window.devicePixelRatio || 1, cap);
  if (state.pixelRatio === next) return;
  state.pixelRatio = next;
  state.renderer.setPixelRatio(next);
  resize(state);
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

function tag(object, sex, shared) {
  object.traverse((node) => {
    if (!node.isMesh) return;
    const part = window.ATLAS_PARTS && window.ATLAS_PARTS[node.name];
    const systems = part && part.systems && part.systems.length ? part.systems : ["skeletal"];
    node.userData.atlas = {
      id: node.name,
      systems,
      side: part ? part.side || null : null,
      sex,
      shared: !!shared,
    };
  });
}

function fit(state, allowScale, keepView) {
  const box = new THREE.Box3().setFromObject(state.root);
  if (box.isEmpty()) return;
  const size = box.getSize(new THREE.Vector3());
  if (size.y < size.z * 0.5 && size.z > 0.2) state.root.rotation.x = -Math.PI / 2;
  const again = new THREE.Box3().setFromObject(state.root);
  const span = again.getSize(new THREE.Vector3());
  const center = again.getCenter(new THREE.Vector3());
  const height = Math.max(span.y, 0.001);
  if (allowScale && (height > 5 || height < 0.4)) {
    const scale = 1.7 / height;
    state.root.scale.multiplyScalar(scale);
    state.root.position.sub(center.multiplyScalar(scale));
  } else {
    state.root.position.sub(center);
  }
  let sternum = null;
  let vertebra = null;
  state.root.traverse((node) => {
    if (!node.isMesh || node.isBatchedMesh) return;
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
  if (!keepView) {
    state.theta = aspect === "posterior" ? Math.PI : 0;
    state.phi = 1.48;
  }
  state.target.set(0, 0, 0);
  state.home = {
    theta: keepView ? state.home.theta : state.theta,
    phi: keepView ? state.home.phi : state.phi,
    radius,
    target: state.target.clone(),
  };
  state.dirty = true;
}

function plainVector(attribute) {
  if (
    attribute
    && attribute.itemSize === 3
    && !attribute.normalized
    && !attribute.isInterleavedBufferAttribute
    && attribute.array instanceof Float32Array
    && attribute.array.length === attribute.count * 3
  ) return attribute;
  const count = attribute.count;
  const array = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    array[i * 3] = attribute.getX(i);
    array[i * 3 + 1] = attribute.getY(i);
    array[i * 3 + 2] = attribute.getZ(i);
  }
  return new THREE.BufferAttribute(array, 3);
}

function standardize(source) {
  const position = source.getAttribute("position");
  if (!position || !position.count || position.itemSize < 3) return null;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", plainVector(position));
  const index = source.getIndex();
  if (index) geometry.setIndex(index);
  else {
    const count = position.count;
    const array = count > 65535 ? new Uint32Array(count) : new Uint16Array(count);
    for (let i = 0; i < count; i += 1) array[i] = i;
    geometry.setIndex(new THREE.BufferAttribute(array, 1));
  }
  const normal = source.getAttribute("normal");
  if (normal && normal.itemSize >= 3) geometry.setAttribute("normal", plainVector(normal));
  else geometry.computeVertexNormals();
  return geometry;
}

function remember(state, record) {
  state.records.push(record);
  let bucket = state.byId.get(record.id);
  if (!bucket) {
    bucket = [];
    state.byId.set(record.id, bucket);
  }
  bucket.push(record);
  record.batch.userData.byInstance[record.instanceId] = record;
}

function releasePrepared(geometry, source) {
  if (!geometry) return;
  for (const name of Object.keys(geometry.attributes)) {
    if (source.getAttribute(name) === geometry.getAttribute(name)) geometry.deleteAttribute(name);
  }
  if (source.getIndex() && geometry.getIndex() === source.getIndex()) geometry.setIndex(null);
  geometry.dispose();
}

function makeBatch(state, meshes, rootInv) {
  const prepared = [];
  let vertCount = 0;
  let indexCount = 0;
  for (const mesh of meshes) {
    const geometry = standardize(mesh.geometry);
    if (!geometry) continue;
    const position = geometry.getAttribute("position");
    const index = geometry.getIndex();
    vertCount += position.count;
    indexCount += index.count;
    prepared.push({ mesh, geometry });
  }
  if (!prepared.length) return null;
  const systems = prepared[0].mesh.userData.atlas.systems;
  const opacity = baseOpacity(systems);
  const material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.FrontSide,
    transparent: opacity < 0.98,
    opacity: 1,
    depthWrite: opacity > 0.55,
  });
  const batch = new THREE.BatchedMesh(prepared.length, vertCount, Math.max(indexCount, 1), material);
  batch.frustumCulled = false;
  batch.perObjectFrustumCulled = true;
  batch.sortObjects = opacity < 0.98;
  batch.userData.byInstance = [];
  state.root.add(batch);
  for (const item of prepared) {
    const info = item.mesh.userData.atlas;
    try {
      const geometryId = batch.addGeometry(item.geometry);
      const instanceId = batch.addInstance(geometryId);
      scratchMat.multiplyMatrices(rootInv, item.mesh.matrixWorld);
      batch.setMatrixAt(instanceId, scratchMat);
      releasePrepared(item.geometry, item.mesh.geometry);
      remember(state, {
        id: info.id,
        side: info.side,
        sex: info.sex,
        systems: info.systems,
        shared: !!info.shared,
        batch,
        instanceId,
        geometryId,
        baseColor: systemColor(info.systems),
        opacity: -1,
        visible: false,
        hot: false,
        selected: false,
      });
    } catch (err) {
      console.error(err);
    }
  }
  const added = batch.userData.byInstance.some(Boolean);
  if (!added) {
    batch.removeFromParent();
    batch.geometry.dispose();
    batch.material.dispose();
    return null;
  }
  batch.computeBoundingBox();
  batch.computeBoundingSphere();
  return batch;
}

function batchMeshes(state) {
  const meshes = [];
  state.root.updateWorldMatrix(true, true);
  state.root.traverse((node) => {
    if (node.isMesh && !node.isBatchedMesh && node.userData.atlas) meshes.push(node);
  });
  rootInverse.copy(state.root.matrixWorld).invert();
  const groups = new Map();
  for (const mesh of meshes) {
    const key = mesh.userData.atlas.systems[0];
    let list = groups.get(key);
    if (!list) {
      list = [];
      groups.set(key, list);
    }
    list.push(mesh);
  }
  for (const list of groups.values()) {
    let chunk = [];
    let verts = 0;
    let indices = 0;
    const flush = () => {
      if (!chunk.length) return;
      const batch = makeBatch(state, chunk, rootInverse);
      if (batch) state.batches.push(batch);
      chunk = [];
      verts = 0;
      indices = 0;
    };
    for (const mesh of list) {
      const position = mesh.geometry.getAttribute("position");
      if (!position || !position.count) continue;
      const index = mesh.geometry.getIndex();
      const indexCount = index ? index.count : position.count;
      if (chunk.length && (verts + position.count > CHUNK_VERTS || indices + indexCount > CHUNK_VERTS * 3)) flush();
      chunk.push(mesh);
      verts += position.count;
      indices += indexCount;
    }
    flush();
  }
}

function stripSourceMeshes(state) {
  const doomed = [];
  state.root.traverse((node) => {
    if (node !== state.root && !node.isBatchedMesh) doomed.push(node);
  });
  for (const node of doomed) node.removeFromParent();
}

function writeColor(record) {
  scratchColor.copy(record.baseColor);
  if (record.dimmed) scratchColor.multiplyScalar(0.45);
  if (record.selected) scratchColor.lerp(warm, 0.45);
  else if (record.hot) scratchColor.lerp(warm, 0.28);
  scratchVec4.set(scratchColor.r, scratchColor.g, scratchColor.b, Math.max(record.opacity, 0));
  record.batch.setColorAt(record.instanceId, scratchVec4);
}

function syncBatchMaterial(batch) {
  const material = batch.material;
  let blend = false;
  let solid = true;
  let any = false;
  const records = batch.userData.byInstance;
  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    if (!record || !record.visible) continue;
    any = true;
    if (record.opacity < 0.98) blend = true;
    if (record.opacity <= 0.55) solid = false;
  }
  const transparent = blend;
  const depthWrite = any && solid;
  if (material.transparent !== transparent || material.depthWrite !== depthWrite) {
    material.transparent = transparent;
    material.depthWrite = depthWrite;
    material.needsUpdate = true;
  }
  batch.sortObjects = transparent;
}

function paintSystems(state, enabled, selection) {
  if (!state.batched) return;
  const solo = enabled.size === 1;
  let visible = 0;
  const dirty = new Set();
  const active = new Set();
  for (const record of state.records) {
    const on = record.systems.some((system) => enabled.has(system));
    const selected = !!(selection && selection.id === record.id && selection.sex === state.sex);
    const solid = baseOpacity(record.systems) >= 0.98;
    let opacity = 0;
    if (on) {
      opacity = selected || solo ? 1 : baseOpacity(record.systems);
      if (selection && !selected && !solid) opacity *= 0.38;
    }
    const isVisible = opacity > 0.03;
    const dimmed = !!(on && selection && !selected && solid);
    if (isVisible) {
      visible += 1;
      active.add(record.batch);
    }
    const hot = state.hotId === record.id;
    if (
      record.opacity === opacity
      && record.visible === isVisible
      && record.hot === hot
      && record.selected === selected
      && record.dimmed === dimmed
    ) continue;
    record.opacity = opacity;
    record.visible = isVisible;
    record.dimmed = dimmed;
    record.hot = hot;
    record.selected = selected;
    record.batch.setVisibleAt(record.instanceId, isVisible);
    writeColor(record);
    dirty.add(record.batch);
  }
  for (const batch of state.batches) batch.visible = active.has(batch);
  dirty.forEach((batch) => syncBatchMaterial(batch));
  const note = state.container.parentElement && state.container.parentElement.querySelector(".coverage");
  if (note) note.hidden = visible > 0;
  state.dirty = true;
}

function retint(state, id) {
  if (!id) return;
  const list = state.byId.get(id);
  if (!list) return;
  const dirty = new Set();
  for (const record of list) {
    record.hot = state.hotId === id;
    writeColor(record);
    dirty.add(record.batch);
  }
}

function setHot(state, id) {
  if (state.hotId === id) return;
  const previous = state.hotId;
  state.hotId = id;
  retint(state, previous);
  retint(state, id);
  state.dirty = true;
}

function collectHits(state, batches, hits) {
  for (let b = 0; b < batches.length; b += 1) {
    const batch = batches[b];
    if (!batch.visible) continue;
    const found = state.raycaster.intersectObject(batch, false);
    for (let i = 0; i < found.length; i += 1) {
      const hit = found[i];
      const record = batch.userData.byInstance && batch.userData.byInstance[hit.batchId];
      if (!record || !record.visible) continue;
      hits.push(hit);
    }
  }
}

function raycast(state, point) {
  if (!state.pickReady) return [];
  const rect = state.canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return [];
  const x = ((point.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((point.clientY - rect.top) / rect.height) * 2 + 1;
  state.raycaster.setFromCamera({ x, y }, state.camera);
  const opaque = [];
  const soft = [];
  for (const batch of state.batches) {
    if (!batch.visible) continue;
    if (batch.material && batch.material.transparent) soft.push(batch);
    else opaque.push(batch);
  }
  const hits = [];
  collectHits(state, opaque, hits);
  collectHits(state, soft, hits);
  hits.sort((a, b) => a.distance - b.distance);
  const stack = [];
  const limit = Math.min(8, hits.length);
  for (let i = 0; i < limit; i += 1) {
    const hit = hits[i];
    const record = hit.object.userData.byInstance && hit.object.userData.byInstance[hit.batchId];
    if (!record) continue;
    stack.push({
      id: record.id,
      side: record.side,
      sex: state.sex,
      depth: stack.length,
      ghost: record.opacity < 0.5,
      shared: !!record.shared,
    });
  }
  return stack;
}

function chooseHit(stack) {
  return stack.find((item) => item.id !== "skin" && !item.ghost)
    || stack.find((item) => item.id !== "skin")
    || stack[0]
    || null;
}

const panKeys = new Set();

function typingTarget() {
  const node = document.activeElement;
  if (!node) return false;
  const tag = node.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || node.isContentEditable;
}

function steerViews() {
  const hover = document.querySelector(".body-view:hover");
  const picked = [];
  views.forEach((state) => {
    if (!shown(state)) return;
    if (!hover || hover === state.container || state.container.contains(hover)) picked.push(state);
  });
  return picked.length ? picked : [];
}

function screenAxes(state) {
  const phi = state.phi;
  const theta = state.theta;
  const sinPhi = Math.sin(phi);
  const forwardX = -sinPhi * Math.sin(theta);
  const forwardY = -Math.cos(phi);
  const forwardZ = -sinPhi * Math.cos(theta);
  const span = Math.hypot(forwardX, forwardZ) || 1;
  const rightX = -forwardZ / span;
  const rightZ = forwardX / span;
  const rise = forwardY;
  const upX = -forwardX * rise;
  const upY = 1 - forwardY * rise;
  const upZ = -forwardZ * rise;
  const upSpan = Math.hypot(upX, upY, upZ) || 1;
  return {
    rightX,
    rightZ,
    upX: upX / upSpan,
    upY: upY / upSpan,
    upZ: upZ / upSpan,
  };
}

function steer(dt) {
  let x = 0;
  let y = 0;
  if (panKeys.has("ArrowLeft") || panKeys.has("a") || panKeys.has("A")) x -= 1;
  if (panKeys.has("ArrowRight") || panKeys.has("d") || panKeys.has("D")) x += 1;
  if (panKeys.has("ArrowUp") || panKeys.has("w") || panKeys.has("W")) y += 1;
  if (panKeys.has("ArrowDown") || panKeys.has("s") || panKeys.has("S")) y -= 1;
  if (!x && !y) return;
  const viewsToMove = steerViews();
  for (const state of viewsToMove) {
    state.goal = null;
    const step = dt * state.radius * 0.12;
    const axes = screenAxes(state);
    state.target.x += (-axes.rightX * x - axes.upX * y) * step;
    state.target.y += (-axes.upY * y) * step;
    state.target.z += (-axes.rightZ * x - axes.upZ * y) * step;
    state.target.x = Math.min(0.6, Math.max(-0.6, state.target.x));
    state.target.y = Math.min(1.85, Math.max(-0.25, state.target.y));
    state.target.z = Math.min(0.6, Math.max(-0.6, state.target.z));
    state.dirty = true;
  }
}

const panNames = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "a", "d", "w", "s", "A", "D", "W", "S"]);

window.addEventListener("keydown", (event) => {
  if (typingTarget() || !panNames.has(event.key)) return;
  panKeys.add(event.key);
  event.preventDefault();
});
window.addEventListener("keyup", (event) => {
  panKeys.delete(event.key);
});
window.addEventListener("blur", () => panKeys.clear());

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
      if (Math.abs(dx) + Math.abs(dy) > 4) {
        state.drag.moved = true;
        setQuality(state, 1);
      }
      state.goal = null;
      state.theta = state.drag.theta - dx * 0.008;
      state.phi = Math.min(2.6, Math.max(0.35, state.drag.phi + dy * 0.006));
      state.dirty = true;
      return;
    }
    if (!state.ready) return;
    state.hoverPoint = { clientX: event.clientX, clientY: event.clientY };
    if (state.hoverFrame) return;
    state.hoverFrame = requestAnimationFrame(() => {
      state.hoverFrame = 0;
      const point = state.hoverPoint;
      if (!point || state.drag) return;
      const stack = raycast(state, point);
      const chosen = chooseHit(stack);
      setHot(state, chosen ? chosen.id : null);
      state.container.dispatchEvent(new CustomEvent("atlas-hover", {
        bubbles: true,
        detail: chosen ? { event: point, chosen, stack } : null,
      }));
    });
  });
  canvas.addEventListener("pointerup", (event) => {
    if (state.drag) canvas.releasePointerCapture(event.pointerId);
    if (state.drag && state.drag.moved) {
      setQuality(state, 1.5);
      return;
    }
    state.drag = null;
  });
  canvas.addEventListener("pointerleave", () => {
    if (state.drag) return;
    state.hoverPoint = null;
    setHot(state, null);
    state.container.dispatchEvent(new CustomEvent("atlas-hover", { bubbles: true, detail: null }));
  });
  canvas.addEventListener("click", (event) => {
    if (state.drag && state.drag.moved) {
      state.drag = null;
      return;
    }
    state.drag = null;
    const stack = raycast(state, event);
    const chosen = chooseHit(stack);
    if (!chosen) return;
    state.container.dispatchEvent(new CustomEvent("atlas-pick", {
      bubbles: true,
      detail: { id: chosen.id, side: chosen.side, sex: state.sex, shared: !!chosen.shared, stack },
    }));
  });
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    state.goal = null;
    const homeRadius = state.home ? state.home.radius : state.radius;
    state.radius = Math.min(homeRadius * 2.4, Math.max(0.18, state.radius * (event.deltaY > 0 ? 1.08 : 0.92)));
    state.dirty = true;
  }, { passive: false });
}

const copiedLayers = new Map();

function layerNames(sex) {
  return sex === "female"
    ? ["female-organs", "shared-wall", "female-gaps"]
    : ["male-organs", "shared-wall", "male-gaps"];
}

function requestModel(name) {
  return location.protocol === "file:" ? loadPackedModel(name) : loadModel(`models/${name}.glb`);
}

function warmModels(sex) {
  for (const name of layerNames(sex)) requestModel(name);
  loadWallFit();
}

function disposeGltf(gltf) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  gltf.scene.traverse((node) => {
    if (!node.isMesh) return;
    if (node.geometry) geometries.add(node.geometry);
    const list = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of list) if (material) materials.add(material);
  });
  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) {
    for (const value of Object.values(material)) {
      if (value && value.isTexture) textures.add(value);
    }
    material.dispose();
  }
  for (const texture of textures) texture.dispose();
}

function releaseSource(name, sex) {
  let done = copiedLayers.get(name);
  if (!done) {
    done = new Set();
    copiedLayers.set(name, done);
  }
  done.add(sex);
  const owners = name === "shared-wall" ? ["female", "male"] : [name.startsWith("female") ? "female" : "male"];
  const stillNeeded = owners.some((other) => {
    if (done.has(other)) return false;
    if (views.has(other) || jobs.some((job) => job.sex === other)) return true;
    return name === "shared-wall";
  });
  if (stillNeeded) return;
  const key = location.protocol === "file:" ? `packed:${name}` : `models/${name}.glb`;
  const pending = cache.get(key);
  cache.delete(key);
  if (!pending || !pending.then) return;
  pending.then((gltf) => {
    if (gltf && gltf.scene) disposeGltf(gltf);
  }).catch(() => {});
}

function viewAlive(state, sex) {
  return views.get(sex) === state;
}

function present(state) {
  state.batched = state.batches.length > 0;
  state.ready = true;
  paintSystems(state, state.enabled, state.selection);
  if (state.pendingFocus && focus(state.sex, state.pendingFocus)) state.pendingFocus = null;
  delete state.container.dataset.loading;
}

async function indexBatches(state) {
  await new Promise((resolve) => setTimeout(resolve, 0));
  let count = 0;
  try {
    for (const batch of state.batches) {
      if (!viewAlive(state, state.sex)) return;
      const geometryCount = batch._geometryCount || 0;
      for (let i = 0; i < geometryCount; i += 1) {
        const info = batch._geometryInfo && batch._geometryInfo[i];
        if (!info || info.active === false || !info.count) continue;
        batch.computeBoundsTree(i, { strategy: CENTER, maxLeafSize: 16 });
        count += 1;
        if (count % 24 === 0) await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
  } catch (err) {
    console.error(err);
  }
  if (!viewAlive(state, state.sex)) return;
  state.pickReady = true;
  state.container.dataset.pick = "1";
}

async function fill(state, sex) {
  state.container.dataset.loading = "1";
  const loads = layerNames(sex).map((name) => ({ name, promise: requestModel(name) }));
  const alignPromise = loadWallFit();
  let align = null;
  let framed = false;
  if (window.ATLAS_CATALOG_READY) {
    try { await window.ATLAS_CATALOG_READY; } catch (err) { console.error(err); }
  }
  if (!viewAlive(state, sex)) {
    delete state.container.dataset.loading;
    return;
  }
  try {
    for (const item of loads) {
      const gltf = await item.promise;
      if (!viewAlive(state, sex)) return;
      const clone = gltf.scene.clone(true);
      const shared = item.name === "shared-wall";
      tag(clone, sex, shared);
      const fitFemale = sex === "female" && (shared || item.name === "female-gaps");
      const fitMale = sex === "male" && item.name === "male-gaps";
      if (fitFemale || fitMale) {
        if (!align) align = await alignPromise;
        if (!viewAlive(state, sex)) return;
      }
      if ((fitFemale || fitMale) && align && align.matrix) {
        const fitted = new THREE.Group();
        const matrix = new THREE.Matrix4().fromArray(align.matrix);
        if (fitMale) matrix.invert();
        matrix.decompose(fitted.position, fitted.quaternion, fitted.scale);
        fitted.add(clone);
        state.root.add(fitted);
      } else state.root.add(clone);
      if (shared) fit(state, true, framed);
      else if (!framed && item.name.endsWith("-organs")) fit(state, false, false);
      if (shared || item.name.endsWith("-organs")) framed = true;
      batchMeshes(state);
      stripSourceMeshes(state);
      releaseSource(item.name, sex);
      present(state);
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
  } catch (err) {
    console.error(err);
    if (!state.batches.length) showLoadError(state.container);
  } finally {
    delete state.container.dataset.loading;
  }
  if (viewAlive(state, sex) && state.batches.length) indexBatches(state);
}

function enqueue(state, sex) {
  warmModels(sex);
  jobs.push({ state, sex });
  pump();
}

async function pump() {
  if (pumping) return;
  pumping = true;
  while (jobs.length) {
    jobs.sort((a, b) => Number(shown(b.state)) - Number(shown(a.state)));
    const job = jobs.shift();
    if (!views.has(job.sex) || views.get(job.sex) !== job.state || job.state.ready) continue;
    try {
      await fill(job.state, job.sex);
    } catch (err) {
      console.error(err);
    }
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  pumping = false;
}

function mount(container, sex) {
  const previous = views.get(sex);
  if (previous) return previous;
  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(pixelRatio);
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
    theta: aspect === "posterior" ? Math.PI : 0,
    phi: 1.22,
    radius: 3.2,
    target: new THREE.Vector3(0, 0.05, 0),
    home: { theta: aspect === "posterior" ? Math.PI : 0, phi: 1.22, radius: 3.2, target: new THREE.Vector3(0, 0.05, 0) },
    goal: null,
    hotId: null,
    enabled: new Set(window.ATLAS_SYSTEMS.map((system) => system.id)),
    selection: null,
    ready: false,
    pickReady: false,
    batched: false,
    dirty: true,
    drag: null,
    records: [],
    batches: [],
    byId: new Map(),
    pixelRatio,
    hoverFrame: 0,
    hoverPoint: null,
    pendingFocus: null,
  };
  views.set(sex, state);
  resize(state);
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(() => resize(state)).observe(container);
  bind(state);
  if (!looping) {
    looping = true;
    let lastTick = performance.now();
    const tick = () => {
      requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTick) / 1000);
      lastTick = now;
      steer(dt);
      views.forEach((view) => {
        ease(view);
        publishFacing(view);
        if (!view.dirty || !shown(view)) return;
        placeCamera(view);
        view.renderer.render(view.scene, view.camera);
        view.dirty = false;
      });
    };
    requestAnimationFrame(tick);
  }
  enqueue(state, sex);
  return state;
}

function aspectTheta(view) {
  return view === "posterior" ? Math.PI : 0;
}

function facingOf(theta) {
  const wrapped = Math.atan2(Math.sin(theta), Math.cos(theta));
  return Math.abs(wrapped) > Math.PI / 2 ? "posterior" : "anterior";
}

function publishFacing(state) {
  const facing = facingOf(state.theta);
  if (state.facing === facing) return;
  state.facing = facing;
  state.container.dispatchEvent(new CustomEvent("atlas-aspect", { bubbles: true, detail: facing }));
}

function focus(sex, id) {
  const state = views.get(sex);
  if (!state) return false;
  if (!state.ready) {
    state.pendingFocus = id;
    return false;
  }
  const list = state.byId.get(id);
  if (!list || !list.length) return false;
  let empty = true;
  for (const record of list) {
    if (!record.batch.getBoundingBoxAt(record.geometryId, scratchBox2)) continue;
    record.batch.getMatrixAt(record.instanceId, scratchMat);
    scratchBox2.applyMatrix4(scratchMat);
    scratchBox2.applyMatrix4(record.batch.matrixWorld);
    if (empty) {
      scratchBox.copy(scratchBox2);
      empty = false;
    } else scratchBox.union(scratchBox2);
  }
  if (empty || scratchBox.isEmpty()) return false;
  const center = scratchBox.getCenter(scratchVec);
  const span = scratchBox.getSize(scratchVec2);
  const radius = Math.max(span.x, span.y, span.z, 0.05) * 2.4;
  const theta = state.goal ? state.goal.theta : state.theta;
  state.goal = { theta, phi: Math.min(state.phi, 1.35), radius, target: center.clone() };
  state.zoomed = true;
  state.dirty = true;
  return true;
}

window.ATLAS_VIEW = {
  mount,
  touch(sex) {
    const state = views.get(sex);
    if (!state) return;
    resize(state);
    state.dirty = true;
  },
  unmountAll() {
    views.forEach((state) => {
      state.batches.forEach((batch) => {
        if (batch.disposeBoundsTree) batch.disposeBoundsTree();
        batch.geometry.dispose();
        batch.material.dispose();
      });
      state.renderer.dispose();
    });
    views.clear();
  },
  setSystems(enabled, selection) {
    views.forEach((state) => {
      state.enabled = enabled;
      state.selection = selection;
      if (state.ready) paintSystems(state, enabled, selection);
    });
  },
  setAspect(view) {
    aspect = view === "posterior" ? "posterior" : "anterior";
    const theta = aspectTheta(aspect);
    views.forEach((state) => {
      state.home.theta = theta;
      if (!state.ready) {
        state.theta = theta;
        return;
      }
      state.goal = {
        theta,
        phi: state.phi,
        radius: state.radius,
        target: state.target.clone(),
      };
    });
  },
  focus,
  reset() {
    views.forEach((state) => {
      state.zoomed = false;
      if (!state.home) return;
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
