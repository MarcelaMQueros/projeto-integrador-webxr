import * as THREE from 'three';

export function trocarDePai(objeto: THREE.Object3D, novoPai: THREE.Object3D) {
  const antes = new THREE.Vector3();
  objeto.getWorldPosition(antes);

  novoPai.attach(objeto);

  const depois = new THREE.Vector3();
  objeto.getWorldPosition(depois);

  const diferenca = antes.distanceTo(depois);
  return { antes: antes, depois: depois, diferenca: diferenca };
}

export function vetorEmTexto(v: THREE.Vector3) {
  return '(' + v.x.toFixed(4) + ', ' + v.y.toFixed(4) + ', ' + v.z.toFixed(4) + ')';
}
