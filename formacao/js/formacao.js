/* ===== CONFIG
   INSCRICAO_URL: link de inscrição/pagamento da Primeira Formação.
   Enquanto estiver vazio, o botão final só leva até a seção de investimento. ===== */
const INSCRICAO_URL = 'https://pay.hub.la/l31U7R6dzmQNoOmWUagn';

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

  // níveis: círculo vermelho em volta do nível 2 e seta do nível 2 até o nível 5,
  // recalculados a cada mudança de tamanho (no desktop sobe pelas barras; no celular desce pela margem)
  const box = document.querySelector('.niveis-box');
  if (box) {
    const fx = box.querySelector('.niveis-fx'), lv = [...box.querySelectorAll('.nivel')];
    const circle = fx.querySelector('.fx-circle'), arrow = fx.querySelector('.fx-arrow'), reveal = fx.querySelector('.fx-reveal');
    const draw = () => {
      const o = box.getBoundingClientRect(), r = el => { const b = el.getBoundingClientRect(); return { x: b.left - o.left, y: b.top - o.top, w: b.width, h: b.height }; };
      const stacked = getComputedStyle(lv[0].querySelector('.nivel-bar')).display === 'none';
      // círculo: elipse "à mão" em volta do texto do nível 2 (ou do cartão inteiro, no celular)
      const t = r(stacked ? lv[1] : lv[1].querySelector('.nivel-txt'));
      const cx = t.x + t.w / 2, cy = t.y + t.h / 2, rx = t.w / 2 + (stacked ? 10 : 16), ry = t.h / 2 + (stacked ? 10 : 14);
      circle.setAttribute('d', `M ${cx + rx * .15} ${cy - ry} A ${rx} ${ry} -4 1 1 ${cx - rx * .1} ${cy - ry * 1.02} L ${cx + rx * .3} ${cy - ry * .94}`);
      let d;
      if (stacked) {
        const a = r(lv[1]), b = r(lv[4]), m = r(lv[2]), x0 = a.x - 18, xm = m.x - 26;
        d = `M ${x0} ${a.y + a.h * .75} Q ${xm} ${(a.y + a.h + b.y) / 2} ${b.x + 28} ${b.y - 10}`;
      } else {
        const a = r(lv[1].querySelector('.nivel-bar')), b = r(lv[4].querySelector('.nivel-bar'));
        const x0 = a.x + a.w / 2, y0 = a.y + 30, x1 = b.x + b.w / 2, y1 = b.y + 30;
        d = `M ${x0} ${y0} C ${x0 + (x1 - x0) * .55} ${y0 + 4} ${x1 - (x1 - x0) * .3} ${y1 + (y0 - y1) * .35} ${x1} ${y1}`;
      }
      arrow.setAttribute('d', d); reveal.setAttribute('d', d);
    };
    draw();
    box.addEventListener('transitionend', draw);
    // desenha uma vez só, quando a pessoa rola até a escada estar bem visível
    const fio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting || scrollY < 1) return;
      draw(); box.classList.add('fx-on'); fio.disconnect();
    }), { threshold: .45 });
    fio.observe(box.querySelector('.niveis'));
    addEventListener('resize', draw);
    if (window.ResizeObserver) { const ro = new ResizeObserver(draw); ro.observe(box); lv.forEach(l => ro.observe(l)); box.querySelectorAll('.nivel-bar').forEach(b => ro.observe(b)); }
  }
})();
