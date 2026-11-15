// 개발용 로그: 콘솔에서 localStorage.mobilePreviewDebug = '1' 로 켜고 새로고침
let DEBUG = false;
try { DEBUG = localStorage.getItem('mobilePreviewDebug') === '1'; } catch (e) {}
function dlog(...args) { if (DEBUG) console.log('[미리보기]', ...args); }

// width·height = 기기 화면 전체의 CSS 픽셀 크기 (상태바·하단바 포함)
// statusBar   = 시간·배터리 줄 높이. 미리보기는 이 줄을 그리지 않으므로 화면 높이에서 뺀다
//               (본문이 보이는 양은 실제 폰과 같게 유지). 54 = iPhone 16 실측, 나머지는 근사값.
const DEVICES = [
  { name: 'iPhone 16',          width: 393, height: 852, statusBar: 54 },
  { name: 'iPhone 16 Plus',     width: 430, height: 932, statusBar: 54 },
  { name: 'iPhone 16 Pro',      width: 402, height: 874, statusBar: 54 },
  { name: 'iPhone 16 Pro Max',  width: 440, height: 956, statusBar: 54 },
  { name: 'iPhone 15 Pro Max',  width: 430, height: 932, statusBar: 54 },
  { name: 'iPhone 15 / 14 Pro', width: 393, height: 852, statusBar: 54 },
  { name: 'iPhone SE',          width: 375, height: 667, statusBar: 20 },
  { name: 'Galaxy S24',         width: 360, height: 780, statusBar: 24 },
  { name: 'Galaxy S24+',        width: 384, height: 832, statusBar: 24 },
  { name: 'Pixel 8',            width: 412, height: 915, statusBar: 24 },
];

function getSavedDevice() {
  const name = localStorage.getItem('mobilePreviewDevice');
  return DEVICES.find(d => d.name === name) || DEVICES[0];
}

// 패널을 기기 화면 크기(폭·높이)에 맞춘다.
// 브라우저 창이 기기보다 낮으면 레이아웃(줄바꿈 등)은 그대로 두고 통째로 축소해서 보여준다.
function applyDevice(panel, device) {
  panel.style.width = device.width + 'px';
  panel.querySelector('#phone-screen').style.height = (device.height - device.statusBar) + 'px';
  if (panel.style.display === 'none') return;   // 닫힌 상태에선 크기 측정 불가 → 열 때 다시 호출
  const avail = window.innerHeight - panel.offsetTop - 20;
  const scale = Math.min(1, avail / panel.offsetHeight);   // offsetHeight 는 transform 영향 없음
  panel.style.transform = scale < 1 ? `scale(${scale})` : '';
}

function createPanel() {
  // option value 는 기기 이름 (폭이 같은 기기가 여럿이라 폭으로는 구분 불가)
  let device = getSavedDevice();
  const deviceOptions = DEVICES.map(d =>
    `<option value="${d.name}" ${d === device ? 'selected' : ''}>${d.name}</option>`
  ).join('');
  const adOptions = AD_MODES.map(m =>
    `<option value="${m.value}" ${m.value === adModeSetting ? 'selected' : ''}>${m.label}</option>`
  ).join('');

  // 블로그 정보 동적으로 가져오기 (getBlogInfo는 아직 getIframeDoc 전에 호출되므로 기본값만)
  const today = new Date();
  const dateStr = `${today.getFullYear()}. ${today.getMonth()+1}. ${today.getDate()}.`;
  const yearStr = String(today.getFullYear());
  // 블로그 이름은 document.title에서 바로 뽑을 수 있음
  // 못 찾으면 비워 두고 fetchBlogUserInfo 결과로 채움 (엉뚱한 '내 블로그' 표시 방지)
  let blogName = '';
  const titleMatch = document.title.match(/^(.+?)\s*[:：]\s*네이버 블로그/);
  if (titleMatch) blogName = escHtml(titleMatch[1].trim());

  const panel = document.createElement('div');
  panel.id = 'mobile-preview-panel';
  panel.innerHTML = `
    <!-- 컨트롤 바 -->
    <div id="mobile-preview-header">
      <span id="mobile-preview-title">모리뷰</span>
      <select id="mobile-preview-device">${deviceOptions}</select>
      <select id="mobile-preview-ad" title="본문 광고 자리 (네이버 애드포스트)">${adOptions}</select>
      <button id="preview-scan-btn" title="전체 이미지 재스캔">⟳</button>
      <button id="mobile-preview-close">✕</button>
    </div>

    <!-- 폰 화면 -->
    <div id="phone-screen">

      <!-- 네이버 앱 인앱 브라우저 주소줄 -->
      <div class="phone-url-bar">
        <span>blog.naver.com</span>
        <svg class="phone-url-close" width="9" height="9" viewBox="0 0 9 9" stroke="#222" stroke-width="1.2"><path d="M.5.5l8 8M8.5.5l-8 8"/></svg>
      </div>

      <!-- 네이버 블로그 모바일 헤더 (로고 · 가운데 목록+블로그명 · 우측 아이콘) -->
      <div class="naver-blog-appbar">
        <span class="appbar-blog-logo">blog</span>
        <div class="appbar-center">
          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" stroke="#111" stroke-width="1.6">
            <rect x="1" y="1" width="17" height="17" rx="3"/>
            <path d="M5 6h1M5 9.5h1M5 13h1M8 6h6M8 9.5h6M8 13h6" stroke-linecap="round"/>
          </svg>
          <span class="appbar-blog-name">${blogName}</span>
        </div>
        <div class="appbar-right">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round">
            <path d="M9 3H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-5"/>
            <circle cx="15" cy="6.5" r="4.5"/><path d="M18.3 9.8l2.7 2.7"/>
          </svg>
          <svg width="18" height="16" viewBox="0 0 18 16" stroke="#111" stroke-width="1.7" stroke-linecap="round">
            <path d="M1 1.5h16M1 8h16M1 14.5h16"/>
          </svg>
        </div>
      </div>

      <!-- 본문 스크롤 영역 (제목·작성자·본문 전부 iframe 안에서 네이버 CSS로 렌더) -->
      <div id="mobile-preview-body">
        <iframe id="preview-frame" scrolling="no" title="미리보기" sandbox="allow-same-origin" allow="autoplay"></iframe>
      </div>

      <!-- 공감·댓글·공유 (실측 51px) -->
      <div class="post-action-bar">
        <!-- 하트: 양쪽 둥근 윗부분이 viewBox(0~22) 안에 들어오게 그린 경로 (예전 경로는 호가 y<0 으로 넘쳐 위가 잘림) -->
        <svg width="26" height="22" viewBox="0 0 26 22" fill="none" stroke="#222" stroke-width="1.7" stroke-linejoin="round">
          <path d="M13 20.6C13 20.6 1.5 13.8 1.5 7.3C1.5 4 4 1.5 7.2 1.5C9.6 1.5 11.9 2.9 13 5C14.1 2.9 16.4 1.5 18.8 1.5C22 1.5 24.5 4 24.5 7.3C24.5 13.8 13 20.6 13 20.6Z"/>
        </svg>
        <span class="action-like">
          <svg width="15" height="13" viewBox="0 0 26 22" fill="#f25a7c"><path d="M13 20.6C13 20.6 1.5 13.8 1.5 7.3C1.5 4 4 1.5 7.2 1.5C9.6 1.5 11.9 2.9 13 5C14.1 2.9 16.4 1.5 18.8 1.5C22 1.5 24.5 4 24.5 7.3C24.5 13.8 13 20.6 13 20.6Z"/></svg>
          <span>10</span>
        </span>
        <svg class="action-comment" width="23" height="23" viewBox="0 0 23 23" fill="none" stroke="#222" stroke-width="1.7">
          <path d="M11.5 1.5a10 10 0 0 1 0 20 10 10 0 0 1-4.6-1.1L1.8 21.5l1.2-4.9A10 10 0 0 1 11.5 1.5z" stroke-linejoin="round"/>
          <circle cx="7" cy="11.5" r="1.1" fill="#222" stroke="none"/><circle cx="11.5" cy="11.5" r="1.1" fill="#222" stroke="none"/><circle cx="16" cy="11.5" r="1.1" fill="#222" stroke="none"/>
        </svg>
        <svg class="action-send" width="23" height="22" viewBox="0 0 23 22" fill="none" stroke="#222" stroke-width="1.7" stroke-linejoin="round">
          <path d="M22 1L1 8.5l9 3.5 3.5 9z M22 1L10 12"/>
        </svg>
      </div>

      <!-- 네이버 앱 하단 탭바 (실측 82px: 아이콘 20px + 홈 인디케이터 여백) -->
      <div class="app-nav-bar">
        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" stroke="#111" stroke-width="1.9">
          <rect x="1" y="1" width="21" height="21" rx="5"/><path d="M7.5 16.5v-10l8 10v-10" stroke-linejoin="round"/>
        </svg>
        <svg width="12" height="19" viewBox="0 0 12 19" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 1.5l-9 8 9 8"/></svg>
        <svg width="12" height="19" viewBox="0 0 12 19" fill="none" stroke="#c4c4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 1.5l9 8-9 8"/></svg>
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="9" r="7.8"/><path d="M15 15l5 5"/></svg>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.5 10a8.5 8.5 0 1 1-2.5-6"/><path d="M17 1v4.5h-4.5"/></svg>
        <svg width="22" height="14" viewBox="0 0 22 14" stroke="#111" stroke-width="2" stroke-linecap="round"><path d="M1 1h20M1 7h20M1 13h20"/></svg>
      </div>
    </div>
  `;
  document.body.appendChild(panel);
  applyDevice(panel, device);
  window.addEventListener('resize', () => applyDevice(panel, device));

  // 플로팅 재열기 버튼 (패널을 닫으면 나타남)
  //  - 끌어서 옮길 수 있고, 놓은 자리에 그대로 머문다. 위치는 창 크기 대비 비율로 저장.
  //  - 기본 위치는 오른쪽 아래 (위쪽은 네이버 에디터 툴바를 가림)
  const toggle = document.createElement('button');
  toggle.id = 'mobile-preview-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', '모바일 미리보기 열기');
  toggle.innerHTML = '<svg viewBox="0 0 38 68" width="38" height="68"><defs><clipPath id="pvBtnClip"><rect x="4" y="8" width="30" height="52" rx="4"/></clipPath></defs><rect width="38" height="68" rx="10" fill="#1F5A3A"/><rect x="4" y="8" width="30" height="52" rx="4" fill="#fff"/><rect x="14.5" y="3" width="9" height="2.4" rx="1.2" fill="#fff" opacity=".45"/><rect x="8" y="14" width="16" height="3" rx="1.5" fill="#1F5A3A"/><rect x="8" y="21" width="22" height="3" rx="1.5" fill="#E3E7E4"/><rect x="8" y="28" width="13" height="3" rx="1.5" fill="#E3E7E4"/><g clip-path="url(#pvBtnClip)"><circle cx="19" cy="63" r="16" fill="#1F5A3A"/><ellipse cx="14.70" cy="52.50" rx="3.4" ry="4.5" fill="#fff"/><circle cx="14.49" cy="51.08" r="1.90" fill="#1B1A17"/><circle cx="13.82" cy="50.36" r="0.61" fill="#fff"/><ellipse cx="23.30" cy="52.50" rx="3.4" ry="4.5" fill="#fff"/><circle cx="23.09" cy="51.08" r="1.90" fill="#1B1A17"/><circle cx="22.42" cy="50.36" r="0.61" fill="#fff"/></g></svg><span class="pv-toggle-label">미리보기 열기</span>';
  document.body.appendChild(toggle);

  const TOGGLE_POS_KEY = 'mobilePreviewTogglePos';
  const TOGGLE_MARGIN = 16;
  // xRatio·yRatio: 창 폭·높이 대비 위치 (창 크기가 바뀌어도 비슷한 자리). null 이면 기본 위치(오른쪽 아래)
  let togglePos = { xRatio: null, yRatio: null };
  try { togglePos = Object.assign(togglePos, JSON.parse(localStorage.getItem(TOGGLE_POS_KEY) || '{}')); } catch (e) {}

  function placeToggle() {
    if (toggle.style.display === 'none' || !toggle.style.display) return;
    const w = toggle.offsetWidth || 38, h = toggle.offsetHeight || 68;
    let x = togglePos.xRatio == null ? window.innerWidth - w - TOGGLE_MARGIN : togglePos.xRatio * window.innerWidth;
    let y = togglePos.yRatio == null ? window.innerHeight - h - TOGGLE_MARGIN - 80 : togglePos.yRatio * window.innerHeight;
    // 놓은 자리를 존중하고, 창이 줄어 밖으로 나갈 때만 안쪽으로 당긴다
    x = Math.min(Math.max(x, 0), window.innerWidth - w);
    y = Math.min(Math.max(y, 0), window.innerHeight - h);
    toggle.style.left = Math.round(x) + 'px';
    toggle.style.top = Math.round(y) + 'px';
    // "미리보기 열기" 라벨은 공간이 넓은 쪽으로
    toggle.dataset.side = x + w / 2 < window.innerWidth / 2 ? 'left' : 'right';
  }
  window.addEventListener('resize', placeToggle);

  // 끌기: 5px 이상 움직이면 드래그로 보고, 그때는 클릭(패널 열기)을 막는다
  let drag = null, dragged = false;
  toggle.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    // 위치는 style.left/top(확대 전 실제 자리) 기준. getBoundingClientRect 는 호버·드래그 확대가 섞여 몇 px 어긋남
    const left = parseFloat(toggle.style.left) || 0, top = parseFloat(toggle.style.top) || 0;
    drag = { x0: e.clientX, y0: e.clientY, dx: e.clientX - left, dy: e.clientY - top };
    dragged = false;
    try { toggle.setPointerCapture(e.pointerId); } catch (_) {}
  });
  toggle.addEventListener('pointermove', e => {
    if (!drag) return;
    if (!dragged && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 5) return;
    dragged = true;
    toggle.classList.add('dragging');
    toggle.style.left = Math.min(Math.max(e.clientX - drag.dx, 0), window.innerWidth - toggle.offsetWidth) + 'px';
    toggle.style.top = Math.min(Math.max(e.clientY - drag.dy, 0), window.innerHeight - toggle.offsetHeight) + 'px';
  });
  const endDrag = () => {
    if (!drag) return;
    drag = null;
    toggle.classList.remove('dragging');
    if (!dragged) return;
    togglePos = {
      xRatio: (parseFloat(toggle.style.left) || 0) / window.innerWidth,
      yRatio: (parseFloat(toggle.style.top) || 0) / window.innerHeight,
    };
    try { localStorage.setItem(TOGGLE_POS_KEY, JSON.stringify(togglePos)); } catch (e) {}
    placeToggle();   // 놓은 자리 그대로 (라벨 방향만 갱신)
  };
  toggle.addEventListener('pointerup', endDrag);
  toggle.addEventListener('pointercancel', endDrag);

  // ── 열기/닫기 애니메이션 ──
  // 열기: 작은 폰 버튼 자리에서 폰 모양(#pv-morph)이 패널 크기·위치까지 커진 뒤, 패널 내용이 페이드 인.
  // 닫기: 패널 내용이 먼저 사라지고 폰 모양이 버튼 자리로 줄어든 뒤 버튼이 톡 나타남.
  // 크기는 transform 이 아니라 left/top/width/height 로 움직여 테두리 두께가 일정하게 유지됨.
  // 시스템 "동작 줄이기" 설정이면 애니메이션 없이 바로 전환.
  const reduceMotion = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const EASE = 'cubic-bezier(.2,.8,.2,1)';
  let animating = false;
  const box = (r, radius) => ({ left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: radius + 'px' });
  const makeMorph = (r, radius) => {
    const m = document.createElement('div');
    m.id = 'pv-morph';
    m.innerHTML = '<div class="pv-morph-screen"></div>';
    Object.assign(m.style, box(r, radius));
    document.body.appendChild(m);
    return m;
  };
  const panelRadius = () => 20 * ((panel.getBoundingClientRect().width / panel.offsetWidth) || 1);   // applyDevice 축소 반영

  async function openPanel() {
    if (animating) return;
    const from = toggle.getBoundingClientRect();
    // 패널을 보이지 않게 먼저 펼쳐 최종 크기·위치를 잰다 (transform 전환은 잠시 끔)
    const prevTransition = panel.style.transition;
    panel.style.transition = 'none';
    panel.style.opacity = '0';
    panel.style.display = 'flex';
    applyDevice(panel, device);
    toggle.style.display = 'none';
    const done = () => { panel.style.opacity = ''; panel.style.transition = prevTransition; animating = false; };
    if (reduceMotion() || !panel.animate) { done(); return; }
    animating = true;
    const to = panel.getBoundingClientRect();
    const morph = makeMorph(from, 10);
    try {
      await morph.animate([box(from, 10), box(to, panelRadius())], { duration: 380, easing: EASE, fill: 'forwards' }).finished;
      panel.style.opacity = '';
      await Promise.all([
        panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' }).finished,
        morph.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: 'ease-out', fill: 'forwards' }).finished,
      ]);
    } catch (e) {}
    morph.remove();
    done();
  }

  async function closePanel() {
    if (animating) return;
    const from = panel.getBoundingClientRect();
    const radius = panelRadius();
    // 버튼이 놓일 자리를 미리 잰다 (안 보이게 배치)
    toggle.style.visibility = 'hidden';
    toggle.style.display = 'flex';
    placeToggle();
    const to = toggle.getBoundingClientRect();
    const finish = () => { panel.style.display = 'none'; panel.style.opacity = ''; toggle.style.visibility = ''; animating = false; };
    if (reduceMotion() || !panel.animate) { finish(); return; }
    animating = true;
    const morph = makeMorph(from, radius);
    morph.style.opacity = '0';
    try {
      const fadeOut = panel.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: 'ease-in', fill: 'forwards' });
      await Promise.all([
        fadeOut.finished,
        morph.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 140, easing: 'ease-in', fill: 'forwards' }).finished,
      ]);
      panel.style.display = 'none';
      fadeOut.cancel();   // 'forwards' 로 남은 투명도가 다음에 열 때 패널을 가리지 않게
      await morph.animate([{ ...box(from, radius), opacity: 1 }, { ...box(to, 10), opacity: 1 }], { duration: 340, easing: EASE, fill: 'forwards' }).finished;
      toggle.style.visibility = '';
      morph.remove();
      await toggle.animate([{ transform: 'scale(.86)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 220, easing: 'ease-out' }).finished;
    } catch (e) { morph.remove(); }
    finish();
  }

  document.getElementById('mobile-preview-close').addEventListener('click', closePanel);
  toggle.addEventListener('click', e => {
    if (dragged) { dragged = false; e.preventDefault(); return; }   // 방금 끌었던 거면 열지 않음
    openPanel();
  });
  document.getElementById('mobile-preview-ad').addEventListener('change', (e) => {
    adModeSetting = e.target.value;
    try { localStorage.setItem('mobilePreviewAd', adModeSetting); } catch (err) {}
    updatePreview();
  });
  document.getElementById('mobile-preview-device').addEventListener('change', (e) => {
    device = DEVICES.find(d => d.name === e.target.value) || DEVICES[0];
    localStorage.setItem('mobilePreviewDevice', device.name);
    applyDevice(panel, device);
  });

  return panel;
}

