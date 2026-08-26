# Link Shortener Feature

A self-contained URL shortener with analytics, expiration, QR codes, and password-protected links.

Drop-in / drop-out: every piece of logic, schema, UI, and route lives inside this folder. The only external touchpoints are documented below.

## What's inside

| Concern | Path |
| --- | --- |
| Schema (Drizzle) | `db/tables/links.ts`, `db/tables/linkClicks.ts` |
| Zod validation | `link.schema.ts` |
| Repository (DB queries) | `link.repository.ts` |
| Service (business logic) | `link.service.ts` |
| Helpers (slug, UA, geo, OG) | `lib/` |
| Form actions | `actions/create-link.action.ts`, `actions/edit-link.action.ts`, `actions/delete-link.action.ts` |
| API (JSON) | `api/link-stats.ts` |
| UI (pages) | `ui/link-page.tsx`, `ui/link-form.tsx`, `ui/link-detail-page.tsx`, `ui/redirect.tsx` |
| UI (charts, cards, QR, etc.) | `ui/clicks-timeseries-chart.tsx`, `ui/device-breakdown-chart.tsx`, `ui/top-*-table.tsx`, `ui/recent-clicks-table.tsx`, `ui/link-summary-cards.tsx`, `ui/qr-card.tsx`, `ui/og-preview-card.tsx`, `ui/copy-button.tsx`, `ui/link-actions.tsx` |
| Route registration | `routes.ts` (exported `linkShortenerPublicRoutes` + `linkShortenerAuthenticatedRoutes`) |
| Sidebar nav item | `nav.ts` (exported `LinkShortenerNav`) |

## Features

- Short URL generation: random `nanoid`-style slug (7 chars, no ambiguous chars) or custom slug.
- Visit tracking: timestamp, referrer, user-agent, country (`CF-IPCountry`), city (`CF-IPCity`), device/OS/browser (via `ua-parser-js`).
- Analytics dashboard: time-series chart (7d/30d/90d toggle), device breakdown (pie), top countries (with progress bars), top referrers, recent clicks.
- OG image preview (auto-fetched on link creation, 3s timeout).
- QR code with PNG/SVG download (`qrcode.react`, canvas-based PNG renderer).
- Expiration: by date or by max clicks; `LinkStatus` computed dynamically.
- Password protection: SHA-256 hash stored in `links.passwordHash`; password gate form on the redirect page; signed cookie scoped per link (15 min).
- Soft-disable via `isActive` boolean.
- Per-user ownership (rows scoped by `userId`).

## External touchpoints

To make this feature work, three small lines were added outside the folder:

1. **`app/db/schema/sqlite/index.ts`** — appends `export * from '../../../features/link-shortener/db';` so Drizzle sees the new tables when generating migrations.

2. **`app/routes.ts`** — imports `linkShortenerPublicRoutes` and `linkShortenerAuthenticatedRoutes` from `./features/link-shortener/routes` and spreads them into the public-layout and authenticated-layout respectively.

3. **`app/components/blocks/layout/navigation-menu-items.ts`** — spreads `LinkShortenerNav` into the existing `navigation` array.

Removing the feature:

```bash
rm -rf app/features/link-shortener
# then revert the three touchpoint lines in:
#   app/db/schema/sqlite/index.ts
#   app/routes.ts
#   app/components/blocks/layout/navigation-menu-items.ts
# optionally drop the link tables from the DB:
#   wrangler d1 execute react-router-example --local --command "DROP TABLE IF EXISTS link_clicks; DROP TABLE IF EXISTS links;"
```

That's it. No other files reference the feature.

## Routes added

| Path | File | Notes |
| --- | --- | --- |
| `GET /:slug` | `ui/redirect.tsx` | Public redirect handler; password gate when protected |
| `GET /links` | `ui/link-page.tsx` | List (auth required) |
| `GET /links/new-record` | `ui/link-form.tsx` | Create form (auth required) |
| `GET /links/:id/edit-record` | `ui/link-form.tsx` | Edit form (auth + ownership required) |
| `GET /links/:id` | `ui/link-detail-page.tsx` | Analytics dashboard |
| `POST /links/actions/create` | `actions/create-link.action.ts` | Auth required |
| `POST /links/actions/edit` | `actions/edit-link.action.ts` | Auth + ownership required |
| `POST /links/actions/delete` | `actions/delete-link.action.ts` | Auth + ownership required |
| `GET /api/links/stats/:id?range=7d\|30d\|90d` | `api/link-stats.ts` | JSON; auth + ownership required |

## Migrations

After any schema change:

```bash
pnpm drizzle:generate
pnpm db:migrate        # local
pnpm db:migrate-production   # remote
```

To start fresh locally:

```bash
pnpm db:reset:local
```

## Key design decisions

- **Counter denormalization**: `links.totalClicks` is incremented in the same operation as inserting a `linkClicks` row. This avoids aggregate queries on the list page.
- **Hard delete + cascade**: `linkClicks.linkId` uses `ON DELETE CASCADE`, so deleting a link removes its analytics in one statement.
- **Bot filtering**: requests with bot-like User-Agents (Googlebot, AhrefsBot, etc.) are categorized as `device_type = 'bot'` so they don't pollute analytics charts.
- **OG preview with timeout**: 3-second fetch with a hard cap on body size. Failures are silent — the link is still created without a preview.
- **IP privacy**: IPs are hashed (SHA-256) before storage. The hash isn't currently used for dedup but is available for future features.
- **Password cookie**: scoped to the slug (`lpw_<slug>=...`), 15-min expiry, `SameSite=Lax`. A password is required once per 15 minutes per slug.
- **Range query in loader**: the analytics loader accepts `?range=7d|30d|90d` so chart ranges can be deep-linked.
- **Cloudflare geo headers**: rely on `CF-IPCountry`, `CF-IPCity`, `CF-IPContinent`, `CF-Connecting-IP`. These are auto-injected by the Cloudflare edge.

## Smoke test

1. Run `pnpm dev` and visit `http://localhost:5173/links`.
2. Click "Add", paste a URL, save.
3. Click the row's analytics icon → see QR + charts.
4. From a new tab, open `http://localhost:5173/<your-slug>` → should 302 to the original URL.
5. Add a password to the link, retry → password gate should appear.
6. Set `expiresAt` in the past → visit slug again → "Link expired" screen.

## Known limitations

- OG preview only handles HTML pages; PDFs, images, and JS-rendered meta tags won't be picked up.
- No rate limiting on the redirect endpoint (consider a Cloudflare WAF rule for production).
- No CSV export of clicks yet.
- No link groups/tags (deliberately excluded from the first cut).
