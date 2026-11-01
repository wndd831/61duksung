
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
      el.className = 'guest-note';
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
     8. PAGE LOADER
     페이지 다 불러오면 사라짐 (최소 한 바퀴는 보여줌)
  ========================================= */

  const pageLoader = document.getElementById('pageLoader');

  if (pageLoader) {
    const MIN_SHOW = 1200; // ms, 한 바퀴
    const startedAt = performance.now();

    const hideLoader = () => {
      const wait = Math.max(0, MIN_SHOW - (performance.now() - startedAt));
      setTimeout(() => pageLoader.classList.add('done'), wait);
    };

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
    }
  }