// 카테고리 동적 추출 (에디터 DOM 여러 셀렉터 시도)
function getCategory() {
  const doc = getIframeDoc() || document;
  const selectors = [
    'select[name="categoryNo"] option:checked',
    'select[name="category"] option:checked',
    '.category_name', '#categoryName', '.pcm_category .category',
    '._cur_category', '.blog_category a',
  ];
  for (const sel of selectors) {
    const el = doc.querySelector(sel) || document.querySelector(sel);
    const text = (el?.value || el?.innerText || '').trim();
    if (text && text !== '카테고리' && text !== '-- 카테고리 --') return text;
  }
  return '';
}

// blogId 정확하게 추출 (path 방식 + query param 방식 모두 지원)
// - /shanaren_/PostWrite          → "shanaren_"
// - /PostWrite.naver?blogId=shanaren_ → "shanaren_"
function extractBlogId() {
  const url = new URL(window.location.href);

  // 방식 1: query param (?blogId=xxx)
  const fromQuery = url.searchParams.get('blogId');
  if (fromQuery) return fromQuery;

  // 방식 2: path 첫 번째 세그먼트 (/shanaren_/...)
  //   네이버 자체 경로명은 제외 (PostWrite, PostView 등)
  const NAVER_PATHS = ['postwrite', 'postview', 'postlist', 'postsearch',
                       'about', 'guestbook', 'redirect', 'bloginfo'];
  const first = (url.pathname.split('/').filter(Boolean)[0] || '');
  if (first && !first.includes('.') && !NAVER_PATHS.includes(first.toLowerCase())) {
    return first;
  }
  return '';
}

// ── Step 1: 현재 에디터 페이지의 inline script에서 닉네임 즉시 추출 ──
// Naver는 SSR 데이터를 <script> 태그 안 JSON으로 심어두는 경우가 많음
function getNicknameFromCurrentPage() {
  const patterns = [
    /"nickName"\s*:\s*"([^"]+)"/,
    /"nick"\s*:\s*"([^"]+)"/,
    /"nickname"\s*:\s*"([^"]+)"/,
    /"blogNickName"\s*:\s*"([^"]+)"/,
    /"ownerNickName"\s*:\s*"([^"]+)"/,
    /"writerNickName"\s*:\s*"([^"]+)"/,
  ];
  for (const script of document.querySelectorAll('script:not([src])')) {
    for (const pat of patterns) {
      const m = script.textContent.match(pat);
      if (m?.[1]) return m[1];
    }
  }
  return null;
}

// ── Step 2: 서버사이드 렌더링 페이지를 fetch해서 닉네임 + 프로필 이미지 추출 ──
// PostList.naver는 Java/JSP 기반 서버렌더링 → HTML에 프로필 정보 포함
async function fetchBlogUserInfo(blogId) {
  if (!blogId) return {};

  const parser = new DOMParser();

  // 파싱한 doc에서 닉네임·프로필 이미지 추출
  function extractFromDoc(doc) {
    let nickname = null;
    let profileImg = null;

    const nickSelectors = [
      '.nick', '.nickname', '.blog_nickname', '.BlogNickname',
      '.blog_name', '#blog_name', '.blogger_name', '.my_nick',
      '.profile_info .name', '.blog-title .name',
    ];
    for (const sel of nickSelectors) {
      const text = doc.querySelector(sel)?.textContent?.trim();
      if (text) { nickname = text; break; }
    }

    // script 태그 안 JSON 스캔
    if (!nickname) {
      const patterns = [
        /"nickName"\s*:\s*"([^"]+)"/,
        /"nick"\s*:\s*"([^"]+)"/,
        /"blogNickName"\s*:\s*"([^"]+)"/,
        /"ownerNickName"\s*:\s*"([^"]+)"/,
      ];
      for (const script of doc.querySelectorAll('script:not([src])')) {
        for (const pat of patterns) {
          const m = script.textContent.match(pat);
          if (m?.[1]) { nickname = m[1]; break; }
        }
        if (nickname) break;
      }
    }

    // og:title fallback
    if (!nickname) {
      const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
      const m = ogTitle.match(/^(.+?)\s*[:：]/);
      if (m) nickname = m[1].trim();
    }

    // 프로필 이미지
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
    const profileImgSrc = doc.querySelector(
      '.profile_img img, .blog_profile img, .writer_thumb img, .author img'
    )?.src || '';
    const candidate = ogImage || profileImgSrc;
    if (candidate && !candidate.includes('bloglog') && !candidate.includes('default_thumbnail')) {
      profileImg = candidate;
    }

    // 블로그 이름: <title> = "블로그 이름 : 네이버 블로그"
    const tm = (doc.title || '').match(/^(.+?)\s*[:：]\s*네이버 블로그/);
    const blogName = tm ? tm[1].trim() : null;

    return { nickname, profileImg, blogName };
  }

  // 한 URL을 fetch → frameset이면 mainFrame까지 따라가기
  async function fetchAndParse(url) {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) return null;
    const html = await res.text();
    const doc = parser.parseFromString(html, 'text/html');

    const frameset = doc.querySelector('frameset');
    if (frameset) {
      const mainFrame = doc.querySelector('frame[name="mainFrame"]') || doc.querySelector('frame');
      if (mainFrame) {
        const frameUrl = new URL(mainFrame.getAttribute('src'), 'https://blog.naver.com').href;
        dlog('frameset 감지 → mainFrame fetch:', frameUrl);
        return fetchAndParse(frameUrl);
      }
    }
    return doc;
  }

  // 시도할 URL 순서 (서버사이드 렌더링 페이지 우선)
  const urls = [
    `https://blog.naver.com/PostList.naver?blogId=${blogId}&currentPage=1`,
    `https://blog.naver.com/${blogId}`,
  ];

  for (const url of urls) {
    try {
      dlog('fetch 시도:', url);
      const doc = await fetchAndParse(url);
      if (!doc) continue;
      const result = extractFromDoc(doc);
      if (result.nickname || result.profileImg || result.blogName) {
        dlog('fetch 결과 →', result);
        return result;
      }
    } catch (e) {
      dlog('fetch 실패:', url, e);
    }
  }

  dlog('모든 fetch 실패');
  return {};
}

