/* =========================================================
   모바일 초대장 첫 화면
   주황 종이가 화면을 꽉 채움 → 누르면 세 면(오른쪽 아래·오른쪽 위·왼쪽 띠)이
   동시에 접히면서 작아짐 → 글자가 탁 나타나며 포스터 완성 → 스크롤하면 정보
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('invHero');
  const svg = document.getElementById('invPaper');
  if (!hero || !svg || !window.FoldPaper) return;

  const paper = FoldPaper.make(svg);
  const pops = [...hero.querySelectorAll('.inv-pop')];
  const tap = document.getElementById('invTap');
  const DUR = 1600;
  let state = 'ready';   // ready → folding → done
  let layout;

  // D가 놓일 자리 (화면 가운데보다 살짝 위)
  function measure() {
    const w = hero.clientWidth, h = hero.clientHeight;
    const S = Math.min(w * 0.56, h * 0.36, 300);           // 다 접힌 종이 한 변
    const cy = h * 0.45;
    const x = w / 2 - S * 0.585;                            // 접힌 D 모양이 가운데 오게
    const cx = x + S / 2;
    // 처음 크기: 종이가 화면을 완전히 덮게
    const S0 = 2 * Math.max(cx, w - cx, cy, h - cy) + 40;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    hero.style.setProperty('--d-top', `${cy - S / 2}px`);
    hero.style.setProperty('--d-bottom', `${cy + S / 2}px`);
    layout = { S, S0, cx, cy };
  }

  function render(t) {   // t: 0~1
    const { S, S0, cx, cy } = layout;
    const k = FoldPaper.ease(t);
    const size = S0 + (S - S0) * k;
    const f = Math.max(0, Math.min(1, (t - 0.12) / 0.88));  // 줄어들기 시작하고 바로 접힘
    FoldPaper.draw(paper, { x: cx - size / 2, y: cy - size / 2, size, p: [f, f, f] });
  }

  function lock(on) {
    document.documentElement.classList.toggle('inv-locked', on);
  }

  function finish() {
    state = 'done';
    render(1);
    hero.classList.add('is-folded');
    pops.forEach((el) => {
      const i = Number(el.dataset.step) || 0;
      setTimeout(() => el.classList.add('on'), 80 + i * 260);
    });
    setTimeout(() => lock(false), 600);
  }

  function play() {
    if (state !== 'ready') return;
    state = 'folding';
    tap?.classList.add('hide');
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / DUR);
      render(t);
      if (t < 1) requestAnimationFrame(step);
      else finish();
    };
    requestAnimationFrame(step);
  }

  measure();
  render(0);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tap?.classList.add('hide');
    finish();
  } else {
    lock(true);
    hero.addEventListener('click', play);
    // 누르지 않고 화면을 밀어도 접힘
    hero.addEventListener('touchmove', play, { passive: true });
    window.addEventListener('wheel', play, { passive: true, once: true });
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
