# ART 한글화 — Tampermonkey 유저스크립트

> **비공식 프로젝트입니다.**
>
> Advanced REACH Tool(ART)은 TNO 및 ART 컨소시엄의 저작물이며, 이 저장소는
> 그들과 아무 관계가 없고 승인을 받지도 않았습니다. 여기 있는 것은 ART 화면에
> 표시되는 글을 한국어로 바꾸는 **표시 전용** 유저스크립트와 그 번역 사전입니다.
>
> - 사전의 **키**(영어 원문)는 ART UI의 문구이고 저작권은 ART 측에 있습니다.
>   식별과 치환을 위해서만 담았습니다.
> - 사전의 **값**(한국어)은 이 프로젝트가 작성한 번역입니다.
> - ART 원본 문서(PDF 등)는 이 저장소에 포함하지 않습니다. 필요하시면
>   ART 사이트에서 직접 받으십시오.
> - 모델 내부 구조·알고리즘·입력값은 건드리지 않으며, 한글화 전후로 서버가
>   받는 폼 데이터가 한 바이트도 달라지지 않습니다 (`tools/test.js` 가 검사).
>
> 번역 품질은 보증하지 않습니다. **규제 목적의 판단은 반드시 원문으로 확인하십시오.**
> ART 측에서 게시 중단을 요청하면 따르겠습니다.

Advanced REACH Tool (ART) 1.5 — `https://www.advancedreachtool.com` — 의
**화면 언어만** 한국어로 바꿉니다. 모델 내부 구조, 알고리즘, 입력값은 건드리지
않습니다.

## 설치

> **처음 설치하는 사람에게는 `ART-한글판-설치가이드.html` 을 주십시오.**
> 화면 캡처가 들어간 5단계 안내이고, 스크립트 전문이 페이지 안에 들어 있어서
> 파일을 따로 챙겨 줄 필요가 없습니다. 브라우저로 그냥 열면 됩니다.


1. 크롬에 **Tampermonkey** 설치 (크롬 웹스토어)
2. **`chrome://extensions` → 오른쪽 위 "개발자 모드" 켜기**
3. **같은 화면 → Tampermonkey → "세부정보" → "사용자 스크립트 허용" 켜기**
4. `art-korean.user.js` 를 Tampermonkey 에 설치
5. `advancedreachtool.com` 접속

### 2번과 3번, **둘 다** 켜야 합니다

둘 중 하나만 꺼져 있어도 Tampermonkey 도 설치되고 스크립트도 설치되고 토글도
초록색인데 **화면은 그대로 영어**입니다. 오류도 안 납니다.

**3번(사용자 스크립트 허용)** — 최신 크롬(MV3)은 확장별로 이 스위치를 따로 두고
기본값이 꺼짐입니다. 2026-08-22 실제 설치에서 여기서 막혔습니다.

**2번(개발자 모드)** — 이게 꺼져 있으면 3번 스위치가 **파랗게 켜진 것처럼 보이는데도
실제로는 동작하지 않습니다.** 항목 자체는 화면에 그대로 남아 있어서 더 헷갈립니다.

> 2026-08-22 크롬 v151.0.7922.172 에서 대조 실험으로 확인했습니다.
> 3번을 켜 둔 채 2번만 껐다 켜니: **꺼짐 → 영어, 켜짐 → 한국어.**
> (이전 판 README 는 "개발자 모드는 지금은 무관"이라고 적었는데 **틀렸습니다.**)

확인하는 법: ART 페이지에서 Tampermonkey 아이콘을 누르면 맨 위에 파란 안내줄로
`사용자 스크립트 허용 확장 설정을 활성화하세요` 라고 뜹니다. 그 줄을 클릭하면
설정 화면으로 바로 갑니다.

### 설치가 잘 안 될 때

Tampermonkey 편집기에 붙여넣고 `Ctrl+S` 하는 방법은 저장이 조용히 실패하는 경우가
있습니다. 대신 **로컬 웹서버로 띄워서 설치**하면 확실합니다:

```bash
cd C:\Users\user\.claude-parallel\art-korean
python -m http.server 8899 --bind 127.0.0.1
```

그다음 크롬에서 `http://localhost:8899/art-korean.user.js` 를 열면 Tampermonkey
설치 화면이 뜹니다. 설치가 끝나면 서버는 꺼도 됩니다.

### 브라우저 자동 번역은 끄십시오

