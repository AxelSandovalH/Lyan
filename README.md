# LYAN — sitio web de Christopher Lyan

Sitio estático (HTML + CSS + JS, sin build) para el portafolio de Christopher Lyan, adventure filmmaker en Los Cabos.

- `index.html` — página única: hero con video, film destacado, grid de films, servicios, sobre mí, contacto.
- `styles.css` — estilo oscuro y cinematográfico.
- `main.js` — grid de films (IDs de YouTube), lightbox, toggle ES/EN, animaciones de aparición.
- `booking.js` — motor de reservas de 4 pasos (servicio, fecha y lugar, datos, resumen) con checkout por WhatsApp. **Configura `BOOKING.whatsapp`** al inicio del archivo con el número de Lyan en formato internacional sin "+" (ej. `5216241234567`). Mientras esté vacío, el botón final cae a email.
- `BRAND_RESEARCH.md` — notas de marca y contenido.

## Correr en local

```bash
python3 -m http.server 4173
```

Abrir http://localhost:4173

## Deploy

Cualquier hosting estático sirve (GitHub Pages, Vercel, Netlify): publicar la raíz del repo.
