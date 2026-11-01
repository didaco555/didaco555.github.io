# Portafolio de diseño

Web de portafolio animada (HTML, CSS y JavaScript, sin instalar nada). Se publica gratis con GitHub Pages.

**Qué tiene**
- Pantalla de carga con contador.
- Portada con un lienzo infinito de tus trabajos que se mueve solo y se puede arrastrar (con el dedo en el móvil).
- Lista de trabajos con vista previa que sigue al ratón, y vista en cuadrícula.
- Filtros por tipo y enlaces filtrados para cada cliente.
- Visor a pantalla completa (la imagen "vuela" desde donde la tocas).
- Servicios con desplazamiento horizontal en ordenador.
- Texto "sobre mí" que se ilumina al hacer scroll y contacto con botón de copiar email.
- Respeta la opción de "reducir movimiento" del sistema y funciona sin conexión a otras webs (fuentes y librerías incluidas).

## Publicarla (una sola vez, mejor desde el ordenador)

1. Entra en github.com y pulsa **New repository**.
2. Nombre: exactamente `TUUSUARIO.github.io` (con tu usuario de GitHub). Así la web será `https://TUUSUARIO.github.io`.
   Déjalo en **Public** (en el plan gratuito, Pages solo funciona con repositorios públicos).
3. En el repositorio vacío pulsa **uploading an existing file** y arrastra **todo el contenido** de esta carpeta (los archivos y las carpetas `css`, `js`, `img`, `fonts`, `vendor`). Pulsa **Commit changes**.
4. Ve a **Settings → Pages**. En *Source* elige **Deploy from a branch**, rama **main**, carpeta **/ (root)** y guarda.
5. En uno o dos minutos estará en `https://TUUSUARIO.github.io`.

## Poner tus datos y tus trabajos

Todo se cambia en **`works.js`** (en GitHub: abre el archivo y pulsa el lápiz; al terminar, **Commit changes**).

- `SITE`: nombre, email, redes, texto "sobre mí" y herramientas.
- `CATEGORIES`: tus servicios (descripción, qué incluye, plazo y precio si quieres mostrarlo).
- `WORKS`: tus trabajos. Para añadir uno, sube la imagen a la carpeta `img/` y copia un bloque:

```js
{
  title: "Portada para Nombre del disco",
  category: "portadas",       // miniaturas, portadas, carteles, banners, ilustracion
  image: "img/portada-disco.jpg",
  client: "Nombre del artista",
  year: 2026,
  description: "Una o dos frases sobre el encargo.",
  gallery: ["img/portada-disco-mockup.jpg"],   // opcional: más imágenes del proyecto
},
```

El orden de la lista es el orden de la web. Borra los trabajos de ejemplo y sus imágenes cuando subas los tuyos.

## Enlaces filtrados para cada cliente

- Músicos: `https://TUUSUARIO.github.io/?cat=portadas`
- YouTubers: `https://TUUSUARIO.github.io/?cat=miniaturas`
- Eventos: `https://TUUSUARIO.github.io/?cat=carteles`

El enlace abre la web y baja directamente a esos trabajos.

## Consejos para las imágenes

- JPG o WebP, unos 1600–2000 px en el lado largo y menos de 500 KB cada una.
- Nombres sin espacios ni tildes: `cartel-carnaval-2027.jpg`.
- El repositorio es público: sube solo trabajos que el cliente ya haya publicado o te deje enseñar.

## Vista previa al compartir por WhatsApp

En `index.html`, rellena `og:image` con la dirección completa de una de tus imágenes, por ejemplo `https://TUUSUARIO.github.io/img/portada-disco.jpg`.

## Cambiar colores

Al principio de `css/styles.css`, en `:root`: `--blue` es el color de marca (portada y contacto) y `--yellow` el acento.

## Créditos

Animaciones con GSAP (licencia estándar gratuita de GreenSock) y scroll suave con Lenis (MIT). Tipografía Archivo (SIL Open Font License).
