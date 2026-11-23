const packages = [
  {
    id:1, name:"Surabaya Heritage Tour", badge:"2 Days 1 Night",
    tagline:"Discover the Historical Charm of Surabaya!",
    desc:"Explore the historical landmarks and modern attractions of Surabaya through an exciting two-day journey.",
    duration:"2 Days 1 Night", destination:"Surabaya, East Java", departure:"UNIMUS, Semarang", transport:"Tourist Bus",
    itinerary:[
      {title:"Day 1 – Discover Surabaya", items:["Departure from UNIMUS","Visit Tunjungan Plaza","Visit Museum Sepuluh Nopember","Explore House of Sampoerna","Hotel check-in"]},
      {title:"Day 2 – Surabaya City Tour", items:["Breakfast","Visit Monumen Kapal Selam","Lunch and rest","Return to UNIMUS, Semarang"]}
    ],
    facilities:["Round-trip tourist bus","1-night hotel accommodation","Meals according to itinerary","Attraction entrance tickets","Tour leader and guide","Toll and parking fees"],
    price:1500000, region:"SURABAYA",
    imageUrl:"images/alun-alun-batu.jpg", g:"#f08ab4,#f0c27a"
  },
  {
    id:2, name:"East Java Adventure Tour", badge:"4 Days 3 Nights",
    tagline:"Discover the Beauty of Surabaya and Malang!",
    desc:"Enjoy a memorable four-day journey exploring Surabaya's historical attractions and Malang's beautiful destinations.",
    duration:"4 Days 3 Nights", destination:"Surabaya & Malang, East Java", departure:"UNIMUS, Semarang", transport:"Tourist Bus",
    itinerary:[
      {title:"Day 1 – Discover Surabaya", items:["Departure from UNIMUS","Tunjungan Plaza","Museum Sepuluh Nopember","House of Sampoerna","Hotel check-in"]},
      {title:"Day 2 – Surabaya to Malang", items:["Breakfast","Visit Monumen Kapal Selam","Travel to Malang","Explore Kayutangan Heritage","Hotel check-in"]},
      {title:"Day 3 – Explore Malang", items:["Visit Jatim Park 2","Explore Batu Secret Zoo","Visit Museum Satwa","Enjoy Alun-Alun Kota Batu"]},
      {title:"Day 4 – Back to Semarang", items:["Breakfast and check-out","Departure from Malang","Rest and lunch breaks","Arrival at UNIMUS, Semarang"]}
    ],
    facilities:["Round-trip tourist bus","3-night hotel accommodation","Meals according to itinerary","Attraction entrance tickets","Tour leader and guide","Toll and parking fees"],
    price:2300000, region:"SURABAYA · MALANG",
    gallery:[{src:"images/batu-secret-zoo.jpg",caption:"Batu Secret Zoo"},{src:"images/alun-alun-batu.jpg",caption:"Alun-Alun Kota Wisata Batu"}],
    imageUrl:"images/batu-secret-zoo.jpg", g:"#e5588f,#dfa650"
  }
];

const $ = s => document.querySelector(s);
const rupiah = v => "Rp " + Number(v).toLocaleString("id-ID");
const bg = p => `background-image:url('${p.imageUrl}'),linear-gradient(135deg,${p.g});background-size:cover;background-position:${p.pos||"center"};`;
const byId = id => packages.find(p => p.id === Number(id));
let currentUser = null, orders = [], notifications = [], authMode = "login", toastTimer;

