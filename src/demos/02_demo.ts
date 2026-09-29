import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { XRScene } from '../scene';
import {
  sondarNavegador,
  exibirSondaNaTela,
  registrarRecursos,
  registrarFontesDeEntrada,
  registrarGraus,
} from '../sonda';

const PEDIDOS_VR = ['local-floor', 'bounded-floor'];
const PEDIDOS_AR = ['hit-test', 'local-floor', 'bounded-floor', 'dom-overlay'];

const container = document.getElementById('app') as HTMLDivElement;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
renderer.xr.setFoveation(0);
container.appendChild(renderer.domElement);

const xr = new XRScene();

const orbit = new OrbitControls(xr.camera, renderer.domElement);
orbit.target.set(0, 1.15, -0.8);
orbit.update();

const botaoVR = VRButton.createButton(renderer, {
  optionalFeatures: PEDIDOS_VR,
});
document.body.appendChild(botaoVR);

const botaoAR = ARButton.createButton(renderer, {
  requiredFeatures: [],
  optionalFeatures: PEDIDOS_AR,
  domOverlay: { root: document.body },
});
botaoAR.style.bottom = '70px';
document.body.appendChild(botaoAR);

let ultimosPedidos: string[] = [];

botaoVR.addEventListener('click', () => {
  ultimosPedidos = PEDIDOS_VR;
});

botaoAR.addEventListener('click', () => {
  ultimosPedidos = PEDIDOS_AR;
});

sondarNavegador().then(() => {
  exibirSondaNaTela();
});

renderer.xr.addEventListener('sessionstart', () => {
  const session = renderer.xr.getSession();
  if (!session) {
    return;
  }

  registrarRecursos(session, ultimosPedidos);
  registrarFontesDeEntrada(session);
  exibirSondaNaTela();

  session.addEventListener('inputsourceschange', () => {
    registrarFontesDeEntrada(session);
    exibirSondaNaTela();
  });
});

renderer.setAnimationLoop((_timestamp, frame) => {
  if (frame && registrarGraus(frame, renderer.xr.getReferenceSpace())) {
    exibirSondaNaTela();
  }

  renderer.render(xr.scene, xr.camera);
});

window.addEventListener('resize', () => {
  if (!renderer.xr.isPresenting) {
    xr.camera.aspect = window.innerWidth / window.innerHeight;
    xr.camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});
