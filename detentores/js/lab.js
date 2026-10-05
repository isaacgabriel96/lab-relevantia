/* Lab Relevantia · V1 detentores
   Para personalidades, artistas musicais, eventos e canais de mídia.
   App estático: os dados ficam no navegador (localStorage) até existir um back-end.
   Tudo que o Isaac precisa ajustar está em CONFIG e CONTENT, logo abaixo. */
(() => {
'use strict';

/* ============ CONFIGURAÇÃO ============ */
const CONFIG = {
  live: {
    weekday: 4,          // 0 = domingo … 4 = quinta
    hour: 19, minute: 0,
    durationMin: 90,
    url: '#',            // link do YouTube da próxima live
    channelUrl: '#',     // canal / playlist de gravações
  },
  // Endpoint da IA. Vazio = usa a leitura local (regras). Se preenchido, recebe
  // POST { nota, live, perfil, raiox } e deve devolver { leitura, pergunta }.
  aiEndpoint: '',
  trialUrls: { edge: '#', radar: '#', intelligence: '#' },
  storageKey: 'lab-relevantia-det',
};

/* ============ CONTEÚDO (dados de exemplo — trocar pelos reais) ============ */
const CONTENT = {
  nextLive: {
    num: 7,
    title: 'Patrocínio: como vender a sua audiência para marcas',
    desc: 'O que as marcas compram quando patrocinam alguém, como montar a proposta e quanto cobrar.',
    guest: 'Convidado a confirmar',
  },
  lives: [ // gravações, da mais recente para a mais antiga
    { num: 6, title: 'Parcerias que viram receita, não só post', desc: 'Os formatos de parceria com marcas que se repetem e como estruturar o primeiro.', dur: '1h22' },
    { num: 5, title: 'Licenciamento: quando o nome trabalha sozinho', desc: 'Como personalidades, artistas e eventos licenciam marca e imagem.', dur: '1h15' },
    { num: 4, title: 'O que as marcas olham antes de fechar', desc: 'Mídia kit, dados da audiência e o que pesa na decisão de uma marca.', dur: '1h31' },
    { num: 3, title: 'De audiência a marca própria', desc: 'Casos de quem transformou público em produto, e o que deu errado no caminho.', dur: '1h08' },
    { num: 2, title: 'Nicho vale mais que alcance', desc: 'Por que marcas pagam mais por audiências menores e bem definidas.', dur: '1h19' },
    { num: 1, title: 'O manual que ninguém escreveu', desc: 'A abertura das lives: o que mudou no mercado e por que tudo ao mesmo tempo.', dur: '1h04' },
  ],
  poll: {
    title: 'Tema da live #08',
    options: [
      { t: 'Mídia kit que vende', d: 'O que as marcas olham antes de fechar', base: 42 },
      { t: 'Licenciamento de imagem na prática', d: 'Contrato, royalties e o que não ceder', base: 31 },
      { t: 'Quanto cobrar por publi e por cota', d: 'Como chegar no preço sem se desvalorizar', base: 64 },
      { t: 'Marca própria: do teste ao lançamento', d: 'Validar antes de investir em estoque', base: 57 },
      { t: 'Afiliados ou contrato fixo?', d: 'Quando cada modelo paga mais', base: 23 },
    ],
  },
  seedQuestions: [
    { id: 's1', text: 'Quanto cobrar por um post quando tenho 50 mil seguidores num nicho bem específico?', by: 'Mariana', seg: 'Personalidade', votes: 38 },
    { id: 's2', text: 'Como apresentar o público de um festival para patrocinadores que nunca foram?', by: 'Rafael', seg: 'Evento', votes: 29 },
    { id: 's3', text: 'Licenciar música para publicidade compensa para artista independente?', by: 'Juliana', seg: 'Artista musical', votes: 21 },
    { id: 's4', text: 'Podcast com 20 mil ouvintes por episódio consegue patrocínio de temporada?', by: 'Diego', seg: 'Canal de mídia', votes: 17 },
  ],
  // descrições provisórias — validar com o Isaac
  trials: [
    { k: 'edge', name: 'The Edge', featured: true, icon: 'edge', days: 7,
      desc: 'A matriz de receita completa do seu ativo. O Raio X do Lab é só a primeira camada dela.',
      items: ['Preço de referência para cada linha de receita', 'Marcas com fit com a sua audiência', 'Plano de 90 dias para a primeira receita nova'] },
    { k: 'radar', name: 'Radar', icon: 'radar', days: 7,
      desc: 'Marcas investindo em patrocínio, publi e licenciamento no seu nicho, filtradas toda semana.',
      items: ['Marcas ativas no seu nicho', 'Oportunidades de patrocínio e licenciamento', 'Resumo semanal'] },
    { k: 'intelligence', name: 'Intelligence', icon: 'intel', days: 7,
      desc: 'Dados da sua audiência organizados para negociar com marcas.',
      items: ['Leitura das redes e da audiência', 'Benchmarks de ativos parecidos', 'Relatórios para mídia kit'] },
  ],
};

/* ============ RAIO X DO ATIVO ============ */
// O laudo mostra a prontidão comercial e a matriz de receita com o status de cada linha.
// Preço e estrutura de cada linha ficam no The Edge.
const TYPES = {
  personalidade: { n: 'Personalidade', d: 'Criador, influenciador, atleta, especialista', aud: 'seguidores', art: 'uma personalidade', ex: 'Seu nome ou @perfil' },
  artista: { n: 'Artista musical', d: 'Cantor, banda, DJ, produtor', aud: 'seguidores e ouvintes', art: 'um artista', ex: 'Nome artístico' },
  evento: { n: 'Evento', d: 'Festival, feira, campeonato, conferência', aud: 'público e seguidores', art: 'um evento', ex: 'Nome do evento' },
  canal: { n: 'Canal de mídia', d: 'Podcast, canal, newsletter, portal', aud: 'audiência mensal', art: 'um canal', ex: 'Nome do canal' },
};
const ROLES = ['Sou o próprio ativo', 'Empresário(a) / agente', 'Sócio(a) / produtor(a)', 'Time de marketing / comercial', 'Outro'];
const GOALS = [
  { l: 'Diversificar as fontes de receita', t: 'licenciamento' },
  { l: 'Fechar patrocínios maiores', t: 'patrocinio' },
  { l: 'Aumentar o valor do cachê ou das cotas', t: 'patrocinio' },
  { l: 'Lançar um produto ou marca própria', t: 'produto' },
  { l: 'Profissionalizar o comercial', t: 'audiencia' },
];
const STAGES = [
  { n: 'Em formação', p: 'O ativo tem audiência, mas ainda falta estrutura para transformá-la em receita de forma previsível.' },
  { n: 'Pronto para testar', p: 'Já dá para testar as primeiras linhas de receita. O ganho agora vem de escolher bem por onde começar.' },
  { n: 'Pronto para vender', p: 'O ativo tem o que as marcas procuram. O desafio é sair do pontual e montar contratos que se repetem.' },
  { n: 'Pronto para escalar', p: 'Audiência, estrutura e relação com marcas estão maduras. O próximo salto vem de linhas que pouca gente explora.' },
];
const stageOf = pct => pct < 30 ? 0 : pct < 55 ? 1 : pct < 78 ? 2 : 3;
const EDGE = {
  'Um nicho muito claro': 'Nicho claro faz uma marca pagar mais por menos alcance, porque ela sabe exatamente com quem está falando.',
  'Autoridade em um assunto': 'Autoridade abre linhas que alcance sozinho não abre, como palestras, licenciamento e produtos com o seu nome.',
  'Estética e estilo próprios': 'Estilo próprio é o ativo mais fácil de licenciar: marcas pagam para emprestar uma identidade que já é reconhecida.',
  'Uma comunidade fiel': 'Comunidade fiel sustenta as linhas em que a audiência paga direto: produto, evento e assinatura.',
  'Uma história ou causa forte': 'Uma causa forte atrai marcas que querem se associar a ela. Contratos longos costumam nascer daí.',
};
// k = nota usada na matriz (alcance 0–4, demais 0–3); f = campo do perfil
const QUESTIONS = [
  { f: 'plataforma', q: 'Onde está a maior parte da audiência de {ativo}?', o: ['Instagram', 'TikTok', 'YouTube', 'Spotify e streaming', 'LinkedIn', 'Presencial, no próprio evento', 'Outra'] },
  { k: 'reach', q: 'Somando todos os canais, qual o tamanho de {aud}?', hint: 'Uma estimativa basta.',
    o: ['Até 10 mil', '10 a 100 mil', '100 mil a 1 milhão', '1 a 10 milhões', 'Mais de 10 milhões'] },
  { k: 'engage', q: 'Quando {ativo} posta ou anuncia algo, a audiência…',
    o: ['Vê, mas reage pouco', 'Curte e compartilha', 'Comenta e conversa', 'Compra ou comparece quando é chamada'] },
  { f: 'diferencial', q: 'O que {ativo} tem que outros parecidos não têm?', o: Object.keys(EDGE) },
  { k: 'data', q: 'O quanto você conhece essa audiência?',
    o: ['Quase nada', 'O básico que as plataformas mostram', 'Temos mídia kit com dados', 'Temos dados próprios (lista, CRM, ingressos)'] },
  { k: 'com', q: 'Quem cuida da parte comercial hoje?',
    o: ['Ninguém, as marcas chegam sozinhas', 'Eu mesmo, quando dá', 'Um empresário ou agência', 'Um time comercial dedicado'] },
  { k: 'brands', q: 'Como tem sido a relação com marcas?', o: ['Nunca fechamos', 'Ações pontuais', 'Algumas recorrentes', 'Contratos anuais'] },
  { k: 'mix', q: 'Hoje, de quantas formas {ativo} gera receita?', o: ['Ainda não gera', 'De uma forma só', 'De 2 ou 3 formas', 'De 4 ou mais'] },
  { f: 'faturamento', q: 'E quanto {ativo} fatura por ano, somando tudo?', hint: 'Usamos só para comparar com ativos do mesmo porte.',
    o: ['Ainda nada', 'Até R$ 100 mil', 'R$ 100 mil a 1 milhão', 'R$ 1 a 10 milhões', 'Acima de R$ 10 milhões'] },
  { f: 'objetivo', q: 'Por último: qual é o principal objetivo agora?', hint: 'A IA usa isso para ler as suas anotações.',
    o: GOALS.map(g => g.l).concat('Outro'), last: true },
];

// linhas de receita por formato; req = nota mínima em cada critério; pot = potencial (1 a 3)
const REVENUE = {
  personalidade: [
    { n: 'UGC para marcas', d: 'Conteúdo feito para a marca usar nos canais dela.', req: { engage: 1 }, pot: 1 },
    { n: 'Afiliados', d: 'Comissão sobre vendas pelo seu link ou cupom.', req: { reach: 1, engage: 2 }, pot: 2 },
    { n: 'Publi e patrocínio', d: 'Marcas pagando para aparecer no seu conteúdo.', req: { reach: 1, engage: 1, com: 1 }, pot: 2 },
    { n: 'Palestras e presenças', d: 'Cachê para falar ou aparecer em eventos.', req: { reach: 1, engage: 1, com: 1 }, pot: 2 },
    { n: 'Embaixador de marca', d: 'Contrato longo e exclusivo com uma marca.', req: { reach: 2, engage: 2, com: 2, brands: 2 }, pot: 3 },
    { n: 'Licenciamento de imagem', d: 'Seu nome ou imagem em produtos e campanhas.', req: { reach: 3, com: 2, brands: 2 }, pot: 3 },
    { n: 'Marca própria', d: 'Um produto com o seu nome.', req: { reach: 2, engage: 3, data: 2 }, pot: 3 },
    { n: 'Evento próprio', d: 'Um encontro que a sua audiência paga para ir.', req: { reach: 2, engage: 3, data: 2, com: 1 }, pot: 2 },
  ],
  artista: [
    { n: 'Shows e cachê', d: 'Apresentações contratadas.', req: { reach: 1, com: 1 }, pot: 2 },
    { n: 'UGC e afiliados', d: 'Conteúdo para marcas e comissão sobre vendas.', req: { engage: 1 }, pot: 1 },
    { n: 'Publi e ações com marcas', d: 'Marcas presentes no seu conteúdo e nos seus shows.', req: { reach: 1, engage: 1, com: 1 }, pot: 2 },
    { n: 'Merch e marca própria', d: 'Produtos que os fãs compram.', req: { reach: 1, engage: 2, data: 1 }, pot: 2 },
    { n: 'Fã-clube pago', d: 'Assinatura com conteúdo e acesso exclusivos.', req: { engage: 3, data: 2 }, pot: 2 },
    { n: 'Patrocínio de turnê', d: 'Uma marca assina a turnê ou a temporada.', req: { reach: 2, com: 2, brands: 1 }, pot: 3 },
    { n: 'Licenciamento (sync e imagem)', d: 'Música em filmes, séries e campanhas; imagem em produtos.', req: { reach: 2, com: 2 }, pot: 3 },
    { n: 'Festival ou evento próprio', d: 'Um evento com a sua marca.', req: { reach: 3, engage: 2, data: 2, com: 2 }, pot: 3 },
  ],
  evento: [
    { n: 'Cotas de patrocínio', d: 'Marcas comprando presença no evento.', req: { reach: 1, com: 1 }, pot: 3 },
    { n: 'Ativações de marca', d: 'Espaços e experiências de marcas dentro do evento.', req: { reach: 1, com: 1 }, pot: 2 },
    { n: 'Produtos e merch', d: 'Itens que o público leva para casa.', req: { engage: 2 }, pot: 1 },
    { n: 'Hospitalidade e ingresso premium', d: 'Experiências pagas acima do ingresso comum.', req: { engage: 2, data: 1 }, pot: 2 },
    { n: 'Conteúdo e transmissão', d: 'Direitos de transmissão e conteúdo do evento.', req: { reach: 2, engage: 1, com: 1 }, pot: 2 },
    { n: 'Naming rights', d: 'Uma marca dá nome ao evento.', req: { reach: 3, com: 2, brands: 2 }, pot: 3 },
    { n: 'Novas edições e formatos', d: 'Levar o evento para outras cidades ou formatos.', req: { reach: 2, data: 2, com: 2 }, pot: 3 },
    { n: 'Licenciamento da marca', d: 'A marca do evento em produtos e experiências de terceiros.', req: { reach: 3, engage: 2, brands: 2 }, pot: 3 },
  ],
  canal: [
    { n: 'Produção para marcas (UGC)', d: 'Conteúdo feito para a marca usar.', req: { engage: 1 }, pot: 1 },
    { n: 'Publi e branded content', d: 'Marcas pagando para aparecer no canal.', req: { reach: 1, engage: 1, com: 1 }, pot: 2 },
    { n: 'Afiliados', d: 'Comissão sobre vendas pelo seu link ou cupom.', req: { reach: 1, engage: 2 }, pot: 2 },
    { n: 'Membros e assinatura', d: 'A audiência paga por conteúdo exclusivo.', req: { engage: 3, data: 2 }, pot: 2 },
    { n: 'Patrocínio de quadro ou temporada', d: 'Uma marca assina um formato fixo.', req: { reach: 2, com: 2, brands: 1 }, pot: 3 },
    { n: 'Evento ao vivo', d: 'O canal ao vivo, com ingresso e patrocínio.', req: { reach: 2, engage: 3, com: 1 }, pot: 2 },
    { n: 'Licenciamento de conteúdo', d: 'Outras plataformas pagando para exibir seu conteúdo.', req: { reach: 3, com: 2 }, pot: 3 },
    { n: 'Marca própria', d: 'Um produto com a marca do canal.', req: { reach: 2, engage: 3, data: 2 }, pot: 3 },
  ],
};
const CRIT = { reach: 'o tamanho da audiência', engage: 'a resposta do público', data: 'o conhecimento da audiência', com: 'alguém cuidando do comercial', brands: 'histórico com marcas' };
const STATUS = ['Pronto agora', 'Próximo passo', 'Mais adiante'];

/* IA local: assunto da anotação → leitura rápida + pergunta para a live */
const TOPICS = {
  patrocinio: ['patrocin', 'cota', 'naming', 'publi', 'embaixad', 'contrato'],
  afiliados: ['afiliad', 'cupom', 'comissao'],
  ugc: ['ugc', 'conteudo para marca', 'criativo', 'producao'],
  licenciamento: ['licenc', 'imagem', 'direito', 'sync', 'royalt'],
  evento: ['evento', 'show', 'festival', 'ingresso', 'turne', 'palco', 'presenca'],
  produto: ['marca propria', 'produto', 'merch', 'colecao', 'loja', 'lancamento'],
  palestra: ['palestra', 'keynote', 'mentoria', 'curso'],
  audiencia: ['audiencia', 'seguidor', 'comunidade', 'engajamento', 'dados', ' fa ', ' fas ', 'publico', 'midia kit'],
};
const IMPLY = {
  patrocinio: 'Patrocínio é a linha em que {ativo} vende acesso ao próprio público. O preço sobe quando a marca entende exatamente quem vai alcançar.',
  afiliados: 'Afiliado transforma recomendação em receita sem depender de fechar contrato. Funciona melhor quando o público já compra o que {ativo} indica.',
  ugc: 'UGC é a porta de entrada mais rápida: a marca paga pelo conteúdo, não pelo alcance. É um bom jeito de criar histórico com marcas.',
  licenciamento: 'Licenciamento é receita sem presença: o nome ou a obra de {ativo} trabalha sozinho em produtos e campanhas de outras marcas.',
  evento: 'Evento junta várias linhas de receita num lugar só: ingresso, patrocínio, ativação e conteúdo.',
  produto: 'Produto próprio é a linha com mais margem e mais risco. Depende de uma comunidade que compra, não só de alcance.',
  palestra: 'Palestra e mentoria vendem autoridade. Costumam pagar mais por hora do que conteúdo e abrem portas com empresas.',
  audiencia: 'Tudo que {ativo} sabe sobre a própria audiência vira argumento de venda. Dado próprio vale mais do que número de seguidores.',
};
const LIVE_Q = {
  patrocinio: 'Como precificar uma cota de patrocínio para {tipo} com {alcance} de audiência?',
  afiliados: 'Vale mais fechar com uma marca fixa ou trabalhar com vários afiliados, para {tipo} com {alcance} de audiência?',
  ugc: 'Como usar UGC para criar histórico com marcas e chegar em contratos maiores?',
  licenciamento: 'O que {tipo} precisa ter pronto antes de licenciar nome ou imagem?',
  evento: 'Qual o primeiro passo para {tipo} criar um evento próprio sem tomar prejuízo?',
  produto: 'Como {tipo} pode testar uma marca própria antes de investir em estoque?',
  palestra: 'Como {tipo} transforma autoridade em palestras pagas para empresas?',
  audiencia: 'Quais dados da audiência as marcas mais pedem antes de fechar com {tipo}?',
};

/* ============ ÍCONES ============ */
const P = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  play: '<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/>',
  ask: '<path d="M21 12a8 8 0 0 1-11.8 7L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M9.8 9.5a2.3 2.3 0 0 1 4.4.8c0 1.5-2.2 2-2.2 3.2"/><path d="M12 16.2h.01"/>',
  vote: '<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
  notes: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  flask: '<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/>',
  eco: '<circle cx="12" cy="12" r="3"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="m6.5 6.5 3.4 3.4M17.5 6.5l-3.4 3.4M6.5 17.5l3.4-3.4M17.5 17.5l-3.4-3.4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.2-2.5 3.6"/><path d="M12 17h.01"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  up: '<path d="m6 15 6-6 6 6"/>',
  file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
  link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12l6-6"/>',
  intel: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-6"/>',
  edge: '<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M12 22V12M21 7l-9 5-9-5"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  news: '<path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M16 8a5 5 0 0 1 0 8"/>',
  send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  chev: '<path d="m9 6 6 6-6 6"/>',
  out: '<path d="M14 3h7v7M21 3l-9 9"/><path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  refresh: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
};
const ic = (n, sw = 1.8) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;
const mark = (s = 24) => `<svg width="${s}" height="${s}" aria-hidden="true"><use href="#mark"/></svg>`;

/* ============ ESTADO ============ */
const blank = () => ({ profile: null, raiox: null, rxDraft: null, notes: [], questions: [], qVotes: [], pollVote: null, trials: {}, tourDone: false, createdAt: Date.now() });
let S = load();
function load() {
  try { const s = JSON.parse(localStorage.getItem(CONFIG.storageKey)); if (s && typeof s === 'object') return Object.assign(blank(), s); } catch (e) {}
  return blank();
}
function save() { try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(S)); } catch (e) {} }

