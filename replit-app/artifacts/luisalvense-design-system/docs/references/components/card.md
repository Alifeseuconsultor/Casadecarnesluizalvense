# Card

- **Source:** `artifacts/acougue-ops/src/index.css`, `.catalog-item`,
  `.catalog-photo`, and `.catalog-info` (lines 706–717).
- **Call site:** `artifacts/acougue-ops/src/pages/admin-pages.tsx`, product
  card composition (line 79).
- **Source behavior:** The product card has a warm surface, fine border,
  approximately 7 px corners, and a small lift on hover. The package exports
  neutral card primitives; product-specific data stays in the application.
- **Package API:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`,
  `CardContent`, and `CardFooter`.
- **Dependencies:** None beyond React and the package's `cn` helper.
- **License:** First-party workspace source.
