# Relevantia Lab

A porta de entrada gratuita do ecossistema Relevantia. É a primeira plataforma que um possível cliente usa: ele não paga nada, faz o Raio X da empresa, acompanha a live Audiência S/A e daqui é levado para as outras soluções.

| Solução | Como o usuário entra pelo Lab |
| --- | --- |
| Relevantia Intelligence | Teste de 3 dias grátis |
| Radar | Cadastro gratuito (marca, detentor ou agência) |
| The Edge | Inscrição (vai para o time com perfil e Raio X) |
| Agentes e plug and play | Teste de 3 dias grátis |

O visual segue o Design System v3.2. A estrutura e os componentes vêm do Relevantia Intelligence: sidebar com seções, topbar com breadcrumb, overlines, cards, campos e botões em pílula. A identidade continua a escura do Lab, com fundo tinta, grade fina de ouro e o laudo em papel creme. A logo é a oficial (`assets/logos/mark-1.png`, o mesmo arquivo do Intelligence). Sem itálico, título num peso e numa cor só e ouro de preenchimento sempre em gradiente. A copy das soluções é a mesma do site.

## Fluxo

1. **Boas-vindas**: o que o Lab libera, de graça.
2. **Cadastro**: nome, e-mail, empresa, segmento e cargo.
3. **Raio X**: 9 perguntas, uma por vez. Faturamento, time e maior desafio completam o perfil. As outras 6 perguntas leem uma dimensão do Intelligence cada (Core, Brand, Audience, Business, Partnerships e Beyond).
4. **Laudo gratuito**: o momento da empresa (Em ajuste, Em travessia, Em tração ou Pronta para escalar), um sinal de atenção e a dimensão que pede atenção. A nota das seis dimensões fica bloqueada e leva ao teste do Intelligence.
5. **Lab**: no primeiro acesso, um tutorial guiado é aberto. O botão `?` no topo abre o tutorial de novo.

## Menu

- **Relevantia**: Início (próximo passo recomendado e status das soluções), Soluções e Agentes e plug and play.
- **Audiência S/A**: Lives, Dúvidas, Votações e Anotações + IA (uma leitura rápida por live).
- **Sua empresa**: Raio X e Perfil.

## Próximo passo recomendado

`recommend()` em `js/lab.js`:
- Dono, sócio ou CEO de empresa com faturamento de R$ 5 milhões ou mais → The Edge.
- Partnerships como a dimensão que pede atenção → Radar.
- O resto → Intelligence.

O que o usuário já ativou sai da fila e entra o próximo.

## O que ajustar antes de publicar

No topo de `js/lab.js`:

- `CONFIG.live`: dia da semana, horário (terça, 20h), duração e link da live.
- `CONFIG.urls.intelligence`: link de acesso ao teste do Intelligence. Com `#`, o usuário vê que o acesso chega por e-mail.
- `CONFIG.edgeEndpoint`: para onde vai a inscrição no The Edge. Vazio = abre o e-mail para `CONFIG.contact.email` com a mensagem pronta (ou o WhatsApp, se `CONFIG.contact.whatsapp` estiver preenchido), como no formulário do site.
- `TOOLS`: os agentes e plug and play. É uma seleção curta da planilha "Frameworks The Edge", só com o que já dá para entregar hoje, sem integração: Agente de Prospecção (o Hunting Agent), Agente de Proposta e Inventário de Ativos. Preencha `url` com o link de acesso de cada um.
- `CONTENT`: títulos das lives, votação e perguntas iniciais. **São dados de exemplo.**

## IA das anotações

Sem endpoint, a IA roda localmente: ela identifica o assunto da anotação por palavras-chave e liga com o perfil e o desafio da empresa. Para usar um modelo de verdade, configure `CONFIG.aiEndpoint`. O app envia um `POST` com `{ nota, live, perfil, raiox }` e espera de volta `{ leitura, pergunta }`. Se a chamada falhar, ele volta para a leitura local.

## Dados

Tudo fica no `localStorage` do navegador (chave `lab-relevantia-v2`). Quem usou a V1 mantém perfil, anotações e votos, e refaz o Raio X, porque agora ele lê as seis dimensões. Para formar a base de leads da Relevantia, é preciso conectar um back-end, por exemplo Supabase. O objeto de estado `S` já tem o formato a salvar (`profile`, `raiox`, `trials`, `radar`, `edge`, `notes`, `questions` e votos). Em Perfil, o botão **Copiar meus dados** copia esse objeto em JSON.

## Estrutura

```
index.html     → casca da página
css/lab.css    → estilos (tokens do DS v3.2 + componentes do Lab)
js/lab.js      → app inteiro (rotas, Raio X, soluções, IA, tutorial)
detentores/    → versão do Lab para detentores de audiência
```

## Rodar localmente

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000.
