# 네이버 블로그 모바일 디자인 스펙

> **레퍼런스 소스**: `phone` 파일 (iPhone iOS 18.7 / Safari 기준 캡처, 2026-05-04)  
> **SE 버전**: 스마트에디터 4 (SE4), viewer v1.76.0  
> **용도**: 익스텐션 모바일 미리보기 패널 구현 시 참조 — `phone` 파일 직접 파싱 대신 이 파일을 사용할 것

---

## 1. 뷰포트 & 전체 레이아웃

| 항목 | 값 |
|------|----|
| 기기 | iPhone (390px 너비 기준) |
| viewport meta | `width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover` |
| 본문 래퍼 클래스 | `.post_ct.wrap_rabbit` > `.view` > `.se-viewer.se-theme-default` |
| 본문 래퍼 인라인 스타일 | `font-size: 9pt; font-family: '7367_9'` |
| GNB(상단 바) 클래스 | `.Ngnb.gnb_bg_white` |
| GNB 로고 색상 | 초록 (`logo_blog_green`) |
| 배경색 | 흰색 (white) |

---

## 2. 폰트

### 2-1. 웹폰트
| 폰트 | URL | 포맷 |
|------|-----|------|
| NanumGothic Regular | `https://editor-static.pstatic.net/c/resources/common/fonts/se-nanumgothic-regular.woff2` | woff2 (preload) |

### 2-2. CSS 클래스 기반 폰트 크기 (`se-fs-*`)
| 클래스 | 크기 | 용도 |
|--------|------|------|
| `se-fs-fs13` | 13pt | **본문 기본 텍스트** (압도적 다수 사용) |
| `se-fs-fs28` | 28pt | 강조 텍스트 (bold/italic 병용) |
| `se-fs-` | 미지정 | 제목(documentTitle), 캡션 등 CSS 파일에서 처리 |

### 2-3. 폰트 패밀리 (`se-ff-*`)
| 클래스 | 의미 |
|--------|------|
| `se-ff-system` | 시스템 기본 폰트 (본문 전체 사용) |
| `se-ff-` | 미지정 (캡션 등 일부) |

### 2-4. 실제 span 패턴 예시
```html
<!-- 일반 본문 -->
<span class="se-fs-fs13 se-ff-system">텍스트</span>

<!-- 강조 (크고 굵고 기울임) -->
<span class="se-fs-fs28 se-ff-system"><i><b>35900!!!원</b></i></span>

<!-- 캡션 -->
<span class="se-fs- se-ff-  ">캡션 텍스트</span>
```

---

## 3. SE4 컴포넌트 구조

### 3-1. 컴포넌트 종류 및 빈도 (이 포스트 기준)
| 컴포넌트 클래스 | 개수 | 설명 |
|----------------|------|------|
| `se-component se-text` | 12 | 텍스트 단락 |
| `se-component se-imageGroup` | 10 | 이미지 그룹 (슬라이드) |
| `se-component se-sticker` | 2 | 스티커 이모지 |
| `se-component se-image` | 2 | 단독 이미지 |
| `se-component se-documentTitle` | 1 | 포스트 제목 |

### 3-2. 레이아웃 클래스 (`se-l-*`)
| 클래스 | 개수 | 설명 |
|--------|------|------|
| `se-l-default` | 34 | 기본 여백 레이아웃 |
| `se-l-slide` | 20 | 슬라이드 레이아웃 (imageGroup에 사용) |

### 3-3. 컴포넌트 content 클래스
| 클래스 | 설명 |
|--------|------|
| `se-component-content` | 기본 |
| `se-component-content-extend` | 좌우 full-width (이미지 그룹 슬라이드) |
| `se-component-content-fit` | 콘텐츠 크기에 맞춤 (단독 이미지 등) |

### 3-4. 컴포넌트 HTML 스켈레톤
```html
<!-- 텍스트 -->
<div class="se-component se-text se-l-default">
  <div class="se-component-content">
    <div class="se-section se-section-text se-l-default">
      <div class="se-module se-module-text">
        <p class="se-text-paragraph se-text-paragraph-align- ">
          <span class="se-fs-fs13 se-ff-system">텍스트</span>
        </p>
      </div>
    </div>
  </div>
</div>

<!-- 이미지 그룹 (슬라이드) -->
<div class="se-component se-imageGroup se-l-slide">
  <div class="se-component-content se-component-content-extend">
    <div class="se-section se-section-imageGroup se-l-slide __se-component">
      <div class="se-imageGroup-viewer">
        <div class="se-imageGroup-container">
          <div class="se-imageGroup-item">
            <div class="se-module se-module-image se-image-loaded">
              <a class="se-module-image-link __se_image_link __se_link">
                <img class="se-image-resource" id="img_N" data-width="886" data-height="664">
              </a>
            </div>
          </div>
          <!-- 추가 이미지들 -->
        </div>
      </div>
      <!-- 진행 표시 바 -->
      <div class="se-imageGroup-progress">
        <div class="se-imageGroup-thumb" style="width: XX%;"></div>
      </div>
    </div>
  </div>
</div>

<!-- 단독 이미지 -->
<div class="se-component se-image se-l-default">
  <div class="se-component-content se-component-content-fit">
    <div class="se-section se-section-image" style="max-width:720px;">
      <div class="se-module se-module-image se-image-loaded">
        <img class="se-image-resource">
      </div>
    </div>
  </div>
  <!-- 이미지 아래 캡션 -->
  <div class="se-module se-module-text se-caption">
    <p class="se-text-paragraph">
      <span class="se-fs- se-ff-  ">캡션 텍스트</span>
    </p>
  </div>
</div>

<!-- 스티커 -->
<div class="se-component se-sticker se-l-default">
  <div class="se-component-content">
    <div class="se-module se-module-sticker se-image-loaded">
      <img src="https://storep-phinf.pstatic.net/..." class="se-sticker-image" style="p100_100 사이즈">
    </div>
  </div>
</div>
```

