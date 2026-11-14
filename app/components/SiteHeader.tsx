"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, ShoppingBag, X } from "lucide-react";

type SiteHeaderProps = {
  cartCount: number;
  onCartOpen: () => void;
};

function BrandMark() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <path d="M8 12C5 9 3 4 3 2c6 6 13 8 21 8 5 0 9 3 12 7 3-4 7-7 12-7 8 0 15-2 21-8 0 2-2 7-5 10 0 12-5 21-16 26l-2 14-9 12-9-12-2-14C14 33 9 24 8 12Z" fill="currentColor"/>
      <path d="M23 29c4-3 9-3 13 0 4-3 9-3 13 0M28 42h16M31 49h10" fill="none" stroke="#11100e" strokeWidth="2.4" strokeLinecap="round"/>
    </svg>
  );
}

export default function SiteHeader({ cartCount, onCartOpen }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const links = [
    ["Cortes Nobres", "#cortes"],
    ["Mapa do Boi", "#mapa-do-boi"],
    ["Dry Aged", "#dry-aged"],
    ["Kits Churrasco", "#harmonizacao"],
  ];

  return (
    <motion.header
      className={scrolled ? "lux-header is-scrolled" : "lux-header"}
      initial={{ y: -26, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <a href="#inicio" className="lux-brand" aria-label="Casa de Carnes Luiz Alvense, início">
        <span className="lux-brand-mark"><BrandMark /></span>
        <span className="lux-brand-type">
          <small>CASA DE CARNES</small>
          <strong>LUIZ ALVENSE</strong>
          <em>QUALIDADE EM CADA DETALHE</em>
        </span>
      </a>

      <nav className="lux-nav" aria-label="Navegação principal">
        {links.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
      </nav>

      <div className="lux-header-actions">
        <a className="header-phone" href="tel:+554733044430">Atendimento <span>(47) 3304-4430</span></a>
        <button className="lux-cart-trigger" type="button" onClick={onCartOpen} aria-label={"Abrir carrinho, " + cartCount + " itens"}>
          <ShoppingBag size={19} strokeWidth={1.5}/>
          <span>Carrinho</span>
          <b>{cartCount}</b>
        </button>
        <button className="mobile-menu-trigger" type="button" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {links.map(([label, href]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
            <button type="button" onClick={() => { setMenuOpen(false); onCartOpen(); }}><ShoppingBag size={16}/> Abrir carrinho ({cartCount})</button>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
