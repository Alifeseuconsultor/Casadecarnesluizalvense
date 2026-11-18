import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type CatalogProduct = {
  id: number;
  name: string;
  category: string;
  description: string | null;
  pricePerKg: number;
  saleUnit: "kg" | "g" | "unidade";
  imageUrl: string | null;
  status: "active" | "inactive" | "sold_out";
  active: boolean;
  promoPrice: number | null;
  promoStartsAt: string | null;
  promoEndsAt: string | null;
  productType: "product" | "combo";
  editorial?: { tagline?: string | null; badges?: string[]; priceOnRequest?: boolean } | null;
};

function isCatalogProduct(value: unknown): value is CatalogProduct {
  if (!value || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return typeof p.id === "number" && typeof p.name === "string" &&
    typeof p.category === "string" && typeof p.pricePerKg === "number" &&
    ["kg", "g", "unidade"].includes(String(p.saleUnit)) &&
    typeof p.active === "boolean" && typeof p.status === "string";
}

export async function GET() {
  const base = process.env.REPLIT_CATALOG_API_URL;
  if (!base) return NextResponse.json(
    { error: "O catálogo online ainda não está configurado." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
  try {
    const url = new URL(base);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
      return NextResponse.json({ error: "Configuração do catálogo inválida." }, { status: 503 });
    }
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("catalog upstream not OK");
    const data: unknown = await res.json();
    if (!Array.isArray(data) || data.length > 1000 || !data.every(isCatalogProduct)) {
      throw new Error("unexpected catalog schema");
    }
    const publicProducts = data
      .filter((p) => p.active && p.status !== "inactive")
      .map((p) => ({
        id: p.id, name: p.name, category: p.category,
        description: p.description, saleUnit: p.saleUnit,
        pricePerKg: p.pricePerKg, imageUrl: p.imageUrl,
        status: p.status, productType: p.productType,
        promoPrice: p.promoPrice, promoStartsAt: p.promoStartsAt,
        promoEndsAt: p.promoEndsAt, editorial: p.editorial,
      }));
    return NextResponse.json(publicProducts, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { error: "Não conseguimos atualizar o catálogo agora. Tente novamente mais tarde." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
