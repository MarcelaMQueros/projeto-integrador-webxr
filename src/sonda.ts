// 1. A interface (O formato dos dados)
interface RelatorioCapacidades {
  possuiAPI: boolean;
  suportaVR: boolean;
  suportaAR: boolean;
}

// 2. A função de busca (Apenas interage com o navegador, não toca na tela)
async function sondarNavegador(): Promise<RelatorioCapacidades> {
  const capacidades: RelatorioCapacidades = {
    possuiAPI: false,
    suportaVR: false,
    suportaAR: false,
  };

  if ('xr' in navigator && navigator.xr) {
    capacidades.possuiAPI = true;
    const xr = navigator.xr;

    try {
      capacidades.suportaVR = await xr.isSessionSupported('immersive-vr');
    } catch (erro) {
      console.warn("Falha ao checar suporte VR.", erro);
    }

    try {
      capacidades.suportaAR = await xr.isSessionSupported('immersive-ar');
    } catch (erro) {
      console.warn("Falha ao checar suporte AR.", erro);
    }
  }

  return capacidades;
}

// 3. A função de exibição (Amarra os dados ao HTML)
async function exibirSondaNaTela() {
  // A. Primeiro, buscamos os dados e ESPERAMOS a resposta
  const resultado = await sondarNavegador();

  // B. AGORA SIM, com o "resultado" em mãos, buscamos os elementos da tela
  const spanApi = document.getElementById('status-api');
  const spanVr = document.getElementById('status-vr');
  const spanAr = document.getElementById('status-ar');

  // C. Injetamos os textos correspondentes, checando null
  if (spanApi) {
    spanApi.innerText = resultado.possuiAPI ? "✅ Encontrada" : "❌ Inexistente";
  }

  if (spanVr) {
    spanVr.innerText = resultado.suportaVR ? "✅ Sim" : "❌ Não";
  }

  if (spanAr) {
    spanAr.innerText = resultado.suportaAR ? "✅ Sim" : "❌ Não";
  }
}

// 4. Executamos a função quando o script carrega
exibirSondaNaTela();
/*sondarNavegador().then((resultado) => {
  console.log(resultado);
});*/