export const RECURSOS_CONSULTADOS = ['local-floor', 'bounded-floor', 'hit-test', 'dom-overlay'];

export interface RelatorioCapacidades {
  possuiAPI: boolean;
  suportaVR: boolean;
  suportaAR: boolean;
  recursos: Record<string, string>;
  fontesDeEntrada: string[];
  grausDeLiberdade: string;
}

export const capacidades: RelatorioCapacidades = {
  possuiAPI: false,
  suportaVR: false,
  suportaAR: false,
  recursos: {
    'local-floor': 'Sem sessão aberta',
    'bounded-floor': 'Sem sessão aberta',
    'hit-test': 'Sem sessão aberta',
    'dom-overlay': 'Sem sessão aberta',
  },
  fontesDeEntrada: ['Sem sessão aberta'],
  grausDeLiberdade: 'Sem sessão aberta',
};

export async function sondarNavegador(): Promise<void> {
  if ('xr' in navigator && navigator.xr) {
    capacidades.possuiAPI = true;
    capacidades.suportaVR = await navigator.xr.isSessionSupported('immersive-vr');
    capacidades.suportaAR = await navigator.xr.isSessionSupported('immersive-ar');
  }
}

export function registrarRecursos(session: XRSession, pedidos: string[]): void {
  const concedidos = session.enabledFeatures;

  for (const nome of RECURSOS_CONSULTADOS) {
    let estado = '❌ Negado (pedido e recusado)';
    if (!pedidos.includes(nome)) {
      estado = '➖ Não pedido nesta sessão';
    } else if (concedidos === undefined) {
      estado = '❓ Desconhecido (navegador não informa)';
    } else if (concedidos.includes(nome)) {
      estado = '✅ Concedido';
    }
    capacidades.recursos[nome] = estado;
  }
}

export function registrarFontesDeEntrada(session: XRSession): void {
  capacidades.fontesDeEntrada = [];
  for (const fonte of session.inputSources) {
    capacidades.fontesDeEntrada.push(fonte.handedness + ' / ' + fonte.targetRayMode);
  }
  if (capacidades.fontesDeEntrada.length === 0) {
    capacidades.fontesDeEntrada.push('Nenhuma declarada');
  }
}

export function registrarGraus(frame: XRFrame, referencia: XRReferenceSpace | null): boolean {
  if (referencia === null) {
    return false;
  }
  const pose = frame.getViewerPose(referencia);
  if (!pose) {
    return false;
  }
  const novo = pose.emulatedPosition ? '3 (só rotação)' : '6 (rotação e posição)';
  if (novo === capacidades.grausDeLiberdade) {
    return false;
  }
  capacidades.grausDeLiberdade = novo;
  return true;
}

function textoDoRegime(suporta: boolean): string {
  if (!capacidades.possuiAPI) {
    return '❌ Ausente (sem API WebXR)';
  }
  if (suporta) {
    return '✅ Declarado pelo aparelho';
  }
  return '❌ Ausente (aparelho não declara)';
}

export function exibirSondaNaTela(): void {
  const spanApi = document.getElementById('status-api');
  const spanVr = document.getElementById('status-vr');
  const spanAr = document.getElementById('status-ar');
  const listaRecursos = document.getElementById('lista-recursos');
  const spanFontes = document.getElementById('status-fontes');
  const spanGraus = document.getElementById('status-graus');

  if (spanApi) {
    spanApi.innerText = capacidades.possuiAPI ? '✅ Encontrada' : '❌ Inexistente';
  }
  if (spanVr) {
    spanVr.innerText = textoDoRegime(capacidades.suportaVR);
  }
  if (spanAr) {
    spanAr.innerText = textoDoRegime(capacidades.suportaAR);
  }
  if (listaRecursos) {
    listaRecursos.innerText = '';
    for (const nome of RECURSOS_CONSULTADOS) {
      listaRecursos.innerText += nome + ': ' + capacidades.recursos[nome] + '\n';
    }
  }
  if (spanFontes) {
    spanFontes.innerText = capacidades.fontesDeEntrada.join(' | ');
  }
  if (spanGraus) {
    spanGraus.innerText = capacidades.grausDeLiberdade;
  }
}
