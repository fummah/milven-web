/* Removes duplicate admin route files that resolve to the same URL.
 *
 * `(protected)` is an App Router route group, so:
 *   app/admin/<route>/page.tsx            -> /admin/<route>
 *   app/admin/(protected)/<route>/page.tsx -> /admin/<route>
 * Having both causes a Next.js "two parallel pages resolve to the same path"
 * build error. This keeps the (protected) version and removes the duplicate.
 *
 * Runs automatically via the `prebuild` npm hook, so build output (including
 * deployments where files were uploaded additively) is always clean.
 *
 * Safe: `(protected)`, `login`, and any unique (non-duplicated) route are kept.
 */
const fs = require("fs")
const path = require("path")

const APP = path.join(process.cwd(), "app", "admin")
const GROUP = path.join(APP, "(protected)")

function log(msg) {
  console.log(`[clean-admin-duplicates] ${msg}`)
}

if (!fs.existsSync(APP) || !fs.existsSync(GROUP)) {
  log("no admin/(protected) group found — nothing to do")
  process.exit(0)
}

let removed = 0

// 1) Root dashboard duplicate: app/admin/page.tsx vs app/admin/(protected)/page.tsx
const rootDup = path.join(APP, "page.tsx")
const rootProtected = path.join(GROUP, "page.tsx")
if (fs.existsSync(rootDup) && fs.existsSync(rootProtected)) {
  fs.rmSync(rootDup, { force: true })
  log("removed duplicate app/admin/page.tsx")
  removed++
}

// 2) Per-route duplicates: app/admin/<route>/page.tsx
const groupRoutes = fs
  .readdirSync(GROUP, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

for (const route of groupRoutes) {
  const duplicateDir = path.join(APP, route)
  const duplicatePage = path.join(duplicateDir, "page.tsx")
  const protectedPage = path.join(GROUP, route, "page.tsx")
  if (fs.existsSync(duplicatePage) && fs.existsSync(protectedPage)) {
    fs.rmSync(duplicateDir, { recursive: true, force: true })
    log(`removed duplicate app/admin/${route}`)
    removed++
  }
}

log(`done. removed=${removed}`)
