import type { CatalogEditorialData } from "@workspace/db";

export type CatalogSeedProduct = {
  name: string;
  category: string;
  description: string | null;
  pricePerKg: number;
  saleUnit: "kg" | "g" | "unidade";
  productType: "product" | "combo";
  editorial: CatalogEditorialData;
};

export const catalogSeedProducts: CatalogSeedProduct[] = [
  {
    "name": "Tomahawk",
    "category": "Cortes Especiais",
    "description": "Corte do contrafilé com osso preservado em até 25 cm. Maturado a seco por 21 dias para concentração de sabor.",
    "pricePerKg": 61.99,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "tomahawk",
      "priceOnRequest": false,
      "tagline": "O machado das brasas. Osso longo, capa de gordura, espetáculo.",
      "tier": "signature",
      "marbling": 5,
      "tenderness": 4,
      "uses": [
        "churrasco",
        "parrilla"
      ],
      "badges": [
        "Maturado 21d",
        "Edição Limitada"
      ],
      "portion": "Serve 2–3 pessoas em peças de 1,2 kg",
      "pairing": "Sal grosso, manteiga de ervas, vinho tinto encorpado"
    }
  },
  {
    "name": "Prime Rib",
    "category": "Cortes Especiais",
    "description": "Costela nobre com capa de gordura intacta, ideal para assar inteira em fogo médio até a crosta caramelizar.",
    "pricePerKg": 60.99,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "prime-rib",
      "priceOnRequest": false,
      "tagline": "A peça de honra do domingo.",
      "tier": "signature",
      "marbling": 5,
      "tenderness": 5,
      "uses": [
        "forno",
        "churrasco"
      ],
      "badges": [
        "Premium",
        "Mais pedido"
      ],
      "portion": "Serve 4–6 pessoas",
      "pairing": "Mostarda Dijon, alho confit, batata rústica"
    }
  },
  {
    "name": "T-Bone",
    "category": "Cortes Especiais",
    "description": "Corte transversal que une dois cortes nobres separados pelo osso em T. Brasa alta, sela e descansa.",
    "pricePerKg": 66.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "t-bone",
      "priceOnRequest": false,
      "tagline": "Filé mignon e contrafilé na mesma peça.",
      "tier": "signature",
      "marbling": 4,
      "tenderness": 5,
      "uses": [
        "churrasco",
        "parrilla"
      ],
      "badges": [
        "Premium"
      ],
      "portion": "Serve 1 pessoa por peça (≈500g)"
    }
  },
  {
    "name": "Short Rib",
    "category": "Cortes Especiais",
    "description": "Costela cortada em peças curtas, perfeita para baixa temperatura ou braseado por horas.",
    "pricePerKg": 56.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "short-ribe",
      "priceOnRequest": false,
      "tagline": "Costela curta, fibra macia, intensidade total.",
      "tier": "premium",
      "marbling": 4,
      "tenderness": 4,
      "uses": [
        "forno",
        "churrasco",
        "panela"
      ],
      "badges": [
        "Slow cook"
      ]
    }
  },
  {
    "name": "Assado de Tiras",
    "category": "Cortes Especiais",
    "description": "Corte transversal da costela em tiras de 2 cm. Vai à brasa direta, dourada por fora e suculenta por dentro.",
    "pricePerKg": 33.8,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "assado-tiras",
      "priceOnRequest": false,
      "tagline": "A costela à uruguaia. Tira fina, cocção rápida.",
      "tier": "premium",
      "marbling": 4,
      "tenderness": 3,
      "uses": [
        "churrasco",
        "parrilla"
      ],
      "badges": [
        "Estilo platino"
      ]
    }
  },
  {
    "name": "Filé Mignon",
    "category": "Bovinos · sem osso",
    "description": "Corte interno do lombo, baixa atividade muscular. Textura amanteigada, sabor delicado.",
    "pricePerKg": 100.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "file-mignon",
      "priceOnRequest": false,
      "tagline": "O músculo mais macio do boi.",
      "tier": "signature",
      "marbling": 2,
      "tenderness": 5,
      "uses": [
        "churrasco",
        "forno",
        "panela"
      ],
      "badges": [
        "Premium"
      ]
    }
  },
  {
    "name": "Picanha",
    "category": "Bovinos · sem osso",
    "description": "Capa de gordura uniforme, fibra curta, peso ideal entre 1,1 e 1,3 kg para máximo marmoreio.",
    "pricePerKg": 90.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "picanha",
      "priceOnRequest": false,
      "tagline": "A rainha do churrasco brasileiro.",
      "tier": "signature",
      "marbling": 4,
      "tenderness": 4,
      "uses": [
        "churrasco",
        "parrilla"
      ],
      "badges": [
        "Mais pedido"
      ],
      "portion": "1 peça serve 4–5 pessoas"
    }
  },
  {
    "name": "Entrecôt",
    "category": "Bovinos · sem osso",
    "description": "Corte alto e marmorizado da região do entrecosto. Sela rápido em chapa muito quente.",
    "pricePerKg": 68.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "entrecot",
      "priceOnRequest": false,
      "tagline": "O contrafilé desossado da escola francesa.",
      "tier": "premium",
      "marbling": 4,
      "tenderness": 4,
      "uses": [
        "churrasco",
        "panela"
      ]
    }
  },
  {
    "name": "Contra Filé",
    "category": "Bovinos · sem osso",
    "description": "Corte longo do lombo, sabor pronunciado e marmoreio presente. Perfeito em bifes altos.",
    "pricePerKg": 60.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "contra-file",
      "priceOnRequest": false,
      "tagline": "Estrutura clássica, sabor que sustenta.",
      "tier": "premium",
      "marbling": 3,
      "tenderness": 3,
      "uses": [
        "churrasco",
        "panela"
      ]
    }
  },
  {
    "name": "Miolo da Alcatra",
    "category": "Bovinos · sem osso",
    "description": "Núcleo macio da alcatra, corte versátil para bifes grossos, espetos ou rosbife.",
    "pricePerKg": 51.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "miolo-alcatra",
      "priceOnRequest": false,
      "tagline": "O coração da alcatra.",
      "tier": "premium",
      "marbling": 3,
      "tenderness": 4,
      "uses": [
        "churrasco",
        "forno"
      ]
    }
  },
  {
    "name": "Fraldinha",
    "category": "Bovinos · sem osso",
    "description": "Corte do flanco, com sabor intenso. Peça inteira na brasa ou cortes finos no contrário da fibra.",
    "pricePerKg": 44.5,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "fraldinha",
      "priceOnRequest": false,
      "tagline": "Fibra longa, sabor profundo.",
      "tier": "premium",
      "marbling": 3,
      "tenderness": 3,
      "uses": [
        "churrasco",
        "parrilla"
      ]
    }
  },
  {
    "name": "Fraldão",
    "category": "Bovinos · sem osso",
    "description": "Peça mais larga e suculenta, ótima para grelhar em alta temperatura.",
    "pricePerKg": 46.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "fraldao",
      "priceOnRequest": false,
      "tagline": "O irmão maior da fraldinha.",
      "tier": "premium",
      "marbling": 3,
      "tenderness": 3,
      "uses": [
        "churrasco"
      ]
    }
  },
  {
    "name": "Maminha",
    "category": "Bovinos · sem osso",
    "description": "Corte triangular, fibras curtas, suculenta. Vai inteira ao espeto ou em fatias grossas.",
    "pricePerKg": 50.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "maminha",
      "priceOnRequest": false,
      "tagline": "A ponta macia da alcatra.",
      "tier": "premium",
      "marbling": 3,
      "tenderness": 4,
      "uses": [
        "churrasco",
        "forno"
      ]
    }
  },
  {
    "name": "Bananinha",
    "category": "Bovinos · sem osso",
    "description": "Corte do diafragma com sabor pronunciado e textura macia. Sela rápido, fatie no contrário da fibra.",
    "pricePerKg": 43.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "bananinha",
      "priceOnRequest": false,
      "tagline": "Pequena, escondida, surpreendente.",
      "tier": "premium",
      "marbling": 3,
      "tenderness": 4,
      "uses": [
        "churrasco",
        "parrilla"
      ],
      "badges": [
        "Pouca oferta"
      ]
    }
  },
  {
    "name": "Capa do Contra Filé",
    "category": "Bovinos · sem osso",
    "description": "A capa que recobre o contrafilé, com gordura entremeada generosa. Para quem busca sabor.",
    "pricePerKg": 38.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "capa-contra-file",
      "priceOnRequest": false,
      "tagline": "Marmoreio acima da média.",
      "tier": "classic",
      "marbling": 4,
      "tenderness": 3,
      "uses": [
        "churrasco",
        "panela"
      ]
    }
  },
  {
    "name": "Coxão Mole",
    "category": "Bovinos · sem osso",
    "description": "Corte do coxão traseiro, fibra fina e baixa gordura. Ideal para bifes, escalopes e rolês.",
    "pricePerKg": 40.7,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "coxao-mole",
      "priceOnRequest": false,
      "tagline": "Versátil. Da chapa ao recheio.",
      "tier": "classic",
      "marbling": 2,
      "tenderness": 3,
      "uses": [
        "panela",
        "forno"
      ]
    }
  },
  {
    "name": "Coxão de Fora",
    "category": "Bovinos · sem osso",
    "description": "Carne magra de fibra mais longa. Brilha em panelas de pressão, ensopados e carne louca.",
    "pricePerKg": 36.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "coxao-fora",
      "priceOnRequest": false,
      "tagline": "Para o cozido lento de domingo.",
      "tier": "classic",
      "marbling": 2,
      "tenderness": 2,
      "uses": [
        "panela",
        "cozido",
        "desfiado"
      ]
    }
  },
  {
    "name": "Patinho",
    "category": "Bovinos · sem osso",
    "description": "Corte traseiro magro e firme. Ótimo para almôndegas, hambúrgueres caseiros e bifes finos.",
    "pricePerKg": 39.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "patinho",
      "priceOnRequest": false,
      "tagline": "O preferido das moídas e bifes.",
      "tier": "classic",
      "marbling": 2,
      "tenderness": 3,
      "uses": [
        "panela",
        "forno"
      ]
    }
  },
  {
    "name": "Tatu",
    "category": "Bovinos · sem osso",
    "description": "Subcorte do coxão, magro e versátil para refogados e bifes finos.",
    "pricePerKg": 37.1,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "tatu",
      "priceOnRequest": false,
      "tagline": "Pequeno corte, grande utilidade.",
      "tier": "daily",
      "marbling": 1,
      "tenderness": 3,
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Músculo",
    "category": "Bovinos · sem osso",
    "description": "Carne firme com colágeno generoso, transforma-se em manteiga após horas de panela.",
    "pricePerKg": 30.3,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "musculo",
      "priceOnRequest": false,
      "tagline": "O segredo dos cozidos longos.",
      "tier": "classic",
      "marbling": 2,
      "tenderness": 2,
      "uses": [
        "panela",
        "cozido"
      ]
    }
  },
  {
    "name": "Acém",
    "category": "Bovinos · sem osso",
    "description": "Corte dianteiro com gordura entremeada equilibrada. Faz a melhor moída para hambúrguer.",
    "pricePerKg": 30.99,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "acem",
      "priceOnRequest": false,
      "tagline": "O coração da carne moída de verdade.",
      "tier": "classic",
      "marbling": 3,
      "tenderness": 2,
      "uses": [
        "panela",
        "forno"
      ]
    }
  },
  {
    "name": "Granito",
    "category": "Bovinos · sem osso",
    "description": "Carne firme do dianteiro. Ótimo em ensopados e refogados de longa cocção.",
    "pricePerKg": 30.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "granito",
      "priceOnRequest": false,
      "tagline": "O lombinho do dianteiro.",
      "tier": "daily",
      "marbling": 2,
      "tenderness": 2,
      "uses": [
        "panela",
        "cozido"
      ]
    }
  },
  {
    "name": "Costela (sem osso)",
    "category": "Bovinos · sem osso",
    "description": "Manta de costela limpa para braseado lento. Suculência garantida em assados longos.",
    "pricePerKg": 43.7,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "costela-sem-osso",
      "priceOnRequest": false,
      "tagline": "Toda a alma da costela, sem o osso.",
      "tier": "premium",
      "marbling": 4,
      "tenderness": 3,
      "uses": [
        "forno",
        "panela"
      ]
    }
  },
  {
    "name": "Paleta",
    "category": "Bovinos · sem osso",
    "description": "Corte do dianteiro, ótima para assar inteira ou cortada em iscas.",
    "pricePerKg": 38.3,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "paleta-sem-osso",
      "priceOnRequest": false,
      "tagline": "Versátil, suculenta, generosa.",
      "tier": "classic",
      "marbling": 2,
      "tenderness": 3,
      "uses": [
        "forno",
        "panela"
      ]
    }
  },
  {
    "name": "Carne Moída 1ª",
    "category": "Bovinos · sem osso",
    "description": "Moemos diariamente, a partir do patinho fresco. Sem aparas escondidas.",
    "pricePerKg": 36.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "carne-moida-1",
      "priceOnRequest": false,
      "tagline": "Patinho moído na hora.",
      "tier": "classic",
      "marbling": 2,
      "tenderness": 3,
      "uses": [
        "panela",
        "forno"
      ]
    }
  },
  {
    "name": "Carne Moída 2ª",
    "category": "Bovinos · sem osso",
    "description": "Moída do dianteiro, com gordura presente. Sabor que rende.",
    "pricePerKg": 31.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "carne-moida-2",
      "priceOnRequest": false,
      "tagline": "Para o feijão, escondidinho e o dia a dia.",
      "tier": "daily",
      "marbling": 3,
      "tenderness": 2,
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Entranha",
    "category": "Bovinos · sem osso",
    "description": "Corte fino do diafragma, fibra longa e sabor pronunciado. Sela em chapa muito quente.",
    "pricePerKg": 26.4,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "entranha",
      "priceOnRequest": false,
      "tagline": "A skirt steak da casa.",
      "tier": "premium",
      "marbling": 3,
      "tenderness": 3,
      "uses": [
        "churrasco",
        "parrilla"
      ]
    }
  },
  {
    "name": "Filé Duplo",
    "category": "Bovinos · com osso",
    "description": "Corte alto, com osso, ideal para grelha em alta temperatura e descanso longo.",
    "pricePerKg": 47.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "file-duplo",
      "priceOnRequest": false,
      "tagline": "Dupla camada para brasa profunda.",
      "tier": "premium",
      "marbling": 4,
      "tenderness": 4,
      "uses": [
        "churrasco"
      ]
    }
  },
  {
    "name": "Alcatra",
    "category": "Bovinos · com osso",
    "description": "Peça inteira da alcatra com osso para concentração de sabor.",
    "pricePerKg": 45.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "alcatra-osso",
      "priceOnRequest": false,
      "tagline": "Clássica, suculenta, com osso.",
      "tier": "premium",
      "marbling": 3,
      "tenderness": 4,
      "uses": [
        "churrasco",
        "forno"
      ]
    }
  },
  {
    "name": "Filé Simples",
    "category": "Bovinos · com osso",
    "description": "Corte tradicional do filé com osso, para assar inteiro.",
    "pricePerKg": 36.5,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "file-simples-osso",
      "priceOnRequest": false,
      "tagline": "Direto, sem firulas.",
      "tier": "classic",
      "marbling": 3,
      "tenderness": 3,
      "uses": [
        "churrasco"
      ]
    }
  },
  {
    "name": "Filé Americano",
    "category": "Bovinos · com osso",
    "description": "Estilo americano de corte do filé, alto e largo.",
    "pricePerKg": 31.5,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "file-americano",
      "priceOnRequest": false,
      "tagline": "Brasa larga, ponto rosado.",
      "tier": "classic",
      "marbling": 3,
      "tenderness": 3,
      "uses": [
        "churrasco",
        "panela"
      ]
    }
  },
  {
    "name": "Paleta 7",
    "category": "Bovinos · com osso",
    "description": "Paleta com osso, perfeita para braseados de fim de semana.",
    "pricePerKg": 31.5,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "paleta-7",
      "priceOnRequest": false,
      "tagline": "Para assados longos.",
      "tier": "classic",
      "marbling": 3,
      "tenderness": 2,
      "uses": [
        "forno",
        "panela"
      ]
    }
  },
  {
    "name": "Paleta do Osso Redondo",
    "category": "Bovinos · com osso",
    "description": "Corte específico da paleta com osso redondo, para forno baixo.",
    "pricePerKg": 29.2,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "paleta-osso-redondo",
      "priceOnRequest": false,
      "tagline": "Assado lento, recompensa garantida.",
      "tier": "classic",
      "marbling": 3,
      "tenderness": 2,
      "uses": [
        "forno",
        "panela"
      ]
    }
  },
  {
    "name": "Lombo (c/ osso)",
    "category": "Bovinos · com osso",
    "description": "Lombo com osso preservado para concentração de sabor no forno.",
    "pricePerKg": 26.5,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "lombo-osso",
      "priceOnRequest": false,
      "tagline": "Estrutura e sabor.",
      "tier": "classic",
      "marbling": 3,
      "tenderness": 3,
      "uses": [
        "churrasco",
        "forno"
      ]
    }
  },
  {
    "name": "Peito (c/ osso)",
    "category": "Bovinos · com osso",
    "description": "Peito com osso, base de bons caldos e sopas.",
    "pricePerKg": 25.5,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "peito-osso",
      "priceOnRequest": false,
      "tagline": "Para sopas e cozidos densos.",
      "tier": "daily",
      "marbling": 3,
      "tenderness": 2,
      "uses": [
        "panela",
        "cozido"
      ]
    }
  },
  {
    "name": "Músculo (c/ osso)",
    "category": "Bovinos · com osso",
    "description": "Ossobuco-style. Cocção longa, colágeno transformado em sedosidade.",
    "pricePerKg": 25.4,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "musculo-osso",
      "priceOnRequest": false,
      "tagline": "O melhor caldo da cidade começa aqui.",
      "tier": "daily",
      "marbling": 2,
      "tenderness": 2,
      "uses": [
        "panela",
        "cozido"
      ]
    }
  },
  {
    "name": "Osso Buco",
    "category": "Bovinos · com osso",
    "description": "Corte transversal do músculo traseiro com tutano. Braseado por horas.",
    "pricePerKg": 25,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "osso-buco",
      "priceOnRequest": false,
      "tagline": "O clássico italiano da casa.",
      "tier": "premium",
      "marbling": 3,
      "tenderness": 2,
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Costela Ripa",
    "category": "Bovinos · com osso",
    "description": "Tira de costela com osso, para 6h de fogo brando.",
    "pricePerKg": 33.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "costela-ripa",
      "priceOnRequest": false,
      "tagline": "Tira clássica para o fogo de chão.",
      "tier": "premium",
      "marbling": 4,
      "tenderness": 3,
      "uses": [
        "churrasco"
      ]
    }
  },
  {
    "name": "Costela Ponta da Agulha",
    "category": "Bovinos · com osso",
    "description": "Parte mais magra da costela, com ossos finos.",
    "pricePerKg": 25.99,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "costela-ponta-agulha",
      "priceOnRequest": false,
      "tagline": "A costela do ribeirinho.",
      "tier": "classic",
      "marbling": 4,
      "tenderness": 3,
      "uses": [
        "churrasco",
        "forno"
      ]
    }
  },
  {
    "name": "Meio Boi",
    "category": "Cortes Inteiros",
    "description": "Para açougueiros, restaurantes e eventos. Cortado conforme sua necessidade.",
    "pricePerKg": 28.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "meio-boi",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "panela",
        "churrasco"
      ]
    }
  },
  {
    "name": "Quarto Traseiro",
    "category": "Cortes Inteiros",
    "description": "Inclui picanha, alcatra, contrafilé, filé mignon, coxão mole e mais.",
    "pricePerKg": 33.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "quarto-traseiro",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "churrasco"
      ]
    }
  },
  {
    "name": "Quarto Dianteiro",
    "category": "Cortes Inteiros",
    "description": "Acém, peito, paleta, músculo. Para casas que valorizam cocção lenta.",
    "pricePerKg": 23.5,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "quarto-dianteiro",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Serrote",
    "category": "Cortes Inteiros",
    "description": "Corte longitudinal específico, sob encomenda.",
    "pricePerKg": 36.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "serrote",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "churrasco"
      ]
    }
  },
  {
    "name": "Pistola",
    "category": "Cortes Inteiros",
    "description": "Quarto sem ponta de agulha — só os nobres do traseiro.",
    "pricePerKg": 36.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "pistola",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "churrasco"
      ]
    }
  },
  {
    "name": "Coxa",
    "category": "Cortes Inteiros",
    "description": null,
    "pricePerKg": 30.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "coxa",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "churrasco",
        "forno"
      ]
    }
  },
  {
    "name": "Filé Corrido",
    "category": "Cortes Inteiros",
    "description": "Lombo inteiro corrido, para corte sob medida.",
    "pricePerKg": 43,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "file-corrido",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "churrasco"
      ]
    }
  },
  {
    "name": "Filé Duplo c/ Alcatra",
    "category": "Cortes Inteiros",
    "description": "Combinação clássica, peso médio de 12 kg.",
    "pricePerKg": 44.5,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "file-duplo-alcatra",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "churrasco"
      ]
    }
  },
  {
    "name": "Filé Simples",
    "category": "Cortes Inteiros",
    "description": null,
    "pricePerKg": 34.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "file-simples-inteiro",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "churrasco"
      ]
    }
  },
  {
    "name": "Paleta",
    "category": "Cortes Inteiros",
    "description": null,
    "pricePerKg": 27.4,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "paleta-inteira",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "forno",
        "panela"
      ]
    }
  },
  {
    "name": "Lombo",
    "category": "Cortes Inteiros",
    "description": null,
    "pricePerKg": 23.5,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "lombo-inteiro",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "forno"
      ]
    }
  },
  {
    "name": "Costela Inteira",
    "category": "Cortes Inteiros",
    "description": "A peça inteira da costela, para fogo de chão e eventos.",
    "pricePerKg": 30.5,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "costela-inteira",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "churrasco",
        "forno"
      ]
    }
  },
  {
    "name": "Carcaça Suína",
    "category": "Carne Suína",
    "description": "Carcaça inteira ou meia, cortes sob orientação.",
    "pricePerKg": 12.8,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "carcaca-suina",
      "priceOnRequest": false,
      "tier": "daily",
      "uses": [
        "panela",
        "forno"
      ]
    }
  },
  {
    "name": "Pernil",
    "category": "Carne Suína",
    "description": "Pernil tradicional, ideal para assar com vinho branco e ervas.",
    "pricePerKg": 12.3,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "pernil",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "forno"
      ]
    }
  },
  {
    "name": "Paleta",
    "category": "Carne Suína",
    "description": "Mais marmorizada que o pernil, virou pulled pork dos sonhos.",
    "pricePerKg": 11.75,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "paleta-suina",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "forno",
        "panela"
      ]
    }
  },
  {
    "name": "Bisteca",
    "category": "Carne Suína",
    "description": "Corte com osso, alta no fogo, pronta em minutos.",
    "pricePerKg": 12.4,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "bisteca",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "churrasco",
        "panela"
      ]
    }
  },
  {
    "name": "Costela",
    "category": "Carne Suína",
    "description": "Defumado caseiro ou forno baixo com glaze de mel e mostarda.",
    "pricePerKg": 18.5,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "costela-suina",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "forno",
        "churrasco"
      ]
    }
  },
  {
    "name": "Panceta",
    "category": "Carne Suína",
    "description": "Barriga suína com camadas de gordura. Crocante por fora, derretida por dentro.",
    "pricePerKg": 29.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "panceta",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "forno",
        "churrasco"
      ],
      "badges": [
        "Premium"
      ]
    }
  },
  {
    "name": "Toucinho",
    "category": "Carne Suína",
    "description": "Para feijoadas, refogados e gordura artesanal.",
    "pricePerKg": 19.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "toucinho",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Copa / Lombo",
    "category": "Carne Suína",
    "description": "Copa lombo inteira, marmorizada, espetacular no churrasco.",
    "pricePerKg": 26.8,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "copa-lombo",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "forno",
        "churrasco"
      ]
    }
  },
  {
    "name": "Paleta de Ovelha",
    "category": "Carne Ovina",
    "description": "Paleta inteira para assar lentamente com alecrim e vinho.",
    "pricePerKg": 94.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "ovina-paleta",
      "priceOnRequest": false,
      "tier": "signature",
      "uses": [
        "forno",
        "churrasco"
      ],
      "badges": [
        "Premium"
      ]
    }
  },
  {
    "name": "Pernil de Ovelha",
    "category": "Carne Ovina",
    "description": "Pernil clássico, ideal para forno baixo por 4 horas.",
    "pricePerKg": 91.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "ovina-pernil",
      "priceOnRequest": false,
      "tier": "signature",
      "uses": [
        "forno"
      ]
    }
  },
  {
    "name": "Carré de Ovelha",
    "category": "Carne Ovina",
    "description": "Costela francesa, ossos limpos, apresentação de restaurante.",
    "pricePerKg": 78.2,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "ovina-carre",
      "priceOnRequest": false,
      "tier": "signature",
      "uses": [
        "forno",
        "churrasco"
      ],
      "badges": [
        "Edição"
      ]
    }
  },
  {
    "name": "Costela de Ovelha",
    "category": "Carne Ovina",
    "description": "Costela ovina, sabor marcante, perfeita à brasa.",
    "pricePerKg": 59.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "ovina-costela",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "churrasco",
        "forno"
      ]
    }
  },
  {
    "name": "Coxa e Sobrecoxa s/ Osso",
    "category": "Aves Temperadas",
    "description": "Desossada, temperada na casa com mistura de ervas e limão siciliano.",
    "pricePerKg": 20.5,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "coxa-sobrecoxa",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "churrasco",
        "forno"
      ]
    }
  },
  {
    "name": "Meio da Asa",
    "category": "Aves Temperadas",
    "description": "Tempero defumado, vai direto à brasa.",
    "pricePerKg": 23.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "meio-asa",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "churrasco",
        "forno"
      ]
    }
  },
  {
    "name": "Coxinha da Asa",
    "category": "Aves Temperadas",
    "description": "Aperitivo clássico, marinada em mel e mostarda.",
    "pricePerKg": 16.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "coxinha-asa",
      "priceOnRequest": false,
      "tier": "daily",
      "uses": [
        "churrasco",
        "forno"
      ]
    }
  },
  {
    "name": "Coração de Frango",
    "category": "Aves Temperadas",
    "description": "Tempero rústico de alho e sal grosso. O ouro do espeto.",
    "pricePerKg": 39.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "coracao",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "churrasco",
        "parrilla"
      ],
      "badges": [
        "Mais pedido"
      ]
    }
  },
  {
    "name": "Linguicinha Toscana",
    "category": "Embutidos",
    "description": "Suína com pimenta-do-reino e erva-doce. Receita italiana tradicional.",
    "pricePerKg": 27.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "ling-toscana",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "churrasco",
        "panela"
      ]
    }
  },
  {
    "name": "Linguicinha Caseira",
    "category": "Embutidos",
    "description": "Receita da casa, suína com tempero balanceado.",
    "pricePerKg": 29.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "ling-caseira",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "churrasco"
      ],
      "badges": [
        "Casa"
      ]
    }
  },
  {
    "name": "Tomate Seco c/ Rúcula",
    "category": "Embutidos",
    "description": "Suína com tomate seco artesanal e folhas frescas de rúcula.",
    "pricePerKg": 33.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "ling-tomate-rucula",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "churrasco"
      ],
      "badges": [
        "Autoral"
      ]
    }
  },
  {
    "name": "Bombom de Queijo",
    "category": "Embutidos",
    "description": "Recheio de queijo que derrete na brasa. Bocados perfeitos.",
    "pricePerKg": 32.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "ling-bombom-queijo",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "churrasco"
      ],
      "badges": [
        "Mais pedido"
      ]
    }
  },
  {
    "name": "Campeira",
    "category": "Embutidos",
    "description": "Inspiração gaúcha, defumada artesanalmente.",
    "pricePerKg": 32.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "ling-campeira",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "churrasco"
      ]
    }
  },
  {
    "name": "Costela Bovina",
    "category": "Embutidos",
    "description": "100% bovina, feita com costela e gordura entremeada.",
    "pricePerKg": 36.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "ling-costela-bovina",
      "priceOnRequest": false,
      "tier": "signature",
      "uses": [
        "churrasco"
      ],
      "badges": [
        "Premium"
      ]
    }
  },
  {
    "name": "Boa de Brasa",
    "category": "Embutidos",
    "description": "Linguiça do dia a dia, perfeita para o churrasco rápido.",
    "pricePerKg": 21.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "ling-boa-brasa",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "churrasco"
      ]
    }
  },
  {
    "name": "Colonial",
    "category": "Embutidos",
    "description": "Receita colonial, defumada suave.",
    "pricePerKg": 22.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "ling-colonial",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "churrasco",
        "panela"
      ]
    }
  },
  {
    "name": "Fininha (Apimentada)",
    "category": "Embutidos",
    "description": "Calibre fino, picância equilibrada. Vai como aperitivo no espeto.",
    "pricePerKg": 35.8,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "ling-fininha",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "churrasco"
      ],
      "badges": [
        "Picante"
      ]
    }
  },
  {
    "name": "Fígado",
    "category": "Miúdos Bovinos",
    "description": "Fígado fresco, fatiado fino. Acebolado na manteiga.",
    "pricePerKg": 19.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "figado",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Língua",
    "category": "Miúdos Bovinos",
    "description": "Cocção lenta com legumes, finalização ao molho.",
    "pricePerKg": 18.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "lingua",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Coração",
    "category": "Miúdos Bovinos",
    "description": null,
    "pricePerKg": 12,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "coracao-bovino",
      "priceOnRequest": false,
      "tier": "daily",
      "uses": [
        "panela",
        "churrasco"
      ]
    }
  },
  {
    "name": "Rabada",
    "category": "Miúdos Bovinos",
    "description": "Cauda do boi, colágeno generoso. Cozida com agrião — clássico atemporal.",
    "pricePerKg": 30.99,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "rabada",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Bucho",
    "category": "Miúdos Bovinos",
    "description": "Limpo e branqueado, pronto para dobradinha.",
    "pricePerKg": 18.5,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "bucho",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Mocotó",
    "category": "Miúdos Bovinos",
    "description": null,
    "pricePerKg": 14.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "mocoto",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Tendão",
    "category": "Miúdos Bovinos",
    "description": null,
    "pricePerKg": 13,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "tendao",
      "priceOnRequest": false,
      "tier": "daily",
      "uses": [
        "panela",
        "cozido"
      ]
    }
  },
  {
    "name": "Fressura Suína",
    "category": "Miúdos Suínos",
    "description": null,
    "pricePerKg": 13.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "fressura",
      "priceOnRequest": false,
      "tier": "daily",
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Cabeça",
    "category": "Miúdos Suínos",
    "description": null,
    "pricePerKg": 10.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "cabeca",
      "priceOnRequest": false,
      "tier": "daily",
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Pé",
    "category": "Miúdos Suínos",
    "description": "Para feijoada de raiz.",
    "pricePerKg": 11.5,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "pe-suino",
      "priceOnRequest": false,
      "tier": "daily",
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Rabo",
    "category": "Miúdos Suínos",
    "description": null,
    "pricePerKg": 22.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "rabo-suino",
      "priceOnRequest": false,
      "tier": "classic",
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Orelha",
    "category": "Miúdos Suínos",
    "description": null,
    "pricePerKg": 15.5,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "orelha",
      "priceOnRequest": false,
      "tier": "daily",
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Pele",
    "category": "Miúdos Suínos",
    "description": "Para torresmo crocante.",
    "pricePerKg": 9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "pele",
      "priceOnRequest": false,
      "tier": "daily",
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Ossada",
    "category": "Miúdos Suínos",
    "description": null,
    "pricePerKg": 6.5,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "ossada",
      "priceOnRequest": false,
      "tier": "daily",
      "uses": [
        "panela",
        "cozido"
      ]
    }
  },
  {
    "name": "Charque",
    "category": "Diversos",
    "description": "Charque dessalgado e curado. Pronto para arroz carreteiro e escondidinho.",
    "pricePerKg": 47.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "charque",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "panela",
        "desfiado"
      ]
    }
  },
  {
    "name": "Carne Seca",
    "category": "Diversos",
    "description": "Curada em sal grosso, fibra desfiável. Sabor concentrado.",
    "pricePerKg": 47.9,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "carne-seca",
      "priceOnRequest": false,
      "tier": "premium",
      "uses": [
        "panela",
        "desfiado"
      ]
    }
  },
  {
    "name": "Sebo Bovino",
    "category": "Diversos",
    "description": "Para uso culinário e artesanal. Consulte disponibilidade.",
    "pricePerKg": 0,
    "saleUnit": "kg",
    "productType": "product",
    "editorial": {
      "sourceId": "sebo-bovino",
      "priceOnRequest": true,
      "tier": "daily",
      "uses": [
        "panela"
      ]
    }
  },
  {
    "name": "Kit Churrasco Clássico",
    "category": "Combos",
    "description": null,
    "pricePerKg": 389,
    "saleUnit": "unidade",
    "productType": "combo",
    "editorial": {
      "sourceId": "kit-classico",
      "serves": "8 pessoas",
      "items": [
        "1 picanha (1.2 kg)",
        "1.5 kg fraldinha",
        "1 kg linguicinha caseira",
        "500 g coração de frango"
      ],
      "savings": 42,
      "priceOnRequest": false
    }
  },
  {
    "name": "Kit Assinatura",
    "category": "Combos",
    "description": null,
    "pricePerKg": 749,
    "saleUnit": "unidade",
    "productType": "combo",
    "editorial": {
      "sourceId": "kit-premium",
      "serves": "6 pessoas",
      "items": [
        "1 tomahawk (1.4 kg)",
        "1 prime rib (1.5 kg)",
        "500 g entrecôt",
        "300 g manteiga de ervas da casa"
      ],
      "savings": 88,
      "priceOnRequest": false
    }
  },
  {
    "name": "Kit Domingo de Família",
    "category": "Combos",
    "description": null,
    "pricePerKg": 419,
    "saleUnit": "unidade",
    "productType": "combo",
    "editorial": {
      "sourceId": "kit-domingo",
      "serves": "10 pessoas",
      "items": [
        "2 kg costela ripa",
        "1 kg fraldinha",
        "1.5 kg linguicinha boa de brasa",
        "1 kg coração de frango",
        "Carvão e sal grosso"
      ],
      "savings": 56,
      "priceOnRequest": false
    }
  }
];
