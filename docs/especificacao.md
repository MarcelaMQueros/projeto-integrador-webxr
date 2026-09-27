## 1. Identificação do grupo e da cena

**Grupo:** Marcela Queros e Virgilio
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
| Caixa do Quadro | 1 | Código (BoxGeometry: fundo + 4 bordas) | Não | Estrutura base da cena. Fica presa na parede. |
| Trilho DIN | 1 | Código (BoxGeometry) no Módulo 03; modelo importado (GLTF) no módulo de ativos | Não | Fixo no fundo da caixa. Serve como âncora e eixo de restrição. |
| Disjuntores | 3 | Código (BoxGeometry) no Módulo 03; modelo importado (GLTF) no módulo de ativos | Sim | Movimento livre até o trilho. Após o "clique", o movimento fica restrito a um grau de liberdade (desliza apenas lateralmente no eixo do trilho). |
| Barramento (Pente) | 1 | Código (BoxGeometry) no Módulo 03; modelo importado (GLTF) no módulo de ativos | Sim | Move livremente até conectar e travar a base dos 3 disjuntores simultaneamente. |
| Fios / Bornes | 6 | Código (CylinderGeometry) | Sim | Duas conexões por disjuntor. O usuário arrasta a ponta até plugar na entrada. |
| Parede | 1 | Código (BoxGeometry) | Não | Onde o quadro fica preso. Entrou no Módulo 03 (ver Seção 14). |
| Bancada (tampo + 4 pernas) | 1 | Código (BoxGeometry) | Não | Onde as peças soltas esperam. Entrou no Módulo 03 (ver Seção 14). |

## 4. O espaço e as escalas

**Dimensões físicas dos objetos:**

- Caixa do Quadro Elétrico: 30 cm × 25 cm × 10 cm (largura × altura × profundidade). O tamanho comporta até 6 posições — decisão intencional: com apenas 3 disjuntores na cena, sobra espaço no trilho para o usuário deslizar as peças lateralmente após o encaixe inicial, além de refletir a prática real de deixar espaço de reserva (NBR 5410).
- Disjuntor individual: 1,8 cm × 8,0 cm × 7,5 cm. Medida de um disjuntor monopolar padrão DIN.
- Trilho DIN: 28 cm × 3,5 cm × 0,75 cm (comprimento × altura × profundidade). 35 mm é a largura do trilho padrão; 28 cm cabe dentro da caixa de 30 cm.
- Barramento (pente): 5,4 cm × 1,2 cm × 1,5 cm. 5,4 cm = 3 disjuntores de 1,8 cm lado a lado. Encaixa logo abaixo dos 3 disjuntores.
- Fio: cilindro de 3,6 mm de diâmetro e 15 cm de comprimento.
- Parede: 3,0 m × 2,5 m × 0,10 m.
- Bancada: tampo de 1,00 m × 0,50 m × 0,04 m, com o topo a 0,75 m do chão (altura de mesa comum). Fica encostada na parede, logo abaixo do quadro.
- Uma unidade da cena é um metro.

**Regimes de visualização e escalas:**

- **VR (escala 1:1):** o quadro é renderizado em tamanho real. Usando local-floor como âncora, o objeto fica a 1,30 m de altura do chão virtual — altura escolhida deliberadamente para priorizar o alcance confortável dos braços (cotovelos flexionados), evitando a fadiga de manter os braços erguidos na altura dos olhos por tempo prolongado.
- **AR (escala 1:3):** como o hit-test mapeia superfícies horizontais com mais facilidade, o painel é reduzido a ~33% do tamanho original e ancorado deitado sobre uma mesa física — formato de "bancada de estudo", otimizando a estabilidade do rastreamento em hardware mobile.

### 4.1 Como a cena está montada (árvore)

Desde o Módulo 03 a cena é uma árvore: cada objeto guarda a posição em relação ao pai, e não em relação à sala.

```
sala
  luz-ambiente
  luz-direcional
  chao
  controles do VR       (fora do mundo: seguem a mão real)
  mundo                 (1:1 na tela e no VR, 1:3 no AR)
    parede
      quadro              (centro a 1,30 m do chão)
        fundo-da-caixa
          trilho-din
            vaga-1 ... vaga-6    (onde os disjuntores encaixam)
            vaga-barramento
        borda-cima / borda-baixo / borda-esquerda / borda-direita
      indicador-de-custo
    bancada
      tampo               (topo a 0,75 m)
        disjuntor-1, disjuntor-2, disjuntor-3   (cada um com 2 bornes)
        barramento
        fio-1 ... fio-6
      perna-1 ... perna-4
```

