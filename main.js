/* ===== Films ===== */
const FILMS = [
  { id: "w3Bb3DCHkKE", es: "My Best Drone Moments", en: "My Best Drone Moments", tag: { es: "Showreel aéreo", en: "Aerial showreel" }, wide: true },
  { id: "H2QswemESVg", es: "Gracias 2023", en: "Thank You 2023", tag: { es: "Recap anual", en: "Year recap" } },
  { id: "S5hUpPsPWUg", es: "Mi film bajo el agua", en: "My Underwater Film", tag: { es: "Submarino", en: "Underwater" } },
  { id: "IT7qEkj4PjY", es: "Banff, Canadá", en: "Banff, Canada", tag: { es: "Cinematic", en: "Cinematic" } },
  { id: "Zyb8TYFKU4Y", es: "Un día de pesca en Cabo", en: "A Fishing Day in Cabo", tag: { es: "Pesca deportiva", en: "Sport fishing" } },
  { id: "hpSocNV74f0", es: "Gracias 2022", en: "Thank You 2022", tag: { es: "DJI Air 2S", en: "DJI Air 2S" } },
  { id: "dDno7UmIGms", es: "México", en: "Mexico", tag: { es: "Viaje", en: "Travel" } },
  { id: "5hPbolLH5jw", es: "Aventura", en: "Adventure", tag: { es: "Viaje", en: "Travel" } },
  { id: "hZE7XNbMdLw", es: "Volé mi dron en Teotihuacán", en: "Flying My Drone at Teotihuacan", tag: { es: "Vlog", en: "Vlog" } },
];

/* ===== i18n ===== */
const I18N = {
  en: {
    "nav.films": "Films", "nav.services": "Services", "nav.about": "About", "nav.contact": "Contact",
    "hero.sub": "Adventure Filmmaker · Los Cabos, Mexico → Worldwide",
    "hero.cta1": "Watch films", "hero.cta2": "Book now",
    "featured.eyebrow": "Featured film",
    "featured.title": "Bisbee's 2025: the most expensive fishing tournament in the world",
    "featured.body": "Three days on the water filming the Los Cabos Black & Blue, with a $7.5M USD purse. Yachts, marlin and the adrenaline of sport fishing from the air and from the deck.",
    "featured.cta": "Play",
    "films.eyebrow": "Portfolio", "films.title": "Films",
    "films.lead": "Stories of travel, ocean and adventure. Shot by drone, handheld and underwater.",
    "films.more": "See all on YouTube",
    "services.title": "Services",
    "services.lead": "Full audiovisual production in Los Cabos and wherever the story takes us. Pro cameras, drone and 360°.",
    "s1.t": "Weddings", "s1.b": "Cinematic film and full-day photography, with aerial shots of the ceremony and venue.",
    "s2.t": "Brands", "s2.b": "Content for social, campaigns and launches. Reels, spots and on-location product photography.",
    "s3.t": "Real Estate", "s3.b": "Video walkthroughs, interior photography and aerial views that sell the property and its surroundings.",
    "s4.t": "Events & Sports", "s4.b": "Fishing tournaments, competitions and corporate events. Live coverage and an edited highlight film.",
    "s5.t": "Aerial / Drone", "s5.b": "Certified professional pilot. Cinematic shots, FPV and open-water tracking.",
    "s6.t": "360° & Underwater", "s6.b": "Immersive experiences and underwater video for destinations, hotels and adventure tourism.",
    "about.eyebrow": "About", "about.title": "Christopher Lyan",
    "about.p1": "I'm an adventure filmmaker and photographer based in Los Cabos, Baja California Sur. Since 2017 I've been telling travel stories on video: the ocean, the mountains, sport fishing and the people who live by them.",
    "about.p2": "Professional drone pilot. I've filmed from the cliffs of Banff to the bottom of the Sea of Cortez, and every year I close with a thank-you film for the people who made the adventure possible.",
    "st1": "filming since", "st2": "coverage 2024 · 25 · 26", "st3": "locations",
    "contact.eyebrow": "Bookings & collaborations",
    "contact.title": "Let's make the next story.",
    "contact.lead": "Tell me what you want to film, where and when. I reply within 24 hours.",
    "contact.book": "Book a date", "svc.book": "Book",
  },
};
const ES = {};
document.querySelectorAll("[data-i18n]").forEach(el => { ES[el.dataset.i18n] = el.innerHTML; });
I18N.es = ES;

let lang = (() => {
  try { return localStorage.getItem("lyan-lang"); } catch { return null; }
})() || (navigator.language && navigator.language.startsWith("es") ? "es" : "en");

