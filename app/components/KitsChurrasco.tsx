import { Flame, Leaf, Utensils } from "lucide-react";

const suggestions = [
  { name: "Sal de parrilla", detail: "Espalhe os cristais pelo corte para distribuir o sal por toda a superfície.", icon: Utensils },
  { name: "Chimichurri", detail: "Sirva o molho de ervas à parte. A acidez combina com cortes mais gordurosos.", icon: Leaf },
  { name: "Lenha frutífera", detail: "Na brasa, a lenha de árvores frutíferas dá um toque defumado ao corte.", icon: Flame },
];

export default function KitsChurrasco() {
  return (
    <section className="kits-section" id="kits-churrasco">
      <div className="section-shell">
        <div className="kits-intro">
          <div className="eyebrow-copper">NA CHURRASQUEIRA <span /></div>
          <h2>Para acompanhar <em>o churrasco.</em></h2>
          <p>Três sugestões de preparo para experimentar em casa.</p>
        </div>
        <div className="pairing-guide">
          {suggestions.map(({ name, detail, icon: Icon }) => (
            <article key={name}>
              <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
              <h3>{name}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
