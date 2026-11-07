/* =========================================================
   모바일 초대장 첫 화면 (오프라인 초대장과 같은 구조)
   들어오면 접힌 종이(D)가 짠 나타남 → 누르면 세 면이 동시에 쫙 펼쳐지며
   화면을 가득 채움 → 펼친 종이 안쪽에 전시 정보가 탁 → 스크롤하면 나머지 정보
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('invHero');
  const svg = document.getElementById('invPaper');
  if (!hero || !svg || !window.FoldPaper) return;

  const paper = FoldPaper.make(svg);
  const pops = [...hero.querySelectorAll('.inv-pop')];
  const tap = document.getElementById('invTap');
  const POP = 650, OPEN = 1300;
  let state = 'intro';   // intro(짠) → ready(누르기 기다림) → opening → done
  let layout;
  let popScale = 0;

  function measure() {
    const w = hero.clientWidth, h = hero.clientHeight;
    const S = Math.min(w * 0.5, h * 0.32, 260);   // 접힌 종이 한 변
    const cy = h * 0.44;
    const x = w / 2 - S * 0.585;                   // 접힌 D 모양이 가운데 오게
    const cx = x + S / 2;
    const S0 = 2 * Math.max(cx, w - cx, cy, h - cy) + 40;   // 다 펼치면 화면을 덮는 크기
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    hero.style.setProperty('--d-top', `${cy - S / 2}px`);
    hero.style.setProperty('--d-bottom', `${cy + S / 2}px`);
    layout = { S, S0, cx, cy };
  }

  // t: 0(접힘, 작음) → 1(다 펼침, 화면 가득)
  function render(t, scale = 1) {
    const { S, S0, cx, cy } = layout;
    const f = 1 - Math.max(0, Math.min(1, t / 0.8));      // 펼치기가 먼저, 커지는 건 끝까지
    const size = (S + (S0 - S) * FoldPaper.ease(t)) * scale;
    FoldPaper.draw(paper, { x: cx - size / 2, y: cy - size / 2, size, p: [f, f, f] });
  }

  const lock = (on) => document.documentElement.classList.toggle('inv-locked', on);
  const backOut = (t) => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

  function finish() {
    state = 'done';
    render(1);
    pops.forEach((el) => {
      const i = Number(el.dataset.step) || 0;
      setTimeout(() => el.classList.add('on'), 60 + i * 240);
    });
    setTimeout(() => lock(false), 500);
  }

  function open() {
    if (state !== 'ready') return;
    state = 'opening';
    tap?.classList.add('hide');
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / OPEN);
      render(t);
      if (t < 1) requestAnimationFrame(step);
      else finish();
    };
    requestAnimationFrame(step);
  }

  function intro() {   // 짠!
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / POP);
      popScale = backOut(t);
      render(0, Math.max(0.001, popScale));
      if (t < 1) requestAnimationFrame(step);
      else { state = 'ready'; tap?.classList.add('show'); }
    };
    requestAnimationFrame(step);
  }

  measure();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tap?.classList.add('hide');
    finish();
  } else {
    lock(true);
    render(0, 0.001);
    setTimeout(intro, 250);
    hero.addEventListener('click', open);
    hero.addEventListener('touchmove', open, { passive: true });
    window.addEventListener('wheel', open, { passive: true });
  }

  window.addEventListener('resize', () => {
    measure();
    render(state === 'done' ? 1 : 0);
  });

  // 무빙 포스터: 화면에 보이면 한 번 재생
  const video = document.getElementById('invitePosterVideo');
  if (video && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { video.play().catch(() => {}); io.disconnect(); }
      });
    }, { threshold: 0.5 });
    io.observe(video);
  }
});
