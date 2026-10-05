/* Relevantia Lab · porta de entrada gratuita do ecossistema
   App estático: os dados ficam no navegador (localStorage) até existir um back-end.
   Tudo que o Isaac precisa ajustar está em CONFIG e CONTENT, logo abaixo. */
(() => {
'use strict';

/* ============ CONFIGURAÇÃO ============ */
const CONFIG = {
  live: {
    weekday: 2,          // 0 = domingo … 2 = terça
    hour: 20, minute: 0,
    durationMin: 90,
    url: '#',            // link do YouTube da próxima live
    channelUrl: 'https://www.youtube.com/@isaacgaraujo',
  },
  // Endpoint da IA. Vazio = usa a leitura local (regras). Se preenchido, recebe
  // POST { nota, live, perfil, raiox } e deve devolver { leitura, pergunta }.
  aiEndpoint: '',
  // Endpoint da inscrição no The Edge. Vazio = abre o e-mail com a mensagem pronta.
  // Se preenchido, recebe POST { inscricao, perfil, raiox }.
  edgeEndpoint: '',
  contact: { email: 'hello@relevantia.com.br', whatsapp: '' },
  urls: {
    site: 'https://relevantia.com.br',
    radar: 'https://radar-relevantia.com.br/',
    radarMarca: 'https://radar-relevantia.com.br/cadastro-marca.html',
    radarDetentor: 'https://radar-relevantia.com.br/cadastro-detentor.html',
    intelligence: '#',   // link de acesso ao teste do Intelligence
  },
  intelTrialDays: 3,
  storageKey: 'lab-relevantia-v2',
};

/* ============ CONTEÚDO (dados de exemplo — trocar pelos reais) ============ */
const CONTENT = {
  nextLive: {
    num: 7,
    title: 'Patrocínio fora da Fórmula 1: como empresas médias entram no jogo',
    desc: 'Como empresas que não são gigantes negociam patrocínio, o que oferecer em troca e como medir se valeu.',
    guest: 'Convidado a confirmar',
  },
  lives: [ // gravações, da mais recente para a mais antiga
    { num: 6, title: 'Parcerias que viram receita, não só post', desc: 'Os formatos de parceria que geram venda e como estruturar a primeira.', dur: '1h22' },
    { num: 5, title: 'O que as marcas líderes mudaram este ano', desc: 'Movimentos de marcas no Brasil e lá fora, e o que muda para empresas médias.', dur: '1h15' },
    { num: 4, title: 'IA no marketing: o que já dá resultado', desc: 'Casos práticos de uso de IA que reduziram custo ou aumentaram conversão.', dur: '1h31' },
    { num: 3, title: 'Novos negócios dentro de negócios que já existem', desc: 'Como empresas criaram novas linhas de receita a partir do que já tinham.', dur: '1h08' },
    { num: 2, title: 'Posicionamento quando o anúncio ficou caro', desc: 'Por que diferenciação virou questão de custo, não de estética.', dur: '1h19' },
    { num: 1, title: 'O manual que ninguém escreveu', desc: 'A abertura das lives: o que mudou no mercado e por que tudo ao mesmo tempo.', dur: '1h04' },
  ],
  poll: {
    title: 'Tema da live #08',
    options: [
      { t: 'Como negociar o primeiro patrocínio', d: 'Do contato à assinatura do contrato', base: 42 },
      { t: 'Collabs entre marcas de setores diferentes', d: 'Quando juntar públicos vale mais que mídia', base: 31 },
      { t: 'Creators como canal de venda', d: 'Sair do alcance e ir para conversão', base: 57 },
      { t: 'IA para reduzir custo de aquisição', d: 'Onde aplicar primeiro e como medir', base: 64 },
      { t: 'Licenciamento de marcas fortes', d: 'Usar marcas conhecidas no seu produto', base: 23 },
    ],
  },
  seedQuestions: [
    { id: 's1', text: 'Qual o tamanho mínimo de empresa para patrocinar algo relevante?', by: 'Mariana', seg: 'Varejo', votes: 38 },
    { id: 's2', text: 'Como medir retorno de patrocínio além de alcance e impressões?', by: 'Rafael', seg: 'Educação', votes: 29 },
    { id: 's3', text: 'Vale mais patrocinar um evento local ou um creator do nicho?', by: 'Juliana', seg: 'Alimentação', votes: 21 },
    { id: 's4', text: 'Como apresentar uma proposta de parceria para uma marca muito maior que a minha?', by: 'Diego', seg: 'SaaS B2B', votes: 17 },
  ],
};

/* ============ SOLUÇÕES RELEVANTIA ============ */
// Mesma copy do site (relevantia.com.br). O Lab é gratuito; cada solução tem uma porta de entrada:
// Intelligence → teste de 3 dias · Radar → cadastro gratuito · The Edge → inscrição.
const PRODUCTS = [
  { k: 'intelligence', name: 'Relevantia Intelligence', short: 'Intelligence', icon: 'intel', layer: 'Tecnologia · Estratégia',
    offer: `${CONFIG.intelTrialDays} dias grátis`,
    title: 'O Raio X da sua empresa em seis dimensões',
    desc: 'A plataforma de estratégia da Relevantia. Lê o negócio em Core, Brand, Audience, Business, Partnerships e Beyond e aponta a alavanca prioritária.',
    items: ['A leitura completa do seu Raio X, com nota por dimensão', 'Chat do Intelligence: identifica o assunto e sugere o próximo passo', 'Biblioteca de frameworks para cada dimensão'] },
  { k: 'radar', name: 'Radar', short: 'Radar', icon: 'radar', layer: 'Operação',
    offer: 'Cadastro gratuito',
    title: 'O sistema operacional dos patrocínios e parcerias',
    desc: 'Descoberta, proposta, contrato, entregas e resultado num só lugar, com o encaixe entre marca e ativo calculado em vez de lista fria.',
    items: ['Catálogo curado, com dados reais de audiência', 'Propostas e contrapropostas com histórico', 'Entregas e contrapartidas num só painel'] },
  { k: 'edge', name: 'The Edge', short: 'The Edge', icon: 'edge', layer: 'Consultoria',
    offer: 'Inscrição',
    title: 'Estratégia ao lado de quem decide',
    desc: 'A consultoria da Relevantia para fundadores, C-level e boards. Gente experiente trabalhando dentro das decisões de marca, portfólio, receita e parcerias.',
    items: ['Mentoria executiva com a liderança', 'Conselho ampliado com uma rede curada', 'Sprints estratégicos: do diagnóstico à recomendação'] },
];
const RADAR_ROLES = [
  { k: 'marca', l: 'Sou marca', d: 'Quem investe: encontre ativos com encaixe para a sua marca.', url: () => CONFIG.urls.radarMarca },
  { k: 'detentor', l: 'Sou detentor', d: 'Quem capta: atleta, evento, criador, artista ou mídia.', url: () => CONFIG.urls.radarDetentor },
  { k: 'agencia', l: 'Sou agência', d: 'Quem gere: carteira de patrocínios de vários clientes.', url: () => CONFIG.urls.radar },
];
const EDGE_FORMATS = ['Mentoria executiva', 'Conselho ampliado', 'Sprint estratégico', 'Ainda não sei'];
const prod = k => PRODUCTS.find(p => p.k === k);

// Agentes e plug and play: quem está no Lab testa sem custo.
// Seleção curta da planilha "Frameworks The Edge", só com o que já dá para entregar hoje
// (conversa e documento, sem integração). type: 'agent' ou 'plug' (plug and play).
// url: acesso liberado no teste ('#' = o acesso chega por e-mail). days: duração do teste.
const TOOLS = [
  { k: 'prospeccao', type: 'agent', name: 'Agente de Prospecção', icon: 'target', days: 3, url: '#', dim: 'partnerships',
    desc: 'Encontra e prepara a abordagem das marcas com maior chance de fechar parceria.',
    how: 'Pesquisa segmento, patrocínios recentes e o momento de cada marca, e cruza com o perfil e os ativos da sua empresa.',
    out: 'Lista priorizada de marcas com ângulo de abordagem e mensagem sugerida.' },
  { k: 'proposta', type: 'agent', name: 'Agente de Proposta', icon: 'file', days: 3, url: '#', dim: 'business',
    desc: 'Gera propostas comerciais personalizadas para cada cliente ou marca.',
    how: 'Cruza o perfil e os ativos da sua empresa com o segmento e o momento de quem vai receber a proposta.',
    out: 'Proposta estruturada com contexto, solução, entregas, investimento e próximos passos.' },
  { k: 'inventario', type: 'plug', name: 'Inventário de Ativos', icon: 'grid', days: 3, url: '#', dim: 'brand',
    desc: 'Levantamento de tudo que a marca tem e pode oferecer a parceiros e patrocinadores.',
    how: 'Formulário por categoria: espaços físicos, canais digitais, formatos de conteúdo, dados de audiência, eventos, acessos e propriedade intelectual.',
    out: 'Inventário organizado e precificável, pronto para montar cotas e propostas.' },
];
const TOOL_TYPE = { agent: 'Agente', plug: 'Plug and play' };
const tool = k => TOOLS.find(t => t.k === k);

/* ============ RAIO X ============ */
// Versão gratuita: a leitura mostra o momento da empresa, um sinal de atenção e a dimensão
// que pede atenção. As notas por dimensão e a alavanca ficam no Intelligence.
// As 6 dimensões são as mesmas do Intelligence (cores só como acento, nunca em texto).
const DIMS = {
  core: { n: 'Core', d: 'Essência e governança' },
  brand: { n: 'Brand', d: 'Posicionamento e marca' },
  audience: { n: 'Audience', d: 'Público e comunidade' },
  business: { n: 'Business', d: 'Modelo de negócio e receita' },
  partnerships: { n: 'Partnerships', d: 'Parcerias e patrocínio' },
  beyond: { n: 'Beyond', d: 'Novas apostas e futuro' },
};
const MOMENTS = [
  { n: 'Em ajuste', p: 'O marketing está trabalhando mais do que devolve. Antes de investir mais, a empresa precisa entender onde o esforço está se perdendo.' },
  { n: 'Em travessia', p: 'Existe base, mas o que trouxe a empresa até aqui está rendendo menos. É o momento em que fazer diferente pesa mais do que fazer mais.' },
  { n: 'Em tração', p: 'A empresa cresce e tem ativos que muita gente não tem. O risco agora é seguir crescendo pelo caminho mais caro.' },
  { n: 'Pronta para escalar', p: 'A base está sólida. A pergunta deixa de ser se dá para crescer e passa a ser por qual caminho crescer mais rápido.' },
];
const momentOf = pct => pct < 35 ? 0 : pct < 60 ? 1 : pct < 80 ? 2 : 3;
const NO_SIGNAL = 'Nenhum sinal crítico apareceu nas respostas. A leitura rápida não mostra onde está a próxima alavanca de crescimento.';

const CHALLENGES = [
  { v: 'demanda', l: 'Gerar demanda de forma previsível', t: 'publico' },
  { v: 'diferenciar', l: 'Diferenciar a marca da concorrência', t: 'marca' },
  { v: 'margem', l: 'Custo de aquisição alto e margem apertando', t: 'resultado' },
  { v: 'crescer', l: 'Encontrar novos caminhos de crescimento', t: 'parcerias' },
  { v: 'time', l: 'Time e execução', t: 'essencia' },
];
// p = campo do perfil; d = dimensão do Intelligence; s = sinal mostrado quando a resposta é uma das duas primeiras
const QUESTIONS = [
  { p: 'faturamento', q: 'Para calibrar a leitura: qual a faixa de faturamento anual da empresa?', hint: 'Usamos só para comparar com empresas do mesmo porte.',
    o: ['Até R$ 1 milhão', 'R$ 1 a 5 milhões', 'R$ 5 a 30 milhões', 'R$ 30 a 100 milhões', 'Acima de R$ 100 milhões'] },
  { p: 'time', q: 'E quantas pessoas trabalham na empresa hoje?', o: ['1 a 10', '11 a 50', '51 a 200', 'Mais de 200'] },
  { d: 'core', q: 'Se um cliente tivesse que explicar o que a sua empresa faz em uma frase, ele conseguiria?',
    o: ['Não, cada um explica de um jeito', 'Mais ou menos, depende de quem fala', 'Sim, a maioria acerta', 'Sim, e usando as nossas palavras'],
    s: 'Cada pessoa explica a empresa de um jeito. Isso encarece tudo que vem depois, da venda à parceria.' },
  { d: 'brand', q: 'Por que alguém escolhe vocês e não o concorrente?',
    o: ['Principalmente preço', 'Indicação e relacionamento', 'Qualidade reconhecida', 'Algo que só a gente tem'],
    s: 'O cliente escolhe vocês por preço ou relacionamento. Sem uma diferença clara, cada venda custa mais.' },
  { d: 'business', q: 'Como está a relação entre investimento em marketing e resultado?',
    o: ['Investimos mais e o resultado não acompanha', 'Estável, sem crescer', 'Cresce, mas a margem aperta', 'Cresce com margem saudável'],
    s: 'Mais investimento não está virando mais resultado. É o sintoma mais comum do mercado agora, e raramente se resolve gastando mais.' },
  { d: 'audience', q: 'Onde está a sua audiência hoje?',
    o: ['Depende de anúncio pago', 'Nas redes, com alcance baixo', 'Em base própria ativa (lista, WhatsApp, CRM)', 'Numa comunidade que fala com a gente'],
    s: 'A empresa ainda depende de anúncio para falar com quem compra. Cada venda começa do zero.' },
  { d: 'partnerships', q: 'A empresa já fez alguma parceria ou patrocínio que trouxe resultado?',
    o: ['Nunca fizemos', 'Fizemos, sem resultado claro', 'Algumas deram certo', 'É parte da estratégia'],
    s: 'Parcerias ainda não fazem parte da estratégia. Costuma ser um dos caminhos mais subaproveitados para crescer gastando menos.' },
  { d: 'beyond', q: 'No último ano, a empresa testou alguma frente nova de receita ou produto?',
    o: ['Não, focamos no que já existe', 'Pensamos, mas não testamos', 'Testamos algo pontual', 'Temos um jeito de testar com frequência'],
    s: 'A empresa não está testando frentes novas. Quando o caminho atual desacelera, falta uma alternativa pronta.' },
  { p: 'desafio', q: 'Por último: qual é o maior desafio da empresa hoje?', hint: 'A IA usa isso para ler as suas anotações.',
    o: CHALLENGES.map(c => c.l).concat('Outro'), last: true },
];
const SEGMENTS = ['Varejo', 'Indústria', 'Serviços B2B', 'Tecnologia / SaaS', 'Educação', 'Saúde', 'Alimentação e bebidas', 'Moda e beleza', 'Agência / consultoria', 'Outro'];
const ROLES = ['Dono(a) / sócio(a)', 'CEO / diretor(a)', 'Gestor(a) de marketing', 'Analista de marketing', 'Comercial / vendas', 'Outro'];

/* IA local: assunto da anotação → leitura rápida + pergunta para a live */
const TOPICS = {
  essencia: ['proposito', 'cultura', 'missao', 'valores', 'essencia', 'identidade', 'lideranca', 'visao', 'time'],
  marca: ['marca', 'posicionamento', 'branding', 'percepcao', 'diferenc', 'reputacao', 'narrativa', 'historia', 'storytelling', 'premium'],
  publico: ['publico', 'audiencia', 'cliente', 'comunidade', 'seguidor', 'conteudo', 'creator', 'influenc', 'rede', 'engajamento', 'dados', 'lista'],
  resultado: ['venda', 'receita', 'margem', 'preco', 'faturamento', 'cac', 'ltv', 'funil', 'conversao', 'lucro', 'custo', 'roi', 'anuncio', 'midia paga', 'verba'],
  parcerias: ['parceria', 'parceiro', 'patrocin', 'alianca', 'collab', 'co-branding', 'licenciamento', 'propriedade', 'evento', 'esporte', 'clube'],
  inovacao: ['tecnologia', ' ia ', 'inteligencia artificial', 'inovacao', 'novo negocio', 'novos negocios', 'produto novo', 'automacao', 'app', 'plataforma', 'teste'],
};
const IMPLY = {
  essencia: 'Antes de aplicar qualquer tática nova, vale checar se ela combina com o que a {empresa} é.',
  marca: 'Isso é sobre como a {empresa} é percebida: o ganho vem de ser lembrada por um motivo específico.',
  publico: 'Isso mexe com a relação da {empresa} com quem compra dela. Quanto mais público próprio, menos dependência de anúncio.',
  resultado: 'Isso toca direto no resultado. Para a {empresa}, a pergunta é se isso aumenta receita ou reduz o custo de conseguir receita.',
  parcerias: 'Aqui o caminho é crescer com o ativo de outra marca, entrando em públicos novos sem pagar o preço cheio de mídia.',
  inovacao: 'É sobre fazer diferente, não só fazer melhor. Um teste pequeno e bem medido vale mais do que um plano grande.',
};
const LIVE_Q = {
  essencia: 'Como manter a identidade da empresa enquanto testa caminhos novos, numa empresa de {segmento} com {time} pessoas?',
  marca: 'Qual o primeiro passo para uma empresa de {segmento} construir um posicionamento que não dependa de preço?',
  publico: 'Como uma empresa de {segmento} constrói público próprio sem depender de mídia paga?',
  resultado: 'Como saber se vale tirar verba de mídia para esse caminho, numa empresa de {segmento} faturando {faturamento}?',
  parcerias: 'O que uma empresa de {segmento} com {time} pessoas pode oferecer numa primeira parceria com uma marca maior?',
  inovacao: 'Por onde começar a testar isso numa empresa de {segmento} com {time} pessoas, sem parar a operação?',
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
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  dots: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
};
const ic = (n, sw = 1.8) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;
// Logo oficial (mesmo arquivo do Intelligence: assets/logos/mark-1.png)
const logo = () => `<span class="logo"><img src="assets/logos/mark-1.png" alt="" width="32" height="32"><span><strong>Relevantia</strong><small>Lab</small></span></span>`;

/* ============ ESTADO ============ */
// trials: { intelligence: início, <ferramenta>: início } · radar: { role, at } · edge: inscrição no The Edge
const blank = () => ({ profile: null, raiox: null, rxDraft: null, notes: [], questions: [], qVotes: [], pollVote: null, trials: {}, radar: null, edge: null, tourDone: false, createdAt: Date.now() });
let S = load();
function load() {
  try { const s = JSON.parse(localStorage.getItem(CONFIG.storageKey)); if (s && typeof s === 'object') return Object.assign(blank(), s); } catch (e) {}
  // V1 (lab-relevantia-v1e): aproveita perfil, anotações e votos. O Raio X é refeito, porque agora
  // ele lê as 6 dimensões do Intelligence; os testes de 7 dias da V1 não valem mais.
  try {
    const o = JSON.parse(localStorage.getItem('lab-relevantia-v1e'));
    if (o && o.profile) return Object.assign(blank(), { profile: o.profile, notes: o.notes || [], questions: o.questions || [], qVotes: o.qVotes || [], pollVote: o.pollVote ?? null, createdAt: o.createdAt || Date.now() });
  } catch (e) {}
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
function computeRaiox(a) {
  const diag = QUESTIONS.map((q, i) => q.s ? i : -1).filter(i => i >= 0);
  const pct = Math.round(diag.reduce((t, i) => t + a[i], 0) / (diag.length * 3) * 100);
  const low = diag.slice().sort((x, y) => a[x] - a[y])[0];
  // dimensão que pede atenção: a de menor resposta (fica visível); as notas ficam no Intelligence
  const dims = {}; diag.forEach(i => { dims[QUESTIONS[i].d] = a[i]; });
  return { pct, moment: momentOf(pct), signal: a[low] <= 1 ? low : null, dims, weak: QUESTIONS[low].d, at: Date.now(), code: 'RX-' + Math.floor(1000 + Math.random() * 9000) };
}

/* ============ SOLUÇÕES: estado de cada porta de entrada ============ */
const DAY = 864e5;
const daysLeft = (start, days) => Math.max(0, Math.ceil((start + days * DAY - Date.now()) / DAY));
// status: 'open' (ainda não usou) · 'active' (teste rodando / cadastro feito / inscrição enviada) · 'ended' (teste acabou)
function trialStatus(k, days) {
  const on = S.trials[k];
  if (!on) return { st: 'open' };
  const left = daysLeft(on, days);
  return left > 0 ? { st: 'active', left } : { st: 'ended', left: 0 };
}
function productStatus(k) {
  if (k === 'intelligence') return trialStatus('intelligence', CONFIG.intelTrialDays);
  if (k === 'radar') return S.radar ? { st: 'active' } : { st: 'open' };
  if (k === 'edge') return S.edge ? { st: 'active' } : { st: 'open' };
}
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

// Próximo passo recomendado, a partir do Raio X e do perfil.
// Quem decide numa empresa de R$ 5 milhões ou mais → The Edge; parcerias como ponto fraco → Radar;
// o resto → Intelligence, que continua o Raio X. Passos já dados saem da fila.
function recommend() {
  const p = S.profile || {}, R = S.raiox;
  const leader = ['Dono(a) / sócio(a)', 'CEO / diretor(a)'].includes(p.cargo);
  const big = QUESTIONS[0].o.indexOf(p.faturamento) >= 2;
  const order = leader && big ? ['edge', 'intelligence', 'radar']
    : R && R.weak === 'partnerships' ? ['radar', 'intelligence', 'edge']
    : ['intelligence', 'radar', 'edge'];
  const k = order.find(x => productStatus(x).st === 'open') || order[0];
  const why = {
    intelligence: R ? `O Raio X apontou ${DIMS[R.weak].n} como a dimensão que pede atenção. No Intelligence você vê a nota de cada uma das seis e a alavanca prioritária.` : 'A leitura completa da empresa em seis dimensões.',
    radar: 'Parcerias apareceram como o caminho menos explorado da empresa. No Radar você encontra ativos com encaixe para a sua marca e negocia num único fluxo.',
    edge: `Para uma empresa do porte da ${p.empresa || 'sua'}, a estratégia rende mais com o time The Edge ao lado de quem decide.`,
  }[k];
  return { k, why };
}

/* ============ ROTEADOR ============ */
const LAB_VIEWS = {
  inicio: { t: 'Início', i: 'home', sec: 'Relevantia' },
  solucoes: { t: 'Soluções', i: 'grid', sec: 'Relevantia' },
  ferramentas: { t: 'Agentes e plug and play', short: 'Agentes', i: 'bolt', sec: 'Relevantia' },
  lives: { t: 'Lives', i: 'play', sec: 'Audiência S/A' },
  duvidas: { t: 'Dúvidas', i: 'ask', sec: 'Audiência S/A' },
  votacoes: { t: 'Votações', i: 'vote', sec: 'Audiência S/A' },
  anotacoes: { t: 'Anotações + IA', short: 'Anotações', i: 'notes', sec: 'Audiência S/A' },
  raiox: { t: 'Raio X', i: 'flask', sec: 'Sua empresa' },
  perfil: { t: 'Perfil', i: 'user', sec: 'Sua empresa' },
  // fora do menu: aparece destacando o item "parent"
  'the-edge': { t: 'Inscrição no The Edge', i: 'edge', parent: 'solucoes', hidden: true },
};
const ALIASES = { ecossistema: 'solucoes' };
// No celular, a barra inferior mostra estas; o resto fica em "Mais".
const TABBAR = ['inicio', 'solucoes', 'ferramentas', 'lives'];
const app = $('#app');
let route = '';
const ui = { livesTab: 'gravacoes', openLive: null, noteLive: null, qSort: 'votos', aiBusy: null, radarPick: false };

function go(r) { if (location.hash === '#' + r) render(); else location.hash = '#' + r; }
function resolve() {
  let r = location.hash.replace(/^#\/?/, '') || '';
  r = ALIASES[r] || r;
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
  document.body.classList.remove('no-scroll');
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
  const st = lbl.map((l, i) => `<li class="st ${i < step ? 'done' : i === step ? 'on' : ''}"><span class="n">${i < step ? '✓' : i + 1}</span><span class="lbl">${l}</span></li>`).join('');
  return `<header class="ob-top">${logo()}${step >= 0 ? `<ol class="steps" aria-label="Etapa ${Math.min(step, 2) + 1} de 3">${st}</ol>` : '<span></span>'}<span class="ob-plan">${ic('shield')}Gratuito</span></header>`;
}
const ONB = {
  'boas-vindas': () => `
  <div class="ob">${obTop(-1)}
    <main class="ob-body"><div class="welcome">
      <div>
        <span class="eyebrow"><span class="dot"></span>Relevantia Lab · gratuito</span>
        <h1>A porta de entrada para o ecossistema Relevantia.</h1>
        <p class="lead">Um Raio X da sua empresa nas seis dimensões do Intelligence, a live semanal Audiência S/A com o Isaac Araújo e acesso às soluções da Relevantia para testar no seu negócio.</p>
        <div class="cta">
          <button class="btn btn-gold btn-lg" data-go="cadastro">Criar meu acesso grátis ${ic('arrow', 2)}</button>
          <span class="meta">${ic('shield')}<span>Sem custo · cerca de 3 minutos</span></span>
        </div>
        <ul class="welcome-offers" aria-label="O que o Lab libera">
          <li><b>Intelligence</b><span>${CONFIG.intelTrialDays} dias grátis</span></li>
          <li><b>Radar</b><span>Cadastro gratuito</span></li>
          <li><b>The Edge</b><span>Inscrição</span></li>
          <li><b>Agentes e plug and play</b><span>Teste grátis</span></li>
        </ul>
        <p class="welcome-alt">É atleta, criador, artista, evento ou mídia? <a class="link" href="detentores/">Entre pelo Lab para detentores ${ic('arrow')}</a></p>
      </div>
      <div class="protocol" aria-label="Como funciona a entrada">
        <div class="protocol-h"><span class="mono">Protocolo de entrada</span><span class="mono" style="color:var(--t-3)">4 etapas</span></div>
        <ol>
          <li><span class="n">01</span><div><b>Cadastro básico</b><small>Quem é você e qual é a empresa.</small></div><span class="tm">30s</span></li>
          <li><span class="n">02</span><div><b>Raio X da empresa</b><small>${QUESTIONS.length} perguntas rápidas, uma por vez.</small></div><span class="tm">2min</span></li>
          <li><span class="n">03</span><div><b>O momento da empresa</b><small>A fase, um sinal de atenção e a dimensão que pede cuidado.</small></div><span class="tm">na hora</span></li>
          <li><span class="n">04</span><div><b>Entrada no Lab</b><small>Lives, soluções e o próximo passo recomendado para você.</small></div><span class="tm">✓</span></li>
        </ol>
      </div>
    </div></main>
  </div>`,

  cadastro: () => {
    const p = S.profile || {};
    const opt = (arr, v) => '<option value="" disabled ' + (v ? '' : 'selected') + '>Selecione</option>' + arr.map(a => `<option ${a === v ? 'selected' : ''}>${esc(a)}</option>`).join('');
    return `
  <div class="ob">${obTop(0)}
    <main class="ob-body"><form class="ob-card" id="f-cadastro" novalidate>
      <span class="mono">Etapa 01 · Cadastro</span>
      <h2>Primeiro, quem está entrando no Lab?</h2>
      <p class="sub">O básico para personalizar a leitura e indicar as soluções certas para a sua empresa.</p>
      <div class="form-grid">
        <label class="field"><span>Seu nome</span><input class="input" name="nome" required autocomplete="name" placeholder="Nome e sobrenome" value="${esc(p.nome)}"></label>
        <label class="field"><span>E-mail</span><input class="input" name="email" type="email" required autocomplete="email" placeholder="voce@empresa.com" value="${esc(p.email)}"></label>
        <label class="field full"><span>Empresa</span><input class="input" name="empresa" required autocomplete="organization" placeholder="Nome da empresa" value="${esc(p.empresa)}"></label>
        <label class="field"><span>Segmento</span><select class="input" name="segmento" required>${opt(SEGMENTS, p.segmento)}</select></label>
        <label class="field"><span>Seu cargo</span><select class="input" name="cargo" required>${opt(ROLES, p.cargo)}</select></label>
      </div>
      <div class="ob-actions">
        <button type="button" class="btn btn-ghost" data-go="boas-vindas">${ic('back')}Voltar</button>
        <button type="submit" class="btn btn-gold">Ir para o Raio X ${ic('arrow', 2)}</button>
      </div>
      <p class="privacy">${ic('shield')}<span>Seus dados ficam com a Relevantia e são usados só para personalizar o Lab e as soluções.</span></p>
    </form></main>
  </div>`;
  },

  'raio-x': () => {
    const dr = S.rxDraft || (S.rxDraft = { i: 0, a: {}, other: '' });
    const i = Math.min(dr.i, QUESTIONS.length - 1);
    const q = QUESTIONS[i];
    const sel = dr.a[i];
    const pct = (i / QUESTIONS.length) * 100;
    const tag = q.p ? `<span class="chip-tag">Perfil</span><span class="mono" style="color:var(--t-3)">Calibragem</span>` : `<span class="chip-tag">Raio X</span><span class="mono" style="color:var(--t-3)">Diagnóstico</span>`;
    const keys = 'ABCDEF';
    const isOther = q.last && sel === q.o.length - 1;
    return `
  <div class="ob">${obTop(1)}
    <main class="ob-body"><div class="rx">
      <div class="rx-meter"><span class="mono">Raio X</span><div class="track"><div class="fill" style="width:${pct}%"></div></div><span class="count">${pad(i + 1)} / ${QUESTIONS.length}</span></div>
      <div class="rx-q" key="${i}">
        <div class="rx-tag">${tag}</div>
        <h2>${esc(q.q)}</h2>
        ${q.hint ? `<p class="hint">${esc(q.hint)}</p>` : '<div style="height:16px"></div>'}
        <div class="opts" role="radiogroup">
          ${q.o.map((o, k) => `<button type="button" class="opt ${sel === k ? 'sel' : ''}" role="radio" aria-checked="${sel === k}" data-act="rx-pick" data-k="${k}"><span class="k">${keys[k]}</span><span>${esc(o)}</span></button>`).join('')}
        </div>
        ${q.last ? `<label class="field rx-other" ${sel == null ? 'hidden' : ''}><span>${isOther ? 'Qual é o desafio?' : 'Quer detalhar? (opcional)'}</span><textarea class="input" id="rx-other" rows="2" style="min-height:80px" placeholder="Ex.: vendemos bem no Sul, mas não conseguimos entrar em São Paulo">${esc(dr.other)}</textarea></label>` : ''}
      </div>
      <div class="rx-nav">
        ${i > 0 ? `<button class="btn btn-ghost btn-sm" data-act="rx-back">${ic('back')}Anterior</button>` : `<button class="btn btn-ghost btn-sm" data-go="cadastro">${ic('back')}Cadastro</button>`}
        ${q.last ? `<button class="btn btn-gold" data-act="rx-finish" ${sel == null ? 'disabled' : ''}>Ver a leitura da empresa ${ic('arrow', 2)}</button>` : (sel != null ? `<button class="btn btn-ghost btn-sm" data-act="rx-next">Próxima ${ic('arrow')}</button>` : '<span class="mono" style="color:var(--t-3)">Escolha uma opção</span>')}
      </div>
    </div></main>
  </div>`;
  },

  processando: () => `
  <div class="ob">${obTop(2)}
    <main class="ob-body"><div class="proc">
      <div class="flask"><svg viewBox="0 0 64 64" fill="none">
        <defs><linearGradient id="lg-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C8A84B"/><stop offset="1" stop-color="#B8860B"/></linearGradient><clipPath id="fl"><path d="M25 6h14v18l15 26a5 5 0 0 1-4.3 7.5H14.3A5 5 0 0 1 10 50l15-26z"/></clipPath></defs>
        <g clip-path="url(#fl)"><rect class="liq" x="0" y="34" width="64" height="30" fill="url(#lg-gold)"/></g>
        <circle class="bub" cx="28" cy="46" r="2" fill="#F2E7C9"/><circle class="bub" cx="36" cy="50" r="1.6" fill="#F2E7C9"/><circle class="bub" cx="32" cy="42" r="1.3" fill="#F2E7C9"/>
        <path d="M25 6h14v18l15 26a5 5 0 0 1-4.3 7.5H14.3A5 5 0 0 1 10 50l15-26z" stroke="#C8A84B" stroke-width="2" stroke-linejoin="round"/><path d="M22 6h20" stroke="#C8A84B" stroke-width="2" stroke-linecap="round"/>
      </svg></div>
      <h2>Analisando a ${esc(S.profile.empresa)}</h2>
      <ul id="proc-steps">
        <li><i></i>Calibrando pelo porte e segmento</li>
        <li><i></i>Lendo as seis dimensões</li>
        <li><i></i>Cruzando com o seu maior desafio</li>
        <li><i></i>Escolhendo o próximo passo</li>
      </ul>
    </div></main>
  </div>`,

  resultado: () => `<div class="ob">${obTop(3)}<main class="ob-body">${report(false)}</main></div>`,
};

// Botão do Intelligence conforme o estado do teste (usado no laudo, no início e em Soluções)
function intelCta(cls = 'btn-gold', label) {
  const t = productStatus('intelligence');
  if (t.st === 'active') return `<a class="btn ${cls}" href="${esc(CONFIG.urls.intelligence)}" target="_blank" rel="noopener" data-act="open-intel">Abrir o Intelligence ${ic('out', 2)}</a>`;
  if (t.st === 'ended') return `<a class="btn ${cls}" href="#the-edge" >Continuar com o time The Edge ${ic('arrow', 2)}</a>`;
  return `<button class="btn ${cls}" data-act="intel-trial">${label || `Testar ${CONFIG.intelTrialDays} dias grátis`} ${ic('arrow', 2)}</button>`;
}

function vault(compact) {
  const R = S.raiox, t = productStatus('intelligence');
  const note = t.st === 'active' ? `Seu teste está ativo: ${plural(t.left, 'dia')} restante${t.left === 1 ? '' : 's'}.`
    : t.st === 'ended' ? 'Seu teste do Intelligence terminou. O time The Edge pode seguir com você.'
    : `${CONFIG.intelTrialDays} dias grátis para quem está no Lab.`;
  return `<div class="vault dark ${compact ? 'compact' : ''}">
    <div class="vault-h"><span class="mono">As seis dimensões</span><span class="vault-lock">${ic('lock')}No Intelligence</span></div>
    <ul class="dims-lock">${Object.entries(DIMS).map(([k, d]) => `<li class="${k === R.weak ? 'weak' : ''}"><i class="dot" style="background:var(--dim-${k})"></i><div><b>${d.n}</b><small>${d.d}</small></div>${k === R.weak ? '<span class="tag">Pede atenção</span>' : `<i class="blur" style="width:${34 + (k.length * 7) % 30}px"></i>`}</li>`).join('')}</ul>
    <p class="vault-txt">A nota de cada dimensão, a alavanca prioritária e o que fazer primeiro ficam no Relevantia Intelligence.</p>
    ${intelCta('btn-gold btn-block', 'Ver as seis dimensões')}
    <p class="vault-note">${note}</p>
  </div>`;
}

function report(inLab) {
  const R = S.raiox, p = S.profile, M = MOMENTS[R.moment];
  const d = new Date(R.at);
  const signal = R.signal != null ? QUESTIONS[R.signal].s : NO_SIGNAL;
  return `
  <article class="paper report">
    <div class="report-h">
      <div><span class="mono">Laudo · Raio X da empresa</span><h2>A leitura da ${esc(p.empresa)}</h2><p>${esc(p.segmento)} · ${esc(p.faturamento || '')} · ${esc(p.time || '')} pessoas</p></div>
      <div class="stamp"><span>AMOSTRA <b>${R.code}</b></span><span>DATA <b>${d.toLocaleDateString('pt-BR')}</b></span><span>TIPO <b>Leitura gratuita</b></span></div>
    </div>
    <div class="report-body">
      <div>
        <span class="mono">Momento da empresa</span>
        <h3 class="moment">${M.n}</h3>
        <div class="stages" role="img" aria-label="Momento ${R.moment + 1} de ${MOMENTS.length}: ${M.n}">${MOMENTS.map((m, i) => `<div class="stage ${i < R.moment ? 'past' : i === R.moment ? 'on' : ''}"><i></i><small>${m.n}</small></div>`).join('')}</div>
        <p class="moment-p">${M.p}</p>
        <div class="callout prio"><span class="mono">Um sinal que apareceu nas respostas</span><p>${signal}</p></div>
        <div class="callout"><span class="mono">Dimensão que pede atenção</span><b>${DIMS[R.weak].n} · ${DIMS[R.weak].d}</b></div>
      </div>
      ${vault(false)}
    </div>
    <div class="report-foot">
      <p>Esta é a leitura gratuita, feita a partir de ${QUESTIONS.length} respostas. A leitura completa fica no <b>Relevantia Intelligence</b>; quando a empresa precisa de alguém ao lado na decisão, entra o <b>The Edge</b>.</p>
      <div class="acts">${inLab
        ? `<button class="btn btn-outline" data-act="redo-rx">${ic('refresh')}Refazer Raio X</button>`
        : `<button class="btn btn-gold btn-lg" data-act="enter-lab">Entrar no Lab ${ic('arrow', 2)}</button>`}</div>
    </div>
  </article>`;
}

/* ============ SHELL DO LAB ============ */
function shell(r, body) {
  const p = S.profile;
  let sec = '';
  const cur = LAB_VIEWS[r].parent || r;
  const nav = Object.entries(LAB_VIEWS).filter(([, v]) => !v.hidden).map(([k, v]) => {
    let h = '';
    if (v.sec !== sec) { sec = v.sec; h += `<div class="nav-sec">${sec}</div>`; }
    const open = PRODUCTS.filter(x => productStatus(x.k).st === 'open').length;
    const badge = k === 'solucoes' && open ? `<span class="badge">${open}</span>` : k === 'duvidas' && !myQuestions().length ? '<span class="badge">1</span>' : k === 'votacoes' && S.pollVote == null ? '<span class="badge">1</span>' : '';
    return h + `<a href="#${k}" class="nav-item ${k === cur ? 'on' : ''}" data-tour="nav-${k}">${ic(v.i)}<span>${v.t}</span>${badge}</a>`;
  }).join('');
  // celular: barra inferior + folha "Mais"
  const badgeOf = k => k === 'solucoes' ? PRODUCTS.filter(x => productStatus(x.k).st === 'open').length : 0;
  const tabs = TABBAR.map(k => { const v = LAB_VIEWS[k], b = badgeOf(k);
    return `<a href="#${k}" class="tab ${k === cur ? 'on' : ''}" data-tour="nav-${k}">${ic(v.i)}<span>${v.short || v.t}</span>${b ? `<i class="dot-badge">${b}</i>` : ''}</a>`; }).join('');
  const moreKeys = Object.keys(LAB_VIEWS).filter(k => !LAB_VIEWS[k].hidden && !TABBAR.includes(k));
  const moreOn = moreKeys.includes(cur);
  const pend = k => k === 'duvidas' ? !myQuestions().length : k === 'votacoes' ? S.pollVote == null : false;
  const moreItems = moreKeys.map(k => `<a href="#${k}" class="${k === cur ? 'on' : ''}" data-tour="nav-${k}">${ic(LAB_VIEWS[k].i)}<span>${LAB_VIEWS[k].t}</span>${pend(k) ? '<i class="dot-badge">1</i>' : ''}</a>`).join('');
  const sub = { inicio: `Olá, ${esc(first(p.nome))}`, solucoes: 'Ecossistema Relevantia', ferramentas: 'Teste grátis', lives: 'Audiência S/A · agenda e gravações', duvidas: `Para a live #${pad(CONTENT.nextLive.num)}`, votacoes: 'Você decide a pauta', anotacoes: 'Sua leitura de cada live', raiox: 'O momento da sua empresa', perfil: 'Seus dados', 'the-edge': 'Soluções · consultoria' }[r];
  const crumb = LAB_VIEWS[r].parent ? `<a href="#${LAB_VIEWS[r].parent}">${LAB_VIEWS[LAB_VIEWS[r].parent].t}</a><span class="sep">/</span>` : '';
  return `<div class="glow"></div><div class="grid-bg"></div>
  <div class="shell">
    <aside class="side">
      <a href="#inicio" class="side-logo">${logo()}</a>
      <nav class="nav" aria-label="Lab">${nav}</nav>
      <span class="side-plan">${ic('shield')}<span>Plano gratuito</span></span>
      <a href="#perfil" class="side-foot"><span class="avatar">${esc(initials(p.nome))}</span><span class="who"><b>${esc(p.nome)}</b><small>${esc(p.empresa)}</small></span></a>
    </aside>
    <main class="main">
      <div class="topbar">
        <a href="#inicio" class="top-logo" aria-label="Relevantia Lab, início"><img src="assets/logos/mark-1.png" alt="" width="26" height="26"></a>
        <nav class="breadcrumb" aria-label="Você está em"><span class="home">Relevantia Lab</span><span class="sep home">/</span>${crumb}<span class="curr">${LAB_VIEWS[r].t}</span></nav>
        <div class="top-acts"><span class="plan-badge"><i></i>Plano gratuito</span><button class="icon-btn" data-act="tour" data-tour="help" aria-label="Ver o tutorial" title="Tutorial">${ic('help')}</button></div>
      </div>
      <div class="top"><span class="mono">${sub}</span><h1>${LAB_VIEWS[r].t}</h1></div>
      <div class="view">${body}</div>
    </main>
    <nav class="tabbar" aria-label="Lab">${tabs}<button type="button" class="tab ${moreOn ? 'on' : ''}" data-act="more" aria-expanded="false" aria-controls="more-sheet">${ic('dots', 2.4)}<span>Mais</span>${moreKeys.some(pend) ? '<i class="dot-badge"></i>' : ''}</button></nav>
    <div class="more" id="more-sheet" hidden>
      <div class="more-bg" data-act="more-close"></div>
      <div class="more-panel" role="dialog" aria-modal="true" aria-label="Mais opções">
        <div class="more-h"><a href="#perfil" class="who-mini"><span class="avatar">${esc(initials(p.nome))}</span><span><b>${esc(p.nome)}</b><small>${esc(p.empresa)} · Plano gratuito</small></span></a><button type="button" class="icon-btn" data-act="more-close" aria-label="Fechar">${ic('chev')}</button></div>
        <div class="more-list">${moreItems}<a href="#" data-act="tour">${ic('help')}<span>Ver o tutorial</span></a></div>
      </div>
    </div>
  </div>`;
}

/* ============ VIEWS DO LAB ============ */
const myQuestions = () => S.questions.filter(q => q.live === CONTENT.nextLive.num);

function nextLiveCard() {
  const n = CONTENT.nextLive, d = nextLiveStart(), live = isLiveNow();
  return `<section class="card next-live dark" data-tour="next-live">
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

/* cards de solução */
function productCta(x, block) {
  const st = productStatus(x.k).st, bl = block ? ' btn-block' : '';
  if (x.k === 'intelligence') return intelCta('btn-gold' + bl);
  if (x.k === 'radar') return st === 'active'
    ? `<a class="btn btn-gold${bl}" href="${esc(CONFIG.urls.radar)}" target="_blank" rel="noopener">Acessar o Radar ${ic('out', 2)}</a>`
    : `<a class="btn btn-gold${bl}" href="#solucoes" data-act="radar-pick">Criar conta grátis ${ic('arrow', 2)}</a>`;
  return st === 'active'
    ? `<a class="btn btn-ghost${bl}" href="#the-edge">Ver inscrição</a>`
    : `<a class="btn btn-gold${bl}" href="#the-edge">Quero me inscrever ${ic('arrow', 2)}</a>`;
}
function statusLine(x) {
  const t = productStatus(x.k);
  if (x.k === 'intelligence') return t.st === 'active' ? `Teste ativo · ${plural(t.left, 'dia')} restante${t.left === 1 ? '' : 's'}` : t.st === 'ended' ? 'Teste encerrado' : '';
  if (x.k === 'radar') return t.st === 'active' ? `Cadastro iniciado · ${esc((RADAR_ROLES.find(r => r.k === S.radar.role) || {}).l || '').replace('Sou ', '')}` : '';
  return t.st === 'active' ? 'Inscrição enviada · retorno em até 48h úteis' : '';
}
function productCard(x, featured) {
  const line = statusLine(x), st = productStatus(x.k).st;
  const pick = x.k === 'radar' && ui.radarPick && st === 'open';
  return `<section class="card prod-card ${featured ? 'featured' : ''} ${st}" id="p-${x.k}">
    <div class="pc-top"><span class="ic">${ic(x.icon)}</span><span class="offer">${esc(x.offer)}</span></div>
    <span class="mono">${featured ? 'Recomendado para você' : esc(x.layer)}</span>
    <h3>${esc(x.name)}</h3>
    <p class="pc-title">${esc(x.title)}</p>
    <p>${esc(x.desc)}</p>
    <ul class="checks">${x.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
    ${line ? `<span class="status ${st}"><i></i>${line}</span>` : ''}
    ${pick ? `<div class="roles-pick" role="group" aria-label="Como você entra no Radar">${RADAR_ROLES.map(r => `<a href="${esc(r.url())}" target="_blank" rel="noopener" data-act="radar-signup" data-role="${r.k}"><b>${r.l}</b><small>${r.d}</small>${ic('out')}</a>`).join('')}</div>` : productCta(x, true)}
  </section>`;
}
function solRow(x) {
  const line = statusLine(x), st = productStatus(x.k).st;
  const to = x.k === 'edge' ? '#the-edge' : '#solucoes';
  return `<a class="sol-row ${st}" href="${to}" ${x.k === 'intelligence' && st === 'open' ? 'data-act="intel-trial"' : ''}><span class="ic">${ic(x.icon)}</span><span class="t"><b>${esc(x.short)}</b><small>${line || esc(x.offer)}</small></span>${st === 'active' ? `<span class="ck on">${ic('check', 3)}</span>` : ic('chev').replace('<svg', '<svg class="go"')}</a>`;
}
function toolCard(t) {
  const s = trialStatus(t.k, t.days);
  return `<section class="card prod-card ${s.st}" style="--dm-cor:var(--dim-${t.dim})">
    <div class="pc-top"><span class="ic">${ic(t.icon)}</span><span class="offer">${TOOL_TYPE[t.type]}</span></div>
    <span class="mono">${DIMS[t.dim].n} · ${esc(DIMS[t.dim].d)}</span>
    <h3>${esc(t.name)}</h3>
    <p>${esc(t.desc)}</p>
    <dl class="how"><dt>Como funciona</dt><dd>${esc(t.how)}</dd><dt>Entrega</dt><dd>${esc(t.out)}</dd></dl>
    ${s.st === 'active' ? `<span class="status active"><i></i>Teste ativo · ${plural(s.left, 'dia')} restante${s.left === 1 ? '' : 's'}</span><a class="btn btn-ghost btn-block" href="${esc(t.url)}" target="_blank" rel="noopener" data-act="open-tool" data-k="${t.k}">Abrir ${esc(t.name)} ${ic('out')}</a>`
      : s.st === 'ended' ? `<span class="status ended"><i></i>Teste encerrado</span><a class="btn btn-ghost btn-block" href="#the-edge">Continuar com o The Edge</a>`
      : `<button class="btn btn-gold btn-block" data-act="tool-trial" data-k="${t.k}">Testar ${plural(t.days, 'dia')} grátis</button>`}
  </section>`;
}

const VIEWS = {
  inicio: () => {
    const R = S.raiox, tasks = weekTasks(), done = tasks.filter(t => t.done).length;
    const d = nextLiveStart(), prev = new Date(d); prev.setDate(prev.getDate() - 1);
    const rec = recommend(), rp = prod(rec.k);
    const it = productStatus('intelligence');
    const avisos = [
      { i: 'play', t: `Live #${pad(CONTENT.nextLive.num)} ${fmtDay(d).split(',')[0]}, às ${fmtHour(d)}`, p: 'O link de acesso fica no card da próxima live e chega por e-mail uma hora antes.', m: 'Audiência S/A', n: true },
      it.st === 'active'
        ? { i: 'intel', t: `Seu teste do Intelligence termina em ${plural(it.left, 'dia')}`, p: 'Aproveite para ver a nota das seis dimensões e a alavanca prioritária.', m: 'Intelligence', n: true }
        : { i: 'intel', t: `Intelligence liberado por ${CONFIG.intelTrialDays} dias para quem está no Lab`, p: 'A leitura completa do seu Raio X, nas seis dimensões.', m: 'Soluções' },
      { i: 'bolt', t: 'Agentes e plug and play para testar grátis', p: TOOLS.map(t => t.name).join(' · '), m: 'Soluções' },
      { i: 'ask', t: `Dúvidas para a live #${pad(CONTENT.nextLive.num)} até ${fmtDay(prev).split(',')[0]}`, p: 'As mais votadas entram primeiro na pauta.', m: 'Prazo' },
      { i: 'file', t: `Gravação da live #${pad(CONTENT.lives[0].num)} disponível`, p: CONTENT.lives[0].title, m: 'Lives' },
    ];
    return `<div class="grid g-home">
      <div class="grid" style="align-content:start">
        <section class="card next-step dark" data-tour="next-step">
          <div class="card-h"><span class="mono">Próximo passo para a ${esc(S.profile.empresa)}</span><span class="offer">${esc(rp.offer)}</span></div>
          <div class="ns-body"><span class="ic">${ic(rp.icon)}</span><div><h2>${esc(rp.name)}</h2><p>${esc(rec.why)}</p></div></div>
          <div class="nl-acts">${productCta(rp)}<a class="btn btn-ghost" href="#solucoes">Ver todas as soluções</a></div>
        </section>
        ${nextLiveCard()}
        <section class="card" data-tour="week">
          <div class="card-h"><h3>Sua semana no Lab</h3><span class="mono">${done}/${tasks.length} feitos</span></div>
          <div class="progress-line"><i style="width:${done / tasks.length * 100}%"></i></div>
          <div class="week">${tasks.map(t => `<a href="#${t.to}" class="${t.done ? 'done' : ''}" ${t.live ? `data-act="note-go" data-live="${t.live}"` : ''}><span class="ck">${ic('check', 3)}</span><span>${esc(t.t)}</span>${ic('chev').replace('<svg', '<svg class="go"')}</a>`).join('')}</div>
        </section>
      </div>
      <div class="grid" style="align-content:start">
        <section class="card" data-tour="my-solutions">
          <div class="card-h"><h3>Suas soluções</h3><a class="link small" href="#solucoes">Ver ${ic('arrow')}</a></div>
          <div class="sol-list">${PRODUCTS.map(x => solRow(x)).join('')}</div>
        </section>
        <section class="card">
          <div class="card-h"><h3>Raio X da ${esc(S.profile.empresa)}</h3><a class="link small" href="#raiox">Ver laudo ${ic('arrow')}</a></div>
          <span class="mono">Momento</span>
          <div class="moment-mini">${MOMENTS[R.moment].n}</div>
          <div class="stages mini-stages">${MOMENTS.map((m, i) => `<div class="stage ${i < R.moment ? 'past' : i === R.moment ? 'on' : ''}"><i></i></div>`).join('')}</div>
          <p class="small muted">Dimensão que pede atenção: <b>${DIMS[R.weak].n}</b>. ${R.signal != null ? QUESTIONS[R.signal].s : NO_SIGNAL}</p>
          <a class="locked-row" href="#solucoes" data-act="${it.st === 'open' ? 'intel-trial' : ''}">${ic('lock')}<span>Nota das seis dimensões, alavanca e prioridades</span><b>Intelligence</b></a>
        </section>
        <section class="card">
          <div class="card-h"><h3>Avisos</h3></div>
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
      .concat(myQuestions().map(q => ({ id: q.id, text: q.text, by: first(p.nome), seg: p.segmento, votes: 1, mine: true, at: q.at })));
    all.sort(ui.qSort === 'votos' ? (a, b) => b.votes - a.votes : (a, b) => (b.at || 0) - (a.at || 0));
    return `<div class="grid g-split">
      <section class="card q-form">
        <div class="card-h"><h3>Envie sua dúvida</h3><span class="mono">Live #${pad(n.num)}</span></div>
        <p class="small muted" style="margin-bottom:14px">${esc(n.title)}</p>
        <form id="f-q">
          <textarea class="input" name="q" maxlength="280" placeholder="Pergunte do jeito que você perguntaria ao vivo. Quanto mais específico para a sua empresa, melhor." required></textarea>
          <div class="row"><span class="counter" id="q-count">0 / 280</span><button class="btn btn-gold" type="submit">${ic('send')}Enviar dúvida</button></div>
        </form>
        <p class="privacy">${ic('shield')}<span>Sua pergunta aparece para os outros participantes com seu primeiro nome e segmento.</span></p>
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
        <p class="small muted" style="margin-bottom:16px">${v == null ? 'Escolha o tema que mais ajudaria a sua empresa agora. Dá para mudar o voto até a votação fechar.' : 'Voto registrado. Você pode mudar até a votação fechar.'}</p>
        <div class="poll">${P.options.map((o, i) => { const pc = Math.round(counts[i] / total * 100); return `<button class="poll-opt ${v === i ? 'on' : ''}" data-act="poll" data-i="${i}"><span class="fill" data-w="${v == null ? 0 : pc}"></span><span class="rd"></span><span><b>${esc(o.t)}</b><small>${esc(o.d)}</small></span><span class="pct">${v == null ? '' : pc + '%'}</span></button>`; }).join('')}</div>
      </section>
      <section class="card">
        <div class="card-h"><h3>Como a pauta é montada</h3></div>
        <div class="feed">
          <div class="feed-item"><span class="ic">${ic('vote')}</span><div><b>Tema</b><p>O mais votado aqui vira o tema da live seguinte${v != null && counts[v] === sorted[0] ? '. O seu está na frente.' : '.'}</p></div></div>
          <div class="feed-item"><span class="ic">${ic('ask')}</span><div><b>Perguntas</b><p>As dúvidas mais votadas entram primeiro na live. <a class="link" href="#duvidas">Votar nas perguntas</a></p></div></div>
          <div class="feed-item"><span class="ic">${ic('flask')}</span><div><b>Raio X</b><p>Os resultados do Raio X dos participantes também orientam os temas.</p></div></div>
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

  solucoes: () => {
    const rec = recommend();
    return `<div class="sol-intro">
      <p class="lead">O Lab é gratuito e é a porta de entrada da Relevantia. Daqui você testa o Intelligence, cria sua conta no Radar e se inscreve no The Edge. O próximo passo recomendado para a ${esc(S.profile.empresa)} vem primeiro.</p>
    </div>
    <ol class="flow" aria-label="Como as soluções se conectam">
      <li><span class="mono">01 · Formação</span><b>Lab + Audiência S/A</b><small>Gratuito</small></li>
      <li><span class="mono">02 · Leitura</span><b>Intelligence</b><small>${CONFIG.intelTrialDays} dias grátis</small></li>
      <li><span class="mono">03 · Estratégia</span><b>The Edge</b><small>Inscrição</small></li>
      <li><span class="mono">04 · Operação</span><b>Radar</b><small>Cadastro gratuito</small></li>
    </ol>
    <div class="grid g-3 products">${PRODUCTS.slice().sort((x, y) => (y.k === rec.k) - (x.k === rec.k)).map(x => productCard(x, x.k === rec.k)).join('')}</div>
    <a class="tools-banner" href="#ferramentas">${ic('bolt')}<div><b>Agentes e plug and play</b><span>${TOOLS.map(t => t.name).join(' · ')}. Teste grátis por ${plural(TOOLS[0].days, 'dia')}.</span></div>${ic('chev')}</a>`;
  },

  ferramentas: () => `<p class="lead" style="margin-bottom:24px">Ferramentas prontas da metodologia The Edge. Os agentes conversam com você e entregam um documento; o plug and play é um formato pronto para usar, sem implantação.</p>
    <div class="grid g-3">${TOOLS.map(toolCard).join('')}</div>
    <p class="small muted" style="margin-top:22px">Outros agentes e plug and play chegam com o Intelligence e com o The Edge. <a class="link" href="#solucoes">Ver as soluções ${ic('arrow')}</a></p>`,

  'the-edge': () => {
    const p = S.profile, E = S.edge;
    if (E) return `<section class="card edge-done">
      <span class="ic">${ic('check', 2.4)}</span>
      <span class="mono">Inscrição recebida · ${new Date(E.at).toLocaleDateString('pt-BR')}</span>
      <h2>O time The Edge fala com você em até 48h úteis.</h2>
      <p class="muted">Formato de interesse: <b>${esc(E.formato)}</b>. A conversa começa pelo brief com a liderança e usa o Raio X da ${esc(p.empresa)} como ponto de partida.</p>
      <div class="nl-acts">${E.mailto ? `<a class="btn btn-ghost" href="${esc(E.mailto)}">${ic('send')}Abrir o e-mail de novo</a>` : ''}<a class="btn btn-ghost" href="#solucoes">Voltar para as soluções</a></div>
    </section>`;
    const leader = ['Dono(a) / sócio(a)', 'CEO / diretor(a)'].includes(p.cargo);
    return `<div class="grid g-wide">
      <form class="card" id="f-edge" novalidate>
        <div class="card-h"><h3>Inscrição no The Edge</h3><span class="mono">Leva 1 minuto</span></div>
        <p class="small muted" style="margin-bottom:18px">Seu perfil e o Raio X da ${esc(p.empresa)} já vão junto. Só falta contar o que você quer resolver.</p>
        <div class="form-grid">
          <label class="field full"><span>Formato de interesse</span><select class="input" name="formato" required>${EDGE_FORMATS.map(f => `<option>${esc(f)}</option>`).join('')}</select></label>
          <label class="field full"><span>O que você quer resolver agora?</span><textarea class="input" name="objetivo" required placeholder="Ex.: decidir onde investir em marca no próximo semestre">${esc(p.desafioTxt || p.desafio || '')}</textarea></label>
          <label class="field"><span>WhatsApp (opcional)</span><input class="input" name="whatsapp" type="tel" autocomplete="tel" placeholder="(11) 90000-0000"></label>
          <label class="field"><span>Quem decide</span><select class="input" name="decisor">${['Eu decido', 'Decido junto com sócios', 'Levo para quem decide'].map((o, i) => `<option ${(leader ? i === 0 : i === 2) ? 'selected' : ''}>${o}</option>`).join('')}</select></label>
          <label class="check full"><input type="checkbox" name="consent" required><span>Concordo em ser contatado pelo time Relevantia.</span></label>
        </div>
        <div class="f-actions">
          <a class="btn btn-ghost" href="#solucoes">${ic('back')}Voltar</a>
          <button class="btn btn-gold" type="submit">Enviar inscrição ${ic('arrow', 2)}</button>
        </div>
      </form>
      <section class="card">
        <div class="card-h"><h3>Como funciona</h3></div>
        <div class="feed">
          <div class="feed-item"><span class="ic">01</span><div><b>Brief</b><p>Conversa com a liderança sobre o negócio, as unidades, os canais e o momento da empresa.</p></div></div>
          <div class="feed-item"><span class="ic">02</span><div><b>Raio X</b><p>Leitura nas seis dimensões do Intelligence, com a alavanca prioritária.</p></div></div>
          <div class="feed-item"><span class="ic">03</span><div><b>Plano contínuo</b><p>Prioridades, donos e prazos acompanhados de perto pelo time The Edge.</p></div></div>
          <div class="feed-item"><span class="ic">04</span><div><b>Execução</b><p>Quando o caminho passa por patrocínios e parcerias, a operação segue no Radar.</p></div></div>
        </div>
      </section>
    </div>`;
  },

  perfil: () => {
    const p = S.profile;
    const opt = (arr, v) => arr.map(a => `<option ${a === v ? 'selected' : ''}>${esc(a)}</option>`).join('');
    const ch = CHALLENGES.map(c => c.l).concat('Outro');
    return `<div class="grid g-wide">
      <form class="card" id="f-perfil">
        <div class="card-h"><h3>Perfil da empresa</h3><span class="mono">Atualizado ${new Date(p.updatedAt || S.createdAt).toLocaleDateString('pt-BR')}</span></div>
        <div class="form-grid">
          <label class="field"><span>Seu nome</span><input class="input" name="nome" value="${esc(p.nome)}" required></label>
          <label class="field"><span>E-mail</span><input class="input" name="email" type="email" value="${esc(p.email)}" required></label>
          <label class="field"><span>Empresa</span><input class="input" name="empresa" value="${esc(p.empresa)}" required></label>
          <label class="field"><span>Segmento</span><select class="input" name="segmento">${opt(SEGMENTS, p.segmento)}</select></label>
          <label class="field"><span>Cargo</span><select class="input" name="cargo">${opt(ROLES, p.cargo)}</select></label>
          <label class="field"><span>Faturamento anual</span><select class="input" name="faturamento">${opt(QUESTIONS[0].o, p.faturamento)}</select></label>
          <label class="field"><span>Tamanho do time</span><select class="input" name="time">${opt(QUESTIONS[1].o, p.time)}</select></label>
          <label class="field"><span>Maior desafio hoje</span><select class="input" name="desafio">${opt(ch, p.desafio)}</select></label>
          <label class="field full"><span>Detalhe do desafio</span><textarea class="input" name="desafioTxt" style="min-height:80px">${esc(p.desafioTxt)}</textarea></label>
        </div>
        <div class="f-actions end"><button class="btn btn-gold" type="submit">Salvar alterações</button></div>
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
      <a class="locked-row on-paper" href="#solucoes">${ic('lock')}<span>Próximo passo para a ${esc(S.profile.empresa)} e ligação com as seis dimensões</span><b>Intelligence</b></a>
    </div>`;
  }
  const canAI = !n.ai && !busy && !aiUsed(n.live);
  const usedNote = !n.ai && !busy && !canAI;
  return `<article class="note-entry">
    <div class="h"><span class="mono" style="color:var(--t-3)">${d.toLocaleDateString('pt-BR')} · ${pad(d.getHours())}:${pad(d.getMinutes())}</span><button class="icon-btn" style="width:32px;height:32px" data-act="del-note" data-id="${n.id}" aria-label="Apagar anotação">${ic('trash')}</button></div>
    <div class="txt">${esc(n.text)}</div>
    ${canAI ? `<div class="acts"><button class="btn btn-gold btn-sm" data-act="ai" data-id="${n.id}">${ic('spark')}Gerar leitura rápida</button></div>` : ''}
    ${usedNote ? `<a class="locked-row" href="#solucoes" style="margin-top:14px">${ic('lock')}<span>A leitura com IA desta live já foi usada. No chat do Intelligence, toda anotação ganha leitura.</span><b>Intelligence</b></a>` : ''}
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
  const p = S.profile;
  const txt = norm(note.text + ' ' + (liveName(note.live) || ''));
  const noteOnly = norm(note.text);
  const hits = Object.keys(TOPICS).map(k => ({ k, n: TOPICS[k].reduce((a, w) => a + (noteOnly.includes(w) ? 2 : txt.includes(w) ? 1 : 0), 0) })).filter(h => h.n > 0);
  const ch = CHALLENGES.find(c => c.l === p.desafio);
  // empate: assunto do desafio primeiro, depois os mais específicos
  const rank = k => (ch && ch.t === k ? -1 : ['parcerias', 'inovacao', 'resultado', 'publico', 'marca', 'essencia'].indexOf(k));
  hits.sort((a, b) => b.n - a.n || rank(a.k) - rank(b.k));
  const topic = hits.length ? hits[0].k : ch ? ch.t : 'resultado';
  const vars = { empresa: p.empresa, segmento: (p.segmento || 'seu segmento').toLowerCase(), time: (p.time || '').replace('Mais de ', '+'), faturamento: (p.faturamento || '').replace('Até', 'até').replace('Acima de', 'acima de') };
  const snippet = note.text.trim().split(/(?<=[.!?])\s|\n/)[0].slice(0, 90);
  const desafio = ch ? ` Vale guardar: o maior desafio da empresa hoje é ${ch.l.charAt(0).toLowerCase() + ch.l.slice(1)}.` : '';
  return { leitura: `Você anotou “${snippet}${snippet.length >= 90 ? '…' : ''}”. ${fill(IMPLY[topic], vars)}${desafio}`, pergunta: fill(LIVE_Q[topic], vars), local: true };
}

/* ============ TUTORIAL ============ */
// primeiro elemento visível com o seletor (o mesmo data-tour existe na sidebar e na barra do celular)
const visible = sel => $$(sel).find(el => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0; }) || null;
const TOUR = () => TOUR_ALL().filter(st => !st.s || visible(st.s));
const TOUR_ALL = () => [
  { t: `Bem-vindo ao Lab, ${first(S.profile.nome)}`, p: `O Lab é gratuito e é a sua porta de entrada para a Relevantia. O Raio X da ${S.profile.empresa} já está salvo. Em um minuto eu te mostro onde fica cada coisa.` },
  { s: '[data-tour="next-step"]', t: 'Seu próximo passo', p: 'A solução que mais combina com o momento da empresa, escolhida a partir do Raio X.' },
  { s: '[data-tour="nav-solucoes"]', t: 'Soluções', p: `Intelligence com ${CONFIG.intelTrialDays} dias grátis, cadastro gratuito no Radar e inscrição no The Edge.` },
  { s: '[data-tour="nav-ferramentas"]', t: 'Agentes e plug and play', p: 'Ferramentas prontas da metodologia The Edge para testar sem custo.' },
  { s: '[data-tour="next-live"]', t: 'Audiência S/A', p: 'A live semanal do Isaac, com data, contagem regressiva e link de acesso. Adicione na agenda para não perder.' },
  { s: '[data-tour="nav-duvidas"]', t: 'Dúvidas', p: 'Mande perguntas para a próxima live e vote nas dos outros participantes. As mais votadas entram primeiro.' },
  { s: '[data-tour="nav-votacoes"]', t: 'Votações', p: 'Você escolhe o tema das próximas lives.' },
  { s: '[data-tour="nav-anotacoes"]', t: 'Anotações + IA', p: 'Anote durante ou depois da live. Em cada live, uma anotação ganha uma leitura rápida da IA para a sua empresa.' },
  { s: '[data-tour="nav-raiox"]', t: 'Seu Raio X', p: 'O momento da empresa, um sinal de atenção e a dimensão que pede cuidado. As notas das seis dimensões ficam no Intelligence.' },
  // só no celular (a barra inferior não aparece no computador, então o passo é pulado)
  { s: '[data-act="more"]', t: 'Mais', p: 'Dúvidas, votações, anotações, o Raio X e o seu perfil ficam aqui.' },
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
  if (!el) { el = document.createElement('div'); el.className = 'tour dark'; el.innerHTML = '<div class="tour-block"></div><div class="tour-spot"></div><div class="tour-tip" role="dialog" aria-modal="true"></div>'; document.body.appendChild(el); }
  const spot = $('.tour-spot', el), tip = $('.tour-tip', el);
  const target = st.s ? visible(st.s) : null;
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

/* folha "Mais" (celular) */
function toggleMore(force) {
  const m = $('#more-sheet'), b = $('[data-act="more"]'); if (!m) return;
  const open = force ?? m.hidden;
  m.hidden = !open; b && b.setAttribute('aria-expanded', open);
  document.body.classList.toggle('no-scroll', open);
}
addEventListener('keydown', e => { if (e.key === 'Escape') toggleMore(false); });

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
  const dr = S.rxDraft, a = {};
  QUESTIONS.forEach((q, i) => { if (q.s) a[i] = dr.a[i]; });
  const o = QUESTIONS;
  S.profile.faturamento = o[0].o[dr.a[0]];
  S.profile.time = o[1].o[dr.a[1]];
  const last = o.length - 1;
  S.profile.desafio = o[last].o[dr.a[last]];
  S.profile.desafioTxt = (dr.other || '').trim();
  S.raiox = computeRaiox(a);
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
      if (dr.a[dr.i] === QUESTIONS[dr.i].o.length - 1 && !dr.other.trim()) { t.focus(); toast('Conte em poucas palavras qual é o desafio.'); return; }
      finishRaiox(); break;
    }
    case 'enter-lab': S.tourDone = false; save(); go('inicio'); break;
    case 'redo-rx': e.preventDefault(); S.rxDraft = { i: 0, a: Object.assign({}, S.raiox && S.raiox.answers), other: S.profile.desafioTxt || '' }; S.raiox = null; save(); go('raio-x'); break;
    case 'tour': e.preventDefault(); toggleMore(false); startTour(); break;
    case 'more': toggleMore(); break;
    case 'more-close': e.preventDefault(); toggleMore(false); break;
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
    case 'intel-trial': {
      e.preventDefault();
      if (!S.trials.intelligence) { S.trials.intelligence = Date.now(); save(); }
      if (route === 'resultado') render(); else go('solucoes');
      toast(`Intelligence liberado por ${CONFIG.intelTrialDays} dias.` + (CONFIG.urls.intelligence === '#' ? ' O acesso chega no seu e-mail.' : ''));
      break;
    }
    case 'open-intel': if (CONFIG.urls.intelligence === '#') { e.preventDefault(); toast(`O acesso ao Intelligence chega em ${S.profile.email}.`); } break;
    case 'radar-pick': e.preventDefault(); ui.radarPick = true; if (route === 'solucoes') render(); else go('solucoes'); setTimeout(() => { const c = $('#p-radar'); c && c.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 60); break;
    case 'radar-signup': { const r = RADAR_ROLES.find(x => x.k === b.dataset.role); S.radar = { role: r.k, at: Date.now() }; ui.radarPick = false; save(); setTimeout(render, 50); toast('Cadastro do Radar aberto em outra aba.'); break; }
    case 'tool-trial': { const t = tool(b.dataset.k); S.trials[t.k] = Date.now(); save(); render(); toast(`${t.name} liberado por ${plural(t.days, 'dia')}.` + (t.url === '#' ? ' O acesso chega no seu e-mail.' : '')); break; }
    case 'open-tool': if (tool(b.dataset.k).url === '#') { e.preventDefault(); toast(`O acesso chega em ${S.profile.email}.`); } break;
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

app.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, data = Object.fromEntries(new FormData(f));
  if (f.id === 'f-cadastro' || f.id === 'f-perfil') {
    const bad = $$('[required]', f).find(el => !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value)));
    if (bad) { bad.focus(); toast(bad.type === 'email' ? 'Confira o e-mail.' : 'Preencha todos os campos.'); return; }
    Object.keys(data).forEach(k => data[k] = String(data[k]).trim());
    S.profile = Object.assign({}, S.profile, data, { updatedAt: Date.now() });
    save();
    if (f.id === 'f-cadastro') go(S.raiox ? 'inicio' : 'raio-x');
    else { render(); toast('Perfil atualizado.'); }
  }
  if (f.id === 'f-edge') {
    const bad = $$('[required]', f).find(el => el.type === 'checkbox' ? !el.checked : !el.value.trim());
    if (bad) { bad.focus(); toast(bad.type === 'checkbox' ? 'Marque a autorização de contato.' : 'Conte o que você quer resolver.'); return; }
    const p = S.profile, R = S.raiox;
    const E = { at: Date.now(), formato: data.formato, objetivo: String(data.objetivo).trim(), whatsapp: String(data.whatsapp || '').trim(), decisor: data.decisor };
    const text = [`Inscrição no The Edge pelo Relevantia Lab`, '', `Nome: ${p.nome}`, `E-mail: ${p.email}`, E.whatsapp ? `WhatsApp: ${E.whatsapp}` : null, `Empresa: ${p.empresa} · ${p.segmento}`, `Cargo: ${p.cargo} (${E.decisor})`, `Faturamento: ${p.faturamento || '-'} · Time: ${p.time || '-'}`, `Formato de interesse: ${E.formato}`, '', `O que quer resolver: ${E.objetivo}`, '', R ? `Raio X: ${MOMENTS[R.moment].n} · dimensão que pede atenção: ${DIMS[R.weak].n}` : null].filter(x => x != null).join('\n');
    if (CONFIG.edgeEndpoint) {
      fetch(CONFIG.edgeEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ inscricao: E, perfil: p, raiox: R }) }).catch(() => {});
    } else {
      E.mailto = CONFIG.contact.whatsapp
        ? `https://wa.me/${CONFIG.contact.whatsapp}?text=${encodeURIComponent(text)}`
        : `mailto:${CONFIG.contact.email}?subject=${encodeURIComponent('Inscrição no The Edge · ' + p.empresa)}&body=${encodeURIComponent(text)}`;
      if (CONFIG.contact.whatsapp) window.open(E.mailto, '_blank', 'noopener'); else location.href = E.mailto;
    }
    S.edge = E; save(); render();
    toast(CONFIG.edgeEndpoint ? 'Inscrição enviada.' : 'Mensagem pronta. Confirme o envio na janela que abrimos.');
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
