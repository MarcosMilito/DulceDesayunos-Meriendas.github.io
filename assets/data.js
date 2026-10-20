export const formatMoney = (n=0) => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(Number(n)||0);
export const escapeHtml = (value='') => String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const slug = () => (globalThis.crypto?.randomUUID?.()||`id${Date.now()}${Math.random().toString(36).slice(2)}`);
export const zoneNames = ['Banfield','Lomas de Zamora','Temperley','Lanús','Remedios de Escalada','Adrogué','Turdera','Llavallol','Monte Grande','Burzaco','Longchamps','Avellaneda','Quilmes','Wilde','Sarandí','Gerli','Valentín Alsina','Villa Centenario','Ingeniero Budge','Fiorito','San José','Claypole','Rafael Calzada','Solano','Otra localidad (consultar)'];
export const defaults = {
  public: {
    products: [
      {id:'picada',name:'Picada',category:'picadas',price:26000,description:'Una selección para compartir: fiambres, quesos, aceitunas, tomates cherry, panes y mucho sabor.',image:'assets/img/picada.jpeg',badge:'Para compartir',featured:true,customizable:false,alsoMerienda:false,active:true},
      {id:'ricota',name:'Ricota',category:'desayunos',price:25000,description:'Una bandeja dulce con medialunas, budín, tartaletas, galletitas, jugo e infusión.',image:'assets/img/ricota.jpeg',badge:'Bien dulce',featured:false,customizable:true,alsoMerienda:true,active:true},
      {id:'clasico',name:'Clásico',category:'desayunos',price:22000,description:'Sabores de siempre: medialunas, budín, dulces, alfajorcitos, jugo y una rica infusión.',image:'assets/img/clasico.jpeg',badge:'El elegido',featured:true,customizable:true,alsoMerienda:true,active:true},
      {id:'matero',name:'Matero',category:'desayunos',price:20000,description:'El compañero perfecto del mate: medialunas, masas, tartaleta y detalles dulces.',image:'assets/img/matero.jpeg',badge:'Momento mate',featured:false,customizable:true,alsoMerienda:true,active:true},
      {id:'chocotorta',name:'Chocotorta',category:'desayunos',price:24000,description:'El gusto más tentador: chocotorta, masas, medialuna, tartaleta, jugo y más.',image:'assets/img/chocotorta.jpeg',badge:'Amor al chocolate',featured:false,customizable:true,alsoMerienda:true,active:true},
      {id:'premium',name:'Premium',category:'desayunos',price:30000,description:'Una experiencia especial con sándwiches, medialunas, brownies, fruta fresca, jugo y dulces.',image:'assets/img/premium.jpeg',badge:'Para sorprender',featured:true,customizable:true,alsoMerienda:true,active:true}
    ],
    promos: [],
    news:[{id:'bienvenida',title:'¡Los momentos lindos se comparten!',subtitle:'Desayunos, meriendas y picadas hechas para sorprender. Elegí tu favorito y armemos algo especial.',image:'assets/img/premium.jpeg',active:true,duration:15,eyebrow:'Una dulce novedad'}],
    shipping:zoneNames.map(name=>({name,price:null,enabled:true})),
    addons:[{id:'tarjeta',name:'Tarjeta con dedicatoria',price:0,enabled:true},{id:'taza',name:'Taza personalizada',price:null,enabled:true},{id:'jugo',name:'Jugo adicional',price:null,enabled:true},{id:'medialunas',name:'Medialunas extra',price:null,enabled:true},{id:'dulces',name:'Algo dulce extra',price:null,enabled:true}],
    settings:{businessName:'Dulce · Desayunos y Meriendas',headline:'Hacemos que cada momento sea un poquito más dulce.',subheadline:'Desayunos, meriendas y picadas llenos de cariño. Elegí tu favorito, personalizalo y regalá una sonrisa.',whatsapp:'',instagram:'',contactEmail:'',deliveryNote:'Envíos a Zona Sur · Consultar disponibilidad y costo'}
  },
  private: {
    ingredients:[
      {id:'taza',name:'Taza',unit:'unidad',cost:0},{id:'jugo',name:'Jugo',unit:'unidad',cost:0},{id:'medialuna',name:'Medialuna',unit:'unidad',cost:0},{id:'budin',name:'Porción de budín',unit:'unidad',cost:0},{id:'tarta',name:'Tartaleta',unit:'unidad',cost:0},{id:'alfajor',name:'Alfajor',unit:'unidad',cost:0},{id:'sandwich',name:'Sándwich',unit:'unidad',cost:0},{id:'brownie',name:'Brownie',unit:'unidad',cost:0},{id:'fruta',name:'Fruta fresca',unit:'porción',cost:0},{id:'fiambres',name:'Fiambres',unit:'gramo',cost:0},{id:'queso',name:'Queso',unit:'gramo',cost:0},{id:'pan',name:'Pan',unit:'unidad',cost:0},{id:'caja',name:'Caja o bandeja',unit:'unidad',cost:0},{id:'envoltorio',name:'Envoltorios y decoración',unit:'unidad',cost:0}
    ],
    recipes: {picada:[],ricota:[],clasico:[],matero:[],chocotorta:[],premium:[]},
    orders:[],movements:[]
  }
};
const clone = (obj) => JSON.parse(JSON.stringify(obj));
export const initialPublic = () => clone(defaults.public);
export const initialPrivate = () => clone(defaults.private);
const KEY_P='dulce_2_public', KEY_A='dulce_2_private', KEY_CART='dulce_2_cart';
const cloud = () => {const c=window.DULCE_CONFIG||{};return Boolean(c.supabaseUrl && c.supabaseAnonKey)};
const cfg = () => window.DULCE_CONFIG || {};
function localGet(k,defaultFn){try{const s=localStorage.getItem(k);return s?JSON.parse(s):defaultFn()}catch{return defaultFn()}}
function localSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){throw Error('No se pudo guardar en este navegador. Puede faltar espacio. '+e.message)}}
async function request(path,{method='GET',body,token,extraHeaders={}}={}){
 const c=cfg(), url=c.supabaseUrl.replace(/\/$/,'')+path;
 const headers={'apikey':c.supabaseAnonKey,'Authorization':'Bearer '+(token||c.supabaseAnonKey),'Content-Type':'application/json','Accept':'application/json',...extraHeaders};
 const res=await fetch(url,{method,headers,body:body!==undefined?JSON.stringify(body):undefined});
 const txt=await res.text();let data;try{data=txt?JSON.parse(txt):null}catch{data=txt}
 if(!res.ok)throw Error(data?.message||data?.error_description||data?.error||`Error de conexión (${res.status})`);
 return data;
}
export const isCloud = cloud;
export const getSession = () => {try{return JSON.parse(sessionStorage.getItem('dulce_admin_session')||'null')}catch{return null}};
export const endSession = () => sessionStorage.removeItem('dulce_admin_session');
export async function signIn(email,password){
 if(!cloud())throw Error('Falta conectar Supabase.');
 const ses=await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});
 if(!ses?.access_token)throw Error('No se pudo iniciar sesión.');
 const allowed=await request(`/rest/v1/admins?select=user_id&user_id=eq.${encodeURIComponent(ses.user.id)}`,{token:ses.access_token});
 if(!Array.isArray(allowed)||!allowed.length)throw Error('Este correo no tiene permiso de administrador.');
 sessionStorage.setItem('dulce_admin_session',JSON.stringify(ses)); return ses;
}
export async function sessionToken(){
 const ses=getSession();if(!ses)return null;
 if(Date.now()<((ses.expires_at||0)*1000-60000))return ses.access_token;
 if(!ses.refresh_token){endSession();throw Error('La sesión expiró. Volvé a ingresar.')}
 const next=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:ses.refresh_token}});
 sessionStorage.setItem('dulce_admin_session',JSON.stringify(next));return next.access_token;
}
export async function verifyAdmin(){if(!cloud())return false;const ses=getSession();if(!ses)return false;try{const tok=await sessionToken();const users=await request(`/rest/v1/admins?select=user_id&user_id=eq.${encodeURIComponent(ses.user.id)}`,{token:tok});return Array.isArray(users)&&users.length>0}catch{return false}}
export async function loadPublic(){
 if(!cloud())return localGet(KEY_P,initialPublic);
 const rows=await request('/rest/v1/public_data?select=payload&id=eq.store');
 return rows?.[0]?.payload && Object.keys(rows[0].payload).length ? rows[0].payload : initialPublic();
}
export async function loadPrivate(){
 if(!cloud())return localGet(KEY_A,initialPrivate);
 const tok=await sessionToken();if(!tok)throw Error('Tenés que iniciar sesión.');
 const rows=await request('/rest/v1/private_data?select=payload&id=eq.store',{token:tok});
 return rows?.[0]?.payload && Object.keys(rows[0].payload).length ? rows[0].payload : initialPrivate();
}
export async function savePublic(data){
 if(!cloud())return localSet(KEY_P,data);
 const tok=await sessionToken();if(!tok)throw Error('Se cerró tu sesión.');
 await request('/rest/v1/public_data?id=eq.store',{method:'PATCH',body:{payload:data,updated_at:new Date().toISOString()},token:tok,extraHeaders:{Prefer:'return=minimal'}});
}
export async function savePrivate(data){
 if(!cloud())return localSet(KEY_A,data);
 const tok=await sessionToken();if(!tok)throw Error('Se cerró tu sesión.');
 await request('/rest/v1/private_data?id=eq.store',{method:'PATCH',body:{payload:data,updated_at:new Date().toISOString()},token:tok,extraHeaders:{Prefer:'return=minimal'}});
}
export function getCart(){return localGet(KEY_CART,()=>[])}
export function setCart(cart){localSet(KEY_CART,cart);window.dispatchEvent(new CustomEvent('cart-updated'))}
export function promoFor(p,store){return store.promos?.find(x=>x.active && x.productId===p.id && Number(x.price)>=0)}
export function productPrice(p,store){return promoFor(p,store)?.price??p.price}
export function recipeCost(id,priv){return (priv.recipes?.[id]||[]).reduce((sum,r)=>sum+(Math.max(0,Number(r.quantity)||0)*Math.max(0,Number(priv.ingredients.find(i=>i.id===r.ingredientId)?.cost)||0)),0)}
export function orderCosts(order,priv){return order.cost!==undefined?Number(order.cost)||0:0}
