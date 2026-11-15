# 📱 Naver Blog Mobile Preview

> 네이버 블로그 글쓰기 화면 옆에 **실제 모바일 화면과 똑같은 미리보기**를 실시간으로 띄워 주는 크롬 익스텐션 (비공식)

![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![Manifest](https://img.shields.io/badge/Manifest-V3-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Overview

네이버 블로그는 PC로 쓰지만 독자는 대부분 폰으로 읽습니다.
임시 저장 → 폰으로 확인하는 과정 없이, 글을 쓰는 동안 오른쪽 패널에서 폰 화면을 바로 확인할 수 있습니다.

## 어떻게 똑같이 보여 주나

미리보기를 손으로 흉내 내지 않고, **네이버 모바일 뷰어의 실제 CSS**를 그대로 씁니다.

1. 에디터 본문을 복제해 발행 글과 같은 구조로 바꾼 뒤
2. 네이버 모바일 뷰어 CSS를 연결한 `iframe`(스크립트 차단 sandbox)에 넣어 렌더합니다.
3. 네이버 뷰어 **스크립트**가 발행 글에서 하는 처리는 직접 재현합니다:
   표 폭, 동영상 썸네일, 사진 슬라이드, 본문 광고 자리 등.

CSS 주소는 고정하지 않고 매번 최신 주소를 찾아 씁니다. 글쓰기 페이지의 에디터 버전과 내 블로그 최신 글의 모바일 페이지를 참고합니다.

## Features

- **실시간 미리보기**: 입력할 때마다 300ms 안에 반영
- **기기 선택**: iPhone 16 / 16 Pro / Pro Max / SE, Galaxy S24, Pixel 8 등 10종 (실제 화면 크기·높이)
- **실제 앱 화면 구성**: 인앱 브라우저 주소줄, 블로그 헤더, 공감·댓글 바, 하단 탭바
- **SE ONE 컴포넌트 대응**: 사진·사진 묶음(슬라이드·콜라주)·표·코드·수식·파일·지도·일정·링크 카드·책/영화 정보·내돈내산 쇼핑 카드·스티커·움짤·동영상
- **광고 자리 표시**: 내 블로그 애드포스트 설정을 읽어 광고가 들어갈 위치·간격을 재현 (자동 / 끄기 / 위치 선택)
- **새 글·기존 글 수정** 모두 지원

## Installation

```bash
git clone https://github.com/SooinJung/naver-blog-mobile-preview.git
```

1. `chrome://extensions` → 우측 상단 **개발자 모드** ON
2. **압축 해제된 확장 프로그램 로드** → 클론한 폴더 선택
3. `blog.naver.com`에서 글쓰기 화면에 들어가면 자동으로 나타납니다.

## File Structure

```
├── manifest.json   # Manifest V3 (추가 권한 없음)
├── content.js      # 패널 생성, 에디터 감지, 미리보기 렌더
├── style.css       # 패널(폰 프레임) UI
├── PRIVACY.md      # 개인정보처리방침
└── test/           # 실제 발행 글과 좌우 비교하는 오프라인 도구
```

## 디버그

콘솔에서 아래를 실행한 뒤 새로고침하면 `[미리보기]` 로그가 나옵니다.

```js
localStorage.mobilePreviewDebug = '1'
```

## Privacy

이 익스텐션은 어떤 데이터도 수집하거나 외부 서버로 보내지 않습니다. 자세한 내용은 [PRIVACY.md](PRIVACY.md)를 참고하세요.

---

네이버 및 네이버 블로그는 NAVER Corp.의 상표이며, 이 프로젝트는 NAVER와 관련이 없는 비공식 도구입니다.
