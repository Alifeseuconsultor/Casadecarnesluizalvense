"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { ArrowLeftRight, Info, RotateCcw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { beefRegions, type BeefRegion } from "./data";

const BeefMap3DCanvas = dynamic(() => import("./BeefMap3DCanvas"), {
  ssr: false,
  loading: () => <div className="beef3d-canvas-loading">Preparando o ambiente 3D…</div>,
});

export default function InteractiveBeefMap() {
  const [selectedId, setSelectedId] = useState("ribs");
  const [mode, setMode] = useState<"exterior" | "regions">("regions");
  const [autoRotate, setAutoRotate] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const selected = beefRegions.find((region) => region.id === selectedId) ?? beefRegions[0];

  const chooseRegion = useCallback((region: BeefRegion) => {
    setSelectedId(region.id);
  }, []);

  const resetCamera = () => setResetKey((value) => value + 1);

  return (
    <section className="beef-map-section beef3d-section" id="mapa-do-boi">
      <div className="section-shell">
        <motion.div
          className="map-intro"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="eyebrow-copper">CONHEÇA A ORIGEM DO SABOR <span /></div>
          <h2>Mapa do boi.<br /><em>Explore em três dimensões.</em></h2>
          <p>
            Gire o animal, aproxime a visualização e explore as grandes regiões comerciais.
            Cada seleção abre informações e exemplos de cortes associados.
          </p>
        </motion.div>

        <div className="beef3d-workspace">
          <div className="beef3d-viewer-card">
            <div className="beef3d-viewer-topbar">
              <div>
                <span className="beef3d-kicker">MODELO TRIDIMENSIONAL</span>
                <strong>Visão interativa do bovino</strong>
              </div>
              <span className="beef3d-live"><i /> 3D INTERATIVO</span>
            </div>

            <div className="beef3d-stage">
              <div className="beef3d-stage-caption">
                <span>ARRASTE PARA GIRAR</span>
                <span>SCROLL PARA APROXIMAR</span>
              </div>
              <BeefMap3DCanvas
                selectedId={selectedId}
                showRegions={mode === "regions"}
                autoRotate={autoRotate}
                resetKey={resetKey}
                onSelect={chooseRegion}
              />
              <div className="beef3d-axis-note">VISUALIZAÇÃO EXTERNA · 360°</div>
            </div>

            <div className="beef3d-controls">
              <div className="beef3d-mode-switch" role="group" aria-label="Modo de visualização">
                <button
                  type="button"
                  className={mode === "exterior" ? "is-active" : ""}
                  aria-pressed={mode === "exterior"}
                  onClick={() => setMode("exterior")}
                >
                  Boi inteiro
                </button>
                <button
                  type="button"
                  className={mode === "regions" ? "is-active" : ""}
                  aria-pressed={mode === "regions"}
                  onClick={() => setMode("regions")}
                >
                  Regiões comerciais
                </button>
              </div>
              <div className="beef3d-utility-controls">
                <button
                  type="button"
                  className={autoRotate ? "is-active" : ""}
                  aria-pressed={autoRotate}
                  onClick={() => setAutoRotate((value) => !value)}
                >
                  <ArrowLeftRight size={14} /> Giro automático
                </button>
                <button type="button" onClick={resetCamera}>
                  <RotateCcw size={14} /> Reiniciar visão
                </button>
              </div>
            </div>
          </div>

          <aside className="beef3d-details" aria-live="polite">
            <div className="beef3d-details-heading">
              <span>EXPLORAR POR REGIÃO</span>
              <small>01 — 04</small>
            </div>

            <div className="beef3d-region-list" role="list" aria-label="Regiões bovinas">
              {beefRegions.map((region, index) => (
                <button
                  type="button"
                  role="listitem"
                  key={region.id}
                  className={selectedId === region.id ? "beef3d-region-option is-active" : "beef3d-region-option"}
                  onClick={() => chooseRegion(region)}
                  aria-pressed={selectedId === region.id}
                >
                  <span className="beef3d-region-number">0{index + 1}</span>
                  <span className="beef3d-region-label">{region.name}</span>
                  <span className="beef3d-region-indicator" />
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                className="beef3d-selected-region"
                key={selected.id}
                initial={{ opacity: 0, y: 9 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.22 }}
              >
                <div className="beef3d-selected-eyebrow">
                  <Sparkles size={14} /> REGIÃO SELECIONADA
                </div>
                <h3>{selected.name}</h3>
                <p>{selected.description}</p>

                <div className="beef3d-associated-cuts">
                  <span>EXEMPLOS DE CORTES ASSOCIADOS</span>
                  <div>
                    {selected.relatedCuts.map((cut) => <span key={cut}>{cut}</span>)}
                  </div>
                </div>

                <div className="beef3d-preparation">
                  <div>
                    <span>SUGESTÃO DE PREPARO</span>
                    <strong>{selected.preparation}</strong>
                  </div>
                  <div>
                    <span>REFERÊNCIA DE PONTO / TEXTURA</span>
                    <strong>{selected.doneness}</strong>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="beef3d-disclaimer">
              <Info size={16} />
              <p>
                Mapa didático de regiões externas. Os marcadores não representam limites
                oficiais de desossa nem músculos individualizados. A correspondência anatômica
                de cada peça será liberada após validação técnica.
              </p>
            </div>
          </aside>
        </div>

        <div className="beef3d-footnote">
          <span>CASA DE CARNES LUIZ ALVENSE</span>
          <span>PRECISÃO NA ESCOLHA · RESPEITO À ORIGEM</span>
        </div>
      </div>
    </section>
  );
}
