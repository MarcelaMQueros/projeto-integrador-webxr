import * as THREE from 'three';

export interface ResultadoDaTroca {
  antes: THREE.Vector3;
  depois: THREE.Vector3;
  diferenca: number;
}

export function trocarDePai(objeto: THREE.Object3D, novoPai: THREE.Object3D): ResultadoDaTroca {
  const antes = new THREE.Vector3();
  objeto.getWorldPosition(antes);

  novoPai.attach(objeto);

  const depois = new THREE.Vector3();
  objeto.getWorldPosition(depois);

  const diferenca = antes.distanceTo(depois);
  return { antes, depois, diferenca };
}

export function vetorEmTexto(v: THREE.Vector3): string {
  return '(' + v.x.toFixed(4) + ', ' + v.y.toFixed(4) + ', ' + v.z.toFixed(4) + ')';
}
