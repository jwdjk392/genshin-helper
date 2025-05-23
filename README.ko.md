# 원신 도우미
원신을 플레이할때 도움이 되는 확장 프로그램입니다. 호요버스와는 관련이 없습니다.
#### README 언어
[English](https://github.com/jwdjk392/genshin-helper/blob/main/README.md) | 한국어
## 기능
- 자동 출석체크
- 레진 상태 보기
- 리딤코드 리딤
## 이거 안전한건가요? 해킹 위험은 없나요?
> 안전합니다. 저희는 민감한 정보를 수집하지 않으며 ```*.hoyolab.com```과 ```hoyoverse.com```을 제외하고는 어디에도 보내지 않습니다.
### 작동 방식
1. 확장 프로그램은 매니페스트 파일에서 ```*.hoyolab.com```에 대한 접근 권한을 가지고 있습니다.
2. 확장 프로그램이 호요버스나 호요랩의 API에 접근을 시도할때, **브라우저에서 자동으로 이 도메인과 관련된 쿠키를 포함해서 요청을 보냅니다.**
3. **저희는 직접적으로 쿠키를 읽거나, 저장하거나, 조작하지 않습니다.**
4. 궁금하거나 조심성이 있어서 더 자세히 확인하고 싶으시다면 API 접근 관련 코드가 있는 ```background.js```파일이나 ```popup/popup.js```파일을 확인해보시는걸 추천합니다.

이 확장 프로그램은 완전히 오픈소스이고 투명합니다.

## 라이선스
```GNU GPLv3```
## 설치 방법
### 웹 스토어를 통한 설치
사용하는 브라우저에 맞는 설치 링크를 이용해서 접속한 후 설치하세요.
- 네이버 웨일 브라우저: [https://store.whale.naver.com/detail/mfgkhldgnockogpfcmbgejdonnecmkch](https://store.whale.naver.com/detail/mfgkhldgnockogpfcmbgejdonnecmkch)
- MS 엣지 브라우저: [https://microsoftedge.microsoft.com/addons/detail/hpjomipcldlnfgamphalcppkpdfknolc](https://microsoftedge.microsoft.com/addons/detail/hpjomipcldlnfgamphalcppkpdfknolc)
### 수동 설치
크로뮴 기반 브라우저라면 대부분 호환됩니다.
1. 최신 [릴리즈](https://github.com/jwdjk392/genshin-helper/releases)에서 ```.zip``` 파일을 다운로드하세요.
2. 원하는 폴더에 압축풀기. **주의:** 설치 후 이 폴더를 삭제하면 안됩니다.
3. 크롬 (혹은 Chromium 기반 브라우저)를 열고, [확장 프로그램](chrome://extensions)으로 이동하고, ```개발자 모드```를 활성화하세요.
4. ```압축해제된 확장 프로그램을 로드합니다.```를 클릭하세요.
5. ```manifest.json```등의 파일이 들어있는 방금 압축을 푼 폴더를 선택하세요.
6. 원신 도우미가 불러와집니다.
7. **제발** 설치 후 압축을 푼 폴더를 삭제하지 마세요.
## 제거하기
1. 일반적인 확장 프로그램처럼 제거하세요.
2. 압축을 푼 폴더를 삭제하세요.
## 업데이트
### 스토어를 통해 설치한 경우
스토어를 통해 업데이트 할 수 있습니다.
### 직접 ```.zip```으로 설치한 경우
확장 프로그램을 제거하고 새로 설치하면 됩니다.

## 기여하기
풀 리퀘스트, 이슈를 자유롭게 여세요.