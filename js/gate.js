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

  var D = '<svg viewBox="59.85 42 216 216" aria-hidden="true">'
    + '<polygon fill="var(--orange)" points="116.4,45 185.7,45 255,114.3 255,185.7 185.7,255 116.4,255"/>'
    + '<polygon fill="var(--blue)" points="80.7,45 116.4,45 116.4,255 80.7,255"/>'
    + '<polygon fill="var(--blue)" points="185.7,45 255,114.3 185.7,114.3"/>'
    + '<polygon fill="var(--blue)" points="255,185.7 185.7,185.7 185.7,255"/></svg>';

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function mount() {
    var g = document.createElement('section');
    g.id = 'soonGate';
    g.className = 'soon-gate';
    g.innerHTML =
      '<div class="soon-inner">'
      + '<div class="soon-mark">' + D + '</div>'
      + '<p class="soon-kr">덕성여자대학교 시각디자인전공 제61회 졸업전시</p>'
      + '<h1 class="soon-title title-en">Fold to Dot.</h1>'
      + '<p class="soon-open"><i class="nav-dot" aria-hidden="true"></i>2026.11.12. THU 17:00 OPEN</p>'
      + '<p class="soon-count" id="soonCount" aria-live="polite"></p>'
      + '<p class="soon-label title-en">Coming Soon</p>'
      + '<a class="soon-invite" href="invitation.html">모바일 초대장 보기</a>'
      + '</div>';
    document.body.appendChild(g);

    var el = document.getElementById('soonCount');
    function tick() {
      var left = OPEN_AT.getTime() - Date.now();
      if (left <= 0 && !force) { location.reload(); return; }
      left = Math.max(0, left);
      var s = Math.floor(left / 1000);
      var d = Math.floor(s / 86400); s -= d * 86400;
      var h = Math.floor(s / 3600); s -= h * 3600;
      var m = Math.floor(s / 60); s -= m * 60;
      el.textContent = 'D-' + d + '  ' + pad(h) + ':' + pad(m) + ':' + pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
