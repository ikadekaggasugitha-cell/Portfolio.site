# API v2 field & contract changes

Coordinated update adding public profile/skill/project/experience fields plus
server-side project search, filtering and pagination. **All changes are
backward compatible** — existing endpoint URLs are unchanged, new columns are
nullable or defaulted, and the `data` shape of every existing response is
preserved (only additive).

Run once after deploy: `php artisan migrate`
Reverse if needed: `php artisan migrate:rollback` (all four migrations are reversible).

## Response envelope

Unchanged for single/collection resources:

```json
{ "success": true, "message": "Success", "data": ... }
```

Paginated collections (currently `GET /projects`) additionally include `meta`:

```json
{
  "success": true,
  "message": "Success",
  "data": [ /* ProjectResource[] */ ],
  "meta": { "current_page": 1, "last_page": 5, "per_page": 9, "total": 41, "from": 1, "to": 9 }
}
```

## New fields

| Resource | Field | Type | Notes |
|---|---|---|---|
| Profile | `email` | string \| null | Public contact email |
| Profile | `location` | string \| null | e.g. "Bali, Indonesia" |
| Profile | `is_available` | boolean | Defaults `true`; drives the "available for work" status |
| Skill | `category` | string \| null | Free string (e.g. `Frontend`, `Backend`, `DevOps & Cloud`, `Design & Craft`). Indexed. Not a DB enum, so new categories need no migration; validated as `max:50`. |
| Project | `is_featured` | boolean | Defaults `false` |
| Project | `sort_order` | integer | Defaults `0`; lower shows first |
| Experience | `location` | string \| null | e.g. "Remote" |

## Endpoints

Public (unauthenticated) GET endpoints and URLs are unchanged:
`/api/v1/profile`, `/skills`, `/experiences`, `/educations`, `/certificates`,
`/projects`, `/projects/{id}`.

### `GET /api/v1/projects` — now searchable, filterable, paginated

| Query param | Type | Default | Description |
|---|---|---|---|
| `search` | string | — | Case-insensitive match on title, description or technology |
| `technology` | string | — | Filter by a technology tag (substring match on the CSV `technology` field) |
| `per_page` | int | 9 | Clamped to 1–50 |
| `page` | int | 1 | Standard Laravel pagination |

- Results are ordered **`is_featured` desc, `sort_order` asc, `id` desc**.
- `images` are **eager-loaded** on the index (no N+1); `GET /projects/{id}` continues to eager-load `images`.
- Backed by the composite index `projects_featured_sort_index (is_featured, sort_order)`.

Admin write endpoints (`POST/PUT`) now accept and validate the new fields:
- Projects: `is_featured` (boolean), `sort_order` (integer ≥ 0)
- Profile: `email` (email), `location` (string), `is_available` (boolean)
- Skills: `category` (string, ≤ 50)
- Experiences: `location` (string)

## Migrations

| File | Adds |
|---|---|
| `2026_07_19_000001_add_contact_fields_to_profiles_table` | profiles.email, location, is_available |
| `2026_07_19_000002_add_category_to_skills_table` | skills.category (+ index) |
| `2026_07_19_000003_add_featured_and_sort_order_to_projects_table` | projects.is_featured, sort_order (+ composite index) |
| `2026_07_19_000004_add_location_to_experiences_table` | experiences.location |

## Architecture notes

- Layering preserved: Controller → Service → Repository → Model. Search/filter
  logic lives in `ProjectRepository::paginateFiltered()`, surfaced via
  `ProjectService::paginateFiltered()` and the `ProjectRepositoryInterface`.
- The paginated envelope is produced by `ApiResponse::paginated()` (new trait
  method); `success()` is unchanged for all other endpoints.