function renderPackages(){
  $("#package-grid").innerHTML = packages.map(p => `
    <article class="package-card">
      <div class="package-image" style="${bg(p)}"><span class="package-badge">${p.badge}</span><span class="seats">🚌 ${p.transport}</span></div>
      <div class="package-body">
        <p class="package-location">EAST JAVA · ${p.region}</p>
        <h3>${p.name}</h3>
        <p class="package-tagline">${p.tagline}</p>
        <p class="route">${p.desc}</p>
        <div class="package-meta"><span>◷ ${p.duration}</span><span>⌂ From ${p.departure}</span></div>
        <div class="price-row"><div><div class="price-label">Starting from</div><div class="price">${rupiah(p.price)}<small> /person</small></div></div>
        <div class="card-actions"><button class="btn btn-light" data-details="${p.id}">Details</button><button class="btn btn-primary" data-book="${p.id}">Book →</button></div></div>
      </div>
    </article>`).join("");
}
function showToast(m){
  const t = $("#toast"); t.textContent = m; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>t.classList.remove("show"),3000);
}
function openModal(id){ $("#"+id).classList.add("open"); $("#"+id).setAttribute("aria-hidden","false"); }
function closeModal(id){ $("#"+id).classList.remove("open"); $("#"+id).setAttribute("aria-hidden","true"); }
function showDetails(id){
  const p = byId(id); if(!p) return;
  $("#detail-content").innerHTML = `
    <span class="eyebrow">TOUR DETAILS</span>
    <h2 id="detail-title">${p.name}</h2>
    <div class="detail-hero" style="${bg(p)}"></div>
    <p class="package-tagline">${p.tagline}</p>
    <p class="detail-desc">${p.desc}</p>
    <div class="meta-grid">
      <div><small>DURATION</small>${p.duration}</div>
      <div><small>DESTINATION</small>${p.destination}</div>
      <div><small>DEPARTURE</small>${p.departure}</div>
      <div><small>TRANSPORTATION</small>${p.transport}</div>
    </div>
    ${p.gallery ? `<h4 class="detail-title">DESTINATION HIGHLIGHTS</h4><div class="gallery">${p.gallery.map(g=>`<figure><img src="${g.src}" alt="${g.caption}"><figcaption>${g.caption}</figcaption></figure>`).join("")}</div>` : ""}
    <h4 class="detail-title">ITINERARY</h4>
    ${p.itinerary.map(d=>`<div class="day-block"><h4>${d.title}</h4><ul>${d.items.map(i=>`<li>${i}</li>`).join("")}</ul></div>`).join("")}
    <h4 class="detail-title">FACILITIES INCLUDED</h4>
    <ul class="facility-list">${p.facilities.map(f=>`<li>${f}</li>`).join("")}</ul>
    <div class="detail-foot"><div><div class="price-label">Starting from</div><div class="price">${rupiah(p.price)} <small>/person</small></div></div>
    <button class="btn btn-primary" data-book="${p.id}">Book this tour →</button></div>`;
  openModal("detail-modal");
}
function setAuthMode(mode){
  authMode = mode; const r = mode === "register";
  $("#auth-title").textContent = r ? "Create your account." : "Start your adventure.";
  $("#auth-subtitle").textContent = r ? "Sign up to save your dream trips." : "Log in to view and save your trips.";
  $("#name-field").hidden = !r; $("#full-name").required = r;
  $("#auth-submit").textContent = r ? "Create Account" : "Log in";
  $("#switch-text").textContent = r ? "Already have an account?" : "Don't have an account?";
  $("#switch-auth").textContent = r ? "Log in here" : "Sign up now";
}
function updateDashboard(){
  $("#dashboard-name").textContent = currentUser ? currentUser.name : "nomadé Guest";
  $("#dashboard-email").textContent = currentUser ? currentUser.email : "Log in to save your bookings";
  $("#user-avatar").textContent = currentUser ? currentUser.name.charAt(0).toUpperCase() : "G";
  $("#active-orders").textContent = orders.length;
  $("#payment-status").textContent = orders.length ? "Pending" : "—";
  $("#notification-count").textContent = notifications.length;
  $("#notification-dot").classList.toggle("show", notifications.length > 0);
  const list = $("#order-list");
  if(!orders.length){
    list.className = "empty-state";
    list.innerHTML = `<span class="empty-icon">✈</span><b>No trips yet</b><p>Pick a tour and book your first trip.</p><a href="#packages" class="text-link">View tour packages →</a>`;
  } else {
    list.className = "";
    list.innerHTML = orders.map(o=>`<div class="order-item"><div><b>${o.packageName}</b><small>${o.code} · ${o.date} · ${o.travellers} traveller(s)</small><small>Total: ${rupiah(o.total)}</small></div><span class="status-pill">Pending</span></div>`).join("");
  }
  $("#notification-list").innerHTML = notifications.length
    ? notifications.map(n=>`<div class="notification-item"><b>${n.title}</b><p>${n.message}</p><small>${n.time}</small></div>`).join("")
    : `<div class="empty-state"><span class="empty-icon">♧</span><b>No notifications yet</b><p>Booking updates will appear here.</p></div>`;
}
function addNotification(title,message){
  notifications.unshift({title,message,time:new Date().toLocaleString("en-GB",{dateStyle:"medium",timeStyle:"short"})});
  updateDashboard();
}
function openBooking(id){
  closeModal("detail-modal");
  if(!currentUser){ showToast("Please log in or sign up before booking."); setAuthMode("login"); openModal("auth-modal"); return; }
  const p = byId(id); if(!p) return;
  $("#booking-package-id").value = p.id;
  $("#booking-package").innerHTML = `<div class="booking-thumb" style="${bg(p)}"></div><div><b>${p.name}</b><small>${p.duration} · ${p.destination}</small><small>${rupiah(p.price)} / person</small></div>`;
  const d = new Date(); d.setDate(d.getDate()+30);
  const iso = d.toISOString().slice(0,10);
  $("#departure-date").min = iso; $("#departure-date").value = iso;
  $("#travellers").value = "1";
  updateBookingTotal(); openModal("booking-modal");
}
function updateBookingTotal(){
  const p = byId($("#booking-package-id").value);
  if(p) $("#booking-total").textContent = rupiah(p.price * Number($("#travellers").value));
}