Parentescos que existem por razão de projeto:

- **parede e bancada são filhas de mundo, e os controles não**: no AR a cena vai para a frente de quem entra em 1:3, e isso é feito mexendo só no nó `mundo`. Os controles ficam fora dele porque seguem a mão real: se fossem filhos do mundo, encolheriam e sairiam do lugar junto com ele.


- **trilho-din é filho de fundo-da-caixa**: no quadro real o trilho é parafusado no fundo. Mover o quadro (na parede em VR, ou sobre a mesa pelo hit-test em AR) tem de levar o trilho junto sem ninguém somar coordenada.
- **quadro é filho de parede**: o quadro é preso na parede, e a altura de 1,30 m fica escrita uma vez só.
- **peças soltas são filhas do tampo**: estão apoiadas na bancada. As peças nascem no tampo, e não no trilho, porque o encaixe é justamente a troca de pai (tampo → trilho).
- **disjuntor encaixado vira filho do trilho**: depois do "clique" ele tem de acompanhar o trilho. Isso é feito com uma troca de pai (`src/hierarquia.ts`), não recalculando a posição a cada quadro.
- **fio ligado vira filho do disjuntor**: o fio fica preso no borne. Se o disjuntor mudar de vaga, ou se o quadro se mover, o fio vai junto.
- **bornes são filhos do disjuntor e vagas são filhas do trilho**: são os pontos de encaixe, e precisam andar junto com a peça que os tem.

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

## 8. Retorno ao usuário

| Momento | Retorno |
|---|---|
| Objeto mirado (antes de apanhar) | Hover / feedback de mira: quando o cursor (PC), o raio do controle (VR) ou o centro da tela (AR) cruza a hit-box de uma peça interativa, a malha ganha um contorno (outline) amarelo neon de 2px. No desktop, o cursor padrão também muda para o formato de mão (pointer). |
| Objeto apanhado | Destaque nas bordas + peça anexada ao controle |
| Encaixe aceito | Som de clique + snap visual (alinhamento automático) |
| Encaixe recusado | Contorno vermelho / peça translúcida / ícone de "distância incorreta" (varia por tipo de encaixe, ver Seção 5) |
| Tarefa concluída | Luzes do painel acendem + mensagem "Circuito Fechado" |

## 9. Os três regimes

| Aspecto | Tela (Desktop/Mobile Web) | Visor (VR) | Câmera (AR) |
|---|---|---|---|
| O que faz com o mundo de quem observa | Não toca: mostra a cena por uma janela (o monitor) | Substitui o mundo inteiro | Mantém o mundo real e deposita o quadro sobre ele |
| Espaço de referência | Nenhum do WebXR: câmera virtual própria (OrbitControls), origem no chão da sala virtual | `local-floor` (origem no piso real); se não vier, `local` | `local-floor` (se não vier, `local`) + hit-test contra as superfícies reais |
| O que é rastreado | Nada: só mouse e teclado | Cabeça (6 graus quando o aparelho declara) e os dois controles | Posição e rotação do celular e as superfícies horizontais da mesa |
| Contra o que a cena é registrada | Contra a própria sala virtual | Contra o chão físico: o centro do quadro fica a 1,30 m do piso real | Contra a mesa real: o ponto que o hit-test devolve vira a base do quadro, em escala 1:3 |
| Como se olha | Mouse e teclado (orbit controls) | Movimento natural da cabeça | Movendo o próprio celular pelo espaço |
| Como se aponta e age | Cursor do mouse central e clique | Controle rastreado pelo raio e gatilho | Toque direto na tela sobre o objeto |
| Escala da cena | 1:1 em metros, com a câmera afastada para caber no monitor | 1:1 (tamanho real, altura ancorada a 1,30m do chão) | 1:3 (reduzida, ancorada horizontalmente sobre a mesa) |
| O que a cena faz de diferente | Fica flutuando no vazio com câmera externa; usa botões HTML | Isola o usuário com fundo de estúdio escuro; interface no espaço 3D | Usa o mundo físico como fundo; painel projeta sombra sobre a mesa real |
| O que NÃO existe | Não há noção de escala física nem imersão de profundidade | Não há visão do mundo externo real | Não há fundo renderizado; recursos que exigem precisão de raio dão lugar ao toque |

