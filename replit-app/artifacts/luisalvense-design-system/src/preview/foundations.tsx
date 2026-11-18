import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';

const CORE_COLORS = [
  { name: 'Primária', role: 'primary · ação principal', className: 'bg-primary', foreground: 'text-primary-foreground' },
  { name: 'Secundária', role: 'secondary · apoio', className: 'bg-secondary', foreground: 'text-secondary-foreground' },
  { name: 'Destaque', role: 'accent · ênfase', className: 'bg-accent', foreground: 'text-accent-foreground' },
] as const;

const SUPPORTING_COLORS = [
  { name: 'Fundo', className: 'bg-background' },
  { name: 'Cartão', className: 'bg-card' },
  { name: 'Suave', className: 'bg-muted' },
  { name: 'Erro', className: 'bg-destructive' },
  { name: 'Navegação', className: 'bg-sidebar' },
  { name: 'Destaque da navegação', className: 'bg-sidebar-accent' },
  { name: 'Série 1', className: 'bg-chart-1' },
  { name: 'Série 2', className: 'bg-chart-2' },
  { name: 'Série 3', className: 'bg-chart-3' },
  { name: 'Série 4', className: 'bg-chart-4' },
  { name: 'Série 5', className: 'bg-chart-5' },
] as const;

const TYPE_SCALE = [
  { label: 'Título de página', className: 'text-3xl font-bold tracking-tight' },
  { label: 'Título de seção', className: 'text-xl font-bold tracking-tight' },
  { label: 'Corpo', className: 'text-sm leading-relaxed' },
  { label: 'Rótulo', className: 'text-xs font-semibold' },
  { label: 'Metadado', className: 'font-mono text-[10px] uppercase tracking-wide' },
] as const;

const SPACING_SCALE = [
  { label: '4 px', className: 'w-4' },
  { label: '8 px', className: 'w-8' },
  { label: '12 px', className: 'w-12' },
  { label: '16 px', className: 'w-16' },
  { label: '24 px', className: 'w-24' },
] as const;

function Swatch({
  name,
  className,
  foreground = 'text-foreground',
  role,
}: {
  name: string;
  className: string;
  foreground?: string;
  role?: string;
}) {
  return (
    <div className="space-y-2">
      <div className={`grid h-14 place-items-center rounded-md border border-border ${className}`}>
        <span className={`rounded-sm bg-background/70 px-1.5 py-0.5 text-[10px] font-medium ${foreground}`}>
          {name}
        </span>
      </div>
      <div>
        <p className="text-xs font-medium">{name}</p>
        {role && <p className="mt-0.5 font-mono text-[9px] text-muted-foreground">{role}</p>}
      </div>
    </div>
  );
}

export function OverviewPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border bg-card p-5 text-card-foreground">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Identidade da casa
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Carne fresca todos os dias.
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Sistema visual extraído do Catálogo do Açougue Operação. O tema claro
          preserva a referência; o tema escuro deriva da mesma paleta.
        </p>
      </section>

      <section className="space-y-4 rounded-lg border bg-card p-5 text-card-foreground">
        <div>
          <h2 className="text-sm font-bold">Paleta principal</h2>
          <p className="mt-1 text-xs text-muted-foreground">Papéis de cor na ordem obrigatória do sistema.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CORE_COLORS.map((color) => (
            <Swatch key={color.name} {...color} />
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="space-y-4 rounded-lg border bg-card p-5 text-card-foreground">
          <div>
            <h2 className="text-sm font-bold">Componentes do Catálogo</h2>
            <p className="mt-1 text-xs text-muted-foreground">Ações, estados e controles de busca/filtro.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button>Novo produto</Button>
            <Button variant="outline">Cancelar</Button>
            <Button variant="selected" aria-pressed="true">Selecionado</Button>
            <Button variant="ghost" size="sm">Editar</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="active">Ativo</Badge>
            <Badge variant="soldOut">Esgotado</Badge>
            <Badge variant="inactive">Inativo</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Buscar produto ou categoria" aria-label="Busca do catálogo" />
            <Select defaultValue="all" aria-label="Categoria do catálogo">
              <option value="all">Todas as categorias</option>
              <option value="aves">Aves Temperadas</option>
            </Select>
          </div>
        </section>

        <section className="space-y-4 rounded-lg border bg-card p-5 text-card-foreground">
          <h2 className="text-sm font-bold">Cartão de produto</h2>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] text-muted-foreground">Aves Temperadas · kg</span>
                <Badge variant="active">Ativo</Badge>
              </div>
              <CardTitle>Coração de Frango</CardTitle>
              <CardDescription>Tempero rústico de alho e sal grosso.</CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
              <strong className="text-base font-bold text-primary">R$ 39,90</strong>
              <span className="ml-1 text-xs text-muted-foreground">/kg</span>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm">Editar</Button>
              <Button variant="outline" size="sm">Duplicar</Button>
            </CardFooter>
          </Card>
        </section>
      </div>

      <section className="rounded-lg border bg-card p-5 text-card-foreground">
        <h2 className="text-sm font-bold">Padrões observados no Catálogo</h2>
        <ul className="mt-3 grid gap-2 text-xs leading-relaxed text-muted-foreground sm:grid-cols-2">
          <li>Fundo de trabalho claro com superfícies de cartão ligeiramente mais claras.</li>
          <li>Verde profundo nas ações principais e na navegação da operação.</li>
          <li>Dourado usado como ênfase pontual, sem competir com a informação.</li>
          <li>Estados de disponibilidade recebem rótulos compactos com cores distintas.</li>
        </ul>
        <p className="mt-3 text-[10px] text-muted-foreground">
          São convenções observadas no código e na tela; o projeto de origem não
          traz um manual escrito de uso.
        </p>
      </section>
    </div>
  );
}

