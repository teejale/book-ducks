# Book Ducks on Vercel

The frontend and Strapi use separate Vercel projects from this repository.

| Project | Root directory | Purpose |
| --- | --- | --- |
| `book-ducks` | repository root | Publishes `frontend` using the root `vercel.json` |
| `book-ducks-5vz8` | `backend` | Runs Strapi through `api/index.js` and `backend/vercel.json` |

The frontend's public backend URL is set once in `frontend/general/api.js`.

## Backend storage and configuration

- Neon Free PostgreSQL: `book-ducks-db`, Frankfurt, connected to Production as `DATABASE_URL`.
- Public Vercel Blob: `book-ducks-images`, Stockholm. Stores public cover and homepage images. The SDK uses Vercel's identity and `BLOB_STORE_ID`; no browser-side upload token is required.
- Vercel Functions region: Stockholm (`arn1`).

Set these variables in the backend project's Production environment:

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `DATABASE_CLIENT` | `postgres` |
| `DATABASE_POOL_MIN` | `0` |
| `DATABASE_POOL_MAX` | `2` |
| `PUBLIC_URL` | `https://book-ducks-5vz8.vercel.app` |
| `STRAPI_TELEMETRY_DISABLED` | `true` |
| `VERCEL_SUPPORT_LARGE_FUNCTIONS` | `1` |
| `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY` | Independently generated secret values |

Database and Blob connection variables are supplied by their Vercel integrations. Keep all secrets out of Git. `backend/.tmp` is ignored. Local development continues to use SQLite unless a database is explicitly configured.

Strapi loads plugins and schemas dynamically, so the function configuration includes its application files and dependencies. The large-function option accommodates Strapi's dependency size. Preview deployments do not share the production database and need a separate database and secrets before they can run.

## Migrated data

The original `backend2` database was copied and exported with Strapi, then imported into Neon. It contains 21 published books, 20 categories, 27 ratings, homepage/settings content, and 10 application accounts. The original administrator was restored separately because Strapi's export omits administrators. Existing password hashes were preserved.

All 128 original image files and variants are stored in Vercel Blob, and database image references use their public URLs. Original role permissions were imported. `backend2` is excluded from Git and deployment uploads; migration archives and credentials remain ignored in `backend/.tmp`.

Verify `/_health` returns 204, `/admin` loads, and the public books and homepage appear after each deployment. Use the original administrator login at `https://book-ducks-5vz8.vercel.app/admin`.

## Limits

This is an adapted serverless deployment. Strapi can have slow cold starts. Uploaded images are limited to 4 MB so multipart requests stay below Vercel's payload limit. Free database and Blob quotas apply; no paid plan is required by this configuration.

References: [Vercel Node servers](https://vercel.com/docs/functions/runtimes/node-js), [Strapi deployment](https://docs.strapi.io/cms/deployment), [Strapi serverless considerations](https://docs.strapi.io/cms/faq#can-strapi-be-run-in-serverless-environments).
