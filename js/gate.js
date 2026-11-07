/* =========================================================
   오픈 전 잠금 (Coming Soon)
   - OPEN_AT 시간 전에는 실제 사이트(duksungvcd2026.com) 방문자에게 "커밍순" 화면만 보임
   - 시간이 되면 자동으로 열림 (보고 있던 사람도 카운트다운 끝나면 새로고침돼서 열림)
   - 모바일 초대장(invitation.html)은 잠그지 않음
   - 우리끼리 미리 보기:  주소 뒤에 ?preview=fold  한 번 붙여 들어가면 그 브라우저는 계속 열림
                          ?preview=off  로 다시 잠금
   - 커밍순 화면 확인용:  ?soon  붙이면 어디서든 커밍순 화면이 보임
   ========================================================= */
(function () {
  var OPEN_AT = new Date('2026-11-12T17:00:00+09:00'); // ← 오픈 날짜·시간 (한국 시간)

  var params = new URLSearchParams(location.search);
  var KEY = 'ftdPreview';
  try {
    if (params.get('preview') === 'fold') localStorage.setItem(KEY, '1');
    if (params.get('preview') === 'off') localStorage.removeItem(KEY);
  } catch (e) {}

  var force = params.has('soon');
  var live = /(^|\.)duksungvcd2026\.com$|\.github\.io$/.test(location.hostname);
  var bypass = false;
  try { bypass = localStorage.getItem(KEY) === '1'; } catch (e) {}

  if (!force && (!live || bypass || Date.now() >= OPEN_AT.getTime())) return;

  var root = document.documentElement;
  root.classList.add('is-soon');
  var st = document.createElement('style');
  st.textContent = 'html.is-soon body > *:not(#soonGate):not(.custom-cursor){display:none!important}html.is-soon,html.is-soon body{overflow:hidden!important}';
  document.head.appendChild(st);

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function mount() {
    var g = document.createElement('section');
    g.id = 'soonGate';
    g.className = 'soon-gate';
    g.innerHTML =
      '<div class="soon-inner" id="soonInner">'
      + '<p class="soon-kr"><span class="soon-med">덕성여자대학교 시각디자인전공 제61회 졸업전시</span><br><b>FOLD TO DOT.</b></p>'
      + '<div class="soon-mark"><svg id="soonPaper" viewBox="-0.06 -0.06 1.12 1.12" aria-label="종이가 D 모양으로 접히는 과정"></svg></div>'
      + '<h1 class="soon-title" id="soonTitle">COMING SOON</h1>'
      + '<p class="soon-open" id="soonOpen">2026. 11. 12. THU 17:00 OPEN</p>'
      + '<p class="soon-count" aria-live="polite"><b id="soonDay"></b><span class="soon-med" id="soonCount"></span></p>'
      + '<a class="soon-invite" href="invitation.html"><i class="nav-dot" aria-hidden="true"></i>모바일 초대장 바로가기<i class="nav-dot" aria-hidden="true"></i></a>'
      + '</div>';
    document.body.appendChild(g);

    var el = document.getElementById('soonCount');
    var dayEl = document.getElementById('soonDay');

    // 날짜 줄 가로 길이를 COMING SOON 가로 길이에 딱 맞춤 → 그 크기를 D-day·초대장 버튼에도 같이 씀
    var title = document.getElementById('soonTitle');
    var open = document.getElementById('soonOpen');
    var inner = document.getElementById('soonInner');
    function fit() {
      inner.style.setProperty('--soon-mid', '20px');
      var w = title.getBoundingClientRect().width;
      var w0 = open.getBoundingClientRect().width;
      if (!w || !w0) return;
      var f = 20 * w / w0;
      inner.style.setProperty('--soon-mid', f.toFixed(2) + 'px');
      var w1 = open.getBoundingClientRect().width;   // 한 번 더 미세 조정
      if (w1) inner.style.setProperty('--soon-mid', (f * w / w1).toFixed(2) + 'px');
    }
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    window.addEventListener('resize', fit);
    function tick() {
      var left = OPEN_AT.getTime() - Date.now();
      if (left <= 0 && !force) { location.reload(); return; }
      left = Math.max(0, left);
      var s = Math.floor(left / 1000);
      var d = Math.floor(s / 86400); s -= d * 86400;
      var h = Math.floor(s / 3600); s -= h * 3600;
      var m = Math.floor(s / 60); s -= m * 60;
      dayEl.textContent = 'D-' + d;
      el.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
    }
    tick();
    setInterval(tick, 1000);

    // 한 자리에서 차근차근: 펼침 → 오른쪽 아래 → 오른쪽 위 → 왼쪽 띠 → 잠깐 멈춤 → 다시 펼쳐진 종이로
    var svg = document.getElementById('soonPaper');
    if (!window.FoldPaper || !svg) return;
    var paper = FoldPaper.make(svg);
    var HOLD = 600, FOLD = 750, GAP = 350, END = 1500, FADE = 300;
    var seq = [HOLD, FOLD, GAP, FOLD, GAP, FOLD, END, FADE, FADE];
    var total = seq.reduce(function (a, b) { return a + b; }, 0);
    var t0 = performance.now();
    function frame(now) {
      var t = (now - t0) % total;
      var at = 0, p = [0, 0, 0], op = 1;
      var f1 = HOLD, f2 = f1 + FOLD + GAP, f3 = f2 + FOLD + GAP, fe = f3 + FOLD + END;
      p[0] = (t - f1) / FOLD; p[1] = (t - f2) / FOLD; p[2] = (t - f3) / FOLD;
      p = p.map(function (v) { return Math.max(0, Math.min(1, v)); });
      if (t >= fe && t < fe + FADE) op = 1 - (t - fe) / FADE;          // 사라지고
      else if (t >= fe + FADE) { p = [0, 0, 0]; op = (t - fe - FADE) / FADE; } // 펼친 종이로 다시
      svg.style.opacity = op;
      FoldPaper.draw(paper, { x: 0, y: 0, size: 1, p: p });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
