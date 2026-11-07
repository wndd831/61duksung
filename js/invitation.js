/* =========================================================
   모바일 초대장 첫 화면 – 오프라인 초대장 그대로
   네 번 접힌 정사각형 카드가 짠 → 누르면 가로·세로가 동시에 쫙 펼쳐짐
   → 펼친 종이 안쪽(접힌 선이 남은 면)에 전시 정보가 탁 → 스크롤하면 나머지
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('invHero');
  const stage = document.getElementById('invStage');
  const svg = document.getElementById('invSheet');
  if (!hero || !stage || !svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const cover = document.getElementById('invCover');
  const inside = document.getElementById('invInside');
  const items = [...hero.querySelectorAll('.inv-q')];
  const tap = document.getElementById('invTap');
  const scrollHint = document.getElementById('invScroll');
  const POP = 650, OPEN = 1150, ROT = -8;
  let state = 'intro';
  let L = 340;

  // 종이: 4칸 × (밝은 삼각형 + 접힌 선 그늘 삼각형)
  const QUADS = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  const shapes = QUADS.map(() => {
    const g = document.createElementNS(NS, 'g');
    const base = document.createElementNS(NS, 'polygon');
    const shade = document.createElementNS(NS, 'polygon');
    [base, shade].forEach((el) => {
      el.setAttribute('stroke-width', '0.6');
      el.setAttribute('stroke-linejoin', 'round');
      g.appendChild(el);
    });
    shade.setAttribute('fill', '#000');
    shade.setAttribute('stroke', 'none');
    svg.appendChild(g);
    return { g, base, shade };
  });
  // 가운데 접는 선 (펼쳐졌을 때 연하게)
  const creases = document.createElementNS(NS, 'g');
  creases.setAttribute('class', 'inv-creases');
  svg.appendChild(creases);

  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const backOut = (t) => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

  function measure() {
    const w = hero.clientWidth, h = hero.clientHeight;
    L = Math.floor(Math.min(w - 28, h * 0.66, 520));
    hero.style.setProperty('--L', `${L}px`);
    svg.setAttribute('viewBox', `${-0.6 * L} ${-0.6 * L} ${2.2 * L} ${2.2 * L}`);
  }

  // e: 0(접힘) → 1(다 펼침) / pop: 처음 등장 크기
  function render(e, pop = 1) {
    const h = (L / 2) * pop;
    const off = 0.5 * (1 - e);                       // 접힌 카드가 가운데 오게
    const rot = (ROT * (1 - e) * Math.PI) / 180;
    const cs = Math.cos(rot), sn = Math.sin(rot);
    const c = Math.cos(Math.PI * (1 - e));           // 넘어가는 면의 눌린 정도 (-1 → 1)
    const P = (u, v) => {
      const x = (u - off) * h, y = (v - off) * h;
      return `${(L / 2 + x * cs - y * sn).toFixed(2)},${(L / 2 + x * sn + y * cs).toFixed(2)}`;
    };
    QUADS.forEach(([sx, sy], i) => {
      const kx = sx > 0 ? 1 : c, ky = sy > 0 ? 1 : c;
      const X = sx * kx, Y = sy * ky;
      const back = (kx < 0) !== (ky < 0);            // 한 번만 뒤집힌 면은 뒷면
      const col = back ? '#e3661a' : 'var(--orange)';
      const { base, shade } = shapes[i];
      base.setAttribute('points', [P(0, 0), P(X, 0), P(X, Y), P(0, Y)].join(' '));
      base.setAttribute('fill', col);
      base.setAttribute('stroke', col);
      // 오프라인 초대장처럼 번갈아 생기는 그늘 (접힌 선 사이 삼각형)
      const tri = sx * sy > 0 ? [P(0, 0), P(X, 0), P(X, Y)] : [P(0, 0), P(X, Y), P(0, Y)];
      shade.setAttribute('points', tri.join(' '));
      shade.setAttribute('fill-opacity', (0.07 + 0.18 * (1 - Math.abs(kx * ky))).toFixed(3));
    });
    // 펼쳐지는 동안: 나중에 넘어오는 면이 위로
    if (e < 0.5) { svg.appendChild(shapes[0].g); svg.appendChild(shapes[1].g); svg.appendChild(shapes[2].g); svg.appendChild(shapes[3].g); }
    creases.style.opacity = Math.max(0, (e - 0.85) / 0.15);
    if (cover) {
      cover.style.transform = `translate(${L / 4}px, ${L / 4}px) rotate(${ROT * (1 - e)}deg) scale(${pop})`;
      cover.style.opacity = Math.max(0, 1 - e / 0.12);
    }
  }

  function drawCreases() {
    creases.innerHTML = '';
    const lines = [[0, L / 2, L, L / 2], [L / 2, 0, L / 2, L], [0, 0, L, L], [L, 0, 0, L]];
    lines.forEach(([x1, y1, x2, y2]) => {
      const ln = document.createElementNS(NS, 'line');
      Object.entries({ x1, y1, x2, y2 }).forEach(([k, v]) => ln.setAttribute(k, v));
      creases.appendChild(ln);
    });
  }

  const lock = (on) => document.documentElement.classList.toggle('inv-locked', on);

  function finish() {
    state = 'done';
    render(1);
    inside.classList.add('on');
    items.forEach((el) => {
      const i = Number(el.dataset.step) || 0;
      setTimeout(() => el.classList.add('on'), 60 + i * 130);
    });
    setTimeout(() => { scrollHint?.classList.add('on'); lock(false); }, 60 + items.length * 130 + 200);
  }

  function open() {
    if (state !== 'ready') return;
    state = 'opening';
    tap?.classList.add('hide');
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / OPEN);
      render(ease(t));
      if (t < 1) requestAnimationFrame(step);
      else finish();
    };
    requestAnimationFrame(step);
  }

  function intro() {   // 짠!
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / POP);
      render(0, Math.max(0.001, backOut(t)));
      if (t < 1) requestAnimationFrame(step);
      else { state = 'ready'; tap?.classList.add('show'); }
    };
    requestAnimationFrame(step);
  }

  measure();
  drawCreases();

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
    drawCreases();
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
