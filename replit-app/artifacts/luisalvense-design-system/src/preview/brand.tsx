const logoUrl = `${import.meta.env.BASE_URL}luisalvense-mark.png`;

export function BrandLogoPage() {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
      <section className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-lg border bg-card p-6 text-center text-card-foreground">
        <img
          src={logoUrl}
          alt="Logotipo da Casa de Carnes Luisalvense"
          className="size-36 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-bold tracking-[0.15em]">LUISALVENSE</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Carne fresca todos os dias
          </p>
        </div>
      </section>
      <section className="flex min-h-72 flex-col justify-between rounded-lg border border-sidebar-border bg-sidebar p-6 text-sidebar-foreground">
        <span className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/65">Aplicação em fundo escuro</span>
        <div className="flex items-center gap-4">
          <img
            src={logoUrl}
            alt=""
            className="size-20 rounded-full object-cover"
          />
          <div>
            <p className="text-base font-bold tracking-[0.16em]">LUISALVENSE</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-sidebar-foreground/65">
              Casa de Carnes
            </p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-sidebar-foreground/75">
          A marca enviada é mantida como imagem original, sem redesenho ou
          alteração.
        </p>
      </section>
    </div>
  );
}
