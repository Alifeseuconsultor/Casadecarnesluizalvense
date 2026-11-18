"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Clock3, Droplets, Sparkles } from "lucide-react";

const milestones = [
  {
    day: "30",
    unit: "DIAS",
    title: "Maciez acentuada",
    body: "O tempo começa a transformar a textura, concentrando a experiência sem perder a delicadeza do corte.",
    icon: Clock3,
  },
  {
    day: "45",
    unit: "DIAS",
    title: "Notas amanteigadas",
    body: "A concentração de sabor ganha presença e surgem notas mais profundas, arredondadas e elegantes.",
    icon: Droplets,
  },
  {
    day: "60+",
    unit: "DIAS",
    title: "Perfil intenso",
    body: "Textura aveludada e personalidade marcante para quem procura uma experiência gastronômica fora do comum.",
    icon: Sparkles,
  },
];

export default function DryAgedTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 72%", "end 38%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="dry-aged-section" id="dry-aged" ref={sectionRef}>
      <div className="dry-aged-texture"/>
      <div className="section-shell dry-aged-shell">
        <div className="dry-aged-intro">
          <div className="eyebrow-copper">MATURAÇÃO A SECO <span/></div>
          <h2>Dry Aged.<br/><em>O que muda com o tempo?</em></h2>
          <p>A maturação a seco é um processo cuidadoso de transformação. O tempo aprofunda aromas, concentra sabores e revela novas camadas de textura.</p>
        </div>

        <div className="dry-aged-timeline">
          <div className="timeline-track"><motion.div className="timeline-progress" style={{ scaleY: lineScale }}/></div>
          {milestones.map((item) => {
            const Icon = item.icon;
            return (
              <article className="timeline-milestone" key={item.day}>
                <div className="timeline-marker" aria-hidden="true"><span/></div>
                <div className="timeline-day"><strong>{item.day}</strong><span>{item.unit}</span></div>
                <div className="timeline-card">
                  <Icon size={18} strokeWidth={1.45}/>
                  <div><h3>{item.title}</h3><p>{item.body}</p></div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="dry-aged-disclaimer">TEMPOS ILUSTRATIVOS DE MATURAÇÃO · DISPONIBILIDADE SOB CONSULTA</div>
      </div>
    </section>
  );
}