/* ============ UTIL ============ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const norm = s => ' ' + String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, ' ') + ' ';
const fill = (t, o) => t.replace(/\{(\w+)\}/g, (_, k) => o[k] ?? '');
const first = n => String(n || '').trim().split(/\s+/)[0];
const initials = n => String(n || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const pad = n => String(n).padStart(2, '0');

function toast(msg) {
  const t = $('#toast');
  t.innerHTML = ic('check') + '<span>' + esc(msg) + '</span>';
  t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2800);
}

/* datas das lives */
function nextLiveStart(now = new Date()) {
  const { weekday, hour, minute, durationMin } = CONFIG.live;
  const d = new Date(now); d.setHours(hour, minute, 0, 0);
  let add = (weekday - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + add);
  if (d.getTime() + durationMin * 60000 < now.getTime()) d.setDate(d.getDate() + 7);
  return d;
}
const isLiveNow = () => { const s = nextLiveStart(); const n = Date.now(); return n >= s.getTime() && n < s.getTime() + CONFIG.live.durationMin * 60000; };
const pastDate = num => { const d = nextLiveStart(); d.setDate(d.getDate() - 7 * (CONTENT.nextLive.num - num)); return d; };
const fmtDay = d => d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
const fmtShort = d => d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
const fmtHour = d => d.getMinutes() ? `${d.getHours()}h${pad(d.getMinutes())}` : `${d.getHours()}h`;
const liveName = num => num === CONTENT.nextLive.num ? CONTENT.nextLive.title : (CONTENT.lives.find(l => l.num === num) || {}).title;

