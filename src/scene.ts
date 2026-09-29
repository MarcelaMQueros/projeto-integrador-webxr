import * as THREE from 'three';

export const ALTURA_DO_QUADRO = 1.3;
export const ALTURA_DA_BANCADA = 0.75;
const TOPO_DO_TAMPO = 0.02;
export const FRENTE_DO_TRILHO = 0.0075 / 2 + 0.075 / 2;

export function xDaVaga(indice: number) {
  return -0.045 + indice * 0.018;
}

function materialDeVaga() {
  return new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.45 });
}

export class XRScene {
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;

  mundo = new THREE.Group();
  parede: THREE.Mesh;
  quadro = new THREE.Group();
  fundo: THREE.Mesh;
  trilho: THREE.Mesh;
  bancada = new THREE.Group();
  tampo: THREE.Mesh;
  disjuntores: THREE.Mesh[] = [];
  fios: THREE.Mesh[] = [];
  barramento: THREE.Mesh;
  vagas: THREE.Mesh[] = [];
  vagaBarramento: THREE.Mesh;
  bornes: THREE.Mesh[] = [];

  moverQuadro = false;
  tempoMovendo = 0;

  constructor() {
    this.scene.name = 'sala';
    this.scene.background = new THREE.Color(0x101015);

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
    this.camera.position.set(0, 1.4, 0.6);

    this.criarLuzes();
    this.criarChao();

    this.mundo.name = 'mundo';
    this.scene.add(this.mundo);

    this.parede = this.criarParede();
    this.fundo = this.criarQuadro();
    this.trilho = this.criarTrilho();
    this.tampo = this.criarBancada();
    this.criarDisjuntores();
    this.barramento = this.criarBarramento();
    this.criarFios();
    this.criarVagas();
    this.vagaBarramento = this.criarVagaBarramento();
    this.criarBornes();
    this.guardarRepouso();
  }

  criarLuzes() {
    const luzAmbiente = new THREE.HemisphereLight(0xffffff, 0x444455, 1.0);
    luzAmbiente.name = 'luz-ambiente';
    luzAmbiente.position.set(0, 1, 0);
    this.scene.add(luzAmbiente);

    const luzDirecional = new THREE.DirectionalLight(0xffffff, 1.5);
    luzDirecional.name = 'luz-direcional';
    luzDirecional.position.set(1, 3, 2);
    this.scene.add(luzDirecional);
  }

  criarChao() {
    const chao = new THREE.GridHelper(10, 20, 0x4f7cff, 0x2a2a35);
    chao.name = 'chao';
    this.scene.add(chao);
  }

  criarParede() {
    const geometria = new THREE.BoxGeometry(3, 2.5, 0.1);
    const material = new THREE.MeshStandardMaterial({ color: 0x3a3d48 });
    const parede = new THREE.Mesh(geometria, material);
    parede.name = 'parede';
    parede.position.set(0, 1.25, -0.95);
    this.mundo.add(parede);
    return parede;
  }

