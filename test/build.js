#!/usr/bin/env node
/*
 * 오프라인 미리보기 비교 도구 빌드 스크립트
 *
 * test/raw/*.html (실제 네이버 모바일 글 원본) 에서 본문(.se-viewer)만 추출해
 * test/preview-test.html 하나로 합친다.
 *
 * 생성된 preview-test.html 은 더블클릭으로 열면:
 *   왼쪽  = 실제 네이버 렌더링 (진짜 뷰어 CSS 적용) = "정답"
 *   오른쪽 = 우리 익스텐션 출력 (../content.js 의 getBodyHTML + ../style.css)
 *
 * 사용법:  node test/build.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const RAW_DIR = path.join(ROOT, 'raw');

// 비교할 샘플 목록 (파일명 → 화면에 보일 이름)
const SAMPLES = [
  { file: 'official.html', name: '네이버 공식 (표·이미지그룹·구분선)' },
  { file: 'pweffer.html',  name: 'pweffer 후기 (인용구·스티커 다수)' },
  { file: 'dopgi.html',    name: 'dopgi 후기 (스티커 60개)' },
  { file: 'leeshin.html',  name: 'leeshin 후기 (인용구·스티커)' },
  { file: 'sj1111h.html',  name: 'sj1111h 후기 (인용구 20개)' },
];

// 실제 네이버 모바일 페이지가 불러오는 CSS (CDN 원본 = 정답 스타일)
// 실제 순서대로: 블로그 모바일 레이아웃(lego) → SE 뷰어 컴포넌트
const REAL_CSS = [
  'https://ssl.pstatic.net/t.static.blog/nmobile/versioning/lego_w-261743111_https.css',
  'https://ssl.pstatic.net/t.static.blog/nmobile/versioning/lego_view-63655323_https.css',
  'https://ssl.pstatic.net/static/blog/se/css/se_viewer_blog_mobile_v1.43.1.css',
  'https://editor-static.pstatic.net/v/basic/1.78.0/css/se.viewer.css?v=1.78.0-20260629110340',
];

// 실제 페이지에서 .se-viewer 를 감싸는 상위 틀 (여기에 너비·여백 규칙이 걸려있음)
const WRAP_OPEN = '<div class="post_ct wrap_rabbit" id="viewTypeSelector">';
const WRAP_CLOSE = '</div>';

// ── HTML 문자열에서 특정 class 를 가진 <div> 서브트리를 균형 매칭으로 추출 ──
function extractDiv(html, className) {
  const openRe = new RegExp(`<div[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>`, 'i');
  const m = openRe.exec(html);
  if (!m) return null;
  const start = m.index;
  // start 이후를 <div ...> / </div> 토큰으로 스캔하며 깊이 계산
  const tokenRe = /<div\b[^>]*>|<\/div>/gi;
  tokenRe.lastIndex = start;
  let depth = 0;
  let tok;
  while ((tok = tokenRe.exec(html)) !== null) {
    if (tok[0][1] === '/') depth--;      // </div>
    else depth++;                        // <div ...>
    if (depth === 0) {
      return html.slice(start, tok.index + tok[0].length);
    }
  }
  return null; // 균형이 안 맞으면 실패
}

// ── 렌더링에 불필요하고 위험한 요소 제거 ──
function sanitize(fragment) {
  return fragment
    // <script>...</script> 통째로 제거 (JSON 데이터 스크립트 포함)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    // 주석 제거
    .replace(/<!--[\s\S]*?-->/g, '')
    // 혹시 남은 닫는 태그가 template 홀더를 깨지 않도록 무력화
    .replace(/<\/script/gi, '<\\/script')
    // 지연로딩 이미지: 실제 이미지(data-lazy-src)를 src 로 승격 → 정답 화면에 진짜 이미지 표시
    .replace(/<img\b[^>]*>/gi, (tag) => {
      const lazy = /data-lazy-src="([^"]+)"/i.exec(tag);
      if (lazy) tag = tag.replace(/\bsrc="[^"]*"/i, `src="${lazy[1]}"`);
      return tag;
    });
}

const fixtures = [];
for (const s of SAMPLES) {
  const p = path.join(RAW_DIR, s.file);
  if (!fs.existsSync(p)) {
    console.warn(`⚠️  건너뜀 (파일 없음): ${s.file}`);
    continue;
  }
  const html = fs.readFileSync(p, 'utf8');
  const viewer = extractDiv(html, 'se-viewer');
  if (!viewer) {
    console.warn(`⚠️  .se-viewer 추출 실패: ${s.file}`);
    continue;
  }
  const clean = sanitize(viewer);
  const id = 'fx-' + s.file.replace(/\.html$/, '');
  fixtures.push({ id, name: s.name, html: clean });
  console.log(`✓ ${s.file}  →  ${(clean.length / 1024).toFixed(0)}KB`);
}

if (!fixtures.length) {
  console.error('추출된 샘플이 없습니다. test/raw/ 에 원본 html 이 있는지 확인하세요.');
  process.exit(1);
}

const templates = fixtures
  .map((f) => `<script type="text/template" id="${f.id}">\n${f.html}\n</script>`)
  .join('\n');

const pickerOptions = fixtures
  .map((f, i) => `<option value="${f.id}"${i === 0 ? ' selected' : ''}>${f.name}</option>`)
  .join('\n      ');

const out = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>미리보기 비교 도구</title>
<!-- 우리 익스텐션 스타일 (오른쪽 패널용) -->
<link rel="stylesheet" href="../style.css">
<style>
  body { margin: 0; font-family: -apple-system, "맑은 고딕", sans-serif; background: #eef0f2; }
  .harness-toolbar {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
    padding: 12px 16px; background: #222; color: #fff;
  }
  .harness-toolbar h1 { font-size: 15px; margin: 0; font-weight: 700; }
  .harness-toolbar select { font-size: 13px; padding: 5px 8px; border-radius: 6px; border: none; }
  .harness-toolbar .hint { font-size: 12px; color: #bbb; }
  .compare { display: flex; gap: 24px; align-items: flex-start; padding: 20px; justify-content: center; }
  .pane { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .pane h3 { font-size: 13px; margin: 0; color: #444; }
  .pane .tag { font-size: 11px; color: #888; }
  /* 정답 화면 = 실제 네이버 렌더링을 iframe 으로 격리 */
  #real-frame {
    width: 393px; height: 82vh; border: 1px solid #ccc; border-radius: 20px;
    background: #fff; box-shadow: 0 6px 24px rgba(0,0,0,.14);
  }
  /* 우리 패널: 원래 position:fixed 를 하네스에선 제자리(static)로 강제 */
  #ours-mount #mobile-preview-panel {
    position: static !important; top: auto; right: auto;
    width: 393px !important; height: 82vh;
    box-shadow: 0 6px 24px rgba(0,0,0,.14);
  }
  /* 컨트롤 바(닫기·재스캔 등 익스텐션 자체 UI)는 비교에 불필요 → 숨김 */
  #ours-mount #mobile-preview-header { display: none; }
  #mobile-preview-toggle { display: none !important; }