/* ============ RAIO X: cálculo ============ */
function computeRaiox(sc) {
  const max = { reach: 4, engage: 3, data: 3, com: 3, brands: 3, mix: 3 };
  const pct = Math.round(Object.keys(max).reduce((t, k) => t + (sc[k] || 0) / max[k], 0) / 6 * 100);
  return { sc, pct, stage: stageOf(pct), at: Date.now(), code: 'RX-' + Math.floor(1000 + Math.random() * 9000) };
}
// status de cada linha de receita a partir das notas
function matrix() {
  const sc = S.raiox.sc;
  return (REVENUE[S.profile.tipo] || REVENUE.personalidade).map(r => {
    const miss = Object.keys(r.req).filter(k => (sc[k] || 0) < r.req[k]);
    const gap = Object.keys(r.req).reduce((t, k) => t + Math.max(0, r.req[k] - (sc[k] || 0)), 0);
    const has = Object.keys(r.req).filter(k => (sc[k] || 0) >= r.req[k]);
    return { ...r, gap, miss, has, st: gap === 0 ? 0 : gap <= 2 ? 1 : 2 };
  });
}
function firstPath(m) {
  const ready = m.filter(r => r.st === 0).sort((a, b) => b.pot - a.pot);
  if (ready.length) return ready[0];
  return m.slice().sort((a, b) => a.gap - b.gap || b.pot - a.pot)[0];
}
const qvars = () => { const p = S.profile || {}, t = TYPES[p.tipo] || TYPES.personalidade; return { ativo: p.ativo || 'o ativo', aud: 'a ' + t.aud + ' de ' + (p.ativo || 'o ativo') }; };
const listPt = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1];

/* ============ ROTEADOR ============ */
const LAB_VIEWS = {
  inicio: { t: 'Início', i: 'home', sec: 'Lab' },
  lives: { t: 'Lives', i: 'play', sec: 'Lab' },
  duvidas: { t: 'Dúvidas', i: 'ask', sec: 'Lab' },
  votacoes: { t: 'Votações', i: 'vote', sec: 'Lab' },
  anotacoes: { t: 'Anotações + IA', i: 'notes', sec: 'Lab' },
  raiox: { t: 'Raio X', i: 'flask', sec: 'Seu ativo' },
  ecossistema: { t: 'Ecossistema', i: 'eco', sec: 'Seu ativo' },
  perfil: { t: 'Perfil', i: 'user', sec: 'Seu ativo' },
};
const app = $('#app');
let route = '';
const ui = { livesTab: 'gravacoes', openLive: null, noteLive: null, qSort: 'votos', aiBusy: null };

