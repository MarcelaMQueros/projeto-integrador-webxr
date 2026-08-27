## 1. Identificação do grupo e da cena

**Grupo:** Marcela Marcellino Querós RA: 1965877
**Cena escolhida:** Quadro elétrico em trilho
**Descrição em uma frase:** Um painel elétrico onde disjuntores, barramento e bornes são encaixados manualmente num trilho DIN, testável nos três regimes.

Por que esta cena: iniciante em modelagem 3D, sem prática prévia, o quadro elétrico tem a tolerância de encaixe mais folgada da lista, o que reduz o risco de travar numa calibração difícil logo no início.

Armadilha conhecida: os componentes elétricos são caixas simples, fáceis demais de fazer só por código, por isso, pelo menos os bornes e o barramento vão vir de modelo importado, para não esvaziar a parte de modelagem da ementa.

## 2. O que a pessoa faz ali

O processo de montagem começa com o trilho metálico (padrão DIN) já fixado na placa de fundo do quadro elétrico. O disjuntor é trazido para perto, posicionado em um ângulo levemente inclinado para frente. Primeiro, o dente do encaixe superior, localizado na parte de trás do disjuntor, é enganchado cuidadosamente na borda superior do trilho metálico. Usando esse ponto como eixo, o corpo do disjuntor é rotacionado para baixo e empurrado com firmeza contra o painel. A trava inferior de plástico, tensionada por uma mola, desliza pela borda de baixo do trilho até se expandir e travar de uma vez, emitindo um "clique" seco e característico que confirma o travamento. Com a peça ancorada e imóvel no trilho, as pontas decapadas dos cabos elétricos são inseridas nas aberturas dos bornes, e os parafusos frontais são rosqueados até apertar e fixar os fios de forma segura, finalizando a instalação daquele circuito.

Ação manual: o disjuntor exige múltiplos movimentos distintos, pegar, orientar para baixo, aproximar do trilho, encaixar (e possivelmente deslizar já encaixado). Não é um clique único.

Diferença no visor: em tamanho real, o painel fica na altura dos olhos, contra a parede — bem diferente da miniatura que cabe inteira na tela do PC.

Ancoragem real: o painel precisa permanecer fixo no lugar da mesa enquanto o ângulo de quem observa muda ao redor dele — não pode ser um desenho preso à tela.

## 3. Inventário de objetos

| Objeto | Quantos | Origem | Move? | Observação |
|---|---|---|---|---|
| Caixa do Quadro | 1 | Código (BoxGeometry) | Não | Estrutura base da cena. Totalmente fixa. |
| Trilho DIN | 1 | Modelo importado (GLTF) | Não | Fixo no fundo da caixa. Serve como âncora e eixo de restrição. |
| Disjuntores | 3 | Modelo importado (GLTF) | Sim | Movimento livre até o trilho. Após o "clique", o movimento fica restrito a um grau de liberdade (desliza apenas lateralmente no eixo do trilho). |
| Barramento (Pente) | 1 | Modelo importado (GLTF) | Sim | Move livremente até conectar e travar a base dos 3 disjuntores simultaneamente. |
| Fios / Bornes | 6 | Código (CylinderGeometry) | Sim | Duas conexões por disjuntor. O usuário arrasta a ponta até plugar na entrada. |


## 4. O espaço e as escalas

**Dimensões físicas dos objetos:**

- Caixa do Quadro Elétrico: 30 cm × 25 cm × 10 cm (largura × altura × profundidade). O tamanho comporta até 6 posições — decisão intencional: com apenas 3 disjuntores na cena, sobra espaço no trilho para o usuário deslizar as peças lateralmente após o encaixe inicial, além de refletir a prática real de deixar espaço de reserva (NBR 5410).
- Disjuntor individual: 1,8 cm × 8,0 cm × 7,5 cm. Medida de um disjuntor monopolar padrão DIN.

**Regimes de visualização e escalas:**

- **VR (escala 1:1):** o quadro é renderizado em tamanho real. Usando local-floor como âncora, o objeto fica a 1,30 m de altura do chão virtual — altura escolhida deliberadamente para priorizar o alcance confortável dos braços (cotovelos flexionados), evitando a fadiga de manter os braços erguidos na altura dos olhos por tempo prolongado.
- **AR (escala 1:3):** como o hit-test mapeia superfícies horizontais com mais facilidade, o painel é reduzido a ~33% do tamanho original e ancorado deitado sobre uma mesa física — formato de "bancada de estudo", otimizando a estabilidade do rastreamento em hardware mobile.

## 5. As ações do usuário

