/* ===== CONFIG
   INSCRICAO_URL: link de inscrição/pagamento da Primeira Formação.
   Enquanto estiver vazio, o botão final só leva até a seção de investimento. ===== */
const INSCRICAO_URL = '';

(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // botões de vaga levam ao botão de inscrição no fim da página
  const signup = document.getElementById('inscricao'), btn = document.getElementById('inscricao-btn');
  if (INSCRICAO_URL) btn.href = INSCRICAO_URL;
  else { btn.removeAttribute('target'); btn.href = '#investimento'; }
  document.querySelectorAll('.js-cta').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    signup.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    signup.classList.remove('focus'); void signup.offsetWidth; signup.classList.add('focus');
    setTimeout(() => btn.focus({ preventScroll: true }), reduce ? 0 : 700);
  }));

  document.getElementById('yr').textContent = new Date().getFullYear();

  // entrada do hero
  requestAnimationFrame(() => setTimeout(() => document.body.classList.add('loaded'), 60));

  // reveal ao rolar
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll?.('.count').forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  function countUp(el) {
    const to = +el.dataset.to;
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1600;
    const step = t => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  // bastidores: no toque não existe hover, então a foto em foco no carrossel ganha cor
  const shots = document.querySelector('.shots');
  if (shots && matchMedia('(hover: none)').matches) {
    const sio = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('on', e.intersectionRatio >= .75)),
      { root: getComputedStyle(shots).overflowX === 'auto' ? shots : null, threshold: [0, .75, 1] });
    shots.querySelectorAll('.shot').forEach(el => sio.observe(el));
  }

  // nav + barra de progresso + CTA mobile
  const nav = document.getElementById('nav'), bar = document.getElementById('progress'), mcta = document.getElementById('mcta');
  const hero = document.getElementById('hero'), final = document.getElementById('investimento');
  let ticking = false;
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('scrolled', y > 20);
    bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    const pastHero = y > hero.offsetHeight * .7;
    const atFinal = final.getBoundingClientRect().top < innerHeight * .85;
    mcta.classList.toggle('show', pastHero && !atFinal);
    nav.classList.toggle('cta-off', pastHero && !atFinal);
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // jornada do hero: quando a pessoa começa a rolar, acelera até os quatro pontos acenderem,
  // para a animação terminar antes de a jornada sair da tela; depois volta ao ritmo normal
  const jornada = document.querySelector('.jornada');
  if (jornada && !reduce && jornada.getAnimations) {
    const CYCLE = 11000, LIT = .64 * CYCLE, RUSH = 2.6;
    let rushing = false;
    const anims = () => jornada.getAnimations({ subtree: true }).filter(a => /^j(fill|d|t)/.test(a.animationName || ''));
    const phase = () => { const a = anims()[0]; return a ? (a.currentTime % CYCLE) : LIT; };
    const watch = () => {
      if (phase() >= LIT && phase() < .84 * CYCLE) { anims().forEach(a => a.playbackRate = 1); rushing = false; return; }
      requestAnimationFrame(watch);
    };
    addEventListener('scroll', () => {
      if (rushing || scrollY < 10 || jornada.getBoundingClientRect().bottom < 0) return;
      const p = phase();
      if (p >= LIT && p < .84 * CYCLE) return; // já está tudo aceso
      rushing = true;
      anims().forEach(a => a.playbackRate = RUSH);
      requestAnimationFrame(watch);
    }, { passive: true });
  }
})();
