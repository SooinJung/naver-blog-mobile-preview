# TODO & 이슈 트래커

> 실제 네이버 블로그 모바일 vs 현재 익스텐션 미리보기 차이 기록  
> 참고 스펙: `mobile_design_spec.md`

---

## ✅ 해결 완료

| 항목 | 내용 | 해결 방법 |
|------|------|----------|
| 텍스트 줄바꿈 위치 어긋남 | font-size 13px → 실측 15px 반영 안 됨 | font-size: 15px, line-height: 27px (1.8배), word-break: break-word 적용 |
| GNB 헤더 배경색 | 익스텐션 컨트롤 바가 초록색 → 실제 앱은 흰 배경 | `#mobile-preview-header` 배경 #f8f8f8(회색)으로 변경 |
| 스티커(`se-sticker`) 풀사이즈 렌더링 | 스티커를 일반 이미지로 인식 → 캐러셀로 표시 | `se-sticker` 클래스 감지 후 80px 소형 이미지로 별도 렌더링 |
| 폰트 클래스 미반영 | ��든 텍스트가 NanumGothic으로 렌더링됨 | `se-ff-*` 클래스별 font-family 규칙 추가 (se.viewer.css 실측값 기준), `#mobile-preview-body`는 시스템 폰트 기본값 유지 |
| 단독 이미지 max-width | `se-image`(단독)도 full-bleed 처리됨 | `se-image` vs `se-imageGroup` 구분 → 단독은 `max-width: 100%` + 가운데 정렬 |
| 이미지 캡션 스타일 | `se-caption` 클래스 무시 → 본문과 동일한 크기로 표시 | `se-caption` 감지 시 `preview-caption` 클래스 부여 (12px, #999 회색) |
| 텍스트→이미지 상단 간격 | 이미지 top margin 8px → 실측 `--se-imageGroup-base-spacing-mobile: 20px` | `.preview-carousel`, `.preview-single-img` margin-top 8px → 20px |
| 슬라이더 바 양쪽 여백 없음 | 슬라이더 바가 full-bleed 너비로 렌더링됨 → 실제 앱은 콘텐츠 폭 기준(side padding 20px 안쪽) | `.preview-slider-bar` margin 좌우 20px 추가, width: 100% 제거 |
| 이미지 간 gap 없음 | 캐러셀 아이템이 완전히 붙어 있음 → 실제 앱은 2px 간격 | `.preview-carousel-item + .preview-carousel-item { margin-left: 2px }` + JS offset 보정 |
| 이미지 캡션 가운데 정렬 & 간격 | 캡션이 왼쪽 정렬, 이미지→캡션/캡션→텍스트 간격 부정확 | `text-align: center`, `margin-top: -10px`(→10px), `margin-bottom: 20px` (실측값 반영) |
| 카테고리 하드코딩 | `String(today.getFullYear())`로 연도 고�� | `getCategory()` 함수 추가, 에디터 DOM에서 카테고리 추출 시도 후 fallback |

---

## 🔴 미해결 — 이미지 슬라이딩 버그

### A. 슬라이드 끝 여백
- **증상**: 마지막 이미지까지 넘기면 오른쪽에 빈 공간이 남음  
- **실제 앱**: 이미지 개수만큼 딱 맞게 슬라이딩 후 더 이상 넘어가지 않음  
- **관련**: `content.js` → `initCarousels()`, `goTo()` 오버스크롤 방지 로직

### B. 세로 이미지 좌측 쏠림
- **증상**: 슬라이드에 세로 이미지 2장인 경우 왼쪽에 딱 붙어서 나열됨 (실제 앱은 중앙 기준 배치)
- **관련**: item 너비 계산 방식 또는 track 시작 offset

---

## 🟡 미해결 — 디자인 디테일

### C. 본문 외 텍스트 스타일 미구현
- 소제목, 인용구, 구분선 등 SE4 컴포넌트 스타일 없음
- **관련**: `content.js` → `getBodyHTML()`에서 각 컴포넌트 타입별 처리 추가 필요

### D. 손글씨 폰트 웹폰트 URL 미확인
- `se-ff-nanumdasisijaghae` (다시시작해), `se-ff-nanumbareunhipi` (바른히피), `se-ff-nanumuriddalsongeulssi` (우리딸손글씨)의 woff2 파일 URL 검증 필요
- 현재 `@font-face` 미등록 상태 → 해당 폰트 선택 시 fallback 렌더링

---

## 🟢 잘 구현된 항목 (레퍼런스)

| 항목 | 실제 앱 | 현재 구현체 |
|------|---------|------------|
| 폰트 크기 | `se-fs-fs13` = 실측 15px | `font-size: 15px` ✅ |
| line-height | 1.8배 (27px) | `line-height: 27px` ✅ |
| 이미지 슬라이드 방식 | VIEWER_H 고정 + item 너비 비율 계산 | `VIEWER_H = 294`, `itemWidths = VIEWER_H × w/h` ✅ |
| 슬라이드 이동 | px 기반 `translateX` | `translateX(-${offset}px)` ✅ |
| 진행 바 방식 | thumb `width=1/n`, `left`만 이동 | `fill.style.left = index/n × 100%` ✅ |
| 이미지 모두 뷰에 들어올 때 진행 바 숨김 | `display:none` | `totalWidth <= viewportWidth → hide` ✅ |
| 녹색 포인트 컬러 | `#03C75A` | `#03C75A` ✅ |
| `data-width/height` 비율 활용 | SE4 에디터 속성 | `img.getAttribute('data-width')` ✅ |
| 텍스트 color | `rgb(68, 68, 68)` | `rgb(68, 68, 68)` ✅ |
| 폰트 클래스 매핑 | `se-ff-system` ~ `se-ff-pretendard` 10종 | CSS 클래스 규칙 전부 정의 ✅ |