function go(r) { if (location.hash === '#' + r) render(); else location.hash = '#' + r; }
function resolve() {
  let r = location.hash.replace(/^#\/?/, '') || '';
  const onboarding = ['boas-vindas', 'cadastro', 'raio-x', 'processando', 'resultado'];
  if (!S.profile && !['boas-vindas', 'cadastro'].includes(r)) r = 'boas-vindas';
  else if (S.profile && !S.raiox && !['raio-x', 'processando', 'cadastro', 'boas-vindas'].includes(r)) r = 'raio-x';
  else if (S.profile && S.raiox && !onboarding.includes(r) && !LAB_VIEWS[r]) r = 'inicio';
  return r;
}
function render() {
  const r = resolve();
  if (('#' + r) !== location.hash) { history.replaceState(null, '', '#' + r); }
  route = r;
  endTour(true);
  window.scrollTo(0, 0);
  if (LAB_VIEWS[r]) app.innerHTML = shell(r, VIEWS[r]());
  else app.innerHTML = '<div class="glow"></div><div class="grid-bg"></div>' + ONB[r]();
  AFTER[r] && AFTER[r]();
  tick();
}
window.addEventListener('hashchange', render);

/* ============ ONBOARDING ============ */
function obTop(step) {
  const lbl = ['Cadastro', 'Raio X', 'Leitura'];
  const st = lbl.map((l, i) => `<div class="st ${i < step ? 'done' : i === step ? 'on' : ''}"><i>${i < step ? '✓' : i + 1}</i><span class="lbl">${l}</span></div>`).join('<span class="bar"></span>');
  return `<header class="ob-top"><span class="logo">${mark()}Relevantia<span class="lab-tag">LAB</span></span>${step >= 0 ? `<div class="steps" aria-label="Etapa ${step + 1} de 3">${st}</div>` : ''}</header>`;
}
const ONB = {
  'boas-vindas': () => `
  <div class="ob">${obTop(-1)}
    <main class="ob-body"><div class="welcome">
      <div>
        <span class="eyebrow"><span class="dot"></span>Lab Relevantia</span>
        <h1>Quantas formas de receita cabem na sua <span class="serif">audiência</span>?</h1>
        <p class="lead">O Lab de personalidades, artistas, eventos e canais de mídia. Lives semanais com o Isaac, suas dúvidas na pauta e uma leitura das formas como o seu ativo pode gerar receita.</p>
        <div class="cta">
          <button class="btn btn-gold btn-lg" data-go="cadastro">Começar ${ic('arrow', 2)}</button>
          <span class="meta">${ic('shield')}<span>Gratuito · cerca de 3 minutos</span></span>
        </div>
      </div>
      <div class="protocol" aria-label="Como funciona a entrada">
        <div class="protocol-h"><span class="mono">Protocolo de entrada</span><span class="mono" style="color:var(--t-3)">4 etapas</span></div>
        <ol>
          <li><span class="n">01</span><div><b>Cadastro</b><small>Quem é você e qual é o ativo.</small></div><span class="tm">30s</span></li>
          <li><span class="n">02</span><div><b>Raio X do ativo</b><small>10 perguntas rápidas sobre redes, audiência e comercial.</small></div><span class="tm">2min</span></li>
          <li><span class="n">03</span><div><b>Matriz de receita</b><small>As linhas de receita do seu formato e quais já estão ao alcance.</small></div><span class="tm">na hora</span></li>
          <li><span class="n">04</span><div><b>Entrada no Lab</b><small>Próxima live, dúvidas e anotações liberadas.</small></div><span class="tm">✓</span></li>
        </ol>
      </div>
    </div></main>
  </div>`,

  cadastro: () => {
    const p = S.profile || {};
    const opt = (arr, v) => '<option value="" disabled ' + (v ? '' : 'selected') + '>Selecione</option>' + arr.map(a => `<option ${a === v ? 'selected' : ''}>${esc(a)}</option>`).join('');
    const t = TYPES[p.tipo];
    return `
  <div class="ob">${obTop(0)}
    <main class="ob-body"><form class="ob-card" id="f-cadastro" novalidate>
      <span class="mono">Etapa 01 · Cadastro</span>
      <h2>Qual <span class="serif">ativo</span> está entrando no Lab?</h2>
      <p class="sub">O formato muda as linhas de receita que a gente vai olhar.</p>
      <div class="types" role="radiogroup" aria-label="Formato do ativo">
        ${Object.entries(TYPES).map(([k, v]) => `<label class="type ${p.tipo === k ? 'on' : ''}"><input type="radio" name="tipo" value="${k}" ${p.tipo === k ? 'checked' : ''} required><b>${v.n}</b><small>${v.d}</small></label>`).join('')}
      </div>
      <div class="form-grid" style="margin-top:20px">
        <label class="field"><span>Nome do ativo</span><input class="input" name="ativo" id="in-ativo" required placeholder="${esc(t ? t.ex : 'Nome, @perfil, evento ou canal')}" value="${esc(p.ativo)}"></label>
        <label class="field"><span>Perfil principal (opcional)</span><input class="input" name="handle" placeholder="@perfil ou link" value="${esc(p.handle)}"></label>
        <label class="field"><span>Seu nome</span><input class="input" name="nome" required autocomplete="name" placeholder="Nome e sobrenome" value="${esc(p.nome)}"></label>
        <label class="field"><span>E-mail</span><input class="input" name="email" type="email" required autocomplete="email" placeholder="voce@email.com" value="${esc(p.email)}"></label>
        <label class="field full"><span>Sua relação com o ativo</span><select class="input" name="papel" required>${opt(ROLES, p.papel)}</select></label>
      </div>
      <div class="ob-actions">
        <button type="button" class="btn btn-ghost" data-go="boas-vindas">${ic('back')}Voltar</button>
        <button type="submit" class="btn btn-gold">Ir para o Raio X ${ic('arrow', 2)}</button>
      </div>
      <p class="privacy">${ic('shield')}<span>Seus dados ficam com a Relevantia e são usados só para personalizar o Lab.</span></p>
    </form></main>
  </div>`;
  },

  'raio-x': () => {
    const dr = S.rxDraft || (S.rxDraft = { i: 0, a: {}, other: '' });
    const i = Math.min(dr.i, QUESTIONS.length - 1);
    const q = QUESTIONS[i], V = qvars();
    const sel = dr.a[i];
    const pct = (i / QUESTIONS.length) * 100;
    const tag = `<span class="chip-tag">${esc(TYPES[S.profile.tipo].n)}</span><span class="mono" style="color:var(--t-3)">${q.k ? 'Prontidão comercial' : 'Perfil do ativo'}</span>`;
    const keys = 'ABCDEF';
    const isOther = q.last && sel === q.o.length - 1;
    return `
  <div class="ob">${obTop(1)}
    <main class="ob-body"><div class="rx">
      <div class="rx-meter"><span class="mono">Raio X</span><div class="track"><div class="fill" style="width:${pct}%"></div></div><span class="count">${pad(i + 1)} / ${QUESTIONS.length}</span></div>
      <div class="rx-q" key="${i}">
        <div class="rx-tag">${tag}</div>
        <h2>${esc(fill(q.q, V))}</h2>
        ${q.hint ? `<p class="hint">${esc(fill(q.hint, V))}</p>` : '<div style="height:16px"></div>'}
        <div class="opts" role="radiogroup">
          ${q.o.map((o, k) => `<button type="button" class="opt ${sel === k ? 'sel' : ''}" role="radio" aria-checked="${sel === k}" data-act="rx-pick" data-k="${k}"><span class="k">${keys[k]}</span><span>${esc(o)}</span></button>`).join('')}
        </div>
        ${q.last ? `<label class="field rx-other" ${sel == null ? 'hidden' : ''}><span>${isOther ? 'Qual é o objetivo?' : 'Quer detalhar? (opcional)'}</span><textarea class="input" id="rx-other" rows="2" style="min-height:80px" placeholder="Ex.: fechar uma cota anual com uma marca de bebidas">${esc(dr.other)}</textarea></label>` : ''}
      </div>
      <div class="rx-nav">
        ${i > 0 ? `<button class="btn btn-ghost btn-sm" data-act="rx-back">${ic('back')}Anterior</button>` : `<button class="btn btn-ghost btn-sm" data-go="cadastro">${ic('back')}Cadastro</button>`}
        ${q.last ? `<button class="btn btn-gold" data-act="rx-finish" ${sel == null ? 'disabled' : ''}>Ver a matriz de receita ${ic('arrow', 2)}</button>` : (sel != null ? `<button class="btn btn-ghost btn-sm" data-act="rx-next">Próxima ${ic('arrow')}</button>` : '<span class="mono" style="color:var(--t-3)">Escolha uma opção</span>')}
      </div>
    </div></main>
  </div>`;
  },

  processando: () => `
  <div class="ob">${obTop(2)}
    <main class="ob-body"><div class="proc">
      <div class="flask"><svg viewBox="0 0 64 64" fill="none">
        <defs><clipPath id="fl"><path d="M25 6h14v18l15 26a5 5 0 0 1-4.3 7.5H14.3A5 5 0 0 1 10 50l15-26z"/></clipPath></defs>
        <g clip-path="url(#fl)"><rect class="liq" x="0" y="34" width="64" height="30" fill="url(#lg-gold)"/></g>
        <circle class="bub" cx="28" cy="46" r="2" fill="#F2E7C9"/><circle class="bub" cx="36" cy="50" r="1.6" fill="#F2E7C9"/><circle class="bub" cx="32" cy="42" r="1.3" fill="#F2E7C9"/>
        <path d="M25 6h14v18l15 26a5 5 0 0 1-4.3 7.5H14.3A5 5 0 0 1 10 50l15-26z" stroke="#C8A84B" stroke-width="2" stroke-linejoin="round"/><path d="M22 6h20" stroke="#C8A84B" stroke-width="2" stroke-linecap="round"/>
      </svg></div>
      <h2>Analisando <span class="serif">${esc(S.profile.ativo)}</span></h2>
      <ul id="proc-steps">
        <li><i></i>Calibrando pelo formato e tamanho</li>
        <li><i></i>Montando a matriz de receita</li>
        <li><i></i>Cruzando com o seu objetivo</li>
        <li><i></i>Escrevendo a leitura</li>
      </ul>
    </div></main>
  </div>`,

  resultado: () => `<div class="ob">${obTop(3)}<main class="ob-body">${report(false)}</main></div>`,
};

function stagesHTML(i, labels) {
  return `<div class="stages ${labels ? '' : 'mini-stages'}" role="img" aria-label="Etapa ${i + 1} de ${STAGES.length}: ${STAGES[i].n}">${STAGES.map((m, k) => `<div class="stage ${k < i ? 'past' : k === i ? 'on' : ''}"><i></i>${labels ? `<small>${m.n}</small>` : ''}</div>`).join('')}</div>`;
}
const dots = n => `<span class="pot" aria-label="Potencial ${['baixo', 'médio', 'alto'][n - 1]}">${[1, 2, 3].map(k => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')}</span>`;

function pathCard(fp) {
  const why = fp.st === 0
    ? `${esc(S.profile.ativo)} já tem ${listPt(fp.has.map(k => CRIT[k]))}, que é o que essa linha pede.`
    : `É a linha mais perto de ficar pronta. Falta ${listPt(fp.miss.map(k => CRIT[k]))}.`;
  return `<div class="vault">
    <div class="vault-h"><span class="mono">Primeiro caminho de receita</span><span class="st-chip s${fp.st}">${STATUS[fp.st]}</span></div>
    <h3 class="path-n">${esc(fp.n)}</h3>
    <p class="path-d">${esc(fp.d)}</p>
    <p class="path-why">${why}</p>
    <ul>
      <li><span class="k">${ic('lock')}</span><div><b>Quanto cobrar</b><i class="blur" style="width:72%"></i></div></li>
      <li><span class="k">${ic('lock')}</span><div><b>Marcas com fit com a sua audiência</b><i class="blur" style="width:86%"></i><i class="blur" style="width:58%"></i></div></li>
    </ul>
    <a class="btn btn-gold" href="#ecossistema">Quero a matriz completa ${ic('arrow', 2)}</a>
    <p class="vault-note">Disponível no The Edge, com teste grátis para quem está no Lab.</p>
  </div>`;
}

function report(inLab) {
  const R = S.raiox, p = S.profile, T = TYPES[p.tipo], St = STAGES[R.stage];
  const d = new Date(R.at), m = matrix(), fp = firstPath(m);
  const q = k => QUESTIONS.find(x => x.k === k);
  const ready = m.filter(r => r.st === 0).length;
  const rows = m.map(r => `<tr class="${r === fp ? 'hl' : ''}">
      <th scope="row"><b>${esc(r.n)}</b><small>${esc(r.d)}</small></th>
      <td><span class="st-chip s${r.st}">${STATUS[r.st]}</span></td>
      <td>${dots(r.pot)}</td>
      <td class="lk"><i class="blur" style="width:${50 + (r.n.length * 7) % 40}%"></i></td>
      <td class="lk"><i class="blur" style="width:${45 + (r.n.length * 11) % 45}%"></i></td>
    </tr>`).join('');
  return `
  <article class="paper report">
    <div class="report-h">
      <div><span class="mono">Laudo · Raio X do ativo</span><h2>A leitura de <span class="serif">${esc(p.ativo)}</span></h2><p>${esc(T.n)} · ${esc(p.plataforma || '')} · ${esc(q('reach').o[R.sc.reach])} de audiência</p></div>
      <div class="stamp"><span>AMOSTRA <b>${R.code}</b></span><span>DATA <b>${d.toLocaleDateString('pt-BR')}</b></span><span>TIPO <b>Leitura rápida</b></span></div>
    </div>
    <div class="report-body">
      <div>
        <span class="mono">Prontidão comercial</span>
        <h3 class="moment">${St.n}</h3>
        ${stagesHTML(R.stage, true)}
        <p class="moment-p">${St.p}</p>
        <div class="callout prio"><span class="mono">Diferencial</span><b>${esc(p.diferencial || '')}</b><p>${esc(EDGE[p.diferencial] || '')}</p></div>
        <div class="socials">
          <div><span class="mono">Canal principal</span><b>${esc(p.plataforma || '—')}</b></div>
          <div><span class="mono">Audiência</span><b>${esc(q('reach').o[R.sc.reach])}</b></div>
          <div><span class="mono">Resposta do público</span><b>${esc(q('engage').o[R.sc.engage])}</b></div>
        </div>
        <a class="locked-row on-paper" href="#ecossistema">${ic('lock')}<span>Análise automática ${p.handle ? 'de ' + esc(p.handle) : 'das redes'}: crescimento, engajamento real e perfil da audiência</span><b>The Edge</b></a>
      </div>
      ${pathCard(fp)}
    </div>
    <section class="matrix">
      <div class="matrix-h"><div><span class="mono">Matriz de receita · ${esc(T.n)}</span><h3>${m.length} formas de gerar receita. ${ready ? `${ready} ${ready > 1 ? 'já estão' : 'já está'} ao alcance.` : 'Nenhuma pronta ainda.'}</h3></div>
        <div class="legend"><span class="st-chip s0">${STATUS[0]}</span><span class="st-chip s1">${STATUS[1]}</span><span class="st-chip s2">${STATUS[2]}</span></div></div>
      <div class="table-wrap"><table>
        <thead><tr><th scope="col">Linha de receita</th><th scope="col">Prontidão</th><th scope="col">Potencial</th><th scope="col">${ic('lock')}Quanto cobrar</th><th scope="col">${ic('lock')}Como estruturar</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </section>
    <div class="report-foot">
      <p>Esta é uma leitura rápida, feita a partir de 10 respostas. Preço, estrutura e marcas com fit para cada linha ficam no <b>The Edge</b>.</p>
      <div class="acts">${inLab
        ? `<button class="btn btn-ghost" data-act="redo-rx">${ic('refresh')}Refazer Raio X</button>`
        : `<button class="btn btn-gold btn-lg" data-act="enter-lab">Entrar no Lab ${ic('arrow', 2)}</button>`}</div>
    </div>
  </article>`;
}

/* ============ SHELL DO LAB ============ */
function shell(r, body) {
  const p = S.profile;
  let sec = '';
  const nav = Object.entries(LAB_VIEWS).map(([k, v]) => {
    let h = '';
    if (v.sec !== sec) { sec = v.sec; h += `<div class="nav-sec">${sec}</div>`; }
    const badge = k === 'duvidas' && !myQuestions().length ? '<span class="badge">1</span>' : k === 'votacoes' && S.pollVote == null ? '<span class="badge">1</span>' : '';
    return h + `<a href="#${k}" class="nav-item ${k === r ? 'on' : ''}" data-tour="nav-${k}">${ic(v.i)}<span>${v.t}</span>${badge}</a>`;
  }).join('');
  const sub = { inicio: `Olá, ${esc(first(p.nome))}`, lives: 'Agenda e gravações', duvidas: `Para a live #${pad(CONTENT.nextLive.num)}`, votacoes: 'Você decide a pauta', anotacoes: 'Sua leitura de cada live', raiox: 'Prontidão e matriz de receita', ecossistema: 'Produtos Relevantia', perfil: 'Seus dados' }[r];
  return `<div class="glow"></div><div class="grid-bg"></div>
  <div class="shell">
    <aside class="side">
      <a href="#inicio" class="logo">${mark()}Relevantia<span class="lab-tag">LAB</span></a>
      <nav class="nav" aria-label="Lab">${nav}</nav>
      <a href="#perfil" class="side-foot"><span class="avatar">${esc(initials(p.nome))}</span><span class="who"><b>${esc(p.nome)}</b><small>${esc(p.ativo)}</small></span></a>
    </aside>
    <main class="main">
      <div class="top">
        <div class="crumb"><span class="mono">${sub}</span><h1>${LAB_VIEWS[r].t}</h1></div>
        <div class="top-acts"><button class="icon-btn" data-act="tour" data-tour="help" aria-label="Ver o tutorial" title="Tutorial">${ic('help')}</button></div>
      </div>
      <div class="view">${body}</div>
    </main>
  </div>`;
}

/* ============ VIEWS DO LAB ============ */
const myQuestions = () => S.questions.filter(q => q.live === CONTENT.nextLive.num);

function nextLiveCard() {
  const n = CONTENT.nextLive, d = nextLiveStart(), live = isLiveNow();
  return `<section class="card next-live" data-tour="next-live">
    <div class="nl-top"><span class="live-dot"></span>${live ? 'Ao vivo agora' : 'Próxima live'} · #${pad(n.num)}</div>
    <h2>${esc(n.title)}</h2>
    <p class="when">${fmtDay(d)}, às ${fmtHour(d)} · ao vivo no YouTube · ${esc(n.guest)}</p>
    ${live ? '<div style="height:22px"></div>' : `<div class="cd" data-cd="${d.getTime()}"><div><b data-u="d">--</b><small>dias</small></div><div><b data-u="h">--</b><small>horas</small></div><div><b data-u="m">--</b><small>min</small></div><div><b data-u="s">--</b><small>seg</small></div></div>`}
    <div class="nl-acts">
      <a class="btn btn-gold" href="${esc(CONFIG.live.url)}" target="_blank" rel="noopener" data-act="live-link">${live ? 'Entrar na live' : 'Link de acesso'} ${ic('out', 2)}</a>
      <a class="btn btn-ghost" href="${esc(gcalUrl())}" target="_blank" rel="noopener">${ic('cal')}Adicionar à agenda</a>
    </div>
  </section>`;
}

function weekTasks() {
  const lastPast = CONTENT.lives[0];
  return [
    { done: myQuestions().length > 0, t: `Enviar uma dúvida para a live #${pad(CONTENT.nextLive.num)}`, to: 'duvidas' },
    { done: S.qVotes.length >= 3, t: 'Votar em 3 perguntas de outros participantes', to: 'duvidas' },
    { done: S.pollVote != null, t: `Escolher o tema da live #${pad(CONTENT.nextLive.num + 1)}`, to: 'votacoes' },
    { done: S.notes.some(x => x.live === lastPast.num && x.ai), t: `Anotar a live #${pad(lastPast.num)} e gerar a leitura rápida`, to: 'anotacoes', live: lastPast.num },
  ];
}

const VIEWS = {
  inicio: () => {
    const R = S.raiox, tasks = weekTasks(), done = tasks.filter(t => t.done).length;
    const d = nextLiveStart(), prev = new Date(d); prev.setDate(prev.getDate() - 1);
    const avisos = [
      { i: 'play', t: `Live #${pad(CONTENT.nextLive.num)} ${fmtDay(d).split(',')[0]}, às ${fmtHour(d)}`, p: 'O link de acesso fica no card ao lado e chega por e-mail uma hora antes.', m: 'Lembrete', n: true },
      { i: 'ask', t: `Dúvidas para a live #${pad(CONTENT.nextLive.num)} até ${fmtDay(prev).split(',')[0]}`, p: 'As mais votadas entram primeiro na pauta.', m: 'Prazo' },
      { i: 'vote', t: `Votação aberta: ${CONTENT.poll.title.toLowerCase()}`, p: 'Cinco temas na disputa. O mais votado vira a próxima live.', m: 'Votação', n: S.pollVote == null },
      { i: 'news', t: 'Novidade no ecossistema: teste o Radar por 7 dias', p: 'Marcas investindo em patrocínio e licenciamento no seu nicho.', m: 'Ecossistema' },
      { i: 'file', t: `Gravação e material da live #${pad(CONTENT.lives[0].num)} disponíveis`, p: CONTENT.lives[0].title, m: 'Lives' },
    ];
    return `<div class="grid g-home">
      <div class="grid" style="align-content:start">
        ${nextLiveCard()}
        <section class="card" data-tour="week">
          <div class="card-h"><h3>Sua semana no Lab</h3><span class="mono">${done}/${tasks.length} feitos</span></div>
          <div class="progress-line"><i style="width:${done / tasks.length * 100}%"></i></div>
          <div class="week">${tasks.map(t => `<a href="#${t.to}" class="${t.done ? 'done' : ''}" ${t.live ? `data-act="note-go" data-live="${t.live}"` : ''}><span class="ck">${ic('check', 3)}</span><span>${esc(t.t)}</span>${ic('chev').replace('<svg', '<svg class="go"')}</a>`).join('')}</div>
        </section>
      </div>
      <div class="grid" style="align-content:start">
        <section class="card">
          <div class="card-h"><h3>Raio X de ${esc(S.profile.ativo)}</h3><a class="link small" href="#raiox">Ver laudo ${ic('arrow')}</a></div>
          <span class="mono">Prontidão comercial</span>
          <div class="moment-mini">${STAGES[R.stage].n}</div>
          ${stagesHTML(R.stage, false)}
          ${(() => { const m = matrix(), fp = firstPath(m), n = m.filter(r => r.st === 0).length; return `<p class="small muted">Primeiro caminho: <b style="color:var(--gold-3);font-weight:500">${esc(fp.n)}</b>. ${n} de ${m.length} linhas de receita já estão ao alcance.</p>`; })()}
          <a class="locked-row" href="#ecossistema">${ic('lock')}<span>Quanto cobrar e marcas com fit para cada linha</span><b>Matriz completa</b></a>
        </section>
        <section class="card">
          <div class="card-h"><h3>Avisos</h3><span class="mono">${ic('bell').replace('<svg', '<svg style="width:14px;height:14px;display:inline;vertical-align:-2px"')}</span></div>
          <div class="feed">${avisos.map(a => `<div class="feed-item ${a.n ? 'new' : ''}"><span class="ic">${ic(a.i)}</span><div><span class="mono">${a.m}</span><b>${esc(a.t)}</b><p>${esc(a.p)}</p></div></div>`).join('')}</div>
        </section>
      </div>
    </div>`;
  },

  lives: () => {
    const tab = ui.livesTab;
    const n = CONTENT.nextLive, d = nextLiveStart();
    const upcoming = [0, 1, 2].map(k => { const dd = new Date(d); dd.setDate(dd.getDate() + 7 * k); return { num: n.num + k, date: dd, title: k === 0 ? n.title : k === 1 ? 'Tema em votação' : 'A definir', desc: k === 0 ? n.desc : k === 1 ? 'O tema mais votado pelos participantes do Lab.' : 'Pauta montada a partir das dúvidas e votações.' }; });
    const row = (l, past) => `<article class="live-row">
      <div class="thumb"><span>#${pad(l.num)}</span>${past ? `<span class="play">${ic('play', 2.4)}</span>` : ''}</div>
      <div>
        <h4>${esc(l.title)}</h4>
        <div class="meta"><span>${fmtDay(l.date)}${past ? '' : ', ' + fmtHour(l.date)}</span>${past ? `<span>${l.dur}</span>` : ''}${l.num === n.num ? '<span style="color:var(--live)">● próxima</span>' : ''}</div>
        ${ui.openLive === l.num ? `<div class="detail">${esc(l.desc)}${past ? `<div class="materials"><a href="#" class="mat" data-act="mat">${ic('file')}Slides (PDF)</a><a href="#" class="mat" data-act="mat">${ic('notes')}Resumo da aula</a><a href="#" class="mat" data-act="mat">${ic('link')}Links citados</a></div>` : ''}</div>` : ''}
      </div>
      <div class="acts">
        <button class="btn btn-ghost btn-sm" data-act="toggle-live" data-live="${l.num}">${ui.openLive === l.num ? 'Fechar' : past ? 'Material' : 'Detalhes'}</button>
        ${past ? `<a class="btn btn-gold btn-sm" href="${esc(CONFIG.live.channelUrl)}" target="_blank" rel="noopener" data-act="rec">Assistir</a><button class="btn btn-ghost btn-sm" data-act="note-go" data-live="${l.num}">${ic('notes')}Anotar</button>` : l.num === n.num ? `<a class="btn btn-ghost btn-sm" href="${esc(gcalUrl())}" target="_blank" rel="noopener">${ic('cal')}Agenda</a>` : ''}
      </div>
    </article>`;
    const list = tab === 'agenda' ? upcoming.map(l => row(l, false)) : CONTENT.lives.map(l => row({ ...l, date: pastDate(l.num) }, true));
    return `<div class="tabs" role="tablist"><button class="${tab === 'gravacoes' ? 'on' : ''}" data-act="lives-tab" data-tab="gravacoes">Gravações</button><button class="${tab === 'agenda' ? 'on' : ''}" data-act="lives-tab" data-tab="agenda">Agenda</button></div>
    <div class="lives-list">${list.join('')}</div>`;
  },

  duvidas: () => {
    const p = S.profile, n = CONTENT.nextLive;
    const all = CONTENT.seedQuestions.map(q => ({ ...q, votes: q.votes + (S.qVotes.includes(q.id) ? 1 : 0) }))
      .concat(myQuestions().map(q => ({ id: q.id, text: q.text, by: first(p.nome), seg: TYPES[p.tipo].n, votes: 1, mine: true, at: q.at })));
    all.sort(ui.qSort === 'votos' ? (a, b) => b.votes - a.votes : (a, b) => (b.at || 0) - (a.at || 0));
    return `<div class="grid g-split">
      <section class="card q-form">
        <div class="card-h"><h3>Envie sua dúvida</h3><span class="mono">Live #${pad(n.num)}</span></div>
        <p class="small muted" style="margin-bottom:14px">${esc(n.title)}</p>
        <form id="f-q">
          <textarea class="input" name="q" maxlength="280" placeholder="Pergunte do jeito que você perguntaria ao vivo. Quanto mais específico para o seu ativo, melhor." required></textarea>
          <div class="row"><span class="counter" id="q-count">0 / 280</span><button class="btn btn-gold" type="submit">${ic('send')}Enviar dúvida</button></div>
        </form>
        <p class="privacy">${ic('shield')}<span>Sua pergunta aparece para os outros participantes com seu primeiro nome e o formato do ativo.</span></p>
      </section>
      <section class="card">
        <div class="card-h"><h3>Perguntas da comunidade</h3><div class="sort"><button class="${ui.qSort === 'votos' ? 'on' : ''}" data-act="q-sort" data-s="votos">Mais votadas</button><button class="${ui.qSort === 'recentes' ? 'on' : ''}" data-act="q-sort" data-s="recentes">Recentes</button></div></div>
        <p class="small muted" style="margin-bottom:14px">Vote nas que você também quer ver respondidas. As mais votadas entram primeiro.</p>
        <div class="q-list">${all.map(q => {
          const on = q.mine || S.qVotes.includes(q.id);
          return `<div class="q-item ${q.mine ? 'mine' : ''}"><button class="vote ${on ? 'on' : ''}" data-act="vote-q" data-id="${q.id}" ${q.mine ? 'disabled title="Sua pergunta"' : ''} aria-pressed="${on}" aria-label="Votar">${ic('up', 2.4)}${q.votes}</button>
          <div><p>${esc(q.text)}</p><div class="by">${q.mine ? '<span class="you">Você</span>' : `<span>${esc(q.by)}</span>`}<span>${esc(q.seg)}</span></div></div></div>`;
        }).join('')}</div>
      </section>
    </div>`;
  },

  votacoes: () => {
    const P = CONTENT.poll, v = S.pollVote;
    const counts = P.options.map((o, i) => o.base + (v === i ? 1 : 0));
    const total = counts.reduce((a, b) => a + b, 0);
    const sorted = [...counts].sort((a, b) => b - a);
    return `<div class="grid g-wide">
      <section class="card">
        <div class="card-h"><h3>${esc(P.title)}</h3><span class="mono">${total} votos</span></div>
        <p class="small muted" style="margin-bottom:16px">${v == null ? 'Escolha o tema que mais ajudaria o seu ativo agora. Dá para mudar o voto até a votação fechar.' : 'Voto registrado. Você pode mudar até a votação fechar.'}</p>
        <div class="poll">${P.options.map((o, i) => { const pc = Math.round(counts[i] / total * 100); return `<button class="poll-opt ${v === i ? 'on' : ''}" data-act="poll" data-i="${i}"><span class="fill" data-w="${v == null ? 0 : pc}"></span><span class="rd"></span><span><b>${esc(o.t)}</b><small>${esc(o.d)}</small></span><span class="pct">${v == null ? '' : pc + '%'}</span></button>`; }).join('')}</div>
      </section>
      <section class="card">
        <div class="card-h"><h3>Como a pauta é montada</h3></div>
        <div class="feed">
          <div class="feed-item"><span class="ic">${ic('vote')}</span><div><b>Tema</b><p>O mais votado aqui vira o tema da live seguinte${v != null && counts[v] === sorted[0] ? '. O seu está na frente.' : '.'}</p></div></div>
          <div class="feed-item"><span class="ic">${ic('ask')}</span><div><b>Perguntas</b><p>As dúvidas mais votadas entram primeiro na live. <a class="link" href="#duvidas">Votar nas perguntas</a></p></div></div>
          <div class="feed-item"><span class="ic">${ic('flask')}</span><div><b>Raio X</b><p>As linhas de receita que mais aparecem nos Raio X dos participantes também orientam os temas.</p></div></div>
        </div>
      </section>
    </div>`;
  },

  anotacoes: () => {
    const lives = [{ num: CONTENT.nextLive.num, title: CONTENT.nextLive.title, date: nextLiveStart(), next: true }].concat(CONTENT.lives.map(l => ({ ...l, date: pastDate(l.num) })));
    if (ui.noteLive == null) ui.noteLive = isLiveNow() ? CONTENT.nextLive.num : CONTENT.lives[0].num;
    const cur = lives.find(l => l.num === ui.noteLive) || lives[1];
    const notes = S.notes.filter(x => x.live === cur.num).sort((a, b) => b.at - a.at);
    return `<div class="notes">
      <div class="note-lives" aria-label="Escolha a live">${lives.map(l => { const c = S.notes.filter(x => x.live === l.num).length; return `<button class="${l.num === cur.num ? 'on' : ''}" data-act="note-live" data-live="${l.num}"><small>#${pad(l.num)} · ${l.next ? 'próxima' : fmtShort(l.date)}${c ? ` · ${c} nota${c > 1 ? 's' : ''}` : ''}</small><b>${esc(l.title)}</b></button>`; }).join('')}</div>
      <div>
        <section class="card">
          <div class="card-h"><h3>Nova anotação</h3><span class="mono">Live #${pad(cur.num)}</span></div>
          <form id="f-note">
            <textarea class="input" name="t" placeholder="O que chamou sua atenção? Uma ideia, um caso, uma frase do Isaac. Escreva do seu jeito." required></textarea>
            <div class="row" style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:12px;flex-wrap:wrap">
              <span class="small muted">${ic('spark').replace('<svg', '<svg style="width:14px;height:14px;display:inline;vertical-align:-2px;color:var(--gold-2)"')} ${aiUsed(cur.num) ? 'A leitura com IA desta live já foi usada. A anotação fica salva.' : 'Você tem 1 leitura rápida com IA por live.'}</span>
              <button class="btn btn-gold" type="submit">Salvar anotação</button>
            </div>
          </form>
        </section>
        ${notes.length ? notes.map(noteHTML).join('') : '<div class="empty" style="margin-top:12px">Nenhuma anotação desta live ainda.</div>'}
      </div>
    </div>`;
  },

  raiox: () => report(true),

  ecossistema: () => `<p class="muted" style="max-width:640px;margin-bottom:22px">O Lab é a porta de entrada do ecossistema Relevantia. Como participante, você pode testar os outros produtos sem custo.</p>
    <div class="grid g-3">${CONTENT.trials.map(t => {
      const on = S.trials[t.k];
      const left = on ? Math.max(0, t.days - Math.floor((Date.now() - on) / 864e5)) : 0;
      return `<section class="card trial ${t.featured ? 'featured' : ''} ${on ? 'active' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center"><span class="ic">${ic(t.icon)}</span>${t.featured ? '<span class="mono">Continua o seu Raio X</span>' : ''}</div>
        <h3>${t.name}</h3><p>${esc(t.desc)}</p>
        <ul>${t.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        ${on ? `<span class="status"><i></i>Teste ativo · ${left} dia${left === 1 ? '' : 's'} restante${left === 1 ? '' : 's'}</span><a class="btn btn-ghost" href="${esc(CONFIG.trialUrls[t.k])}" target="_blank" rel="noopener" data-act="open-trial" data-k="${t.k}">Abrir ${t.name} ${ic('out')}</a>`
              : `<button class="btn ${t.featured ? 'btn-gold' : 'btn-ghost'}" data-act="trial" data-k="${t.k}">Testar ${t.days} dias grátis</button>`}
      </section>`;
    }).join('')}</div>`,

  perfil: () => {
    const p = S.profile;
    const opt = (arr, v) => arr.map(a => `<option ${a === v ? 'selected' : ''}>${esc(a)}</option>`).join('');
    const tipos = Object.entries(TYPES).map(([k, v]) => `<option value="${k}" ${p.tipo === k ? 'selected' : ''}>${v.n}</option>`).join('');
    return `<div class="grid g-wide">
      <form class="card" id="f-perfil">
        <div class="card-h"><h3>Perfil do ativo</h3><span class="mono">Atualizado ${new Date(p.updatedAt || S.createdAt).toLocaleDateString('pt-BR')}</span></div>
        <div class="form-grid">
          <label class="field"><span>Nome do ativo</span><input class="input" name="ativo" value="${esc(p.ativo)}" required></label>
          <label class="field"><span>Formato</span><select class="input" name="tipo">${tipos}</select></label>
          <label class="field"><span>Perfil principal</span><input class="input" name="handle" value="${esc(p.handle)}" placeholder="@perfil ou link"></label>
          <label class="field"><span>Canal principal</span><select class="input" name="plataforma">${opt(QUESTIONS[0].o, p.plataforma)}</select></label>
          <label class="field"><span>Seu nome</span><input class="input" name="nome" value="${esc(p.nome)}" required></label>
          <label class="field"><span>E-mail</span><input class="input" name="email" type="email" value="${esc(p.email)}" required></label>
          <label class="field"><span>Sua relação com o ativo</span><select class="input" name="papel">${opt(ROLES, p.papel)}</select></label>
          <label class="field"><span>Faturamento anual</span><select class="input" name="faturamento">${opt(QUESTIONS.find(q => q.f === 'faturamento').o, p.faturamento)}</select></label>
          <label class="field full"><span>Principal objetivo</span><select class="input" name="objetivo">${opt(QUESTIONS[QUESTIONS.length - 1].o, p.objetivo)}</select></label>
          <label class="field full"><span>Detalhe do objetivo</span><textarea class="input" name="objetivoTxt" style="min-height:80px">${esc(p.objetivoTxt)}</textarea></label>
        </div>
        <div style="display:flex;justify-content:flex-end;margin-top:20px"><button class="btn btn-gold" type="submit">Salvar alterações</button></div>
      </form>
      <section class="card">
        <div class="card-h"><h3>Ações</h3></div>
        <div class="week">
          <a href="#" data-act="redo-rx">${ic('refresh').replace('<svg', '<svg class="ck" style="border:0"')}<span>Refazer o Raio X</span></a>
          <a href="#" data-act="tour">${ic('help').replace('<svg', '<svg class="ck" style="border:0"')}<span>Rever o tutorial</span></a>
          <a href="#" data-act="export">${ic('download').replace('<svg', '<svg class="ck" style="border:0"')}<span>Copiar meus dados (JSON)</span></a>
          <a href="#" data-act="reset" style="color:#E59A8A">${ic('trash').replace('<svg', '<svg class="ck" style="border:0"')}<span>Apagar dados deste navegador</span></a>
        </div>
      </section>
    </div>`;
  },
};

const aiUsed = live => S.notes.some(x => x.live === live && (x.ai || ui.aiBusy === x.id));

function noteHTML(n) {
  const d = new Date(n.at);
  const busy = ui.aiBusy === n.id;
  let ai = '';
  if (busy) ai = `<div class="paper ai"><div class="ai-h"><span class="ai-ic">${ic('spark')}</span><b>Leitura rápida</b></div><div class="typing"><i></i><i></i><i></i>Lendo a anotação…</div></div>`;
  else if (n.ai) {
    const a = n.ai;
    ai = `<div class="paper ai">
      <div class="ai-h"><span class="ai-ic">${ic('spark')}</span><b>Leitura rápida</b><span class="mono">1 por live</span></div>
      <div class="ai-sec"><p>${esc(a.leitura)}</p></div>
      <div class="ai-sec"><span class="mono">Leve para a próxima live</span><div class="ai-q"><p>“${esc(a.pergunta)}”</p><button class="btn btn-ghost btn-sm" data-act="ask-from-ai" data-id="${n.id}" ${n.asked ? 'disabled' : ''}>${n.asked ? ic('check') + 'Enviada' : ic('send') + 'Enviar como dúvida'}</button></div></div>
      <a class="locked-row on-paper" href="#ecossistema">${ic('lock')}<span>Quanto essa linha pode render para ${esc(S.profile.ativo)} e como estruturar</span><b>The Edge</b></a>
    </div>`;
  }
  const canAI = !n.ai && !busy && !aiUsed(n.live);
  const usedNote = !n.ai && !busy && !canAI;
  return `<article class="note-entry">
    <div class="h"><span class="mono" style="color:var(--t-3)">${d.toLocaleDateString('pt-BR')} · ${pad(d.getHours())}:${pad(d.getMinutes())}</span><button class="icon-btn" style="width:32px;height:32px" data-act="del-note" data-id="${n.id}" aria-label="Apagar anotação">${ic('trash')}</button></div>
    <div class="txt">${esc(n.text)}</div>
    ${canAI ? `<div class="acts"><button class="btn btn-gold btn-sm" data-act="ai" data-id="${n.id}">${ic('spark')}Gerar leitura rápida</button></div>` : ''}
    ${usedNote ? `<a class="locked-row" href="#ecossistema" style="margin-top:14px">${ic('lock')}<span>A leitura com IA desta live já foi usada. No The Edge, toda anotação ganha leitura.</span><b>Ver</b></a>` : ''}
    ${ai}
  </article>`;
}

/* ============ IA ============ */
async function analyze(note) {
  const payload = { nota: note.text, live: liveName(note.live), perfil: S.profile, raiox: S.raiox };
  if (CONFIG.aiEndpoint) {
    try {
      const r = await fetch(CONFIG.aiEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (r.ok) { const j = await r.json(); if (j && j.leitura) return j; }
    } catch (e) {}
  }
  await new Promise(r => setTimeout(r, 1700));
  return localRead(note);
}
function localRead(note) {
  const p = S.profile, T = TYPES[p.tipo] || TYPES.personalidade;
  const txt = norm(note.text + ' ' + (liveName(note.live) || ''));
  const noteOnly = norm(note.text);
  const goal = GOALS.find(g => g.l === p.objetivo);
  const hits = Object.keys(TOPICS).map(k => ({ k, n: TOPICS[k].reduce((a, w) => a + (noteOnly.includes(w) ? 2 : txt.includes(w) ? 1 : 0), 0) })).filter(h => h.n > 0);
  const order = Object.keys(TOPICS);
  // empate: assunto do objetivo primeiro, depois a ordem de TOPICS
  const rank = k => (goal && goal.t === k ? -1 : order.indexOf(k));
  hits.sort((a, b) => b.n - a.n || rank(a.k) - rank(b.k));
  const topic = hits.length ? hits[0].k : goal ? goal.t : 'patrocinio';
  const reachQ = QUESTIONS.find(q => q.k === 'reach');
  const vars = { ativo: p.ativo, tipo: T.art, alcance: reachQ.o[S.raiox.sc.reach].toLowerCase() };
  const snippet = note.text.trim().split(/(?<=[.!?])\s|\n/)[0].slice(0, 90);
  const obj = goal ? ` Vale guardar: o objetivo agora é ${goal.l.charAt(0).toLowerCase() + goal.l.slice(1)}.` : '';
  return { leitura: `Você anotou “${snippet}${snippet.length >= 90 ? '…' : ''}”. ${fill(IMPLY[topic], vars)}${obj}`, pergunta: fill(LIVE_Q[topic], vars), local: true };
}

/* ============ TUTORIAL ============ */
const TOUR = () => [
  { t: `Bem-vindo ao Lab, ${first(S.profile.nome)}`, p: `Seu perfil está completo e o Raio X de ${S.profile.ativo} já está salvo. Em um minuto eu te mostro onde fica cada coisa.` },
  { s: '[data-tour="next-live"]', t: 'Próxima live', p: 'Data, contagem regressiva e link de acesso. Adicione direto na sua agenda para não perder.' },
  { s: '[data-tour="nav-duvidas"]', t: 'Dúvidas', p: 'Mande perguntas para a próxima live e vote nas dos outros participantes. As mais votadas entram primeiro.' },
  { s: '[data-tour="nav-votacoes"]', t: 'Votações', p: 'Você escolhe o tema das próximas lives.' },
  { s: '[data-tour="nav-anotacoes"]', t: 'Anotações + IA', p: 'Anote durante ou depois da live. Em cada live, uma anotação ganha uma leitura rápida da IA para o seu ativo.' },
  { s: '[data-tour="nav-raiox"]', t: 'Seu Raio X', p: 'A prontidão comercial do ativo e a matriz com as linhas de receita do seu formato.' },
  { s: '[data-tour="nav-ecossistema"]', t: 'Ecossistema', p: 'Testes gratuitos dos outros produtos da Relevantia. É aqui que fica a matriz completa, com preço e marcas para cada linha.' },
  { s: '[data-tour="week"]', t: 'Sua semana no Lab', p: 'Quatro passos para aproveitar cada live. Um bom lugar para começar.' },
  { s: '[data-tour="help"]', t: 'Tutorial a qualquer hora', p: 'Este botão abre o tour de novo sempre que precisar.' },
];
let tourI = -1;
function startTour() {
  if (route !== 'inicio') { go('inicio'); setTimeout(startTour, 350); return; }
  tourI = 0; drawTour();
}
function endTour(silent) {
  const el = $('.tour'); if (el) el.remove();
  if (tourI >= 0 && !silent) { S.tourDone = true; save(); }
  if (!silent) tourI = -1;
}
function drawTour() {
  const steps = TOUR(), st = steps[tourI];
  let el = $('.tour');
  if (!el) { el = document.createElement('div'); el.className = 'tour'; el.innerHTML = '<div class="tour-block"></div><div class="tour-spot"></div><div class="tour-tip" role="dialog" aria-modal="true"></div>'; document.body.appendChild(el); }
  const spot = $('.tour-spot', el), tip = $('.tour-tip', el);
  const target = st.s ? $(st.s) : null;
  tip.innerHTML = `<div class="h"><span class="mono">Tutorial · ${tourI + 1}/${steps.length}</span><div class="dots">${steps.map((_, i) => `<i class="${i === tourI ? 'on' : ''}"></i>`).join('')}</div></div>
    <h3>${esc(st.t)}</h3><p>${esc(st.p)}</p>
    <div class="f"><button class="skip" data-t="skip">${tourI === steps.length - 1 ? '' : 'Pular tutorial'}</button>
    <div style="display:flex;gap:8px">${tourI > 0 ? `<button class="btn btn-ghost btn-sm" data-t="prev">Voltar</button>` : ''}<button class="btn btn-gold btn-sm" data-t="next">${tourI === steps.length - 1 ? 'Começar a usar' : tourI === 0 ? 'Mostrar' : 'Próximo'}</button></div></div>`;
  const place = () => {
    const vw = innerWidth, vh = innerHeight, tw = tip.offsetWidth, th = tip.offsetHeight, m = 14;
    if (!target) { spot.classList.add('center'); tip.style.left = (vw - tw) / 2 + 'px'; tip.style.top = (vh - th) / 2 + 'px'; return; }
    spot.classList.remove('center');
    const r = target.getBoundingClientRect(), pd = 6;
    Object.assign(spot.style, { left: r.left - pd + 'px', top: r.top - pd + 'px', width: r.width + pd * 2 + 'px', height: r.height + pd * 2 + 'px' });
    let x, y;
    if (r.right + m + tw < vw && r.width < vw / 2) { x = r.right + m + pd; y = r.top + r.height / 2 - th / 2; }
    else if (r.bottom + m + th < vh) { x = r.left + r.width / 2 - tw / 2; y = r.bottom + m + pd; }
    else { x = r.left + r.width / 2 - tw / 2; y = r.top - th - m - pd; }
    tip.style.left = Math.max(16, Math.min(x, vw - tw - 16)) + 'px';
    tip.style.top = Math.max(16, Math.min(y, vh - th - 16)) + 'px';
  };
  if (target) {
    target.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
    setTimeout(place, 380);
  }
  place();
  drawTour.place = place;
}
document.addEventListener('click', e => {
  const b = e.target.closest('.tour [data-t]'); if (!b) return;
  const a = b.dataset.t, n = TOUR().length;
  if (a === 'skip') endTour();
  else if (a === 'prev') { tourI--; drawTour(); }
  else if (tourI >= n - 1) { endTour(); toast('Tudo pronto. Bom Lab!'); }
  else { tourI++; drawTour(); }
});
addEventListener('resize', () => { if ($('.tour') && drawTour.place) drawTour.place(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && $('.tour')) endTour(); });

/* ============ PÓS-RENDER ============ */
const AFTER = {
  'raio-x': () => { save(); },
  processando: () => {
    const lis = $$('#proc-steps li');
    lis.forEach((li, i) => {
      setTimeout(() => { li.classList.add('on'); if (i) lis[i - 1].classList.replace('on', 'done'); }, i * 800 + 200);
    });
    setTimeout(() => { lis[lis.length - 1].classList.replace('on', 'done'); }, lis.length * 800 + 200);
    setTimeout(() => go('resultado'), lis.length * 800 + 650);
  },
      inicio: () => { if (!S.tourDone) setTimeout(startTour, 500); },
  votacoes: () => requestAnimationFrame(() => $$('.poll-opt .fill').forEach(f => f.style.width = f.dataset.w + '%')),
  duvidas: () => {
    const t = $('#f-q textarea'), c = $('#q-count');
    t && t.addEventListener('input', () => c.textContent = t.value.length + ' / 280');
  },
};

/* contagem regressiva */
function tick() {
  $$('[data-cd]').forEach(el => {
    let s = Math.max(0, Math.floor((+el.dataset.cd - Date.now()) / 1000));
    if (s === 0 && route === 'inicio') { render(); return; }
    const v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
    $$('[data-u]', el).forEach(b => b.textContent = pad(v[b.dataset.u]));
  });
}
setInterval(tick, 1000);

/* ============ AÇÕES ============ */
function finishRaiox() {
  const dr = S.rxDraft, sc = {};
  QUESTIONS.forEach((q, i) => {
    if (q.k) sc[q.k] = dr.a[i];
    if (q.f) S.profile[q.f] = q.o[dr.a[i]];
  });
  S.profile.objetivoTxt = (dr.other || '').trim();
  S.raiox = computeRaiox(sc);
  S.raiox.answers = dr.a;
  S.rxDraft = null;
  save();
  go('processando');
}

app.addEventListener('click', e => {
  const g = e.target.closest('[data-go]');
  if (g) { e.preventDefault(); go(g.dataset.go); return; }
  const b = e.target.closest('[data-act]'); if (!b) return;
  const act = b.dataset.act;
  const dr = S.rxDraft;
  switch (act) {
    case 'rx-pick': {
      const k = +b.dataset.k, i = dr.i, q = QUESTIONS[i];
      dr.a[i] = k; save();
      if (q.last) { render(); const t = $('#rx-other'); t && t.focus(); return; }
      $$('.opt').forEach(o => { o.classList.toggle('sel', o === b); o.setAttribute('aria-checked', o === b); });
      setTimeout(() => { dr.i = i + 1; render(); }, 280);
      break;
    }
    case 'rx-back': dr.i = Math.max(0, dr.i - 1); render(); break;
    case 'rx-next': dr.i++; render(); break;
    case 'rx-finish': {
      const t = $('#rx-other'); dr.other = t ? t.value : '';
      if (dr.a[dr.i] === QUESTIONS[dr.i].o.length - 1 && !dr.other.trim()) { t.focus(); toast('Conte em poucas palavras qual é o objetivo.'); return; }
      finishRaiox(); break;
    }
    case 'enter-lab': S.tourDone = false; save(); go('inicio'); break;
    case 'redo-rx': e.preventDefault(); S.rxDraft = { i: 0, a: Object.assign({}, S.raiox && S.raiox.answers), other: S.profile.objetivoTxt || '' }; S.raiox = null; save(); go('raio-x'); break;
    case 'tour': e.preventDefault(); startTour(); break;
    case 'live-link': if (CONFIG.live.url === '#') { e.preventDefault(); toast('O link da live entra aqui assim que for publicado.'); } break;
    case 'rec': if (CONFIG.live.channelUrl === '#') { e.preventDefault(); toast('O link da gravação entra aqui.'); } break;
    case 'mat': e.preventDefault(); toast('O material desta live entra aqui.'); break;
    case 'lives-tab': ui.livesTab = b.dataset.tab; ui.openLive = null; render(); break;
    case 'toggle-live': ui.openLive = ui.openLive === +b.dataset.live ? null : +b.dataset.live; render(); break;
    case 'note-go': e.preventDefault(); ui.noteLive = +b.dataset.live; go('anotacoes'); break;
    case 'note-live': ui.noteLive = +b.dataset.live; render(); break;
    case 'q-sort': ui.qSort = b.dataset.s; render(); break;
    case 'vote-q': {
      const id = b.dataset.id, i = S.qVotes.indexOf(id);
      i >= 0 ? S.qVotes.splice(i, 1) : S.qVotes.push(id); save(); render(); break;
    }
    case 'poll': S.pollVote = +b.dataset.i; save(); render(); toast('Voto registrado.'); break;
    case 'ai': runAI(b.dataset.id); break;
    case 'del-note': if (armed(b, 'Clique de novo na lixeira para apagar.')) { S.notes = S.notes.filter(n => n.id !== b.dataset.id); save(); render(); } break;
    case 'ask-from-ai': {
      const n = S.notes.find(x => x.id === b.dataset.id);
      S.questions.push({ id: uid(), text: n.ai.pergunta, at: Date.now(), live: CONTENT.nextLive.num });
      n.asked = true; save(); render(); toast(`Dúvida enviada para a live #${pad(CONTENT.nextLive.num)}.`); break;
    }
    case 'trial': { const t = CONTENT.trials.find(x => x.k === b.dataset.k); S.trials[t.k] = Date.now(); save(); render(); toast(`Teste do ${t.name} ativado por ${t.days} dias.`); break; }
    case 'open-trial': if (CONFIG.trialUrls[b.dataset.k] === '#') { e.preventDefault(); toast('O acesso ao produto entra aqui.'); } break;
    case 'export': {
      e.preventDefault();
      const txt = JSON.stringify(S, null, 2);
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast('Dados copiados. Cole onde quiser guardar.'), () => toast('Não deu para copiar neste navegador.'));
      break;
    }
    case 'reset': e.preventDefault(); if (armed(b, 'Clique de novo para apagar perfil, Raio X e anotações.')) { S = blank(); save(); go('boas-vindas'); } break;
  }
});

