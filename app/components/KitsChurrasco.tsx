"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Flame, Plus } from "lucide-react";
import { pairings } from "./data";

type Pairing = (typeof pairings)[number];

type KitsChurrascoProps = {
  onAdd: (item: Pairing) => void;
};

export default function KitsChurrasco({ onAdd }: KitsChurrascoProps) {
  return (
    <section className="kits-section" id="kits-churrasco">
      <div className="section-shell">
        <motion.div className="kits-intro" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="eyebrow-copper">O RITUAL COMPLETO <span/></div>
          <h2>O corte é protagonista.<br/><em>Os detalhes fazem o momento.</em></h2>
          <p>Complementos escolhidos para acompanhar a brasa e valorizar cada preparo.</p>
        </motion.div>
        <div className="kits-grid">
          {pairings.map((item, index) => (
            <motion.article className="kit-card" key={item.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .65, delay: index * .08, ease: [0.22, 1, 0.36, 1] }}>
              <div className="kit-image"><img src={item.image} alt={item.name} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }}/><span>0{index + 1}</span></div>
              <div className="kit-copy"><div><Flame size={13}/> HARMONIZAÇÃO</div><h3>{item.name}</h3><p>{item.description}</p><button type="button" onClick={() => onAdd(item)}>Adicionar ao pedido <Plus size={14}/></button></div>
            </motion.article>
          ))}
        </div>
        <a className="kits-more" href="#cortes">Voltar aos cortes nobres <ArrowUpRight size={14}/></a>
      </div>
    </section>
  );
}
