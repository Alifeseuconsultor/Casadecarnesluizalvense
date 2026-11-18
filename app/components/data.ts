export type BeefRegion = {
  id: string;
  name: string;
  description: string;
  marbling: number;
  preparation: string;
  doneness: string;
};

export const beefRegions: BeefRegion[] = [
  {
    id: "shoulder",
    name: "Acém / Shoulder",
    description: "Corte dianteiro de sabor pronunciado, ótimo para cocção lenta ou moagem premium.",
    marbling: 3,
    preparation: "Defumação lenta ou braseado",
    doneness: "Bem passado e macio na cocção longa",
  },
  {
    id: "ribs",
    name: "Costela",
    description: "Fibras e gordura entremeadas, com grande potencial de sabor quando o tempo trabalha a seu favor.",
    marbling: 4,
    preparation: "Defumação ou fogo baixo",
    doneness: "Bem macia, soltando do osso",
  },
  {
    id: "loin",
    name: "Filé / Lombo",
    description: "Região de cortes altos e macios, como chorizo e ancho, com preparo rápido e calor intenso.",
    marbling: 4,
    preparation: "Parrilla ou grelha forte",
    doneness: "Mal passado a ao ponto",
  },
  {
    id: "rump",
    name: "Traseiro / Picanha",
    description: "Região nobre, de fibras delicadas e capa de gordura que protege a suculência.",
    marbling: 3,
    preparation: "Grelha ou espeto na brasa",
    doneness: "Ao ponto para mal",
  },
];

export const storeHours = [
    ["Segunda a quinta", "07:30–18:00"],
    ["Sexta-feira", "07:30–18:00"],
    ["Sábado", "07:30–16:00"],
    ["Domingo", "Fechado"],
];
