# 📱 Naver Blog Mobile Preview

> 네이버 블로그 에디터에서 모바일 화면을 실시간으로 미리보는 크롬 익스텐션

![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![Manifest](https://img.shields.io/badge/Manifest-V3-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Overview

네이버 블로그는 PC로 작성하지만 독자는 대부분 모바일로 읽습니다.  
글을 쓰는 동안 **오른쪽 패널에 모바일 미리보기를 실시간으로 표시**해, 폰에서 어떻게 보이는지 바로 확인할 수 있습니다.

## Features

- **실시간 미리보기** — `MutationObserver` + 300ms debounce로 에디터 변경 즉시 반영
- **기기 선택** — iPhone 16 / SE / Galaxy S24 등 10종, 선택값 localStorage 저장
- **이미지 캐러셀** — 실제 네이버 앱과 동일한 비율·슬라이드 로직 재현
- **스티커** — `se-sticker` 감지 후 100px 소형 이미지로 별도 렌더링
- **폰트** — `se-ff-*` 10종 클래스 매핑
- **폰 UI** — 상태바, 네이버 앱바, 좋아요·댓글·공유 바, 하단 탭바

## Installation

```bash
# 1. 이 저장소 클론
git clone https://github.com/SooinJung/naver-blog-mobile-preview.git

# 2. chrome://extensions 접속 → 개발자 모드 ON
# 3. '압축 해제된 확장 프로그램 로드' → 클론한 폴더 선택
```

이후 `blog.naver.com`에서 글쓰기 진입 시 자동 실행됩니다.

## File Structure

```
├── manifest.json   # Manifest V3
├── content.js      # 핵심 로직 (패널 생성 + 실시간 감지)
└── style.css       # 패널 UI 스타일
```

## Roadmap

- [ ] 에디터 스크롤 ↔ 미리보기 스크롤 연동
- [ ] 소제목·인용구·구분선 등 SE4 컴포넌트 스타일 추가
- [ ] 손글씨 폰트 3종 webfont 등록
- [ ] 크롬 웹스토어 배포
