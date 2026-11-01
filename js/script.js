
  /* =========================================
     0. 페이지는 항상 맨 위에서 시작
     (브라우저가 예전 스크롤 위치를 복원해서 중간부터 보이는 문제 방지)
  ========================================= */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) {
    window.scrollTo(0, 0);
    window.addEventListener('pageshow', () => window.scrollTo(0, 0));
  }

  /* =========================================
     1. DESIGNER FILTER
  ========================================= */

  const filterBtns = document.querySelectorAll('.filter-btn');
  const designerCards = document.querySelectorAll('.designer-card');

  filterBtns.forEach((btn) => {

    btn.addEventListener('click', () => {

      filterBtns.forEach((b) => {
        b.classList.remove('active');
      });

      btn.classList.add('active');

      const target = btn.dataset.filter;

      designerCards.forEach((card) => {

        if (
          target === 'all' ||
          card.dataset.initial === target
        ) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }

      });

    });

  });



  /* =========================================
     2. TAPE CURSOR
  ========================================= */

  const tapeCursor =
    document.querySelector('.custom-cursor');

  if (tapeCursor) {

    /* 마우스 따라오기 */

    document.addEventListener('mousemove', (e) => {

      tapeCursor.style.left =
        `${e.clientX}px`;

      tapeCursor.style.top =
        `${e.clientY}px`;

    });


    /* 누르는 중엔 주황 */
    document.addEventListener('mousedown', () => {
      tapeCursor.classList.add('is-pressed');
    });
    document.addEventListener('mouseup', () => {
      tapeCursor.classList.remove('is-pressed');
    });

    /* 클릭 가능한 요소 */

    const clickableSelector = `
      a,
      button,
      input,
      textarea,
      select,
      .designer-card,
      .work-card,
      .filter-btn
    `;


    /* 마우스 올림 */

    document.addEventListener('mouseover', (e) => {

      if (e.target.closest(clickableSelector)) {

        tapeCursor.classList.add('is-hovering');

      }

    });


    /* 마우스 뺌 */

    document.addEventListener('mouseout', (e) => {

      if (e.target.closest(clickableSelector)) {

        tapeCursor.classList.remove('is-hovering');

      }

    });

  }



  /* =========================================
     3. DESIGNER POPUP
  ========================================= */

  const modal =
    document.getElementById('designerModal');

  const modalClose =
    document.getElementById('designerModalClose');

  const modalName =
    modal?.querySelector('.designer-modal-name');

  const modalIntro =
    modal?.querySelector('.designer-modal-intro');


  designerCards.forEach((card) => {

    card.addEventListener('click', (e) => {

      e.preventDefault();


      if (modalName) {

        modalName.textContent =
          card.dataset.name || '';

      }


      if (modalIntro) {

        modalIntro.textContent =
          card.dataset.intro || '';

      }


      if (modal) {

        modal.classList.add('open');

      }

    });

  });


  /* 닫기 버튼 */

  modalClose?.addEventListener('click', () => {

    modal?.classList.remove('open');

  });


  /* 팝업 바깥 클릭 */

  modal?.addEventListener('click', (e) => {

    if (e.target === modal) {

      modal.classList.remove('open');

    }

  });


  /* ESC */

  document.addEventListener('keydown', (e) => {

    if (e.key === 'Escape') {

      modal?.classList.remove('open');

    }

  });

  /* =========================================
     4. SCROLL REVEAL (단어 단위, 낙하)
  ========================================= */

  function wrapWords(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const fragment = document.createDocumentFragment();
      const words = node.textContent.split(/(\s+)/); // 공백도 유지하면서 분리

      words.forEach((word) => {
        if (word.trim() === '') {
          fragment.appendChild(document.createTextNode(word));
        } else {
          const span = document.createElement('span');
          span.className = 'word';
          span.textContent = word;
          fragment.appendChild(span);
        }
      });

      node.replaceWith(fragment);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
      Array.from(node.childNodes).forEach(wrapWords);
    }
  }

  const revealTargets = document.querySelectorAll('.reveal-text');

  revealTargets.forEach((el) => {
    Array.from(el.childNodes).forEach(wrapWords);

    const words = el.querySelectorAll('.word');
    words.forEach((span, i) => {
      span.style.transitionDelay = `${i * 0.06}s`; // 단어 사이 간격 (타다닥 느낌)
    });
  });

  const scrollIntroInner =
    document.querySelector('.scroll-intro-inner');

  if (scrollIntroInner && scrollIntroInner.dataset.reveal !== 'manual') {

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
            // 마지막 단어까지 다 떨어진 뒤 일반 글자로 (선택 영역 높이 통일)
            const count = entry.target.querySelectorAll('.word').length;
            setTimeout(() => entry.target.classList.add('settled'), count * 60 + 800);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(scrollIntroInner);

  }

    /* =========================================
     5. GUEST BOOK BOARD
  ========================================= */

  const board = document.getElementById('board');
  const addBtn = document.getElementById('addBtn');
  const guestModal = document.getElementById('guestModal');
  const guestModalClose = document.getElementById('guestModalClose');
  const guestTo = document.getElementById('guestTo');
  const guestFrom = document.getElementById('guestFrom');
  const guestMessage = document.getElementById('guestMessage');
  const guestSubmit = document.getElementById('guestSubmit');

  if (board) {

    const STORAGE_KEY = 'guestbookNotes';

       const HEADER_HEIGHT = 110;
    const MAX_BOARD_HEIGHT = window.innerHeight * 3; // 최대 화면 3개 분량

    function updateBoardHeight() {
      const notes = board.querySelectorAll('.guest-note');
      let maxBottom = window.innerHeight - HEADER_HEIGHT; // 기본(최소) 높이

      notes.forEach((el) => {
        const bottom = el.offsetTop + el.offsetHeight;
        if (bottom > maxBottom) maxBottom = bottom;
      });

      const targetHeight = Math.min(maxBottom + 100, MAX_BOARD_HEIGHT); // 여유 100px
      board.style.height = `${targetHeight}px`;
    }

    function loadNotes() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch {
        return [];
      }
    }

    function saveNotes(notes) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }

        function renderNote(note) {
      const el = document.createElement('div');
      // 색종이 색: 저장된 값, 없으면(예전 메모) id로 고정
      const color = note.color || (Math.floor(note.id) % 2 ? 'blue' : 'orange');
      el.className = color === 'blue' ? 'guest-note note-blue' : 'guest-note';
      el.style.left = `${note.left}%`;
      el.style.top = `${note.top}px`;
      el.style.setProperty('--rot', `${note.rot}deg`);
      el.style.transform = `rotate(${note.rot}deg)`;

      const toEl = document.createElement('div');
      toEl.className = 'note-to';
      toEl.textContent = `To. ${note.to}`;

      const msgEl = document.createElement('div');
      msgEl.className = 'note-message';
      msgEl.textContent = note.message;

      const fromEl = document.createElement('div');
      fromEl.className = 'note-from';
      fromEl.textContent = `From. ${note.from}`;

      el.appendChild(toEl);
      el.appendChild(msgEl);
      el.appendChild(fromEl);
      board.appendChild(el);

      makeDraggable(el, note);
    }

    function makeDraggable(el, note) {
      let startX, startY, startLeftPx, startTopPx;
      let dragging = false;

      function onPointerDown(e) {
        dragging = true;
        el.classList.add('dragging');

        const boardRect = board.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        startLeftPx = (note.left / 100) * boardRect.width;
        startTopPx = note.top;

        el.setPointerCapture(e.pointerId);
      }

      function onPointerMove(e) {
        if (!dragging) return;

        const boardRect = board.getBoundingClientRect();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let newLeftPx = startLeftPx + dx;
        let newTopPx = startTopPx + dy;

        // 보드 밖으로 나가지 않게 제한
        newLeftPx = Math.max(0, Math.min(newLeftPx, boardRect.width - el.offsetWidth));
        newTopPx = Math.max(0, Math.min(newTopPx, boardRect.height - el.offsetHeight));

        note.left = (newLeftPx / boardRect.width) * 100;
        note.top = newTopPx;

        el.style.left = `${note.left}%`;
        el.style.top = `${note.top}px`;
      }

      function onPointerUp() {
        if (!dragging) return;
        dragging = false;
        el.classList.remove('dragging');

        // 위치 저장
        const notes = loadNotes();
        const target = notes.find((n) => n.id === note.id);
        if (target) {
          target.left = note.left;
          target.top = note.top;
          saveNotes(notes);
        }
        updateBoardHeight();
      }

      el.addEventListener('pointerdown', onPointerDown);
      el.addEventListener('pointermove', onPointerMove);
      el.addEventListener('pointerup', onPointerUp);
      el.addEventListener('pointercancel', onPointerUp);
    }

        function renderAllNotes() {
      board.innerHTML = '';
      loadNotes().forEach(renderNote);
      updateBoardHeight();
    }

        function addNote(to, from, message) {
      const notes = loadNotes();

      const newNote = {
        id: Date.now() + Math.random(),
        to,
        from,
        message,
        left: 5 + Math.random() * 80, // 5% ~ 85%
        top: 40 + Math.random() * (board.clientHeight - 200 || 400),
        rot: Math.floor(Math.random() * 17) - 8, // -8 ~ 8도
        color: Math.random() < 0.5 ? 'blue' : 'orange', // 파랑/주황 랜덤
      };

      notes.push(newNote);
      saveNotes(notes);
      renderNote(newNote);
      updateBoardHeight();
    }

    renderAllNotes();

    addBtn?.addEventListener('click', () => {
      guestModal?.classList.add('open');
    });

    guestModalClose?.addEventListener('click', () => {
      guestModal?.classList.remove('open');
    });

    guestModal?.addEventListener('click', (e) => {
      if (e.target === guestModal) {
        guestModal.classList.remove('open');
      }
    });

    guestSubmit?.addEventListener('click', () => {
      const to = guestTo.value.trim();
      const from = guestFrom.value.trim();
      const message = guestMessage.value.trim();

      if (!to || !from || !message) {
        alert('To, From, 메시지를 모두 입력해줘!');
        return;
      }

      addNote(to, from, message);

      guestTo.value = '';
      guestFrom.value = '';
      guestMessage.value = '';
      guestModal.classList.remove('open');
    });
  }

  

  /* =========================================
     6. PROJECT ACCORDION
  ========================================= */

  const projectItems = document.querySelectorAll('.project-item');
  const workGrids = document.querySelectorAll('.work-grid');

  projectItems.forEach((item) => {
    const btn = item.querySelector('.project-tab');

    btn.addEventListener('click', () => {
      const target = item.dataset.panel;

      projectItems.forEach((i) => i.classList.toggle('active', i === item));

      workGrids.forEach((grid) => {
        grid.classList.toggle('active', grid.dataset.panel === target);
      });
    });
  });

    /* =========================================
     7. MOBILE MENU TOGGLE
  ========================================= */

  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  menuToggle?.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    mainNav?.classList.toggle('open');
  });

  // 메뉴 안 링크 클릭하면 자동으로 닫히게
  mainNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle?.classList.remove('open');
      mainNav?.classList.remove('open');
    });
  });

  /* =========================================
     8. PAGE LOADER – 점 · 점선 · 점 (점선이 점→점으로 반복)
     다 불러오면 사라짐 (최소 한 바퀴는 보여줌)
  ========================================= */

  const pageLoader = document.getElementById('pageLoader');

  const markLoaded = () => document.body.classList.add('is-loaded');

  if (pageLoader) {
    const MIN_SHOW = 1000; // ms – 점선 한 바퀴
    const startedAt = performance.now();

    const hideLoader = () => {
      const wait = Math.max(0, MIN_SHOW - (performance.now() - startedAt));
      setTimeout(() => {
        pageLoader.classList.add('done');
        markLoaded();
      }, wait);
    };

    if (document.readyState === 'complete') hideLoader();
    else window.addEventListener('load', hideLoader);
  } else {
    markLoaded();
  }

  /* =========================================
     9. WORK DETAIL – 뒤로가기
     이전 페이지(프로젝트/디자이너 팝업)가 있으면 그리로, 없으면 프로젝트로
  ========================================= */

  const workBack = document.getElementById('workBack');

  workBack?.addEventListener('click', (e) => {
    if (document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1) {
      e.preventDefault();
      history.back();
    }
  });


  /* =========================================
     10. MAIN – 접을 수 있는 종이
     종이 아무 곳이나 잡고 끌면, 잡은 점이 마우스를 따라오도록
     (잡은 점 ↔ 마우스의 수직이등분선)을 따라 접힘. 놓으면 그대로 남고 계속 접을 수 있음.
     앞면 주황 / 뒷면 파랑
  ========================================= */

  const foldStage = document.getElementById('foldStage');
  const foldSvg = document.getElementById('foldSvg');

  if (foldStage && foldSvg) {
    const SVGNS = 'http://www.w3.org/2000/svg';
    const W = 1;
    const H = 1;                   // 정사각형
    const MAX_LAYERS = 256;

    const flatPaper = () => [{
      pts: [[-W / 2, -H / 2], [W / 2, -H / 2], [W / 2, H / 2], [-W / 2, H / 2]],
      back: false,
    }];

    let layers = flatPaper();       // 아래 → 위 순서
    let drag = null;                // { g: [x,y], m: [x,y] }

    const group = document.createElementNS(SVGNS, 'g');
    group.setAttribute('class', 'fold-paper-group');
    foldSvg.appendChild(group);

    /* --- 화면 크기에 맞춰 종이 배치 --- */
    const foldUi = foldStage.querySelector('.fold-ui');

    const foldHint = document.getElementById('foldHint');

    // 멘트 / 종이 / 버튼 묶음을 브라우저 화면 세로 가운데에
    function fitView() {
      const r = foldStage.getBoundingClientRect();
      const hintH = foldHint ? foldHint.offsetHeight : 0;
      const uiH = foldUi ? foldUi.offsetHeight : 0;
      const gap = 28;
      const k = Math.min(r.height * 0.55, r.width * 0.8); // 종이 한 변(px)
      const total = hintH + gap + k + gap + uiH;
      let top = (window.innerHeight / 2 - foldStage.offsetTop) - total / 2;
      top = Math.max(top, 24);                             // 상단바에 붙지 않게
      const centerY = top + hintH + gap + k / 2;
      const vw = r.width / k;
      const vh = r.height / k;
      foldSvg.setAttribute('viewBox', `${-vw / 2} ${-centerY / k} ${vw} ${vh}`);
      if (foldHint) foldHint.style.top = `${top}px`;
      if (foldUi) foldUi.style.top = `${centerY + k / 2 + gap}px`;
    }

    function toPaper(e) {
      const pt = foldSvg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const p = pt.matrixTransform(foldSvg.getScreenCTM().inverse());
      return [p.x, p.y];
    }

    /* --- 기하 도우미 --- */
    // 반평면 s(p) >= 0 쪽만 남기기 (볼록 다각형 자르기)
    function clip(pts, s) {
      const out = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % pts.length];
        const sa = s(a);
        const sb = s(b);
        if (sa >= 0) out.push(a);
        if ((sa >= 0) !== (sb >= 0)) {
          const t = sa / (sa - sb);
          out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
        }
      }
      return out;
    }

    function area(pts) {
      let a = 0;
      for (let i = 0; i < pts.length; i++) {
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[(i + 1) % pts.length];
        a += x1 * y2 - x2 * y1;
      }
      return Math.abs(a) / 2;
    }

    function inside(p, pts) {
      let c = false;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const [xi, yi] = pts[i];
        const [xj, yj] = pts[j];
        if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c;
      }
      return c;
    }

    // 잡은 점 g를 m으로 옮기는 접기 결과
    function foldLayers(src, g, m) {
      const dx = m[0] - g[0];
      const dy = m[1] - g[1];
      const len = Math.hypot(dx, dy);
      if (len < 0.004) return src;
      const n = [dx / len, dy / len];
      const mid = [(g[0] + m[0]) / 2, (g[1] + m[1]) / 2];
      const side = (p) => (p[0] - mid[0]) * n[0] + (p[1] - mid[1]) * n[1];
      const reflect = (p) => {
        const d = 2 * side(p);
        return [p[0] - d * n[0], p[1] - d * n[1]];
      };

      const stay = [];
      const moved = [];
      src.forEach((L) => {
        const keep = clip(L.pts, side);
        if (keep.length > 2 && area(keep) > 1e-6) stay.push({ pts: keep, back: L.back });
        const flap = clip(L.pts, (p) => -side(p));
        if (flap.length > 2 && area(flap) > 1e-6) moved.push({ pts: flap.map(reflect), back: !L.back });
      });
      // 접혀 넘어온 면은 위로, 순서는 뒤집혀서 쌓임
      return stay.concat(moved.reverse());
    }

    /* --- 그리기 --- */
    function render() {
      const list = drag ? foldLayers(layers, drag.g, drag.m) : layers;
      group.replaceChildren(...list.map((L) => {
        const poly = document.createElementNS(SVGNS, 'polygon');
        poly.setAttribute('class', `fold-layer ${L.back ? 'back' : 'front'}`);
        poly.setAttribute('points', L.pts.map((p) => p.join(',')).join(' '));
        return poly;
      }));
    }

    /* --- 입력 --- */
    foldSvg.addEventListener('pointerdown', (e) => {
      const p = toPaper(e);
      if (!layers.some((L) => inside(p, L.pts))) return; // 종이 위에서만
      drag = { g: p, m: p };
      foldSvg.setPointerCapture(e.pointerId);
      foldStage.classList.add('is-folding', 'is-touched');
    });

    foldSvg.addEventListener('pointermove', (e) => {
      const p = toPaper(e);
      // 종이 위에 있을 때 커서 파랑
      if (!drag) {
        tapeCursor?.classList.toggle('is-hovering', layers.some((L) => inside(p, L.pts)));
        return;
      }
      drag.m = p;
      render();
    });

    const history = [];               // 뒤로가기용 이전 모양들
    const foldUndo = document.getElementById('foldUndo');
    const syncUndo = () => {
      if (foldUndo) foldUndo.disabled = history.length === 0; // 완료 후에도 뒤로가기로 다시 접기 가능
    };

    const endDrag = () => {
      if (!drag) return;
      const next = foldLayers(layers, drag.g, drag.m);
      if (next.length <= MAX_LAYERS && next !== layers) {
        history.push(layers);
        layers = next;
        syncUndo();
      }
      drag = null;
      foldStage.classList.remove('is-folding');
      syncHint();
      render();
    };
    foldSvg.addEventListener('pointerup', endDrag);
    foldSvg.addEventListener('pointercancel', endDrag);

    const foldDone = document.getElementById('foldDone');

    // 멘트: 접기 시작하면 사라지고, 종이가 다시 평평해지면 다시 보임
    const syncHint = () => foldStage.classList.toggle('is-touched', layers.length > 1 || !!drag);

    const unlock = () => {
      foldStage.classList.remove('is-done');
      if (foldDone) foldDone.disabled = false;
    };

    // 다시 펴기: 처음 종이로 (뒤로가기로 되돌릴 수 있음)
    document.getElementById('foldReset')?.addEventListener('click', () => {
      if (layers.length > 1) history.push(layers);
      layers = flatPaper();
      unlock();
      syncUndo();
      syncHint();
      render();
    });

    // 뒤로가기: 한 번 접기 전으로 (완료 상태였으면 다시 접을 수 있게)
    foldUndo?.addEventListener('click', () => {
      if (!history.length) return;
      layers = history.pop();
      unlock();
      syncUndo();
      syncHint();
      render();
    });

    /* --- 완료 팝업 --- */
    const foldModal = document.getElementById('foldModal');
    const foldModalImg = document.getElementById('foldModalImg');
    const foldToast = document.getElementById('foldToast');
    let paperBlob = null;

    // 접은 종이만 투명 배경 PNG로 그리기
    function paperToCanvas(size = 1200, src = layers) {
      const pts = src.flatMap((L) => L.pts);
      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      const minY = Math.min(...ys), maxY = Math.max(...ys);
      const pad = 0.02;
      const w = maxX - minX + pad * 2;
      const h = maxY - minY + pad * 2;
      const scale = size / Math.max(w, h);

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      const ctx = canvas.getContext('2d');           // 배경을 칠하지 않으니 투명

      const css = getComputedStyle(document.documentElement);
      const front = css.getPropertyValue('--orange').trim() || '#ef7425';
      const back = css.getPropertyValue('--blue').trim() || '#4dc3f1';

      ctx.lineJoin = 'round';
      ctx.lineWidth = Math.max(1, size / 600);
      ctx.strokeStyle = 'rgba(65, 68, 69, 0.18)';
      src.forEach((L) => {
        ctx.beginPath();
        L.pts.forEach(([x, y], i) => {
          const px = (x - minX + pad) * scale;
          const py = (y - minY + pad) * scale;
          if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
        });
        ctx.closePath();
        ctx.fillStyle = L.back ? back : front;
        ctx.fill();
        ctx.stroke();
      });
      return canvas;
    }

    const toast = (msg) => {
      if (!foldToast) return;
      foldToast.textContent = msg;
      clearTimeout(toast.t);
      toast.t = setTimeout(() => { foldToast.textContent = ''; }, 2500);
    };

    /* --- 카드 --- */
    const foldCard = document.getElementById('foldCard');
    const cardWord = document.getElementById('cardWord');
    const cardName = document.getElementById('cardName');
    let paperCanvas = null;

    document.querySelectorAll('.fold-swatch').forEach((sw) => {
      sw.addEventListener('click', () => {
        document.querySelectorAll('.fold-swatch').forEach((s) => s.classList.toggle('is-active', s === sw));
        foldCard.dataset.bg = sw.dataset.bg;
      });
    });

    const CARD_COLORS = () => {
      const root = getComputedStyle(document.documentElement);
      const v = (n) => root.getPropertyValue(n).trim();
      return {
        orange: [v('--orange'), v('--black')],
        blue:   [v('--blue'), v('--black')],
        white:  [v('--bg'), v('--black')],
        black:  [v('--black'), v('--bg')],
      };
    };

    // 카드 PNG (1080 × 1440) – 미리보기와 같은 배치로 그림
    // data: { layers, word, name, bg }  (광장 카드에도 같이 씀)
    async function drawCard(data) {
      const W = 1080, H = 1440;
      const [bg, ink] = CARD_COLORS()[data.bg] || CARD_COLORS().blue;
      const word = (data.word || '').trim() || 'Dot';
      const name = (data.name || '').trim();
      const paper = paperToCanvas(1200, data.layers);

      await Promise.all([
        document.fonts.load('800 100px Paperlogy'),
        document.fonts.load('700 30px PyeojinGothic'),
      ]);

      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      // 살짝 둥근 모서리 (바깥은 투명)
      ctx.beginPath();
      ctx.roundRect(0, 0, W, H, W * (10 / 260));
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.fillStyle = ink;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 너무 긴 단어는 카드 폭에 맞춰 줄임
      const fitText = (text, size, family, maxW, weight = 800) => {
        let s = size;
        do { ctx.font = `${weight} ${s}px ${family}`; s -= 2; } while (ctx.measureText(text).width > maxW && s > 10);
      };

      const titleSize = W * 0.10;
      const titleTop = H * 0.065;
      fitText('Fold to', titleSize, 'Paperlogy', W * 0.86);
      ctx.fillText('Fold to', W / 2, titleTop + titleSize * 0.55);
      fitText(word, titleSize, 'Paperlogy', W * 0.86);
      ctx.fillText(word, W / 2, titleTop + titleSize * 1.65);

      // 접은 종이 (누끼) – 상자 안에 비율 유지해서 가운데
      const bx = W * 0.145, by = H * 0.265, bw = W * 0.71, bh = H * 0.47;
      const r = Math.min(bw / paper.width, bh / paper.height);
      const dw = paper.width * r, dh = paper.height * r;
      ctx.drawImage(paper, bx + (bw - dw) / 2, by + (bh - dh) / 2, dw, dh);

      if (name) {
        fitText(name, W * 0.075, 'Paperlogy', W * 0.8);
        ctx.fillText(name, W / 2, H * 0.785 + W * 0.075 * 0.6);
      }

      ctx.font = `700 ${W * 0.025}px PyeojinGothic`;
      ctx.fillText('덕성여자대학교 시각디자인전공 졸업전시 Fold to Dot', W / 2, H * 0.965 - W * 0.0125);
      return canvas;
    }

    const currentCard = () => ({
      layers,
      word: cardWord.value,
      name: cardName.value,
      bg: foldCard.dataset.bg,
    });
    const cardToCanvas = () => drawCard(currentCard());

    const canvasToBlob = (canvas) => new Promise((res) => canvas.toBlob(res, 'image/png'));

    const download = (url, name) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

    const SHARE_TEXT = 'Fold to Dot. 덕성여자대학교 시각디자인전공 제61회 졸업전시';

    async function shareImage(blob, fileName) {
      try {
        const file = blob && new File([blob], fileName, { type: 'image/png' });
        if (file && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Fold to Dot.', text: SHARE_TEXT });
          return;
        }
        if (navigator.share) {
          await navigator.share({ title: 'Fold to Dot.', text: SHARE_TEXT, url: location.href });
          return;
        }
        await navigator.clipboard.writeText(location.href);
        toast('사이트 링크를 복사했어요');
      } catch (err) {
        if (err?.name !== 'AbortError') toast('공유할 수 없어요. 저장하기로 이미지를 받아주세요');
      }
    }

    const openModal = () => {
      paperCanvas = paperToCanvas();
      foldModalImg.src = paperCanvas.toDataURL('image/png');
      paperBlob = null;
      paperCanvas.toBlob((b) => { paperBlob = b; }, 'image/png');
      if (plazaSend) { plazaSend.disabled = false; plazaSend.textContent = '광장에 보내기'; }
      foldModal.classList.add('open');
      foldModal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
      foldModal.classList.remove('open');
      foldModal.setAttribute('aria-hidden', 'true');
    };

    // 완료: 지금 모양으로 고정 + 팝업
    foldDone?.addEventListener('click', () => {
      foldStage.classList.add('is-done');
      foldDone.disabled = true;
      tapeCursor?.classList.remove('is-hovering');
      if (foldModal) openModal();
    });

    document.getElementById('foldModalClose')?.addEventListener('click', closeModal);
    foldModal?.addEventListener('click', (e) => { if (e.target === foldModal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closePlazaCard(); } });

    // 종이만: 투명 배경 PNG
    document.getElementById('foldSave')?.addEventListener('click', () => {
      download(foldModalImg.src, 'fold-to-dot-paper.png');
      toast('종이 이미지를 저장했어요');
    });

    // 카드
    document.getElementById('cardSave')?.addEventListener('click', async () => {
      const canvas = await cardToCanvas();
      download(canvas.toDataURL('image/png'), 'fold-to-dot-card.png');
      toast('카드를 저장했어요');
    });


    /* =========================================
       광장 – 사람들이 보낸 종이가 모이는 곳
       ※ 지금은 저장소가 '이 브라우저'라서 내가 보낸 것만 보임.
         모두가 함께 보려면 plazaStore의 list/add만 서버(Firebase 등)로 바꾸면 됨.
    ========================================= */
    const plazaStore = {
      KEY: 'foldPlaza',
      async list() {
        try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; }
      },
      async add(entry) {
        const all = await this.list();
        all.push(entry);
        try { localStorage.setItem(this.KEY, JSON.stringify(all)); } catch { /* 저장 공간 없음 */ }
        return entry;
      },
    };

    const plazaBoard = document.getElementById('plazaBoard');
    const plazaEmpty = document.getElementById('plazaEmpty');
    const plazaEl = document.getElementById('plaza');
    const plazaSend = document.getElementById('plazaSend');
    const plazaModal = document.getElementById('plazaModal');
    const plazaCardImg = document.getElementById('plazaCardImg');
    const stageSwitch = document.getElementById('stageSwitch');

    // 종이 모양을 작은 SVG로
    function paperSvg(src) {
      const pts = src.flatMap((L) => L.pts);
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      const minX = Math.min(...xs), minY = Math.min(...ys);
      const size = Math.max(Math.max(...xs) - minX, Math.max(...ys) - minY) || 1;
      const offX = (size - (Math.max(...xs) - minX)) / 2;
      const offY = (size - (Math.max(...ys) - minY)) / 2;
      const svg = document.createElementNS(SVGNS, 'svg');
      svg.setAttribute('viewBox', `${minX - offX} ${minY - offY} ${size} ${size}`);
      src.forEach((L) => {
        const poly = document.createElementNS(SVGNS, 'polygon');
        poly.setAttribute('class', L.back ? 'back' : 'front');
        poly.setAttribute('points', L.pts.map((p) => p.join(',')).join(' '));
        svg.appendChild(poly);
      });
      return svg;
    }

    async function renderPlaza(newId) {
      const all = await plazaStore.list();
      plazaBoard.replaceChildren(...all.map((entry) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'plaza-paper' + (entry.id === newId ? ' is-new' : '');
        btn.style.left = `${entry.x}%`;
        btn.style.top = `${entry.y}%`;
        btn.style.setProperty('--rot', `${entry.rot}deg`);
        btn.setAttribute('aria-label', `${entry.name || '누군가'}의 종이`);
        btn.appendChild(paperSvg(entry.layers));
        btn.addEventListener('click', () => openPlazaCard(entry));
        return btn;
      }));
      if (plazaEmpty) plazaEmpty.hidden = all.length > 0;
    }

    async function openPlazaCard(entry) {
      const canvas = await drawCard(entry);
      plazaCardImg.src = canvas.toDataURL('image/png');
      plazaModal.classList.add('open');
      plazaModal.setAttribute('aria-hidden', 'false');
    }

    function closePlazaCard() {
      plazaModal?.classList.remove('open');
      plazaModal?.setAttribute('aria-hidden', 'true');
    }
    document.getElementById('plazaModalClose')?.addEventListener('click', closePlazaCard);
    plazaModal?.addEventListener('click', (e) => { if (e.target === plazaModal) closePlazaCard(); });

    // 종이접기 ↔ 광장 화면 전환 (페이지 이동 없이)
    function showPlaza(on, newId) {
      foldStage.classList.toggle('is-plaza', on);
      plazaEl?.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (stageSwitch) stageSwitch.querySelector('span').textContent = on ? '종이 접으러 가기' : '광장 보기';
      tapeCursor?.classList.remove('is-hovering');
      if (on) renderPlaza(newId);
    }
    stageSwitch?.addEventListener('click', () => showPlaza(!foldStage.classList.contains('is-plaza')));

    // 광장 제목: Fold to ___ 단어가 번갈아 바뀜
    const plazaWord = document.getElementById('plazaWord');
    const PLAZA_WORDS = ['2027', '졸업', '시작', '내일', 'Design'];
    if (plazaWord) {
      let wi = 0;
      setInterval(() => {
        if (!foldStage.classList.contains('is-plaza')) return;
        plazaWord.classList.add('is-out');
        setTimeout(() => {
          wi = (wi + 1) % PLAZA_WORDS.length;
          plazaWord.textContent = PLAZA_WORDS[wi];
          plazaWord.classList.remove('is-out');
          plazaWord.classList.add('is-in');
          requestAnimationFrame(() => requestAnimationFrame(() => plazaWord.classList.remove('is-in')));
        }, 350);
      }, 2200);
    }

    // 완료 팝업 → 광장에 보내기
    const round3 = (n) => Math.round(n * 1000) / 1000;
    plazaSend?.addEventListener('click', async () => {
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        layers: layers.map((L) => ({ back: L.back, pts: L.pts.map(([x, y]) => [round3(x), round3(y)]) })),
        word: cardWord.value.trim(),
        name: cardName.value.trim(),
        bg: foldCard.dataset.bg,
        x: 6 + Math.random() * 88,
        y: 8 + Math.random() * 84,
        rot: Math.round(Math.random() * 24 - 12),
        createdAt: Date.now(),
      };
      await plazaStore.add(entry);
      plazaSend.disabled = true;
      plazaSend.textContent = '광장에 보냈어요';
      closeModal();
      showPlaza(true, entry.id);
    });

    fitView();
    render();
    window.addEventListener('resize', fitView);
  }


  /* =========================================
     11. ABOUT – 스크롤하면 포스터 왼쪽으로, 설명 등장
  ========================================= */

  const aboutHero = document.getElementById('aboutHero');
  const aboutPoster = document.getElementById('aboutPoster');
  const aboutIntro = document.getElementById('aboutIntro');

  if (aboutHero && aboutPoster && aboutIntro) {
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    const clamp01 = (x) => Math.min(1, Math.max(0, x));
    let revealed = false;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      aboutIntro.classList.add('in-view');
      const count = aboutIntro.querySelectorAll('.word').length;
      setTimeout(() => aboutIntro.classList.add('settled'), count * 60 + 800);
    };

    const update = () => {
      if (window.innerWidth <= 960) {           // 좁은 화면: 그냥 보이면 등장
        const r = aboutIntro.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.85) reveal();
        return;
      }
      const vw = window.innerWidth;
      const gap = 64;
      const posterW = aboutPoster.offsetWidth;
      const introW = Math.min(560, vw - posterW - gap - 120);
      const groupLeft = (vw - (posterW + gap + introW)) / 2;
      const shiftMax = groupLeft - (vw - posterW) / 2;   // 가운데 → 왼쪽까지 거리 (음수)

      // 고정 구간 안에서 얼마나 스크롤했는지 0 ~ 1
      const total = aboutHero.offsetHeight - window.innerHeight;
      const p = clamp01(-aboutHero.getBoundingClientRect().top / (total * 0.75));
      const move = ease(clamp01(p / 0.6));               // 앞 60% 동안 포스터 이동
      const show = ease(clamp01((p - 0.35) / 0.45));     // 이어서 설명 등장

      aboutPoster.style.setProperty('--poster-x', `${shiftMax * move}px`);
      aboutIntro.style.setProperty('--intro-left', `${groupLeft + posterW + gap}px`);
      aboutIntro.style.setProperty('--intro-w', `${introW}px`);
      aboutIntro.style.setProperty('--intro-o', show);
      aboutIntro.style.setProperty('--intro-shift', `${30 * (1 - show)}px`);
      aboutIntro.style.setProperty('--intro-pe', show > 0.5 ? 'auto' : 'none');
      if (show > 0.3) reveal();
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }
