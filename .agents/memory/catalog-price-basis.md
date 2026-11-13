---
name: Catalog price basis
description: The pricing convention shared by catalog products and persisted order items.
---

Keep the existing `pricePerKg` order field for compatibility. For products sold by kg or grams, it is the price per kilogram; gram quantities are converted to kilograms before calculating totals. For products sold by unit, the same field represents the price per unit.

**Why:** Existing orders store this price field as a snapshot, and unit-based orders already calculate from quantity rather than weight. Renaming or changing the convention would make saved order totals inconsistent.

**How to apply:** Keep catalog labels explicit about the applicable price basis and ensure order totals, promotions, and reports follow the same conversion.
