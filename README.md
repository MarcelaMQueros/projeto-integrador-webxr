# Quadro Elétrico WebXR

Projeto Integrador de Realidade Aumentada e Virtual.
Um quadro elétrico onde disjuntores, barramento e fios são montados num trilho DIN, pensado para rodar em três regimes: tela, visor (VR) e câmera (AR).

Grupo: Marcela Queros e Virgilio.

Estado atual: fim do Módulo 03 (etiqueta `modulo-03`).
A cena já aparece na tela, montada como árvore, com a sonda de capacidades e o indicador de custo do quadro dentro da cena.
Já dá para montar o quadro inteiro com cliques: disjuntores no trilho, barramento e fios. Quando tudo está no lugar, a caixa fica verde e aparece "Circuito Fechado!".

Especificação completa: [docs/especificacao.md](docs/especificacao.md)
Diário de decisões: [decisoes.md](decisoes.md)

## Como rodar

Precisa do Node.js 20 ou mais novo.

```bash
git clone https://github.com/MarcelaMQueros/projeto-integrador-webxr.git
cd projeto-integrador-webxr
git checkout modulo-03
npm install
npm run dev
```

Abra `https://localhost:5173` no navegador.
O certificado é gerado na hora pelo Vite e é autoassinado, então o navegador vai reclamar: clique em "Avançado" e depois em "Continuar para localhost".
O HTTPS é obrigatório porque a API WebXR só existe em contexto seguro.

Para abrir no celular ou no visor, eles precisam estar na mesma rede Wi-Fi que o computador.
Use o endereço que aparece no terminal em `Network`, por exemplo `https://192.168.0.10:5173`.

Sem visor e sem celular com AR, dá para testar a sessão imersiva com a extensão Immersive Web Emulator (Meta) no Chrome.

## O que aparece na tela

- Painel da esquerda: a sonda. Mostra se a API WebXR existe, se o aparelho declara VR e AR e, depois que uma sessão abre, o estado de cada recurso pedido, as fontes de entrada e os graus de liberdade.
- Painel da direita: botões da demonstração e o resultado da troca de pai.
- Na parede, ao lado do quadro: o indicador de custo do quadro.

Botões:

1. **Prender disjuntor-1 no trilho**: troca o pai do disjuntor-1 (da bancada para o trilho) e mostra a posição no mundo antes e depois. Clicando de novo ele volta para a bancada.
2. **Mover o quadro**: o quadro desliza na parede. O trilho vai junto porque é filho do fundo da caixa. Se o disjuntor-1 estiver preso no trilho, ele vai junto também.
3. **Simular máquina lenta**: gasta 30 ms a mais em cada quadro. O quadro continua andando na mesma velocidade, só fica menos suave, e o indicador mostra os quadros acima do teto.

## Como montar o quadro

Clique numa peça da bancada (ela fica amarela). As vagas onde ela pode entrar aparecem em verde. Clique numa vaga verde para encaixar, ou na mesa para devolver a peça.

1. Os 3 disjuntores entram nas vagas do trilho.
2. O barramento só aceita quando os 3 disjuntores estão encostados (vagas vizinhas).
3. Os 6 fios entram nos bornes dos disjuntores encaixados (2 por disjuntor).

Um disjuntor com barramento ou fio ligado fica travado: para mudar ele de lugar, tire antes o barramento e os fios.

No VR é igual, apontando com o raio do controle e apertando o gatilho. No AR a cena aparece em miniatura (1:3) na sua frente.

O barramento (a peça laranja) vai embaixo dos 3 disjuntores e só aparece a vaga dele quando os 3 estão em vagas vizinhas.

O mouse gira a câmera (botão esquerdo), arrasta (botão direito) e aproxima (rodinha). No celular: 1 dedo gira, pinça com 2 dedos aproxima. O botão "Painéis" esconde os painéis.


## Aparelhos testados

| Aparelho | Regime que abriu | O que não abriu |
|---|---|---|
|  PC , Windows, Chrome [versão] | Tela: cena, sonda, troca de pai, montagem e indicador funcionando|
|  Celular [POCO F3], Android , Chrome  | Tela: cena, sonda e botões funcionando | Montar as peças pelo toque ficou difícil: as peças ficam pequenas demais na tela 

## Arquivos principais

- `src/main.ts`: cria o renderer, liga os botões e roda o laço de animação.
- `src/scene.ts`: monta a árvore da cena (parede, quadro, trilho, bancada e peças).
- `src/hierarquia.ts`: troca de pai preservando a posição no mundo.
- `src/montagem.ts`: o encaixe por clique e a conferência da tarefa.
- `src/orcamento.ts`: tetos do quadro e médias do custo.
- `src/indicador.ts`: o painel de custo desenhado dentro da cena.
- `src/sonda.ts`: consulta ao aparelho e relatório na tela.

## Licença

MIT, ver [LICENSE](LICENSE).
