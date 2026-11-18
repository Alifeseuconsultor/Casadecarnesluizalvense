"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Product = {
  id: number; name: string; category: string; description: string | null;
  saleUnit: "kg" | "g" | "unidade"; pricePerKg: number; imageUrl: string | null;
  status: string; productType: "product" | "combo";
  promoPrice: number | null; promoStartsAt: string | null; promoEndsAt: string | null;
  editorial?: { tagline?: string | null; badges?: string[]; priceOnRequest?: boolean } | null;
};

// Nomes editoriais para as categorias do cadastro Luiz Alvense importado do Replit.
const families = [
  ["Bovinos", "Bovinos · sem osso", "Bovinos · com osso"],
  ["Suínos", "Carne Suína"],
  ["Aves", "Aves Temperadas"],
  ["Ovinos", "Carne Ovina"],
  ["Embutidos"],
  ["Cortes especiais", "Cortes Especiais"],
  ["Peças inteiras", "Cortes Inteiros"],
  ["Miúdos", "Miúdos Bovinos", "Miúdos Suínos"],
  ["Combos"],
  ["Diversos"],
];

function topicFor(category: string) {
  return families.find(names => names.includes(category))?.[0] ?? category;
}

function useCatalogState() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [topic, setTopic] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [term, setTerm] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/catalog", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("catalog unavailable");
        const data: unknown = await response.json();
        if (!Array.isArray(data)) throw new Error("invalid catalog response");
        if (!controller.signal.aborted) {
          setProducts(data);
          setStatus("ready");
        }
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);

  function selectTopic(next: string | null) {
    setTopic(next);
    setCategory(null);
    setTerm("");
  }
  function retry() {
    setStatus("loading");
    setAttempt(count => count + 1);
  }

  const liveTopics = new Set(products.map(product => topicFor(product.category)));
  const knownTopics = families.map(([label]) => label);
  const topics = status === "ready" && products.length > 0
    ? [...knownTopics.filter(label => liveTopics.has(label)), ...[...liveTopics].filter(label => !knownTopics.includes(label))]
    : knownTopics;
  const currentTopic = topic !== null && topics.includes(topic) ? topic : null;
  const groupProducts = currentTopic === null ? products : products.filter(product => topicFor(product.category) === currentTopic);
  const categories = [...new Set(groupProducts.map(product => product.category))];
  const currentCategory = category !== null && categories.includes(category) ? category : null;
  const query = term.trim().toLocaleLowerCase("pt-BR");
  const filtered = groupProducts.filter(product =>
    (currentCategory === null || product.category === currentCategory) &&
    (product.name + " " + (product.description || "")).toLocaleLowerCase("pt-BR").includes(query)
  );

  return { status, products, topics, topic: currentTopic, selectTopic, categories, category: currentCategory, setCategory, filtered, term, setTerm, retry };
}

const CatalogContext = createContext<ReturnType<typeof useCatalogState> | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const catalog = useCatalogState();
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const catalog = useContext(CatalogContext);
  if (!catalog) throw new Error("CatalogProvider required");
  return catalog;
}
