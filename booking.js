/* =====================================================================
   LYAN · Book engine (sin backend) — checkout por WhatsApp
   Configura el número abajo. Formato internacional sin "+", ej. 5216241234567
   ===================================================================== */
const BOOKING = {
  whatsapp: "",                       // ← número de Lyan. Vacío = cae a email.
  email: "lyanpro1500@gmail.com",
  minLeadDays: 2,                     // no se puede reservar con menos de 2 días
  services: [
    { id: "wedding",    icon: "💍", es: "Boda",              en: "Wedding" },
    { id: "brand",      icon: "🎬", es: "Marca / Contenido", en: "Brand / Content" },
    { id: "realestate", icon: "🏡", es: "Bienes raíces",     en: "Real Estate" },
    { id: "event",      icon: "🏆", es: "Evento / Deportes", en: "Event / Sports" },
    { id: "aerial",     icon: "🚁", es: "Aéreo / Dron",      en: "Aerial / Drone" },
    { id: "underwater", icon: "🤿", es: "360° / Submarino",  en: "360° / Underwater" },
    { id: "other",      icon: "✨", es: "Otro proyecto",     en: "Something else" },
  ],
  packages: [
    { id: "half",  es: "Medio día",     en: "Half day",      hint: { es: "hasta 4 h",  en: "up to 4 h" } },
    { id: "full",  es: "Día completo",  en: "Full day",      hint: { es: "hasta 8 h",  en: "up to 8 h" } },
    { id: "multi", es: "Varios días",   en: "Multi-day",     hint: { es: "2+ días",    en: "2+ days" } },
  ],
  deliverables: [
    { id: "film",  es: "Film / video",  en: "Film / video" },
    { id: "photo", es: "Fotografía",    en: "Photography" },
    { id: "drone", es: "Tomas aéreas",  en: "Aerial shots" },
    { id: "reels", es: "Reels para redes", en: "Social reels" },
  ],
  locations: [
    { id: "cabo",  es: "Los Cabos",  en: "Los Cabos" },
    { id: "lapaz", es: "La Paz",     en: "La Paz" },
    { id: "bcs",   es: "Otro lugar en BCS", en: "Elsewhere in BCS" },
    { id: "travel",es: "Fuera de Baja (viajo)", en: "Outside Baja (I travel)" },
  ],
  times: [
    { id: "sunrise", es: "Amanecer", en: "Sunrise" },
    { id: "morning", es: "Mañana",   en: "Morning" },
    { id: "midday",  es: "Mediodía", en: "Midday" },
    { id: "sunset",  es: "Atardecer",en: "Sunset" },
    { id: "flex",    es: "Flexible", en: "Flexible" },
  ],
};

const T = {
  es: {
    title: "Reservar", step: "Paso", of: "de",
    s1: "¿Qué vamos a filmar?", s2: "¿Cuándo y dónde?", s3: "Tus datos", s4: "Resumen",
    pkg: "Duración", deliv: "Entregables", loc: "Lugar", time: "Horario preferido",
    flexible: "Mis fechas son flexibles", locDetail: "Locación exacta (opcional)",
    name: "Nombre", phone: "WhatsApp", emailL: "Email", notes: "Cuéntame del proyecto",
    notesPh: "Tipo de evento, cuántas personas, referencias, qué te gustaría lograr…",
    back: "Atrás", next: "Continuar", send: "Enviar por WhatsApp", sendMail: "Enviar por email",
    reqService: "Elige un servicio", reqDate: "Elige una fecha", reqName: "Escribe tu nombre", reqPhone: "Escribe tu WhatsApp",
    summaryNote: "Al enviar se abre WhatsApp con este resumen. Te respondo en menos de 24 h con disponibilidad y cotización.",
    months: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
    days: ["Do","Lu","Ma","Mi","Ju","Vi","Sá"],
    msgIntro: "Hola Lyan, quiero reservar una producción:",
    f: { service: "Servicio", pkg: "Duración", deliv: "Entregables", date: "Fecha", flex: "fechas flexibles", loc: "Lugar", time: "Horario", name: "Nombre", phone: "WhatsApp", email: "Email", notes: "Notas" },
    msgOutro: "¿Tienes disponibilidad? Enviado desde el sitio web.",
  },
  en: {
    title: "Book", step: "Step", of: "of",
    s1: "What are we shooting?", s2: "When and where?", s3: "Your details", s4: "Summary",
    pkg: "Duration", deliv: "Deliverables", loc: "Location", time: "Preferred time",
    flexible: "My dates are flexible", locDetail: "Exact venue (optional)",
    name: "Name", phone: "WhatsApp", emailL: "Email", notes: "Tell me about the project",
    notesPh: "Type of event, how many people, references, what you want to achieve…",
    back: "Back", next: "Continue", send: "Send via WhatsApp", sendMail: "Send by email",
    reqService: "Pick a service", reqDate: "Pick a date", reqName: "Enter your name", reqPhone: "Enter your WhatsApp",
    summaryNote: "Sending opens WhatsApp with this summary. I reply within 24 h with availability and a quote.",
    months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    days: ["Su","Mo","Tu","We","Th","Fr","Sa"],
    msgIntro: "Hi Lyan, I'd like to book a shoot:",
    f: { service: "Service", pkg: "Duration", deliv: "Deliverables", date: "Date", flex: "flexible dates", loc: "Location", time: "Time", name: "Name", phone: "WhatsApp", email: "Email", notes: "Notes" },
    msgOutro: "Are you available? Sent from the website.",
  },
};

