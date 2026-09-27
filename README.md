This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

상단 검색은 스마트폰과 카메라를 함께 조회합니다. 비교 목록은 같은 카테고리끼리 최대 3개까지 유지하며, 다른 카테고리의 제품을 선택하면 해당 카테고리의 새 비교 목록으로 전환됩니다. 카메라 사양 표에는 센서 포맷, 유효 화소, 이미지 프로세서, 렌즈 마운트, 최대 연사, 동영상과 본체 무게가 표시됩니다.

검색창을 처음 열면 최근 30일 선택 횟수를 기준으로 인기 스마트폰 5개와 인기 카메라 5개가 번갈아 표시됩니다. 인기 데이터가 부족한 자리는 각 카테고리의 최신 기기로 채웁니다. 검색 결과에서 `기기 보기`나 `비교에 추가`를 선택할 때만 집계하며 입력 중인 검색어는 저장하지 않습니다.

등록되지 않은 기기 경로는 전용 404 화면을 표시하고 `/api/route-misses`를 통해 분석 이벤트를 기록합니다. 원문 경로, 쿼리·프래그먼트를 제거한 유입 경로, 브라우저 언어와 화면 크기 구간만 전송하며 404 화면 표시는 수집 성공 여부에 영향을 받지 않습니다.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Architecture

Application code lives under `src/`: routes and route-local components in `app`, the device domain in `features/devices`, domain-independent UI in `shared`, and backend calls in `server`.

See [the architecture guide](docs/architecture.md) for boundaries, file placement, preserved behavior, and cleanup candidates.

The Rust API defaults to `http://127.0.0.1:4040`; set the server-only `API_BASE_URL` environment variable to override it. Browser requests use the existing `/api/*` Route Handlers. Run `pnpm lint` and `pnpm build` for lint, TypeScript, and production-route verification. There is currently no dedicated test or typecheck script.