  criarQuadro() {
    this.quadro.name = 'quadro';
    this.quadro.position.set(0, ALTURA_DO_QUADRO - 1.25, 0.1);
    this.parede.add(this.quadro);

    const cinza = new THREE.MeshStandardMaterial({ color: 0xd9d9d9 });

    const fundo = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, 0.01), cinza);
    fundo.name = 'fundo-da-caixa';
    fundo.position.z = -0.045;
    this.quadro.add(fundo);

    const bordaCima = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.01, 0.1), cinza);
    bordaCima.name = 'borda-cima';
    bordaCima.position.y = 0.12;
    this.quadro.add(bordaCima);

    const bordaBaixo = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.01, 0.1), cinza);
    bordaBaixo.name = 'borda-baixo';
    bordaBaixo.position.y = -0.12;
    this.quadro.add(bordaBaixo);

    const bordaEsquerda = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.25, 0.1), cinza);
    bordaEsquerda.name = 'borda-esquerda';
    bordaEsquerda.position.x = -0.145;
    this.quadro.add(bordaEsquerda);

    const bordaDireita = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.25, 0.1), cinza);
    bordaDireita.name = 'borda-direita';
    bordaDireita.position.x = 0.145;
    this.quadro.add(bordaDireita);

    return fundo;
  }

  criarTrilho() {
    const geometria = new THREE.BoxGeometry(0.28, 0.035, 0.0075);
    const material = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, metalness: 0.6, roughness: 0.4 });
    const trilho = new THREE.Mesh(geometria, material);
    trilho.name = 'trilho-din';
    trilho.position.z = 0.005 + 0.0075 / 2;
    this.fundo.add(trilho);
    return trilho;
  }

  criarBancada() {
    this.bancada.name = 'bancada';
    this.bancada.position.set(0, 0, -0.6);
    this.mundo.add(this.bancada);

    const madeira = new THREE.MeshStandardMaterial({ color: 0x6b4f35 });

    const tampo = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.04, 0.5), madeira);
    tampo.name = 'tampo';
    tampo.position.y = ALTURA_DA_BANCADA - 0.02;
    this.bancada.add(tampo);

    const alturaDaPerna = ALTURA_DA_BANCADA - 0.04;
    const cantos = [
      [-0.45, -0.2],
      [0.45, -0.2],
      [-0.45, 0.2],
      [0.45, 0.2],
    ];
    for (let i = 0; i < cantos.length; i++) {
      const perna = new THREE.Mesh(new THREE.BoxGeometry(0.04, alturaDaPerna, 0.04), madeira);
      perna.name = 'perna-' + (i + 1);
      perna.position.set(cantos[i][0], alturaDaPerna / 2, cantos[i][1]);
      this.bancada.add(perna);
    }

    return tampo;
  }

  criarDisjuntores() {
    const geometria = new THREE.BoxGeometry(0.018, 0.08, 0.075);
    for (let i = 0; i < 3; i++) {
      const material = new THREE.MeshStandardMaterial({ color: 0xf2f2f2 });
      const disjuntor = new THREE.Mesh(geometria, material);
      disjuntor.name = 'disjuntor-' + (i + 1);
      disjuntor.userData.tipo = 'disjuntor';
      disjuntor.userData.vaga = -1;
      disjuntor.position.set(-0.3 + i * 0.05, TOPO_DO_TAMPO + 0.04, 0.1);
      this.tampo.add(disjuntor);
      this.disjuntores.push(disjuntor);
    }
  }

  criarBarramento() {
    const geometria = new THREE.BoxGeometry(0.054, 0.012, 0.015);
    const material = new THREE.MeshStandardMaterial({ color: 0xc9822b, metalness: 0.5 });
    const barramento = new THREE.Mesh(geometria, material);
    barramento.name = 'barramento';
    barramento.userData.tipo = 'barramento';
    barramento.userData.encaixado = false;
    barramento.position.set(0, TOPO_DO_TAMPO + 0.006, 0.12);
    this.tampo.add(barramento);
    return barramento;
  }

  criarFios() {
    const geometria = new THREE.CylinderGeometry(0.0018, 0.0018, 0.15, 12);
    const cores = [0xd62828, 0x1d4ed8];
    for (let i = 0; i < 6; i++) {
      const material = new THREE.MeshStandardMaterial({ color: cores[i % 2] });
      const fio = new THREE.Mesh(geometria, material);
      fio.name = 'fio-' + (i + 1);
      fio.userData.tipo = 'fio';
      fio.userData.borne = null;
      fio.rotation.z = Math.PI / 2;
      fio.position.set(0.25, TOPO_DO_TAMPO + 0.0018, -0.05 + i * 0.02);
      this.tampo.add(fio);
      this.fios.push(fio);
    }
  }

  criarVagas() {
    const geometria = new THREE.BoxGeometry(0.018, 0.08, 0.075);
    for (let i = 0; i < 6; i++) {
      const vaga = new THREE.Mesh(geometria, materialDeVaga());
      vaga.name = 'vaga-' + (i + 1);
      vaga.userData.tipo = 'vaga';
      vaga.userData.indice = i;
      vaga.position.set(xDaVaga(i), 0, FRENTE_DO_TRILHO);
      vaga.visible = false;
      this.trilho.add(vaga);
      this.vagas.push(vaga);
    }
  }

  criarVagaBarramento() {
    const geometria = new THREE.BoxGeometry(0.054, 0.012, 0.015);
    const vaga = new THREE.Mesh(geometria, materialDeVaga());
    vaga.name = 'vaga-barramento';
    vaga.userData.tipo = 'vaga-barramento';
    vaga.position.set(0, -0.046, FRENTE_DO_TRILHO + 0.02);
    vaga.visible = false;
    this.trilho.add(vaga);
    return vaga;
  }

  criarBornes() {
    const geometria = new THREE.BoxGeometry(0.012, 0.008, 0.004);
    const alturas = [0.03, -0.03];
    for (let i = 0; i < this.disjuntores.length; i++) {
      const disjuntor = this.disjuntores[i];
      for (let j = 0; j < alturas.length; j++) {
        const borne = new THREE.Mesh(geometria, materialDeVaga());
        borne.name = 'borne';
        borne.userData.tipo = 'borne';
        borne.userData.fio = null;
        borne.position.set(0, alturas[j], 0.0375);
        borne.visible = false;
        disjuntor.add(borne);
        this.bornes.push(borne);
      }
    }
  }

  guardarRepouso() {
    const pecas: THREE.Mesh[] = [];
    for (let i = 0; i < this.disjuntores.length; i++) {
      pecas.push(this.disjuntores[i]);
    }
    pecas.push(this.barramento);
    for (let i = 0; i < this.fios.length; i++) {
      pecas.push(this.fios[i]);
    }

    for (let i = 0; i < pecas.length; i++) {
      pecas[i].userData.repouso = pecas[i].position.clone();
      pecas[i].userData.giroRepouso = pecas[i].rotation.clone();
    }
  }

  update(delta: number) {
    if (this.moverQuadro) {
      this.tempoMovendo += delta;
      this.quadro.position.x = Math.sin(this.tempoMovendo * 0.8) * 0.25;
    }
  }
}

