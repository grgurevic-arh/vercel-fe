# Grgurevic Architecture Frontend

Next.js (App Router) aplication that consumes the Strapi-powered CMS described in `/docs`. The current stage focuses on wiring authenticated data fetching for every site section; UI layers will be added later.

## Prerequisites
- Node.js 18.17+ (Next.js requirement)
- npm 9+
- Access to the Strapi instance with the two API tokens described beloow

## Environment configuration
1. Copy the sample file and set the real values provided by the backend team:
   ```bash
   cp .env.local.example .env.local
   ```
2. Edit `.env.local`:
   - `STRAPI_BASE_URL` → Strapi host + `/api` (e.g. `https://cms.example.com/api`).
   - `STRAPI_READ_TOKEN` → read-only token (`frontend-read`) with `find` permissions on all public content types.
   - `STRAPI_SUBMIT_TOKEN` → token (`research-submit`) limited to creating research submissions.
3. Restart the dev server after changing env variables so Next.js picks them up.

> The fetch layer (`src/lib/strapi-client.ts`) throws descriptive errors when any of the tokens are missing, so misconfiguration is easy to spot during development.

## Run the app
```bash
npm install
npm run dev
```
Navigate to `http://localhost:3000/en` (or `/hr`) to hit the Strapi endpoints. Each page currently renders the raw payload via the `DataDump` helper so data contracts can be verified before visual implementation.

## Available scripts
- `npm run dev` – start the Next.js dev server
- `npm run build` – production build
- `npm run start` – run the compiled app
- `npm run lint` – ESLint

## Reference documentation
The backend contract, PRD, and integration details live in:
- `docs/prd.md`
- `docs/api-design.md`
- `docs/frontend-integration.md`

Review these documents before changing endpoints or adding new content models to keep both repos in sync.
