import * as THREE from 'three';

const LARGURA_PX = 640;
const ALTURA_PX = 360;
const INTERVALO_DE_DESENHO_S = 0.5;

export class IndicadorDeCusto {
  malha: THREE.Mesh;
  tela: HTMLCanvasElement;
  pincel: CanvasRenderingContext2D;
  textura: THREE.CanvasTexture;
  tempoSemDesenhar = INTERVALO_DE_DESENHO_S;

  constructor() {
    this.tela = document.createElement('canvas');
    this.tela.width = LARGURA_PX;
    this.tela.height = ALTURA_PX;

    const contexto = this.tela.getContext('2d');
    if (contexto === null) {
      throw new Error('Navegador sem canvas 2d para o indicador');
    }
    this.pincel = contexto;

    this.textura = new THREE.CanvasTexture(this.tela);
    this.textura.minFilter = THREE.LinearFilter;
    this.textura.generateMipmaps = false;

    const geometria = new THREE.PlaneGeometry(0.6, 0.34);
    const material = new THREE.MeshBasicMaterial({ map: this.textura });
    this.malha = new THREE.Mesh(geometria, material);
    this.malha.name = 'indicador-de-custo';

    this.desenhar(['Aguardando o primeiro quadro']);
  }

  atualizar(linhas: string[], delta: number) {
    this.tempoSemDesenhar += delta;
    if (this.tempoSemDesenhar < INTERVALO_DE_DESENHO_S) {
      return;
    }
    this.tempoSemDesenhar = 0;
    this.desenhar(linhas);
  }

  desenhar(linhas: string[]) {
    this.pincel.fillStyle = '#0b0d12';
    this.pincel.fillRect(0, 0, LARGURA_PX, ALTURA_PX);

    this.pincel.fillStyle = '#ffd166';
    this.pincel.font = 'bold 34px sans-serif';
    this.pincel.fillText('Custo do quadro', 24, 50);

    this.pincel.fillStyle = '#ffffff';
    this.pincel.font = '28px sans-serif';
    let y = 100;
    for (let i = 0; i < linhas.length; i++) {
      this.pincel.fillText(linhas[i], 24, y);
      y += 44;
    }

    this.textura.needsUpdate = true;
  }
}
