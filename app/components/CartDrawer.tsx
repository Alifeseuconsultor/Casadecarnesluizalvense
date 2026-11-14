"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Flame, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { pairings, shop, type CartLine } from "./data";

type Pairing = (typeof pairings)[number];

type CartDrawerProps = {
  open: boolean;
  lines: CartLine[];
  onClose: () => void;
  onQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onAddPairing: (item: Pairing) => void;
};

const formatWeight = (grams: number) => {
  if (grams >= 1000) return \`${(grams / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg\`;
  return \`${grams} g\`;
};

export default function CartDrawer({ open, lines, onClose, onQuantity, onRemove, onAddPairing }: CartDrawerProps) {
  const panelRef = useRef<HTMLElement>(null);
  const cuts = lines.filter((line) => line.category === "cut");
  const extras = lines.filter((line) => line.category === "pairing");
  const totalGrams = cuts.reduce((total, line) => total + line.gramsPerUnit * line.quantity, 0);
  const people = totalGrams > 0 ? Math.max(1, Math.round(totalGrams / 400)) : 0;
  const hasWholePiece = cuts.some((line) => line.weightLabel === "Peça inteira");

  const message = [
    "Olá! Gostaria de solicitar este pedido pela Casa de Carnes Luiz Alvense:",
    "",
    ...lines.map((line) => line.category === "cut"
      ? \`• \${line.name} — \${line.weightLabel} × \${line.quantity}\`
      : \`• \${line.name} × \${line.quantity}\`),
    "",
    \`Peso estimado dos cortes: \${formatWeight(totalGrams)}\`,
    "Gostaria de confirmar disponibilidade, peso final e valores.",
  ].join("\n");
  const whatsappUrl = \`https://wa.me/\${shop.whatsapp}?text=\${encodeURIComponent(message)}\`;

  return (
    <AnimatePresence>
      {open && (
        <div className="cart-overlay-root">
          <motion.button className="cart-scrim" type="button" aria-label="Fechar carrinho" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .28 }}/>
          <motion.aside
            ref={panelRef}
            className="boutique-cart"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-heading"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: .62, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="cart-head">
              <div><span>SUA SELEÇÃO PARTICULAR</span><h2 id="cart-heading">Seu pedido <em>({lines.reduce((n, line) => n + line.quantity, 0)})</em></h2></div>
              <button type="button" onClick={onClose} aria-label="Fechar carrinho"><X size={19}/></button>
            </header>

            {lines.length === 0 ? (
              <div className="cart-empty-state">
                <div className="empty-bag"><ShoppingBag size={27}/></div>
                <h3>Seu carrinho está à espera.</h3>
                <p>Escolha seus cortes favoritos e monte uma experiência especial.</p>
                <button type="button" onClick={onClose}>Explorar cortes <ArrowUpRight size={15}/></button>
              </div>
            ) : (
              <>
                <div className="cart-content">
                  <div className="cart-line-list">
                    {lines.map((line) => (
                      <motion.div className="boutique-cart-line" key={line.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 24 }}>
                        <img src={line.image} alt={line.name}/>
                        <div className="boutique-line-copy">
                          <span>{line.category === "cut" ? "CORTE SELECIONADO" : "HARMONIZAÇÃO"}</span>
                          <strong>{line.name}</strong>
                          <small>{line.category === "cut" ? line.weightLabel : "Complemento para sua experiência"}</small>
                          <div className="line-quantity">
                            <button type="button" aria-label="Diminuir quantidade" onClick={() => onQuantity(line.id, -1)}><Minus size={12}/></button>
                            <b>{line.quantity}</b>
                            <button type="button" aria-label="Aumentar quantidade" onClick={() => onQuantity(line.id, 1)}><Plus size={12}/></button>
                          </div>
                        </div>
                        <button className="line-remove" type="button" aria-label={"Remover " + line.name} onClick={() => onRemove(line.id)}><Trash2 size={15}/></button>
                      </motion.div>
                    ))}
                  </div>

                  <section className="pairing-section" id="harmonizacao">
                    <div className="pairing-heading"><span>UM TOQUE A MAIS</span><h3>Harmonize sua escolha.</h3><p>Pequenos detalhes que completam a experiência.</p></div>
                    <div className="pairing-list">
                      {pairings.map((item) => {
                        const added = extras.some((line) => line.id === item.id);
                        return (
                          <div className="pairing-item" key={item.id}>
                            <img src={item.image} alt={item.name}/>
                            <div><strong>{item.name}</strong><small>{item.description}</small><em>Consulte disponibilidade</em></div>
                            <button type="button" disabled={added} onClick={() => onAddPairing(item)}>{added ? "Adicionado" : <><Plus size={14}/> Incluir</>}</button>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>

                <footer className="cart-foot">
                  <div className="cart-weight-total">
                    <div><span>PESO TOTAL ESTIMADO</span><strong>{formatWeight(totalGrams)}</strong></div>
                    <div className="people-estimate"><Flame size={15}/><span>Ideal para aproximadamente <b>{people} {people === 1 ? "pessoa" : "pessoas"}</b></span></div>
                    {hasWholePiece && <small>* Peças inteiras têm peso variável; a equipe confirma o peso final.</small>}
                  </div>
                  <div className="cart-price-note"><span>Valores dos cortes</span><strong>Confirmar com a equipe</strong></div>
                  <a className="whatsapp-checkout" href={whatsappUrl} target="_blank" rel="noreferrer">
                    Finalizar pedido pelo WhatsApp <ArrowUpRight size={17}/>
                  </a>
                  <p>Seu pedido será confirmado pela nossa equipe antes do preparo.</p>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
