import { eq } from "drizzle-orm";
import { catalogProductsTable, db } from "@workspace/db";
import { catalogSeedProducts } from "./luisalvense-catalog-data";

const normalizeName = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();

function toProductValues(product: (typeof catalogSeedProducts)[number]) {
  return {
    name: product.name,
    category: product.category,
    description: product.description,
    pricePerKg: product.pricePerKg,
    saleUnit: product.saleUnit,
    active: true,
    status: "active",
    productType: product.productType,
    stockQuantity: null,
    imageUrl: null,
    promoPrice: null,
    promoLabel: null,
    promoStartsAt: null,
    promoEndsAt: null,
    editorial: product.editorial,
    demo: false,
  };
}

export async function seedLuisalvenseCatalog(): Promise<void> {
  if (process.env.NODE_ENV !== "development") return;

  const initialProducts = await db.select().from(catalogProductsTable);
  if (initialProducts.some((product) => product.editorial?.sourceId)) return;
  if (
    initialProducts.length > 3 ||
    initialProducts.some((product) => !product.demo)
  ) {
    return;
  }

  await db.transaction(async (tx) => {
    const products = await tx.select().from(catalogProductsTable);
    if (products.some((product) => product.editorial?.sourceId)) return;
    if (
      products.length > 3 ||
      products.some((product) => !product.demo)
    ) {
      return;
    }

    const importedSourceIds = new Set<string>();
    for (const demoProduct of products) {
      const matchingSource = catalogSeedProducts.find(
        (product) => normalizeName(product.name) === normalizeName(demoProduct.name),
      );

      if (!matchingSource) {
        await tx
          .update(catalogProductsTable)
          .set({ active: false, status: "inactive" })
          .where(eq(catalogProductsTable.id, demoProduct.id));
        continue;
      }

      const sourceId = matchingSource.editorial.sourceId;
      if (sourceId) importedSourceIds.add(sourceId);
      await tx
        .update(catalogProductsTable)
        .set(toProductValues(matchingSource))
        .where(eq(catalogProductsTable.id, demoProduct.id));
    }

    const remainingProducts = catalogSeedProducts
      .filter((product) => !importedSourceIds.has(product.editorial.sourceId ?? ""))
      .map(toProductValues);

    if (remainingProducts.length > 0) {
      await tx.insert(catalogProductsTable).values(remainingProducts);
    }
  });
}
