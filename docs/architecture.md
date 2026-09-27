# FO architecture

## 확인한 프로젝트 구성

| 항목 | 구성 |
| --- | --- |
| Runtime | Next.js 16.3.5, React / React DOM 19.2.8 |
| TypeScript | strict, noEmit, bundler module resolution; 설치 버전 5.9.3 |
| Routing | App Router; Pages Router 없음 |
| Source / alias | 루트의 app/components/lib/data에서 `src/`로 이동, `@/*` → `./src/*` |
| Routes | `/`, `/[comparison]`, `/test/comp/[variant]`, `/test/ui/glass`, `/api/*` 4개 |
| UI | Tailwind CSS 4, 자체 React UI; 외부 컴포넌트 라이브러리 없음 |
| State | URL의 기기 선택, 컴포넌트 로컬 UI 상태, localStorage의 테마 설정 |
| Query / store | TanStack Query, Zustand, Redux, Recoil 없음 |
| Auth / actions | 인증·세션, Server Action, middleware / proxy 없음 |
| Forms / validation | 별도 form / schema 라이브러리 없음; 기존 백엔드 검증 유지 |
| Lint / test | ESLint 9 + Next core-web-vitals / TypeScript; 별도 테스트 환경 없음 |
| Scripts | `dev`, `start`, `lint`, `build`; build에 TypeScript 검사 포함 |

실제 도메인은 스마트폰·카메라의 검색과 사양 비교다. 두 카테고리는 같은 검색·선택·표시 흐름을 사용하므로 `features/devices` 하나로 묶었다. 선택 기록과 404 수집은 현재 API 계약과 전송 위치를 유지한다.

## 디렉터리와 이동 기준

```text
src/
├── app/
│   ├── _components/              # 사이트 셸, 404 pathname/수집 leaf
│   ├── [comparison]/
│   │   ├── _lib/load-devices.ts  # params 해석 이후 데이터 준비와 notFound
│   │   └── page.tsx
│   ├── api/                      # 기존 4개 HTTP endpoint
│   ├── test/
│   │   ├── _data/devices.ts      # 두 시안 route에서 사용하는 fixture
│   │   ├── comp/[variant]/_components/
│   │   └── ui/glass/
│   └── ...                       # layout, home, error, not-found, CSS
├── features/devices/
│   ├── api/                      # DTO, adapter, same-origin browser 요청
│   ├── model/                    # 타입, 사양 정의·표시, URL 규칙, 조회 hook
│   └── ui/                       # 검색, 비교 목록, 사양표와 화면 조합
├── shared/ui/theme-toggle.tsx
└── server/
    ├── api/client.ts             # 서버 전용 HTTP transport / error
    ├── devices/                  # backend endpoint, 카테고리 검색 집계
    └── analytics/route-misses.ts
```

| 기존 | 현재 | 이유 |
| --- | --- | --- |
| `data/devices.ts` | `features/devices/model/*`, `app/test/_data/devices.ts` | 운영 모델·사양 정의와 시안 데이터를 분리 |
| `components/device/device-specification-page.tsx` | `features/devices/ui/*`, `model/specification-values.ts` | 화면 조합, 표, 기기 헤더, 표시 규칙을 분리 |
| `components/device/comparison-concepts.tsx` | `app/test/comp/[variant]/_components/` | 한 시안 route만 사용 |
| `components/layout/*` | `app/_components/`, `features/devices/ui/comparison-list-bar.tsx` | 사이트 셸과 기기 도메인 UI 구분 |
| `components/search/device-search.tsx`, `lib/use-selected-devices.ts` | `features/devices/{ui,model,api}` | UI에서 요청 및 조회 상태 관리 분리 |
| `lib/api/*` | `server/*`, `features/devices/api/*` | 서버 transport와 도메인 DTO / browser API 경계 명시 |
| `components/theme/theme-toggle.tsx` | `shared/ui/theme-toggle.tsx` | 기기 도메인과 무관한 UI |

기존 kebab-case 파일명을 유지한다. 빈 디렉터리, FSD 중간 계층, 거대한 barrel, 범용 store/provider는 만들지 않았다. `public`, 환경 변수, 프로젝트 설정은 루트에 둔다.

## Server / Client 경계