Estado no fim do Módulo 03: o regime de tela está completo, que é o que este módulo pede, e já dá para fazer a tarefa inteira da Seção 6 com o mouse (encaixe por dois cliques, ver Seção 14). No VR o mesmo encaixe funciona com o gatilho do controle; foi visto no emulador, não em visor físico. No AR a cena inteira aparece em 1:3, uns 50 cm à frente de quem entra e um pouco abaixo dos olhos (o nó `mundo` é movido e encolhido no primeiro quadro da sessão). Prender o quadro numa mesa real com o hit-test ainda é promessa.

## 10. Orçamento e desempenho

O painel é composto por 12 objetos principais de interação: 1 caixa, 1 trilho, 3 disjuntores, 1 barramento e 6 fios (bornes).

Os 3 disjuntores e os 6 fios são repetições exatas do mesmo modelo, tornando-os candidatos naturais para instanciação (InstancedMesh ou reaproveitamento de geometria/material), poupando chamadas de desenho na GPU.

**Teto do quadro (declarado no Módulo 03, antes de ter conteúdo pesado):**

| Onde | Teto | De onde vem |
|---|---|---|
| Tela (máquina do laboratório) | 16,7 ms | 60 imagens por segundo |
| Visor | 11,1 ms | 90 imagens por segundo |

- O laço anda pelo tempo transcorrido (`clock.getDelta()`), e não pelo número de quadros.
- O tempo entregue à cena é limitado a 0,1 s por quadro (teto de salto). Quando a aba perde o foco o laço para, e ao voltar o intervalo pode ser de segundos; sem o limite o quadro pularia de uma vez.
- O indicador de custo fica dentro da cena, na parede ao lado do quadro, e é redesenhado a cada 0,5 s (redesenhar a textura todo quadro também custa, e número que muda 60 vezes por segundo não dá para ler).

**Contagem atual da cena (regime de tela, não depende da máquina):** 24 chamadas de desenho e 482 triângulos. Os 6 fios são 288 desses triângulos.

**Medições** (média de 60 quadros, lida no indicador, cena parada):

| Máquina | Navegador | Intervalo médio | Custo do quadro | Acima do teto |
|---|---|---|---|---|
| PC, Ryzen 7 5700X e RTX 3060 | [Chrome] | [16] ms | [0.14] ms | [35] % |
| [POCO F3] | [Chrome] | [16.5] ms | [0.86] ms | [35] % |

Ordem de degradação se o FPS cair (especialmente no AR de celulares mais fracos), sem alterar a lógica de vitória — nenhuma peça essencial é removida, apenas simplificada visualmente:

1. Simplificar a física dos 6 fios (trocar a geometria de tubo cilíndrico por linhas retas 2D, via LineBasicMaterial)
2. Trocar os modelos GLTF importados (disjuntores e barramento) por blocos primitivos do próprio código (BoxGeometry), nas mesmas cores e tamanhos

O usuário perde detalhamento visual, mas a mecânica de encaixe e a condição de vitória da Seção 6 continuam intactas em qualquer nível de degradação.

## 11. Erros, limites e degradação

- **Aparelho não suporta o regime:** o botão correspondente de VR ou AR não aparece na interface. A aplicação roda no regime de tela convencional (mouse/toque). A sonda mostra o regime como "Ausente (aparelho não declara)".
- **Recurso pedido e negado:** a sessão abre sem ele e a sonda mostra "Negado (pedido e recusado)". É diferente de ausente: o aparelho declarou o regime, mas não entregou aquele recurso (por exemplo, AR sem hit-test fica sem retículo). Quando o navegador não informa a lista de recursos, a sonda mostra "Desconhecido" em vez de negado.
- **Permissão de câmera negada (AR):** o navegador recusa a criação da sessão. A tela inicial emite um aviso em HTML informando que o modo AR exige liberação da câmera, e mantém o usuário no modo tela.
- **Rastreamento se perde (AR):** o painel trava no último referencial espacial conhecido. Surge um aviso de "Procurando superfície" até a câmera encontrar pontos de contraste suficientes para recalcular o plano.
- **Pessoa tenta alcançar fora do raio do braço (VR):** o sistema não exige nenhum deslocamento físico do usuário (o que poderia causar acidentes no espaço real). O raio do controle funciona como extensão do braço: apontar para uma peça distante e apertar o gatilho faz a peça "voar" suavemente pelo espaço até se anexar à mão do usuário.