같이 켜면 충돌합니다.

## 단축키

| 키 | 동작 |
|---|---|
| `Alt+K` | 한국어 ↔ 영어 원문 토글 |
| `Alt+C` | 수집 모드 on/off (미번역 문자열 수집 시작) |
| `Alt+E` | 수집한 미번역 문자열을 JSON으로 클립보드 복사 (+ 콘솔 출력) |

## 안전성 — 왜 폼 데이터가 안 바뀌는가

`tools/test.js` 45개 검사 전부 통과. 합격 기준은 **번역 전후 폼 직렬화 결과가
완전 동일**한 것입니다.

### `<select>` — value 고정 (value pinning)

WebForms 의 `<select>` 는 선택된 `<option>` 의 `value` **속성**을 전송하는데,
속성이 없으면 브라우저가 **표시 텍스트**를 대신 전송합니다. 그래서 번역
**전에** 암묵적 값을 명시적 속성으로 고정합니다.

```js
if (!opt.hasAttribute('value')) opt.setAttribute('value', opt.value);
opt.textContent = '분말, 과립 또는 펠릿형 재료';
```

HTML 명세상 value 속성이 있으면 전송되는 건 속성값이고 텍스트는 표시 전용이라,
이후 `select.value` 는 계속 영어 원문을 반환합니다. 되돌릴 필요도, submit 을
가로챌 필요도 없습니다. `RequiredFieldValidator` 의 `InitialValue` 비교도 value
기준이므로 그대로 통과합니다.

> **순서가 중요합니다.** 일반 텍스트 워커가 option 텍스트를 먼저 바꾸면 뒤이은
> value 고정이 *한국어* 값을 고정해 전송 데이터가 바뀝니다. 그래서 `OPTION` 은
> 텍스트 워커에서 제외하고, `doOptions()` 를 가장 먼저 실행합니다.

### `<input type="submit">` — 전송 직전 원문 복원, 네 경로 전부

버튼은 표시와 전송이 같은 `value` 속성이라 분리가 불가능합니다. 전송 직전에
원문으로 되돌리되 **네 경로를 모두** 막습니다.

1. `pointerdown` / `keydown` (캡처 단계)
2. `submit` 이벤트 (캡처 단계)
3. `HTMLFormElement.prototype.submit` 패치 ← **함정**
4. `PageRequestManager.add_initializeRequest`

**3번이 중요한 이유:** ASP.NET 의 `__doPostBack()` 은 `form.submit()` 을 코드로
호출하는데, 이 경우 브라우저는 submit 이벤트를 발생시키지 않습니다. 제품 유형을
고르면 Activity Class 목록이 갱신되는 그 동작이 바로 이 경로입니다. submit
리스너만 달면 가장 자주 쓰는 길에서 안전장치가 안 걸립니다.

프로토타입 패치는 `@grant none` 이어야 동작합니다. `GM_*` 권한을 쓰면 샌드박스로
분리돼 페이지의 프로토타입에 닿지 못합니다.

### 그 밖에

- 사용자 입력값(`<input type="text">`, 비밀번호, `__VIEWSTATE` 등)은 읽지도
  쓰지도 않습니다.
- 네트워크 요청을 만들거나 가로채지 않습니다. 외부 번역 API 를 쓰지 않습니다.
- 사전에 없는 문구는 **영어 원문 그대로** 남습니다 (틀린 번역보다 안전한 폴백).

## 사전

`art-ko-dict.json` — 554개 항목. 카테고리별로 나뉘어 있고, `_meta.glossary` 에
용어 통일 기준이 들어 있습니다.

| 섹션 | 내용 | 출처 |
|---|---|---|
| `site` / `auth` / `alerts` | 내비게이션, 로그인, 회원가입, JS alert | 실제 페이지 관찰 |
| `workflow` | 시나리오/활동/베이지안/결과 화면 용어 | ART User Guide |
| `questions` (59) | UI 질문 전문 | 기계론적 모델 보고서 v1.5 4장 |
| `options` (251) | 드롭다운 선택지 | 같은 4장 |
| `warnings` (5) | 경고 문구 | 같은 4장 |
| `examples` (114) | 활동 하위등급 예시 활동 | 같은 4장 |
| `guidance` (37) | 각 질문 아래 표시되는 도움말 | 같은 4장 (원문 151개 → 중복 제거 37개) |

### 용어 통일 기준 (일부)

