export const TETO_TELA_MS = 16.7;
export const TETO_VISOR_MS = 11.1;
export const TETO_DE_SALTO_S = 0.1;

const QUADROS_NA_JANELA = 60;

export class Orcamento {
  intervalos: number[] = [];
  custos: number[] = [];

  registrar(intervaloMs: number, custoMs: number) {
    this.intervalos.push(intervaloMs);
    this.custos.push(custoMs);
    if (this.intervalos.length > QUADROS_NA_JANELA) {
      this.intervalos.shift();
      this.custos.shift();
    }
  }

  linhas(tetoMs: number, chamadas: number, triangulos: number) {
    if (this.intervalos.length === 0) {
      return ['Sem quadros medidos ainda'];
    }

    let somaIntervalos = 0;
    let somaCustos = 0;
    let acimaDoTeto = 0;
    for (let i = 0; i < this.intervalos.length; i++) {
      somaIntervalos += this.intervalos[i];
      somaCustos += this.custos[i];
      if (this.intervalos[i] > tetoMs) {
        acimaDoTeto++;
      }
    }

    const quantos = this.intervalos.length;
    const intervaloMedio = somaIntervalos / quantos;
    const custoMedio = somaCustos / quantos;
    const porcentagem = (acimaDoTeto / quantos) * 100;

    const linha1 = 'Teto: ' + tetoMs.toFixed(1) + ' ms';
    const linha2 = 'Intervalo medio: ' + intervaloMedio.toFixed(1) + ' ms (' + (1000 / intervaloMedio).toFixed(0) + ' fps)';
    const linha3 = 'Custo do quadro: ' + custoMedio.toFixed(2) + ' ms';
    const linha4 = 'Acima do teto: ' + porcentagem.toFixed(0) + '% de ' + quantos + ' quadros';
    const linha5 = 'Desenhos: ' + chamadas + '  Triangulos: ' + triangulos;
    return [linha1, linha2, linha3, linha4, linha5];
  }
}

