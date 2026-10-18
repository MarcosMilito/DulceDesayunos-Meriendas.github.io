"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, Clock3, Gift, Heart, Menu, Minus, Plus, ShoppingBag, Sparkles, X } from "lucide-react";
import { Category, extras, money, Product, products } from "@/lib/catalog";

type CartItem = { key: string; product: Product; quantity: number; extras: string[]; note?: string };
const categories: ("Todo" | Category)[] = ["Todo", "Promos", "Desayunos", "Meriendas", "Picadas", "Regalos"];

export default function Storefront() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Todo");
  const [newsOpen, setNewsOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [customizing, setCustomizing] = useState<Product | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dulce-cart-v1");
    if (saved) setCart(JSON.parse(saved));
    const timer = window.setTimeout(() => setNewsOpen(false), 15000);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => localStorage.setItem("dulce-cart-v1", JSON.stringify(cart)), [cart]);

  const visible = category === "Todo" ? products : products.filter((p) => p.category === category);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.quantity * (item.product.price + extras.filter((x) => item.extras.includes(x.id)).reduce((a, x) => a + x.price, 0)), 0);

  function addSimple(product: Product) {
    setCart((current) => [...current, { key: `${product.id}-${Date.now()}`, product, quantity: 1, extras: [] }]);
    setCartOpen(true);
  }
  function openCustomize(product: Product) { setSelectedExtras([]); setNote(""); setCustomizing(product); }
  function addCustomized() {
    if (!customizing) return;
    setCart((current) => [...current, { key: `${customizing.id}-${Date.now()}`, product: customizing, quantity: 1, extras: selectedExtras, note }]);
    setCustomizing(null); setCartOpen(true);
  }
  function changeQuantity(key: string, delta: number) {
    setCart((current) => current.map((item) => item.key === key ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  }

  return (
    <main>
      <div className="topline">ENVÍOS PROGRAMADOS · PEDÍ CON 48 HS DE ANTICIPACIÓN <span>♥</span></div>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Dulce, inicio"><span className="brand-mark">D</span><span>Dulce<small>desayunos & meriendas</small></span></a>
        <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Navegación principal">
          <a href="#catalogo" onClick={() => setMenuOpen(false)}>Productos</a>
          <a href="#personaliza" onClick={() => setMenuOpen(false)}>Personalizá</a>
          <a href="#novedades" onClick={() => setMenuOpen(false)}>Novedades</a>
          <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Cómo pedir</a>
        </nav>
        <div className="header-actions">
          <button className="icon-btn menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú"><Menu size={22}/></button>
          <button className="cart-btn" onClick={() => setCartOpen(true)}><ShoppingBag size={19}/><span>Mi pedido</span><b>{count}</b></button>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={15}/> HECHO A MANO, REGALADO CON AMOR</p>
          <h1>Desayunos que<br/><em>abrazan.</em></h1>
          <p className="hero-lead">Creamos momentos ricos, coloridos y memorables para celebrar a quienes querés.</p>
          <div className="hero-actions"><a className="button primary" href="#catalogo">Ver delicias <ArrowRight size={18}/></a><a className="text-link" href="#personaliza">Armá el tuyo</a></div>
          <div className="hero-trust"><span><Check/>Preparado en el día</span><span><Check/>Mensaje personalizado</span></div>
        </div>
        <div className="hero-art" aria-label="Caja de desayuno Dulce">
          <div className="sun-burst"></div><div className="float-heart h1">♥</div><div className="float-heart h2">♥</div>
          <div className="hero-card"><div className="ribbon">para vos</div><div className="hero-card-inner"><span className="mini-cup">☕</span><strong>Un mimo<br/>en forma<br/>de desayuno</strong><span className="tiny-note">hecho con amor</span></div></div>
          <div className="sticker">HOY ES<br/><b>UN GRAN DÍA</b></div>
        </div>
        <a className="scroll-cue" href="#catalogo"><span>DESCUBRÍ MÁS</span><ChevronDown size={17}/></a>
      </section>

      <section className="marquee" aria-label="Beneficios"><div>✦ DESAYUNOS A MEDIDA &nbsp;&nbsp; ♥ HECHO CON AMOR &nbsp;&nbsp; ✦ ENTREGAS PROGRAMADAS &nbsp;&nbsp; ♥ MOMENTOS DULCES &nbsp;&nbsp; ✦ DESAYUNOS A MEDIDA</div></section>

      <section className="catalog section" id="catalogo">
        <div className="section-heading"><div><p className="eyebrow coral">ALGO RICO PARA CADA MOMENTO</p><h2>Elegí tu favorito</h2></div><p>Pequeños placeres, grandes sonrisas.<br/>Todo se prepara especialmente para vos.</p></div>
        <div className="category-tabs" role="tablist" aria-label="Categorías">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="product-grid">{visible.map((product) => <ProductCard key={product.id} product={product} onAdd={() => product.customizable ? openCustomize(product) : addSimple(product)}/>)}</div>
      </section>

      <section className="personalize section" id="personaliza">
        <div className="personalize-art"><span className="scribble">a tu manera</span><div className="tray"><span>🥐</span><span>☕</span><span>🍓</span><span>🍪</span></div></div>
        <div className="personalize-copy"><p className="eyebrow">SOLO PARA DESAYUNOS</p><h2>Que sea tan único<br/>como esa persona.</h2><p>Elegí un desayuno base y sumale detalles: una taza con nombre, flores, globos o ese mensaje que solo ustedes entienden.</p><ol><li><b>1</b><span><strong>Elegí la base</strong><small>Clásico, Matero o Chocotorta.</small></span></li><li><b>2</b><span><strong>Sumá tus favoritos</strong><small>Complementos con precio claro.</small></span></li><li><b>3</b><span><strong>Escribí tu mensaje</strong><small>Nosotros hacemos la magia.</small></span></li></ol><button className="button dark" onClick={() => openCustomize(products[0])}>Empezar a personalizar <ArrowRight size={18}/></button></div>
      </section>

      <section className="news section" id="novedades">
        <div className="news-card"><div><p className="eyebrow">NOVEDAD DE LA SEMANA</p><h2>Domingos<br/>de a dos.</h2><p>Dos desayunos Clásico y envío bonificado en zona céntrica. Porque compartir siempre sabe mejor.</p><button className="button cream" onClick={() => addSimple(products.find((p) => p.id === "PRO001")!)}>Quiero la promo <ArrowRight size={18}/></button></div><div className="news-visual"><span className="big-type">2×</span><span className="round-label">HASTA<br/>AGOTAR<br/>STOCK</span></div></div>
        <div className="news-side"><span className="news-icon">✉</span><h3>Las cosas lindas<br/>también se avisan.</h3><p>Seguinos para enterarte de próximas cajas, fechas especiales y cupos.</p><div className="socials"><span>Instagram</span><span>WhatsApp</span></div></div>
      </section>

      <section className="how section" id="como-funciona"><div className="section-heading"><div><p className="eyebrow coral">SIMPLE Y SIN VUELTAS</p><h2>De tu pantalla a su puerta</h2></div></div><div className="steps"><div><b>01</b><Gift/><h3>Elegí</h3><p>Encontrá el regalo ideal o personalizá un desayuno.</p></div><div><b>02</b><Heart/><h3>Contanos</h3><p>Completá los datos y el mensaje para esa persona.</p></div><div><b>03</b><Clock3/><h3>Programá</h3><p>Coordinamos fecha, horario, pago y entrega.</p></div></div></section>

      <footer><div className="brand inverse"><span className="brand-mark">D</span><span>Dulce<small>desayunos & meriendas</small></span></div><p>Regalos hechos a mano para días que merecen algo especial.</p><div><a href="#catalogo">Catálogo</a><a href="#novedades">Novedades</a><a href="#como-funciona">Cómo pedir</a></div><small>© 2026 Dulce · Primera versión demostrativa</small></footer>

      {count > 0 && <button className="mobile-cart" onClick={() => setCartOpen(true)}><span><ShoppingBag size={18}/> Ver mi pedido ({count})</span><b>{money(total)}</b></button>}
      {newsOpen && <NewsModal onClose={() => setNewsOpen(false)} onAdd={() => { addSimple(products.find((p) => p.id === "PRO001")!); setNewsOpen(false); }}/>} 
      {customizing && <CustomizeModal product={customizing} selected={selectedExtras} setSelected={setSelectedExtras} note={note} setNote={setNote} onClose={() => setCustomizing(null)} onAdd={addCustomized}/>} 
      <CartDrawer open={cartOpen} items={cart} total={total} ordered={ordered} setOrdered={setOrdered} onClose={() => setCartOpen(false)} onQuantity={changeQuantity}/>
    </main>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return <article className="product-card"><div className={`product-image ${product.accent}`}>{product.image ? <img src={product.image} alt={`Desayuno ${product.name}`}/> : <DemoIllustration category={product.category}/>} {product.badge && <span className="product-badge">{product.badge}</span>}<button className="quick-add" onClick={onAdd} aria-label={`Agregar ${product.name}`}><Plus/></button></div><div className="product-info"><div><small>{product.category.toUpperCase()}</small><h3>{product.name}</h3></div><strong>{money(product.price)}</strong><p>{product.description}</p>{product.customizable && <button onClick={onAdd}>Personalizar desayuno <ArrowRight size={15}/></button>}</div></article>;
}

function DemoIllustration({ category }: { category: Category }) {
  const emoji = category === "Picadas" ? "🧀" : category === "Regalos" ? "🎁" : category === "Promos" ? "🥐☕" : "🍰";
  return <div className="demo-illustration"><span>{emoji}</span><i>Contenido demostrativo</i></div>;
}

function NewsModal({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="news-title"><div className="news-modal"><button className="modal-close" onClick={onClose} aria-label="Cerrar novedad"><X/></button><div className="modal-color"><span className="confetti">✦ ♥ ✦</span><b>2×</b><small>domingo</small></div><div className="modal-copy"><p className="eyebrow coral">NOVEDAD DULCE</p><h2 id="news-title">Este domingo,<br/>compartir tiene premio.</h2><p>Llevate dos desayunos Clásico por <strong>{money(35000)}</strong> con envío bonificado en zona céntrica.</p><button className="button primary" onClick={onAdd}>Sumar la promo <ArrowRight size={18}/></button><button className="skip" onClick={onClose}>Seguir mirando</button><div className="timer"><span></span></div></div></div></div>;
}

function CustomizeModal({ product, selected, setSelected, note, setNote, onClose, onAdd }: { product: Product; selected: string[]; setSelected: (v: string[]) => void; note: string; setNote: (v: string) => void; onClose: () => void; onAdd: () => void }) {
  const extraTotal = extras.filter((x) => selected.includes(x.id)).reduce((sum, x) => sum + x.price, 0);
  return <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="custom-modal"><button className="modal-close" onClick={onClose} aria-label="Cerrar"><X/></button><div className="custom-head"><p className="eyebrow coral">HACELO ÚNICO</p><h2>Personalizá tu {product.name}</h2><p>La personalización está disponible exclusivamente en desayunos.</p></div><div className="base-summary"><div className={`thumb ${product.accent}`}>{product.image ? <img src={product.image} alt=""/> : "🥐"}</div><div><small>BASE ELEGIDA</small><strong>{product.name}</strong></div><b>{money(product.price)}</b></div><fieldset><legend>1. Sumá detalles</legend><div className="extra-list">{extras.map((extra) => <label key={extra.id}><input type="checkbox" checked={selected.includes(extra.id)} onChange={() => setSelected(selected.includes(extra.id) ? selected.filter((id) => id !== extra.id) : [...selected, extra.id])}/><span><Check size={14}/></span><em>{extra.name}</em><b>+ {money(extra.price)}</b></label>)}</div></fieldset><label className="message-field"><span>2. Tu mensaje para la tarjeta</span><textarea value={note} maxLength={140} onChange={(e) => setNote(e.target.value)} placeholder="Ej: Feliz cumple, Mai. Que tengas un día hermoso ♥"/><small>{note.length}/140</small></label><div className="custom-total"><span>Total estimado <small>El envío se coordina aparte</small></span><strong>{money(product.price + extraTotal)}</strong><button className="button primary" onClick={onAdd}>Agregar al pedido <ShoppingBag size={17}/></button></div></div></div>;
}

function CartDrawer({ open, items, total, ordered, setOrdered, onClose, onQuantity }: { open: boolean; items: CartItem[]; total: number; ordered: boolean; setOrdered: (v: boolean) => void; onClose: () => void; onQuantity: (key: string, delta: number) => void }) {
  const summary = useMemo(() => items.map((item) => `${item.quantity}× ${item.product.name}${item.extras.length ? ` + ${item.extras.map((id) => extras.find((x) => x.id === id)?.name).join(", ")}` : ""}`).join("\n"), [items]);
  async function copyOrder() { await navigator.clipboard.writeText(`Pedido Dulce\n${summary}\nTotal estimado: ${money(total)}`); setOrdered(true); }
  return <><div className={open ? "drawer-shade open" : "drawer-shade"} onClick={onClose}></div><aside className={open ? "cart-drawer open" : "cart-drawer"} aria-hidden={!open}><div className="drawer-head"><div><p className="eyebrow coral">CASI LISTO</p><h2>Tu pedido</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div>{ordered ? <div className="success-state"><span><Check/></span><h3>¡Pedido copiado!</h3><p>Pegalo en WhatsApp o Instagram para coordinar disponibilidad, entrega y pago.</p><button className="button dark" onClick={() => setOrdered(false)}>Volver al pedido</button></div> : items.length === 0 ? <div className="empty-cart"><ShoppingBag/><h3>Tu carrito está esperando algo rico.</h3><a href="#catalogo" onClick={onClose}>Ver productos</a></div> : <><div className="cart-items">{items.map((item) => <div className="cart-item" key={item.key}><div className={`cart-thumb ${item.product.accent}`}>{item.product.image ? <img src={item.product.image} alt=""/> : "♥"}</div><div><small>{item.product.category}</small><h3>{item.product.name}</h3>{item.extras.length > 0 && <p>{item.extras.map((id) => extras.find((x) => x.id === id)?.name).join(" · ")}</p>}<div className="qty"><button onClick={() => onQuantity(item.key, -1)}><Minus/></button><b>{item.quantity}</b><button onClick={() => onQuantity(item.key, 1)}><Plus/></button></div></div><strong>{money(item.product.price * item.quantity)}</strong></div>)}</div><div className="drawer-total"><p><span>Subtotal</span><b>{money(total)}</b></p><small>El envío y la disponibilidad se confirman al coordinar.</small><button className="button primary full" onClick={copyOrder}>Continuar pedido <ArrowRight size={18}/></button><p className="demo-note">Flujo demostrativo: no se procesa ningún pago.</p></div></>}</aside></>;
}
