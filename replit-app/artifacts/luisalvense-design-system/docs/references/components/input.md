# Input

- **Source:** `artifacts/acougue-ops/src/index.css`, `.admin-search`,
  `.admin-search input`, and `.admin-input` (lines 681–683).
- **Call sites:** `artifacts/acougue-ops/src/pages/admin-pages.tsx`, product
  search and editor fields (lines 66 and 70–75); settings fields (lines
  128–130).
- **Source behavior:** Native text, numeric, URL, and time inputs; the source
  applies a warm surface, thin border, compact height, and visible focus outline.
- **Package API:** `Input` wraps a native input and preserves native attributes,
  types, labels, and browser behavior.
- **Dependencies:** None beyond React and the package's `cn` helper.
- **License:** First-party workspace source.
