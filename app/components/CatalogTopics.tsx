"use client";

import { useEffect, useRef, useState } from "react";
import {
  Beef, Bone, Boxes, ChevronLeft, ChevronRight, CookingPot, Drumstick, Flame, Grid2X2,
  Ham, Heart, Layers, PackageOpen, Sandwich, Tag, type LucideIcon,
} from "lucide-react";
import { useCatalog } from "./CatalogProvider";

const icons: Record<string, LucideIcon> = {
  Bovinos: Beef, Suínos: Ham, Aves: Drumstick, Ovinos: Bone, Embutidos: Sandwich,
  "Cortes especiais": Flame, "Peças inteiras": Layers, Miúdos: Heart, Combos: PackageOpen, Diversos: CookingPot, Kits: Boxes,
};

export default function CatalogTopics() {
  const { topics, topic, selectTopic } = useCatalog();
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ before: false, after: false });

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    function measure() {
      if (!element) return;
      const before = element.scrollLeft > 2;
      const after = element.scrollLeft + element.clientWidth < element.scrollWidth - 2;
      setEdges(old => old.before === before && old.after === after ? old : { before, after });
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    element.addEventListener("scroll", measure, { passive: true });
    measure();
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", measure);
    };
  }, []);

  function scroll(direction: number) {
    const element = rail.current;
    if (element) element.scrollBy({ left: direction * element.clientWidth * 0.75, behavior: "auto" });
  }

  return (
    <nav className="catalog-topics" aria-label="Categorias de produtos">
      <div className="topic-shell">
        <button className="topic-arrow" type="button" aria-label="Categorias anteriores" disabled={!edges.before} onClick={() => scroll(-1)}><ChevronLeft /></button>
        <div className="topic-scroll" ref={rail}>
          <div className="topic-list">
            {[null, ...topics].map(label => {
              const Icon = label === null ? Grid2X2 : icons[label] ?? Tag;
              return (
                <a key={label === null ? "all" : "category-" + label} href="#cortes" aria-current={topic === label ? "true" : undefined} onClick={() => selectTopic(label)}>
                  <Icon size={25} strokeWidth={1.65} aria-hidden="true" />
                  <span>{label ?? "Todos"}</span>
                </a>
              );
            })}
          </div>
        </div>
        <button className="topic-arrow" type="button" aria-label="Próximas categorias" disabled={!edges.after} onClick={() => scroll(1)}><ChevronRight /></button>
      </div>
    </nav>
  );
}