</style>
</head>
<body>

<div class="harness-toolbar">
  <h1>📱 미리보기 비교 도구</h1>
  <label>샘플 글:
    <select id="sample-picker">
      ${pickerOptions}
    </select>
  </label>
  <span class="hint">왼쪽 = 실제 네이버(정답) · 오른쪽 = 우리 익스텐션 · 다르면 그게 고칠 부분</span>
</div>

<div class="compare">
  <div class="pane">
    <h3>실제 네이버 <span class="tag">(정답)</span></h3>
    <iframe id="real-frame"></iframe>
  </div>
  <div class="pane">
    <h3>우리 익스텐션 <span class="tag">(현재 결과)</span></h3>
    <div id="ours-mount"></div>
  </div>
</div>

<!-- ── 실제 글 본문 조각들 (렌더링 안 되는 비활성 template) ── -->
${templates}

<!-- 우리 익스텐션 로직 (init() 은 에디터 페이지가 아니라 자동으로 no-op) -->
<script src="../content.js"></script>
<script>
  const REAL_CSS = ${JSON.stringify(REAL_CSS)};
  const WRAP_OPEN = ${JSON.stringify(WRAP_OPEN)};
  const WRAP_CLOSE = ${JSON.stringify(WRAP_CLOSE)};

  // 오른쪽: 우리 패널 1회 생성 후 #ours-mount 로 이동
  createPanel();
  document.getElementById('ours-mount').appendChild(
    document.getElementById('mobile-preview-panel')
  );

  function render(sampleId) {
    const raw = document.getElementById(sampleId).textContent;

    // ── 왼쪽: 실제 네이버 CSS + 원본 본문 → iframe ──
    const frame = document.getElementById('real-frame');
    frame.srcdoc =
      '<!doctype html><html><head><meta charset="utf-8">' +
      REAL_CSS.map(u => '<link rel="stylesheet" href="' + u + '">').join('') +
      '<style>html,body{margin:0;padding:0;overflow-y:auto;height:100%;background:#fff}' +
      '#viewTypeSelector{padding-bottom:40px}</style></head><body>' +
      WRAP_OPEN + raw + WRAP_CLOSE + '</body></html>';

    // ── 오른쪽: 네이버 실제 CSS iframe (제목·작성자·본문 전부, 발행 뷰어 DOM 그대로) ──
    // 발행글엔 작성자 영역이 이미 있으므로 그대로 렌더 → 정답과 동일. viewerize 불필요.
    const ourDoc = new DOMParser().parseFromString(raw, 'text/html');
    const frame2 = document.getElementById('preview-frame');
    const srcdoc = buildPreviewSrcdoc(ourDoc, { isEditor: false });
    if (frame2 && srcdoc) { sizePreviewFrame(frame2); frame2.srcdoc = srcdoc; }
  }

  const picker = document.getElementById('sample-picker');
  picker.addEventListener('change', () => render(picker.value));
  render(picker.value);
</script>
</body>
</html>
`;

const outPath = path.join(ROOT, 'preview-test.html');
fs.writeFileSync(outPath, out, 'utf8');
console.log(`\n✅ 생성 완료: ${outPath}`);
console.log(`   → Finder 에서 이 파일을 더블클릭하면 크롬에서 열립니다.`);
