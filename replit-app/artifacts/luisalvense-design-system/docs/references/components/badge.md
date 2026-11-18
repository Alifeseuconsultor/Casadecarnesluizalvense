# Badge

- **Source:** `artifacts/acougue-ops/src/index.css`, `.product-state` and
  `.state-sold_out` / `.state-inactive` (lines 712–713).
- **Call site:** `artifacts/acougue-ops/src/pages/admin-pages.tsx`, state
  label in each product card (line 79).
- **Source behavior:** Compact labels identify active, sold-out, and inactive
  products with distinct colors. The source also has a separate demonstration
  marker; it does not encode live inventory.
- **Package API:** `Badge` exposes semantic `active`, `soldOut`, `inactive`,
  `demo`, `accent`, and neutral variants.
- **Dependencies:** None beyond React and the package's `cn` helper.
- **License:** First-party workspace source.
