"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Clock3, Instagram, MapPin, Phone } from "lucide-react";
import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import CutsShowcase from "./components/CutsShowcase";
import InteractiveBeefMap from "./components/InteractiveBeefMap";
import DryAgedTimeline from "./components/DryAgedTimeline";
import KitsChurrasco from "./components/KitsChurrasco";
import CartDrawer from "./components/CartDrawer";
import { shop, type CartLine, type Cut, type WeightOption } from "./components/data";

type Pairing = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartLines, setCartLines] = useState<CartLine[]>([]);

  const cartCount = useMemo(() => cartLines.reduce((total, line) => total + line.quantity, 0), [cartLines]);

  const addCut = (cut: Cut, weight: WeightOption) => {
    const lineId = cut.id + "-" + weight.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setCartLines((current) => {
      const existing = current.find((line) => line.id === lineId);
      if (existing) return current.map((line) => line.id === lineId ? { ...line, quantity: line.quantity + 1 } : line);
      return [...current, {
        id: lineId,
        name: cut.name,
        image: cut.rawImage,
        category: "cut",
        quantity: 1,
        gramsPerUnit: weight.grams,
        weightLabel: weight.label,
      }];
    });
    setCartOpen(true);
  };

  const addPairing = (item: Pairing) => {
    setCartLines((current) => {
      const existing = current.find((line) => line.id === item.id);
      if (existing) return current.map((line) => line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line);
      return [...current, {
        id: item.id,
        name: item.name,
        image: item.image,
        category: "pairing",
        quantity: 1,
        gramsPerUnit: 0,
        weightLabel: "Complemento",
      }];
    });
    setCartOpen(true);
  };

  const changeQuantity = (id: string, delta: number) => {
    setCartLines((current) => current
      .map((line) => line.id === id ? { ...line, quantity: line.quantity + delta } : line)
      .filter((line) => line.quantity > 0));
  };

  const removeLine = (id: string) => setCartLines((current) => current.filter((line) => line.id !== id));
  const contactMessage = encodeURIComponent("Olá! Gostaria de consultar os cortes especiais da Casa de Carnes Luiz Alvense.");
  const whatsappContact = "https://wa.me/" + shop.whatsapp + "?text=" + contactMessage;
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=SC-414%2C%2011014%2C%20Luiz%20Alves%20-%20SC%2C%2089115-000";

  return (
    <>
      <SiteHeader cartCount={cartCount} onCartOpen={() => setCartOpen(true)}/>
      <main className="luxury-store">
        <Hero/>
        <CutsShowcase onAdd={addCut}/>
        <InteractiveBeefMap/>
        <DryAgedTimeline/>
        <KitsChurrasco onAdd={addPairing}/>

        <section className="contact-section" id="contato">
          <div className="contact-ornament"/>
          <div className="contact-shell">
            <div className="contact-copy">
              <div className="eyebrow-copper">UMA EXPERIÊNCIA À SUA MANEIRA <span/></div>
              <h2>Seu próximo grande<br/><em>momento começa aqui.</em></h2>
              <p>Fale com nossa equipe para consultar cortes, disponibilidade, pesos e sugestões de preparo.</p>
              <a className="contact-cta" href={whatsappContact} target="_blank" rel="noreferrer">Conversar pelo WhatsApp <ArrowUpRight size={16}/></a>
            </div>
            <div className="contact-details">
              <div className="contact-detail"><MapPin size={18}/><div><span>VISITE NOSSA CASA</span><a href={mapsUrl} target="_blank" rel="noreferrer">{shop.address}</a></div></div>
              <div className="contact-detail"><Phone size={18}/><div><span>FALE COM A EQUIPE</span><a href="tel:+554733044430">{shop.phoneDisplay}</a></div></div>
              <div className="contact-detail"><Clock3 size={18}/><div><span>HORÁRIOS DE ATENDIMENTO</span><div className="hours-grid">{shop.hours.map(([day, hours]) => <p key={day}><span>{day}</span><strong>{hours}</strong></p>)}</div></div></div>
            </div>
          </div>
        </section>

        <footer className="lux-footer">
          <a href="#inicio" className="footer-signature"><span>LA</span><div><small>CASA DE CARNES</small><strong>LUIZ ALVENSE</strong><em>QUALIDADE EM CADA DETALHE</em></div></a>
          <div className="footer-phrase">ORIGEM. SELEÇÃO. EXPERIÊNCIA.</div>
          <div className="footer-social"><a href="tel:+554733044430" aria-label="Telefone"><Phone size={16}/></a><a href="#contato" aria-label="Instagram"><Instagram size={16}/></a><span>© 2026 LUIZ ALVENSE</span></div>
        </footer>
      </main>

      <CartDrawer
        open={cartOpen}
        lines={cartLines}
        onClose={() => setCartOpen(false)}
        onQuantity={changeQuantity}
        onRemove={removeLine}
        onAddPairing={addPairing}
      />
    </>
  );
}
