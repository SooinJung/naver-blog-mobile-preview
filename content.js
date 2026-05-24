function createPanel() {
  const panel = document.createElement('div');
  panel.id = 'mobile-preview-panel';
  panel.innerHTML = `
    <div id="mobile-preview-header">📱 모바일 미리보기</div>
    <div id="mobile-preview-body">글을 쓰기 시작하면 여기에 미리보기가 나타나요!</div>
  `;
  document.body.appendChild(panel);
  return panel;
}

function debounce(fn, delay) {
  let timer = null;
  return function () { clearTimeout(timer); timer = setTimeout(fn, delay); };
}

// iframe 문서 가져오기 (같은 origin만)
function getIframeDoc() {
  for (const iframe of document.querySelectorAll('iframe')) {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (doc && doc.body) return doc;
    } catch (e) {}
  }
  return null;
}

// 본문 HTML 추출 — 텍스트 단락만 깔끔하게
function getBodyHTML() {
  const doc = getIframeDoc() || document;

  // 1) 텍스트 단락 개별 수집 (가장 깔끔)
  const paragraphs = doc.querySelectorAll('.se-text-paragraph');
  if (paragraphs.length > 0) {
    let html = '';
    paragraphs.forEach(p => {
      const text = p.innerText.trim();
      if (text) html += `<p>${p.innerHTML}</p>`;
    });
    if (html) return html;
  }

  // 2) 컴포넌트 콘텐츠 수집
  const components = doc.querySelectorAll('.se-component-content');
  if (components.length > 0) {
    let html = '';
    components.forEach(c => { html += c.innerHTML; });
    if (html.trim()) return html;
  }

  return null;
}

function updatePreview() {
  const previewBody = document.getElementById('mobile-preview-body');
  if (!previewBody) return;

  const html = getBodyHTML();
  if (html) {
    previewBody.innerHTML = html;
  }
}

const debouncedUpdate = debounce(updatePreview, 300);

function observeIframe() {
  const doc = getIframeDoc();
  if (!doc) return;

  const obs = new MutationObserver(debouncedUpdate);
  obs.observe(doc.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

function init() {
  const href = window.location.href.toLowerCase();
  const isEditorPage = href.includes('postwrite') || href.includes('write')
    || document.querySelector('.se-main-container');
  if (!isEditorPage) return;

  const panel = createPanel();

  // 메인 DOM 감시 (패널 변화는 무시)
  const observer = new MutationObserver((mutations) => {
    if (mutations.every(m => panel.contains(m.target))) return;
    debouncedUpdate();
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  setTimeout(() => { observeIframe(); updatePreview(); }, 1500);
  setTimeout(() => { observeIframe(); updatePreview(); }, 4000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  setTimeout(init, 2000);
}
