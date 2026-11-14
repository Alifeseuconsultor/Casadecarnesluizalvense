"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Info, Sparkles } from "lucide-react";
import { beefRegions, type BeefRegion } from "./data";

const silhouette = "M105 103 C132 65 191 50 260 53 C335 46 418 67 470 104 L505 103 L526 83 L548 86 L541 109 L523 135 L501 145 L491 205 L472 205 L464 151 C438 166 411 174 374 177 L365 270 L343 270 L337 181 L247 181 L234 270 L212 270 L207 172 C166 166 139 149 125 132 L104 137 L85 123 L98 113 L78 104 L82 91 Z";

const regionShapes: Record<string, string> = {
  shoulder: "M104 100 L205 61 L231 174 L126 149 L92 123 Z",
  ribs: "M205 61 L332 55 L344 177 L231 174 Z",
  loin: "M332 55 L420 75 L438 161 L344 177 Z",
  rump: "M420 75 L480 103 L501 145 L464 151 L438 161 Z",
};

type InteractiveBeefMapProps = {
  onChooseCut?: (region: BeefRegion) => void;
};

export default function InteractiveBeefMap({ onChooseCut }: InteractiveBeefMapProps) {
  const [selectedId, setSelectedId] = useState("ribs");
  const selected = beefRegions.find((region) => region.id === selectedId) || beefRegions[0];

  const choose = (region: BeefRegion) => {
    setSelectedId(region.id);
    onChooseCut?.(region);
  };

  return (
    <section className="beef-map-section" id="mapa-do-boi">
      <div className="section-shell">
        <motion.div className="map-intro" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="eyebrow-copper">CONHEÇA A ORIGEM DO SABOR <span/></div>
          <h2>Mapa do boi.<br/><em>Cada corte tem sua história.</em></h2>
          <p>Explore as principais regiões e descubra características, sugestões de preparo e o ponto que valoriza cada corte.</p>
        </motion.div>

        <div className="beef-map-layout">
          <motion.div className="beef-illustration" initial={{ opacity: 0, x: -26 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <div className="map-art-label"><span>ANATOMIA DO CORTE</span><i/> SELEÇÃO BOVINA</div>
            <svg viewBox="0 0 600 320" role="img" aria-label="Ilustração do boi dividida em quatro regiões de cortes">
              <defs>
                <linearGradient id="cowBody" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#40352a"/>
                  <stop offset=".5" stopColor="#211c17"/>
                  <stop offset="1" stopColor="#12100e"/>
                </linearGradient>
                <clipPath id="cowClip"><path d={silhouette}/></clipPath>
                <filter id="copperGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <path d="M75 91 Q48 72 59 46 Q66 69 94 77" fill="none" stroke="#9c7448" strokeWidth="3" strokeLinecap="round"/>
              <path d="M510 93 Q523 63 550 69 Q539 78 538 96" fill="none" stroke="#9c7448" strokeWidth="3" strokeLinecap="round"/>
              <path d={silhouette} fill="url(#cowBody)" stroke="#bd9664" strokeWidth="2.2"/>
              <g clipPath="url(#cowClip)">
                {beefRegions.map((region) => (
                  <motion.path
                    key={region.id}
                    d={regionShapes[region.id]}
                    role="button"
                    tabIndex={0}
                    aria-label={region.name}
                    aria-pressed={selectedId === region.id}
                    onMouseEnter={() => choose(region)}
                    onFocus={() => choose(region)}
                    onClick={() => choose(region)}
                    onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(region); } }}
                    fill={selectedId === region.id ? "rgba(200,155,110,.52)" : "rgba(200,155,110,.12)"}
                    stroke={selectedId === region.id ? "#efc48c" : "rgba(200,155,110,.6)"}
                    strokeWidth={selectedId === region.id ? 2.5 : 1.25}
                    filter={selectedId === region.id ? "url(#copperGlow)" : undefined}
                    style={{ cursor: "pointer", outline: "none" }}
                    animate={{ opacity: selectedId === region.id ? 1 : 0.72 }}
                    transition={{ duration: 0.35 }}
                  />
                ))}
              </g>
              <path d="M124 153 L122 176 M469 148 L461 181" stroke="#c89b6e" strokeWidth="1.2" opacity=".55"/>
              <path d="M224 178 L222 258 M348 180 L352 258" stroke="#c89b6e" strokeWidth="1" opacity=".3" strokeDasharray="3 5"/>
              <g fill="#e5c49a" fontSize="11" fontFamily="Arial, sans-serif" letterSpacing="1.4">
                <text x="145" y="119">OMBRO</text>
                <text x="260" y="119">COSTELA</text>
                <text x="350" y="119">LOMBO</text>
                <text x="434" y="119">ALCATRA</text>
              </g>
              <path d="M104 278 H497" stroke="#8e6a44" strokeWidth=".8" opacity=".5"/>
              <text x="300" y="299" fill="#a99a82" fontSize="9" textAnchor="middle" letterSpacing="3">SELECIONE UMA REGIÃO</text>
            </svg>
            <div className="map-region-tabs">
              {beefRegions.map((region) => <button type="button" key={region.id} className={selectedId === region.id ? "active" : ""} onClick={() => choose(region)}>{region.name}</button>)}
            </div>
          </motion.div>

          <div className="region-detail-panel">
            <AnimatePresence mode="wait">
              <motion.div key={selected.id} className="region-detail" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: .42, ease: [0.22, 1, 0.36, 1] }}>
                <div className="detail-index">REGIÃO SELECIONADA <span>0{beefRegions.findIndex((r) => r.id === selected.id) + 1} / 04</span></div>
                <h3>{selected.name}</h3>
                <p>{selected.description}</p>
                <div className="marbling-block">
                  <div><span>MARMOREIO</span><strong>{selected.marbling}/5</strong></div>
                  <div className="marbling-dots">{[1,2,3,4,5].map((n) => <i key={n} className={n <= selected.marbling ? "filled" : ""}/>)}</div>
                </div>
                <div className="region-spec">
                  <div><Flame size={16}/><span><small>SUGESTÃO DE PREPARO</small><strong>{selected.preparation}</strong></span></div>
                  <div><Sparkles size={16}/><span><small>PONTO IDEAL</small><strong>{selected.doneness}</strong></span></div>
                </div>
                <div className="map-note"><Info size={15}/><span>Informações gastronômicas orientativas. A seleção e disponibilidade variam conforme o lote.</span></div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
