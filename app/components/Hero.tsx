"use client";

import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const easeLuxury = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section className="cinematic-hero" id="inicio">
      <div className="hero-background">
        <img
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2400&q=92"
          alt="Carne preparada na brasa"
          fetchPriority="high"
        />
      </div>
      <div className="hero-vignette"/>
      <div className="hero-grain"/>

      <div className="hero-inner">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, ease: easeLuxury, delay: 0.08 }}
        >
          <div className="hero-overline">
            <span/> CASA DE CARNES EM LUIZ ALVES <span/>
          </div>

          <h1 className="masked-title">
            Um bom corte.<br/>
            <em className="title-accent">Começa na escolha.</em>
          </h1>

          <p>
            Conheça nossa seleção de cortes e escolha o que combina com a sua ocasião.
            Para confirmar disponibilidade, peso e preparo, fale com nossa equipe.
          </p>

          <div className="hero-actions">
            <a className="hero-cta" href="#cortes">
              Explorar os cortes <ArrowUpRight size={17} strokeWidth={1.6}/>
            </a>
            <a className="hero-secondary" href="#contato">
              Fale com a equipe <ArrowDownRight size={16}/>
            </a>
          </div>

          <div className="hero-proof">
            <span className="proof-line"/>
            <span>ESCOLHA COM CALMA. COMPRE COM CONFIANÇA.</span>
          </div>
        </motion.div>

        <div className="hero-side-note">
          <span>CASA DE CARNES</span>
          <strong>LUIZ ALVENSE</strong>
          <i/>
          <small>Luiz Alves · Santa Catarina</small>
        </div>
      </div>

      <div className="hero-bottom">
        <span>LUIZ ALVES · SC</span>
        <span className="hero-bottom-rule"/>
        <span>CORTES, PESOS E DISPONIBILIDADE SOB CONSULTA</span>
        <a href="#cortes" aria-label="Rolar para os cortes"><ArrowDownRight size={18}/></a>
      </div>
    </section>
  );
}