// 블로그 정보 동적 추출
function getBlogInfo() {
  // 1) 블로그 이름: document.title = "사월寫 : 네이버 블로그" 형식
  let blogName = '내 블로그';
  const titleMatch = document.title.match(/^(.+?)\s*[:：]\s*네이버 블로그/);
  if (titleMatch) blogName = titleMatch[1].trim();

  // 2) 블로그 ID: URL에서 정확히 추출 (path·query param 모두 지원)
  const blogId = extractBlogId();

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

  // 5) 카테고리: 추출 성공 시 카테고리명, 실패 시 연도 fallback
  const category = getCategory();
  const yearStr = category || String(now.getFullYear());

  return { blogName, blogId, authorName, dateStr, yearStr };
}

function debounce(fn, delay) {
  let timer = null;
  return function () { clearTimeout(timer); timer = setTimeout(fn, delay); };
}

// 접근 가능한 iframe 문서들 (미리보기 자체 iframe 은 제외 —
// 자기 출력을 감시하면 갱신 → 변경 → 갱신 무한 루프가 된다).
function getContentIframeDocs() {
  const out = [];
  for (const iframe of document.querySelectorAll('iframe')) {
    if (iframe.id === 'preview-frame') continue;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (doc && doc.body) out.push(doc);
    } catch (e) {}
  }
  return out;
}

function getIframeDoc() {
  return getContentIframeDocs()[0] || null;
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
  return Array.from(comp.querySelectorAll('img')).map(img => {
    // SE4 lazy loading: 실제 URL이 data 속성에 있고 src는 placeholder일 수 있음
    // 우선순위: data-lazy-src → data-src → data-url → src 순으로 실제 URL 추출
    const src =
      img.getAttribute('data-lazy-src') ||
      img.getAttribute('data-src')      ||
      img.getAttribute('data-url')      ||
      img.src;

    return {
      src,
      // SmartEditor ONE이 data-width/data-height에 원본 비율 정보를 저장함
      w: parseInt(img.getAttribute('data-width')  || 0),
      h: parseInt(img.getAttribute('data-height') || 0),
    };
  }).filter(({ src }) =>
    // placeholder·빈값·data URI 제외
    src && !src.startsWith('data:') && src !== window.location.href
  );
}

// ── 이미지 블록 빌더 ──
// 실제 네이버 앱과 동일한 방식:
//   - 뷰어 HEIGHT 고정 (VIEWER_H) → item 너비가 비율에 따라 달라짐
//   - 가로(landscape) 이미지: item 너비 ≈ 뷰어 너비 → 1장씩 보임
//   - 세로(portrait)  이미지: item 너비가 좁아져 → 여러 장 동시에 보임
//   - 모든 item 합계 너비 ≤ 뷰어 너비 → 스크롤 불필요 → 진행 바 숨김
//
// isStandalone: se-image(단독 컴포넌트) = true → max-width 처리
//               se-imageGroup(그룹)      = false → full-bleed
const VIEWER_H = 294; // iPhone 16 기준 가로 이미지 뷰어 높이 (393 × 3/4)

