import { lazy, type ComponentType } from 'react';
import {
  ColorsPage,
  FontsPage,
  LayoutPage,
  OverviewPage,
} from './foundations';

function lazyPage(load: () => Promise<ComponentType>) {
  return lazy(async () => ({ default: await load() }));
}

const BrandLogoPage = lazyPage(() =>
  import('./brand').then(({ BrandLogoPage }) => BrandLogoPage),
);
const BadgeDemo = lazyPage(() =>
  import('./demos/badge').then(({ BadgeDemo }) => BadgeDemo),
);
const ButtonDemo = lazyPage(() =>
  import('./demos/button').then(({ ButtonDemo }) => ButtonDemo),
);
const CardDemo = lazyPage(() =>
  import('./demos/card').then(({ CardDemo }) => CardDemo),
);
const InputDemo = lazyPage(() =>
  import('./demos/input').then(({ InputDemo }) => InputDemo),
);
const SelectDemo = lazyPage(() =>
  import('./demos/select').then(({ SelectDemo }) => SelectDemo),
);

export type PreviewEntry = {
  id: string;
  name: string;
  description: string;
  Page: ComponentType;
};

export type NavGroup = {
  name: string;
  entries: PreviewEntry[];
};

export const DESIGN_SYSTEM = {
  title: 'Sistema Visual Casa Luisalvense',
  description:
    'Sistema visual reutilizável baseado no Catálogo do Açougue Operação.',
} as const;

export const OVERVIEW_ENTRY: PreviewEntry = {
  id: 'overview',
  name: 'Visão geral',
  description: 'Identidade, fundamentos e componentes do Catálogo.',
  Page: OverviewPage,
};

export const NAV_GROUPS: NavGroup[] = [
  {
    name: 'Marca',
    entries: [
      {
        id: 'brand-logo',
        name: 'Logotipo',
        description: 'Marca enviada e aplicações em superfícies claras e escuras.',
        Page: BrandLogoPage,
      },
    ],
  },
  {
    name: 'Cores',
    entries: [
      {
        id: 'color-roles',
        name: 'Papéis de cor',
        description: 'Paleta principal, superfícies, estados e dados.',
        Page: ColorsPage,
      },
    ],
  },
  {
    name: 'Tipografia',
    entries: [
      {
        id: 'type-scale',
        name: 'Famílias e hierarquia',
        description: 'Pilha de fontes preservada e níveis de texto observados.',
        Page: FontsPage,
      },
    ],
  },
  {
    name: 'Layout',
    entries: [
      {
        id: 'spacing-radius',
        name: 'Espaçamento e cantos',
        description: 'Ritmo de espaçamento e superfícies do painel.',
        Page: LayoutPage,
      },
    ],
  },
  {
    name: 'Ações',
    entries: [
      {
        id: 'button',
        name: 'Botões',
        description: 'Ações principais, alternativas e estados.',
        Page: ButtonDemo,
      },
    ],
  },
  {
    name: 'Campos',
    entries: [
      {
        id: 'input',
        name: 'Campo de texto',
        description: 'Busca, edição, foco e estado desabilitado.',
        Page: InputDemo,
      },
      {
        id: 'select',
        name: 'Seleção',
        description: 'Filtro de categoria e estado desabilitado.',
        Page: SelectDemo,
      },
    ],
  },
  {
    name: 'Exibição',
    entries: [
      {
        id: 'badge',
        name: 'Estados',
        description: 'Rótulos de disponibilidade e contexto.',
        Page: BadgeDemo,
      },
      {
        id: 'card',
        name: 'Cartão',
        description: 'Produto, ações e estado sem resultados.',
        Page: CardDemo,
      },
    ],
  },
];

export const ALL_ENTRIES: PreviewEntry[] = [
  OVERVIEW_ENTRY,
  ...NAV_GROUPS.flatMap((group) => group.entries),
];

const duplicateIds = ALL_ENTRIES.map((entry) => entry.id).filter(
  (id, index, ids) => ids.indexOf(id) !== index,
);
if (duplicateIds.length > 0) {
  throw new Error(
    `Duplicate preview page id(s): ${[...new Set(duplicateIds)].join(', ')}.`,
  );
}