export function ColorsPage() {
  return (
    <div className="space-y-6 rounded-lg border bg-card p-5 text-card-foreground">
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-bold">Papéis principais</h2>
          <p className="mt-1 text-xs text-muted-foreground">Ação principal, apoio e ênfase.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {CORE_COLORS.map((color) => <Swatch key={color.name} {...color} />)}
        </div>
      </section>
      <section className="space-y-4 border-t border-border pt-5">
        <div>
          <h2 className="text-sm font-bold">Superfícies e dados</h2>
          <p className="mt-1 text-xs text-muted-foreground">Papéis auxiliares e séries para gráficos.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SUPPORTING_COLORS.map((color) => <Swatch key={color.name} {...color} />)}
        </div>
      </section>
      <p className="text-xs text-muted-foreground">
        Use o controle de tema no cabeçalho para conferir os tokens claros e a
        derivação escura.
      </p>
    </div>
  );
}

export function FontsPage() {
  return (
    <div className="space-y-6 rounded-lg border bg-card p-5 text-card-foreground">
      <section>
        <h2 className="text-sm font-bold">Famílias preservadas</h2>
        <p className="mt-3 text-xs text-muted-foreground">
          Nenhum arquivo de fonte próprio foi fornecido. O preview mantém as
          pilhas do sistema da aplicação e não baixa fontes externas.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border bg-background p-3">
            <span className="font-mono text-[10px] text-muted-foreground">SANS</span>
            <p className="mt-2 text-sm">Interface e leitura</p>
          </div>
          <div className="rounded-md border bg-background p-3">
            <span className="font-mono text-[10px] text-muted-foreground">SERIF</span>
            <p className="mt-2 text-sm">Pilha atual sem serif específica</p>
          </div>
          <div className="rounded-md border bg-background p-3">
            <span className="font-mono text-[10px] text-muted-foreground">MONO</span>
            <p className="mt-2 font-mono text-sm">Preços e metadados</p>
          </div>
        </div>
      </section>
      <section className="space-y-3 border-t border-border pt-5">
        <h2 className="text-sm font-bold">Hierarquia observada</h2>
        {TYPE_SCALE.map((entry) => (
          <div key={entry.label} className="grid gap-2 sm:grid-cols-[140px_1fr]">
            <span className="pt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{entry.label}</span>
            <p className={entry.className}>Catálogo da operação</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export function LayoutPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-lg border bg-card p-5 text-card-foreground">
        <h2 className="text-sm font-bold">Espaçamento</h2>
        <p className="mt-1 text-xs text-muted-foreground">Escala baseada em passos de 4 px.</p>
        <div className="mt-5 space-y-4">
          {SPACING_SCALE.map((space) => (
            <div key={space.label} className="flex items-center gap-3">
              <span className="w-10 font-mono text-[10px] text-muted-foreground">{space.label}</span>
              <div className={`h-2 rounded-full bg-primary ${space.className}`} />
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-lg border bg-card p-5 text-card-foreground">
        <h2 className="text-sm font-bold">Cantos e superfícies</h2>
        <p className="mt-1 text-xs text-muted-foreground">Cantos compactos observados em filtros e cartões.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            { label: 'Pequeno', className: 'rounded-sm' },
            { label: 'Médio', className: 'rounded-md' },
            { label: 'Base', className: 'rounded-lg' },
            { label: 'Amplo', className: 'rounded-xl' },
          ].map((radius) => (
            <div key={radius.label} className={`flex h-20 items-end border bg-muted p-3 ${radius.className}`}>
              <span className="text-xs font-medium">{radius.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
