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
  if (!["development", "production"].includes(process.env.NODE_ENV ?? "")) return;

  await db.transaction(async (tx) => {
    const products = await tx.select().from(catalogProductsTable);
    const productsBySourceId = new Map<string, (typeof products)[number]>();
    for (const product of products) {
      const sourceId = product.editorial?.sourceId;
      if (!sourceId) continue;
      if (productsBySourceId.has(sourceId)) {
        throw new Error(`Duplicate catalog editorial sourceId: ${sourceId}`);
      }
      productsBySourceId.set(sourceId, product);
    }

    const sourceIds = catalogSeedProducts.map((product) => product.editorial.sourceId);
    if (sourceIds.some((sourceId) => !sourceId) || new Set(sourceIds).size !== sourceIds.length) {
      throw new Error("The approved catalog must have a unique sourceId for every product.");
    }

    const claimedDemoIds = new Set<number>();
    const missingProducts = [];
    for (const seedProduct of catalogSeedProducts) {
      const sourceId = seedProduct.editorial.sourceId!;
      const importedProduct = productsBySourceId.get(sourceId);
      if (importedProduct) {
        if (importedProduct.demo) {
          await tx
            .update(catalogProductsTable)
            .set(toProductValues(seedProduct))
            .where(eq(catalogProductsTable.id, importedProduct.id));
        }
        continue;
      }

      const matchingByName = products.filter(
        (product) =>
          !product.editorial?.sourceId &&
          !claimedDemoIds.has(product.id) &&
          normalizeName(product.name) === normalizeName(seedProduct.name),
      );
      const matchingDemo = matchingByName.find((product) => product.demo);
      let matchingProduct = matchingDemo;

      if (!matchingProduct && matchingByName.length === 1) {
        matchingProduct = matchingByName[0];
      } else if (!matchingProduct && matchingByName.length > 1) {
        const sameCategory = matchingByName.filter(
          (product) =>
            normalizeName(product.category) === normalizeName(seedProduct.category),
        );
        if (sameCategory.length === 1) {
          matchingProduct = sameCategory[0];
        } else {
          throw new Error(
            `Cannot safely match existing catalog product "${seedProduct.name}" to its approved source entry.`,
          );
        }
      }

      if (matchingProduct) {
        await tx
          .update(catalogProductsTable)
          .set(toProductValues(seedProduct))
          .where(eq(catalogProductsTable.id, matchingProduct.id));
        claimedDemoIds.add(matchingProduct.id);
        productsBySourceId.set(sourceId, matchingProduct);
      } else {
        missingProducts.push(toProductValues(seedProduct));
      }
    }

    if (missingProducts.length > 0) {
      await tx
        .insert(catalogProductsTable)
        .values(missingProducts)
        .onConflictDoNothing();
    }
  });
}
