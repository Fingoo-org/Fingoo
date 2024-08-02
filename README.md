<div align="center" >

# 🐧 FINGOO

**나만의 투자분석 친구 FINGOO**

경제 분석, 시각화, 공유할 수 있는 금융 투자 분석 플랫폼

![Next.js](https://img.shields.io/badge/Next.js-v14-000000?style=flat-square&logo=Next.js&logoColor=white)
![Nest.js](https://img.shields.io/badge/nestjs-v14-E0234E?style=flat-square&logo=nestjs&logoColor=white)

</div>

### 기능 목록

#### 지표 예측(Function Calling UX flow)

![1](https://github.com/user-attachments/assets/8ef04fe0-53fb-4aee-9674-89dcf94b807d)

- 핀구 봇(GPT)에게 특정 지표의 예측을 요청할 수 있습니다.
- GPT 기반으로 예측 지표를 생성하고, 예측값에 대한 해석을 제공합니다.
- 메타데이터가 선택된 경우 예측 지표를 화면에 표시하며, 선택된 메타데이터가 없을 경우 메타데이터를 생성하여 보여줍니다.

#### 지표 분석(Function Calling UX flow)

![2](https://github.com/user-attachments/assets/18b21ff4-18a5-4ea6-aa4e-67dfb9cc8496)

- 핀구 봇(GPT)에게 특정 분야 또는 시장에 대한 분석을 요청할 수 있습니다.
- 해당 시장을 분석하기 위한 지표들을 추출하고, 지표들의 최신 값을 기반으로 분석 결과를 제공합니다.
- 분석에 활용된 지표들을 메타데이터로 생성하여 차트에 표시합니다.

#### 기본 차트 설정(인터벌, 범위 변경)

![3](https://github.com/user-attachments/assets/c2fa6391-4cd6-492a-8dd6-5c536fb0deb6)

- 차트를 조작해 지표 데이터를 가져옵니다.
- 데이터의 인터벌을 일(Day), 주(Week), 월(Month), 연도(Year) 단위로 설정할 수 있습니다.
- 데이터의 범위를 1년(1Y), 5년(5Y), 10년(10Y), 최대(MAX)로 설정할 수 있습니다.

#### 지표 유닛 설정

![4](https://github.com/user-attachments/assets/56e60219-39df-4ad7-ae0f-a32b56a2cb7e)

- 각 지표마다 단위를 기본값(Default), 상대값(Index), 전월 대비 증감률(MoM), 전년 대비 증감률(YoY)로 설정할 수 있습니다.

#### 차트 축 추가

![5](https://github.com/user-attachments/assets/f4631fe0-3185-4084-9bc3-fb9c7caf09b8)

- 한 차트의 축을 추가하여 지표를 분리하여 차트에 표시합니다. 이로 인해 특정 지표를 더 명확하게 분석할 수 있습니다.
- 지표를 드래그 앤 드랍하여 축을 이동합니다.
- 축은 최대 3개까지 추가할 수 있습니다.

#### 화면 분할 및 뷰 모드

![6](https://github.com/user-attachments/assets/ac8de1dd-3009-4e15-ad30-d0fe754b349b)

- 화면을 분할하여 여러 차트를 동시에 볼 수 있습니다.
- 화면은 전체(Full), 2분할(2-split), 4분할(4-split)로 나눌 수 있습니다.
- 차트를 드래그 앤 드랍하여 순서를 변경할 수 있습니다.
- 사이드바를 닫으면 차트를 넓은 화면에서 볼 수 있으며, 이를 뷰 모드라고 합니다.
- 화면을 분할한 후 차트를 더블 클릭하면 해당 차트가 선택되어 편집할 수 있습니다.

#### 예측 지표 생성

![7](https://github.com/user-attachments/assets/26228bec-c95f-4884-8041-8898f910f10b)

- 예측할 지표(타겟 지표)와 예측에 사용할 지표(재료 지표)를 선택하여 예측 지표를 생성합니다.
- 재료 지표는 최대 5개까지 선택할 수 있으며, 각 지표의 가중치를 조절할 수 있습니다.
- 예측 지표를 차트에 추가하면 예측 결과가 차트에 표시됩니다.

#### 차트 공유

![8](https://github.com/user-attachments/assets/088c56d3-80c5-410f-a129-8cd91f3a42cd)

- 차트를 이미지로 변환하여 링크를 복사하고 공유할 수 있습니다.
- 이미지를 다운로드할 수 있습니다.
- 차트 데이터를 CSV 파일로 다운로드할 수 있습니다.

### 개발 환경 세팅

> 환경변수는 apps/web, apps/api 폴더에 있는 .env.sample 파일을 참고해주시기 바랍니다.

### 통합

```bash
npm install
npm run dev
```

**Front-end**

```bash
npm install
npm run dev:web
```

**Back-end**

```bash
npm install
npm run dev:api
```

## 기술스택

- frontend: `Next.js 14`, `TypeScript`, `React`, `SWR`, `Zustand`, `Jest`, `Storybook`, `MSW`, `Tailwind`, `Vercel AI SDK`
- backend: `Nest.js`, `Postgresql`, `Typeorm`, `Redis`, `Swagger`, `Passport`
- infra: `Turporepo`, `Docker`, `Github Action`, `AWS Lambda`, `Supabase` , `Testcontainers`


