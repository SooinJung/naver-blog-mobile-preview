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
      <button id="preview-scan-btn" title="전체 이미지 재스캔">⟳</button>
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

      <!-- 본문 스크롤 영역 (제목·작성자·본문 전부 iframe 안에서 네이버 CSS로 렌더) -->
      <div id="mobile-preview-body">
        <iframe id="preview-frame" scrolling="no" title="미리보기" sandbox="allow-same-origin" allow="autoplay"></iframe>
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

    return { nickname, profileImg };
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
        console.log('[미리보기] frameset 감지 → mainFrame fetch:', frameUrl);
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
      console.log('[미리보기] fetch 시도:', url);
      const doc = await fetchAndParse(url);
      if (!doc) continue;
      const result = extractFromDoc(doc);
      if (result.nickname || result.profileImg) {
        console.log('[미리보기] fetch 결과 →', result);
        return result;
      }
    } catch (e) {
      console.log('[미리보기] fetch 실패:', url, e);
    }
  }

  console.log('[미리보기] 모든 fetch 실패');
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
const NAVER_VIEWER_CSS_FALLBACK = [
  'https://ssl.pstatic.net/t.static.blog/nmobile/versioning/lego_w-261743111_https.css',
  'https://ssl.pstatic.net/t.static.blog/nmobile/versioning/lego_view-63655323_https.css',
  'https://ssl.pstatic.net/static/blog/se/css/se_viewer_blog_mobile_v1.43.1.css',
  'https://editor-static.pstatic.net/v/basic/1.78.0/css/se.viewer.css',
];
let viewerCssUrls = NAVER_VIEWER_CSS_FALLBACK.slice();

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

// 고정 버전 대신 현재 페이지에서 최신 CSS URL을 찾아 갱신 (없으면 fallback 유지).
// 특히 본문 스타일 se.viewer.css 는 로드된 SE 버전(.../v/basic/<버전>/)에서 재구성해 최신화.
function resolveViewerCSS() {
  const hrefs = collectPageCssHrefs();
  const next = NAVER_VIEWER_CSS_FALLBACK.slice();
  ['lego_w', 'lego_view', 'se_viewer_blog_mobile', 'se.viewer.css'].forEach(pat => {
    const found = hrefs.find(h => h.includes(pat));
    if (found) {
      const i = next.findIndex(u => u.includes(pat));
      if (i >= 0) next[i] = found;
    }
  });
  const verHref = hrefs.find(h => /editor-static\.pstatic\.net\/v\/basic\/[\d.]+\//.test(h));
  const vm = verHref && verHref.match(/\/v\/basic\/([\d.]+)\//);
  if (vm) {
    const i = next.findIndex(u => u.includes('se.viewer.css'));
    if (i >= 0) next[i] = `https://editor-static.pstatic.net/v/basic/${vm[1]}/css/se.viewer.css`;
  }
  viewerCssUrls = next;
  try { console.log('[미리보기] 뷰어 CSS 확정:', viewerCssUrls); } catch (e) {}
}

// 글쓰기 에디터에만 있는 편집 UI(컨트롤 버튼·툴바·플레이스홀더·접근성 텍스트) 제거.
// 발행 뷰어에는 없는 요소라 미리보기에 그대로 두면 "위치이동/제목/삭제/취소/확인" 같은
// 정체불명 텍스트가 보인다.
function stripEditorUI(root) {
  const sel = [
    'button', 'script', 'style', 'noscript',
    '.se-blind', '.se-placeholder', '.se-placeholderText', '.se-placeholder-text',
    '.se-controls', '.se-control', '.se-control-panel',
    '.se-section-control', '.se-component-control',
    '.se-toolbar', '.se-module-toolbar', '.se-toolbar-container',
    '.se-drag-handle', '.se-resize-handle', '.se-handle',
    '.se-tooltip', '.se-help', '.se-guide', '.se-guideline',
  ].join(',');
  root.querySelectorAll(sel).forEach(el => { try { el.remove(); } catch (e) {} });
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
    `#viewTypeSelector{padding-bottom:24px}</style></head>` +
    `<body><div class="post_ct wrap_rabbit" id="viewTypeSelector">${inner}</div></body></html>`;
}

// iframe 높이를 내부 콘텐츠에 맞춰 늘려 부모(#mobile-preview-body)가 통째로 스크롤되게 함
function sizePreviewFrame(frame) {
  const resize = () => {
    try {
      const d = frame.contentDocument;
      if (d && d.documentElement) frame.style.height = d.documentElement.scrollHeight + 'px';
    } catch (e) {}
  };
  frame.onload = () => { resize(); setTimeout(resize, 300); setTimeout(resize, 1200); };
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
  } catch (e) { console.log('[미리보기] 렌더 오류:', e); }

  sizePreviewFrame(frame);
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

function observeIframe() {
  const doc = getIframeDoc();
  if (!doc) return;
  new MutationObserver(debouncedUpdate).observe(doc.body, { childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:['class'] });
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
  observer.observe(document.body, { childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:['class'] });

  setTimeout(() => {
    resolveViewerCSS();   // 현재 SE 버전 반영 (에디터 CSS 로드 후)
    observeIframe();
    updatePreview();
    // appbar 블로그 이름만 갱신 (author 닉네임은 applyUserInfo가 담당 — 덮어쓰지 않음)
    const info = getBlogInfo();
    const appbarName = document.querySelector('.appbar-blog-name');
    if (appbarName) appbarName.textContent = info.blogName;
  }, 1500);
  setTimeout(() => { resolveViewerCSS(); observeIframe(); updatePreview(); }, 4000);

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
    console.log('[미리보기] 현재 페이지에서 닉네임 발견:', nickFromPage);
    applyUserInfo(nickFromPage, null);
  }

  // Step 2: 그래도 없으면 외부 페이지 fetch
  const blogId = extractBlogId();
  if (blogId && !nickFromPage) {
    fetchBlogUserInfo(blogId).then(({ nickname, profileImg }) => {
      applyUserInfo(nickname, profileImg);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  setTimeout(init, 2000);
}