[PENDENTE: alinhar com a Seção 5 — "Apanhar o disjuntor" hoje descreve o gesto como instantâneo (aponta + gatilho → anexado). Decidir se o "voo suave" vale só para peças fora do alcance normal, ou para toda apanhada, e ajustar a seção que estiver desatualizada.]

## 12. Ativos, formatos e licenças

| Modelo | Arquivo | Origem | Licença | Link |
|---|---|---|---|---|
| Trilho DIN | trilho_din.gltf | Sketchfab | CC-BY 4.0 | Pendente de pesquisa exata — usar modelos gratuitos e creditados |
| Disjuntor | disjuntor.gltf | Sketchfab / GrabCAD | CC-BY 4.0 / Open | Pendente — se for muito pesado, modelar versão low-poly |
| Barramento | barramento.gltf | Modelagem própria | CC0 (Domínio Público) | Feito no Blender ou Tinkercad, pela simplicidade geométrica |

No Módulo 03 nenhum desses arquivos é usado ainda: todas as peças são formas primitivas criadas em código, nas medidas da Seção 4.

## 13. Plano de construção por blocos

- **Final do Bloco A:** sonda de capacidades WebXR rodando, e este documento de especificação/domínio entregue. *(feito)*
- **Final do Bloco B:** cena base em Three.js renderizando na tela do PC, com luzes configuradas, caixa montada via código e OrbitControls funcionando. *(feito no Módulo 03, com a cena montada como árvore, troca de pai e indicador de custo)*
- **Final do Bloco C:** modelos GLTF importados, escalas (1:1 e 1:3) definidas e botões de transição para modo VR funcionais.
- **Final do Bloco D:** lógica do Raycaster rodando: apanhar, arrastar e soltar os disjuntores com detecção básica de colisão funcionando.
- **Final do Bloco E:** regras de encaixe (snap no trilho e barramento) finalizadas, e ancoragem horizontal via hit-test do modo AR operando.

## 14. Riscos, decisões em aberto e declaração de uso de IA

**Riscos reais do projeto:**

- Dificuldade de encontrar modelos GLTF gratuitos de disjuntores que não sejam pesados em polígonos (arquivos CAD costumam vir sem otimização). Pode ser necessário dizimar a malha no Blender de última hora.
- Grupo de duas pessoas. A carga de depurar matrizes e rotações nos Blocos D e E fica dividida só entre nós dois, e os dois precisam conseguir explicar todas as peças na arguição, inclusive as que o outro fez. Por isso cada um explica em voz alta, para o outro, as partes que não escreveu.
- Ao sair da sessão VR a tela fica em branco e só recarregar resolve (bug registrado no Módulo 02, ainda aberto).
- A sonda e a cena só foram vistas funcionando em uma máquina com emulador. Falta testar em aparelho de outra classe (ver tabela de aparelhos no README).

**Decisões em aberto:**

- A física visual dos fios elétricos: ainda não decidido se a ponta do fio será uma linha reta virtual ou uma geometria dinâmica (curva de Bézier) para parecer flexível ao ser puxado. Decisão adiada para o Bloco D, testando o impacto de performance das duas opções.
- O "voo suave" da Seção 11 (ver pendência lá).

**Decisões que mudaram desde o Módulo 01, com o motivo:**

