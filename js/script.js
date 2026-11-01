
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

  if (scrollIntroInner) {

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

    function fitView() {
      const r = foldStage.getBoundingClientRect();
      const uiH = foldUi ? foldUi.offsetHeight : 0;
      const gap = 28;                                   // 종이 ↔ 안내 문구 간격
      const k = Math.min(r.height * 0.6, r.width * 0.8); // 종이 한 변(px)
      // 종이 + 안내 문구 묶음을 '브라우저 화면 전체' 세로 가운데에 (상단바 포함 기준)
      let centerY = (window.innerHeight / 2 - foldStage.offsetTop) - (gap + uiH) / 2;
      centerY = Math.max(centerY, k / 2 + 24); // 상단바에 붙지 않게 최소 여백
      const vw = r.width / k;
      const vh = r.height / k;
      foldSvg.setAttribute('viewBox', `${-vw / 2} ${-centerY / k} ${vw} ${vh}`);
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
      foldStage.classList.add('is-folding');
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

    const endDrag = () => {
      if (!drag) return;
      const next = foldLayers(layers, drag.g, drag.m);
      if (next.length <= MAX_LAYERS) layers = next;
      drag = null;
      foldStage.classList.remove('is-folding');
      render();
    };
    foldSvg.addEventListener('pointerup', endDrag);
    foldSvg.addEventListener('pointercancel', endDrag);

    const foldHint = document.getElementById('foldHint');
    const foldDone = document.getElementById('foldDone');
    const HINT_IDLE = '종이를 접어, 나만의 다음 점을 만들어보세요';
    const HINT_DONE = '하나의 형태로 접혔어요. 이제, 다음 점으로.';

    const setHint = (text) => {
      if (!foldHint || foldHint.textContent === text) return;
      foldHint.style.opacity = 0;
      setTimeout(() => { foldHint.textContent = text; foldHint.style.opacity = 1; }, 300);
    };

    // 다시 펴기: 처음 종이로, 다시 접을 수 있게
    document.getElementById('foldReset')?.addEventListener('click', () => {
      layers = flatPaper();
      foldStage.classList.remove('is-done');
      if (foldDone) foldDone.disabled = false;
      setHint(HINT_IDLE);
      render();
    });

    // 완료: 지금 모양으로 고정
    foldDone?.addEventListener('click', () => {
      foldStage.classList.add('is-done');
      foldDone.disabled = true;
      tapeCursor?.classList.remove('is-hovering');
      setHint(HINT_DONE);
    });

    fitView();
    render();
    window.addEventListener('resize', fitView);
  }