| 원문 | 번역 |
|---|---|
| Segregation | 격리(발생원) |
| Separation / Personal enclosure | 격리(작업자) — **위와 구분 필수** |
| Localized controls | 국소 제어 |
| Local exhaust ventilation | 국소배기장치 |
| Dispersion / Dilution | 확산 / 희석 |
| Near field / Far field | 근거리장 / 원거리장 |
| Dustiness | 발진성 (KOSHA 표준 용어) |
| Fracturing / Crushing / Abrasion / Impaction | 파쇄 / 분쇄 / 마모 / 충격 |
| Agitation | 교반 |
| Emission potential | 배출 잠재력 |

전체 기준은 `art-ko-dict.json` 의 `_meta.glossary` 참조.
숫자와 단위는 원문 유지 (`> 3 l/minute`, `100 - 1000 kg`).

### 도움말(guidance) 중복 제거

4장은 근거리장(4.4.x)과 원거리장(4.16.x) 구간이 거울처럼 반복되고, "왼쪽 패널에서
가장 잘 맞는 상황을 선택하십시오" 류 문구는 68회까지 재사용됩니다. 그래서 원문
151개 블록이 **고유 37개**(약 14,900자)로 줄어듭니다 — 75% 감소.

### 긴 문장 매칭 — 공백 정규화

HTML 은 긴 문장을 줄바꿈과 연속 공백으로 감싸 놓습니다. 그래서 사전 조회는 원문
그대로 한 번, 실패하면 공백을 하나로 접은 형태로 한 번 더 시도합니다. 이게 없으면
긴 질문문과 도움말은 실제 DOM 에서 거의 매칭되지 않습니다.

## 사전 보강 방법

### 설치했다면

1. ART 에서 `Alt+C` 로 수집 모드를 켜고 화면을 돌아다닙니다.
2. `Alt+E` → 미번역 문자열이 `{"영문": ""}` JSON 으로 클립보드에 복사됩니다.

### 설치 전에 (화면을 읽기만 함)

1. 대상 화면에서 크롬 F12 → Console 에 `tools/collect.js` 를 붙여넣고 Enter.
   수집된 문자열이 클립보드에 복사됩니다. 화면마다 반복해 `collected.txt` 에
   이어 붙입니다.
2. 사전과 대조:

   ```bash
   cd tools && python dom_diff.py collected.txt
   ```

   `dom_diff.py` 는 유저스크립트의 조회 규칙을 그대로 재현해 결과를 셋으로
   나눕니다 — `art-dom-untranslated.json`(새 번역 필요),
   `art-dom-nearmiss.json`(**대소문자·문장부호만 다름. 사전에 변형 키만 추가**),
   `art-dom-partial.json`(일부만 치환되고 영어가 남음).

   가이드 문서 표기와 실제 화면 표기가 어긋나 번역이 있는데도 영어로 남는
   경우가 `nearmiss` 에서 걸립니다. 조회 규칙을 느슨하게 푸는 대신 사전에
   변형 키를 추가하십시오 — 느슨한 조회는 부분 치환 정책과 충돌합니다.

### 공통

3. `art-ko-dict.json` 의 적절한 섹션에 붙여넣고 번역을 채웁니다.
4. 다시 빌드:

```bash
cd tools && python build.py ../art-korean.user.js
```

`build.py` 는 섹션 간 번역 충돌과 빈 값을 검사하고, 있으면 빌드를 중단합니다.

## 테스트

```bash
cd tools
npm install jsdom
node test.js
```

## 재추출 (필요할 경우)

4장에서 UI 문자열을 다시 뽑을 때:

```bash
curl -o art_mech_v15.pdf "https://www.advancedreachtool.com/assets-1.5.12110.3/doc/ART%20Mechanistic%20model%20report_v1_5_20130118.pdf"
pdftotext -f 177 -l 370 -enc UTF-8 art_mech_v15.pdf ch4_raw.txt
python parse3.py          # → art-ch4-strings.json (질문·선택지·경고·예시)
python parse_guidance.py  # → art-guidance.json  (도움말 151 → 고유 37)
```

**`-layout` 을 쓰지 마세요.** `-layout` 은 표의 열을 질문 텍스트와 같은 물리적
줄에 병합시켜서 `Assigned What is the viscosity...? value` 같은 쓰레기를 만듭니다.
기본(비 layout) 모드는 질문 한 줄, 선택지 한 줄로 깔끔하게 나옵니다.