function applyLang(l) {
  lang = l;
  document.documentElement.lang = l;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const v = I18N[l][el.dataset.i18n];
    if (v != null) el.innerHTML = v;
  });
  document.title = l === "es" ? "LYAN — Adventure Filmmaker · Los Cabos" : "LYAN — Adventure Filmmaker · Los Cabos, Mexico";
  renderFilms();
  try { localStorage.setItem("lyan-lang", l); } catch {}
}
document.getElementById("langToggle").addEventListener("click", () => applyLang(lang === "es" ? "en" : "es"));

/* ===== Film grid ===== */
const grid = document.getElementById("filmGrid");
function renderFilms() {
  grid.innerHTML = FILMS.map(f => `
    <button class="film reveal${f.wide ? " wide" : ""}" data-video="${f.id}" aria-label="${f[lang]}">
      <img src="https://i.ytimg.com/vi/${f.id}/maxresdefault.jpg" alt="" loading="lazy" data-fallback="https://i.ytimg.com/vi/${f.id}/hqdefault.jpg" />
      <span class="play"></span>
      <span class="film-meta"><span>${f.tag[lang]}</span><h3>${f[lang]}</h3></span>
    </button>`).join("");
  observeReveals();
  fixThumbs();
}
/* YouTube returns a 120x90 placeholder (not a 404) when maxres is missing */
function fixThumbs() {
  document.querySelectorAll("img[data-fallback]").forEach(img => {
    const check = () => { if (img.naturalWidth <= 120) { img.src = img.dataset.fallback; img.removeAttribute("data-fallback"); } };
    img.complete ? check() : img.addEventListener("load", check, { once: true });
    img.addEventListener("error", () => { img.src = img.dataset.fallback; }, { once: true });
  });
}

/* ===== Lightbox ===== */
const lb = document.getElementById("lightbox");
const lbFrame = document.getElementById("lightboxIframe");
function openVideo(id) {
  lbFrame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
  lb.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeVideo() {
  lb.hidden = true;
  lbFrame.src = "";
  document.body.style.overflow = "";
}
document.addEventListener("click", e => {
  const t = e.target.closest("[data-video]");
  if (t) { openVideo(t.dataset.video); return; }
  if (e.target === lb || e.target.closest("#lightboxClose")) closeVideo();
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && !lb.hidden) closeVideo(); });

/* ===== Nav + reveal ===== */
const nav = document.querySelector(".nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 40), { passive: true });

const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.12 });
function observeReveals() { document.querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el)); }
document.querySelectorAll(".section-head, .service, .featured-copy, .featured-thumb, .about-copy, .about-media, .contact .container").forEach(el => el.classList.add("reveal"));

document.getElementById("year").textContent = new Date().getFullYear();
applyLang(lang);

/* ===== Hero video: reveal only once YouTube is playing; loop via API (no playlist UI) ===== */
(() => {
  const wrap = document.querySelector(".hero-video");
  const frame = document.getElementById("heroIframe");
  if (!wrap || !frame) return;
  const send = (func, args = []) => frame.contentWindow && frame.contentWindow.postMessage(JSON.stringify({ event: "command", func, args }), "*");
  let shown = false, looping = false;
  const reveal = () => wrap.classList.add("playing");
  const show = () => { if (!shown) { shown = true; setTimeout(reveal, 3500); } };
  const restart = () => {
    if (looping) return;
    looping = true;
    wrap.classList.remove("playing");            // fade to poster (1.6s)
    setTimeout(() => { send("seekTo", [6, true]); send("playVideo"); }, 1500);
    setTimeout(() => { reveal(); looping = false; }, 4500); // fade back once the seek has settled
  };
  addEventListener("message", e => {
    if (!/youtube(-nocookie)?\.com$/.test(new URL(e.origin).hostname)) return;
    let d; try { d = typeof e.data === "string" ? JSON.parse(e.data) : e.data; } catch { return; }
    if (!d) return;
    if (d.event === "onStateChange" && d.info === 1) show();
    if (d.event === "infoDelivery" && d.info) {
      const i = d.info;
      if (i.playerState === 1) show();
      if (i.duration && i.currentTime != null && i.duration - i.currentTime < 4) restart();
      if (i.playerState === 0) restart();
    }
  });
  frame.addEventListener("load", () => {
    frame.contentWindow.postMessage(JSON.stringify({ event: "listening", id: "hero" }), "*");
    send("mute"); send("playVideo");
    setTimeout(show, 6000);
  });
})();