$("#login-open").addEventListener("click",()=>{setAuthMode("login");openModal("auth-modal")});
$("#register-open").addEventListener("click",()=>{setAuthMode("register");openModal("auth-modal")});
$("#switch-auth").addEventListener("click",()=>setAuthMode(authMode==="login"?"register":"login"));
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
document.querySelectorAll(".modal-backdrop").forEach(b=>b.addEventListener("click",e=>{if(e.target===b)closeModal(b.id)}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){document.querySelectorAll(".modal-backdrop.open").forEach(m=>closeModal(m.id));$("#notification-panel").classList.remove("open")}});
document.addEventListener("click",e=>{
  const d = e.target.closest("[data-details]"); if(d){ showDetails(d.dataset.details); return; }
  const b = e.target.closest("[data-book]"); if(b){ openBooking(b.dataset.book); return; }
  if(!e.target.closest("#notification-panel")&&!e.target.closest("#notifications-open")) $("#notification-panel").classList.remove("open");
});
$("#auth-form").addEventListener("submit",e=>{
  e.preventDefault();
  const email = $("#email").value.trim(), password = $("#password").value;
  if(password.length<4){showToast("Password must be at least 4 characters.");return}
  const name = authMode==="register" ? $("#full-name").value.trim() : (email.split("@")[0]||"Traveller");
  if(authMode==="register"&&!name){showToast("Full name is required.");return}
  currentUser = {name,email};
  if($("#remember").checked){ try{localStorage.setItem("nomade-demo-user",JSON.stringify(currentUser))}catch(err){} }
  closeModal("auth-modal"); updateDashboard();
  showToast(authMode==="register"?"Demo account created successfully.":"Logged in as "+name+".");
  addNotification("Welcome to nomadé",`Hi ${name}, find the East Java trip that suits you best.`);
});
$("#travellers").addEventListener("change",updateBookingTotal);
$("#booking-form").addEventListener("submit",e=>{
  e.preventDefault();
  const p = byId($("#booking-package-id").value), date = $("#departure-date").value, travellers = Number($("#travellers").value);
  if(!p||!date){showToast("Please complete the booking details.");return}
  const booking = {packageName:p.name,code:"NMD-"+Math.random().toString(36).slice(2,8).toUpperCase(),date:new Date(date+"T00:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),travellers,total:p.price*travellers};
  orders.unshift(booking); closeModal("booking-modal");
  addNotification("Booking successful!",`${p.name} · Booking code ${booking.code}. Total ${rupiah(booking.total)}. This is a simulation, so no payment was processed.`);
  showToast("Booking successful! Code: "+booking.code);
  $("#dashboard").scrollIntoView({behavior:"smooth"});
});
$("#notifications-open").addEventListener("click",()=>$("#notification-panel").classList.toggle("open"));
$("#notification-close").addEventListener("click",()=>$("#notification-panel").classList.remove("open"));
try{ const s = localStorage.getItem("nomade-demo-user"); if(s) currentUser = JSON.parse(s); }catch(err){}
renderPackages(); updateDashboard();