---

## 4. 이미지 렌더링 크기

모바일에서 실제 렌더링되는 `data-width` / `data-height` 값 (px):

| 비율 | data-width | data-height | 비고 |
|------|-----------|------------|------|
| 가로형 (3:2) | 886 | 664 | JPEG, 일반 풍경/사물 사진 |
| 세로형 (3:4) | 886 | 1181 | JPEG, 세로 인물/사물 사진 |
| 폰 스크린샷 (9:19.5) | 886 | 1920 | PNG, 스크린샷 |
| 특수 | 720 | 1280 | 단독 이미지 섹션 (max-width:720px) |

> **핵심**: 모바일 렌더링 너비는 **886px** (가로 full-width 이미지 기준)  
> 단독 이미지(`se-image`)는 **max-width: 720px** 제한

---

## 5. 포스트 페이지 전체 DOM 구조 (위→아래)

```
.Ngnb.gnb_bg_white          ← GNB 상단 네비게이션 바
  └ 블로그 로고, 블로그명, 검색 버튼, MY메뉴 버튼

#_post_area .ct_wrap
  └ ._postView
      ├ .blog_category        ← 카테고리 링크 (예: "2026")
      ├ se-documentTitle      ← 포스트 제목
      ├ .blog_authorArea      ← 프로필 이미지(36×36) + 닉네임 + 날짜
      ├ .blog_btnArea         ← 통계, 기타 기능(수정/공유/삭제 등)
      └ .se-main-container    ← SE4 본문 컴포넌트들
          ├ se-imageGroup (slide)
          ├ se-text
          ├ se-imageGroup (slide)
          ├ se-text
          ├ ... (반복)
          ├ se-sticker
          └ se-text (마지막)

#blog_fe_feed
  ├ .list_wrap (태그 목록)   ← #20대, #일상 등
  └ .interact_section
      ├ .like_area             ← 공감/칭찬/감사/웃김/놀람/슬픔 리액션
      └ (댓글 영역)
```

---

## 6. 이미지 풀스크린 뷰어 (`.civ__*`)

이미지 탭 시 전체화면 뷰어 진입:

| 항목 | 값 |
|------|----|
| 헤더 배경 | `linear-gradient(rgba(27,27,30,0.5), rgba(27,27,30,0))` |
| 캡션 배경 | `rgba(27,27,30,0.5)` |
| 주요 클래스 | `.civ__header`, `.civ__content`, `.civ__panel`, `.civ__info`, `.civ__caption` |
| 이미지 전환 | `transform: translate(X%, 0px)` (수평 플릭) |

---

## 7. 외부 CSS 파일 목록

| 파일 | 용도 |
|------|------|
| `lego_w-261743111_https.css` | 모바일 기본 레이아웃 |
| `lego_view-63655323_https.css` | 뷰 페이지 스타일 |
| `se_viewer_blog_mobile_v1.43.1.css` | SE 뷰어 모바일 전용 |
| `se.viewer.css v1.76.0` | SE 뷰어 공통 |
| `prismplayer-mobile-se-1.10.1.css` | 동영상 플레이어 |

---

## 8. 익스텐션 미리보기 구현 시 핵심 포인트

1. **폰트**: `font-family: 'NanumGothic', -apple-system, sans-serif; font-size: 13pt` → 본문 기본값
2. **너비**: 미리보기 패널 내부 콘텐츠 너비 `390px` (뷰포트 기준)
3. **이미지**: full-width 이미지는 패널 너비 100%, 단독 이미지는 `max-width: 720px` (패널 내에선 100% 처리)
4. **슬라이드**: `se-l-slide` 이미지 그룹은 좌우 스와이프 슬라이더로 구현
5. **SE 클래스 감지**: 에디터 DOM에서 `se-fs-*`, `se-ff-*` 클래스 패턴으로 폰트 크기/패밀리 파악 가능
6. **줄간격**: CSS 파일(`se.viewer.css`)에서 처리 → 실제 값은 해당 CSS 파싱 필요 (별도 조사 대상)
