[26/08/2026] — Escolha do tema

Tema escolhido: Quadro elétrico em trilho

Por quê: [Individual, uma pessoa so vai fazer, sem muita prática em modelagem 3D — 
tolerância de encaixe mais folgada da lista, menos risco pra estrear]

Teste das 3 perguntas:
1. Ação manual: o disjuntor exige múltiplos movimentos distintos: Pegar, orientar para baixo, aproximar do trilho, encaixar (e depois, possivelmente, deslizar já encaixado). Não é um clique único.
2. Diferença no visor: em tamanho real, o painel fica na altura dos olhos, contra a parede. Bem diferente da miniatura que cabe inteira na tela do PC.
3. Ancoragem real: o painel precisa permanecer fixo no lugar da mesa enquanto o ângulo de quem observa muda ao redor dele, não pode ser um desenho preso à tela.

[26/08/2026] — Sonda de capacidades (Módulo 2, Tarefa 1 e 2)

O que foi implementado:
- Verificação de existência da API WebXR (navigator.xr)
- Consulta de suporte a sessões immersive-vr e immersive-ar (isSessionSupported)
- Estrutura (interface RelatorioCapacidades) guardando os resultados
- Checagem de recursos concedidos dentro de sessão VR (local-floor, hit-test),
  usando session.enabledFeatures, reaproveitando o botão ENTER VR existente
- Relatório visível na própria página (painel HTML com spans dedicados),
  não apenas no console
- Testado com Immersive Web Emulator (Meta), já que a máquina de desenvolvimento
  não possui headset físico nem câmera compatível com AR

O que NÃO foi implementado (limitações conhecidas):
- Fontes de entrada declaradas pelo aparelho (controles, mãos) — enunciado pede,
  ainda não consultado
- Graus de liberdade rastreados (3 vs 6) — enunciado pede, ainda não implementado
- A distinção ausente/negado não separa "recurso nunca pedido nesta sessão"
  de "recurso pedido e recusado pelo aparelho" — hoje os dois casos aparecem
  como "❌ Negado/Ausente" no mesmo texto
- Bug conhecido: ao sair da sessão VR, a tela fica em branco (câmera não é
  reposicionada ao estado anterior à sessão). Só recarregar a página resolve.
  Suspeita: renderer.xr assume controle da câmera durante a sessão e não a
  devolve à posição original ao sair. Não corrigido por falta de tempo.
- Testado em apenas um aparelho (notebook + emulador), não em dispositivo físico
  nem em mais de uma classe de aparelho, por indisponibilidade de hardware.