import * as THREE from 'three';
import { XRScene, xDaVaga } from './scene';
import { trocarDePai } from './hierarquia';

export class Montagem {
  mensagem = 'Clique numa peça da bancada';
  private xr: XRScene;
  private selecionada: THREE.Mesh | null = null;
  private corOriginal = new THREE.Color();

  constructor(xr: XRScene) {
    this.xr = xr;
  }

  alvos(): THREE.Object3D[] {
    return [
      ...this.xr.bornes,
      ...this.xr.vagas,
      this.xr.vagaBarramento,
      ...this.xr.disjuntores,
      this.xr.barramento,
      ...this.xr.fios,
      this.xr.tampo,
    ];
  }

  clicar(objeto: THREE.Object3D | null): void {
    let tipo = '';
    if (objeto) {
      tipo = objeto.userData.tipo;
    }
    const ehPeca = tipo === 'disjuntor' || tipo === 'barramento' || tipo === 'fio';

    if (this.selecionada === null) {
      if (objeto && ehPeca) {
        this.selecionar(objeto as THREE.Mesh);
      }
      return;
    }

    if (objeto && tipo === 'vaga') {
      this.encaixarDisjuntor(objeto);
    } else if (tipo === 'vaga-barramento') {
      this.encaixarBarramento();
    } else if (objeto && tipo === 'borne') {
      this.encaixarFio(objeto);
    } else if (objeto === this.xr.tampo) {
      this.devolver();
    } else if (objeto && ehPeca) {
      this.selecionar(objeto as THREE.Mesh);
    } else {
      this.soltarSelecao();
      this.mensagem = 'Nada selecionado';
    }
  }

  private selecionar(peca: THREE.Mesh): void {
    if (peca.userData.tipo === 'disjuntor' && this.disjuntorTravado(peca)) {
      this.mensagem = peca.name + ' está travado: tire antes o barramento e os fios dele';
      return;
    }

    this.soltarSelecao();
    this.selecionada = peca;
    const material = peca.material as THREE.MeshStandardMaterial;
    this.corOriginal.copy(material.color);
    material.color.setHex(0xffd166);
    this.mensagem = peca.name + ' selecionado: clique numa vaga verde ou na mesa';
    this.mostrarVagas(peca);
  }

  private soltarSelecao(): void {
    if (this.selecionada) {
      const material = this.selecionada.material as THREE.MeshStandardMaterial;
      material.color.copy(this.corOriginal);
      this.selecionada = null;
    }
    this.esconderVagas();
  }

  private esconderVagas(): void {
    for (const vaga of this.xr.vagas) {
      vaga.visible = false;
    }
    this.xr.vagaBarramento.visible = false;
    for (const borne of this.xr.bornes) {
      borne.visible = false;
    }
  }

  private mostrarVagas(peca: THREE.Mesh): void {
    const tipo = peca.userData.tipo;

    if (tipo === 'disjuntor') {
      for (const vaga of this.xr.vagas) {
        vaga.visible = !this.vagaOcupada(vaga.userData.indice);
      }
    }

    if (tipo === 'barramento' && !peca.userData.encaixado) {
      const meio = this.meioDosDisjuntores();
      if (meio < 0) {
        this.mensagem = 'Encoste os 3 disjuntores no trilho, um do lado do outro, antes do barramento';
      } else {
        this.xr.vagaBarramento.position.x = xDaVaga(meio);
        this.xr.vagaBarramento.visible = true;
        this.mensagem = 'barramento selecionado: clique na vaga verde embaixo dos 3 disjuntores';
      }
    }

    if (tipo === 'fio') {
      let algumBorne = false;
      for (const borne of this.xr.bornes) {
        const disjuntor = borne.parent as THREE.Object3D;
        borne.visible = disjuntor.userData.vaga >= 0 && borne.userData.fio === null;
        if (borne.visible) {
          algumBorne = true;
        }
      }
      if (!algumBorne) {
        this.mensagem = 'Encaixe um disjuntor no trilho antes de ligar os fios';
      }
    }
  }

