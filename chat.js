/* Asistente flotante del sitio (portado de SiteChat de axelsandoval.dev) con branding QuickTurno.
   Habla con /api/chat; corto (MAX_USER mensajes) y siempre ofrece seguir en WhatsApp. */
(() => {
  const WA = "5216242370966";
  const T = {
    es: {
      open: "Abrir chat", close: "Cerrar chat", title: "Asistente de Lyan", sub: "Asistente con IA · QuickTurno",
      hello: "Hola, soy el asistente de Lyan. Puedo contarte qué filma y ayudarte a reservar una fecha. ¿Qué proyecto tienes en mente?",
      chips: ["Quiero cotizar una boda", "Reservar una fecha", "¿Qué hace Lyan?"],
      ph: "Escribe tu mensaje...", send: "Enviar", wa: "Continuar en WhatsApp",
      err: "No pude responder ahora. Escríbele a Lyan por WhatsApp.",
      limit: "El asistente llegó a su límite por hoy. Escríbele a Lyan por WhatsApp.",
      off: "El asistente no está disponible en este momento. Escríbele a Lyan por WhatsApp.",
      cap: "Hasta aquí llega el asistente. Sigue la conversación con Lyan por WhatsApp.",
      left: n => `${n} ${n === 1 ? "mensaje restante" : "mensajes restantes"}`,
      bubble: "¿Tienes un proyecto? Pregúntale al asistente", waMsg: "Hola Lyan, vengo del sitio web y quiero cotizar una producción.",
    },
    en: {
      open: "Open chat", close: "Close chat", title: "Lyan's assistant", sub: "AI assistant · QuickTurno",
      hello: "Hi, I'm Lyan's assistant. I can tell you what he shoots and help you book a date. What project do you have in mind?",
      chips: ["I want a wedding quote", "Book a date", "What does Lyan do?"],
      ph: "Type your message...", send: "Send", wa: "Continue on WhatsApp",
      err: "I couldn't answer right now. Message Lyan on WhatsApp.",
      limit: "The assistant reached its limit for today. Message Lyan on WhatsApp.",
      off: "The assistant is unavailable right now. Message Lyan on WhatsApp.",
      cap: "This is as far as the assistant goes. Continue with Lyan on WhatsApp.",
      left: n => `${n} ${n === 1 ? "message left" : "messages left"}`,
      bubble: "Have a project? Ask the assistant", waMsg: "Hi Lyan, I'm coming from the website and I'd like a quote for a shoot.",
    },
  };
  const L = () => (document.documentElement.lang === "en" ? "en" : "es");
  const c = k => T[L()][k];
  const MAX_USER = 8, KEY = "lyan-chat:v1";
  const MARK = `<img src="assets/turno-mark.svg" alt="" width="38" height="38" />`;
  const WaIcon = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.5A9.9 9.9 0 1 0 12.04 2zm5.8 14.05c-.25.7-1.45 1.33-2 1.4-.52.08-1.17.1-1.9-.12-.44-.14-1-.33-1.73-.64-3.04-1.3-5-4.37-5.15-4.57-.15-.2-1.23-1.63-1.23-3.1s.78-2.2 1.05-2.5c.28-.3.6-.37.8-.37h.58c.18 0 .43-.07.67.52.25.6.85 2.07.92 2.22.08.15.13.33.03.52-.1.2-.15.32-.3.5-.15.17-.32.38-.45.5-.15.15-.3.3-.13.6.18.3.77 1.27 1.65 2.05 1.13 1 2.08 1.3 2.38 1.45.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.28.1 1.75.83 2.05.98.3.15.5.22.57.35.08.12.08.72-.17 1.4z"/></svg>`;

  let open = false, busy = false, note = "", msgs = [{ role: "assistant", content: c("hello") }];
  try { const s = JSON.parse(sessionStorage.getItem(KEY) || "null"); if (Array.isArray(s) && s.length > 1) msgs = s; } catch {}
  const persist = () => { if (msgs.length > 1) try { sessionStorage.setItem(KEY, JSON.stringify(msgs)); } catch {} };
  const used = () => msgs.filter(m => m.role === "user").length;
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const waHref = () => `https://wa.me/${WA}?text=${encodeURIComponent(c("waMsg"))}`;

  const root = document.createElement("div"); root.className = "waf";
  document.body.appendChild(root);

  function render() {
    const done = used() >= MAX_USER;
    root.innerHTML = `
      ${open ? `<div class="sc" role="dialog" aria-label="${esc(c("title"))}">
        <div class="sc-head"><span class="sc-av" aria-hidden="true">${MARK}</span>
          <div><strong>${esc(c("title"))}</strong><small>${esc(c("sub"))}</small></div>
          <button type="button" class="sc-x" data-close aria-label="${esc(c("close"))}">×</button></div>
        <div class="sc-body" aria-live="polite">
          ${msgs.map(m => `<div class="sc-m sc-${m.role}">${esc(m.content)}</div>`).join("")}
          ${busy ? `<div class="sc-m sc-assistant sc-typing" aria-label="..."><i></i><i></i><i></i></div>` : ""}
        </div>
        ${msgs.length === 1 ? `<div class="sc-chips">${c("chips").map(ch => `<button type="button" data-chip="${esc(ch)}">${esc(ch)}</button>`).join("")}</div>` : ""}
        ${note || done ? `<p class="sc-note" role="status">${esc(note || c("cap"))}</p>` : ""}
        ${done ? "" : `<form class="sc-form"><input type="text" placeholder="${esc(c("ph"))}" maxlength="400" aria-label="${esc(c("ph"))}" ${busy ? "disabled" : ""} autocomplete="off" /><button type="submit" ${busy ? "disabled" : ""}>${esc(c("send"))}</button></form>`}
        <div class="sc-foot"><a class="sc-wa" href="${waHref()}" target="_blank" rel="noopener">${WaIcon}${esc(c("wa"))}</a>${!done && used() > 0 ? `<small>${esc(c("left")(MAX_USER - used()))}</small>` : ""}</div>
      </div>` : ""}
      ${!open && bubble ? `<div class="waf-bubble" role="status"><button type="button" class="waf-x" data-bubble-x aria-label="×">×</button><button type="button" class="waf-bubble-btn" data-open>${esc(c("bubble"))}</button></div>` : ""}
      <button type="button" class="waf-btn${open ? " is-open" : ""}" data-toggle aria-label="${esc(open ? c("close") : c("open"))}" aria-expanded="${open}">${open ? `<span class="waf-close" aria-hidden="true">×</span>` : MARK}</button>`;
    const body = root.querySelector(".sc-body"); if (body) body.scrollTop = body.scrollHeight;
    if (open && !busy) root.querySelector(".sc-form input")?.focus({ preventScroll: true });
  }

  /* burbuja de invitación a los 6 s, una vez por pestaña */
  let bubble = false;
  try { if (sessionStorage.getItem("lyan-bubble") !== "1") setTimeout(() => { if (!open) { bubble = true; render(); } }, 6000); } catch {}
  const hideBubble = () => { bubble = false; try { sessionStorage.setItem("lyan-bubble", "1"); } catch {} };

  async function send(raw) {
    const content = raw.trim();
    if (!content || busy || used() >= MAX_USER) return;
    msgs = [...msgs, { role: "user", content }]; busy = true; note = ""; persist(); render();
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: msgs.slice(1) }) });
      if (res.status === 429) { note = c("limit"); return; }
      if (res.status === 503) { note = c("off"); return; }
      if (!res.ok) throw new Error("chat failed");
      const data = await res.json();
      msgs = [...msgs, { role: "assistant", content: data.reply }]; persist();
      if (data.action?.type === "open_booking") setTimeout(() => { open = false; render(); openBooking(data.action.service); }, 900);
    } catch { note = c("err"); }
    finally { busy = false; render(); }
  }
  function openBooking(service) {
    const a = document.createElement("a"); a.dataset.book = service || ""; a.href = "#"; a.hidden = true;
    document.body.appendChild(a); a.click(); a.remove();
  }

  root.addEventListener("click", e => {
    const t = e.target.closest("[data-toggle],[data-open],[data-close],[data-bubble-x],[data-chip]");
    if (!t) return;
    if (t.hasAttribute("data-toggle")) { hideBubble(); open = !open; render(); }
    else if (t.hasAttribute("data-open")) { hideBubble(); open = true; render(); }
    else if (t.hasAttribute("data-close")) { open = false; render(); }
    else if (t.hasAttribute("data-bubble-x")) { hideBubble(); render(); }
    else if (t.dataset.chip) {
      const i = c("chips").indexOf(t.dataset.chip);
      if (i === 1) { open = false; render(); openBooking(null); } else send(t.dataset.chip);
    }
  });
  root.addEventListener("submit", e => { e.preventDefault(); const inp = root.querySelector(".sc-form input"); if (inp) send(inp.value); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && open) { open = false; render(); } });
  document.getElementById("langToggle")?.addEventListener("click", () => setTimeout(() => { if (msgs.length === 1) msgs = [{ role: "assistant", content: c("hello") }]; render(); }, 0));

  /* en móvil, oculto mientras el hero está a la vista (no tapa los botones) */
  const heroEl = document.querySelector(".hero");
  if (heroEl && matchMedia("(max-width: 760px)").matches) new IntersectionObserver(([en]) => root.classList.toggle("waf-hero", !open && en.intersectionRatio > 0.3), { threshold: [0, 0.3, 0.6] }).observe(heroEl);

  /* oculto con el pie a la vista */
  const f = document.querySelector("footer");
  if (f && "IntersectionObserver" in window) new IntersectionObserver(([en]) => root.classList.toggle("waf-hide", !open && en.isIntersecting), { threshold: .05 }).observe(f);

  render();
})();