| Antes | Agora | Motivo |
|---|---|---|
| Trilho, disjuntores e barramento vindos de GLTF desde o começo | Formas primitivas em código no Módulo 03; GLTF só no módulo de ativos | O Módulo 03 cobra a estrutura da cena. Modelo importado agora esconderia a árvore atrás de peças bonitas e gastaria o tempo da estrutura. As medidas já são as reais, então trocar a forma depois não muda a árvore. |
| Inventário sem parede e sem bancada | Parede e bancada entraram no inventário | A Seção 2 já dizia "contra a parede" e a Seção 6 dizia "apoiados na bancada virtual". Sem esses dois nós não havia de quem o quadro e as peças soltas serem filhos. |
| Seção 10 sem nenhum número de tempo | Teto de 16,7 ms (tela) e 11,1 ms (visor), declarado antes de ter conteúdo pesado | Sem teto, a primeira cena pesada vira discussão de gosto em vez de conta. |
| Escala da tela "arbitrária/reduzida" | Tela também em 1:1, só com a câmera afastada | Uma escala só para tela e VR evita corrigir cada medida depois. |
| Relatório de recursos com um estado só: "Negado/Ausente" | Quatro estados: concedido, negado (pedido e recusado), não pedido nesta sessão, desconhecido. Regime não declarado aparece como ausente | Ausente e negado pedem respostas diferentes do ambiente: sem o regime o botão nem aparece; com o regime e sem o recurso a sessão abre sem aquela parte. |
| Seção 5: arrastar a peça e soltar perto do lugar, com as folgas da Seção 7 | Encaixe por dois cliques: clica na peça, as vagas livres aparecem em verde, clica na vaga | Sem colisão, arrastar deixava a peça (principalmente os fios) atravessar o quadro. Com dois cliques a peça vai direto para a vaga e a tarefa inteira da Seção 6 já pode ser feita. Arrastar com as folgas da Seção 7 volta no módulo de manipulação. |
| Barramento de 5,4 × 0,5 × 1,0 cm | 5,4 × 1,2 × 1,5 cm | Com 5 mm de altura ele quase não aparecia na bancada e era difícil de clicar. |
| AR em tamanho real | AR em 1:3, na frente de quem entra | No emulador a pessoa nascia embaixo da cena. A Seção 4 já prometia 1:3 no AR. |
| Projeto feito por uma pessoa só | Grupo com duas pessoas: Marcela Queros e Virgilio | O Virgilio entrou no grupo durante o Módulo 03. A escolha da cena continua valendo, porque a razão de custo (folga de encaixe mais larga e pouca prática em modelagem) vale para os dois. |
| Parede a 0,65 m e bancada a 0,30 m da origem | Parede a 0,95 m e bancada a 0,60 m | No visor a pessoa começa na origem, e com a bancada a 0,30 m ela nascia encostada na mesa. Afastar a cena inteira resolveu sem código a mais. |
| Sonda sem fontes de entrada e sem graus de liberdade | Lê `session.inputSources` e `pose.emulatedPosition` durante a sessão | Eram pedidos do Módulo 02 que tinham ficado de fora (registrado em decisoes.md). |

**Tentado e abandonado:**

- **Pegar peças com o controle e com o toque, e colocar a cena na mesa no AR.** Cheguei a deixar isso funcionando com o código de exemplo do setup (`controllers.ts` e `ar.ts`). Sem colisão nem encaixe, as peças (principalmente os fios) atravessavam o quadro, e isso passava a impressão de defeito numa coisa que nem é deste módulo. Tirei os dois arquivos e troquei pelo encaixe de dois cliques (`src/montagem.ts`), que não deixa a peça passar por dentro de nada. Arrastar com colisão e o hit-test voltam nos Blocos D e E.

- **Cena como lista de objetos com coordenadas absolutas.** Até o Módulo 02 a cena eram 5 cubos soltos na sala, cada um com posição absoluta e animados por `performance.now()`. Com o quadro, isso obrigaria a somar a posição da parede, do quadro e do fundo em cada peça, e a refazer a soma para o trilho e para cada disjuntor encaixado toda vez que o quadro mudasse de lugar. Trocado pela árvore da Seção 4.1.
- **Prender o disjuntor copiando a posição do trilho a cada quadro.** Descartado antes de escrever: exigiria guardar a distância entre os dois, copiar posição e rotação todo quadro e desligar a cópia ao soltar. A troca de pai é uma operação só e não sai de sincronia.
- **Sonda importada só pelo efeito colateral (`import './sonda'`).** O resultado ficava preso dentro do arquivo e o resto do ambiente não conseguia consultar. Agora `capacidades` é exportado e o `main.ts` chama as funções.

**Declaração de uso de IA:**

Formatação do código para melhor leitura, organização, e dos textos.
