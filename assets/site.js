import {formatMoney as money,escapeHtml as h,loadPublic,initialPublic,isCloud,getCart,setCart,productPrice,promoFor,slug} from './data.js?v=2.4.0';
let store=initialPublic(), filter='todos', cart=getCart(), modalCloser=null, newsTimer=null;
// Se conserva el formulario al volver desde la revisión, incluso la foto seleccionada.
let checkoutDraft={}, checkoutPhoto=null, checkoutPhotoPreviewUrl=null;
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
function modal(html,opts={}){drawer(false);$('#modal-root').innerHTML=`<div class="modal-wrap" id="modal-overlay"><div class="modal-card ${opts.large?'large':''}" role="dialog" aria-modal="true" aria-label="${h(opts.label||'Detalle')}">${html}</div></div>`;document.body.classList.add('locked');$('#modal-overlay').addEventListener('click',e=>{if(e.target.id==='modal-overlay')closeModal()});$$('[data-close]').forEach(el=>el.addEventListener('click',closeModal));$('#modal-root [data-modal-back]')?.addEventListener('click',opts.onBack||closeModal);modalCloser=opts.onBack||closeModal;}
const head=(label,title)=>`<div class="modal-top"><div class="modal-heading-actions"><button class="modal-back" type="button" data-modal-back aria-label="Volver al paso anterior"><span aria-hidden="true">←</span> Volver</button><div><small>${h(label)}</small><h2>${h(title)}</h2></div></div><button class="icon-button" data-close aria-label="Cerrar">✕</button></div>`;
function details(id){const p=pById(id);if(!p)return;modal(`${head('HECHO CON CARIÑO ✷',p.name)}<div class="modal-body"><img src="${h(img(p.image))}" style="height:245px;object-fit:cover;width:100%;border-radius:17px" alt="${h(p.name)}"><p style="line-height:1.8;color:#827876;font-size:13px">${h(p.description)}</p>${p.contents?.length?`<div class="product-contents"><strong>¿Qué incluye?</strong><ul>${p.contents.map(c=>`<li>${h(c)}</li>`).join('')}</ul></div>`:''}<p class="small-muted">La foto ilustra la presentación. Consultá el contenido exacto al confirmar el pedido.</p><div class="total-line"><span>Precio del producto</span><strong>${money(productPrice(p,store))}</strong></div></div><div class="modal-foot"><button class="btn btn-primary btn-full" data-modal-add="${h(p.id)}">Agregar a mi pedido ♡</button></div>`)}
// Paso 1. Datos de entrega, dedicatoria, observaciones y foto opcional.
function beginCheckout(){
 if(!cart.length)return;
 const zones=(store.shipping||[]).filter(z=>z.enabled!==false);
 modal(`${head('UN PASITO MÁS ♡','Datos para tu pedido')}
 <form id="checkout-form"><div class="modal-body">
  <p class="checkout-intro">Completá los datos de entrega y, si querés, sumá una dedicatoria o una foto especial.</p>
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
   <label class="form-field dedication-observations" for="checkout-dedication-notes"><span>Observaciones de la dedicatoria (opcional)</span><textarea id="checkout-dedication-notes" name="dedicationNotes" maxlength="450" rows="3" placeholder="¿Tenés alguna preferencia especial? Colores, letra, diseño, detalles de la foto…"></textarea><small>Contanos cómo querés que preparemos la tarjeta.</small></label>
   <label for="checkout-photo" class="photo-picker"><span class="photo-picker-icon" aria-hidden="true">▧</span><span><strong>Elegir una foto especial (opcional)</strong><small>JPG, PNG o WEBP · hasta 8 MB</small></span><span class="photo-picker-action">Seleccionar</span></label>
   <input class="visually-hidden-photo" type="file" name="photo" id="checkout-photo" accept="image/jpeg,image/png,image/webp">
   <div id="photo-preview" class="photo-preview" aria-live="polite" hidden></div>
   <p class="photo-help">Si elegís una foto, vas a poder adjuntarla en el mismo chat de WhatsApp después de compartir el pedido.</p>
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
 function showPhoto(){
  const area=$('#photo-preview');area.hidden=!checkoutPhoto;
  if(!checkoutPhoto){area.innerHTML='';return;}
  area.innerHTML=`<img src="${checkoutPhotoPreviewUrl}" alt="Vista previa de tu fotografía"><div><strong>Foto seleccionada</strong><small>${h(checkoutPhoto.name)} · ${(checkoutPhoto.size/1024/1024).toFixed(1)} MB</small><button type="button" id="remove-photo" class="text-link">Quitar foto</button></div>`;
  $('#remove-photo').addEventListener('click',()=>{checkoutPhoto=null;if(checkoutPhotoPreviewUrl)URL.revokeObjectURL(checkoutPhotoPreviewUrl);checkoutPhotoPreviewUrl=null;$('#checkout-photo').value='';showPhoto()});
 }
 const saveDraft=()=>{const fields=new FormData(form);for(const key of ['name','phone','address','locality','dedication','dedicationNotes'])checkoutDraft[key]=String(fields.get(key)||'')};
 form.addEventListener('input',()=>{saveDraft();$('#dedication-count').textContent=`${$('#checkout-dedication').value.length} / 600`});
 form.addEventListener('change',saveDraft);
 $('#checkout-locality').addEventListener('change',previewShipping);
 $('#checkout-photo').addEventListener('change',e=>{
  const file=e.target.files?.[0];if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024||file.size===0){toast('La foto debe ser JPG, PNG o WEBP y pesar menos de 8 MB.');e.target.value='';return;}
  if(checkoutPhotoPreviewUrl)URL.revokeObjectURL(checkoutPhotoPreviewUrl);
  checkoutPhoto=file;checkoutPhotoPreviewUrl=URL.createObjectURL(file);showPhoto();
 });
 $('#checkout-back').addEventListener('click',()=>{saveDraft();closeModal();drawer(true)});
 form.addEventListener('submit',e=>{e.preventDefault();saveDraft();if(!zones.some(z=>z.name===checkoutDraft.locality)){toast('Seleccioná una localidad válida.');return;}reviewOrder()});
 previewShipping();showPhoto();$('#dedication-count').textContent=`${(checkoutDraft.dedication||'').length} / 600`;
}
// Paso 2. Mensaje a WhatsApp. Todos los campos de la dedicatoria se muestran,
// incluso si se dejaron vacíos, para que el negocio sepa que no faltan datos.
function buildOrderMessage(){
 const o=checkoutDraft;
 const z=(store.shipping||[]).find(x=>x.name===o.locality);
 if(!z)throw new Error('Localidad inválida');
 const lines=cart.map(it=>{
  const p=pById(it.id);
  return `• ${p?.name||'Producto'} — ${it.qty} ${it.qty===1?'unidad':'unidades'} — ${money(itemCost(it)*it.qty)}${it.extras?.length?`\n  Extras: ${it.extras.map(x=>x.name+(x.price==null?' (a cotizar)':'')).join(', ')}`:''}${it.message?`\n  Dedicatoria del producto: ${it.message}`:''}`;
 }).join('\n');
 const dedication=(o.dedication||'').trim();
 const notes=(o.dedicationNotes||'').trim();
 const photoNote=checkoutPhoto?'\n\n*FOTOGRAFÍA*\nSe seleccionó una foto; se adjuntará manualmente en esta conversación.':'';
 return `¡Hola! Quisiera realizar el siguiente pedido en *Dulces Desayunos y Meriendas*:\n\n*PRODUCTOS*\n${lines}\n\n*RESUMEN DE IMPORTES*\nSubtotal: ${money(cartSum())}\nEnvío: ${z.price==null?'A confirmar':z.price===0?'Sin cargo':money(z.price)}\n${z.price!=null?`Total estimado: ${money(cartSum()+Number(z.price))}\n`:''}${cartNeedsQuote()?'Algunos adicionales requieren cotización.\n':''}\n*DATOS PARA LA ENTREGA*\nNombre: ${o.name}\nWhatsApp: ${o.phone}\nDirección: ${o.address}\nLocalidad: ${o.locality}\n\n*DEDICATORIA PARA IMPRIMIR*\n${dedication||'No se solicitó dedicatoria.'}\n\n*OBSERVACIONES DE LA DEDICATORIA*\n${notes||'Sin observaciones especiales.'}${photoNote}\n\nMuchas gracias. Quedo a la espera de la confirmación del pedido.`;
}
function reviewOrder(){
 const message=buildOrderMessage();
 const phone=(store.settings?.whatsapp||'5491165744539').replace(/\D/g,'');
 const giftPreview=`<div class="gift-review"><div><strong>♡ Dedicatoria para imprimir</strong><p>${h((checkoutDraft.dedication||'').trim()||'No se solicitó dedicatoria.')}</p></div><div><strong>✎ Observaciones de la dedicatoria</strong><p>${h((checkoutDraft.dedicationNotes||'').trim()||'Sin observaciones especiales.')}</p></div></div>`;
 const photoHtml=checkoutPhoto?`<div class="confirm-photo"><img src="${checkoutPhotoPreviewUrl}" alt="Foto seleccionada"><div><strong>Foto para acompañar el pedido</strong><p>Cuando se abra WhatsApp, adjuntá esta foto en el mismo chat desde el botón de adjuntar.</p></div></div>`:'';
 modal(`${head('ÚLTIMO PASO ♡','Revisá tu pedido')}
 <div class="modal-body"><div class="coordination-notice" role="note"><span class="coordination-icon" aria-hidden="true">ⓘ</span><div><strong>Coordinación y confirmación del pedido</strong><p>La fecha, el horario de entrega, el medio de pago y cualquier observación se acordarán directamente por WhatsApp con las personas responsables de Dulces Desayunos y Meriendas. <b>Todos los pedidos están sujetos a disponibilidad y confirmación.</b></p></div></div>
 <p class="confirm-message-intro">Revisá tu dedicatoria y las observaciones antes de compartir el pedido:</p>${giftPreview}
 <label class="form-field"><span>Resumen completo de tu pedido</span><textarea id="order-message" class="order-message" readonly></textarea></label>${photoHtml}
 <p class="confirm-help">El pedido solo queda confirmado cuando el negocio te responde por WhatsApp.</p></div>
 <div class="modal-foot step-actions"><button class="btn btn-soft" id="review-back">← Modificar datos</button><button class="btn btn-primary" id="share-order">Compartir pedido ↗</button></div>`,{large:true,label:'Revisar pedido',onBack:beginCheckout});
 // Con .value no se interpreta el mensaje como HTML, ni se pierde la dedicatoria.
 $('#order-message').value=message;
 $('#review-back').addEventListener('click',beginCheckout);
 $('#share-order').addEventListener('click',()=>{
  // wa.me direcciona el texto al número del negocio; adjuntar un archivo en
  // ese chat requiere una acción del usuario (restricción de WhatsApp).
  const url=`https://wa.me/${phone}?text=${encodeURIComponent($('#order-message').value)}`;
  window.open(url,'_blank','noopener,noreferrer');
  if(checkoutPhoto)toast('Si elegiste una foto, adjuntala en este mismo chat de WhatsApp.');
 });
}
function finishNews(){closeModal();$('#productos').scrollIntoView({behavior:'smooth'});}
function showNews(){if(document.body.classList.contains('locked')||sessionStorage.getItem('dulce_news_seen'))return;const n=(store.news||[]).find(x=>x.active);if(!n)return;const d=Math.max(10,Math.min(20,Number(n.duration)||15));sessionStorage.setItem('dulce_news_seen','yes');
 $('#modal-root').innerHTML=`<div class="modal-wrap" id="modal-overlay"><div class="feature-news" role="dialog" aria-modal="true" aria-label="Novedad de Dulces"><button class="news-back" id="news-back" type="button">← Volver</button><button class="icon-button" data-close aria-label="Cerrar novedad">✕</button><img src="${h(img(n.image))}" alt="${h(n.title)}"><div class="feature-news-content"><small>${h(n.eyebrow||'NOVEDAD DULCE ✷')}</small><h2>${h(n.title)}</h2><p>${h(n.subtitle)}</p><div class="news-progress"><span style="animation-duration:${d}s"></span></div><button class="btn btn-primary" id="news-explore">Ver productos ↗</button><p class="small-muted">Esta ventana se cierra sola en ${d} segundos.</p></div></div></div>`;document.body.classList.add('locked');$$('[data-close]').forEach(b=>b.addEventListener('click',finishNews));$('#news-back').addEventListener('click',finishNews);$('#modal-overlay').addEventListener('click',e=>{if(e.target.id==='modal-overlay')finishNews()});$('#news-explore').addEventListener('click',finishNews);newsTimer=setTimeout(finishNews,d*1000);
}
function setupScrollReveals(){
 if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const targets=[...document.querySelectorAll('.category-section,.products-section,.news-section,.how-section,.contact-section,#promociones,.category-card,.step')];
 targets.forEach((el,i)=>{el.classList.add('reveal-on-scroll');el.style.setProperty('--reveal-delay',`${Math.min(i%3,2)*75}ms`)});
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target)}}},{threshold:0.09,rootMargin:'0px 0px -30px 0px'});
 targets.forEach(el=>observer.observe(el));
}
function setup(){
 $('#open-cart').addEventListener('click',()=>drawer(true));$('#mobile-cart').addEventListener('click',()=>drawer(true));$('#close-cart').addEventListener('click',()=>drawer(false));$('#cart-back').addEventListener('click',()=>drawer(false));$('#overlay').addEventListener('click',()=>drawer(false));
 $('#start-checkout').addEventListener('click',beginCheckout);
 $$('[data-filter-jump]').forEach(el=>el.addEventListener('click',()=>setFilter(el.dataset.filterJump,true)));
 $$('[data-filter]').forEach(el=>el.addEventListener('click',()=>setFilter(el.dataset.filter)));
 $('#product-grid').addEventListener('click',e=>{const target=e.target.closest('[data-add],[data-detail],[data-show-all]');if(!target)return;if(target.dataset.add)add(target.dataset.add);else if(target.dataset.detail)details(target.dataset.detail);else if(target.hasAttribute('data-show-all'))setFilter('todos')});
 $('#promos-grid').addEventListener('click',e=>{const t=e.target.closest('[data-add]');if(t)add(t.dataset.add)});
 $('#cart-items').addEventListener('click',e=>{const t=e.target.closest('[data-remove],[data-qty],#explore-cart');if(!t)return;if(t.id==='explore-cart'){drawer(false);$('#productos').scrollIntoView({behavior:'smooth'});return}const i=Number(t.dataset.remove ?? t.dataset.qty);if(t.hasAttribute('data-remove'))cart.splice(i,1);else {cart[i].qty+=Number(t.dataset.delta);if(cart[i].qty<=0)cart.splice(i,1)}syncCart()});
 $('#modal-root').addEventListener('click',e=>{const addT=e.target.closest('[data-modal-add]');if(addT){add(addT.dataset.modalAdd);closeModal();drawer(true)}});
 window.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#modal-root').children.length){(modalCloser||closeModal)();}else drawer(false)}});
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('.mobile-nav a').forEach(n=>n.classList.toggle('active',n.getAttribute('href')===a.getAttribute('href')))}));
}
(async()=>{setup();setupScrollReveals();try{store=await loadPublic()}catch(e){console.warn('No se pudo cargar el catálogo remoto:',e);store=initialPublic();toast('Estamos mostrando el catálogo de referencia. Algunas novedades pueden no estar actualizadas.')}renderProducts();renderPromos();renderNews();renderContact();syncCart();setTimeout(showNews,1200)})();
