import {formatMoney as money,escapeHtml as h,loadPublic,initialPublic,isCloud,getCart,setCart,productPrice,promoFor,slug} from './data.js';
let store=initialPublic(), filter='todos', cart=getCart(), modalCloser=null, newsTimer=null;
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
  return `<article class="product-card"><div class="product-picture"><img loading="lazy" src="${h(img(p.image))}" alt="${h(p.name)} de Dulce"><span class="product-badge">${h(promo?'Promo especial':p.badge||'Hecho con amor')}</span><button class="picture-heart" title="Ver producto" data-detail="${h(p.id)}" aria-label="Ver detalle de ${h(p.name)}">♡</button></div><div class="product-content"><span class="product-category">${p.category==='picadas'?'Para compartir':filter==='meriendas'?'Meriendas':'Desayunos'}</span><h3>${h(p.name)}</h3><p class="product-description">${h(p.description)}</p><div class="price-row"><strong>${money(price)}</strong>${promo?`<span class="old-price">${money(p.price)}</span>`:''}</div><div class="product-actions"><button class="small-button primary" data-add="${h(p.id)}">+ Agregar al pedido</button><button class="small-button secondary" data-detail="${h(p.id)}">Ver detalle ↗</button></div></div></article>`
 }).join(''):'<div class="empty-state">Todavía no hay productos en esta categoría. Podés ver todo el catálogo o consultar por WhatsApp.<br><br><button class="btn btn-primary" data-show-all>Ver todos los productos</button></div>';
}
function renderPromos(){const promotions=(store.promos||[]).filter(x=>x.active && pById(x.productId)?.active!==false && pById(x.productId));
 $('#promos-grid').innerHTML=promotions.length?promotions.map(x=>{const p=pById(x.productId);return `<article class="promo-card"><img src="${h(img(p.image))}" alt="${h(p.name)}"><div class="promo-card-content"><div class="kicker">PROMO ESPECIAL ✷</div><h3>${h(x.title||p.name)}</h3><p>${h(x.description||p.description)}</p><p><strong>${money(x.price)}</strong> <span class="old-price">${money(p.price)}</span></p><button class="btn btn-primary" data-add="${h(p.id)}">La quiero ↗</button></div></article>`}).join(''):`<div class="promo-empty"><div class="promo-emoji">✷</div><div><h3>¡Se vienen cosas ricas!</h3><p>Muy pronto vas a encontrar nuestras promociones por acá. Mientras tanto, explorá todo el catálogo.</p></div></div>`;
}
function renderNews(){const news=(store.news||[]).filter(n=>n.active);const featured=news[0];
 $('#shop-news-spot').innerHTML=featured?`<a href="#novedades" class="shop-news-feature"><div class="shop-news-thumbnail"><img src="${h(img(featured.image))}" alt="${h(featured.title)}"></div><div class="shop-news-copy"><small>✷ NOVEDAD DESTACADA</small><h3>${h(featured.title)}</h3><p>${h(featured.subtitle)}</p><span>Descubrí la novedad ↗</span></div><span class="shop-news-icon">♡</span></a>`:'';
 $('#news-grid').innerHTML=news.length?news.map(n=>`<article class="news-card"><img src="${h(img(n.image))}" alt="${h(n.title)}" loading="lazy"><div class="news-copy"><div class="kicker">${h(n.eyebrow||'NOVEDADES EN DULCE DESAYUNOS Y MERIENDAS')}</div><h3>${h(n.title)}</h3><p>${h(n.subtitle)}</p><a href="#productos" class="btn btn-primary">Descubrir productos ↗</a></div></article>`).join(''):'<div class="empty-state">Pronto vamos a compartir novedades.</div>'}
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
 const whatsappUrl=`https://wa.me/${phone||'5491165744539'}?text=${encodeURIComponent('¡Hola! Quisiera hacer una consulta a Dulce Desayunos y Meriendas.')}`;
 const link=$('#whatsapp-contact');link.href=whatsappUrl;link.target='_blank';link.rel='noopener noreferrer';
 const socials=[{kind:'whatsapp',name:'WhatsApp',href:whatsappUrl}];
 const instagram=store.settings?.instagram;
 const facebook=store.settings?.facebook;
 if(instagram)socials.push({kind:'instagram',name:'Instagram',href:socialUrl(instagram)});
 if(facebook && /^https:\/\/(?:www\.)?facebook\.com\//i.test(facebook))socials.push({kind:'facebook',name:'Facebook',href:facebook});
 const linkHtml=(s,compact=false)=>`<a class="social-link social-${s.kind}${compact?' social-icon-only':''}" href="${h(s.href)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${s.name} de Dulce Desayunos y Meriendas en una pestaña nueva" title="${s.name}"><span class="social-link-icon">${socialIcon(s.kind)}</span>${compact?'':`<span class="social-link-name">${s.name}</span>`}</a>`;
 $('#header-socials').innerHTML=socials.map(s=>linkHtml(s,true)).join('');
 $('#hero-socials').innerHTML=`<span class="hero-social-label">Seguinos y encontranos en</span><div class="hero-social-links">${socials.map(s=>linkHtml(s)).join('')}</div>`;
 $('#social-links').innerHTML=socials.map(s=>linkHtml(s)).join('');
 $('#social-dock').innerHTML=`<span class="dock-caption">¡Hablemos!</span>${socials.map(s=>linkHtml(s,true)).join('')}`;
}
function itemCost(item){return Math.max(0,Number(item.unitPrice)||0)+(item.extras||[]).reduce((sum,e)=>sum+(Number(e.price)||0),0)}
function cartSum(){return cart.reduce((sum,item)=>sum+itemCost(item)*item.qty,0)}
function cartNeedsQuote(){return cart.some(item=>(item.extras||[]).some(e=>e.price===null||e.price===undefined))}
function updateCount(){const n=cart.reduce((x,item)=>x+item.qty,0);$('#cart-count').textContent=n;$('#mobile-count').textContent=n}
function syncCart(){setCart(cart);renderCart();updateCount()}
function add(pId,{extras=[],message=''}={}){const p=pById(pId);if(!p)return;const price=Number(productPrice(p,store))||0;const details=JSON.stringify({pId,price,extras,message});let line=cart.find(i=>i.key===details);if(line)line.qty++;else cart.push({key:details,id:pId,unitPrice:price,qty:1,extras,message});syncCart();toast(`${p.name} se agregó a tu pedido ♡`)}
function cartItemsHTML(){return cart.map((item,i)=>{const p=pById(item.id);return `<div class="cart-row"><img src="${h(img(p?.image))}" alt=""><div class="cart-details"><h4>${h(p?.name||'Producto')}</h4>${item.extras?.length?`<small>${h(item.extras.map(e=>e.name).join(' · '))}</small>`:''}${item.message?`<small> · Dedicatoria: ${h(item.message)}</small>`:''}<strong>${money(itemCost(item)*item.qty)}${(item.extras||[]).some(e=>e.price==null)?' + extras a cotizar':''}</strong><div class="qty-controls"><button data-qty="${i}" data-delta="-1" aria-label="Quitar una unidad">−</button><span>${item.qty}</span><button data-qty="${i}" data-delta="1" aria-label="Agregar una unidad">+</button><button class="text-link" data-remove="${i}">Eliminar</button></div></div></div>`}).join('')}
function renderCart(){
 $('#cart-items').innerHTML=cart.length?cartItemsHTML():`<div class="cart-empty"><span>♡</span><h3>Tu pedido te está esperando</h3><p>Agregá algo rico y empezamos.</p><button class="btn btn-primary" id="explore-cart">Ver productos</button></div>`;
 $('#cart-summary').innerHTML=cart.length?`<div class="total-line"><span>Subtotal <small>(sin envío)</small></span><strong>${money(cartSum())}</strong></div>${cartNeedsQuote()?'<p class="small-muted">Hay extras a cotizar. El total definitivo se confirma por WhatsApp.</p>':''}`:'';
 $('#start-checkout').disabled=!cart.length;
}
function drawer(open){$('#cart-drawer').classList.toggle('open',open);$('#cart-drawer').setAttribute('aria-hidden',String(!open));$('#overlay').classList.toggle('hidden',!open);document.body.classList.toggle('locked',open)}
function closeModal(){const el=$('#modal-root');el.innerHTML='';document.body.classList.remove('locked');clearTimeout(newsTimer);modalCloser=null}
function modal(html,opts={}){drawer(false);$('#modal-root').innerHTML=`<div class="modal-wrap" id="modal-overlay"><div class="modal-card ${opts.large?'large':''}" role="dialog" aria-modal="true" aria-label="${h(opts.label||'Detalle')}">${html}</div></div>`;document.body.classList.add('locked');$('#modal-overlay').addEventListener('click',e=>{if(e.target.id==='modal-overlay')closeModal()});$$('[data-close]').forEach(el=>el.addEventListener('click',closeModal));}
const head=(label,title)=>`<div class="modal-top"><div><small>${h(label)}</small><h2>${h(title)}</h2></div><button class="icon-button" data-close aria-label="Cerrar">✕</button></div>`;
function details(id){const p=pById(id);if(!p)return;modal(`${head('HECHO CON CARIÑO ✷',p.name)}<div class="modal-body"><img src="${h(img(p.image))}" style="height:245px;object-fit:cover;width:100%;border-radius:17px" alt="${h(p.name)}"><p style="line-height:1.8;color:#827876;font-size:13px">${h(p.description)}</p>${p.contents?.length?`<div class="product-contents"><strong>¿Qué incluye?</strong><ul>${p.contents.map(c=>`<li>${h(c)}</li>`).join('')}</ul></div>`:''}<p class="small-muted">La foto ilustra la presentación. Consultá el contenido exacto al confirmar el pedido.</p><div class="total-line"><span>Precio del producto</span><strong>${money(productPrice(p,store))}</strong></div></div><div class="modal-foot"><button class="btn btn-primary btn-full" data-modal-add="${h(p.id)}">Agregar a mi pedido ♡</button></div>`)}
function beginCheckout(){
 if(!cart.length)return;
 const zones=(store.shipping||[]).filter(z=>z.enabled!==false);
 let photo=null, photoPreviewUrl=null;
 modal(`${head('UN PASITO MÁS ♡','Datos para tu pedido')}
 <form id="checkout-form"><div class="modal-body">
  <p class="checkout-intro">Completá los datos de entrega y, si querés, sumá una dedicatoria o una foto especial para acompañar tu regalo.</p>
  <div class="form-row">
   <label class="form-field"><span>Nombre completo *</span><input name="name" required maxlength="100" autocomplete="name" placeholder="Tu nombre y apellido"></label>
   <label class="form-field"><span>Tu número de WhatsApp *</span><input name="phone" required inputmode="tel" maxlength="35" placeholder="Ej.: 11 1234 5678"></label>
  </div>
  <label class="form-field"><span>Dirección de entrega *</span><input name="address" required maxlength="180" autocomplete="street-address" placeholder="Calle, número, piso / departamento"></label>
  <label class="form-field"><span>Localidad *</span><select name="locality" id="checkout-locality" required><option value="">Seleccioná tu localidad…</option>${zones.map(z=>`<option value="${h(z.name)}">${h(z.name)}</option>`).join('')}</select></label>
  <div id="shipping-preview" class="price-note" aria-live="polite">Seleccioná una localidad para ver el costo del envío.</div>
  <div class="gift-options"><div class="gift-options-heading"><span class="gift-heart" aria-hidden="true">♡</span><div><strong>Hacé tu regalo más especial</strong><small>Opcional · preparado con cariño</small></div></div>
   <label class="form-field" for="checkout-dedication"><span>Escribí tu dedicatoria (opcional)</span><textarea id="checkout-dedication" name="dedication" maxlength="600" rows="4" placeholder="Escribí acá el mensaje que querés que imprimamos y acompañe tu regalo…"></textarea></label>
   <div class="dedication-help"><span>La imprimimos tal como la escribas.</span><span id="dedication-count">0 / 600</span></div>
   <label for="checkout-photo" class="photo-picker"><span class="photo-picker-icon" aria-hidden="true">▧</span><span><strong>Elegir una foto especial (opcional)</strong><small>JPG, PNG o WEBP · hasta 8 MB</small></span><span class="photo-picker-action">Seleccionar</span></label>
   <input class="visually-hidden-photo" type="file" name="photo" id="checkout-photo" accept="image/jpeg,image/png,image/webp">
   <div id="photo-preview" class="photo-preview" aria-live="polite" hidden></div>
   <p class="photo-help">La foto no se carga automáticamente a WhatsApp: después de enviar el pedido podrás compartirla en el mismo chat.</p>
  </div>
  <div class="total-line"><span>Productos <small>${cart.reduce((x,i)=>x+i.qty,0)} unidad/es</small></span><strong>${money(cartSum())}</strong></div>
  <p class="small-muted">${cartNeedsQuote()?'Algunos extras requieren cotización. ':''}El importe y la disponibilidad finales se confirman directamente por WhatsApp.</p>
 </div><div class="modal-foot"><button class="btn btn-primary btn-full" type="submit">Revisar pedido antes de enviarlo →</button></div></form>`,{large:true});
 $('#checkout-locality').addEventListener('change',()=>{
  const z=zones.find(x=>x.name===$('#checkout-locality').value);
  $('#shipping-preview').textContent=z?(z.price==null?`Envío a ${z.name}: a confirmar.`:z.price===0?`Envío a ${z.name}: GRATIS · Total estimado: ${money(cartSum())}`:`Envío a ${z.name}: ${money(z.price)} · Total estimado: ${money(cartSum()+Number(z.price))}`):'Seleccioná una localidad para ver el costo del envío.';
 });
 $('#checkout-dedication').addEventListener('input',e=>{$('#dedication-count').textContent=`${e.target.value.length} / 600`});
 $('#checkout-photo').addEventListener('change',e=>{
  const candidate=e.target.files?.[0];
  if(photoPreviewUrl){URL.revokeObjectURL(photoPreviewUrl);photoPreviewUrl=null;}
  photo=null;$('#photo-preview').hidden=true;$('#photo-preview').innerHTML='';
  if(!candidate)return;
  if(!['image/jpeg','image/png','image/webp'].includes(candidate.type)||candidate.size>8*1024*1024||candidate.size===0){toast('La foto debe ser JPG, PNG o WEBP y pesar menos de 8 MB.');e.target.value='';return;}
  photo=candidate;photoPreviewUrl=URL.createObjectURL(photo);
  $('#photo-preview').hidden=false;
  $('#photo-preview').innerHTML=`<img src="${photoPreviewUrl}" alt="Vista previa de la foto elegida"><div><strong>Foto seleccionada</strong><small>${h(photo.name)} · ${(photo.size/1024/1024).toFixed(1)} MB</small><button type="button" id="remove-photo" class="text-link">Quitar foto</button></div>`;
  $('#remove-photo').addEventListener('click',()=>{$('#checkout-photo').value='';photo=null;URL.revokeObjectURL(photoPreviewUrl);photoPreviewUrl=null;$('#photo-preview').hidden=true;$('#photo-preview').innerHTML=''});
 });
 $('#checkout-form').addEventListener('submit',e=>{
  e.preventDefault();const f=new FormData(e.currentTarget),o=Object.fromEntries(f.entries());
  const z=zones.find(x=>x.name===o.locality);
  if(!z){toast('Seleccioná una localidad de entrega.');return;}
  const dedication=String(o.dedication||'').trim();
  const lines=cart.map((it,index)=>{
   const p=pById(it.id);
   return `${index+1}. ${p?.name||'Producto'} × ${it.qty} — ${money(itemCost(it)*it.qty)}${it.extras?.length?`\n   Extras: ${it.extras.map(x=>x.name+(x.price==null?' (a cotizar)':'')).join(', ')}`:''}${it.message?`\n   Dedicatoria del producto: ${it.message}`:''}`;
  }).join('\n');
  const message=`¡Hola! Quisiera realizar el siguiente pedido en *Dulce Desayunos y Meriendas*:\n\n*PRODUCTOS*\n${lines}\n\n*RESUMEN DE IMPORTES*\nSubtotal: ${money(cartSum())}\nEnvío: ${z.price==null?'A confirmar':z.price===0?'Sin cargo':money(z.price)}\n${z.price!=null?`Total estimado: ${money(cartSum()+Number(z.price))}\n`:''}${cartNeedsQuote()?'Algunos adicionales requieren cotización.\n':''}\n*DATOS PARA LA ENTREGA*\nNombre: ${o.name}\nWhatsApp: ${o.phone}\nDirección: ${o.address}\nLocalidad: ${o.locality}${dedication?`\n\n*DEDICATORIA PARA IMPRIMIR*\n${dedication}`:''}${photo?'\n\n*FOTO PARA IMPRIMIR*\nVoy a adjuntar una foto en este chat.':''}\n\nMuchas gracias. Quedo a la espera de la confirmación del pedido.`;
  const phone=(store.settings?.whatsapp||'5491165744539').replace(/\D/g,'');
  const photoHtml=photo?`<div class="confirm-photo"><img src="${photoPreviewUrl}" alt="Foto seleccionada para el regalo"><div><strong>Tenés una foto para enviar</strong><p>Después de enviar el pedido, volvé a esta pantalla para compartir la foto en el mismo chat.</p></div></div>`:'';
  modal(`${head('ÚLTIMO PASO ♡','Revisá y enviá tu pedido')}
    <div class="modal-body"><div class="coordination-notice" role="note"><span class="coordination-icon" aria-hidden="true">ⓘ</span><div><strong>Coordinación y confirmación del pedido</strong><p>La fecha, el horario de entrega, el medio de pago y cualquier observación se acordarán directamente por WhatsApp con las personas responsables de Dulce Desayunos y Meriendas. <b>Todos los pedidos están sujetos a disponibilidad y confirmación.</b></p></div></div>
    <p class="confirm-message-intro">Este es el mensaje que se enviará a WhatsApp. Podés revisarlo antes de continuar:</p><label class="form-field"><span>Resumen de tu pedido</span><textarea id="order-message" class="order-message" readonly>${h(message)}</textarea></label>${photoHtml}
    <p class="confirm-help">Al pulsar “Abrir WhatsApp”, se abrirá una conversación con el negocio. El pedido se confirma cuando recibas nuestra respuesta.</p></div>
    <div class="modal-foot confirm-actions"><button class="btn btn-soft" id="copy-order">Copiar resumen</button><button class="btn btn-primary btn-full" id="send-whatsapp">Abrir WhatsApp y enviar ↗</button></div>
    ${photo?`<div class="photo-share-footer"><span>Después, enviá la foto en ese mismo chat:</span><button class="btn btn-soft" id="share-order-photo">Compartir mi foto ↗</button><p id="share-photo-help">En el celular, elegí WhatsApp y la conversación con el negocio. Si no aparece esa opción, adjuntá la foto manualmente desde el chat.</p></div>`:''}`,{large:true});
  $('#copy-order').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#order-message').value);toast('Resumen copiado ♡')}catch{$('#order-message').select();toast('Seleccioná y copiá el resumen para enviarlo.')}});
  $('#send-whatsapp').addEventListener('click',()=>{window.open(`https://wa.me/${phone}?text=${encodeURIComponent($('#order-message').value)}`,'_blank','noopener,noreferrer');toast(photo?'Cuando termines, enviá también la foto en el mismo chat.':'Terminá de enviar el pedido por WhatsApp. ¡Gracias!')});
  if(photo){$('#share-order-photo').addEventListener('click',async()=>{
    try{
      if(navigator.canShare?.({files:[photo]}) && navigator.share){await navigator.share({files:[photo],title:'Foto para mi pedido · Dulce Desayunos y Meriendas'});toast('Verificá que la foto se haya enviado a la conversación correcta.');}
      else{toast('Adjuntá la foto desde el chat de WhatsApp con el botón de archivos o fotos.');}
    }catch(err){if(err?.name!=='AbortError')toast('No fue posible compartirla. Adjuntala directamente en WhatsApp.');}
  })}
 });
}
function finishNews(){closeModal();$('#productos').scrollIntoView({behavior:'smooth'});}
function showNews(){if(document.body.classList.contains('locked')||sessionStorage.getItem('dulce_news_seen'))return;const n=(store.news||[]).find(x=>x.active);if(!n)return;const d=Math.max(10,Math.min(20,Number(n.duration)||15));sessionStorage.setItem('dulce_news_seen','yes');
 $('#modal-root').innerHTML=`<div class="modal-wrap" id="modal-overlay"><div class="feature-news" role="dialog" aria-modal="true" aria-label="Novedad de Dulce"><button class="icon-button" data-close aria-label="Cerrar novedad">✕</button><img src="${h(img(n.image))}" alt="${h(n.title)}"><div class="feature-news-content"><small>${h(n.eyebrow||'NOVEDAD DULCE ✷')}</small><h2>${h(n.title)}</h2><p>${h(n.subtitle)}</p><div class="news-progress"><span style="animation-duration:${d}s"></span></div><button class="btn btn-primary" id="news-explore">Ver productos ↗</button><p class="small-muted">Esta ventana se cierra sola en ${d} segundos.</p></div></div></div>`;document.body.classList.add('locked');$$('[data-close]').forEach(b=>b.addEventListener('click',finishNews));$('#modal-overlay').addEventListener('click',e=>{if(e.target.id==='modal-overlay')finishNews()});$('#news-explore').addEventListener('click',finishNews);newsTimer=setTimeout(finishNews,d*1000);
}
function setupScrollReveals(){
 if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const targets=[...document.querySelectorAll('.category-section,.products-section,.news-section,.how-section,.contact-section,#promociones,.category-card,.step')];
 targets.forEach((el,i)=>{el.classList.add('reveal-on-scroll');el.style.setProperty('--reveal-delay',`${Math.min(i%3,2)*75}ms`)});
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target)}}},{threshold:0.09,rootMargin:'0px 0px -30px 0px'});
 targets.forEach(el=>observer.observe(el));
}
function setup(){
 $('#open-cart').addEventListener('click',()=>drawer(true));$('#mobile-cart').addEventListener('click',()=>drawer(true));$('#close-cart').addEventListener('click',()=>drawer(false));$('#overlay').addEventListener('click',()=>drawer(false));
 $('#start-checkout').addEventListener('click',beginCheckout);
 $$('[data-filter-jump]').forEach(el=>el.addEventListener('click',()=>setFilter(el.dataset.filterJump,true)));
 $$('[data-filter]').forEach(el=>el.addEventListener('click',()=>setFilter(el.dataset.filter)));
 $('#product-grid').addEventListener('click',e=>{const target=e.target.closest('[data-add],[data-detail],[data-show-all]');if(!target)return;if(target.dataset.add)add(target.dataset.add);else if(target.dataset.detail)details(target.dataset.detail);else if(target.hasAttribute('data-show-all'))setFilter('todos')});
 $('#promos-grid').addEventListener('click',e=>{const t=e.target.closest('[data-add]');if(t)add(t.dataset.add)});
 $('#cart-items').addEventListener('click',e=>{const t=e.target.closest('[data-remove],[data-qty],#explore-cart');if(!t)return;if(t.id==='explore-cart'){drawer(false);$('#productos').scrollIntoView({behavior:'smooth'});return}const i=Number(t.dataset.remove ?? t.dataset.qty);if(t.hasAttribute('data-remove'))cart.splice(i,1);else {cart[i].qty+=Number(t.dataset.delta);if(cart[i].qty<=0)cart.splice(i,1)}syncCart()});
 $('#modal-root').addEventListener('click',e=>{const addT=e.target.closest('[data-modal-add]');if(addT){add(addT.dataset.modalAdd);closeModal();drawer(true)}});
 window.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();drawer(false)}});
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('.mobile-nav a').forEach(n=>n.classList.toggle('active',n.getAttribute('href')===a.getAttribute('href')))}));
}
(async()=>{setup();setupScrollReveals();try{store=await loadPublic()}catch(e){console.warn('No se pudo cargar el catálogo remoto:',e);store=initialPublic();toast('Estamos mostrando el catálogo de referencia. Algunas novedades pueden no estar actualizadas.')}renderProducts();renderPromos();renderNews();renderContact();syncCart();setTimeout(showNews,1200)})();
