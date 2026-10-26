import {formatMoney as money,escapeHtml as h,loadPublic,initialPublic,isCloud,getCart,setCart,productPrice,promoFor,slug,createCustomerOrder} from './data.js?v=3.9.0';
let store=initialPublic(), filter='todos', cart=getCart(), modalCloser=null, newsTimer=null;
// Datos del formulario conservados al regresar. Identificador único para evitar pedidos duplicados.
let checkoutDraft={},checkoutOrderId=null,orderAlreadySaved=false;
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
const img = (source)=>source || 'assets/img/clasico.jpeg';
const validProducts = () => (store.products||[]).filter(p=>p.active!==false);
const pById=(id)=>store.products.find(p=>p.id===id);
let toastTimer;
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3600)}
function setFilter(next,scroll=false){filter=next;$$('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===next));renderProducts();if(scroll)$('#productos').scrollIntoView({behavior:'smooth'});}
function renderProducts(){
 const visible=validProducts().filter(p=>filter==='todos'||p.category===filter||(filter==='meriendas'&&p.alsoMerienda));
 $('#product-total').textContent=`${visible.length} ${visible.length===1?'producto':'productos'}`;
 $('#product-grid').innerHTML=visible.length?visible.map(p=>{
  const promo=promoFor(p,store), price=productPrice(p,store);
  return `<article class="product-card"><div class="product-picture"><img loading="lazy" src="${h(img(p.image))}" alt="${h(p.name)} de Dulces"><span class="product-badge">${h(promo?'Promo especial':p.badge||'Hecho con amor')}</span><button class="picture-heart" title="Ver producto" data-detail="${h(p.id)}" aria-label="Ver detalle de ${h(p.name)}">♡</button></div><div class="product-content"><span class="product-category">${p.category==='picadas'?'Para compartir':filter==='meriendas'?'Meriendas':'Desayunos'}</span><h3>${h(p.name)}</h3><p class="product-description">${h(p.description)}</p><div class="price-row"><strong>${money(price)}</strong>${promo?`<span class="old-price">${money(p.price)}</span>`:''}</div><div class="product-actions"><button class="small-button primary" data-add="${h(p.id)}">+ Agregar al pedido</button><button class="small-button secondary" data-detail="${h(p.id)}">Ver detalle ↗</button></div></div></article>`
 }).join(''):'<div class="empty-state">Todavía no hay productos en esta categoría. Podés ver todo el catálogo o consultar por WhatsApp.<br><br><button class="btn btn-primary" data-show-all>Ver todos los productos</button></div>';
}
function renderPromos(){const promotions=(store.promos||[]).filter(x=>x.active && pById(x.productId)?.active!==false && pById(x.productId));
 $('#promos-grid').innerHTML=promotions.length?promotions.map(x=>{const p=pById(x.productId);return `<article class="promo-card"><img src="${h(img(p.image))}" alt="${h(p.name)}"><div class="promo-card-content"><div class="kicker">PROMO ESPECIAL ✷</div><h3>${h(x.title||p.name)}</h3><p>${h(x.description||p.description)}</p><p><strong>${money(x.price)}</strong> <span class="old-price">${money(p.price)}</span></p><button class="btn btn-primary" data-add="${h(p.id)}">La quiero ↗</button></div></article>`}).join(''):`<div class="promo-empty"><div class="promo-emoji">✷</div><div><h3>¡Se vienen cosas ricas!</h3><p>Muy pronto vas a encontrar nuestras promociones por acá. Mientras tanto, explorá todo el catálogo.</p></div></div>`;
}
function renderNews(){const news=(store.news||[]).filter(n=>n.active);const featured=news[0];
 $('#shop-news-spot').innerHTML=featured?`<a href="#novedades" class="shop-news-feature"><div class="shop-news-thumbnail"><img src="${h(img(featured.image))}" alt="${h(featured.title)}"></div><div class="shop-news-copy"><small>✷ NOVEDAD DESTACADA</small><h3>${h(featured.title)}</h3><p>${h(featured.subtitle)}</p><span>Descubrí la novedad ↗</span></div><span class="shop-news-icon">♡</span></a>`:'';
 $('#news-grid').innerHTML=news.length?news.map(n=>`<article class="news-card"><img src="${h(img(n.image))}" alt="${h(n.title)}" loading="lazy"><div class="news-copy"><div class="kicker">${h(n.eyebrow||'NOVEDADES EN DULCES DESAYUNOS Y MERIENDAS')}</div><h3>${h(n.title)}</h3><p>${h(n.subtitle)}</p><a href="#productos" class="btn btn-primary">Descubrir productos ↗</a></div></article>`).join(''):'<div class="empty-state">Pronto vamos a compartir novedades.</div>'}
// Iconos SVG locales y enlaces visibles en la portada, el encabezado y un acceso fijo.
function socialIcon(kind){
 if(kind==='whatsapp')return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.3-4.2A8 8 0 1 1 20 11.7Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.8 7.4c-.3-.3-.8-.3-1.1 0-.7.8-.7 2.1 0 3.4a10 10 0 0 0 5.2 5.2c1.4.5 2.7.2 3.3-.5.3-.4.1-.8-.2-1l-1.6-.8c-.3-.2-.6-.1-.8.2l-.6.7a8.6 8.6 0 0 1-3.6-3.6l.7-.6c.3-.2.4-.5.2-.9Z" fill="currentColor"/></svg>`;
 if(kind==='instagram')return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.1" y="3.1" width="17.8" height="17.8" rx="5" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="17.5" cy="6.7" r="1.25" fill="currentColor"/></svg>`;
 return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M13.9 22v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.5 1.6-1.5h1.7V4.2c-.3-.1-1.4-.2-2.6-.2-2.7 0-4.6 1.7-4.6 4.8v1.8H7v3.2h3V22h3.9Z"/></svg>`;
}
function socialUrl(url){if(/^https:\/\/(?:www\.)?instagram\.com\//i.test(url||''))return url;return 'https://www.instagram.com/'+(url||'').replace(/^@/,'').replace(/[^a-z0-9_.]/gi,'')}
function renderContact(){
 $('#hero-subtitle').textContent=store.settings?.subheadline||initialPublic().settings.subheadline;
 $('#delivery-note').textContent=store.settings?.deliveryNote||'Envíos a Zona Sur · Consultar disponibilidad y costo';
 const phone=(store.settings?.whatsapp||'5491165744539').replace(/\D/g,'');
 const whatsappUrl=`https://wa.me/${phone||'5491165744539'}?text=${encodeURIComponent('¡Hola! Quisiera hacer una consulta a Dulces Desayunos y Meriendas.')}`;
 const link=$('#whatsapp-contact');link.href=whatsappUrl;link.target='_blank';link.rel='noopener noreferrer';
 const socials=[{kind:'whatsapp',name:'WhatsApp',href:whatsappUrl}];
 const instagram=store.settings?.instagram;
 const facebook=store.settings?.facebook;
 if(instagram)socials.push({kind:'instagram',name:'Instagram',href:socialUrl(instagram)});
 if(facebook && /^https:\/\/(?:www\.)?facebook\.com\//i.test(facebook))socials.push({kind:'facebook',name:'Facebook',href:facebook});
 const linkHtml=(s,compact=false)=>`<a class="social-link social-${s.kind}${compact?' social-icon-only':''}" href="${h(s.href)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${s.name} de Dulces Desayunos y Meriendas en una pestaña nueva" title="${s.name}"><span class="social-link-icon">${socialIcon(s.kind)}</span>${compact?'':`<span class="social-link-name">${s.name}</span>`}</a>`;
 // El menú superior se mantiene despejado; los accesos sociales siguen en el dock y contacto.
 
 $('#social-links').innerHTML=socials.map(s=>linkHtml(s)).join('');
 $('#social-dock').innerHTML=`<span class="dock-caption">¡Hablemos!</span>${socials.map(s=>linkHtml(s,true)).join('')}`;
}
function itemCost(item){return Math.max(0,Number(item.unitPrice)||0)+(item.extras||[]).reduce((sum,e)=>sum+(Number(e.price)||0),0)}
function cartSum(){return cart.reduce((sum,item)=>sum+itemCost(item)*item.qty,0)}
function cartNeedsQuote(){return cart.some(item=>(item.extras||[]).some(e=>e.price===null||e.price===undefined))}
function updateCount(){const n=cart.reduce((x,item)=>x+item.qty,0);$('#cart-count').textContent=n;$('#mobile-count').textContent=n}
// Desayuno a medida: solo usa los campos PUBLICADOS; no lee costos privados.
const customId='dulces-custom-breakfast';
const selectedBuilder=new Map();
let builderSearch='', builderGroup='todos', builderVisibleCount=6;
const builderGroups=[['todos','Todos'],['bebidas','Bebidas'],['panificados','Panificados'],['dulces','Dulces'],['salados','Salados'],['otros','Otros']];
// El grupo se elige y guarda desde el administrador; no se deduce del nombre.
function builderGroupOf(item){return builderGroups.some(([id])=>id===item.builderCategory)?item.builderCategory:'otros';}

// Personalizar tiene UNA fuente: materias primas publicadas por el administrador.
// Exclusión defensiva de productos completos de versiones anteriores.
function publishedBuilder(){
 return (store.builderItems||[]).filter(x=>x && x.id && x.name
  && !String(x.id).startsWith('producto:') && !x.productId && x.source!=='product'
  && Number.isFinite(Number(x.price)) && Number(x.price)>=0);
}
const illustrationKeys=new Set(['taza','jugo','medialuna','chocotorta','brownie','alfajor','budin','tartaleta','sandwich','fruta','fiambres','queso','pan','galletitas','mate','yogur','miel','cerveza','lata','bebida','panificados','dulces','salados','otros']);
function builderIllustration(item){
 const category=String(item.builderCategory||'otros').toLowerCase();
 const name=String(item.name||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 // Solamente usamos una ilustración específica cuando el nombre permite identificar el producto.
 const explicit=[
  ['cerveza',/cerveza|corona|quilmes|heineken/],
  ['lata',/sprite|coca.?cola|gaseosa|lata de (?:sprite|coca|pepsi)|pepsi/],
  ['chocotorta',/chocotorta|choco.?torta/],['jugo',/jugo|botella de jugo|exprimido|licuado/],
  ['medialuna',/medialuna|croissant/],['taza',/taza|cafe|infusion/],
  ['brownie',/brownie/],['alfajor',/alfajor/],
  ['tartaleta',/tartaleta|pastafrola|pastafrolla|torta de ricota/],
  ['budin',/budin|muffin|bizcochuelo/],['sandwich',/sandwich|sanguche|sanguch/],
  ['fruta',/fruta|ensalada de frutas/],['fiambres',/fiambre|salame|jamon|picada/],
  ['queso',/queso/],['pan',/\bpan\b|tostada|grisines/],
  ['galletitas',/gallet|masita|cookie/],['mate',/mate|yerba/],
  ['yogur',/yogur/],['miel',/miel|mermelada|dulce de leche/]
 ];
 const matched=explicit.find(([,expression])=>expression.test(name));
 if(matched)return matched[0];
 // Si no sabemos qué producto es, mostramos la categoría y NO un regalo inventado.
 const categoryIcons={bebidas:'bebida',panificados:'panificados',dulces:'dulces',salados:'salados',otros:'otros'};
 return categoryIcons[category]||'otros';
}
function builderImage(i){return `assets/illustrations/${builderIllustration(i)}.svg`}
// Los límites se publican sin exponer los costos internos.
function limitFor(item){
 const stock=Number(item.stockQuantity),max=Number(item.maxPerTray);
 return {stock:Number.isSafeInteger(stock)&&stock>=0?stock:0,max:Number.isSafeInteger(max)&&max>0?max:0};
}
function usedInCart(id){return cart.reduce((total,line)=>total+(line.components||[]).filter(c=>String(c.id)===String(id)).reduce((sum,c)=>sum+(Number(c.quantity)||0)*Math.max(1,Number(line.qty)||1),0),0)}
function builderAvailability(i){const {stock,max}=limitFor(i);const used=usedInCart(i.id);return {stock,max,used,left:Math.max(0,stock-used),enabled:i.inStock===true&&stock>0&&max>0}}
function cartStockIssue(items=publishedBuilder()){
 for(const line of cart){if(line.id!==customId)continue;for(const c of line.components||[]){const item=items.find(i=>String(i.id)===String(c.id));if(!item||!item.inStock)return `«${c.name}» ya no está disponible.`;
 const max=limitFor(item).max;if((Number(c.quantity)||0)>max)return `La capacidad máxima de ${c.name} en una bandeja es ${max}.`;}}
 for(const item of items){const used=usedInCart(item.id);const {stock}=limitFor(item);if(used>stock)return `Solo quedan ${stock} unidades de ${item.name} disponibles para tus desayunos.`;}
 return '';
}
function builderChoiceHTML(i){
 const selected=selectedBuilder.get(i.id)||0,{stock,max,left,enabled}=builderAvailability(i);
 const canAdd=enabled&&selected<max&&selected<left;
 const stockHint=enabled?`<span class="builder-availability">${left} ${left===1?'unidad disponible':'unidades disponibles'} · Máx. ${max} por bandeja</span>`:'';
 return `<div class="builder-item ${enabled?'':'not-available'} ${selected?'is-selected':''}">
 <img class="builder-item-thumb" src="${builderImage(i)}" alt="" loading="lazy">
 <div class="builder-item-info"><span class="builder-stock ${enabled?'':'out'}">${enabled?'● Disponible':'○ Agotado'}</span><strong>${h(i.name)}</strong><small>${h(i.unit||'unidad')}</small><b>${money(i.price)} <span>/ ${h(i.unit||'unidad')}</span></b>${stockHint}</div>
 <div class="builder-stepper"><button type="button" class="builder-decrease" data-builder-step="${h(i.id)}" data-delta="-1" ${!enabled||!selected?'disabled':''} aria-label="Quitar ${h(i.name)}">−</button><output aria-label="Cantidad de ${h(i.name)}">${selected}</output><button type="button" class="builder-increase ${canAdd?'':'at-limit'}" data-builder-step="${h(i.id)}" data-delta="1" aria-disabled="${!canAdd}" aria-label="Agregar ${h(i.name)}"><span aria-hidden="true">＋</span><span>${selected?'Sumar':'Agregar'}</span></button></div></div>`;
}
function renderBuilder(){
 const items=publishedBuilder(),grid=$('#builder-products');if(!grid)return;
 const controls=$('#builder-controls');
 if(controls){
  const available=items.filter(x=>x.inStock).length;
  controls.querySelector('#builder-available-count').textContent=`${available} opciones disponibles`;
  controls.querySelectorAll('[data-builder-group]').forEach(el=>{
   const active=el.dataset.builderGroup===builderGroup;
   el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));
  });
 }
 const normalized=(s)=>String(s||'').toLocaleLowerCase('es-AR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const sorted=[...items].sort((a,b)=>Number(b.inStock===true)-Number(a.inStock===true)||String(a.name).localeCompare(String(b.name),'es-AR'));
 const results=sorted.filter(i=>i.inStock===true&&(builderGroup==='todos'||builderGroupOf(i)===builderGroup)&&normalized(i.name).includes(normalized(builderSearch)));
 grid.innerHTML=results.length?results.slice(0,builderVisibleCount).map(builderChoiceHTML).join(''):'<div class="builder-empty"><strong>No encontramos componentes con esos filtros.</strong><p>Probá con otra categoría o cambiá la búsqueda.</p><button class="builder-reset" type="button" id="builder-reset-filters">Ver todos los disponibles</button></div>';
 const match=$('#builder-match-count');if(match)match.textContent=`Mostrando ${Math.min(results.length,builderVisibleCount)} de ${results.length} componentes`;
 const more=$('#builder-more');if(more){more.hidden=results.length<=builderVisibleCount;more.textContent=`Ver más componentes (${results.length-builderVisibleCount}) ↓`;}
 const chosen=items.filter(i=>builderAvailability(i).enabled&&(selectedBuilder.get(i.id)||0)>0);
 const total=chosen.reduce((n,i)=>n+Number(i.price)*selectedBuilder.get(i.id),0);
 $('#builder-selections').innerHTML=chosen.length?chosen.map(i=>`<div><span>${h(i.name)} × ${selectedBuilder.get(i.id)}</span><strong>${money(Number(i.price)*selectedBuilder.get(i.id))}</strong></div>`).join(''):'<p class="builder-placeholder">Tu bandeja está esperando sus primeros ingredientes. ♡</p>';
 $('#builder-total-price').textContent=money(total);$('#builder-add').disabled=!chosen.length||total<=0;
}

function resetBuilderFilters(){builderSearch='';builderGroup='todos';builderVisibleCount=6;const inp=$('#builder-search');if(inp)inp.value='';renderBuilder();}
function addBuilderBreakfast(){
 const items=publishedBuilder().filter(i=>builderAvailability(i).enabled && (selectedBuilder.get(i.id)||0)>0);
 if(!items.length)return toast('Elegí al menos un componente disponible.');
 for(const i of items){const q=selectedBuilder.get(i.id)||0;const {max,left}=builderAvailability(i);if(q>max)return toast(`La capacidad máxima de ${i.name} en un desayuno es ${max}.`);if(q>left)return toast(`Solo quedan ${left} unidades de ${i.name} disponibles.`);}
 const issue=cartStockIssue();if(issue)return toast(issue);
 const components=items.map(i=>({id:i.id,name:i.name,unit:i.unit,quantity:selectedBuilder.get(i.id),unitPrice:Number(i.price),lineTotal:Number(i.price)*selectedBuilder.get(i.id)}));
 const total=components.reduce((n,i)=>n+i.lineTotal,0);if(total<=0)return toast('La bandeja debe tener un precio de venta.');
 const key=JSON.stringify({type:'custom',components});const existing=cart.find(x=>x.key===key);
 if(existing){for(const i of items){const current=usedInCart(i.id),add=selectedBuilder.get(i.id)||0;if(current+add>limitFor(i).stock)return toast(`No hay stock suficiente de ${i.name} para otra bandeja.`);}existing.qty+=1;}else cart.push({key,id:customId,name:'Desayuno personalizado',qty:1,unitPrice:total,components,extras:[]});
 selectedBuilder.clear();syncCart();renderBuilder();toast('Tu desayuno personalizado está en el pedido ♡');drawer(true);
}
function syncCart(){checkoutOrderId=null;orderAlreadySaved=false;setCart(cart);renderCart();updateCount()}
function add(pId,{extras=[],message=''}={}){const p=pById(pId);if(!p)return;const price=Number(productPrice(p,store))||0;const details=JSON.stringify({pId,price,extras,message});let line=cart.find(i=>i.key===details);if(line)line.qty++;else cart.push({key:details,id:pId,unitPrice:price,qty:1,extras,message});syncCart();toast(`${p.name} se agregó a tu pedido ♡`)}
function cartItemsHTML(){return cart.map((item,i)=>{const p=pById(item.id);return `<div class="cart-row"><img src="${h(img(p?.image|| (item.id===customId?"assets/illustrations/regalo.svg":null)))}" alt=""><div class="cart-details"><h4>${h(p?.name||item.name||'Producto')}</h4>${item.components?.length?`<small>${h(item.components.map(c=>`${c.name} × ${c.quantity}`).join(' · '))}</small>`:''}${item.extras?.length?`<small>${h(item.extras.map(e=>e.name).join(' · '))}</small>`:''}${item.message?`<small> · Dedicatoria: ${h(item.message)}</small>`:''}<strong>${money(itemCost(item)*item.qty)}${(item.extras||[]).some(e=>e.price==null)?' + extras a cotizar':''}</strong><div class="qty-controls"><button data-qty="${i}" data-delta="-1" aria-label="Quitar una unidad">−</button><span>${item.qty}</span><button data-qty="${i}" data-delta="1" aria-label="Agregar una unidad">+</button><button class="text-link" data-remove="${i}">Eliminar</button></div></div></div>`}).join('')}
function renderCart(){
 $('#cart-items').innerHTML=cart.length?cartItemsHTML():`<div class="cart-empty"><span>♡</span><h3>Tu pedido te está esperando</h3><p>Agregá algo rico y empezamos.</p><button class="btn btn-primary" id="explore-cart">Ver productos</button></div>`;
 $('#cart-summary').innerHTML=cart.length?`<div class="total-line"><span>Subtotal <small>(sin envío)</small></span><strong>${money(cartSum())}</strong></div>${cartNeedsQuote()?'<p class="small-muted">Hay extras a cotizar. El total definitivo se confirma por WhatsApp.</p>':''}`:'';
 $('#start-checkout').disabled=!cart.length;
}
function drawer(open){$('#cart-drawer').classList.toggle('open',open);$('#cart-drawer').setAttribute('aria-hidden',String(!open));$('#overlay').classList.toggle('hidden',!open);document.body.classList.toggle('locked',open)}
function closeModal(){const el=$('#modal-root');el.innerHTML='';document.body.classList.remove('locked');clearTimeout(newsTimer);modalCloser=null}
function modal(html,opts={}){drawer(false);$('#modal-root').innerHTML=`<div class="modal-wrap" id="modal-overlay"><div class="modal-card ${opts.large?'large':''}" role="dialog" aria-modal="true" aria-label="${h(opts.label||'Detalle')}">${html}</div></div>`;document.body.classList.add('locked');$('#modal-overlay').addEventListener('click',e=>{if(e.target.id==='modal-overlay')closeModal()});$$('[data-close]').forEach(el=>el.addEventListener('click',closeModal));$('#modal-root [data-modal-back]')?.addEventListener('click',opts.onBack||closeModal);modalCloser=opts.onBack||closeModal;}
const head=(label,title)=>`<div class="modal-top"><div class="modal-heading-actions"><button class="modal-back" type="button" data-modal-back aria-label="Volver al paso anterior"><span aria-hidden="true">←</span> Volver</button><div><small>${h(label)}</small><h2>${h(title)}</h2></div></div><button class="icon-button" data-close aria-label="Cerrar">✕</button></div>`;
function details(id){const p=pById(id);if(!p)return;modal(`${head('HECHO CON CARIÑO ✷',p.name)}<div class="modal-body"><img src="${h(img(p.image))}" style="height:245px;object-fit:cover;width:100%;border-radius:17px" alt="${h(p.name)}"><p style="line-height:1.8;color:#827876;font-size:13px">${h(p.description)}</p>${p.contents?.length?`<div class="product-contents"><strong>¿Qué incluye?</strong><ul>${p.contents.map(c=>`<li>${h(c)}</li>`).join('')}</ul></div>`:''}<p class="small-muted">La foto ilustra la presentación. Consultá el contenido exacto al confirmar el pedido.</p><div class="total-line"><span>Precio del producto</span><strong>${money(productPrice(p,store))}</strong></div></div><div class="modal-foot"><button class="btn btn-primary btn-full" data-modal-add="${h(p.id)}">Agregar a mi pedido ♡</button></div>`)}
// Paso 1. Datos de entrega, dedicatoria y observaciones opcionales.
async function beginCheckout(){
 if(!cart.length)return;
 if(isCloud()){try{store=await loadPublic();renderBuilder()}catch(e){return toast('No pudimos comprobar el stock actual. Revisá tu conexión y volvé a intentar.')}}
 const issue=cartStockIssue();if(issue)return toast(issue);
 const zones=(store.shipping||[]).filter(z=>z.enabled!==false);
 modal(`${head('UN PASITO MÁS ♡','Datos para tu pedido')}
 <form id="checkout-form"><div class="modal-body">
  <p class="checkout-intro">Completá los datos de entrega y, si querés, sumá una dedicatoria especial.</p>
  <div class="form-row">
   <label class="form-field"><span>Nombre completo *</span><input name="name" required maxlength="100" autocomplete="name" placeholder="Tu nombre y apellido"></label>
   <label class="form-field"><span>Tu número de WhatsApp *</span><input name="phone" required inputmode="tel" maxlength="35" placeholder="Ej.: 11 1234 5678"></label>
  </div>
  <label class="form-field"><span>Dirección de entrega *</span><input name="address" required maxlength="180" autocomplete="street-address" placeholder="Calle, número, piso / departamento"></label>
  <label class="form-field"><span>Localidad *</span><select name="locality" id="checkout-locality" required><option value="">Seleccioná tu localidad…</option>${zones.map(z=>`<option value="${h(z.name)}">${h(z.name)}</option>`).join('')}</select></label>
  <div id="shipping-preview" class="price-note" aria-live="polite">Seleccioná una localidad para ver el costo del envío.</div>
  <div class="gift-options"><div class="gift-options-heading"><span class="gift-heart" aria-hidden="true">♡</span><div><strong>Hacé tu regalo más especial</strong><small>Opcional · preparado con cariño</small></div></div>
   <label class="form-field" for="checkout-dedication"><span>Dedicatoria para imprimir (opcional)</span><textarea id="checkout-dedication" name="dedication" maxlength="600" rows="4" placeholder="Escribí acá el mensaje que querés que imprimamos…"></textarea></label>
   <div class="dedication-help"><span>La imprimimos tal como la escribas.</span><span id="dedication-count">0 / 600</span></div>
   <label class="form-field dedication-observations" for="checkout-dedication-notes"><span>Observaciones de la dedicatoria (opcional)</span><textarea id="checkout-dedication-notes" name="dedicationNotes" maxlength="450" rows="3" placeholder="¿Tenés alguna preferencia especial? Colores, tipo de letra, diseño de la tarjeta…"></textarea><small>Contanos cómo querés que preparemos la tarjeta.</small></label>
  </div>
  <div class="total-line"><span>Productos <small>${cart.reduce((x,i)=>x+i.qty,0)} unidad/es</small></span><strong>${money(cartSum())}</strong></div>
  <p class="small-muted">El importe final y la disponibilidad se confirman por WhatsApp.</p>
 </div><div class="modal-foot step-actions"><button class="btn btn-soft" type="button" id="checkout-back">← Volver al carrito</button><button class="btn btn-primary" type="submit">Revisar pedido →</button></div></form>`,{large:true,label:'Datos para tu pedido',onBack:()=>{closeModal();drawer(true)}});
 const form=$('#checkout-form');
 // Los valores se preservan al volver desde el resumen, sin perder la dedicatoria.
 for(const key of ['name','phone','address','locality','dedication','dedicationNotes']){
  if(checkoutDraft[key]!==undefined && form.elements.namedItem(key))form.elements.namedItem(key).value=checkoutDraft[key];
 }
 function previewShipping(){
  const z=zones.find(x=>x.name===$('#checkout-locality').value);
  $('#shipping-preview').textContent=z?(z.price==null?`Envío a ${z.name}: a confirmar.`:z.price===0?`Envío a ${z.name}: GRATIS · Total estimado: ${money(cartSum())}`:`Envío a ${z.name}: ${money(z.price)} · Total estimado: ${money(cartSum()+Number(z.price))}`):'Seleccioná una localidad para ver el costo del envío.';
 }
 const saveDraft=()=>{const fields=new FormData(form);const before=JSON.stringify(checkoutDraft);for(const key of ['name','phone','address','locality','dedication','dedicationNotes'])checkoutDraft[key]=String(fields.get(key)||'');if(before!==JSON.stringify(checkoutDraft)){checkoutOrderId=null;orderAlreadySaved=false;}};
 form.addEventListener('input',()=>{saveDraft();$('#dedication-count').textContent=`${$('#checkout-dedication').value.length} / 600`});
 form.addEventListener('change',saveDraft);
 $('#checkout-locality').addEventListener('change',previewShipping);
 $('#checkout-back').addEventListener('click',()=>{saveDraft();closeModal();drawer(true)});
 form.addEventListener('submit',e=>{e.preventDefault();saveDraft();if(!zones.some(z=>z.name===checkoutDraft.locality)){toast('Seleccioná una localidad válida.');return;}reviewOrder()});
 previewShipping();$('#dedication-count').textContent=`${(checkoutDraft.dedication||'').length} / 600`;
}
// Paso 2. Mensaje a WhatsApp. Todos los campos de la dedicatoria se muestran,
// incluso si se dejaron vacíos, para que el negocio sepa que no faltan datos.
function buildOrderMessage(){
 const o=checkoutDraft;
 const z=(store.shipping||[]).find(x=>x.name===o.locality);
 if(!z)throw new Error('Localidad inválida');
 const lines=cart.map(it=>{
  const p=pById(it.id);
  return `• ${p?.name||it.name||'Producto'} — ${it.qty} ${it.qty===1?'unidad':'unidades'} — ${money(itemCost(it)*it.qty)}${it.components?.length?`\n  Incluye: ${it.components.map(c=>`${c.name} × ${c.quantity}`).join(', ')}`:''}${it.extras?.length?`\n  Extras: ${it.extras.map(x=>x.name+(x.price==null?' (a cotizar)':'')).join(', ')}`:''}${it.message?`\n  Dedicatoria del producto: ${it.message}`:''}`;
 }).join('\n');
 const dedication=(o.dedication||'').trim();
 const notes=(o.dedicationNotes||'').trim();

 return `¡Hola! Quisiera realizar el siguiente pedido en *Dulces Desayunos y Meriendas*:\n\n*PRODUCTOS*\n${lines}\n\n*RESUMEN DE IMPORTES*\nSubtotal: ${money(cartSum())}\nEnvío: ${z.price==null?'A confirmar':z.price===0?'Sin cargo':money(z.price)}\n${z.price!=null?`Total estimado: ${money(cartSum()+Number(z.price))}\n`:''}${cartNeedsQuote()?'Algunos adicionales requieren cotización.\n':''}\n*DATOS PARA LA ENTREGA*\nNombre: ${o.name}\nWhatsApp: ${o.phone}\nDirección: ${o.address}\nLocalidad: ${o.locality}\n\n*DEDICATORIA PARA IMPRIMIR*\n${dedication||'No se solicitó dedicatoria.'}\n\n*OBSERVACIONES DE LA DEDICATORIA*\n${notes||'Sin observaciones especiales.'}\n\nMuchas gracias. Quedo a la espera de la confirmación del pedido.`;
}
function reviewOrder(){
 const message=buildOrderMessage();
 const phone=(store.settings?.whatsapp||'5491165744539').replace(/\D/g,'');
 const giftPreview=`<div class="gift-review"><div><strong>♡ Dedicatoria para imprimir</strong><p>${h((checkoutDraft.dedication||'').trim()||'No se solicitó dedicatoria.')}</p></div><div><strong>✎ Observaciones de la dedicatoria</strong><p>${h((checkoutDraft.dedicationNotes||'').trim()||'Sin observaciones especiales.')}</p></div></div>`;
 modal(`${head('ÚLTIMO PASO ♡','Revisá tu pedido')}
 <div class="modal-body"><div class="coordination-notice" role="note"><span class="coordination-icon" aria-hidden="true">ⓘ</span><div><strong>Coordinación y confirmación del pedido</strong><p>La fecha, el horario de entrega, el medio de pago y cualquier observación se acordarán directamente por WhatsApp con las personas responsables de Dulces Desayunos y Meriendas. <b>Todos los pedidos están sujetos a disponibilidad y confirmación.</b></p></div></div>
 <p class="confirm-message-intro">Revisá tu dedicatoria y las observaciones antes de compartir el pedido:</p>${giftPreview}
 <label class="form-field"><span>Resumen completo de tu pedido</span><textarea id="order-message" class="order-message" readonly></textarea></label>
 <p class="confirm-help">El pedido solo queda confirmado cuando el negocio te responde por WhatsApp.</p><div id="order-save-warning" class="order-save-warning" role="alert" hidden></div><button type="button" id="send-unregistered" class="btn btn-soft" hidden>Enviar por WhatsApp sin registrar</button></div>
 <div class="modal-foot step-actions"><button class="btn btn-soft" id="review-back">← Modificar datos</button><button class="btn btn-primary" id="share-order">Compartir pedido ↗</button></div>`,{large:true,label:'Revisar pedido',onBack:beginCheckout});
 // Con .value no se interpreta el mensaje como HTML, ni se pierde la dedicatoria.
 $('#order-message').value=message;
 $('#review-back').addEventListener('click',beginCheckout);
 $('#share-order').addEventListener('click',async()=>{
  const btn=$('#share-order'),info=$('#order-save-warning');
  if(btn.disabled)return;
  btn.disabled=true;btn.textContent='Preparando el pedido…';
  // Verificación adicional justo antes de registrar la solicitud.
  // El stock continúa siendo manual y puede cambiar entre visitas.
  if(isCloud()){
   try{store=await loadPublic()}catch(e){btn.disabled=false;btn.textContent='Compartir pedido ↗';return toast('No pudimos comprobar el stock actual. Intentá nuevamente.');}
  }
  const stockIssue=cartStockIssue();
  if(stockIssue){btn.disabled=false;btn.textContent='Compartir pedido ↗';return toast(stockIssue+' Modificá tu pedido para continuar.');}
  const id=checkoutOrderId ||= slug();
  const zone=(store.shipping||[]).find(x=>x.name===checkoutDraft.locality);
  const subtotal=cartSum(),shipping=zone?.price==null?null:Number(zone.price);
  const request={
   id,customer_name:checkoutDraft.name.trim(),customer_phone:checkoutDraft.phone.trim(),
   delivery_address:checkoutDraft.address.trim(),locality:checkoutDraft.locality,
   items:cart.map(it=>({productId:it.id,name:pById(it.id)?.name||it.name||'Producto',quantity:it.qty,unitPrice:itemCost(it),lineTotal:itemCost(it)*it.qty,components:it.components||[]})),
   subtotal,shipping,total:shipping==null?null:subtotal+shipping,
   dedication:checkoutDraft.dedication||'',dedication_notes:checkoutDraft.dedicationNotes||'',source:'web',payment_status:'pendiente'
  };
  try{
   if(!orderAlreadySaved){await createCustomerOrder(request);orderAlreadySaved=true;}
   // El pedido se guarda como solicitud previa al WhatsApp. Esto NO confirma que el mensaje fue enviado.
   window.location.assign(`https://wa.me/${phone}?text=${encodeURIComponent($('#order-message').value)}`);
  }catch(e){
   console.error('No se pudo registrar el pedido:',e);
   info.hidden=false;
   info.innerHTML='<strong>No pudimos registrar este pedido en el administrador.</strong> Podés reintentar o enviarlo de todos modos por WhatsApp (en ese caso no aparecerá automáticamente en «Pedidos»).';
   $('#send-unregistered').hidden=false;
  }finally{btn.disabled=false;btn.textContent='Compartir pedido ↗';}
 });
 $('#send-unregistered').addEventListener('click',()=>window.location.assign(`https://wa.me/${phone}?text=${encodeURIComponent($('#order-message').value)}`));
}
function finishNews(){closeModal();$('#productos').scrollIntoView({behavior:'smooth'});}
function showNews(){if(document.body.classList.contains('locked')||sessionStorage.getItem('dulce_news_seen'))return;const n=(store.news||[]).find(x=>x.active);if(!n)return;const d=Math.max(10,Math.min(20,Number(n.duration)||15));sessionStorage.setItem('dulce_news_seen','yes');
 $('#modal-root').innerHTML=`<div class="modal-wrap" id="modal-overlay"><div class="feature-news" role="dialog" aria-modal="true" aria-label="Novedad de Dulces"><button class="news-back" id="news-back" type="button">← Volver</button><button class="icon-button" data-close aria-label="Cerrar novedad">✕</button><img src="${h(img(n.image))}" alt="${h(n.title)}"><div class="feature-news-content"><small>${h(n.eyebrow||'NOVEDAD DULCE ✷')}</small><h2>${h(n.title)}</h2><p>${h(n.subtitle)}</p><div class="news-progress"><span style="animation-duration:${d}s"></span></div><button class="btn btn-primary" id="news-explore">Ver productos ↗</button><p class="small-muted">Esta ventana se cierra sola en ${d} segundos.</p></div></div></div>`;document.body.classList.add('locked');$$('[data-close]').forEach(b=>b.addEventListener('click',finishNews));$('#news-back').addEventListener('click',finishNews);$('#modal-overlay').addEventListener('click',e=>{if(e.target.id==='modal-overlay')finishNews()});$('#news-explore').addEventListener('click',finishNews);newsTimer=setTimeout(finishNews,d*1000);
}
function setupScrollReveals(){
 if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const targets=[...document.querySelectorAll('.category-section,.products-section,.news-section,.contact-section,#promociones,.category-card')];
 targets.forEach((el,i)=>{el.classList.add('reveal-on-scroll');el.style.setProperty('--reveal-delay',`${Math.min(i%3,2)*75}ms`)});
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target)}}},{threshold:0.09,rootMargin:'0px 0px -30px 0px'});
 targets.forEach(el=>observer.observe(el));
}
function setup(){
 $('#open-cart').addEventListener('click',()=>drawer(true));$('#mobile-cart').addEventListener('click',()=>drawer(true));$('#close-cart').addEventListener('click',()=>drawer(false));$('#cart-back').addEventListener('click',()=>drawer(false));$('#overlay').addEventListener('click',()=>drawer(false));
 $('#start-checkout').addEventListener('click',beginCheckout);
 $('#builder-products').addEventListener('click',e=>{const b=e.target.closest('[data-builder-step]');if(!b||b.disabled)return;const item=publishedBuilder().find(i=>i.id===b.dataset.builderStep);if(!item)return;const {enabled,max,left}=builderAvailability(item);if(!enabled)return toast(`${item.name} no está disponible.`);const selected=selectedBuilder.get(item.id)||0,delta=Number(b.dataset.delta||0);if(delta>0&&selected>=max)return toast(`La capacidad máxima de ${item.name} en un desayuno es ${max}.`);if(delta>0&&selected>=left)return toast(`Solo quedan ${left} unidades de ${item.name} disponibles.`);const next=Math.max(0,Math.min(max,left,selected+delta));if(next)selectedBuilder.set(item.id,next);else selectedBuilder.delete(item.id);renderBuilder()});
 const bControls=$('#builder-controls');
 bControls.addEventListener('click',e=>{
  const tab=e.target.closest('[data-builder-group]');if(tab){builderGroup=tab.dataset.builderGroup;builderVisibleCount=6;renderBuilder();}
  if(e.target.closest('#builder-reset-filters'))resetBuilderFilters();
 });
 bControls.querySelector('#builder-search').addEventListener('input',e=>{builderSearch=e.target.value;builderVisibleCount=6;renderBuilder()});
 $('#builder-products').addEventListener('click',e=>{if(e.target.closest('#builder-reset-filters'))resetBuilderFilters()});
 $('#builder-more').addEventListener('click',()=>{builderVisibleCount+=6;renderBuilder()});
 $('#builder-add').addEventListener('click',addBuilderBreakfast);
 $$('[data-filter-jump]').forEach(el=>el.addEventListener('click',()=>setFilter(el.dataset.filterJump,true)));
 $$('[data-filter]').forEach(el=>el.addEventListener('click',()=>setFilter(el.dataset.filter)));
 $('#product-grid').addEventListener('click',e=>{const target=e.target.closest('[data-add],[data-detail],[data-show-all]');if(!target)return;if(target.dataset.add)add(target.dataset.add);else if(target.dataset.detail)details(target.dataset.detail);else if(target.hasAttribute('data-show-all'))setFilter('todos')});
 $('#promos-grid').addEventListener('click',e=>{const t=e.target.closest('[data-add]');if(t)add(t.dataset.add)});
 $('#cart-items').addEventListener('click',e=>{const t=e.target.closest('[data-remove],[data-qty],#explore-cart');if(!t)return;if(t.id==='explore-cart'){drawer(false);$('#productos').scrollIntoView({behavior:'smooth'});return}const i=Number(t.dataset.remove ?? t.dataset.qty);if(t.hasAttribute('data-remove'))cart.splice(i,1);else {const delta=Number(t.dataset.delta);if(delta>0&&cart[i].id===customId){for(const c of cart[i].components||[]){const item=publishedBuilder().find(x=>String(x.id)===String(c.id));if(!item||!item.inStock)return toast(`${c.name} ya no está disponible.`);if(usedInCart(c.id)+Number(c.quantity)>limitFor(item).stock)return toast(`Solo quedan ${Math.max(0,limitFor(item).stock-usedInCart(c.id))} unidades disponibles de ${c.name}.`);}}cart[i].qty+=delta;if(cart[i].qty<=0)cart.splice(i,1)}syncCart();renderBuilder()});
 $('#modal-root').addEventListener('click',e=>{const addT=e.target.closest('[data-modal-add]');if(addT){add(addT.dataset.modalAdd);closeModal();drawer(true)}});
 window.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#modal-root').children.length){(modalCloser||closeModal)();}else drawer(false)}});
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('.mobile-nav a').forEach(n=>n.classList.toggle('active',n.getAttribute('href')===a.getAttribute('href')))}));
}
(async()=>{setup();setupScrollReveals();try{store=await loadPublic()}catch(e){console.warn('No se pudo cargar el catálogo remoto:',e);store=initialPublic();toast('Estamos mostrando el catálogo de referencia. Algunas novedades pueden no estar actualizadas.')}renderProducts();renderPromos();renderNews();renderContact();renderBuilder();syncCart();setTimeout(showNews,1200)})();
