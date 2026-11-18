# Select

- **Source:** `artifacts/acougue-ops/src/index.css`, `.admin-input` and
  `.admin-toolbar select` (lines 683–684).
- **Call sites:** `artifacts/acougue-ops/src/pages/admin-pages.tsx`, catalog
  category filter and product editor (lines 66 and 71–72); settings option
  controls (lines 130–131).
- **Source behavior:** Native `<select>` behavior and keyboard interaction;
  the category control is slightly wider than ordinary fields.
- **Package API:** `Select` wraps a native select and preserves its standard
  attributes and children.
- **Dependencies:** None beyond React and the package's `cn` helper.
- **License:** First-party workspace source.