function buildImageBlock(imgs, isStandalone = false) {
  const n = imgs.length;
  if (n === 0) return '';

  if (n === 1) {
    // 1장: 원본 비율 유지 (aspect-ratio로 로드 전 공간 확보)
    const { src, w, h } = imgs[0];
    const ratioStyle = (w && h) ? ` style="aspect-ratio:${w}/${h}"` : '';
    // se-image 단독 → max-width(여백 있음), se-imageGroup 1장 → full-bleed
    const cls = isStandalone ? 'preview-single-img preview-single-img--contained' : 'preview-single-img';
    // loading="eager": 네이버 페이지가 img에 lazy를 주입하거나 Chrome이 transform 밖 이미지를
    // viewport 외부로 판단해 로드를 지연하는 것을 방지
    return `<img src="${src}" class="${cls}"${ratioStyle} loading="eager">`;
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
          `<img src="${img.src}" class="preview-carousel-img" loading="eager"></div>`
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

// span 끝 공백이 줄 끝에 걸릴 때 CSS가 제거하는 현상 방지
// " </tag>" → "&nbsp;</tag>" 로 치환
function preserveSpaces(html) {
  return html.replace(/ +(<\/[a-zA-Z]+>)/g, (match, tag) => ' '.repeat(match.length - tag.length) + tag);
}


// ── 외부 링크 카드 빌더 ──
function buildOgLink(url, title, desc, thumb, domain) {
  const thumbHtml  = thumb  ? `<img src="${thumb}" class="preview-oglink-thumb" loading="eager">` : '';
  const titleHtml  = title  ? `<div class="preview-oglink-title">${title}</div>`   : '';
  const descHtml   = desc   ? `<div class="preview-oglink-desc">${desc}</div>`     : '';
  const domainHtml = domain ? `<div class="preview-oglink-domain">🔗 ${domain}</div>` : '';

  if (!thumbHtml && !titleHtml && !domainHtml) return '';

  return `<a class="preview-oglink" href="${url}" target="_blank" rel="noopener noreferrer">${thumbHtml}<div class="preview-oglink-body">${titleHtml}${descHtml}${domainHtml}</div></a>`;
}

// ════════════════════════════════════════════════════════════
//  네이버 실제 CSS 재사용 렌더러 (iframe 방식)
//  본문을 손으로 흉내 내지 않고, 네이버 뷰어 CSS를 그대로 적용해
//  "발행된 글과 동일하게" 렌더링한다.
// ════════════════════════════════════════════════════════════
// 네이버 실제 모바일 뷰어 CSS. 버전이 박혀 있어 시간이 지나면 낡거나 사라질 수 있으므로,
// 실행 시 에디터 페이지에서 현재 버전을 찾아 갱신하고(resolveViewerCSS) 실패 시 이 목록으로 폴백.
// 미리보기 iframe 에 넣는 네이버 모바일 뷰어 CSS 4종.
// 아래 값은 최후의 기본값일 뿐이고, 실제로는 resolveViewerCSS 가 최신 주소로 바꿔 끼운다.
//   lego_w·lego_view·se_viewer_blog_mobile = 모바일 글 페이지(m.blog)에만 있음 → 내 글 모바일 페이지에서 읽음
//   se.viewer.css                         = 에디터와 같은 SE 버전 → 글쓰기 페이지에서 버전을 읽어 재구성
// (lego_w 는 파일명에 해시가 붙어 수시로 바뀜: 2026-11-15 기준 261743111 → 142457331)
const NAVER_VIEWER_CSS_FALLBACK = [
  'https://ssl.pstatic.net/t.static.blog/nmobile/versioning/lego_w-142457331_https.css',
  'https://ssl.pstatic.net/t.static.blog/nmobile/versioning/lego_view-63655323_https.css',
  'https://ssl.pstatic.net/static/blog/se/css/se_viewer_blog_mobile_v1.43.1.css',
  'https://editor-static.pstatic.net/v/basic/1.78.1/css/se.viewer.css',
];
const VIEWER_CSS_KEYS = ['lego_w', 'lego_view', 'se_viewer_blog_mobile', 'se.viewer.css'];
let viewerCssUrls = NAVER_VIEWER_CSS_FALLBACK.slice();

// 모바일 글 페이지에서 찾은 CSS 주소 { key: url }
//   cached = 지난번에 찾아 저장해 둔 값 (이번 세션에서 아직 못 받았을 때 기본값보다 우선)
//   fresh  = 이번 세션에 방금 받은 값 (가장 우선)
const MOBILE_CSS_STORE = 'mobilePreviewViewerCss';
let mobileCssCached = {};
try { mobileCssCached = JSON.parse(localStorage.getItem(MOBILE_CSS_STORE) || '{}') || {}; } catch (e) {}
let mobileCssFresh = null;

// 모바일 글 페이지 HTML 에서 뷰어 CSS 주소를 뽑아 반영하고 저장
function applyMobileCssFromHtml(html) {
  const hrefs = [...html.matchAll(/<link[^>]+rel=["']?stylesheet[^>]*>/gi)]
    .map(m => (m[0].match(/href=["']([^"']+)["']/) || [])[1])
    .filter(Boolean);
  const found = {};
  VIEWER_CSS_KEYS.forEach(k => {
    const h = hrefs.find(x => x.includes(k) && /^https:\/\//.test(x));
    if (h) found[k] = h;
  });
  if (!Object.keys(found).length) return false;
  mobileCssFresh = found;
  try { localStorage.setItem(MOBILE_CSS_STORE, JSON.stringify(found)); } catch (e) {}
  resolveViewerCSS();
  return true;
}

// 현재 페이지(+에디터 iframe)가 로드한 stylesheet URL 수집
function collectPageCssHrefs() {
  const out = [];
  const scan = (doc) => {
    try { doc.querySelectorAll('link[rel="stylesheet"]').forEach(l => l.href && out.push(l.href)); } catch (e) {}
  };
  scan(document);
  const ifr = getIframeDoc();
  if (ifr) scan(ifr);
  document.querySelectorAll('iframe').forEach(f => { try { if (f.contentDocument) scan(f.contentDocument); } catch (e) {} });
  return out;
}

// 우선순위 (뒤가 이김): 기본값 < 지난번 저장값 < 현재 페이지 링크 < 에디터 SE 버전으로 재구성 < 이번에 받은 모바일 글
function resolveViewerCSS() {
  const next = NAVER_VIEWER_CSS_FALLBACK.slice();
  const put = (key, url) => {
    const i = VIEWER_CSS_KEYS.indexOf(key);
    if (i >= 0 && url) next[i] = url;
  };
  VIEWER_CSS_KEYS.forEach(k => put(k, mobileCssCached[k]));

  const hrefs = collectPageCssHrefs();
  VIEWER_CSS_KEYS.forEach(k => put(k, hrefs.find(h => h.includes(k))));
  const verHref = hrefs.find(h => /editor-static\.pstatic\.net\/[ve]\/basic[\w.]*\/[\d.]+\//.test(h));
  const vm = verHref && verHref.match(/\/basic[\w.]*\/([\d.]+)\//);
  if (vm) put('se.viewer.css', `https://editor-static.pstatic.net/v/basic/${vm[1]}/css/se.viewer.css`);

  if (mobileCssFresh) VIEWER_CSS_KEYS.forEach(k => put(k, mobileCssFresh[k]));

  if (next.join() !== viewerCssUrls.join()) dlog('뷰어 CSS 확정:', next);
  viewerCssUrls = next;
}

// 동영상(se-video)·외부 임베드(se-oembed): 실제 뷰어에선 네이버 플레이어 스크립트가
// __se_module_data(vid·썸네일)를 읽어 플레이어를 그린다. 미리보기 iframe 은 스크립트가 막혀 있어
// 플레이어(와 그 안의 iframe)가 "자바스크립트를 사용 설정하세요" 오류를 띄움
// → 재생 전 화면(썸네일 + 재생 버튼)으로 바꿔 넣는다. 보기 전용이라 재생은 원래 불가.
// script 를 읽어야 하므로 stripEditorUI 보다 먼저 호출할 것.
function staticizeVideos(root) {
  root.querySelectorAll('.se-component.se-video, .se-component.se-oembed').forEach(comp => {
    let data = {};
    const dataEl = comp.querySelector('script.__se_module_data, [data-module]');
    try { data = JSON.parse(dataEl.getAttribute('data-module')).data || {}; } catch (e) {}

    let thumb = data.thumbnail || data.thumbnailUrl || data.thumbnail_url || '';
    if (!thumb) {
      const img = comp.querySelector('img[src]:not([src^="data:"])');
      const poster = comp.querySelector('video[poster]');
      const bg = comp.querySelector('[style*="background-image"]');
      const bgm = bg && /url\(["']?([^"')]+)/.exec(bg.getAttribute('style'));
      thumb = (img && img.getAttribute('src')) || (poster && poster.getAttribute('poster')) || (bgm && bgm[1]) || '';
    }
    const w = parseInt(data.originalWidth || data.width) || 16;
    const h = parseInt(data.originalHeight || data.height) || 9;

    const target = comp.querySelector('.se-module-video, .se-module-oembed, .se-section') || comp;
    target.innerHTML =
      `<div class="pv-video" style="aspect-ratio:${w}/${h}">` +
      (thumb ? `<img src="${escHtml(thumb)}" alt="">` : '') +
      `<span class="pv-video-play"></span></div>`;
  });
}

// 표(se-table): 실제 모바일에선 네이버 에디터 뷰어 스크립트(se.viewer 의 TableComponent)가
//   ① 에디터에서 정한 표 폭(.se-section-table style="width: 75%")을 지우고
//   ② 표 폭 = 열 수 > 3 ? 열 수 × (화면폭 / 3) px : 100%   (화면폭 ≥ 768 이면 기준 6열)
// 로 바꾼다. 미리보기 iframe 은 스크립트가 막혀 있어 같은 처리를 여기서 해 준다.
// 화면폭은 iframe 폭(= 기기 폭)이므로 100vw 로 계산. 열 수는 모듈 데이터 → 없으면 첫 행 colspan 합.
// 모듈 데이터 script 를 읽으므로 stripEditorUI 보다 먼저 호출할 것.
function mobilizeTables(root) {
  root.querySelectorAll('.se-component.se-table').forEach(comp => {
    let cols = 0;
    const dataEl = comp.querySelector('script.__se_module_data, [data-module]');
    try { cols = parseInt(JSON.parse(dataEl.getAttribute('data-module')).data.columnCount, 10) || 0; } catch (e) {}
    if (!cols) {
      const tr = comp.querySelector('tr');
      if (tr) cols = Array.from(tr.children).reduce((n, td) => n + (parseInt(td.getAttribute('colspan'), 10) || 1), 0);
    }
    comp.querySelectorAll('.se-section-table').forEach(sec => { sec.style.width = ''; });
    const table = comp.querySelector('table');
    if (!table) return;
    const base = 3;   // 기준 열 수: 폰(<768px) 3열 — DEVICES 는 전부 폰이라 태블릿 6열은 불필요
    table.style.width = cols > base ? `calc(${cols} * 100vw / ${base})` : '100%';
  });
}

// 글쓰기 에디터에만 있는 편집 UI(컨트롤 버튼·툴바·플레이스홀더·접근성 텍스트) 제거.
// 발행 뷰어에는 없는 요소라 미리보기에 그대로 두면 "위치이동/제목/삭제/취소/확인" 같은
// 정체불명 텍스트가 보인다.
// ── 원격 규칙 (rules.json) ──
// 네이버가 에디터를 바꿔 편집 UI 가 새어 나오는 식의 깨짐은 대부분 "이 요소를 지워라 / 이 클래스를 붙여라" 로 고쳐진다.
// 이런 규칙을 GitHub 의 rules.json 에 데이터로 두고 받아 와서, 웹스토어 심사 없이 바로 반영한다.
// ⚠️ 데이터만 받는다 (MV3 는 원격 코드 실행 금지). 형식이 틀린 항목은 sanitizeRules 가 버림.
const REMOTE_RULES_URL = 'https://raw.githubusercontent.com/SooinJung/naver-blog-mobile-preview/main/rules.json';
const REMOTE_RULES_STORE = 'mobilePreviewRules';
const REMOTE_RULES_TTL = 6 * 60 * 60 * 1000;   // 6시간마다 새로 받음
const REMOTE_RULES_SCHEMA = 1;                 // 이 익스텐션이 이해하는 rules.json 형식 버전

function sanitizeRules(r) {
  const out = { stripSelectors: [], stripTexts: [], addClass: [], extraCss: '' };
  if (!r || typeof r !== 'object' || (r.schema || 1) > REMOTE_RULES_SCHEMA) return out;
  const validSel = sel => {
    if (typeof sel !== 'string' || !sel.trim() || sel.length > 300) return false;
    try { document.createDocumentFragment().querySelector(sel); return true; } catch (e) { return false; }
  };
  if (Array.isArray(r.stripSelectors)) out.stripSelectors = r.stripSelectors.filter(validSel).slice(0, 200);
  if (Array.isArray(r.stripTexts)) {
    out.stripTexts = r.stripTexts.filter(t => typeof t === 'string' && t.trim() && t.length <= 100).slice(0, 100);
  }
  if (Array.isArray(r.addClass)) {
    out.addClass = r.addClass
      .filter(x => x && validSel(x.selector) && typeof x.add === 'string' && /^[\w-]+( [\w-]+)*$/.test(x.add.trim()))
      .map(x => ({ selector: x.selector, add: x.add.trim().split(' ') }))
      .slice(0, 100);
  }
  if (typeof r.extraCss === 'string') out.extraCss = r.extraCss.slice(0, 20000).replace(/<\/?\s*(style|script)/gi, '');
  return out;
}

let remoteRules = sanitizeRules(null);
try { remoteRules = sanitizeRules((JSON.parse(localStorage.getItem(REMOTE_RULES_STORE) || 'null') || {}).rules); } catch (e) {}

// 오래됐을 때만 새로 받아서, 바뀌었으면 미리보기를 다시 그린다
async function refreshRemoteRules() {
  let cached = null;
  try { cached = JSON.parse(localStorage.getItem(REMOTE_RULES_STORE) || 'null'); } catch (e) {}
  if (cached && Date.now() - cached.at < REMOTE_RULES_TTL) return;
  try {
    const r = await fetch(REMOTE_RULES_URL, { cache: 'no-cache', credentials: 'omit' });
    if (!r.ok) return;
    const json = await r.json();
    try { localStorage.setItem(REMOTE_RULES_STORE, JSON.stringify({ at: Date.now(), rules: json })); } catch (e) {}
    const next = sanitizeRules(json);
    if (JSON.stringify(next) !== JSON.stringify(remoteRules)) {
      remoteRules = next;
      dlog('원격 규칙 갱신:', remoteRules);
      debouncedUpdate();
    }
  } catch (e) { dlog('원격 규칙 받기 실패:', e); }
}

// addClass 규칙 적용 (예: 뷰어 스크립트가 붙이던 로드 완료 클래스)
function applyRemoteAddClass(root) {
  remoteRules.addClass.forEach(({ selector, add }) => {
    try { root.querySelectorAll(selector).forEach(el => el.classList.add(...add)); } catch (e) {}
  });
}

function stripEditorUI(root) {
  const sel = [
    'button', 'script', 'style', 'noscript',
    'textarea',   // 코드 블록 편집 중 입력창("내용을 입력하세요.") 등 — 발행 글 본문엔 없음
    // 에디터가 편집 UI 에 붙이는 표시(__se-cursor-unrelated): 툴바 자리·표 행/열 선택 막대·표 우클릭 메뉴 등.
    // 표 선택 막대는 버튼만 지우면 높이 45px 칸들이 남아 표 위에 큰 공백이 생김 (2026-11-15)
    '.__se-cursor-unrelated', '.se-table-control', '.se-cell-controlbar', '.se-cell-context-menu',
    '.se-component-edge-button',
    '.se-blind', '.se-placeholder', '.se-placeholderText', '.se-placeholder-text',
    '.se-controls', '.se-control', '.se-control-panel',
    '.se-section-control', '.se-component-control',
    '.se-toolbar', '.se-module-toolbar', '.se-toolbar-container',
    '.se-drag-handle', '.se-resize-handle', '.se-handle',
    '.se-tooltip', '.se-help', '.se-guide', '.se-guideline',
  ].join(',');
  root.querySelectorAll(sel).forEach(el => { try { el.remove(); } catch (e) {} });
  remoteRules.stripSelectors.forEach(rs => {
    try { root.querySelectorAll(rs).forEach(el => el.remove()); } catch (e) {}
  });
  stripEditorOnlyTexts(root);
}

// 클래스명으로 못 거르는 에디터 전용 문구 (발행 글에는 안 나옴).
//   'AI 활용 설정' = 사진 아래 붙는 AI 사용 표시 설정 링크 (2026-11 확인, 클래스명 미확인이라 문구로 찾음)
// 이 문구만 담은 가장 바깥 요소를 통째로 지워 빈 여백이 남지 않게 한다.
// (실제로 AI 표시를 켠 사진의 뷰어 배지 .se-ai-tooltip-container 는 문구가 달라 영향 없음)
const EDITOR_ONLY_TEXTS = ['AI 활용 설정'];
function stripEditorOnlyTexts(root) {
  if (!EDITOR_ONLY_TEXTS.length && !remoteRules.stripTexts.length) return;
  const norm = s => (s || '').replace(/\s+/g, ' ').trim();
  const isHit = el =>
    (EDITOR_ONLY_TEXTS.includes(norm(el.textContent)) || remoteRules.stripTexts.includes(norm(el.textContent))) &&
    !el.querySelector('img, video, iframe') &&
    !el.matches('.se-component, .se-section, .se-module, .se-main-container');
  const hits = [...root.querySelectorAll('*')].filter(isHit);
  hits.filter(el => !(el.parentElement && isHit(el.parentElement)))
      .forEach(el => { try { el.remove(); } catch (e) {} });
}

// 교차 출처 스타일시트 캐시: href → CSSStyleSheet | 'loading' | 'fail'
// 처음엔 받아 오는 중이라 null 을 돌려주고, 다 받으면 미리보기를 다시 그린다.
const crossSheetCache = new Map();
function getCrossOriginRules(href) {
  const c = crossSheetCache.get(href);
  if (c instanceof CSSStyleSheet) return c.cssRules;
  if (!c) {
    crossSheetCache.set(href, 'loading');
    fetch(href)
      .then(r => (r.ok ? r.text() : Promise.reject(r.status)))
      .then(text => {
        // url(상대경로) 는 iframe 에선 기준 주소가 달라지므로 절대 주소로 바꿔 둔다.
        // 단 data: SVG 안의 fill='url(%23a)' 같은 참조는 건드리면 아이콘이 깨짐 → 앞 글자가 ' = % 등이면 제외
        text = text.replace(/(?<![\w'"%=-])url\(\s*(['"]?)(?!data:|https?:|\/\/|#|%23)([^'")]+)\1\s*\)/g,
          (m, q, u) => { try { return `url("${new URL(u, href).href}")`; } catch (e) { return m; } });
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(text);
        crossSheetCache.set(href, sheet);
        debouncedUpdate();
      })
      .catch(() => crossSheetCache.set(href, 'fail'));
  }
  return null;
}

// ── 에디터 컴포넌트 → 발행 글 마크업 ──
// 일부 컴포넌트는 글쓰기 중의 에디터 DOM 이 발행 글 DOM 과 구조가 달라서 뷰어 CSS 가 안 맞는다.
// (발행하면 서버가 발행 구조로 저장하므로 발행 후엔 멀쩡함) 2026-11-15 실제 에디터 DOM 과 발행 DOM 을 비교해 맞춤.
// 반환값: iframe 에 추가로 넣을 CSS (se-custom 용)
function viewerizeEditorComponents(root, sourceDoc) {
  const doc = root.ownerDocument;

  // 코드: 에디터 = .se-code-source-highlighted > pre > code  +  .se-code-source-edit-mode > textarea(편집 입력창)
  //       발행   = .se-code-source > div.__se_code_view.language-xxx
  //       (뷰어 CSS 의 고정폭 글꼴·줄높이·white-space:pre 가 div[class*=language-] 에 걸려 있음)
  root.querySelectorAll('.se-module-code').forEach(mod => {
    const editBox = mod.querySelector('.se-code-source-edit-mode');
    const typed = editBox && editBox.querySelector('textarea') ? editBox.querySelector('textarea').value : '';
    let box = mod.querySelector('.se-code-source-highlighted');
    const code = box && (box.querySelector('code') || box.querySelector('pre'));
    const view = doc.createElement('div');
    const lang = ((code && code.className.match(/language-[\w-]+/)) || [])[0] || 'language-javascript';
    view.className = '__se_code_view ' + lang;
    if (code && code.textContent.trim()) view.innerHTML = code.innerHTML;
    else view.textContent = typed;            // 막 입력 중이라 색칠본이 아직 없으면 입력창 내용으로
    if (!box) { box = doc.createElement('div'); mod.insertBefore(box, mod.firstChild); }
    box.className = 'se-code-source';
    box.removeAttribute('draggable');
    box.replaceChildren(view);
    if (editBox) editBox.remove();
  });

  // 파일: 에디터 = span.se-file-name("이름.png") 하나  →  발행 = div.se-file-name-container > 이름 + 확장자 + 다운로드 버튼
  //       뷰어 CSS 가 .se-module-file 에 font-size:0 을 주고 container 에서만 13px 로 되살려서, 에디터 구조면 이름이 안 보임
  root.querySelectorAll('.se-module-file').forEach(mod => {
    const nameEl = mod.querySelector('.se-file-name');
    if (!nameEl || mod.querySelector('.se-file-name-container')) return;
    const full = nameEl.textContent.trim();
    const dot = full.lastIndexOf('.');
    const wrap = doc.createElement('div');
    wrap.className = 'se-file-name-container';
    wrap.innerHTML = `<span class="se-file-name">${escHtml(dot > 0 ? full.slice(0, dot) : full)}</span>` +
      (dot > 0 ? `<span class="se-file-extension">${escHtml(full.slice(dot))}</span>` : '');
    nameEl.replaceWith(wrap);
    mod.querySelectorAll('.se-file-status-icon').forEach(el => el.remove());
    if (!mod.querySelector('.se-file-save-button')) {
      wrap.insertAdjacentHTML('afterend', '<a class="se-file-save-button"><span class="se-blind">파일 다운로드</span></a>');
    }
  });

  // 책·영화 등 자료(material): 뷰어 CSS 는 표지 img 를 .se-image-loaded 가 붙어야 보여 줌 (원래 뷰어 스크립트가 로드 후 붙임)
  root.querySelectorAll('.se-material-poster-inner').forEach(el => el.classList.add('se-image-loaded'));

  // 일정: 에디터는 철자가 다른 클래스(expended)를 섹션에 붙임 → 발행 글은 모듈에 se-module-schedule-expanded
  root.querySelectorAll('.se-section-schedule-expended').forEach(sec => {
    const mod = sec.querySelector('.se-module-schedule');
    if (mod) mod.classList.add('se-module-schedule-expanded');
  });

  // 블로그 맞춤 컴포넌트(se-custom, 예: 내돈내산 쇼핑 인증): 내용이 CSS 모듈 클래스(wrap__qsBL0 등)라
  // 뷰어 CSS 에 없고, 에디터 문서에 로드된 블로그 스타일시트(feblog …/pc-pages-SEOnePage.*.css)에만 있다
  // → 쓰인 클래스의 규칙만 골라 옮겨 온다.
  // 크기 규칙은 ".se-l-viewport-mobile .thumbnail__…" 처럼 화면 종류 클래스 아래에만 있음 (모바일: 카드 폭 360, 썸네일 230)
  root.querySelectorAll('.se-module-custom').forEach(el => el.classList.add('se-l-viewport-mobile'));
  let css = '';
  const customClasses = new Set();
  root.querySelectorAll('.se-module-custom [class]').forEach(el => {
    (typeof el.className === 'string' ? el.className : '').split(/\s+/).forEach(c => {
      if (/__[A-Za-z0-9_-]{4,}$/.test(c)) customClasses.add(c);
    });
  });
  if (customClasses.size && sourceDoc) {
    const hit = sel => { for (const c of customClasses) if (sel.indexOf('.' + c) >= 0) return true; return false; };
    const collect = rules => {
      for (const r of rules) {
        if (r.selectorText) { if (hit(r.selectorText)) css += r.cssText; }
        else if (r.cssRules && r.media) {          // @media 안의 규칙
          const before = css.length; let inner = '';
          for (const ir of r.cssRules) if (ir.selectorText && hit(ir.selectorText)) inner += ir.cssText;
          if (inner) css = css.slice(0, before) + `@media ${r.media.mediaText}{${inner}}`;
        }
      }
    };
    for (const sheet of sourceDoc.styleSheets) {
      let rules = null;
      try { rules = sheet.cssRules; } catch (e) {
        // 다른 도메인(pstatic) 시트는 페이지에서 규칙을 못 읽음 → 파일을 직접 받아 파싱 (CORS * 허용됨)
        rules = sheet.href ? getCrossOriginRules(sheet.href) : null;
      }
      if (rules) collect(rules);
    }
  }
  return css;
}

// 에디터 DOM의 클래스명을 발행 뷰어 DOM 형태로 변환 (뷰어 CSS가 인식하도록)
//   에디터: se-fs16   →   뷰어: se-fs-fs16
function viewerize(root) {
  root.querySelectorAll('[class*="se-fs"]').forEach(el => {
    if (typeof el.className === 'string' && /\bse-fs\d+\b/.test(el.className)) {
      el.className = el.className.replace(/\bse-fs(\d+)\b/g, 'se-fs-fs$1');
    }
  });
}

// 미리보기에서 채워 넣을 작성자 정보 (fetch로 갱신됨)
let previewNick = '';
let previewProfile = '';
let previewBlogName = '';

function setAppbarBlogName(name) {
  if (!name) return;
  previewBlogName = name;
  const el = document.querySelector('.appbar-blog-name');
  if (el) el.textContent = name;
}

function escHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// 실제 네이버 마크업 조각들 (네이버 CSS가 그대로 스타일링)
function categoryHTML(cat) {
  return `<div class="blog_category"><a href="#">${escHtml(cat)}</a></div>`;
}
function authorAndButtonHTML(author) {
  return '<div class="blog_authorArea">' +
      '<a href="#" class="blog_thumbnail"><span class="img">' +
        (author.profileSrc ? `<img src="${escHtml(author.profileSrc)}" width="36" height="36" alt="프로필">` : '') +
      '</span></a>' +
      '<div class="text_area">' +
        `<div class="blog_author"><a href="#"><strong class="ell">${escHtml(author.nick)}</strong></a></div>` +
        `<p class="blog_date">${escHtml(author.date)}</p>` +
      '</div>' +
    '</div>' +
    '<div class="blog_btnArea"><a href="#" class="btn_buddyadd"><span class="sp"></span> 이웃추가</a></div>';
}
// 에디터에 제목 컴포넌트가 아예 없을 때 통째로 구성
function buildFullDocumentTitleHTML(author) {
  return '<div class="se-component se-documentTitle se-l-default">' +
    '<div class="se-component-content">' +
    '<div class="se-section se-section-documentTitle se-l-default se-section-align-left">' +
      (author.category ? categoryHTML(author.category) : '') +
      '<div class="se-module se-module-text se-title-text">' +
        '<p class="se-text-paragraph se-text-paragraph-align-">' +
          `<span class="se-fs- se-ff-nanumgothic">${escHtml(author.title || '')}</span>` +
        '</p>' +
      '</div>' +
      authorAndButtonHTML(author) +
    '</div></div></div>';
}

// se-documentTitle 에 카테고리·작성자 영역이 없으면(=글쓰기 에디터) 네이버 마크업으로 채워 넣음.
// 발행된 글(비교 도구)은 이미 있으므로 건드리지 않음.
function injectDocumentTitleExtras(clone, author) {
  if (!author) return;
  const dt = clone.querySelector('.se-documentTitle');
  if (!dt) {
    // 제목 컴포넌트 자체가 없으면 통째로 구성해 맨 앞에 삽입
    const wrap = clone.ownerDocument.createElement('div');
    wrap.innerHTML = buildFullDocumentTitleHTML(author);
    if (wrap.firstElementChild) clone.insertBefore(wrap.firstElementChild, clone.firstChild);
    return;
  }
  const section = dt.querySelector('.se-section-documentTitle')
    || dt.querySelector('.se-component-content') || dt;

  // 카테고리 (제목 앞)
  if (author.category && !section.querySelector('.blog_category')) {
    const titleMod = section.querySelector('.se-title-text');
    if (titleMod) titleMod.insertAdjacentHTML('beforebegin', categoryHTML(author.category));
    else section.insertAdjacentHTML('afterbegin', categoryHTML(author.category));
  }

  // 작성자 영역 (프로필·닉네임·날짜) + 이웃추가 버튼
  if (!section.querySelector('.blog_authorArea')) {
    section.insertAdjacentHTML('beforeend', authorAndButtonHTML(author));
  }
}

// 실제로 글 컴포넌트가 들어있는 문서를 고른다 (에디터 iframe / 메인 문서 중).
function pickSourceDoc(preferred) {
  const cands = [preferred, getIframeDoc(), document].filter(Boolean);
  for (const d of cands) {
    try {
      if (d.querySelector && (d.querySelector('.se-viewer') || d.querySelector('.se-component'))) return d;
    } catch (e) {}
  }
  return preferred || document;
}

// 미리보기 iframe 안에 넣을 문서 생성:
//   실제 네이버 뷰어 CSS + 제목·작성자·본문 → 네이버가 그리던 그대로 렌더
function buildPreviewSrcdoc(sourceDoc, opts) {
  opts = opts || {};
  const src = pickSourceDoc(sourceDoc);

  // se-viewer 통째로 복제 (제목 se-documentTitle 은 main-container 밖 형제라 반드시 포함).
  // 에디터엔 se-viewer 가 없으므로 제목 + 본문(se-component)을 se-viewer 로 감싸 구성.
  let clone;
  const viewer = src.querySelector('.se-viewer');
  if (viewer) {
    clone = viewer.cloneNode(true);
  } else {
    clone = src.createElement('div');
    clone.className = 'se-viewer se-theme-default';
    const dt = src.querySelector('.se-documentTitle');
    const mc = src.querySelector('.se-main-container');
    // 제목은 main-container 밖에 있을 때만 따로 추가 (중복 방지)
    if (dt && (!mc || !mc.contains(dt))) clone.appendChild(dt.cloneNode(true));
    if (mc) {
      clone.appendChild(mc.cloneNode(true));
    } else {
      // 컨테이너가 없으면 se-component 들을 직접 모아 감쌈 (에디터 폴백)
      const mcNew = src.createElement('div');
      mcNew.className = 'se-main-container';
      let count = 0;
      src.querySelectorAll('.se-component').forEach(c => {
        if (dt && c.classList && c.classList.contains('se-documentTitle') && clone.contains && clone.querySelector('.se-documentTitle')) return;
        mcNew.appendChild(c.cloneNode(true));
        count++;
      });
      clone.appendChild(mcNew);
      if (count === 0 && !clone.querySelector('.se-component') && !opts.author) return null;
    }
  }

  // 동영상 → 정적 썸네일, 표 → 모바일 폭 (모듈 데이터 script 를 읽으므로 편집 UI 제거 전에)
  staticizeVideos(clone);
  mobilizeTables(clone);

  // 글쓰기 중 에디터 구조 → 발행 글 구조 (코드·파일·자료·일정·맞춤 컴포넌트)
  const extraCss = (opts.isEditor ? viewerizeEditorComponents(clone, src) : '') + remoteRules.extraCss;
  applyRemoteAddClass(clone);

  // 에디터 전용 편집 UI 제거 (작성자 주입 전에 실행)
  stripEditorUI(clone);

  // 에디터의 제목 컴포넌트는 표지사진·위치이동·삭제 등 편집 UI가 잔뜩 붙어있으므로
  // 통째로 제거하고, 아래 injectDocumentTitleExtras 가 제목/작성자 데이터로 깨끗하게 새로 구성.
  if (opts.isEditor) {
    clone.querySelectorAll('.se-documentTitle').forEach(el => el.remove());
  }

  // 제목/작성자(se-documentTitle)를 iframe 안에서 네이버 CSS로 렌더.
  injectDocumentTitleExtras(clone, opts.author);

  // 에디터 → 뷰어 클래스명 보정
  if (opts.isEditor) viewerize(clone);

  // 지연로딩 이미지: 실제 이미지로 승격
  clone.querySelectorAll('img').forEach(img => {
    const lazy = img.getAttribute('data-lazy-src') || img.getAttribute('data-src');
    if (lazy) img.setAttribute('src', lazy);
    img.setAttribute('loading', 'eager');
  });

  // 움짤(GIF→mp4 변환 영상): 원래 네이버 스크립트가 재생시키는데 미리보기는 스크립트가
  // 막혀 정지됨 → autoplay 를 붙여 소리 없이 반복 재생(실제 앱처럼 움직임). 실제 동영상은 제외.
  clone.querySelectorAll('video').forEach(v => {
    const isGif = (v.className || '').indexOf('_gifmp4') >= 0
      || (v.className || '').indexOf('custom-se-image-video-resource') >= 0
      || v.hasAttribute('data-gif-url');
    if (!isGif) return;
    v.setAttribute('autoplay', '');
    v.setAttribute('muted', '');
    v.muted = true;
    v.setAttribute('loop', '');
    v.setAttribute('playsinline', '');
    v.removeAttribute('controls');
  });

  const inner = clone.outerHTML;

  const links = viewerCssUrls.map(u => `<link rel="stylesheet" href="${u}">`).join('');
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">${links}` +
    `<style>html,body{margin:0;padding:0;background:#fff}` +
    `#viewTypeSelector{padding-bottom:24px}` +
    `.pv-video{position:relative;width:100%;background:#000;overflow:hidden}` +
    `.pv-video img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}` +
    `.pv-video-play{position:absolute;left:50%;top:50%;width:56px;height:56px;margin:-28px 0 0 -28px;` +
    `border-radius:50%;background:rgba(0,0,0,.45)}` +
    `.pv-video-play:after{content:"";position:absolute;left:22px;top:17px;` +
    `border-style:solid;border-width:11px 0 11px 18px;border-color:transparent transparent transparent #fff}` +
    `.pv-ad{padding:30px 20px 0}` +
    `.pv-ad-inner{position:relative;border:1px solid rgba(0,0,0,.1);border-radius:6px;overflow:hidden}` +
    `.pv-ad-img{aspect-ratio:1.91/1;background:#f2f3f5}` +
    `.pv-ad-text{display:flex;flex-direction:column;gap:6px;padding:12px 14px 14px}` +
    `.pv-ad-title{display:block;height:14px;width:70%;border-radius:3px;background:#eceef1}` +
    `.pv-ad-sub{font:12px/1.4 -apple-system,sans-serif;color:#999}` +
    `.pv-ad-sub b{font-weight:600;color:#666;margin-right:4px}` +
    // 보기 전용: 링크·버튼은 전부 입력을 막고(클릭 시 iframe 이 다른 페이지로 넘어가는 것 방지),
    // 사진 슬라이드와 진행바만 입력을 받는다 (enableImageSlides). 세로 휠은 막힌 곳·슬라이드 모두 바깥 패널로 넘어감.
    `html{pointer-events:none}` +
    `.se-imageGroup-viewer,.se-imageGroup-progress{pointer-events:auto}` +
    `.se-imageGroup-viewer a{pointer-events:none}` +
    `.se-imageGroup-viewer{cursor:grab}.se-imageGroup-viewer:active{cursor:grabbing}` +
    extraCss.replace(/<\/style/gi, '') +
    `</style></head>` +
    `<body><div class="post_ct wrap_rabbit" id="viewTypeSelector">${inner}</div></body></html>`;
}

// ── 본문 광고 자리 (네이버 애드포스트) ──
// 광고는 발행 글을 연 뒤 네이버 스크립트가 본문 사이에 끼워 넣어서, 에디터 DOM 에는 없다.
// 광고 내용은 매번 달라 재현할 수 없지만 "어디에·얼마만큼" 끼우는지는 네이버 규칙 그대로 따라가
// 본문 간격이 실제와 같아지게 한다.
// 출처: m.blog postView_2.30.1 (401.*.js) initializeContentAdvertise / findMiddlePosition
//   adContentLocation 1=중간, 2=하단, 0=둘 다
//   중간: 컴포넌트 clientHeight 누적이 전체의 30% 를 넘는 컴포넌트 "앞" (그 index 가 0 이면 생략)
//   하단: 마지막 컴포넌트 뒤
//   둘 다: 하단 + (#viewTypeSelector 높이 > 2700 일 때만) 30% 앞·60% 앞 두 곳
//   광고 칸 CSS: .ssp_adcontent { padding: 30px 20px 0 }
const AD_MODES = [
  { value: 'auto',   label: '광고: 자동' },
  { value: 'none',   label: '광고 없음' },
  { value: 'middle', label: '광고: 중간' },
  { value: 'bottom', label: '광고: 하단' },
  { value: 'both',   label: '광고: 중간+하단' },
];
let adModeSetting = (() => { try { return localStorage.getItem('mobilePreviewAd') || 'auto'; } catch (e) { return 'auto'; } })();
let adModeDetected = null;   // 'auto' 일 때 쓸 값 (fetchAdSetting 결과)

function currentAdMode() {
  if (adModeSetting !== 'auto') return adModeSetting;
  return adModeDetected || 'both';   // 감지 실패 시: 애드포스트 기본값(둘 다)
}

// 내 블로그 발행 글(수정 중인 글, 없으면 최신 글)의 모바일 페이지에서 광고 설정을 읽는다.
// m.blog.naver.com 은 blog.naver.com 출처의 요청을 CORS 로 허용한다.
async function fetchAdSetting(blogId) {
  if (!blogId) return null;
  try {
    let logNo = new URL(location.href).searchParams.get('logNo');
    if (!logNo) {
      const r = await fetch(`https://m.blog.naver.com/api/blogs/${encodeURIComponent(blogId)}/post-list?categoryNo=0&itemCount=1&page=1`, { credentials: 'include' });
      const j = await r.json();
      logNo = j && j.result && j.result.items && j.result.items[0] && j.result.items[0].logNo;
    }
    if (!logNo) return null;
    const html = await (await fetch(`https://m.blog.naver.com/${encodeURIComponent(blogId)}/${logNo}`, { credentials: 'include' })).text();
    // 같은 페이지에서 최신 모바일 뷰어 CSS 주소도 읽어 둔다 (바뀌었으면 미리보기 다시 그림)
    const before = viewerCssUrls.join();
    if (applyMobileCssFromHtml(html) && viewerCssUrls.join() !== before) debouncedUpdate();
    const m = html.match(/advertise\\?"\s*:\s*\{([^}]*)\}/);
    if (!m) return null;
    const flag = k => new RegExp(k + '\\\\?"\\s*:\\s*true').test(m[1]);
    const loc = (m[1].match(/adContentLocation\\?"\s*:\s*(-?\d+)/) || [])[1];
    const mode = !(flag('adPostYn') && flag('adContentYn')) ? 'none'
      : ({ 1: 'middle', 2: 'bottom', 0: 'both' }[loc] || 'none');
    dlog('광고 설정 감지:', m[1], '→', mode);
    return mode;
  } catch (e) {
    dlog('광고 설정 감지 실패:', e);
    return null;
  }
}

function makeAdSlot(doc, id) {
  const d = doc.createElement('div');
  d.id = id;
  d.className = 'pv-ad';
  d.innerHTML = '<div class="pv-ad-inner"><div class="pv-ad-img"></div>'
    + '<div class="pv-ad-text"><span class="pv-ad-title"></span><span class="pv-ad-sub"><b>광고</b> 광고 자리 (미리보기 예시)</span></div></div>';
  return d;
}

function insertAdSlots(doc, mode) {
  if (!doc || mode === 'none') return;
  if (doc.querySelector('.pv-ad')) return;   // 이미 넣음 (onload 중복 방지)
  const comps = Array.from(doc.querySelectorAll('.se-main-container .se-component'));
  if (comps.length < 1) return;

  const findMiddle = ratio => {
    if (comps.length < 2) return -1;
    let left = comps.reduce((a, c) => a + c.clientHeight, 0) * ratio, idx = -1;
    for (let i = 0; i < comps.length && left >= 0; i++) {
      left -= comps[i].clientHeight < 1 ? 400 : comps[i].clientHeight;
      idx = i;
    }
    return idx;
  };
  // 위치는 광고를 넣기 전 높이로 모두 계산 (네이버도 빈 광고 div 상태에서 계산)
  const wrapH = (doc.getElementById('viewTypeSelector') || doc.body).offsetHeight;
  const mid1 = (mode === 'middle' || (mode === 'both' && wrapH > 2700)) ? findMiddle(0.3) : -1;
  const mid2 = (mode === 'both' && wrapH > 2700) ? findMiddle(0.6) : -1;

  if (mode === 'bottom' || mode === 'both') {
    const last = comps[comps.length - 1];
    last.parentNode.appendChild(makeAdSlot(doc, 'ad-bottom-portal'));
  }
  if (mid1 > 0) comps[mid1].parentNode.insertBefore(makeAdSlot(doc, 'ad-content-1-portal'), comps[mid1]);
  if (mid2 > 0 && mid2 !== mid1) comps[mid2].parentNode.insertBefore(makeAdSlot(doc, 'ad-content-2-portal'), comps[mid2]);
}

// ── 사진 슬라이드 (se-imageGroup se-l-slide) ──
// 실제 모바일: 뷰어 청크 se.26(ImageGroupComponent + MovableCoord, editor-static 1.78.0)가
//   · 드래그 = 손가락 따라 1:1 자유 스크롤 (칸 단위로 끊기지 않음, 관성 있음, 양 끝 bounce 0)
//   · 진행바 thumb 폭 = 보이는 폭 / 전체 폭, left = (100 - thumb폭) × 스크롤 비율
//   · 사진이 화면에 다 들어가면 진행바 숨김, 모바일에선 < > 버튼 제거
//   · 진행바 thumb 도 잡고 끌 수 있음
// 미리보기 iframe 은 스크립트가 막혀 있어 정지 화면이 된다 → 부모(이 content script)에서 같은 동작을 붙인다.
//   스크롤 자체는 브라우저 기본 가로 스크롤 (트랙패드 두 손가락 = 폰 스와이프처럼 자유 스크롤 + 관성)
//   마우스 드래그·진행바 드래그·진행바 갱신은 아래 리스너.
// 진행바 높이(8+24px)가 생기므로 광고 위치 계산(insertAdSlots)보다 먼저 호출할 것.
function enableImageSlides(doc) {
  doc.querySelectorAll('.se-section-imageGroup.se-l-slide').forEach(section => {
    if (section.dataset.pvSlide) return;
    section.dataset.pvSlide = '1';
    const view = section.querySelector('.se-imageGroup-viewer');
    if (!view) return;
    section.querySelectorAll('.se-imageGroup-navigation').forEach(el => el.remove());

    // 발행 글엔 진행바 마크업이 있지만 에디터 DOM 엔 없을 수 있음 → 같은 마크업으로 만들어 네이버 CSS 적용
    let progress = section.querySelector('.se-imageGroup-progress');
    if (!progress) {
      progress = doc.createElement('div');
      progress.className = 'se-imageGroup-progress';
      section.appendChild(progress);
    }
    let thumb = progress.querySelector('.se-imageGroup-thumb');
    if (!thumb) {
      thumb = doc.createElement('div');
      thumb.className = 'se-imageGroup-thumb';
      progress.appendChild(thumb);
    }

    // 에디터의 슬라이드도 같은 스크립트로 움직여서, 에디터에서 넘겨 본 위치가 container 의
    // inline transform(translateX) / left 로 남아 복제된다 → 사진 줄이 왼쪽으로 밀린 채 시작해
    // 오른쪽이 비고, 스크롤 폭 계산도 틀어져 진행바가 사라짐. 위치는 scrollLeft 로만 관리하므로 지운다.
    const container = view.querySelector('.se-imageGroup-container');
    if (container) { container.style.transform = ''; container.style.left = ''; }

    // 네이버 CSS 는 transform 으로 움직이는 전제라 overflow:hidden → 기본 가로 스크롤로 바꾸고 스크롤바만 숨김
    Object.assign(view.style, {
      overflowX: 'auto', overflowY: 'hidden',
      scrollbarWidth: 'none', overscrollBehaviorX: 'contain',
    });
    // 이미지를 끌면 브라우저 기본 "이미지 드래그"가 시작되는 것 방지 (네이버도 dragstart 막음)
    view.querySelectorAll('img').forEach(img => { img.draggable = false; });

    const maxScroll = () => view.scrollWidth - view.clientWidth;
    const sync = () => {
      const vw = view.clientWidth, cw = view.scrollWidth;
      if (!vw || cw <= vw + 1) {          // 다 보임 → 진행바 숨김
        progress.style.display = 'none';
        return;
      }
      const tw = vw / cw * 100;
      progress.style.display = 'block';
      thumb.style.display = 'block';
      thumb.style.width = tw + '%';
      thumb.style.left = Math.min(Math.max((100 - tw) * view.scrollLeft / maxScroll(), 0), 100 - tw) + '%';
    };
    view.addEventListener('scroll', sync, { passive: true });
    view.querySelectorAll('img').forEach(img => { if (!img.complete) img.addEventListener('load', sync); });

    // 마우스로 끌기: 사진 영역은 끈 만큼 반대로, 진행바 thumb 은 막대 비율만큼 같은 방향으로
    const bindDrag = (el, ratio) => {
      let drag = null;
      el.addEventListener('pointerdown', e => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;   // 트랙패드·터치는 기본 스크롤
        drag = { x: e.clientX, left: view.scrollLeft };
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
        e.preventDefault();
      });
      el.addEventListener('pointermove', e => {
        if (drag) view.scrollLeft = drag.left + (e.clientX - drag.x) * ratio();
      });
      const end = () => { drag = null; };
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);
    };
    bindDrag(view, () => -1);
    bindDrag(thumb, () => {
      const track = progress.clientWidth - thumb.offsetWidth;
      return track > 0 ? maxScroll() / track : 0;
    });

    sync();
  });
}

// 미리보기는 에디터가 바뀔 때마다 통째로 다시 그려진다 → 슬라이드를 넘겨 둔 위치가 매번 처음으로 돌아가지 않게 보관
function saveSlidePositions(frame) {
  try {
    return [...frame.contentDocument.querySelectorAll('.se-section-imageGroup.se-l-slide .se-imageGroup-viewer')]
      .map(v => v.scrollLeft);
  } catch (e) { return []; }
}
function restoreSlidePositions(doc, positions) {
  if (!positions || !positions.length) return;
  doc.querySelectorAll('.se-section-imageGroup.se-l-slide .se-imageGroup-viewer')
    .forEach((v, i) => { if (positions[i]) v.scrollLeft = positions[i]; });
}

// iframe 높이를 내부 콘텐츠에 맞춰 늘려 부모(#mobile-preview-body)가 통째로 스크롤되게 함
function sizePreviewFrame(frame, slidePositions) {
  const resize = () => {
    try {
      const d = frame.contentDocument;
      if (d && d.documentElement) frame.style.height = d.documentElement.scrollHeight + 'px';
    } catch (e) {}
  };
  frame.onload = () => {
    // onload = 이미지까지 로드된 뒤 → 컴포넌트 높이가 확정된 상태에서 광고 위치 계산
    try {
      enableImageSlides(frame.contentDocument);
      restoreSlidePositions(frame.contentDocument, slidePositions);
    } catch (e) {}
    try { insertAdSlots(frame.contentDocument, currentAdMode()); } catch (e) {}
    resize(); setTimeout(resize, 300); setTimeout(resize, 1200);
  };
}

function getBodyHTML(docArg) {
  // docArg: 오프라인 테스트 하네스에서 임의 문서를 넘길 수 있게 허용 (기본은 기존 동작)
  const doc = docArg || getIframeDoc() || document;
  let html = '';
  const components = doc.querySelectorAll('.se-component');

  if (components.length > 0) {
    components.forEach(comp => {
      // 제목 컴포넌트는 body에서 제외
      if (titleComponent && (comp === titleComponent || comp.contains(titleComponent) || titleComponent.contains(comp))) return;

      // ① 스티커: 풀사이즈 이미지로 렌더링되지 않도록 별도 처리
      if (comp.classList.contains('se-sticker')) {
        const img = comp.querySelector('img.se-sticker-image, img');
        if (img) html += `<img src="${img.src}" class="preview-sticker" loading="eager" alt="">`;
        return;
      }

      // ② 구분선: 내용 없는 컴포넌트 → <hr>
      if (comp.classList.contains('se-horizontalLine')) {
        html += '<hr class="preview-divider">';
        return;
      }

      // ③ 소제목: se-heading 또는 se-section-documentTitle(내용 레벨) 감지
      if (comp.classList.contains('se-heading')) {
        comp.querySelectorAll('.se-text-paragraph').forEach(p => {
          const text = p.innerText.trim();
          if (text && !isPlaceholder(text)) {
            html += `<p class="preview-heading">${preserveSpaces(p.innerHTML)}</p>`;
          }
        });
        return;
      }

      // ④ 인용구
      if (comp.classList.contains('se-quotation')) {
        let inner = '';
        comp.querySelectorAll('.se-text-paragraph').forEach(p => {
          const text = p.innerText.trim();
          if (isPlaceholder(text)) return;
          inner += text === ''
            ? '<p class="preview-blank">&nbsp;</p>'
            : `<p>${preserveSpaces(p.innerHTML)}</p>`;
        });
        if (inner) html += `<blockquote class="preview-quotation">${inner}</blockquote>`;
        return;
      }

      // ⑤ 영상: 썸네일 + 재생 버튼 오버레이
      if (comp.classList.contains('se-video')) {
        const imgs = validImgs(comp);
        if (imgs.length > 0) {
          const { src, w, h } = imgs[0];
          const ratioStyle = (w && h) ? ` style="aspect-ratio:${w}/${h}"` : '';
          html += `<div class="preview-video-wrap"><img src="${src}" class="preview-video-thumb"${ratioStyle} loading="eager"><div class="preview-video-play">▶</div></div>`;
        }
        return;
      }

      // ⑥ 외부 링크 카드 (OG link)
      if (comp.classList.contains('se-oglink')) {
        const anchor  = comp.querySelector('a[href]');
        const url     = anchor?.href || '#';
        const thumbEl = comp.querySelector('img');
        const thumb   = thumbEl?.getAttribute('data-lazy-src') || thumbEl?.getAttribute('data-src') || thumbEl?.src || '';
        const title   = (
          comp.querySelector('.se-oglink-title, .se-oglink-summary-title')?.innerText ||
          comp.querySelector('[class*="oglink"][class*="title"]')?.innerText || ''
        ).trim();
        const desc = (
          comp.querySelector('.se-oglink-description, .se-oglink-summary-body')?.innerText ||
          comp.querySelector('[class*="oglink"][class*="desc"], [class*="oglink"][class*="body"]')?.innerText || ''
        ).trim();
        let domain = '';
        try { if (url !== '#') domain = new URL(url).hostname.replace(/^www\./, ''); } catch {}
        const card = buildOgLink(url, title, desc, thumb && !thumb.startsWith('data:') ? thumb : null, domain);
        if (card) html += card;
        return;
      }

      // ⑦ se-image(단독) vs se-imageGroup(그룹) 구분 → max-width 여부 결정
      const isStandalone = comp.classList.contains('se-image') && !comp.classList.contains('se-imageGroup');
      const imgs = validImgs(comp);
      if (imgs.length > 0) {
        html += buildImageBlock(imgs, isStandalone);
      }

      // ③ 텍스트: 캡션 클래스 감지해서 별도 스타일 적용
      comp.querySelectorAll('.se-text-paragraph').forEach(p => {
        const text = p.innerText.trim();
        if (isPlaceholder(text)) return;
        const isCaption = !!p.closest('.se-caption');
        const cls = isCaption ? ' class="preview-caption"' : '';
        html += text === '' ? `<p class="preview-blank">&nbsp;</p>` : `<p${cls}>${preserveSpaces(p.innerHTML)}</p>`;
      });
    });
  }
  if (!html) {
    doc.querySelectorAll('.se-text-paragraph').forEach(p => {
      const text = p.innerText.trim();
      if (isPlaceholder(text)) return;
      html += text === '' ? `<p class="preview-blank">&nbsp;</p>` : `<p>${preserveSpaces(p.innerHTML)}</p>`;
    });
  }
  return html || null;
}

function updatePreview() {
  // 제목·작성자·본문 전부 iframe 안에서 네이버 실제 CSS로 렌더.
  // 작성자 영역은 발행 전 에디터엔 없으므로 우리가 가진 데이터로 채워 넣는다.
  const frame = document.getElementById('preview-frame');
  if (!frame) return;
  const today = new Date();
  const author = {
    title: '', category: '',
    nick: previewNick || '',
    date: `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}.`,
    profileSrc: previewProfile || '',
  };
  try { author.title = getTitle() || ''; author.category = getCategory() || ''; } catch (e) {}

  let srcdoc = null;
  try {
    srcdoc = buildPreviewSrcdoc(getIframeDoc() || document, { isEditor: true, author });
  } catch (e) { console.warn('[미리보기] 렌더 오류:', e); }

  sizePreviewFrame(frame, saveSlidePositions(frame));
  if (srcdoc) {
    frame.srcdoc = srcdoc;
  } else {
    // 내용을 못 찾음 → 화면에 진단 정보 표시 (콘솔 안 봐도 원인 파악 가능)
    const d = pickSourceDoc(getIframeDoc() || document);
    frame.srcdoc = '<body style="font:13px sans-serif;padding:16px;color:#c0392b;line-height:1.7">'
      + '⚠️ 미리보기 내용을 못 찾았어요.<br>'
      + 'se-component 수: ' + d.querySelectorAll('.se-component').length + '<br>'
      + 'main-container: ' + !!d.querySelector('.se-main-container') + '<br>'
      + 'se-viewer: ' + !!d.querySelector('.se-viewer') + '</body>';
  }
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

    // 총 item 너비 합계 vs 뷰어 너비 비교 (item 사이 2px gap 포함)
    const GAP = 2;
    const totalWidth    = widths.reduce((a, b) => a + b, 0) + GAP * (n - 1);
    const viewportWidth = viewport.offsetWidth || viewport.clientWidth || 360;

    // 모든 이미지가 뷰어에 한 번에 다 들어오면 → 화살표/진행 바 숨기기
    // (실제 네이버 앱과 동일: se-imageGroup-progress display:none)
    if (totalWidth <= viewportWidth) {
      // 세로(portrait) 이미지가 여러 장 동시에 보일 때 → 가운데 정렬
      //
      // ❌ track에 justify-content:center → track이 block-level flex라 width:auto로
      //    viewport 전체를 채움. flex 아이템은 flex-start 기준이라 왼쪽 정렬 그대로.
      //
      // ✅ viewport를 flex 컨테이너로 바꾸면 track이 flex item이 되어
      //    content 크기(totalWidth)로 자동 축소 → viewport의 justify-content:center로
      //    track 자체가 양쪽 균등 여백으로 가운데 정렬됨
      viewport.style.display        = 'flex';
      viewport.style.justifyContent = 'center';
      viewport.style.alignItems     = 'stretch'; // track 높이 유지 (height:100% 보전)
      if (bar)     bar.style.display     = 'none';
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }

    // 각 이미지로 이동 (개별 이미지 가운데 정렬 기반)
    //
    // 실제 네이버 앱 "중앙 기준 배치":
    //   이미지[index]를 viewport 가운데에 놓는 idealCenterOffset 계산 후
    //   0 ~ maxOffset 범위로 clamp
    //   → 3장+ portrait 중간 이미지는 완전히 가운데 정렬됨
    //   → 양 끝 이미지는 clamp되어 각각 왼쪽/오른쪽 경계에 닿음
    const maxOffset = Math.max(0, totalWidth - viewportWidth);

    function goTo(index) {
      carousel.dataset.index = index;
      const itemStart = widths.slice(0, index).reduce((a, b) => a + b, 0) + GAP * index;
      // 이 이미지를 viewport 가운데에 놓으려면 얼마나 당겨야 하는가
      const idealOffset = itemStart - Math.floor((viewportWidth - widths[index]) / 2);
      // 범위 내 clamp: 음수(왼쪽 넘어감) → 0, maxOffset 초과(오른쪽 여백) → maxOffset
      const offset = Math.max(0, Math.min(idealOffset, maxOffset));
      track.style.transform = `translateX(-${offset}px)`;
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

    // 초기 상태: index=0, translateX=0 (이미지1 왼쪽부터 표시)
    // goTo()의 idealOffset 기반 centering은 버튼 탭 시에만 적용
    track.style.transform = 'translateX(0)';
  });
}

// ── 에디터 전체 스캔 ──
// SE4는 가상 스크롤(virtual rendering)을 사용해 뷰포트 안 컴포넌트만 DOM에 렌더링함.
// 에디터를 맨 아래까지 instant 스크롤 후 복귀하면 SE4가 모든 컴포넌트를 DOM에 추가 →
// 이후 getBodyHTML()이 전체 이미지를 읽을 수 있음.
async function scanEditorContent() {
  const btn = document.getElementById('preview-scan-btn');
  if (btn) { btn.textContent = '⏳'; btn.disabled = true; }

  const editorDoc = getIframeDoc();

  // 스크롤 가능한 컨테이너 탐색 (iframe 내부 → outer 순)
  const scrollEl =
    editorDoc?.querySelector('.se-main-container, .se-editor, .se-wrapper') ||
    editorDoc?.documentElement ||
    document.querySelector('.se-main-container') ||
    document.documentElement;

  if (scrollEl) {
    const savedTop  = scrollEl.scrollTop;
    const maxTop    = scrollEl.scrollHeight - scrollEl.clientHeight;

    if (maxTop > 0) {
      // ① 맨 아래로 순간이동 (behavior:instant → 시각적 최소화)
      scrollEl.scrollTop = maxTop;
      // ② IntersectionObserver 콜백 대기 (비동기 처리 시간)
      await new Promise(r => setTimeout(r, 400));
      // ③ 원래 위치 복귀
      scrollEl.scrollTop = savedTop;
      await new Promise(r => setTimeout(r, 100));
    }
  }

  updatePreview();
  if (btn) { btn.textContent = '⟳'; btn.disabled = false; }
}

// 이미 옵저버를 붙인 문서 (중복 부착 방지 — 폴링 중 매 틱 호출되므로 필수)
const observedDocs = new WeakSet();

// iframe 내부 변경은 부모 document 옵저버에 전파되지 않으므로 문서마다 따로 붙인다.
// 늦게 생긴 iframe 도 잡히도록 준비 폴링에서 반복 호출된다.
function observeIframe() {
  for (const doc of getContentIframeDocs()) {
    if (observedDocs.has(doc)) continue;
    observedDocs.add(doc);
    new MutationObserver(debouncedUpdate).observe(doc.body, { childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:['class'] });
  }
}

// 글쓰기 진입 경로가 여러 개다:
//   새 글      → PostWriteForm.naver
//   기존 글 수정 → PostUpdateForm.naver?...&logNo=...   ('write' 가 없음!)
// URL 문자열만 믿지 말고 실제 에디터 DOM 존재도 같이 본다.
function isEditorPage() {
  // 글쓰기·수정 주소 형태 (블로그 아이디에 'editor'·'write' 가 들어간 발행 글을 오인하지 않게
  // 아이디 자리가 아닌 "파일명·경로·쿼리" 패턴만 본다)
  //   PostWriteForm.naver · PostUpdateForm.naver · GoBlogWrite.naver 등 *write*/*update*.naver
  //   /{id}/postwrite · /{id}/postupdate · ?Redirect=Write|Update
  const href = window.location.href.toLowerCase();
  const byUrl = /[a-z]*(?:write|update)[a-z]*\.naver|\/post(?:write|update)(?:[/?#]|$)|[?&]redirect=(?:write|update)\b/.test(href);
  const byDom = !byUrl && hasEditorDom();
  if (byUrl || byDom) dlog('에디터 감지:', byUrl ? '주소' : 'DOM', href);
  return byUrl || byDom;
}

// top document + 모든 iframe 에서 SE4 "에디터" 흔적을 찾는다.
// (에디터는 보통 mainFrame iframe 안이라 top 만 보면 놓친다.)
// ⚠️ .se-component / .se-main-container 는 발행 글 페이지에도 있다 → 발행 글은 이를
//    .se-viewer 로 감싸므로, 컴포넌트는 있는데 .se-viewer 가 없는 문서만 에디터로 본다.
function hasEditorDom() {
  // 편집 중에만 있는 흔적: 입력 가능 영역·툴바·플레이스홀더 (발행 글 페이지엔 없음)
  const EDIT_ONLY = '[contenteditable="true"], .se-toolbar, .se-placeholder, .se-component-toolbar, .se-section-control';
  const isEditorDoc = d => {
    try {
      if (!d.querySelector('.se-main-container, .se-component')) return false;
      return !d.querySelector('.se-viewer') || !!d.querySelector(EDIT_ONLY);
    } catch (e) { return false; }
  };
  return isEditorDoc(document) || getContentIframeDocs().some(isEditorDoc);
}

function init() {
  if (!isEditorPage()) return false;

  const panel = createPanel();
  const observer = new MutationObserver((mutations) => {
    if (mutations.every(m => panel.contains(m.target))) return;
    debouncedUpdate();
  });
  observer.observe(document.body, { childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:['class'] });

  // SE4 부팅 시점은 네트워크·글 크기에 따라 제각각이라 고정 타임아웃으로는 못 맞춘다.
  // 실제 컴포넌트가 잡힐 때까지 폴링하고, 잡힌 뒤에도 몇 번 더 갱신해 뒤늦은 로드를 흡수한다.
  let ticks = 0, settled = 0;
  const ready = setInterval(() => {
    ticks++;
    resolveViewerCSS();   // 현재 SE 버전 반영 (에디터 CSS 로드 후)
    observeIframe();      // 늦게 붙은 에디터 iframe 도 이 시점에 감시 시작
    updatePreview();

    // appbar 블로그 이름: 현재 페이지 제목에서 찾았을 때만 갱신
    // (못 찾으면 getBlogInfo 가 '내 블로그' 기본값을 주므로 덮어쓰지 않음 — fetch 결과가 채움)
    const info = getBlogInfo();
    if (info.blogName !== '내 블로그') setAppbarBlogName(info.blogName);

    if (hasEditorDom()) settled++;
    // 에디터를 찾고 3틱 더 돌렸거나, 30초 지나면 폴링 종료 (이후엔 옵저버가 담당)
    if (settled >= 3 || ticks > 60) clearInterval(ready);
  }, 500);

  // ⟳ 버튼: 기존 글 수정 시 수동으로 전체 이미지 재스캔
  document.getElementById('preview-scan-btn')
    ?.addEventListener('click', () => scanEditorContent());

  // ── 작성자 정보 저장 후 미리보기 갱신 (헤더는 iframe 안에서 그림) ──
  function applyUserInfo(nickname, profileImg) {
    if (nickname) previewNick = nickname;
    if (profileImg) previewProfile = profileImg;
    updatePreview();
  }

  // Step 1: 현재 페이지 script 태그 즉시 스캔 (네트워크 요청 없음)
  const nickFromPage = getNicknameFromCurrentPage();
  if (nickFromPage) {
    dlog('현재 페이지에서 닉네임 발견:', nickFromPage);
    applyUserInfo(nickFromPage, null);
  }

  // Step 2: 그래도 없으면 외부 페이지 fetch
  const blogId = extractBlogId();

  // 원격 규칙 (rules.json) — 저장본으로 이미 적용 중, 오래됐으면 새로 받음
  refreshRemoteRules();

  // 광고 설정 자동 감지 (선택이 '자동'일 때 사용)
  fetchAdSetting(blogId).then(mode => {
    if (!mode) return;
    adModeDetected = mode;
    const opt = document.querySelector('#mobile-preview-ad option[value="auto"]');
    const lbl = (AD_MODES.find(m => m.value === mode) || {}).label || '';
    if (opt) opt.textContent = '광고: 자동(' + lbl.replace(/^광고:? ?/, '') + ')';
    if (adModeSetting === 'auto') updatePreview();
  });
  // 블로그 이름은 글쓰기 페이지 제목에 없는 경우가 많아 닉네임이 있어도 fetch 한다
  if (blogId && (!nickFromPage || !previewBlogName)) {
    fetchBlogUserInfo(blogId).then(({ nickname, profileImg, blogName }) => {
      if (blogName) setAppbarBlogName(blogName);
      if (!nickFromPage) applyUserInfo(nickname, profileImg);
    });
  }
}

// 진입 시점에 에디터 판별이 안 될 수 있다 (iframe·에디터 스크립트가 아직 안 붙음).
// 한 번 실패했다고 영구 포기하지 말고 붙을 때까지 지켜본다.
let started = false;
function tryStart() {
  if (started) return;
  if (init() !== false) started = true;
}

function bootstrap() {
  tryStart();
  if (started) return;
  let ticks = 0;
  const watch = setInterval(() => {
    tryStart();
    // 30초 안에 에디터가 안 나타나면 글쓰기 페이지가 아닌 것으로 보고 중단
    if (started || ++ticks > 60) clearInterval(watch);
  }, 500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
