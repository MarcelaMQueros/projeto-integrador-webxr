import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { XRScene } from './scene';
import {
  sondarNavegador,
  exibirSondaNaTela,
  registrarRecursos,
  registrarFontesDeEntrada,
  registrarGraus,
} from './sonda';
import { trocarDePai, vetorEmTexto } from './hierarquia';
import { Orcamento, TETO_TELA_MS, TETO_VISOR_MS, TETO_DE_SALTO_S } from './orcamento';
import { IndicadorDeCusto } from './indicador';
import { Montagem } from './montagem';

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

const indicador = new IndicadorDeCusto();
indicador.malha.position.set(0.75, 0.05, 0.06);
xr.parede.add(indicador.malha);

const orbit = new OrbitControls(xr.camera, renderer.domElement);
orbit.target.set(0, 1.15, -0.8);
orbit.update();

const montagem = new Montagem(xr);
const textoMensagem = document.getElementById('mensagem') as HTMLParagraphElement;
const raycaster = new THREE.Raycaster();

function primeiroVisivel(acertos: THREE.Intersection[]): THREE.Object3D | null {
  for (const acerto of acertos) {
    if (acerto.object.visible) {
      return acerto.object;
    }
  }
  return null;
}

function clicarEm(objeto: THREE.Object3D | null): void {
  montagem.clicar(objeto);
  textoMensagem.innerText = montagem.mensagem;
}

let inicioX = 0;
let inicioY = 0;
let dedos = 0;
let foiGesto = false;
renderer.domElement.addEventListener('pointerdown', (evento) => {
  dedos++;
  if (dedos === 1) {
    inicioX = evento.clientX;
    inicioY = evento.clientY;
    foiGesto = false;
  } else {
    foiGesto = true;
  }
});
renderer.domElement.addEventListener('pointercancel', () => {
  dedos = Math.max(0, dedos - 1);
});
renderer.domElement.addEventListener('pointerup', (evento) => {
  dedos = Math.max(0, dedos - 1);
  if (foiGesto) {
    return;
  }
  const andou = Math.abs(evento.clientX - inicioX) + Math.abs(evento.clientY - inicioY);
  if (andou > 10) {
    return;
  }
  const ponteiro = new THREE.Vector2(
    (evento.clientX / window.innerWidth) * 2 - 1,
    -(evento.clientY / window.innerHeight) * 2 + 1,
  );
  raycaster.setFromCamera(ponteiro, xr.camera);
  clicarEm(primeiroVisivel(raycaster.intersectObjects(montagem.alvos(), false)));
});

const fabricaDeControles = new XRControllerModelFactory();

for (let i = 0; i < 2; i++) {
  const controle = renderer.xr.getController(i);
  const raio = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]),
    new THREE.LineBasicMaterial({ color: 0xffffff }),
  );
  raio.scale.z = 3;
  controle.add(raio);
  xr.scene.add(controle);

  const punho = renderer.xr.getControllerGrip(i);
  punho.add(fabricaDeControles.createControllerModel(punho));
  xr.scene.add(punho);

  controle.addEventListener('select', () => {
    const giro = new THREE.Matrix4().extractRotation(controle.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controle.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(giro);
    clicarEm(primeiroVisivel(raycaster.intersectObjects(montagem.alvos(), false)));
  });
}

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
let precisaColocarNaFrente = false;

function colocarNaFrente(frame: XRFrame): boolean {
  const referencia = renderer.xr.getReferenceSpace();
  if (!referencia) {
    return false;
  }
  const pose = frame.getViewerPose(referencia);
  if (!pose) {
    return false;
  }
  const p = pose.transform.position;
  xr.mundo.scale.setScalar(1 / 3);
  xr.mundo.position.set(p.x, p.y - 0.6, p.z - 0.2);
  return true;
}

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
  if (ultimosPedidos === PEDIDOS_AR) {
    precisaColocarNaFrente = true;
  }

  registrarRecursos(session, ultimosPedidos);
  registrarFontesDeEntrada(session);
  exibirSondaNaTela();

  session.addEventListener('inputsourceschange', () => {
    registrarFontesDeEntrada(session);
    exibirSondaNaTela();
  });
});

renderer.xr.addEventListener('sessionend', () => {
  xr.mundo.scale.setScalar(1);
  xr.mundo.position.set(0, 0, 0);
});

const botaoEncaixar = document.getElementById('botao-encaixar') as HTMLButtonElement;
const botaoMover = document.getElementById('botao-mover') as HTMLButtonElement;
const botaoLenta = document.getElementById('botao-lenta') as HTMLButtonElement;
const textoTroca = document.getElementById('resultado-troca') as HTMLPreElement;

botaoEncaixar.addEventListener('click', () => {
  const disjuntor = xr.disjuntores[0];
  if (disjuntor.userData.vaga >= 0) {
    textoTroca.innerText = 'disjuntor-1 está numa vaga do trilho. Devolva ele para a bancada clicando nele e depois na mesa.';
    return;
  }
  let novoPai: THREE.Object3D;
  if (disjuntor.parent === xr.trilho) {
    novoPai = xr.tampo;
    botaoEncaixar.innerText = 'Prender disjuntor-1 no trilho';
  } else {
    novoPai = xr.trilho;
    botaoEncaixar.innerText = 'Devolver disjuntor-1 para a bancada';
  }

  const resultado = trocarDePai(disjuntor, novoPai);
  textoTroca.innerText =
    'disjuntor-1 agora é filho de: ' + novoPai.name + '\n' +
    'Antes (mundo):  ' + vetorEmTexto(resultado.antes) + '\n' +
    'Depois (mundo): ' + vetorEmTexto(resultado.depois) + '\n' +
    'Local no novo pai: ' + vetorEmTexto(disjuntor.position) + '\n' +
    'Diferença: ' + resultado.diferenca.toExponential(2) + ' m';
});

botaoMover.addEventListener('click', () => {
  xr.moverQuadro = !xr.moverQuadro;
  botaoMover.innerText = xr.moverQuadro ? 'Parar o quadro' : 'Mover o quadro';
});

let maquinaLenta = false;
botaoLenta.addEventListener('click', () => {
  maquinaLenta = !maquinaLenta;
  botaoLenta.innerText = maquinaLenta ? 'Voltar à velocidade normal' : 'Simular máquina lenta';
});

const clock = new THREE.Clock();
const orcamento = new Orcamento();

renderer.setAnimationLoop((_timestamp, frame) => {
  const inicio = performance.now();

  const intervalo = clock.getDelta();
  const delta = Math.min(intervalo, TETO_DE_SALTO_S);

  if (maquinaLenta) {
    while (performance.now() - inicio < 30) {
      continue;
    }
  }

  xr.update(delta);

  if (frame && precisaColocarNaFrente && colocarNaFrente(frame)) {
    precisaColocarNaFrente = false;
  }

  if (frame && registrarGraus(frame, renderer.xr.getReferenceSpace())) {
    exibirSondaNaTela();
  }

  renderer.render(xr.scene, xr.camera);

  const custo = performance.now() - inicio;
  if (intervalo > 0) {
    orcamento.registrar(intervalo * 1000, custo);
  }

  const teto = renderer.xr.isPresenting ? TETO_VISOR_MS : TETO_TELA_MS;
  indicador.atualizar(
    orcamento.linhas(teto, renderer.info.render.calls, renderer.info.render.triangles),
    delta,
  );
});

window.addEventListener('resize', () => {
  if (!renderer.xr.isPresenting) {
    xr.camera.aspect = window.innerWidth / window.innerHeight;
    xr.camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});
