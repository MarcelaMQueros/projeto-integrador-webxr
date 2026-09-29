import * as THREE from 'three';
import { XRScene, xDaVaga, FRENTE_DO_TRILHO } from './scene';
import { trocarDePai } from './hierarquia';

export class Montagem {
  mensagem = 'Escolha uma peça para colocar';
  xr: XRScene;

  constructor(xr: XRScene) {
    this.xr = xr;
  }

  colocarDisjuntor(indice: number) {
    const disjuntor = this.xr.disjuntores[indice];
    const vaga = this.xr.vagas[indice];

    trocarDePai(disjuntor, this.xr.trilho);
    disjuntor.position.copy(vaga.position);
    disjuntor.rotation.set(0, 0, 0);

    this.mensagem = disjuntor.name + ' colocado no trilho';
  }

  colocarBarramento() {
    const barramento = this.xr.barramento;

    trocarDePai(barramento, this.xr.trilho);
    barramento.position.set(xDaVaga(1), -0.046, FRENTE_DO_TRILHO + 0.02);
    barramento.rotation.set(0, 0, 0);

    this.mensagem = 'Barramento colocado no trilho';
  }

  colocarFio(indice: number) {
    const fio = this.xr.fios[indice];
    const borne = this.xr.bornes[indice];
    const disjuntor = borne.parent as THREE.Object3D;

    trocarDePai(fio, disjuntor);
    fio.position.set(borne.position.x, borne.position.y, borne.position.z + 0.075);
    fio.rotation.set(Math.PI / 2, 0, 0);

    this.mensagem = fio.name + ' ligado no ' + disjuntor.name;
  }
}