- 페이지·메타데이터·기기 헤더·사양표는 Server Component다. 초기 데이터는 서버에서 Rust API를 직접 조회한다.
- `ComparisonWorkspace`는 레이아웃 전환 상태만 관리하고 서버에서 만든 표를 `children`으로 받는다.
- 사이트 로고는 서버에서 생성해 클라이언트 헤더 조작부에 전달한다. 선택 조회는 헤더에서 한 번 실행해 검색과 비교 목록에 공유한다.
- 404 설명은 서버에 두고 pathname 표시와 수집 효과만 `NotFoundDetails`로 분리했다.
- 검색, 선택 목록 전환, 스크롤 처리, 테마, 오류 재시도, 비교 시안은 사용자 상호작용이 있어 Client Component로 유지한다.
- `server/*`와 route 전용 데이터 loader에는 `import "server-only"`를 적용한다. 브라우저 요청은 `features/devices/api/client.ts`에서 기존 same-origin `/api/*`만 호출한다.

일반 의존성은 `app → features → shared`다. 서버 조합은 기기 DTO를 type-only로 참조할 수 있다. `shared → features/app`, `features → app`, 클라이언트 모듈의 서버 transport import는 허용하지 않는다.

## 조회와 상태의 역할

TanStack Query는 추가하지 않았다. 현재 클라이언트 조회는 단일 검색 모달과 URL 기반 선택 해석이며, polling·infinite query·낙관적 갱신·여러 화면 사이의 캐시 동기화 요구가 없다. 도메인 hook 두 개로 기존 동작을 유지할 수 있다. 향후 해당 요구가 생기면 기기 feature에 query key와 query/mutation을 도입하고 provider 범위를 필요한 트리로 제한한다.

- 서버 GET: 기존 `next.revalidate = 60` 유지.
- 서버 통계 POST: `cache: "no-store"` 유지.
- 검색: 250ms debounce, 닫기·검색어 변경 시 abort, 재오픈 시 조회, 로딩 중 기존 결과와 오류 표시 방식 유지.
- 기기 선택: URL이 기준이며 최대 3대, 중복 방지, 다른 카테고리 선택 시 전환, 네 번째 선택 시 마지막 항목 교체 유지.
- 비교 조회: 스마트폰 404일 때만 카메라 fallback. 다른 오류의 상태·응답 계약 유지.
- 통계: browser `keepalive`, 실패가 탐색과 404 화면을 막지 않는 동작 유지.

## 유지한 구조와 개선 후보

시안 route와 fixture 조회 함수는 삭제하지 않았다. 사양 키·화면 표시 규칙도 기존 내용 그대로 분리했다. CSS, URL, API 요청·응답, 메타데이터 문구, 테마 저장 키, 애니메이션 DOM 속성과 선택자도 유지했다. 기존 개발 서버는 source root가 변경되므로 실행 중이었다면 한 번 재시작해야 할 수 있다.

삭제 여부를 별도로 판단할 미사용 후보:

- `server/devices/api.ts`의 `getDeviceByIdentifier`
- 시안 fixture의 `getDeviceBySlug`, `searchDevices`, `getDevicesFromSegment` 및 이 함수들만 쓰는 식별자 조회 코드
- 기기 API의 `ApiCatalogSchemaResponse`와 연결된 catalog/schema DTO

비교 시안 route와 컴포넌트에 중복된 variant 타입·문구는 향후 시안을 수정할 때 route 내부에서 통합할 수 있다. 기능적으로 중복된 검색 DTO 변환과 비교 fallback은 이번에 공통 도메인 adapter와 서버 함수로 통합했다.

## 검증

기존 `pnpm lint`, `pnpm build`를 사용한다. build는 TypeScript와 Next 서버/클라이언트 경계, 정적 route 생성을 함께 검사한다. 별도 `test`나 `typecheck` script가 없으므로 존재하지 않는 명령을 추가로 요구하지 않는다.

이번 리팩터링은 git 원본과 변경 코드를 임시 회귀 검증 도구로 비교했다. fixture·사양 표시·URL 규칙·adapter와 API 요청/응답을 확인했고, 통계 요청은 mock을 사용했다. 임시 검증 도구는 지속적인 테스트 환경을 대신하지 않는다.
