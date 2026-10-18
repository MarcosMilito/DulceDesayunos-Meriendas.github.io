export type Category = "Promos" | "Desayunos" | "Meriendas" | "Picadas" | "Regalos";

export type Product = {
  id: string; name: string; category: Category; description: string; price: number;
  image?: string; accent: string; badge?: string; customizable?: boolean;
};

export const products: Product[] = [
  { id: "DES001", name: "Clásico", category: "Desayunos", description: "Infusión, jugo, medialunas, mini tortas y bocaditos dulces.", price: 20000, image: "/images/des001.png", accent: "peach", badge: "El elegido", customizable: true },
  { id: "DES002", name: "Matero", category: "Desayunos", description: "Todo lo rico para acompañar unos mates y empezar lento.", price: 18000, image: "/images/des002.png", accent: "mint", customizable: true },
  { id: "DES003", name: "Chocotorta", category: "Desayunos", description: "Una mañana bien argentina con mini chocotorta y dulces caseros.", price: 23000, image: "/images/des003.png", accent: "lilac", badge: "Nuevo", customizable: true },
  { id: "MER001", name: "Tarde de amigas", category: "Meriendas", description: "Cookies, budín cítrico, alfajores y limonada para compartir.", price: 26500, accent: "pink", badge: "Demo" },
  { id: "PIC001", name: "Picada celebración", category: "Picadas", description: "Quesos, fiambres, dips y panes para una mesa de cuatro.", price: 36000, accent: "yellow", badge: "Demo" },
  { id: "REG001", name: "Mini mimo", category: "Regalos", description: "Taza, brownie, vela y tarjeta con mensaje personalizado.", price: 14500, accent: "blue", badge: "Demo" },
  { id: "PRO001", name: "Dúo domingo", category: "Promos", description: "Dos desayunos clásicos con envío bonificado en zona céntrica.", price: 35000, accent: "orange", badge: "-12%" },
  { id: "MER002", name: "Caja dulce", category: "Meriendas", description: "Selección de seis porciones para convertir cualquier tarde.", price: 21500, accent: "berry", badge: "Demo" },
];

export const extras = [
  { id: "mug", name: "Taza con nombre", price: 4200 },
  { id: "flowers", name: "Mini ramo", price: 5800 },
  { id: "balloon", name: "Globo metalizado", price: 3900 },
  { id: "juice", name: "Jugo extra", price: 2200 },
  { id: "glutenfree", name: "Opción sin TACC*", price: 3500 },
];

export const money = (value: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
