"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Flame, Heart, Search, Scale } from "lucide-react";
import { cuts, weightOptions, type Cut, type WeightOption } from "./data";

type CutsShowcaseProps = {
  onAdd: (cut: Cut, weight: WeightOption) => void;
};

const categoryFilters = ["Todos", "Carnes Bovinas", "Dry Aged", "Churrasco"];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.66, ease: [0.22, 1, 0.36, 1] as const } },
};

function CutCard({ cut, onAdd }: { cut: Cut; onAdd: CutsShowcaseProps["onAdd"] }) {
  const [weightIndex, setWeightIndex] = useState(0);
  const [grilled, setGrilled] = useState(false);
  const [liked, setLiked] = useState(false);
  const weight = weightOptions[weightIndex];

  return (
    <motion.article className="cut-card" variants={reveal} layout>
      <div className="cut-card-image">
        <AnimatePresence mode="wait">
          <motion.img
            key={grilled ? "grilled" : "raw"}
            src={grilled ? cut.grilledImage : cut.rawImage}
            alt={cut.name + (grilled ? " preparado na brasa" : " corte cru")}
            initial={{ opacity: 0, scale: 1.035 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.07, transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            onError={(event) => { event.currentTarget.style.display = "none"; }}
          />
        </AnimatePresence>
        <div className="cut-image-vignette"/>
        {cut.badge && <span className="cut-badge">{cut.badge}</span>}
        <button className={liked ? "cut-favorite liked" : "cut-favorite"} type="button" aria-label={liked ? "Remover dos favoritos" : "Adicionar aos favoritos"} onClick={() => setLiked((value) => !value)}>
          <Heart size={16} fill={liked ? "currentColor" : "none"}/>
        </button>
        <div className="cut-image-bottom">
          <span>{grilled ? <><Flame size={12}/> NA BRASA</> : "IN NATURA"}</span>
          <button type="button" onClick={() => setGrilled((value) => !value)}>
            {grilled ? "Ver corte cru" : "Ver na brasa"}
          </button>
        </div>
      </div>
      <div className="cut-card-copy">
        <div className="cut-category">{cut.category}</div>
        <h3>{cut.name}</h3>
        <p>{cut.description}</p>
        <div className="cut-price-row"><span>Valor por kg</span><strong>Sob consulta</strong></div>
        <div className="cut-card-footer">
          <label className="weight-select">
            <Scale size={14}/>
            <select value={weightIndex} onChange={(event) => setWeightIndex(Number(event.target.value))} aria-label={"Escolher peso de " + cut.name}>
              {weightOptions.map((option, index) => <option value={index} key={option.label}>{option.label}</option>)}
            </select>
          </label>
          <button className="add-cut-button" type="button" onClick={() => onAdd(cut, weight)}>
            Adicionar <ArrowUpRight size={14}/>
          </button>
        </div>
        {weight.note && <small className="weight-note">* Peso aproximado; confirme com nossa equipe.</small>}
      </div>
    </motion.article>
  );
}

export default function CutsShowcase({ onAdd }: CutsShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const filteredCuts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return cuts.filter((cut) => {
      const matchesCategory = activeCategory === "Todos" || cut.category === activeCategory;
      const matchesSearch = !term || cut.name.toLocaleLowerCase("pt-BR").includes(term) || cut.description.toLocaleLowerCase("pt-BR").includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <section className="cuts-section" id="cortes">
      <div className="section-shell">
        <motion.div className="section-intro" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.24 }}>
          <div className="eyebrow-copper">SELEÇÃO ESPECIAL LUIZ ALVENSE <span/></div>
          <div className="section-title-row">
            <div><h2>Catálogo de<br/><em>cortes nobres.</em></h2></div>
            <p>Conheça nossa seleção de cortes especiais.<br/>Escolha o peso, compare o corte cru e na brasa<br/>e monte seu pedido com a nossa equipe.</p>
          </div>
        </motion.div>

        <div className="catalog-toolbar">
          <div className="catalog-toolbar-title">
            <div><span>NOSSA VITRINE</span><strong>{filteredCuts.length} {filteredCuts.length === 1 ? "corte disponível" : "cortes selecionados"}</strong></div>
          </div>
          <label className="catalog-search">
            <Search size={15}/>
            <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" aria-label="Buscar cortes por nome ou descrição" placeholder="Buscar cortes..."/>
          </label>
        </div>

        <div className="catalog-layout">
          <aside className="catalog-sidebar" aria-label="Filtrar cortes por categoria">
            <strong>Categorias</strong>
            {categoryFilters.map((category) => (
              <button key={category} type="button" className={activeCategory === category ? "catalog-category active" : "catalog-category"} onClick={() => setActiveCategory(category)}>
                {category}
                {category === "Todos" && <span>›</span>}
              </button>
            ))}
            <div className="catalog-sidebar-note">
              <span>PRECISA DE AJUDA?</span>
              <p>Nossa equipe ajuda você a escolher o corte ideal.</p>
              <a href="#contato">Fale conosco <ArrowUpRight size={13}/></a>
            </div>
          </aside>

          <div className="catalog-results">
            <div className="catalog-results-top"><span>Exibindo {filteredCuts.length} de {cuts.length} cortes</span><span>SELEÇÃO <strong>LUIZ ALVENSE</strong></span></div>
            <motion.div className="cuts-grid" layout initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.075 } } }}>
              <AnimatePresence mode="popLayout">
                {filteredCuts.map((cut) => <CutCard key={cut.id} cut={cut} onAdd={onAdd}/>)}
              </AnimatePresence>
            </motion.div>
            {filteredCuts.length === 0 && <div className="catalog-empty">Nenhum corte encontrado. Tente outra busca ou categoria.</div>}
          </div>
        </div>

        <div className="catalog-footer-note"><span/> CORTES SELECIONADOS · DISPONIBILIDADE E PESO FINAL SOB CONSULTA <span/></div>
      </div>
    </section>
  );
}
