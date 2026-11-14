export type Cut = {
  id: string;
  name: string;
  category: string;
  description: string;
  rawImage: string;
  grilledImage: string;
  badge?: string;
  preparation: string;
};

export type WeightOption = {
  label: string;
  grams: number;
  note?: string;
};

export type CartLine = {
  id: string;
  name: string;
  image: string;
  category: "cut" | "pairing";
  quantity: number;
  gramsPerUnit: number;
  weightLabel: string;
};

export const weightOptions: WeightOption[] = [
  { label: "500 g", grams: 500 },
  { label: "1 kg", grams: 1000 },
  { label: "Peça inteira", grams: 1200, note: "peso aproximado" },
];

export const cuts: Cut[] = [
  {
    id: "ancho-wagyu-a5",
    name: "Ancho Wagyu A5",
    category: "Carnes Bovinas",
    description: "Marmoreio intenso, textura delicada e sabor amanteigado",
    rawImage: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1100&q=90",
    grilledImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1100&q=90",
    badge: "SELEÇÃO EXCLUSIVA",
    preparation: "Parrilla · sal de parrilla · ponto mal passado a ao ponto",
  },
  {
    id: "picanha-black-angus",
    name: "Picanha Black Angus",
    category: "Carnes Bovinas",
    description: "Capa de gordura uniforme e fibras macias",
    rawImage: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1100&q=90",
    grilledImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1100&q=90",
    badge: "CLÁSSICO DA CASA",
    preparation: "Grelha forte · sal grosso · ao ponto para mal",
  },
  {
    id: "tomahawk-dry-aged",
    name: "Tomahawk Dry Aged",
    category: "Dry Aged",
    description: "Osso longo, sabor profundo e maturação especial",
    rawImage: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=1100&q=90",
    grilledImage: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1100&q=90",
    badge: "DRY AGED",
    preparation: "Brasa indireta · finalização na grelha · ao ponto",
  },
  {
    id: "prime-rib",
    name: "Prime Rib",
    category: "Carnes Bovinas",
    description: "Costela alta com equilíbrio entre carne e gordura",
    rawImage: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=1100&q=90",
    grilledImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1100&q=90",
    preparation: "Defumação leve · brasa indireta · ao ponto",
  },
  {
    id: "short-rib",
    name: "Short Rib",
    category: "Churrasco",
    description: "Fibras entremeadas e personalidade marcante",
    rawImage: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1100&q=90",
    grilledImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1100&q=90",
    preparation: "Defumação lenta · brasa baixa · bem macio",
  },
  {
    id: "chorizo-argentino",
    name: "Chorizo Argentino",
    category: "Churrasco",
    description: "Corte alto, suculento e com sabor de parrilla",
    rawImage: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1100&q=90",
    grilledImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1100&q=90",
    preparation: "Parrilla quente · sal de parrilla · mal passado a ao ponto",
  },
];

export const pairings = [
  {
    id: "sal-parrilla",
    name: "Sal de Parrilla",
    description: "Realça o sabor sem roubar a cena",
    image: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442b?auto=format&fit=crop&w=360&q=85",
  },
  {
    id: "chimichurri",
    name: "Chimichurri Artesanal",
    description: "Ervas, acidez e frescor",
    image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=360&q=85",
  },
  {
    id: "lenha-frutifera",
    name: "Lenha Frutífera",
    description: "Aroma delicado para a brasa",
    image: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=360&q=85",
  },
];

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

export const shop = {
  phoneDisplay: "(47) 3304-4430",
  whatsapp: "554733044430",
  address: "SC-414, 11014, Luiz Alves - SC, 89115-000",
  hours: [
    ["Segunda a quinta", "07:30–18:00"],
    ["Sexta-feira", "07:30–18:00"],
    ["Sábado", "07:30–16:00"],
    ["Domingo", "Fechado"],
  ],
};
