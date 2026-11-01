/* =====================================================================
   ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS EDITAR
   ---------------------------------------------------------------------
   1. SITE        → tus datos (nombre, email, redes, texto "sobre mí").
   2. CATEGORIES  → tus servicios (aparecen en la sección Servicios).
   3. WORKS       → tus trabajos. Uno por bloque { ... }.
                    El orden de la lista es el orden en la web.
   Las imágenes van en la carpeta img/ (JPG o WebP, ~1600 px, < 500 KB).
   ===================================================================== */

const SITE = {
  name: "Tu Nombre",                 // Sale enorme en la portada. Mejor 1 o 2 palabras.
  role: "Diseño gráfico",            // Sale arriba a la izquierda junto al nombre.
  intro: "Miniaturas, portadas de álbum, carteles y banners que hacen que la gente se pare a mirar.",
  available: true,                   // true = muestra "Disponible para encargos"
  availableText: "Disponible para encargos",
  location: "Cataluña",
  timezone: "Europe/Madrid",         // Para mostrar tu hora local en Contacto
  email: "tuemail@ejemplo.com",
  links: [                           // Borra las que no uses
    { label: "Instagram", url: "https://instagram.com/tuusuario" },
    { label: "Behance",   url: "https://behance.net/tuusuario" },
    { label: "LinkedIn",  url: "https://linkedin.com/in/tuusuario" },
  ],
  about: "Soy diseñador gráfico. Trabajo con creadores de contenido, músicos y organizadores de eventos que necesitan imágenes con carácter: que se lean en un segundo, que se recuerden y que funcionen igual en una pantalla de móvil que impresas a tamaño A2.",
  tools: ["Photoshop", "Illustrator", "Procreate", "ComfyUI", "After Effects"],
};

/* Servicios. La clave (miniaturas, portadas…) es la que usas en cada trabajo
   y la que va en los enlaces filtrados: …github.io/?cat=portadas
   price: deja "" si prefieres no mostrar precio.                          */
const CATEGORIES = {
  miniaturas: {
    label: "Miniaturas",
    description: "Miniaturas para YouTube pensadas para que se entiendan en un vistazo y den ganas de hacer clic.",
    includes: ["2 propuestas de concepto", "Versión final 1280×720", "Archivo editable PSD"],
    time: "24–48 h",
    price: "",
  },
  portadas: {
    label: "Portadas",
    description: "Portadas de single, EP o álbum con identidad propia, listas para Spotify, Apple Music y vinilo.",
    includes: ["Concepto y bocetos", "Portada 3000×3000", "Adaptaciones para redes"],
    time: "5–7 días",
    price: "",
  },
  carteles: {
    label: "Carteles",
    description: "Carteles para fiestas, conciertos y eventos, preparados para imprenta y para redes.",
    includes: ["Diseño a tamaño de impresión", "PDF para imprenta", "Versiones para Instagram"],
    time: "3–5 días",
    price: "",
  },
  banners: {
    label: "Banners",
    description: "Banners para canales de YouTube, Twitch y redes, con todas las medidas resueltas.",
    includes: ["Banner adaptado a cada plataforma", "Zona segura para móvil", "Avatar a juego"],
    time: "2–3 días",
    price: "",
  },
  ilustracion: {
    label: "Ilustración",
    description: "Ilustración digital para portadas, carteles o piezas propias.",
    includes: ["Boceto previo", "Ilustración en alta resolución", "Uso comercial"],
    time: "A consultar",
    price: "",
  },
};

const WORKS = [
  {
    title: "Noches de neón",
    category: "portadas",
    image: "img/portada-noches-de-neon.jpg",
    client: "Lumen Vera",
    year: 2026,
    description: "Portada de single. Anillos que vibran como un altavoz y un degradado que recuerda a una pista de baile a las tres de la mañana.",
    gallery: [],   // opcional: más imágenes del mismo proyecto, ej. ["img/neon-mockup.jpg"]
  },
  {
    title: "ComfyUI en 10 minutos",
    category: "miniaturas",
    image: "img/miniatura-comfyui.jpg",
    client: "Canal de tutoriales",
    year: 2026,
    description: "Miniatura para un tutorial. Mensaje en cuatro palabras y contraste alto para destacar entre los vídeos recomendados.",
  },
  {
    title: "Festa Major 26",
    category: "carteles",
    image: "img/cartel-festa-major.jpg",
    client: "Ayuntamiento",
    year: 2026,
    description: "Cartel de fiesta mayor con estilo suizo: el año como protagonista y la información ordenada en una retícula.",
  },
  {
    title: "Kilómetro cero",
    category: "portadas",
    image: "img/portada-kilometro-cero.jpg",
    client: "Los Martes",
    year: 2025,
    description: "Portada de LP pensada primero para vinilo y después adaptada a plataformas.",
  },
  {
    title: "Probé la IA más rápida",
    category: "miniaturas",
    image: "img/miniatura-ia-rapida.jpg",
    client: "Canal de tecnología",
    year: 2026,
    description: "",
  },
  {
    title: "Los Tigres del Sur",
    category: "carteles",
    image: "img/cartel-los-tigres.jpg",
    client: "Sala Apolo",
    year: 2025,
    description: "Cartel de concierto con trama de puntos y tipografía condensada.",
  },
  {
    title: "Estudio",
    category: "banners",
    image: "img/banner-estudio.jpg",
    client: "Canal de YouTube",
    year: 2026,
    description: "",
  },
  {
    title: "Marea",
    category: "portadas",
    image: "img/portada-marea.jpg",
    client: "Alba Ros",
    year: 2025,
    description: "",
  },
  {
    title: "Carnaval 2027",
    category: "carteles",
    image: "img/cartel-carnaval.jpg",
    client: "Comisión de Carnaval",
    year: 2026,
    description: "",
  },
  {
    title: "Mi setup 2026",
    category: "miniaturas",
    image: "img/miniatura-setup.jpg",
    client: "",
    year: 2026,
    description: "",
  },
  {
    title: "Night Shift",
    category: "banners",
    image: "img/banner-night-shift.jpg",
    client: "Streamer",
    year: 2025,
    description: "",
  },
  {
    title: "Atardecer",
    category: "ilustracion",
    image: "img/ilustracion-atardecer.jpg",
    client: "Proyecto personal",
    year: 2026,
    description: "",
  },
];
