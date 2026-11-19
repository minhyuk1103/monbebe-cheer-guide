# 몬스타엑스 응원법 모음 (MONSTA X Cheer Guide)

몬스타엑스 응원법을 공연장에서 바로 볼 수 있게 만든 정적 웹앱입니다. 설치 없이 브라우저에서 열면 됩니다.

## 기능

- 8곡 응원법 기본 수록 (N the Front, DRAMARAMA, Love Killa, Rush Hour, Beautiful Liar, Shoot Out, Alligator, HERO)
- 괄호 안 응원 구호 자동 강조, 글자 크기 3단계
- 자동 스크롤과 속도 조절
- 즐겨찾기, 곡명·앨범·구호 검색, 2026 투어 세트리스트 필터
- 나만의 응원법 추가·수정·삭제, JSON 내보내기/불러오기
- 라이트/다크 모드, 모바일 세로 화면 기준 레이아웃

## 저장 방식

즐겨찾기와 직접 추가한 응원법은 브라우저 `localStorage`에만 저장됩니다. 서버도 계정도 없고, 어떤 데이터도 외부로 보내지 않습니다.

## 기술

React + TypeScript + Vite 빌드 결과물(`index.html`, `assets/`)을 그대로 올린 정적 사이트입니다.
