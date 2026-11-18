"use client";

import CatalogTopics from "./CatalogTopics";
import { useCatalog } from "./CatalogProvider";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Início", href: "#inicio" },
  { label: "Cortes", href: "#cortes" },
  { label: "Mapa do boi", href: "#mapa-do-boi" },
  { label: "Dry Aged", href: "#dry-aged" },
  { label: "Churrasco", href: "#kits-churrasco" },
  { label: "Nossa loja", href: "#contato" },
];

export default function SiteHeader({ phone, phoneLabel }: { phone: string; phoneLabel: string }) {
  const { selectTopic } = useCatalog();
  const menuButton = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 761px)");
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={scrolled ? "lux-header is-scrolled" : "lux-header"}
    >
      <a href="#inicio" className="lux-brand" aria-label="Casa de Carnes Luiz Alvense, início" onClick={closeMenu}>
        <span className="lux-brand-mark"><Image src="/loja/marca.webp" alt="" width={44} height={44} priority /></span>
        <span className="lux-brand-type">
          <small>CASA DE CARNES</small>
          <strong>LUIZ ALVENSE</strong>
        </span>
      </a>

      <nav className="lux-nav" aria-label="Navegação principal">
        {links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
      </nav>

      <div className="lux-header-actions">
        {phone && <a className="header-phone" href={`tel:+${phone}`}>Atendimento <span>{phoneLabel}</span></a>}
        <a className="lux-cart-trigger" href="#cortes" onClick={() => { selectTopic(null); closeMenu(); }}>Ver catálogo</a>
        <button
          ref={menuButton}
          className="mobile-menu-trigger"
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-primary-navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      {!menuOpen && <CatalogTopics />}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-primary-navigation"
            className="mobile-nav"
            aria-label="Navegação para celular"
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {links.map((link) => (
              <a href={link.href} key={link.href} onClick={closeMenu}>{link.label}</a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