async function runAI(id) {
  const n = S.notes.find(x => x.id === id); if (!n) return;
  ui.aiBusy = id; render();
  n.ai = await analyze(n);
  ui.aiBusy = null; save();
  if (route === 'anotacoes') render();
}

app.addEventListener('change', e => {
  if (e.target.name === 'tipo' && e.target.type === 'radio') {
    const t = TYPES[e.target.value], i = $('#in-ativo');
    if (i && t) i.placeholder = t.ex;
    $$('.type').forEach(l => l.classList.toggle('on', l.contains(e.target)));
  }
});

app.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, data = Object.fromEntries(new FormData(f));
  if (f.id === 'f-cadastro' || f.id === 'f-perfil') {
    if (f.id === 'f-cadastro' && !data.tipo) { toast('Escolha o formato do ativo.'); return; }
    const bad = $$('[required]', f).find(el => !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value)));
    if (bad) { bad.focus(); toast(bad.type === 'email' ? 'Confira o e-mail.' : 'Preencha todos os campos.'); return; }
    Object.keys(data).forEach(k => data[k] = String(data[k]).trim());
    S.profile = Object.assign({}, S.profile, data, { updatedAt: Date.now() });
    save();
    if (f.id === 'f-cadastro') go(S.raiox ? 'inicio' : 'raio-x');
    else { render(); toast('Perfil atualizado.'); }
  }
  if (f.id === 'f-q') {
    const t = (data.q || '').trim(); if (t.length < 8) { toast('Escreva a pergunta com um pouco mais de detalhe.'); return; }
    S.questions.push({ id: uid(), text: t, at: Date.now(), live: CONTENT.nextLive.num });
    save(); ui.qSort = 'recentes'; render(); toast('Dúvida enviada. Agora é com os votos.');
  }
  if (f.id === 'f-note') {
    const t = (data.t || '').trim(); if (t.length < 3) return;
    const n = { id: uid(), live: ui.noteLive, text: t, at: Date.now() };
    S.notes.push(n); save();
    if (aiUsed(n.live)) { render(); toast('Anotação salva.'); } else runAI(n.id);
  }
});

/* link da próxima live no Google Agenda */
function gcalUrl() {
  const s = nextLiveStart(), e = new Date(s.getTime() + CONFIG.live.durationMin * 60000);
  const f = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const n = CONTENT.nextLive;
  const q = new URLSearchParams({ action: 'TEMPLATE', text: `Live Relevantia #${pad(n.num)} · ${n.title}`, dates: `${f(s)}/${f(e)}`, details: 'Ao vivo no YouTube. ' + (CONFIG.live.url !== '#' ? CONFIG.live.url : '') });
  return 'https://calendar.google.com/calendar/render?' + q.toString();
}

/* confirmação em dois cliques (caixas de confirmação do navegador nem sempre aparecem) */
function armed(b, msg) {
  if (b.dataset.armed === '1') return true;
  b.dataset.armed = '1'; b.classList.add('armed'); toast(msg);
  setTimeout(() => { b.dataset.armed = ''; b.classList.remove('armed'); }, 3500);
  return false;
}

render();
})();
