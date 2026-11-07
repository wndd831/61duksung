/* =========================================================
   모바일 초대장 첫 화면 – 실제 오프라인 초대장 (정사각형 · 스퀘어 베이스 접기)
   겉면 주황 "UNFOLD TO INVITATION ↓" → 누르면 진짜 종이처럼 펼쳐짐 → 안쪽 파랑
   펼친 뒤엔 확대되고, 손가락(마우스)으로 끌어서 여기저기 볼 수 있음

   종이 좌표: 가운데 O(0,0), 위 꼭짓점 (0,-100) · 아래 (0,100) · 왼 (-100,0) · 오 (100,0)
   접힌 카드 = 아래쪽 1/4 마름모 자리. 위 칸이 가로선을 축으로 넘어오고,
   왼·오른 칸은 가운데 가로 접는 선을 따라 반으로 접히며 안으로 들어감.
   한 각도(θ)만 정하면 나머지가 실제 종이처럼 따라 움직임: tan(φ/2) = √2·tan(θ/2)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('invHero');
  const svg = document.getElementById('invSvg');
  if (!hero || !svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const r2 = Math.SQRT1_2;
  const scrollBtn = document.getElementById('invScroll');
  const POP = 700, OPEN = 2100, ZOOM = 900;
  const TEXT_PX = 11;   // 다 펼친 뒤 본문 글자가 이 크기(px)로 보이게 확대
  const OUT = 'var(--orange)', IN = 'var(--blue)', INK = 'var(--black)';
  const KR = 'var(--font-kr-regular)', KRB = 'var(--font-kr)', EN = 'var(--font-en-title)', PT = "'Pretendard', sans-serif";

  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    if (parent) parent.appendChild(n);
    return n;
  };
  const txt = (parent, x, y, str, o = {}) => {
    const t = el('text', { x, y, fill: INK, 'text-anchor': o.anchor || 'start' }, parent);
    t.style.fontFamily = o.font || KR;
    t.style.fontSize = `${o.size || 2.2}px`;
    t.style.fontWeight = o.weight || 400;
    if (o.ls) t.style.letterSpacing = o.ls;
    t.textContent = str;
    return t;
  };

  // ---------- 장면 ----------
  const cam = el('g', {}, svg);
  const V = {
    O: [0, 0], T: [0, -100], B: [0, 100], L: [-100, 0], R: [100, 0],
    UL: [-50, -50], UR: [50, -50], LL: [-50, 50], LR: [50, 50],
  };
  // 조각마다: 그룹(면 + 그 면에 인쇄된 글자)
  const piece = (name, keys) => {
    const g = el('g', {}, cam);
    const poly = el('polygon', { 'stroke-width': '0.35', 'stroke-linejoin': 'round' }, g);
    return { name, keys, g, poly, z: 0 };
  };
  const P = {
    bottom: piece('bottom', ['O', 'LL', 'B', 'LR']),
    top: piece('top', ['O', 'UL', 'T', 'UR']),
    lowL: piece('lowL', ['O', 'L', 'LL']),
    lowR: piece('lowR', ['O', 'LR', 'R']),
    upL: piece('upL', ['O', 'UL', 'L']),
    upR: piece('upR', ['O', 'R', 'UR']),
  };

  // 위 칸 안쪽(파랑) 글자 – 펼친 상태 좌표로 씀
  // INVITATION! + 소개글: 서로 좌측 정렬, 두 줄 묶음은 가운데
  const topIn = el('g', {}, P.top.g);
  const topBlock = el('g', {}, topIn);
  txt(topBlock, 0, -60.5, 'INVITATION!', { font: PT, weight: 800, size: 6.3, ls: '-0.02em' });
  [
    '덕성여자대학교 시각디자인전공 제61회 졸업전시회',
    '〈Fold to Dot 폴드 투 닷〉은 대학 생활 동안',
    '쌓아 온 배움과 경험을 바탕으로 각자의 시선과',
    '생각을 작품으로 선보이는 자리입니다.',
    '각자의 과정 통해 만들어진 작업들은 하나의 지점에',
    '머무르지 않고 새로운 방향을 향해 나아갑니다.',
    '머물던 자리에서 한 걸음 나아가는 순간,',
    '그 시작을 함께할 여러분을 초대합니다.',
  ].forEach((line, i) => txt(topBlock, 0.4, -53.5 + i * 3.55, line, { size: 2.05, ls: '-0.03em' }));
  function centerTopBlock() {
    const shown = topIn.style.display;
    topIn.style.display = '';
    const b = topBlock.getBBox();
    topIn.style.display = shown;
    if (b.width) topBlock.setAttribute('transform', `translate(${-(b.x + b.width / 2)} 0)`);
  }

  // 위 칸 바깥(주황) = 접혔을 때 보이는 겉면. 접힌 카드 좌표(아래 마름모)로 씀
  const cover = el('g', {}, P.top.g);
  txt(cover, 0, 59.5, 'UNFOLD TO', { anchor: 'middle', font: PT, weight: 800, size: 4.9, ls: '-0.01em' });
  txt(cover, 0, 66, 'INVITATION', { anchor: 'middle', font: PT, weight: 800, size: 4.9, ls: '-0.01em' });
  el('line', { x1: 0, y1: 69.5, x2: 0, y2: 88.6, stroke: INK, 'stroke-width': 0.55 }, cover);
  el('polyline', { points: '-4.3,84.3 0,88.6 4.3,84.3', fill: 'none', stroke: INK, 'stroke-width': 0.55, 'stroke-linejoin': 'miter' }, cover);

  // 아래 칸 안쪽 글자 (펼치기 전엔 다른 면들에 덮여 있음)
  const botIn = el('g', {}, P.bottom.g);
  const info = [
    ['DATE', ['2026. 11. 12.', '— 11. 16.']],
    ['OPENING', ['2026. 11. 12.', '17:00']],
    ['PLACE', ['서울시 종로구 대학로 57', '홍익대 대학로아트센터', 'B2, 제3실 전시장']],
  ];
  let y = 24.5;
  info.forEach(([label, lines]) => {
    txt(botIn, -10, y, label, { font: PT, weight: 700, size: 3.5 });
    lines.forEach((ln, i) => txt(botIn, -10, y + 5.4 + i * 4.1, ln, { size: 2.9, ls: '-0.01em' }));
    y += 5.4 + lines.length * 4.1 + 3.6;
  });
  // 장소 밑: 지도 링크
  const mapLink = (x, label, href) => {
    const a = el('a', { href, target: '_blank', rel: 'noopener', class: 'inv-link' }, botIn);
    const t = txt(a, x, y - 3.6, label, { size: 2.6 });   // 장소 줄 간격과 똑같이
    t.setAttribute('text-decoration', 'underline');
    return a;
  };
  const PLACE_Q = encodeURIComponent('홍익대학교 대학로 아트센터');
  mapLink(-10, '네이버 지도', `https://map.naver.com/p/search/${PLACE_Q}`);
  mapLink(3, '카카오맵', `https://map.kakao.com/?q=${PLACE_Q}`);

  // 펼쳤을 때 접힌 자리 얇은 선 + 가운데 OPEN UP!
  const creases = el('g', { stroke: 'rgba(65,68,69,0.28)', 'stroke-width': 0.8, 'vector-effect': 'non-scaling-stroke' }, cam);
  ['L', 'R', 'UL', 'UR', 'LL', 'LR'].forEach((k) => {
    el('line', { x1: 0, y1: 0, x2: V[k][0], y2: V[k][1], 'vector-effect': 'non-scaling-stroke' }, creases);
  });
  const openUp = el('g', { transform: 'rotate(-30)' }, cam);   // 30° 기울기
  txt(openUp, 0, 3.3, 'OPEN UP!', { anchor: 'middle', font: PT, weight: 800, size: 9.4, ls: '-0.03em' });
  openUp.style.transition = 'opacity .18s ease-out';

  // ---------- 종이 아래 (펼친 뒤 나타남, 끌어 내리면 보임) ----------
  // 위에서부터: 초대장 공유하기 → 인스타그램 · 웹사이트 · 방명록 → 전공 글자 + 학과 로고 + 학교 로고
  const LINKS = {
    website: 'index.html',
    guestbook: 'guestbook.html',
    instagram: 'https://www.instagram.com/vcd_duksung/',
  };
  const GRAY = '#8a8d8e';
  const extras = el('g', {}, cam);
  extras.style.transition = 'opacity .4s ease-out';
  const Y0 = 112;   // 종이 맨 아래 꼭짓점(100)보다 조금 아래

  // 초대장 공유하기 버튼
  const share = el('a', { href: '#', class: 'inv-link inv-share', role: 'button' }, extras);
  el('rect', { x: -14, y: Y0 - 3.4, width: 28, height: 6.8, rx: 3.4, fill: 'none', stroke: INK, 'stroke-width': 0.4 }, share);
  txt(share, 0, Y0 + 1, '초대장 공유하기', { anchor: 'middle', font: KRB, weight: 700, size: 2.6 });
  share.addEventListener('click', async (e) => {
    e.preventDefault();
    const url = 'https://duksungvcd2026.com/invitation';
    const data = { title: 'Fold to Dot. 초대장', text: '덕성여자대학교 시각디자인전공 제61회 졸업전시회에 초대합니다', url };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(url);
      share.querySelector('text').textContent = '링크가 복사됐어요';
      setTimeout(() => { share.querySelector('text').textContent = '초대장 공유하기'; }, 1800);
    } catch (err) {}
  });

  // 링크 (글자)
  const links = [['인스타그램', LINKS.instagram, true], ['웹사이트', LINKS.website], ['방명록', LINKS.guestbook]];
  const gap = 15;
  const linkTexts = links.map(([label, href, ext], i) => {
    const a = el('a', { href, class: 'inv-link' }, extras);
    if (ext) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); }
    const t = txt(a, (i - 1) * gap, Y0 + 10, label, { size: 2.6 });
    t.setAttribute('text-decoration', 'underline');
    return t;
  });

  // 전공 글자 + 로고 (회색, 나란히)
  const foot = el('g', {}, extras);
  const ft = txt(foot, 0, Y0 + 19.6, '덕성여자대학교 시각디자인전공 제61회 졸업전시회', { size: 2, font: KR });
  ft.setAttribute('fill', GRAY);
  const logoV = el('image', { href: 'images/visual-design-logo.png', y: Y0 + 17.5, width: 8.6, height: 2.6, opacity: 0.6 }, foot);
  const logoS = el('image', { href: 'images/duksung-logo.png', y: Y0 + 16.4, width: 4.8, height: 4.8, opacity: 0.6 }, foot);
  function layoutFoot() {      // 글자 폭을 재서 [글자][학과로고][학교로고]를 가운데 정렬
    const shown = extras.style.opacity;
    const w = ft.getComputedTextLength ? ft.getComputedTextLength() : 44;
    const total = w + 2.2 + 8.6 + 1.8 + 4.8;
    const x0 = -total / 2;
    ft.setAttribute('x', x0);
    logoV.setAttribute('x', x0 + w + 2.2);
    logoS.setAttribute('x', x0 + w + 2.2 + 8.6 + 1.8);
    // 링크 글자 사이 간격을 똑같이
    const ws = linkTexts.map((t) => t.getComputedTextLength());
    const G = 5, sum = ws.reduce((a, b) => a + b, 0) + G * (ws.length - 1);
    let lx = -sum / 2;
    linkTexts.forEach((t, i) => { t.setAttribute('x', lx); lx += ws[i] + G; });
    extras.style.opacity = shown;
  }

  // ---------- 접기 계산 ----------
  const rotAxis = (p, a, ang) => {   // 원점 지나는 축 a(단위벡터) 기준 회전 (로드리게스)
    const [x, y, z] = p, [ax, ay, az] = a, c = Math.cos(ang), s = Math.sin(ang);
    const d = ax * x + ay * y + az * z;
    const cx = ay * z - az * y, cy = az * x - ax * z, cz = ax * y - ay * x;
    return [x * c + cx * s + ax * d * (1 - c), y * c + cy * s + ay * d * (1 - c), z * c + cz * s + az * d * (1 - c)];
  };

  function pose(theta) {   // theta: 0(펼침) ~ π(접힘)
    const phi = 2 * Math.atan(Math.SQRT2 * Math.tan(Math.min(theta, Math.PI - 1e-4) / 2));
    const ct = Math.cos(theta), st = Math.sin(theta);
    const topPt = ([x, y]) => [x, y * ct, -y * st];
    const UL = topPt(V.UL), UR = topPt(V.UR), T = topPt(V.T);
    const L = rotAxis([-100, 0, 0], [-r2, r2, 0], phi);
    const R = rotAxis([100, 0, 0], [r2, r2, 0], -phi);
    const O = [0, 0, 0], LL = [-50, 50, 0], LR = [50, 50, 0], B = [0, 100, 0];
    return { O, T, B, L, R, UL, UR, LL, LR, ct };
  }

  const area = (pts) => pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);

  function draw(theta) {
    const q = pose(theta);
    Object.values(P).forEach((pc) => {
      const pts = pc.keys.map((k) => q[k]);
      const flat = pc.keys.map((k) => V[k]);
      pc.poly.setAttribute('points', pts.map((p) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`).join(' '));
      const front = area(pts) * area(flat) > 0;       // 안쪽 면이 보이면 파랑, 뒤집혔으면 주황
      const col = front ? IN : OUT;
      pc.poly.setAttribute('fill', col);
      pc.poly.setAttribute('stroke', col);
      pc.z = pts.reduce((s, p) => s + p[2], 0) / pts.length;
    });
    // 위 칸 글자: 위 칸과 같이 눌리고 뒤집힘
    topIn.setAttribute('transform', `matrix(1 0 0 ${q.ct} 0 0)`);
    topIn.style.display = q.ct > 0.02 ? '' : 'none';
    cover.setAttribute('transform', `matrix(1 0 0 ${-q.ct} 0 0)`);
    cover.style.display = q.ct < -0.02 ? '' : 'none';
    // 겹침 순서: 높이 떠 있는 면이 위
    Object.values(P).sort((a, b) => a.z - b.z).forEach((pc) => cam.appendChild(pc.g));
    cam.appendChild(creases);
    cam.appendChild(openUp);
    cam.appendChild(extras);
  }

  // ---------- 카메라 (확대 · 이동) ----------
  let W = 0, H = 0;
  const view = { x: 0, y: 50, s: 1 };
  const scales = {};
  function measure() {
    W = hero.clientWidth; H = hero.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    scales.closed = Math.min(W * 0.85, H * 0.55) / 100;    // 접힌 카드 폭 = 화면 가로의 85%
    scales.fit = Math.min(W * 0.9, H * 0.7) / 200;         // 펼치는 동안: 종이 전체가 화면 안에
    scales.zoom = Math.max(TEXT_PX / 2.05, Math.min(W * 1.45, H * 1.15) / 200);   // 다 펼친 뒤: 본문이 읽히게 확대
    scales.min = scales.fit; scales.max = scales.zoom * 2;
  }
  function applyCam() {
    cam.setAttribute('transform', `translate(${W / 2} ${H / 2}) scale(${view.s}) translate(${-view.x} ${-view.y})`);
  }

  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const backOut = (t) => { const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const anim = (dur, fn) => new Promise((res) => {
    const t0 = performance.now();
    const step = (now) => { const t = Math.min(1, (now - t0) / dur); fn(t); if (t < 1) requestAnimationFrame(step); else res(); };
    requestAnimationFrame(step);
  });
  const lock = (on) => document.documentElement.classList.toggle('inv-locked', on);

  let state = 'intro';
  const FOCUS_Y = -42;
  const THETA_CLOSED = Math.PI - 0.0015;

  async function open() {
    if (state !== 'ready') return;
    state = 'opening';
    centerTopBlock();
    layoutFoot();          // 글자 폭은 화면에 실제 크기로 보일 때 재야 정확
    const s0 = view.s;
    await anim(OPEN, (t) => {
      const e = ease(t);
      draw(THETA_CLOSED * (1 - e));
      view.y = 50 * (1 - easeOut(Math.min(1, t * 1.4)));
      view.s = s0 + (scales.fit - s0) * easeOut(Math.min(1, t * 1.25));
      applyCam();
    });
    draw(0);
    creases.style.opacity = 1;
    const s1 = view.s, y1 = view.y;
    await anim(ZOOM, (t) => {                 // 확대
      const e = ease(t);
      view.s = s1 + (scales.zoom - s1) * e;
      view.y = y1 + (FOCUS_Y - y1) * e;        // INVITATION! 부분부터 보이게
      applyCam();
    });
    openUp.style.opacity = 1;
    extras.style.opacity = 1;
    state = 'done';
    hero.classList.add('is-pannable');
    scrollBtn?.classList.add('on');
    lock(false);
  }

  // 끌어서 이동 · 두 손가락으로 확대/축소 · PC는 ctrl+휠로 확대
  const ptrs = new Map();
  let gesture = null;
  const clampView = () => {
    view.s = Math.max(scales.min, Math.min(scales.max, view.s));
    view.x = Math.max(-105, Math.min(105, view.x));
    view.y = Math.max(-100, Math.min(128, view.y));
    applyCam();
  };
  const startGesture = () => {
    const p = [...ptrs.values()];
    const cx = p.reduce((a, q) => a + q.x, 0) / p.length, cy = p.reduce((a, q) => a + q.y, 0) / p.length;
    const d = p.length > 1 ? Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) : 0;
    gesture = { cx, cy, d, vx: view.x, vy: view.y, s: view.s };
  };
  hero.addEventListener('pointerdown', (e) => {
    if (state !== 'done' || e.target === scrollBtn) return;
    if (e.target.closest && e.target.closest('a')) return;   // 링크는 그냥 눌리게
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    hero.setPointerCapture(e.pointerId);
    startGesture();
  });
  hero.addEventListener('pointermove', (e) => {
    if (!ptrs.has(e.pointerId) || !gesture) return;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const p = [...ptrs.values()];
    const cx = p.reduce((a, q) => a + q.x, 0) / p.length, cy = p.reduce((a, q) => a + q.y, 0) / p.length;
    if (p.length > 1 && gesture.d) {
      const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      view.s = Math.max(scales.min, Math.min(scales.max, gesture.s * d / gesture.d));
    }
    view.x = gesture.vx - (cx - gesture.cx) / view.s;
    view.y = gesture.vy - (cy - gesture.cy) / view.s;
    clampView();
  });
  const endPtr = (e) => { ptrs.delete(e.pointerId); if (ptrs.size) startGesture(); else gesture = null; };
  hero.addEventListener('pointerup', endPtr);
  hero.addEventListener('pointercancel', endPtr);
  hero.addEventListener('wheel', (e) => {
    if (state !== 'done' || !e.ctrlKey) return;
    e.preventDefault();
    view.s *= Math.exp(-e.deltaY * 0.01);
    clampView();
  }, { passive: false });

  scrollBtn?.addEventListener('click', () => {
    hero.nextElementSibling?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ---------- 시작 ----------
  measure();

  creases.style.opacity = 0;
  openUp.style.opacity = 0;
  extras.style.opacity = 0;
  draw(THETA_CLOSED);
  view.s = scales.closed; view.x = 0; view.y = 50;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    draw(0); creases.style.opacity = 1; openUp.style.opacity = 1; extras.style.opacity = 1;
    view.s = scales.zoom; view.y = FOCUS_Y; applyCam(); centerTopBlock(); layoutFoot();
    state = 'done'; hero.classList.add('is-pannable'); scrollBtn?.classList.add('on');
  } else {
    lock(true);
    view.s = 0.0001; applyCam();
    setTimeout(() => anim(POP, (t) => {        // 짠!
      view.s = scales.closed * Math.max(0.0001, backOut(t));
      applyCam();
    }).then(() => { state = 'ready'; }), 250);
    hero.addEventListener('click', open);
    hero.addEventListener('touchmove', () => { if (state === 'ready') open(); }, { passive: true });
    window.addEventListener('wheel', () => { if (state === 'ready') open(); }, { passive: true });
  }

  window.addEventListener('resize', () => {
    measure();
    if (state === 'done') view.s = scales.zoom;
    else if (state === 'ready') view.s = scales.closed;
    applyCam();
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
