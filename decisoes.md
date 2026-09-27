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

[26/09/2026] — Cena como árvore, troca de pai e relógio (Módulo 3)

O que foi implementado:
- A cena de cubos soltos foi trocada pelo quadro elétrico montado como árvore:
  parede > quadro > fundo-da-caixa > trilho-din, e bancada > tampo > peças soltas
  (3 disjuntores, barramento, 6 fios). Tudo em forma primitiva e em metros.
- Parentesco por razão de projeto: o trilho é filho do fundo da caixa porque é
  parafusado nele. Mover o quadro leva o trilho junto (botão "Mover o quadro").
- Troca de pai com attach() do three.js: o disjuntor-1 passa do tampo para o
  trilho sem sair do lugar no mundo. A posição antes e depois aparece na tela.
  Medido com o quadro parado: (-0.3000, 0.7900, -0.2000) antes e depois,
  diferença de 2.78e-17 m.
- Laço por tempo (clock.getDelta), com teto de salto de 0,1 s.
- Teto do quadro: 16,7 ms na tela e 11,1 ms no visor.
- Indicador de custo do quadro dentro da cena, na parede.
- Sonda completou o que faltava do Módulo 2: fontes de entrada, graus de
  liberdade e a separação entre ausente, negado, não pedido e desconhecido.
- package.json passou a listar three, @types/three e @vitejs/plugin-basic-ssl.
  Antes eles não estavam lá e um "npm install" limpo não rodava o projeto.
- README.md com o passo a passo para rodar e a tabela de aparelhos testados.

O que NÃO foi feito (limitações conhecidas):
- Bug de tela em branco ao sair da sessão VR continua aberto.
- Hit-test de AR ainda só planta um cilindro de teste; o quadro não é colocado
  na mesa em 1:3.
- Abaixo de 10 quadros por segundo a cena anda mais devagar, por causa do teto
  de salto de 0,1 s. Foi escolha: preferi isso a peças pulando.
- Falta medir o custo do quadro em outra máquina e testar num aparelho de outra
  classe.

[26/09/2026] — Ajustes no celular e no AR

- No celular os painéis cobriam a cena e o toque não chegava nela. Painéis
  menores em tela estreita e botão "Painéis" para esconder.
- No AR (emulador) a bancada abria lá em cima. Criei o nó "mundo" com a parede
  e a bancada. No AR ele fica escondido até o primeiro toque no retículo e
  aparece ali em escala 1:3. Por enquanto em pé, não deitado.
- No AR o toque atravessava as peças: a posição do raio do toque ainda não
  estava atualizada no selectstart. O pegar agora espera o quadro seguinte.
- Com o "mundo" escondido até o toque, no emulador não aparecia nada (o anel
  azul nem sempre aparece). Agora, ao entrar no AR, o "mundo" já aparece em
  1:3 a 80 cm na frente de quem olha, calculado pela pose do primeiro quadro.
  O toque no retículo continua levando ele para a superfície.
- O realce de peça mirada somava um cinza claro numa peça branca e não dava
  para ver. Agora a peça mirada fica amarela e o raio do controle termina nela.
- No VR a pessoa nascia encostada na mesa. O "mundo" agora é afastado 30 cm
  para a frente quando a sessão VR começa. No AR a cena aparecia longe; agora
  fica a 50 cm e 60 cm abaixo dos olhos.
- As peças atravessam o quadro quando levadas até ele: não há colisão nem
  encaixe ainda (Blocos D e E). Registrado como limitação.

[26/09/2026] — Voltando ao que o módulo pede

- Tirei src/controllers.ts e src/ar.ts (pegar peças, hit-test e colocar a
  cena na mesa). Não são do Módulo 3 e, sem colisão, as peças atravessavam o
  quadro. Voltam nos Blocos D e E junto com o encaixe.
- Tirei também o nó "mundo" e a árvore em texto no painel.
- Para o VR não nascer em cima da mesa, afastei a cena: parede a 0,95 m e
  bancada a 0,60 m da origem.
- Troca de pai medida de novo: (-0.3000, 0.7900, -0.5000) antes e depois,
  diferença 0.00e+0 m.

[26/09/2026] — Encaixe por dois cliques

- Criado src/montagem.ts. Clica na peça (fica amarela), as vagas livres
  aparecem em verde, clica na vaga. A peça troca de pai (trocarDePai) e vai
  para a posição da vaga. Nada passa por dentro do quadro porque a peça não
  fica solta no ar.
- Vale para mouse (tela) e gatilho do controle (VR).
- Regras da Seção 6: barramento só com os 3 disjuntores encostados; fios só
  em disjuntor encaixado; disjuntor com barramento ou fio fica travado.
- Tarefa concluída: caixa fica verde e aparece "Circuito Fechado!".
- Testado com cliques de verdade no navegador, do começo ao fim.

[26/09/2026] — AR na frente e barramento maior

- No AR a pessoa nascia embaixo da cena. No primeiro quadro da sessão AR o nó
  raiz (sala) fica em escala 1:3 e é colocado 60 cm abaixo dos olhos e um
  pouco à frente. Ao sair, volta para 1:1.
- Com a sala movida, o raio do controle passou a usar controle.matrix (a pose
  no espaço de referência) em vez de matrixWorld, que já vinha com o
  deslocamento da sala.
- Barramento passou de 5,4 x 0,5 x 1,0 cm para 5,4 x 1,2 x 1,5 cm: era fino
  demais para ver e clicar. Mensagem explica onde ele entra.

[26/09/2026] — Controles de volta

- Ao tirar controllers.ts sumiram os modelos 3D dos controles. Voltaram com
  XRControllerModelFactory, direto no main.ts (os modelos vêm da internet).
- Encolher a sala inteira no AR levava os controles junto. Voltei o nó
  "mundo" (pai da parede e da bancada): no AR só ele encolhe e se move, e os
  controles ficam fora dele.
- renderer.xr.setFoveation(0): o three.js vem com foveação no máximo, que
  diminui a resolução nas bordas da imagem no visor. A cena é leve, então
  preferi a imagem inteira nítida.

[26/09/2026] — Virgilio no grupo

- O projeto deixou de ser individual: o grupo agora é Marcela Queros e
  Virgilio. Especificação (Seções 1 e 14), README e slides atualizados.
- A cena continua a mesma: o motivo da escolha (folga de encaixe mais larga
  e pouca prática em modelagem 3D) vale para os dois.

[26/09/2026] — Montar pelo celular

- No celular a peça ficava amarela, mas ao fazer a pinça para chegar perto do
  quadro um dos dedos era lido como toque no vazio e cancelava a seleção.
  Agora o main.ts conta quantos dedos estão na tela: gesto com dois dedos
  nunca vira clique. A folga para diferenciar toque de arrasto subiu de 5 para
  10 pixels, porque o dedo mexe mais que o mouse.
- Testado com toque e pinça simulados no navegador: seleciona, faz a pinça e
  encaixa na vaga.

