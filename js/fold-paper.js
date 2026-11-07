/* =========================================================
   정사각형 종이가 D 모양으로 접히는 그림 (커밍순 · 모바일 초대장 공용)
   접는 순서(홈 화면 그래픽과 같은 모양):
     p[0] 오른쪽 아래 모서리 · p[1] 오른쪽 위 모서리 · p[2] 왼쪽 띠
   각 값 0(펼침) → 1(다 접힘). 접히는 면은 접는 선을 축으로 뒤집히듯 움직이고,
   뒤집히는 순간부터 뒷면(파랑)이 보임.
   ========================================================= */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var K = 0.33;   // 모서리 접는 크기 (한 변 대비)
  var L = 0.17;   // 왼쪽 띠 접는 선 위치

  function ease(t) { t = Math.max(0, Math.min(1, t)); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  // 점 P를 선 A-B 기준으로 cos(πp) 만큼 눌러서(=뒤집히는 중) 그린 위치
  function foldPoint(P, A, B, p) {
    var dx = B[0] - A[0], dy = B[1] - A[1];
    var u = ((P[0] - A[0]) * dx + (P[1] - A[1]) * dy) / (dx * dx + dy * dy);
    var F = [A[0] + u * dx, A[1] + u * dy];
    var c = Math.cos(Math.PI * p);
    return [F[0] + (P[0] - F[0]) * c, F[1] + (P[1] - F[1]) * c];
  }

  function make(svg) {
    var g = document.createElementNS(NS, 'g');
    svg.appendChild(g);
    var shapes = [];
    for (var i = 0; i < 4; i++) {
      var el = document.createElementNS(NS, 'polygon');
      // 면과 면 사이 얇은 틈이 안 보이게 같은 색 테두리를 살짝
      el.setAttribute('stroke-width', '0.6');
      el.setAttribute('stroke-linejoin', 'round');
      el.setAttribute('vector-effect', 'non-scaling-stroke');
      g.appendChild(el);
      shapes.push(el);
    }
    return { g: g, body: shapes[0], br: shapes[1], tr: shapes[2], left: shapes[3] };
  }

  // paper: make() 결과 / o: { x, y, size, p:[a,b,c] }  (x,y = 왼쪽 위)
  function paint(el, color) { el.setAttribute('fill', color); el.setAttribute('stroke', color); }

  function draw(paper, o) {
    var s = o.size, X = o.x, Y = o.y;
    var p = o.p.map(ease);
    function pt(q) { return (X + q[0] * s).toFixed(2) + ',' + (Y + q[1] * s).toFixed(2); }
    function pts(list) { return list.map(pt).join(' '); }
    var front = 'var(--orange)', back = 'var(--blue)';

    // 몸통: 접히는 부분을 뺀 나머지 (아직 안 접히기 시작했으면 그대로 포함)
    var body = [];
    body.push(p[2] > 0 ? [L, 0] : [0, 0]);
    body.push(p[1] > 0 ? [1 - K, 0] : [1, 0]);
    if (p[1] > 0) body.push([1, K]);
    body.push(p[0] > 0 ? [1, 1 - K] : [1, 1]);
    if (p[0] > 0) body.push([1 - K, 1]);
    body.push(p[2] > 0 ? [L, 1] : [0, 1]);
    paper.body.setAttribute('points', pts(body));
    paint(paper.body, front);

    // 오른쪽 아래 모서리
    if (p[0] > 0) {
      var A = [1, 1 - K], B = [1 - K, 1];
      paper.br.setAttribute('points', pts([A, foldPoint([1, 1], A, B, p[0]), B]));
      paint(paper.br, p[0] > 0.5 ? back : front);
      paper.br.style.display = '';
    } else paper.br.style.display = 'none';

    // 오른쪽 위 모서리
    if (p[1] > 0) {
      var C = [1 - K, 0], D = [1, K];
      paper.tr.setAttribute('points', pts([C, foldPoint([1, 0], C, D, p[1]), D]));
      paint(paper.tr, p[1] > 0.5 ? back : front);
      paper.tr.style.display = '';
    } else paper.tr.style.display = 'none';

    // 왼쪽 띠 (세로선 x=L 기준으로 넘어옴)
    if (p[2] > 0) {
      var x0 = L + (0 - L) * Math.cos(Math.PI * p[2]);
      paper.left.setAttribute('points', pts([[x0, 0], [L, 0], [L, 1], [x0, 1]]));
      paint(paper.left, p[2] > 0.5 ? back : front);
      paper.left.style.display = '';
    } else paper.left.style.display = 'none';
  }

  window.FoldPaper = { make: make, draw: draw, ease: ease };
})();