  private vagaOcupada(indice: number): boolean {
    for (const disjuntor of this.xr.disjuntores) {
      if (disjuntor.userData.vaga === indice) {
        return true;
      }
    }
    return false;
  }

  private meioDosDisjuntores(): number {
    const indices: number[] = [];
    for (const disjuntor of this.xr.disjuntores) {
      if (disjuntor.userData.vaga >= 0) {
        indices.push(disjuntor.userData.vaga);
      }
    }
    if (indices.length < 3) {
      return -1;
    }
    indices.sort((a, b) => a - b);
    if (indices[2] - indices[0] !== 2) {
      return -1;
    }
    return indices[1];
  }

  private disjuntorTravado(disjuntor: THREE.Object3D): boolean {
    if (this.xr.barramento.userData.encaixado && disjuntor.userData.vaga >= 0) {
      return true;
    }
    for (const filho of disjuntor.children) {
      if (filho.userData.tipo === 'borne' && filho.userData.fio !== null) {
        return true;
      }
    }
    return false;
  }

  private encaixarDisjuntor(vaga: THREE.Object3D): void {
    const disjuntor = this.selecionada as THREE.Mesh;
    trocarDePai(disjuntor, this.xr.trilho);
    disjuntor.position.copy(vaga.position);
    disjuntor.rotation.set(0, 0, 0);
    disjuntor.userData.vaga = vaga.userData.indice;
    this.mensagem = disjuntor.name + ' encaixado na ' + vaga.name;
    this.terminarAcao();
  }

  private encaixarBarramento(): void {
    const barramento = this.xr.barramento;
    trocarDePai(barramento, this.xr.trilho);
    barramento.position.copy(this.xr.vagaBarramento.position);
    barramento.rotation.set(0, 0, 0);
    barramento.userData.encaixado = true;
    this.mensagem = 'Barramento encaixado nos 3 disjuntores';
    this.terminarAcao();
  }

  private encaixarFio(borne: THREE.Object3D): void {
    const fio = this.selecionada as THREE.Mesh;
    if (fio.userData.borne) {
      fio.userData.borne.userData.fio = null;
    }
    const disjuntor = borne.parent as THREE.Object3D;
    trocarDePai(fio, disjuntor);
    fio.position.set(borne.position.x, borne.position.y, borne.position.z + 0.075);
    fio.rotation.set(Math.PI / 2, 0, 0);
    borne.userData.fio = fio;
    fio.userData.borne = borne;
    this.mensagem = fio.name + ' ligado no ' + disjuntor.name;
    this.terminarAcao();
  }

  private devolver(): void {
    const peca = this.selecionada as THREE.Mesh;
    if (peca.userData.tipo === 'disjuntor') {
      peca.userData.vaga = -1;
    }
    if (peca.userData.tipo === 'barramento') {
      peca.userData.encaixado = false;
    }
    if (peca.userData.tipo === 'fio' && peca.userData.borne) {
      peca.userData.borne.userData.fio = null;
      peca.userData.borne = null;
    }
    trocarDePai(peca, this.xr.tampo);
    peca.position.copy(peca.userData.repouso);
    peca.rotation.copy(peca.userData.giroRepouso);
    this.mensagem = peca.name + ' voltou para a bancada';
    this.terminarAcao();
  }

  private terminarAcao(): void {
    this.soltarSelecao();

    let fiosLigados = 0;
    for (const fio of this.xr.fios) {
      if (fio.userData.borne) {
        fiosLigados++;
      }
    }

    const pronto =
      this.meioDosDisjuntores() >= 0 && this.xr.barramento.userData.encaixado && fiosLigados === 6;

    const materialDaCaixa = this.xr.fundo.material as THREE.MeshStandardMaterial;
    if (pronto) {
      materialDaCaixa.color.setHex(0x22c55e);
      this.mensagem = 'Circuito Fechado!';
    } else {
      materialDaCaixa.color.setHex(0xd9d9d9);
    }
  }
}
