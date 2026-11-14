"use client";

import { useMemo, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const easeLuxury = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const x = useSpring(useMotionValue(0), { stiffness: 170, damping: 18, mass: 0.22 });
  const y = useSpring(useMotionValue(0), { stiffness: 170, damping: 18, mass: 0.22 });
  const embers = useMemo(() => Array.from({ length: 18 }, (_, index) => ({
    left: String((index * 37 + 11) % 100) + "%",
    delay: (index % 6) * 0.8,
    duration: 7 + (index % 5) * 1.4,
    size: 2 + (index % 3),
  })), []);

  const moveButton = (event: MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.12);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.12);
  };
  const resetButton = () => { x.set(0); y.set(0); };

  return (
    <section className="cinematic-hero" id="inicio">
      <div className="hero-background">
        <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2400&q=92" alt="Corte de carne nobre finalizado na brasa" fetchPriority="high"/>
      </div>
      <div className="hero-vignette"/>
      <div className="hero-grain"/>
      <div className="ember-field" aria-hidden="true">
        {embers.map((ember, index) => (
          <motion.i
            key={index}
            style={{ left: ember.left, width: ember.size, height: ember.size }}
            animate={{ y: [24, -170, -330], x: [0, index % 2 ? 12 : -10, index % 2 ? -8 : 13], opacity: [0, 0.6, 0] }}
            transition={{ duration: ember.duration, delay: ember.delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>
      <div className="hero-inner">
        <motion.div className="hero-copy" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } } }}>
          <motion.div className="hero-overline" variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeLuxury } } }}>
            <span/> SELEÇÃO DE CORTES NOBRES <span/>
          </motion.div>
          <h1 className="masked-title">
            {["O sabor da", "excelência está", "em cada corte."].map((line, index) => (
              <span className="title-mask" key={line}>
                <motion.span className={index === 2 ? "title-accent" : ""} variants={{ hidden: { y: "112%" }, visible: { y: "0%", transition: { duration: 0.78, ease: easeLuxury } } }}>{line}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeLuxury } } }}>
            Cortes escolhidos com rigor, respeito à origem e cuidado artesanal.
            Uma experiência pensada para quem reconhece a diferença.
          </motion.p>
          <motion.div className="hero-actions" variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeLuxury } } }}>
            <motion.a className="hero-cta" href="#cortes" style={{ x, y }} onMouseMove={moveButton} onMouseLeave={resetButton} whileTap={{ scale: 0.97 }}>
              Explorar cortes nobres <ArrowUpRight size={17} strokeWidth={1.6}/>
            </motion.a>
            <a className="hero-secondary" href="#mapa-do-boi"><span>Descubra os cortes</span><ArrowDownRight size={16}/></a>
          </motion.div>
          <motion.div className="hero-proof" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.55, duration: 0.8 } } }}>
            <span className="proof-line"/><span>QUALIDADE EM CADA DETALHE</span>
          </motion.div>
        </motion.div>
        <motion.div className="hero-side-note" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.8, ease: easeLuxury }}>
          <span>CASA DE CARNES</span><strong>LUIZ ALVENSE</strong><i/><small>Luiz Alves · Santa Catarina</small>
        </motion.div>
      </div>
      <div className="hero-bottom">
        <span>01 / 03</span><span className="hero-bottom-rule"/><span>ORIGEM · SELEÇÃO · EXPERIÊNCIA</span>
        <a href="#cortes" aria-label="Rolar para cortes"><ArrowDownRight size={18}/></a>
      </div>
    </section>
  );
}
