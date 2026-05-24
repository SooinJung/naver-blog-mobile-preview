const DEVICES = [
  { name: 'iPhone 16',          width: 393 },
  { name: 'iPhone 16 Plus',     width: 430 },
  { name: 'iPhone 16 Pro',      width: 393 },
  { name: 'iPhone 16 Pro Max',  width: 440 },
  { name: 'iPhone 15 Pro Max',  width: 430 },
  { name: 'iPhone 15 / 14 Pro', width: 393 },
  { name: 'iPhone SE',          width: 375 },
  { name: 'Galaxy S24',         width: 360 },
  { name: 'Galaxy S24+',        width: 412 },
  { name: 'Pixel 8',            width: 412 },
];

function createPanel() {
  const savedWidth  = localStorage.getItem('mobilePreviewWidth')  || '393';
  const savedDevice = localStorage.getItem('mobilePreviewDevice') || 'iPhone 16';

  const deviceOptions = DEVICES.map(d =>
    `<option value="${d.width}" ${d.name === savedDevice ? 'selected' : ''}>${d.name}</option>`
  ).join('');

  // 블로그 정보 동적으로 가져오기 (getBlogInfo는 아직 getIframeDoc 전에 호출되므로 기본값만)
  const today = new Date();
  const dateStr = `${today.getFullYear()}. ${today.getMonth()+1}. ${today.getDate()}.`;
  const yearStr = String(today.getFullYear());
  // 블로그 이름은 document.title에서 바로 뽑을 수 있음
  let blogName = '내 블로그';
  const titleMatch = document.title.match(/^(.+?)\s*[:：]\s*네이버 블로그/);
  if (titleMatch) blogName = titleMatch[1].trim();

  const panel = document.createElement('div');
  panel.id = 'mobile-preview-panel';
  panel.style.width = savedWidth + 'px';
  panel.innerHTML = `
    <!-- 컨트롤 바 -->
    <div id="mobile-preview-header">
      <span id="mobile-preview-title">📱 미리보기</span>
      <select id="mobile-preview-device">${deviceOptions}</select>
      <button id="mobile-preview-close">✕</button>
    </div>

    <!-- 폰 화면 -->
    <div id="phone-screen">

      <!-- 상태바 -->
      <div class="phone-status-bar">
        <span id="phone-clock"></span>
        <div class="phone-status-right">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
            <rect x="0"  y="4" width="3" height="8" rx="0.5"/>
            <rect x="4"  y="2.5" width="3" height="9.5" rx="0.5"/>
            <rect x="8"  y="1" width="3" height="11" rx="0.5"/>
            <rect x="12" y="0" width="3" height="12" rx="0.5"/>
          </svg>
          <span class="phone-network">5G</span>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" stroke-opacity="0.35"/>
            <rect x="2" y="2" width="16" height="8" rx="2" fill="white"/>
            <path d="M23 4v4a2 2 0 000-4z" fill="white" fill-opacity="0.4"/>
          </svg>
        </div>
      </div>

      <!-- 네이버 블로그 앱 헤더 -->
      <div class="naver-blog-appbar">
        <span class="appbar-blog-logo">blog</span>
        <div class="appbar-right">
          <span class="appbar-blog-name">${blogName}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </div>
      </div>

      <!-- 본문 스크롤 영역 -->
      <div id="mobile-preview-body">
        <div class="post-year">${yearStr}</div>
        <div class="post-title" id="preview-post-title">제목을 입력하세요</div>
        <div class="post-author-row">
          <div class="author-avatar">✦</div>
          <div class="author-info">
            <span class="author-name" id="preview-author-name">${blogName}</span>
            <span class="author-date">${dateStr}</span>
          </div>
          <button class="follow-btn">이웃추가</button>
        </div>
        <div id="preview-content">글을 쓰기 시작하면 여기에 미리보기가 나타나요!</div>
      </div>

      <!-- 좋아요·댓글·공유 -->
      <div class="post-action-bar">
        <span class="action-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>6</span>
        </span>
        <span class="action-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>1</span>
        </span>
        <span class="action-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </span>
      </div>

      <!-- 앱 하단 탭바 -->
      <div class="app-nav-bar">
        <span class="nav-naver">N</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.08-4"/></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  // 플로팅 재열기 버튼
  const toggle = document.createElement('button');
  toggle.id = 'mobile-preview-toggle';
  toggle.innerHTML = '📱';
  document.body.appendChild(toggle);

  document.getElementById('mobile-preview-close').addEventListener('click', () => {
    panel.style.display = 'none';
    toggle.style.display = 'flex';
  });
  toggle.addEventListener('click', () => {
    panel.style.display = 'flex';
    toggle.style.display = 'none';
  });
  document.getElementById('mobile-preview-device').addEventListener('change', (e) => {
    const selected = DEVICES.find(d => d.width === parseInt(e.target.value));
    panel.style.width = e.target.value + 'px';
    localStorage.setItem('mobilePreviewWidth', e.target.value);
    if (selected) localStorage.setItem('mobilePreviewDevice', selected.name);
  });

  // 시계
  function updateClock() {
    const el = document.getElementById('phone-clock');
    if (!el) return;
    const now = new Date();
    el.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
  }
  updateClock();
  setInterval(updateClock, 10000);

  return panel;
}

// 블로그 정보 동적 추출
function getBlogInfo() {
  // 1) 블로그 이름: document.title = "사월寫 : 네이버 블로그" 형식
  let blogName = '내 블로그';
  const titleMatch = document.title.match(/^(.+?)\s*[:：]\s*네이버 블로그/);
  if (titleMatch) blogName = titleMatch[1].trim();

  // 2) 블로그 ID: URL에서 추출
  let blogId = '';
  const urlMatch = window.location.href.match(/blog\.naver\.com\/([^/?&#]+)/);
  if (urlMatch) blogId = urlMatch[1];

  // 3) 작성자 닉네임: DOM 탐색 (여러 셀렉터 시도)
  const nickSelectors = [
    '.nick', '.nickname', '.author_name', '.blogger_name',
    '.gnb_name', '.blog_author', '.writer', '.pcm_write_author'
  ];
  let authorName = blogId || blogName;
  for (const sel of nickSelectors) {
    const el = document.querySelector(sel)
      || getIframeDoc()?.querySelector(sel);
    if (el && el.innerText.trim()) {
      authorName = el.innerText.trim();
      break;
    }
  }

  // 4) 날짜: 오늘
  const now = new Date();
  const dateStr = `${now.getFullYear()}. ${now.getMonth()+1}. ${now.getDate()}.`;
  const yearStr = String(now.getFullYear());

  return { blogName, blogId, authorName, dateStr, yearStr };
}

function debounce(fn, delay) {
  let timer = null;
  return function () { clearTimeout(timer); timer = setTimeout(fn, delay); };
}

function getIframeDoc() {
  for (const iframe of document.querySelectorAll('iframe')) {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (doc && doc.body) return doc;
    } catch (e) {}
  }
  return null;
}

// 제목 요소 캐시 (body 추출 시 제외하기 위해)
let titleComponent = null;

function getTitle() {
  const doc = getIframeDoc();

  // 1) iframe 안에서 제목 input/div 탐색
  if (doc) {
    const selectors = [
      'input[name="title"]', '#title', '#post_title',
      'input[placeholder*="제목"]', 'textarea[name="title"]',
      '.se-title', '.se-title-text', '.pcm_write_title',
      '[data-se-type="title"]', '[data-type="title"]',
    ];
    for (const sel of selectors) {
      const el = doc.querySelector(sel);
      if (el) {
        const val = (el.value || el.innerText || '').trim();
        if (val) {
          titleComponent = el.closest('.se-component') || el;
          return val;
        }
      }
    }

    // 2) iframe 안 contenteditable 중 한 줄짜리 = 제목 가능성
    for (const ce of doc.querySelectorAll('[contenteditable="true"]')) {
      const text = ce.innerText.trim();
      const lines = text.split('\n').filter(l => l.trim());
      if (text && lines.length === 1 && text.length < 100) {
        titleComponent = ce.closest('.se-component') || ce;
        return text;
      }
    }
  }

  // 3) 메인 DOM fallback
  for (const ce of document.querySelectorAll('[contenteditable="true"]')) {
    const text = ce.innerText.trim();
    if (text) return text;
  }

  return '';
}

const PLACEHOLDERS = ['사진 설명을 입력하세요', '글을 입력하세요', '내용을 입력하세요'];
function isPlaceholder(text) {
  return PLACEHOLDERS.some(p => text.trim().includes(p));
}
function validImgs(comp) {
  return Array.from(comp.querySelectorAll('img')).filter(img =>
    img.src && !img.src.startsWith('data:') && img.src !== window.location.href
  ).map(img => ({
    src: img.src,
    // SmartEditor ONE이 data-width/data-height에 원본 비율 정보를 저장함
    w: parseInt(img.getAttribute('data-width')  || 0),
    h: parseInt(img.getAttribute('data-height') || 0),
  }));
}

// ── 이미지 블록 빌더 ──
// 실제 네이버 앱과 동일한 방식:
//   - 뷰어 HEIGHT 고정 (VIEWER_H) → item 너비가 비율에 따라 달라짐
//   - 가로(landscape) 이미지: item 너비 ≈ 뷰어 너비 → 1장씩 보임
//   - 세로(portrait)  이미지: item 너비가 좁아져 → 여러 장 동시에 보임
//   - 모든 item 합계 너비 ≤ 뷰어 너비 → 스크롤 불필요 → 진행 바 숨김
const VIEWER_H = 294; // iPhone 16 기준 가로 이미지 뷰어 높이 (393 × 3/4)

function buildImageBlock(imgs) {
  const n = imgs.length;
  if (n === 0) return '';

  if (n === 1) {
    // 1장: full-bleed, 원본 비율 유지 (aspect-ratio로 로드 전 공간 확보)
    const { src, w, h } = imgs[0];
    const ratioStyle = (w && h) ? ` style="aspect-ratio:${w}/${h}"` : '';
    return `<img src="${src}" class="preview-single-img"${ratioStyle}>`;
  }

  // 2장+: 실제 네이버 앱 방식
  const id = 'gal-' + Math.random().toString(36).slice(2, 6);
  const initPct = Math.round(100 / n);

  // 각 이미지의 item 너비 = VIEWER_H × (원본비율)
  // 비율 데이터 없으면 정사각 fallback
  const itemWidths = imgs.map(({ w, h }) =>
    (w && h) ? Math.round(VIEWER_H * w / h) : VIEWER_H
  );

  return `<div class="preview-carousel" id="${id}" data-index="0" data-count="${n}" data-widths="${itemWidths.join(',')}">
    <div class="preview-carousel-viewport" style="height:${VIEWER_H}px">
      <div class="preview-carousel-track">
        ${imgs.map((img, i) =>
          `<div class="preview-carousel-item" style="width:${itemWidths[i]}px">` +
          `<img src="${img.src}" class="preview-carousel-img"></div>`
        ).join('')}
      </div>
      <button class="preview-carousel-btn preview-carousel-prev">&#8249;</button>
      <button class="preview-carousel-btn preview-carousel-next">&#8250;</button>
    </div>
    <div class="preview-slider-bar" data-slider="${id}" data-count="${n}">
      <div class="preview-slider-bar-fill" style="width:${initPct}%"></div>
    </div>
  </div>`;
}

function getBodyHTML() {
  const doc = getIframeDoc() || document;
  let html = '';
  const components = doc.querySelectorAll('.se-component');

  if (components.length > 0) {
    components.forEach(comp => {
      // 제목 컴포넌트는 body에서 제외
      if (titleComponent && (comp === titleComponent || comp.contains(titleComponent) || titleComponent.contains(comp))) return;

      const imgs = validImgs(comp);
      if (imgs.length > 0) {
        html += buildImageBlock(imgs);
      }
      comp.querySelectorAll('.se-text-paragraph').forEach(p => {
        const text = p.innerText.trim();
        if (isPlaceholder(text)) return;
        html += text === '' ? `<p class="preview-blank">&nbsp;</p>` : `<p>${p.innerHTML}</p>`;
      });
    });
  }
  if (!html) {
    doc.querySelectorAll('.se-text-paragraph').forEach(p => {
      const text = p.innerText.trim();
      if (isPlaceholder(text)) return;
      html += text === '' ? `<p class="preview-blank">&nbsp;</p>` : `<p>${p.innerHTML}</p>`;
    });
  }
  return html || null;
}

function updatePreview() {
  // 제목 업데이트 (iframe 준비 후 추출)
  const titleEl = document.getElementById('preview-post-title');
  if (titleEl) {
    const title = getTitle();
    if (title) {
      titleEl.textContent = title;
      titleEl.style.color = '#111';
    } else {
      titleEl.textContent = '제목을 입력하세요';
      titleEl.style.color = '#bbb';
    }
  }
  // 본문 업데이트
  const contentEl = document.getElementById('preview-content');
  if (!contentEl) return;
  const html = getBodyHTML();
  if (html) { contentEl.innerHTML = html; initCarousels(); }
}

const debouncedUpdate = debounce(updatePreview, 300);

function initCarousels() {
  document.querySelectorAll('#preview-content .preview-carousel').forEach(carousel => {
    const viewport = carousel.querySelector('.preview-carousel-viewport');
    const track    = carousel.querySelector('.preview-carousel-track');
    const bar      = carousel.querySelector('.preview-slider-bar');
    const prevBtn  = carousel.querySelector('.preview-carousel-prev');
    const nextBtn  = carousel.querySelector('.preview-carousel-next');
    const fill     = carousel.querySelector('.preview-slider-bar-fill');
    const n        = parseInt(carousel.dataset.count);
    const widths   = (carousel.dataset.widths || '').split(',').map(Number);

    // 총 item 너비 합계 vs 뷰어 너비 비교
    const totalWidth    = widths.reduce((a, b) => a + b, 0);
    const viewportWidth = viewport.offsetWidth || viewport.clientWidth || 360;

    // 모든 이미지가 뷰어에 한 번에 다 들어오면 → 화살표/진행 바 숨기기
    // (실제 네이버 앱과 동일: se-imageGroup-progress display:none)
    if (totalWidth <= viewportWidth) {
      if (bar)     bar.style.display     = 'none';
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }

    // 현재 인덱스로 이동 (픽셀 기반 translateX — 실제 앱과 동일한 방식)
    function goTo(index) {
      carousel.dataset.index = index;
      // offset = 이전 item들의 너비 합산 (픽셀)
      const offset = widths.slice(0, index).reduce((a, b) => a + b, 0);
      track.style.transform = `translateX(-${offset}px)`;
      // thumb: 너비(1/n) 고정, left 위치만 이동
      if (fill) fill.style.left = `${(index / n * 100).toFixed(1)}%`;
    }

    prevBtn.addEventListener('click', () => {
      const idx = parseInt(carousel.dataset.index);
      if (idx > 0) goTo(idx - 1);
    });

    nextBtn.addEventListener('click', () => {
      const idx = parseInt(carousel.dataset.index);
      if (idx < n - 1) goTo(idx + 1);
    });
  });
}

function observeIframe() {
  const doc = getIframeDoc();
  if (!doc) return;
  new MutationObserver(debouncedUpdate).observe(doc.body, { childList:true, subtree:true, characterData:true });
}

function init() {
  const href = window.location.href.toLowerCase();
  const isEditorPage = href.includes('postwrite') || href.includes('write') || document.querySelector('.se-main-container');
  if (!isEditorPage) return;

  const panel = createPanel();
  const observer = new MutationObserver((mutations) => {
    if (mutations.every(m => panel.contains(m.target))) return;
    debouncedUpdate();
  });
  observer.observe(document.body, { childList:true, subtree:true, characterData:true });

  setTimeout(() => {
    observeIframe();
    updatePreview();
    // iframe 로딩 후 작성자 정보 정밀 업데이트
    const info = getBlogInfo();
    const authorEl = document.getElementById('preview-author-name');
    if (authorEl) authorEl.textContent = info.authorName;
    const appbarName = document.querySelector('.appbar-blog-name');
    if (appbarName) appbarName.textContent = info.blogName;
  }, 1500);
  setTimeout(() => { observeIframe(); updatePreview(); }, 4000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  setTimeout(init, 2000);
}