| Ação | O que o usuário faz | O que o sistema faz | O que acontece quando NÃO PODE |
|---|---|---|---|
| **Apanhar o disjuntor** | Aponta o controle/tela para um disjuntor solto e pressiona o gatilho para pegar | Destaca a peça e anexa o modelo ao controle, permitindo manipulação livre no espaço | Tentar pegar um disjuntor que já tem fios ou barramento conectados. O sistema não move a peça; ela pisca em vermelho junto com o cabo que a está travando |
| **Encaixar no trilho** | Arrasta o disjuntor até a área do trilho e solta o botão | Faz o "snap" (alinhamento exato), toca som de clique e restringe a física da peça ao eixo do trilho | Tentar encaixar de cabeça para baixo ou num espaço ocupado. O snap é recusado (contorno vermelho) e, ao soltar, a peça volta pra mesa |
| **Deslizar no trilho** | Aponta para um disjuntor já encaixado, segura e move a mão para os lados | Desliza o modelo exclusivamente no eixo lateral do trilho, ignorando movimentos verticais | Tentar empurrar contra outro disjuntor ou pra fora da caixa. A colisão bloqueia o movimento no ponto de contato, como uma barreira física |
| **Conectar barramento** | Pega o pente e aproxima das entradas inferiores de 3 disjuntores no trilho | Encaixa nos furos e agrupa os disjuntores; se um deslizar depois, o bloco inteiro move junto | Disjuntores separados (buracos vazios entre eles) ou faltando peças. O pente recusa o encaixe |
| **Plugar os fios** | Arrasta a ponta decapada do cabo até o borne (furo) de um disjuntor | Fixa a ponta do fio no borne e ajusta a curvatura do cilindro para acompanhar a peça | Tentar plugar num disjuntor solto fora do painel, ou num borne já ocupado. O cabo escapa e volta pra posição de descanso |

## 6. A tarefa e sua validação

**Estado inicial:** a cena começa com a caixa do quadro elétrico vazia (apenas o trilho DIN no fundo). Do lado de fora, apoiados na bancada virtual, estão soltos: os 3 disjuntores, o barramento tipo pente e as pontas dos 6 fios elétricos.

**Estado final (condição de sucesso):** a montagem é validada quando o sistema verifica que:
1. Os 3 disjuntores estão encaixados no trilho e deslizados até formarem um bloco único, sem espaços vazios entre eles
2. O barramento está conectado nos bornes inferiores, unindo os 3 disjuntores
3. Os 6 fios estão conectados em suas respectivas entradas

Quando as três condições são verdadeiras, o sistema dispara o retorno de sucesso (luzes do painel acendem, ou mensagem "Circuito Fechado").

**Ordem de execução (parcialmente rígida):**
- **Livre:** os disjuntores podem ser encaixados no trilho em qualquer ordem. Uma vez no trilho, a pessoa escolhe se prefere plugar os fios primeiro ou encaixar o barramento primeiro.
- **Rígida:** fios e barramento não conectam em disjuntores soltos na mesa — o encaixe no trilho é sempre o passo 1. O barramento, além disso, exige que os 3 disjuntores estejam encostados uns nos outros no trilho antes do encaixe; caso contrário, os furos não alinham e a ação é bloqueada.

## 7. Regras de encaixe e tolerâncias

| Encaixe | Folga de posição | Folga de ângulo | Raciocínio |
|---|---|---|---|
| Disjuntor no trilho | 1,5 cm | 20° | O disjuntor tem 1,8 cm de largura — folga maior arriscaria o snap pegar o slot vizinho. Os 20° perdoam a inclinação natural do pulso em VR, onde não há peso real da peça guiando a mão. |
| Barramento nos disjuntores | 1,0 cm | 10° | O encaixe mais rígido do projeto: três dentes precisam entrar simultaneamente em três furos, exigindo tolerância baixa para simular essa restrição física. O ângulo quase reto obriga a peça a ficar paralela à base antes do snap. |
| Fio no borne | 2,5 cm | 35° | O borne é um alvo minúsculo, e mirar com precisão em profundidade sem feedback tátil é frustrante. A folga generosa compensa a falta de referência espacial do ambiente virtual — o cabo flexível do mundo real também costuma entrar "meio torto". |

8. Retorno ao usuário
Momento	Retorno
Objeto mirado (antes de apanhar)	Hover / feedback de mira: quando o cursor (PC), o raio do controle (VR) ou o centro da tela (AR) cruza a hit-box de uma peça interativa, a malha ganha um contorno (outline) amarelo neon de 2px. No desktop, o cursor padrão também muda para o formato de mão (pointer).
Objeto apanhado	Destaque nas bordas + peça anexada ao controle
Encaixe aceito	Som de clique + snap visual (alinhamento automático)
Encaixe recusado	Contorno vermelho / peça translúcida / ícone de "distância incorreta" (varia por tipo de encaixe, ver Seção 5)
Tarefa concluída	Luzes do painel acendem + mensagem "Circuito Fechado"
9. Os três regimes
Aspecto	Tela (Desktop/Mobile Web)	Visor (VR)	Câmera (AR)
Como se olha	Mouse e teclado (orbit controls)	Movimento natural da cabeça	Movendo o próprio celular pelo espaço
Como se aponta e age	Cursor do mouse central e clique	Controle rastreado pelo raio e gatilho	Toque direto na tela sobre o objeto
Escala da cena	Arbitrária/reduzida (encaixada para caber inteira no monitor)	1:1 (tamanho real, altura ancorada a 1,30m do chão)	1:3 (reduzida, ancorada horizontalmente sobre a mesa)
O que a cena faz de diferente	Fica flutuando no vazio com câmera externa; usa botões HTML	Isola o usuário com fundo de estúdio escuro; interface no espaço 3D	Usa o mundo físico como fundo; painel projeta sombra sobre a mesa real
O que NÃO existe	Não há noção de escala física nem imersão de profundidade	Não há visão do mundo externo real	Não há fundo renderizado; recursos que exigem precisão de raio dão lugar ao toque
10. Orçamento e desempenho

