# Button

- **Source:** `artifacts/acougue-ops/src/index.css`, `.button` and its
  `.button-dark`, `.button-outline`, and `.button-active` variants (lines
  434–440).
- **Call sites:** `artifacts/acougue-ops/src/pages/admin-pages.tsx`, toolbar,
  editor actions, and product actions (lines 66, 76, and 79).
- **Source behavior:** Native `<button>` semantics; disabled buttons reduce
  opacity and stop receiving clicks. No separate button component is exported
  by the source page.
- **Package API:** `Button` wraps a native button and preserves its standard
  attributes. Variants represent the observed dark-green primary, neutral
  outline, pale selected, and quiet action treatments.
- **Dependencies:** None beyond React and the package's `cn` helper.
- **License:** First-party workspace source.