파서가 처리하는 함정들:

- 선택지 계층이 4단계입니다: `U+F0B7` / `o ` / `U+F0A7` / `- `
- `- ` 를 무조건 마커로 보면 `0.1 - 1 kg/minute` 같은 **수치 범위가 잘립니다**.
  대문자·`(` 가 뒤따를 때만 마커로 취급합니다.
- 페이지 머리말(`TNO report | V9009`, `Chapter 4:`, `181 / 374`)을 먼저 걷어냅니다.
- `-> go to question 15.5.1` 류 분기 안내와 `[...]` 저작 메모는 UI 에 안 나오므로 제거.
- `Question N:` 헤딩이 줄 중간에 나타나는 경우가 있어 별도 줄로 분리합니다.
- `Answer:` 마커가 없는 블록도 있어 본문의 불릿 구간을 폴백으로 파싱합니다.

## 알려진 한계

- 4장 기반 문자열은 **가이드 문서 표기**라서 실제 DOM 텍스트와 미세하게 다를 수
  있습니다. 다르면 치환이 안 되고 영어로 남습니다 — 수집 모드로 메꾸세요.
- Activity Subclass 전체 목록의 정확한 표기는 Marquart et al. 2011
  (Ann Occup Hyg 55(9):989-1005) 에 있지만 페이월입니다.
- **베이지안 모듈·측정데이터 가져오기·결과 화면은 거의 비어 있습니다.** 이 보고서
  1.3절이 "This report will focus on the development of the mechanistic model" 이라고
  명시하고 4장 다음이 바로 5장 결론이라, 해당 화면의 UI 문자열이 애초에 이 문서에
  없습니다. 현재는 User Guide 에서 얻은 용어 몇 개(`Fully analogous`, `Full-Shift`,
  백분위수 등)만 들어 있습니다. 출처는 McNally et al. 2014(베이지안),
  Schinkel et al. 2013(노출 데이터베이스) 쪽입니다.
- **잠재적 위험:** 로그인 후 페이지의 자체 JS 가 option 의 *텍스트*를 읽어
  분기한다면 (`$('#ddl option:selected').text()` 같은 코드) 번역 때문에 그 분기가
  틀어질 수 있습니다. 전송 데이터는 그대로지만 화면 흐름이 어긋날 수 있습니다.
  이상하면 `Alt+K` 로 즉시 영어로 되돌리세요. 로그인 계정이 없어 이 부분은
  검증하지 못했습니다.
- 홈페이지는 흄(fume)을 적용 범위 밖이라고 하는데 유저 가이드와 4장에는 금속 흄
  Activity Class 가 다 들어 있습니다. 유저 가이드 쪽이 맞고 홈페이지 문구가 v1.0
  시절 잔재로 보입니다.

## 라이선스 주의 — 공개 배포 전 확인 필요

ART 는 무료지만 오픈소스가 **아닙니다.** TNO 보고서 표지에 "TNO 의 사전 서면
동의 없이 어떤 방식으로도 복제·공개 불가"라고 명시돼 있고, 웹 앱도 컨소시엄이
운영하는 비공개 애플리케이션입니다.

개인 사용은 문제없지만, UI 문자열 전량 번역본을 공개 배포하는 것은 법적으로
명확하지 않습니다. 공익 목적 배포를 원한다면 **컨소시엄에 번역본을 제안하는 쪽이
낫습니다** — 사이트에 이미 EN/DE/FR/NL 전환이 있어 서버에 언어별 리소스 파일이
존재하고, 한국어 추가는 파일 하나 더 넣는 일입니다. 승인되면 설치 없이 모든
한국어 사용자에게 닿고 라이선스 문제도 소멸합니다. 연락처는 `ART@hse.gov.uk`.

`art-ko-dict.json` 이 그대로 제안용 번역 대조표가 됩니다.

## 출처

| 문서 | 쪽수 | 용도 |
|---|---|---|
| ART Mechanistic model report v1.5 (2013-01-18) | 374 | **주 출처.** 4장(177~370쪽)에 UI 질문·선택지 전량 |
| ART User Guide 1 | 5 | 모델 흐름 개요 |

`Fransman_Development_of_a_mechanistic_model_for_ART.pdf` 도 사이트에 있지만
이건 **2010년 v1.0판**입니다. 1~2장은 같지만 3~4장은 다를 수 있으니 v1.5판을
쓰세요.
