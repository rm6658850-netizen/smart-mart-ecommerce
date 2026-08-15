const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={products:[],filtered:[],cart:JSON.parse(localStorage.getItem('smartmart-cart')||'[]'),page:1,perPage:48,category:'All',search:'',sort:'default'};
const money=n=>'₹'+Number(n||0).toLocaleString('en-IN',{minimumFractionDigits:Number(n)%1?2:0,maximumFractionDigits:2});
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function svg(name){
  const text=esc(name.length>22?name.slice(0,22)+'…':name);
  let hue=0;

  for(const c of name){
    hue=(hue+c.charCodeAt(0)*7)%360;
  }

  const image=`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="480">
    <defs>
      <linearGradient id="g" x1="0" x2="1">
        <stop stop-color="hsl(${hue},70%,92%)"/>
        <stop offset="1" stop-color="hsl(${(hue+35)%360},65%,82%)"/>
      </linearGradient>
    </defs>
    <rect width="600" height="480" fill="url(#g)"/>
    <circle cx="300" cy="200" r="115" fill="white" opacity=".72"/>
    <text x="300" y="205" text-anchor="middle" font-size="86">🛍️</text>
    <text x="300" y="340" text-anchor="middle" font-family="Arial" font-size="28" font-weight="700" fill="#183b3a">${text}</text>
    <text x="300" y="378" text-anchor="middle" font-family="Arial" font-size="18" fill="#42615f">Smart Mart</text>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(image)}`;
}
function save(){localStorage.setItem('smartmart-cart',JSON.stringify(state.cart));}
function renderCategories(){const counts={All:state.products.length};for(const p of state.products){const c=(p.name.split(' - ')[0].trim()||'Other').split(' ')[0].toUpperCase();counts[c]=(counts[c]||0)+1;}const cats=['All',...Object.keys(counts).filter(x=>x!=='All').sort().slice(0,80)];$('#categories').innerHTML=cats.map(c=>`<button class="cat ${c===state.category?'active':''}" data-cat="${esc(c)}"><span>${esc(c)}</span><small>${counts[c]||0}</small></button>`).join('');$$('.cat').forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;state.page=1;apply();});}
function apply(){let a=[...state.products];if(state.search)a=a.filter(p=>p.name.toLowerCase().includes(state.search.toLowerCase()));if(state.category!=='All')a=a.filter(p=>(p.name.split(' - ')[0].trim().split(' ')[0]||'Other').toUpperCase()===state.category);if(state.sort==='low')a.sort((x,y)=>x.price-y.price);if(state.sort==='high')a.sort((x,y)=>y.price-x.price);if(state.sort==='az')a.sort((x,y)=>x.name.localeCompare(y.name));state.filtered=a;const pages=Math.max(1,Math.ceil(a.length/state.perPage));if(state.page>pages)state.page=pages;renderProducts();renderPagination(pages);$('#resultCount').textContent=`${a.length.toLocaleString('en-IN')} products`;$('#activeFilter').textContent=state.category!=='All'?` • ${state.category}`:'';renderCategories();}
function renderProducts(){const start=(state.page-1)*state.perPage;const arr=state.filtered.slice(start,start+state.perPage);$('#empty').classList.toggle('hidden',arr.length>0);$('#products').innerHTML=arr.map(p=>{const inCart=state.cart.find(x=>x.id===p.id)?.qty||0;return `<article class="card"><div class="pic"><img loading="lazy" src="${svg(p.name)}" alt="${esc(p.name)}"></div><div class="cardBody"><div class="productName" title="${esc(p.name)}">${esc(p.name)}</div><div class="price">${money(p.price)}</div><div class="cardActions"><button class="add ${inCart?'added':''}" data-id="${p.id}">${inCart?`✓ ${inCart} in cart`:'Add to cart'}</button></div></div></article>`}).join('');$$('.add').forEach(b=>b.onclick=()=>add(+b.dataset.id));}
function renderPagination(pages){let s='';if(pages<=1){$('#pagination').innerHTML='';return;}for(let i=1;i<=pages;i++){if(i>7&&i<pages-2)continue;if(i===8)s+='<span>…</span>';s+=`<button class="page ${i===state.page?'active':''}" data-p="${i}">${i}</button>`;}$('#pagination').innerHTML=s;$$('.page').forEach(b=>b.onclick=()=>{state.page=+b.dataset.p;renderProducts();renderPagination(pages);window.scrollTo({top:520,behavior:'smooth'});});}
function add(id){const p=state.products.find(x=>x.id===id);if(!p)return;const x=state.cart.find(x=>x.id===id);if(x)x.qty++;else state.cart.push({id:p.id,name:p.name,price:p.price,qty:1});save();renderCart();renderProducts();}
function change(id,d){const x=state.cart.find(x=>x.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)state.cart=state.cart.filter(y=>y.id!==id);save();renderCart();renderProducts();}
function renderCart(){const count=state.cart.reduce((s,x)=>s+x.qty,0),total=state.cart.reduce((s,x)=>s+x.qty*x.price,0);$('#cartCount').textContent=count;$('#cartTotal').textContent=money(total);$('#cartItems').innerHTML=state.cart.length?state.cart.map(x=>`<div class="cartRow"><div><b>${esc(x.name)}</b><small>${money(x.price)} each</small></div><div class="qty"><button data-id="${x.id}" data-d="-1">−</button><span>${x.qty}</span><button data-id="${x.id}" data-d="1">+</button></div></div>`).join(''):'<div class="empty">Your cart is empty.</div>';$$('.qty button').forEach(b=>b.onclick=()=>change(+b.dataset.id,+b.dataset.d));}
function openCart(){document.body.classList.add('drawerOpen');$('#cartDrawer').classList.add('open');$('#backdrop').classList.remove('hidden');}function closeCart(){document.body.classList.remove('drawerOpen');$('#cartDrawer').classList.remove('open');$('#backdrop').classList.add('hidden');}
function openOrder(){if(!state.cart.length)return alert('Please add at least one item to cart.');closeCart();$('#orderModal').classList.remove('hidden');}
function makeOrder(form){const fd=new FormData(form),items=state.cart.map(x=>({id:x.id,name:x.name,price:x.price,qty:x.qty}));return {id:'SM-'+Date.now().toString(36).toUpperCase(),created_at:new Date().toISOString(),customer:{name:fd.get('name'),phone:fd.get('phone'),address:fd.get('address')},payment:fd.get('payment'),items,total:items.reduce((s,x)=>s+x.price*x.qty,0),status:'NEW'};}
async function submitOrder(e){e.preventDefault();const form=e.currentTarget,order=makeOrder(form);$('#orderStatus').innerHTML='<div class="status loading">Sending order…</div>';try{if(window.S_MART_CONFIG.supabaseUrl&&window.S_MART_CONFIG.supabaseAnonKey){const r=await fetch(window.S_MART_CONFIG.supabaseUrl+'/rest/v1/orders',{method:'POST',headers:{apikey:window.S_MART_CONFIG.supabaseAnonKey,Authorization:'Bearer '+window.S_MART_CONFIG.supabaseAnonKey,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({order_id:order.id,customer_name:order.customer.name,customer_phone:order.customer.phone,address:order.customer.address,payment:order.payment,items:order.items,total:order.total,status:'NEW'})});if(!r.ok)throw new Error('backend');}else{const list=JSON.parse(localStorage.getItem('smartmart-orders')||'[]');list.unshift(order);localStorage.setItem('smartmart-orders',JSON.stringify(list));new BroadcastChannel('smartmart-orders').postMessage(order);}state.cart=[];save();renderCart();form.reset();$('#orderStatus').innerHTML=`<div class="status success"><b>Order placed!</b><br>Order ID: ${esc(order.id)}<br>Our helper can now process it.</div>`;}catch(err){$('#orderStatus').innerHTML='<div class="status error">Could not send order. Check Supabase configuration.</div>';}}
async function init(){const r=await fetch('assets/products.json');state.products=await r.json();renderCart();renderCategories();apply();$('#searchInput').oninput=e=>{state.search=e.target.value.trim();state.page=1;apply();};$('#clearSearch').onclick=()=>{$('#searchInput').value='';state.search='';apply();};$('#sort').onchange=e=>{state.sort=e.target.value;apply();};$('#cartBtn').onclick=openCart;$('#closeCart').onclick=closeCart;$('#backdrop').onclick=closeCart;$('#checkoutBtn').onclick=openOrder;$('#closeModal').onclick=()=>$('#orderModal').classList.add('hidden');$('#orderForm').onsubmit=submitOrder;$('#shopNow').onclick=()=>document.querySelector('.layout').scrollIntoView({behavior:'smooth'});}
init();