O painel é composto por 12 objetos principais de interação: 1 caixa, 1 trilho, 3 disjuntores, 1 barramento e 6 fios (bornes).

Os 3 disjuntores e os 6 fios são repetições exatas do mesmo modelo, tornando-os candidatos naturais para instanciação (InstancedMesh ou reaproveitamento de geometria/material), poupando chamadas de desenho na GPU.

Ordem de degradação se o FPS cair (especialmente no AR de celulares mais fracos), sem alterar a lógica de vitória — nenhuma peça essencial é removida, apenas simplificada visualmente:

Simplificar a física dos 6 fios (trocar a geometria de tubo cilíndrico por linhas retas 2D, via LineBasicMaterial)
Trocar os modelos GLTF importados (disjuntores e barramento) por blocos primitivos do próprio código (BoxGeometry), nas mesmas cores e tamanhos

O usuário perde detalhamento visual, mas a mecânica de encaixe e a condição de vitória da Seção 6 continuam intactas em qualquer nível de degradação.

11. Erros, limites e degradação
Aparelho não suporta o regime: o botão correspondente de VR ou AR não aparece na interface. A aplicação roda no regime de tela convencional (mouse/toque).
Permissão de câmera negada (AR): o navegador recusa a criação da sessão. A tela inicial emite um aviso em HTML informando que o modo AR exige liberação da câmera, e mantém o usuário no modo tela.
Rastreamento se perde (AR): o painel trava no último referencial espacial conhecido. Surge um aviso de "Procurando superfície" até a câmera encontrar pontos de contraste suficientes para recalcular o plano.
Pessoa tenta alcançar fora do raio do braço (VR): o sistema não exige nenhum deslocamento físico do usuário (o que poderia causar acidentes no espaço real). O raio do controle funciona como extensão do braço: apontar para uma peça distante e apertar o gatilho faz a peça "voar" suavemente pelo espaço até se anexar à mão do usuário.

[PENDENTE: alinhar com a Seção 5 — "Apanhar o disjuntor" hoje descreve o gesto como instantâneo (aponta + gatilho → anexado). Decidir se o "voo suave" vale só para peças fora do alcance normal, ou para toda apanhada, e ajustar a seção que estiver desatualizada.]

12. Ativos, formatos e licenças
Modelo	Arquivo	Origem	Licença	Link
Trilho DIN	trilho_din.gltf	Sketchfab	CC-BY 4.0	Pendente de pesquisa exata — usar modelos gratuitos e creditados
Disjuntor	disjuntor.gltf	Sketchfab / GrabCAD	CC-BY 4.0 / Open	Pendente — se for muito pesado, modelar versão low-poly
Barramento	barramento.gltf	Modelagem própria	CC0 (Domínio Público)	Feito no Blender ou Tinkercad, pela simplicidade geométrica
13. Plano de construção por blocos
Final do Bloco A: sonda de capacidades WebXR rodando, e este documento de especificação/domínio entregue.
Final do Bloco B: cena base em Three.js renderizando na tela do PC, com luzes configuradas, caixa montada via código e OrbitControls funcionando.
Final do Bloco C: modelos GLTF importados, escalas (1:1 e 1:3) definidas e botões de transição para modo VR funcionais.
Final do Bloco D: lógica do Raycaster rodando: apanhar, arrastar e soltar os disjuntores com detecção básica de colisão funcionando.
Final do Bloco E: regras de encaixe (snap no trilho e barramento) finalizadas, e ancoragem horizontal via hit-test do modo AR operando.
14. Riscos, decisões em aberto e declaração de uso de IA

Riscos reais do projeto:

Dificuldade de encontrar modelos GLTF gratuitos de disjuntores que não sejam pesados em polígonos (arquivos CAD costumam vir sem otimização). Pode ser necessário dizimar a malha no Blender de última hora.
Fazer o projeto sem grupo formado. Isso concentra toda a carga de depurar matemática de matrizes e quaternions (rotação) em uma única pessoa, com risco real de atraso nos Blocos D e E se algo quebrar nas colisões.

Decisões em aberto:

A física visual dos fios elétricos: ainda não decidido se a ponta do fio será uma linha reta virtual ou uma geometria dinâmica (curva de Bézier) para parecer flexível ao ser puxado. Decisão adiada para o Bloco D, testando o impacto de performance das duas opções.