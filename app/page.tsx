import Image from "next/image";
import { ArrowUpRight, Clock3, MapPin, Phone } from "lucide-react";
import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import LiveCatalog from "./components/LiveCatalog";
import InteractiveBeefMap from "./components/InteractiveBeefMap";
import DryAgedTimeline from "./components/DryAgedTimeline";
import KitsChurrasco from "./components/KitsChurrasco";
import { storeHours } from "./components/data";

function contactNumber(value?: string) {
  const digits = value?.replace(/[\s()+-]/g, "") ?? "";
  return /^55\d{10,11}$/.test(digits) ? digits : "";
}

export default function Home() {
  const phone = contactNumber(process.env.STORE_PHONE);
  const whatsapp = contactNumber(process.env.STORE_WHATSAPP);
  const address = process.env.STORE_ADDRESS?.trim();
  const hoursConfirmed = process.env.STORE_HOURS_CONFIRMED === "true";
  const phoneLabel = phone.replace(/^55(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");

  return (
    <>
      <a className="skip-navigation" href="#conteudo">Pular para o conteúdo</a>
      <SiteHeader phone={phone} phoneLabel={phoneLabel} />
      <main id="conteudo" className="luxury-store" tabIndex={-1}>
        <Hero />
        <LiveCatalog />
        <InteractiveBeefMap />
        <DryAgedTimeline />
        <KitsChurrasco />

        <section className="contact-section" id="contato">
          <div className="contact-shell">
            <div className="contact-copy">
              <div className="eyebrow-copper">NOSSA LOJA <span /></div>
              <h2>Casa de Carnes<br /><em>Luiz Alvense.</em></h2>
              <p>Em Luiz Alves, Santa Catarina. No balcão, a equipe orienta sobre os cortes do dia, o peso e o preparo.</p>
              {whatsapp && <a className="contact-cta" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">Conversar pelo WhatsApp <ArrowUpRight size={16} /></a>}
              {(address || phone || hoursConfirmed) && (
                <div className="contact-details">
                  {address && <div className="contact-detail"><MapPin size={18} /><div><span>ENDEREÇO</span><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer">{address}</a></div></div>}
                  {phone && <div className="contact-detail"><Phone size={18} /><div><span>TELEFONE</span><a href={`tel:+${phone}`}>{phoneLabel}</a></div></div>}
                  {hoursConfirmed && <div className="contact-detail"><Clock3 size={18} /><div><span>HORÁRIOS DE ATENDIMENTO</span><div className="hours-grid">{storeHours.map(([day, hours]) => <p key={day}><span>{day}</span><strong>{hours}</strong></p>)}</div></div></div>}
                </div>
              )}
            </div>
            <Image className="shop-photo" src="/loja/balcao.webp" width={680} height={510} sizes="(max-width: 760px) 92vw, 42vw" alt="Balcão de carnes da loja em Luiz Alves" />
          </div>
        </section>

        <footer className="lux-footer" id="rodape">
          <a href="#inicio" className="footer-signature">
            <Image src="/loja/marca.webp" width={42} height={42} alt="" />
            <div><small>CASA DE CARNES</small><strong>LUIZ ALVENSE</strong></div>
          </a>
          <a href="#inicio" className="footer-top">Voltar ao início ↑</a>
        </footer>
      </main>
    </>
  );
}
