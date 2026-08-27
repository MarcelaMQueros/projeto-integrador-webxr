import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { XRScene } from './scene';
import { setupControllers } from './controllers';
import { setupARHitTest } from './ar';

import './sonda';

// --- Renderer ---
const container = document.getElementById('app') as HTMLDivElement;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true; // habilita o loop WebXR
container.appendChild(renderer.domElement);

// --- Cena ---
const xr = new XRScene();

// Órbita com o mouse no desktop (fora do modo imersivo)
const orbit = new OrbitControls(xr.camera, renderer.domElement);
orbit.target.set(0, 1.2, -1);
orbit.update();

// --- Controllers XR ---
const controllers = setupControllers(renderer, xr.scene, xr.interactive);

// --- AR hit-test ---
const arHitTest = setupARHitTest(renderer, xr.scene);

// --- Botões VR e AR ---
document.body.appendChild(
  VRButton.createButton(renderer, {
    optionalFeatures: ['local-floor', 'bounded-floor'] 
  })
);

document.body.appendChild(
  ARButton.createButton(renderer, {
    requiredFeatures: [],
    optionalFeatures: ['hit-test', 'local-floor', 'bounded-floor', 'dom-overlay'],
    domOverlay: { root: document.body },
  }),
);

//  ETAPA 4: CHECAGEM DE RECURSOS APÓS A SESSÃO ABRIR 
renderer.xr.addEventListener('sessionstart', () => {
  const session = renderer.xr.getSession();

  if (session) {
    const concedidos = (session as any).enabledFeatures;

    const spanPiso = document.getElementById('status-piso');
    const spanHitTest = document.getElementById('status-hit-test');

    // 2. Lógica separada: Desconhecido vs Concedido vs Negado/Ausente
    if (spanPiso) {
      if (concedidos === undefined) {
        // O navegador abriu a sessão, mas a API dele não suporta listar o que foi ativado
        spanPiso.innerText = "❓ Desconhecido (Navegador não reporta)";
      } else if (concedidos.includes('local-floor')) {
        spanPiso.innerText = "✅ Concedido";
      } else {
        spanPiso.innerText = "❌ Negado/Ausente";
      }
    }

    if (spanHitTest) {
      if (concedidos === undefined) {
        spanHitTest.innerText = "❓ Desconhecido (Navegador não reporta)";
      } else if (concedidos.includes('hit-test')) {
        spanHitTest.innerText = "✅ Concedido";
      } else {
        // Como você bem notou: se o usuário entrou por VR, cairá exatamente aqui, 
        // pois hit-test sequer foi pedido no VRButton!
        spanHitTest.innerText = "❌ Negado/Ausente"; 
      }
    }
    
    console.log("Sessão imersiva rodando. enabledFeatures:", concedidos);
  }
});
//  FIM DA ETAPA 4 

// --- Loop de animação (use setAnimationLoop, NÃO requestAnimationFrame) ---
const clock = new THREE.Clock();

renderer.setAnimationLoop((_timestamp, frame) => {
  const delta = clock.getDelta();
  xr.update(delta);
  controllers.update();
  if (frame) arHitTest.update(frame);
  renderer.render(xr.scene, xr.camera);
});

// --- Responsividade ---
// --- Responsividade ---
window.addEventListener('resize', () => {
  // Só redimensiona o canvas e a câmera se NÃO estivermos no modo imersivo
  if (!renderer.xr.isPresenting) {
    xr.camera.aspect = window.innerWidth / window.innerHeight;
    xr.camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});