(() => {
  const L = () => (document.documentElement.lang === "en" ? "en" : "es");
  const t = k => T[L()][k];
  const label = o => o[L()];

  /* ---------- state (draft persisted) ---------- */
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const blank = () => ({ step: 1, service: null, pkg: "full", deliv: ["film"], date: null, flexible: false, loc: "cabo", locDetail: "", time: "sunset", name: "", phone: "", email: "", notes: "" });
  let S = blank();
  try { const d = JSON.parse(localStorage.getItem("lyan-booking") || "null"); if (d && typeof d === "object") S = { ...blank(), ...d, step: 1 }; } catch {}
  const save = () => { try { localStorage.setItem("lyan-booking", JSON.stringify(S)); } catch {} };
  let view = { y: today.getFullYear(), m: today.getMonth() };
  let error = "";

  /* ---------- DOM ---------- */
  const root = document.createElement("div");
  root.className = "bk"; root.hidden = true;
  root.innerHTML = `<div class="bk-backdrop" data-close></div>
    <div class="bk-panel" role="dialog" aria-modal="true" aria-labelledby="bkTitle">
      <button class="bk-close" data-close aria-label="Cerrar">×</button>
      <div class="bk-head"><p class="eyebrow" id="bkStep"></p><h3 id="bkTitle"></h3><div class="bk-bar"><span id="bkBar"></span></div></div>
      <div class="bk-body" id="bkBody"></div>
      <div class="bk-foot"><p class="bk-error" id="bkError"></p><div class="bk-actions" id="bkActions"></div></div>
    </div>`;
  document.body.appendChild(root);
  const $ = sel => root.querySelector(sel);

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const chip = (group, o, active, multi) => `<button type="button" class="bk-chip${active ? " on" : ""}" data-pick="${group}" data-val="${o.id}" ${multi ? 'aria-pressed="' + active + '"' : ""}>${o.icon ? `<span class="bk-ico">${o.icon}</span>` : ""}<span>${esc(label(o))}</span>${o.hint ? `<small>${esc(label(o.hint))}</small>` : ""}</button>`;

  const fmtDate = ymd => { if (!ymd) return ""; const [y, m, d] = ymd.split("-").map(Number); return `${d} ${t("months")[m - 1]} ${y}`; };
  const ymd = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const minDate = new Date(today); minDate.setDate(minDate.getDate() + BOOKING.minLeadDays);

  function calendar() {
    const first = new Date(view.y, view.m, 1).getDay();
    const n = new Date(view.y, view.m + 1, 0).getDate();
    const cells = [...Array(first).fill(null), ...Array.from({ length: n }, (_, i) => i + 1)];
    while (cells.length % 7) cells.push(null);
    const canPrev = new Date(view.y, view.m, 1) > new Date(today.getFullYear(), today.getMonth(), 1);
    return `<div class="bk-cal">
      <div class="bk-cal-head"><button type="button" data-nav="-1" ${canPrev ? "" : "disabled"} aria-label="prev">‹</button><strong>${t("months")[view.m]} ${view.y}</strong><button type="button" data-nav="1" aria-label="next">›</button></div>
      <div class="bk-cal-grid">${t("days").map(d => `<span class="bk-dow">${d}</span>`).join("")}
      ${cells.map(d => { if (!d) return "<span></span>"; const k = ymd(view.y, view.m, d); const dt = new Date(view.y, view.m, d); const off = dt < minDate; return `<button type="button" class="bk-day${S.date === k ? " on" : ""}" data-date="${k}" ${off ? "disabled" : ""}>${d}</button>`; }).join("")}</div>
    </div>`;
  }

  function field(id, lab, type = "text", ph = "") {
    return `<label class="bk-field"><span>${lab}</span><input type="${type}" data-f="${id}" value="${esc(S[id])}" placeholder="${esc(ph)}" autocomplete="${id === "name" ? "name" : id === "phone" ? "tel" : id === "email" ? "email" : "off"}" /></label>`;
  }

  const findL = (list, id) => { const o = list.find(x => x.id === id); return o ? label(o) : ""; };

  function summaryRows() {
    const r = [];
    const f = t("f");
    r.push([f.service, findL(BOOKING.services, S.service)]);
    r.push([f.pkg, findL(BOOKING.packages, S.pkg)]);
    r.push([f.deliv, S.deliv.map(d => findL(BOOKING.deliverables, d)).join(", ")]);
    r.push([f.date, fmtDate(S.date) + (S.flexible ? ` (${f.flex})` : "")]);
    r.push([f.loc, findL(BOOKING.locations, S.loc) + (S.locDetail ? ` · ${S.locDetail}` : "")]);
    r.push([f.time, findL(BOOKING.times, S.time)]);
    r.push([f.name, S.name]); r.push([f.phone, S.phone]);
    if (S.email) r.push([f.email, S.email]);
    if (S.notes) r.push([f.notes, S.notes]);
    return r;
  }

  function message() {
    const lines = summaryRows().map(([k, v]) => `• ${k}: ${v}`);
    return `${t("msgIntro")}\n\n${lines.join("\n")}\n\n${t("msgOutro")}`;
  }

  function render() {
    const titles = [t("s1"), t("s2"), t("s3"), t("s4")];
    $("#bkStep").textContent = `${t("title")} · ${t("step")} ${S.step} ${t("of")} 4`;
    $("#bkTitle").textContent = titles[S.step - 1];
    $("#bkBar").style.width = `${(S.step / 4) * 100}%`;
    $("#bkError").textContent = error;
    let html = "";
    if (S.step === 1) {
      html = `<div class="bk-grid">${BOOKING.services.map(o => chip("service", o, S.service === o.id)).join("")}</div>
        <p class="bk-lab">${t("pkg")}</p><div class="bk-row">${BOOKING.packages.map(o => chip("pkg", o, S.pkg === o.id)).join("")}</div>
        <p class="bk-lab">${t("deliv")}</p><div class="bk-row">${BOOKING.deliverables.map(o => chip("deliv", o, S.deliv.includes(o.id), true)).join("")}</div>`;
    } else if (S.step === 2) {
      html = `<div class="bk-two">${calendar()}
        <div>
          <label class="bk-check"><input type="checkbox" data-f="flexible" ${S.flexible ? "checked" : ""}/> <span>${t("flexible")}</span></label>
          <p class="bk-lab">${t("loc")}</p><div class="bk-row">${BOOKING.locations.map(o => chip("loc", o, S.loc === o.id)).join("")}</div>
          ${field("locDetail", t("locDetail"), "text", "Hotel, playa, rancho…")}
          <p class="bk-lab">${t("time")}</p><div class="bk-row">${BOOKING.times.map(o => chip("time", o, S.time === o.id)).join("")}</div>
        </div></div>`;
    } else if (S.step === 3) {
      html = `<div class="bk-form">${field("name", t("name"))}${field("phone", t("phone"), "tel", "+52 …")}${field("email", t("emailL"), "email")}
        <label class="bk-field bk-span"><span>${t("notes")}</span><textarea data-f="notes" rows="4" placeholder="${esc(t("notesPh"))}">${esc(S.notes)}</textarea></label></div>`;
    } else {
      html = `<dl class="bk-summary">${summaryRows().map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl><p class="bk-note">${t("summaryNote")}</p>`;
    }
    $("#bkBody").innerHTML = html;
    const last = S.step === 4, wa = !!BOOKING.whatsapp;
    $("#bkActions").innerHTML = `${S.step > 1 ? `<button type="button" class="btn btn-ghost" data-go="-1">${t("back")}</button>` : ""}
      ${last ? `<a class="btn btn-primary bk-send" href="${sendHref()}" target="_blank" rel="noopener" data-send>${wa ? t("send") : t("sendMail")}</a>` : `<button type="button" class="btn btn-primary" data-go="1">${t("next")}</button>`}`;
    $("#bkBody").scrollTop = 0;
  }

  function sendHref() {
    const txt = message();
    if (BOOKING.whatsapp) return `https://wa.me/${BOOKING.whatsapp}?text=${encodeURIComponent(txt)}`;
    return `mailto:${BOOKING.email}?subject=${encodeURIComponent("Reserva · " + (findL(BOOKING.services, S.service) || "LYAN"))}&body=${encodeURIComponent(txt)}`;
  }

  function validate() {
    error = "";
    if (S.step === 1 && !S.service) error = t("reqService");
    if (S.step === 2 && !S.date) error = t("reqDate");
    if (S.step === 3 && !S.name.trim()) error = t("reqName");
    else if (S.step === 3 && !S.phone.trim()) error = t("reqPhone");
    return !error;
  }

  /* ---------- events ---------- */
  root.addEventListener("click", e => {
    const el = e.target.closest("[data-close],[data-pick],[data-nav],[data-date],[data-go],[data-send]");
    if (!el) return;
    if (el.hasAttribute("data-close")) return close();
    if (el.dataset.pick) {
      const g = el.dataset.pick, v = el.dataset.val;
      if (g === "deliv") S.deliv = S.deliv.includes(v) ? S.deliv.filter(x => x !== v) : [...S.deliv, v];
      else S[g] = v;
      error = ""; save(); render(); return;
    }
    if (el.dataset.nav) { view.m += +el.dataset.nav; if (view.m < 0) { view.m = 11; view.y--; } if (view.m > 11) { view.m = 0; view.y++; } render(); return; }
    if (el.dataset.date) { S.date = S.date === el.dataset.date ? null : el.dataset.date; error = ""; save(); render(); return; }
    if (el.dataset.go) { const d = +el.dataset.go; if (d > 0 && !validate()) { render(); return; } S.step = Math.min(4, Math.max(1, S.step + d)); error = ""; render(); return; }
    if (el.hasAttribute("data-send")) { try { localStorage.removeItem("lyan-booking"); } catch {} setTimeout(close, 600); }
  });
  root.addEventListener("input", e => { const f = e.target.dataset.f; if (!f) return; S[f] = e.target.type === "checkbox" ? e.target.checked : e.target.value; save(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !root.hidden) close(); });

  function open(service) {
    if (service && BOOKING.services.some(s => s.id === service)) S.service = service;
    if (S.date) { const [y, m] = S.date.split("-").map(Number); view = { y, m: m - 1 }; }
    S.step = 1; error = ""; root.hidden = false; document.body.style.overflow = "hidden"; render();
    setTimeout(() => $(".bk-close").focus(), 50);
  }
  function close() { root.hidden = true; document.body.style.overflow = ""; }

  document.addEventListener("click", e => {
    const a = e.target.closest("[data-book]");
    if (!a) return;
    e.preventDefault(); open(a.dataset.book || null);
  });
  document.getElementById("langToggle")?.addEventListener("click", () => { if (!root.hidden) setTimeout(render, 0); });

  /* floating WhatsApp button */
  const fab = document.createElement("a");
  fab.className = "wa-fab"; fab.setAttribute("aria-label", "WhatsApp"); fab.href = "#"; fab.dataset.book = "";
  fab.innerHTML = `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>`;
  document.body.appendChild(fab);
})();
