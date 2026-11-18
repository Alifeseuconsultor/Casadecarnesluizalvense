import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="cinematic-hero" id="inicio">
      <div className="hero-background">
        <Image src="/loja/corte-na-brasa.webp" fill sizes="100vw" priority alt="Corte de carne grelhado servido na tábua" />
      </div>
      <div className="hero-vignette"/>
      <div className="hero-grain"/>

      <div className="hero-inner">
        <div className="hero-copy">
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
              Conheça a loja <ArrowDownRight size={16}/>
            </a>
          </div>
        </div>

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
