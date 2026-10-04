# Lab Relevantia · V1 essencial

A plataforma de quem acompanha as lives semanais do Isaac. Esta versão entrega uma amostra do valor de propósito: mostra o suficiente para a pessoa querer a leitura completa, que fica no The Edge. A versão completa está preservada em `../Lab-completo/`.

Ela usa a identidade da landing com uma estética de caderno de laboratório: grade fina, rótulos técnicos e o laudo em papel creme.

## Fluxo

1. **Boas-vindas**: explica o protocolo de entrada.
2. **Cadastro**: nome, e-mail, empresa, segmento e cargo.
3. **Raio X**: 8 perguntas, uma por vez. Faturamento, time e maior desafio completam o perfil.
4. **Laudo rápido**: o momento da empresa (Em ajuste, Em travessia, Em tração ou Pronta para escalar) e um sinal de atenção. A leitura completa aparece bloqueada, com o convite para o The Edge.
5. **Lab**: no primeiro acesso, um tutorial guiado é aberto. O botão `?` no topo abre o tutorial de novo.

## O que fica de fora de propósito

- Pontuação detalhada e leitura por área: só o momento e um sinal aparecem.
- Anotações + IA: uma leitura rápida por live (um parágrafo e uma pergunta para a live). O próximo passo e a ligação com o diagnóstico completo aparecem bloqueados.

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

Sem endpoint, a IA roda localmente: ela identifica o assunto da anotação por palavras-chave e liga com o perfil e o desafio da empresa. Para usar um modelo de verdade, configure `CONFIG.aiEndpoint`. O app envia um `POST` com `{ nota, live, perfil, raiox }` e espera de volta `{ leitura, pergunta }`. Se a chamada falhar, ele volta para a leitura local.

## Dados

Na V1, tudo fica no `localStorage` do navegador. Para formar a base de empresas da Relevantia, é preciso conectar um back-end, por exemplo Supabase ou Firebase. O objeto de estado `S` em `lab.js` já tem o formato a salvar (`profile`, `raiox`, `notes`, `questions`, votos e trials). Em Perfil, o botão **Copiar meus dados** copia esse objeto em JSON.

## Rodar localmente

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000.
