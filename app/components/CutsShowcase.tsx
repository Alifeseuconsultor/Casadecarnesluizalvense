"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Flame, Heart, Scale } from "lucide-react";
import { cuts, weightOptions, type Cut, type WeightOption } from "./data";

type CutsShowcaseProps = {
  onAdd: (cut: Cut, weight: WeightOption) => void;
};

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] as const } },
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
            initial={{ opacity: 0, scale: 1.045 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            onError={(event) => { event.currentTarget.style.display = "none"; }}
          />
        </AnimatePresence>
        <div className="cut-image-vignette"/>
        {cut.badge && <span className="cut-badge">{cut.badge}</span>}
        <button className={liked ? "cut-favorite liked" : "cut-favorite"} type="button" aria-label={liked ? "Remover dos favoritos" : "Adicionar aos favoritos"} onClick={() => setLiked((value) => !value)}>
          <Heart size={17} fill={liked ? "currentColor" : "none"}/>
        </button>
        <div className="cut-image-bottom">
          <span>{grilled ? <><Flame size={12}/> NA BRASA</> : "CORTE IN NATURA"}</span>
          <button type="button" onClick={() => setGrilled((value) => !value)}>
            {grilled ? "Ver cru" : "Ver na brasa"}
          </button>
        </div>
      </div>
      <div className="cut-card-copy">
        <div className="cut-category">{cut.category}</div>
        <h3>{cut.name}</h3>
        <p>{cut.description}</p>
        <div className="cut-price-row"><span>Disponibilidade e valor</span><strong>Sob consulta</strong></div>
        <div className="cut-card-footer">
          <label className="weight-select">
            <Scale size={14}/>
            <select value={weightIndex} onChange={(event) => setWeightIndex(Number(event.target.value))} aria-label={"Escolher peso de " + cut.name}>
              {weightOptions.map((option, index) => <option value={index} key={option.label}>{option.label}</option>)}
            </select>
          </label>
          <button className="add-cut-button" type="button" onClick={() => onAdd(cut, weight)}>
            Adicionar ao pedido <ArrowUpRight size={15}/>
          </button>
        </div>
        {weight.note && <small className="weight-note">* Peso aproximado; confirme com nossa equipe.</small>}
      </div>
    </motion.article>
  );
}

export default function CutsShowcase({ onAdd }: CutsShowcaseProps) {
  return (
    <section className="cuts-section" id="cortes">
      <div className="section-shell">
        <motion.div className="section-intro" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.28 }}>
          <div className="eyebrow-copper">A SELEÇÃO LUIZ ALVENSE <span/></div>
          <div className="section-title-row">
            <div><h2>Cortes que merecem<br/><em>o centro da mesa.</em></h2></div>
            <p>Origem, marmoreio e cuidado em cada escolha.<br/>Conheça uma seleção feita para apreciar sem pressa.</p>
          </div>
          <div className="view-legend"><span><i className="legend-raw"/> IN NATURA</span><span><i className="legend-fire"/> NA BRASA</span><small>Alterne as imagens em cada corte</small></div>
        </motion.div>
        <motion.div className="cuts-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={{ visible: { transition: { staggerChildren: 0.09 } } }}>
          {cuts.map((cut) => <CutCard key={cut.id} cut={cut} onAdd={onAdd}/>)}
        </motion.div>
      </div>
    </section>
  );
}
