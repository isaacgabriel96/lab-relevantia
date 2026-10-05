# Lab Relevantia · V1 detentores

Versão do Lab para quem é dono de audiência: **personalidade, artista musical, evento e canal de mídia**. Mantém a mesma identidade, os mesmos módulos e a mesma lógica de mostrar uma amostra e deixar o resto para o The Edge.

## Fluxo

1. **Boas-vindas**: explica o protocolo de entrada.
2. **Cadastro**: formato do ativo, nome do ativo, perfil principal (@ ou link), nome, e-mail e relação com o ativo.
3. **Raio X do ativo**: 10 perguntas sobre canal principal, tamanho da audiência, resposta do público, diferencial, dados da audiência, estrutura comercial, relação com marcas, fontes de receita, faturamento e objetivo.
4. **Laudo**:
   - **Prontidão comercial**: Em formação, Pronto para testar, Pronto para vender ou Pronto para escalar.
   - **Diferencial** e um resumo das redes.
   - **Primeiro caminho de receita**, explicando por que é essa linha.
   - **Matriz de receita**: 8 linhas do formato escolhido, cada uma com prontidão (pronto agora, próximo passo, mais adiante) e potencial.
5. **Lab**: tutorial guiado no primeiro acesso, e o botão `?` abre de novo.

## O que fica bloqueado (convite para o The Edge)

- As colunas **Quanto cobrar** e **Como estruturar** da matriz.
- Marcas com fit com a audiência.
- Análise automática do perfil nas redes.
- Anotações + IA: uma leitura rápida por live.

## Onde ajustar a matriz

Em `js/lab.js`, `REVENUE` lista as linhas de receita de cada formato. Para cada linha:
- `req` é a nota mínima em cada critério: alcance de 0 a 4; resposta do público, dados, comercial e marcas de 0 a 3.
- `pot` é o potencial, de 1 a 3.

Esses valores são uma primeira proposta e precisam ser calibrados com o Isaac.

## Estrutura

```
index.html     → casca da página
css/lab.css    → estilos (tokens da Relevantia + componentes do Lab)
js/lab.js      → app inteiro (rotas, módulos, Raio X, IA, tutorial)
```

## O que ajustar antes de publicar

No topo de `js/lab.js`:

- `CONFIG.live`: dia da semana, horário, duração, link da live e do canal.
- `CONFIG.trialUrls`: links dos produtos (The Edge, Radar, Intelligence).
- `CONFIG.aiEndpoint`: endpoint da IA real (veja abaixo).
- `CONTENT`: títulos das lives, votação, perguntas iniciais e a descrição dos produtos. **São dados de exemplo.**

## IA das anotações

Sem endpoint, a IA roda localmente: ela identifica a linha de receita de que a anotação fala e liga com o perfil e o objetivo do ativo. Para usar um modelo de verdade, configure `CONFIG.aiEndpoint`. O app envia um `POST` com `{ nota, live, perfil, raiox }` e espera de volta `{ leitura, pergunta }`. Se a chamada falhar, ele volta para a leitura local.

## Dados

Na V1, tudo fica no `localStorage` do navegador. Para formar a base de empresas da Relevantia, é preciso conectar um back-end, por exemplo Supabase ou Firebase. O objeto de estado `S` em `lab.js` já tem o formato a salvar (`profile`, `raiox`, `notes`, `questions`, votos e trials). Em Perfil, o botão **Copiar meus dados** copia esse objeto em JSON.

## Rodar localmente

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000.
