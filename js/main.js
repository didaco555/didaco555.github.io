/* =====================================================================
   No hace falta tocar este archivo: los contenidos están en works.js
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- Utilidades ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const make = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const mod = (n, m) => ((n % m) + m) % m;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const rand = (seed) => { const x = Math.sin(seed * 999.13) * 43758.5453; return x - Math.floor(x); };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const G = window.gsap;
  const ST = window.ScrollTrigger;
  const animate = !!(G && ST) && !reduce;
  if (G && ST) {
    G.registerPlugin(ST);
    ST.config({ ignoreMobileResize: true });
  }

  const catLabel = (k) => (CATEGORIES[k] && CATEGORIES[k].label) || k;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } },
  };

  /* ---------- Textos ---------- */
  document.title = SITE.name + " — " + SITE.role;
  $("#nav-name").textContent = SITE.name;
  $("#nav-role").textContent = SITE.role;
  $("#loader-name").textContent = SITE.name;
  if (SITE.available) $("#nav-status").textContent = SITE.availableText;
  else $("#nav-status").remove();
  $("#hero-intro").textContent = SITE.intro;
  $("#hero-hint").textContent = fine ? "Arrastra para explorar" : "Desliza para explorar";
  $("#footer-name").textContent = "© " + new Date().getFullYear() + " " + SITE.name;

  // Título de portada: una palabra por línea, cada letra en un span
  const heroTitle = $("#hero-title");
  heroTitle.setAttribute("aria-label", SITE.name);
  const words = SITE.name.trim().split(/\s+/);
  const lines = words.length <= 2 ? words : [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")];
  lines.forEach((line) => {
    const l = make("span", "hero__line");
    const inner = make("span", "hero__inner");
    inner.setAttribute("aria-hidden", "true");
    Array.from(line).forEach((ch) => inner.appendChild(make("span", "hero__char", ch === " " ? " " : ch)));
    l.appendChild(inner);
    heroTitle.appendChild(l);
  });

  // Sobre mí: cada palabra en un span para iluminarla al hacer scroll
  const aboutText = $("#about-text");
  SITE.about.split(/\s+/).forEach((w, i) => {
    if (i) aboutText.appendChild(document.createTextNode(" "));
    aboutText.appendChild(make("span", "w", w));
  });
  SITE.tools.forEach((t) => $("#about-tools").appendChild(make("li", null, t)));

  // Contacto
  const mail = $("#contact-email");
  mail.textContent = SITE.email;
  mail.href = "mailto:" + SITE.email + "?subject=" + encodeURIComponent("Presupuesto de diseño");
  SITE.links.forEach((l) => {
    const li = make("li");
    const a = make("a", null, l.label);
    a.href = l.url; a.target = "_blank"; a.rel = "noopener";
    li.appendChild(a);
    $("#contact-links").appendChild(li);
  });
  const bigWord = $("#contact-big");
  bigWord.innerHTML = "";
  const bigInner = make("span", "contact__inner", "Hablemos");
  bigInner.style.display = "inline-block";
  bigWord.appendChild(bigInner);

  $("#contact-copy").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    try { await navigator.clipboard.writeText(SITE.email); btn.textContent = "Copiado"; }
    catch (err) { btn.textContent = SITE.email; }
    setTimeout(() => { btn.textContent = "Copiar email"; }, 2200);
  });

  const timeEl = $("#footer-time");
  const tick = () => {
    try {
      const t = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: SITE.timezone }).format(new Date());
      timeEl.textContent = "Ahora son las " + t + " en " + SITE.location;
    } catch (e) { timeEl.textContent = SITE.location; }
  };
  tick(); setInterval(tick, 30000);

  /* ---------- Ajustar tipografías grandes al ancho ---------- */
  function fitTitle() {
    const frame = $("#hero-frame");
    const pad = parseFloat(getComputedStyle(heroTitle).paddingLeft) || 16;
    heroTitle.style.fontSize = "100px";
    const widest = Math.max.apply(null, $$(".hero__inner", heroTitle).map((n) => n.getBoundingClientRect().width));
    const byWidth = 100 * (frame.clientWidth - pad * 2) / widest;
    const byHeight = (frame.clientHeight * 0.56) / (lines.length * 0.8);
    heroTitle.style.fontSize = Math.floor(Math.min(byWidth, byHeight)) + "px";
  }
  function fitContact() {
    const prev = bigWord.style.fontStretch;
    bigWord.style.fontStretch = "125%";
    bigWord.style.fontSize = "100px";
    const w = bigInner.getBoundingClientRect().width;
    const avail = bigWord.parentElement.clientWidth - 2 * (parseFloat(getComputedStyle(bigWord.parentElement).paddingLeft) || 16);
    bigWord.style.fontSize = Math.floor(100 * avail / w * 0.99) + "px";
    bigWord.style.fontStretch = prev;
  }

  /* ---------- Precarga de imágenes ---------- */
  const ratios = {};
  function preload(onProgress) {
    const srcs = Array.from(new Set(WORKS.map((w) => w.image)));
    let done = 0;
    return new Promise((resolve) => {
      if (!srcs.length) return resolve();
      srcs.forEach((src) => {
        const im = new Image();
        const finish = () => {
          ratios[src] = im.naturalWidth && im.naturalHeight ? im.naturalWidth / im.naturalHeight : 1;
          done++;
          onProgress(done / srcs.length);
          if (done === srcs.length) resolve();
        };
        im.onload = finish; im.onerror = finish;
        im.src = src;
      });
    });
  }

  /* =====================================================================
     LIENZO INFINITO DE LA PORTADA
     ===================================================================== */
  const Canvas = {
    root: $("#canvas"),
    tiles: [],
    cur: { x: 0, y: 0 }, target: { x: 0, y: 0 }, vel: { x: 0, y: 0 },
    look: { x: 0, y: 0 }, lookT: { x: 0, y: 0 },
    scale: 1, dragging: false, running: true, size: { w: 0, h: 0 },

    build() {
      const vw = this.root.clientWidth, vh = this.root.clientHeight;
      this.size = { w: vw, h: vh };
      const cw = vw < 600 ? 175 : vw < 1100 ? 250 : 310;
      const ch = Math.round(cw * 1.2);
      this.cw = cw; this.ch = ch;
      this.cols = Math.ceil(vw / cw) + 2;
      this.rows = Math.ceil(vh / ch) + 2;
      this.tw = this.cols * cw; this.th = this.rows * ch;
      this.root.innerHTML = "";
      this.tiles = [];
      const n = WORKS.length;
      if (!n) return;
      // Reparte los trabajos para que no se repita ninguno al lado de sí mismo
      const grid = [], used = new Array(n).fill(0);
      for (let c = 0; c < this.cols; c++) {
        grid[c] = [];
        for (let r = 0; r < this.rows; r++) {
          const near = new Set();
          for (let dc = -1; dc <= 1; dc++) for (let dr = -1; dr <= 1; dr++) {
            const col = grid[mod(c + dc, this.cols)];
            const v = col && col[mod(r + dr, this.rows)];
            if (v !== undefined) near.add(v);
          }
          const order = Array.from({ length: n }, (_, k) => mod(k + c * 5 + r * 3, n))
            .sort((a, b) => used[a] - used[b]);
          const pick = order.find((k) => !near.has(k));
          grid[c][r] = pick === undefined ? order[0] : pick;
          used[grid[c][r]]++;
        }
      }
      for (let c = 0; c < this.cols; c++) {
        for (let r = 0; r < this.rows; r++) {
          const i = grid[c][r];
          const work = WORKS[i];
          const seed = c * 31 + r * 17 + 1;
          const ratio = ratios[work.image] || 1;
          const k = 0.5 + rand(seed) * 0.28;
          let w = cw * k, h = w / ratio;
          if (h > ch * k) { h = ch * k; w = h * ratio; }
          const tile = make("div", "tile");
          tile.style.width = w + "px"; tile.style.height = h + "px";
          tile.dataset.index = i;
          const inner = make("div", "tile__in");
          inner.style.width = "100%"; inner.style.height = "100%";
          const img = make("img");
          img.src = work.image; img.alt = ""; img.draggable = false; img.decoding = "async";
          inner.appendChild(img);
          tile.appendChild(inner);
          this.root.appendChild(tile);
          this.tiles.push({
            el: tile, img,
            bx: c * cw + (cw - w) * rand(seed + 3),
            by: r * ch + (c % 2 ? ch / 2 : 0) + (ch - h) * rand(seed + 7),
          });
        }
      }
      this.render();
    },

    render() {
      const s = this.scale;
      const ox = this.cur.x + this.look.x, oy = this.cur.y + this.look.y;
      for (const t of this.tiles) {
        const x = mod(t.bx + ox + this.cw, this.tw) - this.cw;
        const y = mod(t.by + oy + this.ch, this.th) - this.ch;
        t.el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) scale(" + s.toFixed(3) + ")";
      }
    },

    update(dt) {
      if (!this.running) return;
      const f = dt / 16.67;
      if (!this.dragging) {
        this.target.x += this.vel.x * f;
        this.target.y += this.vel.y * f;
        this.vel.x *= Math.pow(0.93, f);
        this.vel.y *= Math.pow(0.93, f);
        if (!reduce) { this.target.x -= 0.35 * f; this.target.y -= 0.18 * f; }
      }
      const px = this.cur.x, py = this.cur.y;
      this.cur.x = lerp(this.cur.x, this.target.x, 1 - Math.pow(0.86, f));
      this.cur.y = lerp(this.cur.y, this.target.y, 1 - Math.pow(0.86, f));
      this.look.x = lerp(this.look.x, this.lookT.x, 0.06 * f);
      this.look.y = lerp(this.look.y, this.lookT.y, 0.06 * f);
      const speed = Math.hypot(this.cur.x - px, this.cur.y - py) / f;
      const sTarget = reduce ? 1 : 1 - clamp(speed * 0.006, 0, 0.14);
      this.scale = lerp(this.scale, sTarget, 0.12 * f);
      this.render();
    },

    bind(onOpen) {
      const root = this.root;
      let start = null, last = null, moved = 0, pointerType = "mouse", downTile = null;
      root.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        pointerType = e.pointerType;
        this.dragging = true; moved = 0;
        downTile = e.target.closest(".tile");
        start = last = { x: e.clientX, y: e.clientY };
        this.vel.x = this.vel.y = 0;
        root.classList.add("is-dragging");
        if (pointerType === "mouse") root.setPointerCapture(e.pointerId);
      });
      root.addEventListener("pointermove", (e) => {
        if (fine && pointerType === "mouse" && !reduce) {
          this.lookT.x = (0.5 - e.clientX / innerWidth) * 70;
          this.lookT.y = (0.5 - e.clientY / innerHeight) * 50;
        }
        if (!this.dragging || !last) return;
        const dx = e.clientX - last.x;
        const dy = pointerType === "mouse" ? e.clientY - last.y : 0;
        moved += Math.abs(dx) + Math.abs(dy);
        this.target.x += dx * 1.15; this.target.y += dy * 1.15;
        this.vel.x = dx; this.vel.y = dy;
        last = { x: e.clientX, y: e.clientY };
      });
      const end = (e, cancelled) => {
        if (!this.dragging) return;
        this.dragging = false;
        root.classList.remove("is-dragging");
        if (!cancelled && moved < 8) this.vel.x = this.vel.y = 0;
        last = null;
      };
      // Abrir con "click" (no con pointerup) para que el toque no caiga después sobre el visor
      root.addEventListener("click", (e) => {
        if (moved >= 8) return;
        const tile = e.target.closest(".tile") || downTile;
        if (tile) onOpen(Number(tile.dataset.index), tile.querySelector("img"));
      });
      root.addEventListener("pointerup", (e) => end(e, false));
      root.addEventListener("pointercancel", (e) => end(e, true));
      root.addEventListener("pointerleave", () => { this.lookT.x = this.lookT.y = 0; });

      // Teclado: Intro abre el trabajo central
      if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => { this.running = entries[0].isIntersecting; }).observe(root);
      }
      let lastW = innerWidth, lastH = innerHeight, timer;
      window.addEventListener("resize", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (innerWidth !== lastW || Math.abs(innerHeight - lastH) > 140) {
            lastW = innerWidth; lastH = innerHeight;
            this.build();
          }
          fitTitle(); fitContact();
        }, 180);
      });
    },
  };

  /* =====================================================================
     TRABAJOS: filtros, lista, cuadrícula
     ===================================================================== */
  const listEl = $("#list"), gridEl = $("#grid"), filtersEl = $("#filters");
  let current = "todos";
  let shown = WORKS.slice();
  let view = store.get("pf-view") || (innerWidth <= 760 ? "grid" : "list");

  $("#work-count").textContent = WORKS.length;
  const countOf = (k) => (k === "todos" ? WORKS.length : WORKS.filter((w) => w.category === k).length);
  const cats = [["todos", "Todos"]].concat(Object.keys(CATEGORIES).filter((k) => countOf(k)).map((k) => [k, catLabel(k)]));
  cats.forEach(([k, label]) => {
    const b = make("button", "filter");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.dataset.cat = k;
    b.textContent = label;
    const sup = make("sup", null, countOf(k));
    b.appendChild(sup);
    b.addEventListener("click", () => setCategory(k, true));
    filtersEl.appendChild(b);
  });

  function buildItems() {
    listEl.innerHTML = ""; gridEl.innerHTML = "";
    if (!shown.length) {
      listEl.appendChild(make("li", "empty", "Todavía no hay trabajos en esta categoría."));
      return;
    }
    shown.forEach((w, i) => {
      // Fila
      const li = make("li", "row");
      const btn = make("button", "row__btn");
      btn.type = "button";
      btn.dataset.cursor = "Ver";
      btn.dataset.i = i;
      const thumb = make("img", "row__thumb");
      thumb.src = w.image; thumb.alt = ""; thumb.loading = "lazy";
      const text = make("span", "row__text");
      text.appendChild(make("span", "row__title", w.title));
      const meta = make("span", "row__meta");
      meta.appendChild(make("span", null, w.client || ""));
      meta.appendChild(make("span", null, catLabel(w.category)));
      meta.appendChild(make("span", null, w.year || ""));
      text.appendChild(meta);
      btn.append(thumb, text);
      if (innerWidth > 760) { btn.appendChild(meta); }
      btn.addEventListener("click", () => openViewer(shown, i, fine ? null : thumb));
      li.appendChild(btn);
      listEl.appendChild(li);

      // Tarjeta
      const card = make("li", "card");
      const cb = make("button", "card__btn");
      cb.type = "button";
      cb.dataset.cursor = "Ver";
      const media = make("div", "card__media");
      const img = make("img");
      img.src = w.image; img.alt = w.title; img.loading = i < 4 ? "eager" : "lazy";
      const r = ratios[w.image];
      if (r) img.style.aspectRatio = r;
      media.appendChild(img);
      const cap = make("div", "card__cap");
      cap.append(make("span", "card__title", w.title), make("span", "card__cat", catLabel(w.category)));
      cb.append(media, cap);
      cb.addEventListener("click", () => openViewer(shown, i, img));
      card.appendChild(cb);
      gridEl.appendChild(card);
    });
  }

  function setView(v) {
    view = v;
    store.set("pf-view", v);
    $$(".views__btn").forEach((b) => b.setAttribute("aria-pressed", b.dataset.view === v ? "true" : "false"));
    listEl.hidden = v !== "list";
    gridEl.hidden = v !== "grid";
    hidePreview();
    if (ST) ST.refresh();
  }
  $$(".views__btn").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.view === view) return;
    const target = b.dataset.view === "list" ? listEl : gridEl;
    setView(b.dataset.view);
    if (animate) G.from(target.children, { opacity: 0, y: 24, duration: 0.6, stagger: 0.03, ease: "power3.out" });
  }));

  function setCategory(k, user) {
    if (!cats.some(([c]) => c === k)) k = "todos";
    const changed = k !== current;
    current = k;
    $$(".filter", filtersEl).forEach((b) => b.setAttribute("aria-selected", b.dataset.cat === k ? "true" : "false"));
    if (user) {
      const url = new URL(location.href);
      if (k === "todos") url.searchParams.delete("cat"); else url.searchParams.set("cat", k);
      history.replaceState(null, "", url);
    }
    const apply = () => {
      shown = k === "todos" ? WORKS.slice() : WORKS.filter((w) => w.category === k);
      buildItems();
      if (ST) ST.refresh();
      if (animate && user) {
        const target = view === "list" ? listEl : gridEl;
        G.from(target.children, { opacity: 0, y: 24, duration: 0.6, stagger: 0.035, ease: "power3.out" });
      }
    };
    if (animate && user && changed) {
      const target = view === "list" ? listEl : gridEl;
      G.to(target.children, { opacity: 0, y: -10, duration: 0.2, stagger: 0.01, onComplete: apply });
    } else apply();
  }

  /* ---------- Vista previa flotante en la lista (ratón) ---------- */
  const preview = $("#preview"), previewImg = $("#preview-img");
  let px, py, prot, previewOn = false, lastMX = 0;
  function hidePreview() {
    if (!previewOn || !G) return;
    previewOn = false;
    G.to(preview, { autoAlpha: 0, scale: 0.85, duration: 0.3, ease: "power2.out" });
  }
  if (fine && G) {
    G.set(preview, { xPercent: -50, yPercent: -50, scale: 0.85 });
    px = G.quickTo(preview, "x", { duration: 0.55, ease: "power3" });
    py = G.quickTo(preview, "y", { duration: 0.55, ease: "power3" });
    prot = G.quickTo(preview, "rotation", { duration: 0.6, ease: "power3" });
    listEl.addEventListener("mousemove", (e) => {
      px(e.clientX + 40); py(e.clientY);
      prot(clamp((e.clientX - lastMX) * 0.6, -10, 10));
      lastMX = e.clientX;
    });
    listEl.addEventListener("mouseover", (e) => {
      const btn = e.target.closest(".row__btn");
      if (!btn) return;
      const w = shown[Number(btn.dataset.i)];
      if (!w) return;
      if (previewImg.getAttribute("src") !== w.image) previewImg.src = w.image;
      if (!previewOn) {
        previewOn = true;
        G.set(preview, { x: e.clientX + 40, y: e.clientY });
        G.to(preview, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power3.out" });
      }
    });
    listEl.addEventListener("mouseleave", hidePreview);
    window.addEventListener("scroll", () => { if (previewOn && !listEl.matches(":hover")) hidePreview(); }, { passive: true });
  }

  /* =====================================================================
     SERVICIOS
     ===================================================================== */
  const track = $("#services-track");
  Object.keys(CATEGORIES).forEach((k) => {
    const c = CATEGORIES[k];
    const art = make("article", "service");
    const media = make("div", "service__media");
    const samples = WORKS.filter((w) => w.category === k).slice(0, 3);
    const tilt = samples.length === 1 ? [0] : samples.length === 2 ? [-5, 5] : [-8, 7, -1];
    samples.forEach((w, j) => {
      const img = make("img");
      img.src = w.image; img.alt = ""; img.loading = "lazy";
      img.style.setProperty("--r", tilt[j] + "deg");
      img.style.zIndex = j + 1;
      img.dataset.r = tilt[j];
      media.appendChild(img);
    });
    const body = make("div", "service__body");
    body.appendChild(make("h3", "service__label", c.label));
    body.appendChild(make("p", "service__desc", c.description));
    const ul = make("ul", "service__list");
    (c.includes || []).forEach((t) => ul.appendChild(make("li", null, t)));
    body.appendChild(ul);
    const facts = make("dl", "service__facts");
    const addFact = (label, value) => {
      if (!value) return;
      const d = make("div");
      d.append(make("dt", null, label), make("dd", null, value));
      facts.appendChild(d);
    };
    addFact("Plazo", c.time);
    addFact("Precio", c.price);
    body.appendChild(facts);
    const cta = make("a", "service__cta", "Pedir presupuesto");
    cta.href = "mailto:" + SITE.email + "?subject=" + encodeURIComponent("Presupuesto: " + c.label);
    body.appendChild(cta);
    art.append(media, body);
    track.appendChild(art);
  });

  /* =====================================================================
     VISOR A PANTALLA COMPLETA
     ===================================================================== */
  const viewer = $("#viewer"), vImg = $("#viewer-img"), vStage = $("#viewer-stage");
  let vList = [], vIndex = 0, vImages = [], vImgIndex = 0, closing = false, openedAt = 0;

  function fillViewer() {
    const w = vList[vIndex];
    vImages = [w.image].concat(w.gallery || []);
    vImgIndex = 0;
    vImg.src = w.image; vImg.alt = w.title;
    $("#viewer-cat").textContent = catLabel(w.category);
    $("#viewer-title").textContent = w.title;
    $("#viewer-meta").textContent = [w.client, w.year].filter(Boolean).join(", ");
    $("#viewer-desc").textContent = w.description || "";
    $("#viewer-count").textContent = (vIndex + 1) + " / " + vList.length;
    const thumbs = $("#viewer-thumbs");
    thumbs.innerHTML = "";
    if (vImages.length > 1) {
      vImages.forEach((src, i) => {
        const b = make("button");
        b.type = "button";
        b.setAttribute("aria-label", "Imagen " + (i + 1));
        b.setAttribute("aria-current", i === 0 ? "true" : "false");
        const im = make("img"); im.src = src; im.alt = "";
        b.appendChild(im);
        b.addEventListener("click", () => {
          vImgIndex = i; vImg.src = src;
          $$("button", thumbs).forEach((x, j) => x.setAttribute("aria-current", j === i ? "true" : "false"));
        });
        thumbs.appendChild(b);
      });
    }
    const single = vList.length < 2;
    $("#viewer-prev").hidden = single; $("#viewer-next").hidden = single;
  }

  function lockScroll(on) {
    if (lenis) { on ? lenis.stop() : lenis.start(); }
    document.documentElement.style.overflow = on ? "hidden" : "";
  }

  async function openViewer(list, index, sourceImg) {
    vList = list; vIndex = index; closing = false; openedAt = Date.now();
    fillViewer();
    viewer.showModal();
    lockScroll(true);
    if (!animate) return;
    const side = $(".viewer__side", viewer);
    G.set([side, "#viewer-close"], { opacity: 0 });
    G.fromTo(viewer, { "--bg-o": 0 }, { "--bg-o": 1, duration: 0.5, ease: "power2.out" });
    try { await vImg.decode(); } catch (e) { /* sigue igualmente */ }
    if (sourceImg && sourceImg.getBoundingClientRect().width > 0) {
      const from = sourceImg.getBoundingClientRect();
      const to = vImg.getBoundingClientRect();
      const clone = make("img", "flip-clone");
      clone.src = vImg.src;
      Object.assign(clone.style, { left: from.left + "px", top: from.top + "px", width: from.width + "px", height: from.height + "px" });
      viewer.appendChild(clone);
      vImg.style.visibility = "hidden";
      G.to(clone, {
        left: to.left, top: to.top, width: to.width, height: to.height,
        duration: 0.85, ease: "expo.inOut",
        onComplete: () => { vImg.style.visibility = ""; clone.remove(); },
      });
    } else {
      G.fromTo(vImg, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.7, ease: "expo.out" });
    }
    G.to([side, "#viewer-close"], { opacity: 1, duration: 0.6, delay: 0.45, ease: "power2.out" });
    G.from(".viewer__text > *", { y: 16, opacity: 0, duration: 0.6, delay: 0.45, stagger: 0.05, ease: "power3.out" });
  }

  function closeViewer() {
    if (!viewer.open || closing) return;
    closing = true;
    const done = () => { viewer.close(); lockScroll(false); closing = false; G && G.set([vImg, ".viewer__side", "#viewer-close"], { clearProps: "all" }); };
    if (!animate) return done();
    G.to([vImg, ".viewer__side", "#viewer-close"], { opacity: 0, duration: 0.3, ease: "power2.in" });
    G.to(viewer, { "--bg-o": 0, duration: 0.4, delay: 0.1, ease: "power2.in", onComplete: done });
  }

  function step(d) {
    vIndex = mod(vIndex + d, vList.length);
    fillViewer();
    if (animate) {
      G.fromTo(vImg, { opacity: 0, x: d * 50 }, { opacity: 1, x: 0, duration: 0.6, ease: "expo.out" });
      G.fromTo(".viewer__text > *", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: "power3.out" });
    }
  }

  $("#viewer-prev").addEventListener("click", () => step(-1));
  $("#viewer-next").addEventListener("click", () => step(1));
  $("#viewer-close").addEventListener("click", closeViewer);
  viewer.addEventListener("cancel", (e) => { e.preventDefault(); closeViewer(); });
  viewer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
  vStage.addEventListener("click", (e) => { if (e.target === vStage && Date.now() - openedAt > 500) closeViewer(); });
  let sx = null;
  vStage.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  vStage.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    sx = null;
  });

  /* =====================================================================
     CURSOR
     ===================================================================== */
  if (fine && G) {
    const cur = $("#cursor"), label = $("#cursor-label");
    const cx = G.quickTo(cur, "x", { duration: 0.35, ease: "power3" });
    const cy = G.quickTo(cur, "y", { duration: 0.35, ease: "power3" });
    window.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") { cx(e.clientX); cy(e.clientY); } });
    $("#canvas").dataset.cursor = "Arrastra";
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("[data-cursor]");
      const overControl = e.target.closest("a, button:not([data-cursor])");
      if (t) { label.textContent = t.dataset.cursor; cur.classList.add("is-big"); cur.classList.remove("is-hidden"); }
      else { cur.classList.remove("is-big"); cur.classList.toggle("is-hidden", !!overControl); }
    });
    document.addEventListener("mouseleave", () => cur.classList.add("is-hidden"));
    document.addEventListener("mouseenter", () => cur.classList.remove("is-hidden"));
  }

  /* =====================================================================
     SCROLL SUAVE Y ANIMACIONES AL HACER SCROLL
     ===================================================================== */
  let lenis = null;
  if (animate && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ST.update);
    G.ticker.add((t) => lenis.raf(t * 1000));
    G.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const target = id.length > 1 ? $(id) : null;
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }));

  function scrollEffects() {
    if (!animate) { $$(".about__text .w").forEach((w) => { w.style.opacity = 1; }); return; }
    // La portada se encoge como una tarjeta al bajar
    G.to("#hero-frame", {
      scale: 0.9, borderRadius: 28, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    G.to(".hero__title", {
      yPercent: -40, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });

    // Servicios en horizontal (pantallas grandes)
    const mm = G.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const tween = G.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: "#services-pin", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true },
      });
      $$(".service__media", track).forEach((media) => {
        $$("img", media).forEach((img, j) => {
          const r = Number(img.dataset.r) || 0;
          G.set(img, { xPercent: -50, yPercent: -50, rotation: r });
          G.fromTo(img, { x: -40 - j * 50, rotation: r - 6 }, {
            x: 40 + j * 50, rotation: r + 6, ease: "none",
            scrollTrigger: { trigger: media, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          });
        });
      });
    });

    // Texto "sobre mí" que se ilumina palabra a palabra
    G.to(".about__text .w", {
      opacity: 1, stagger: 0.06, ease: "none",
      scrollTrigger: { trigger: ".about__text", start: "top 82%", end: "bottom 50%", scrub: true },
    });

    // "Hablemos" se ensancha al llegar
    G.fromTo(bigWord, { fontStretch: "62%" }, {
      fontStretch: "125%", ease: "none",
      scrollTrigger: { trigger: ".contact", start: "top 95%", end: "bottom bottom", scrub: true },
    });
  }

  /* =====================================================================
     ARRANQUE: precarga → animación de entrada
     ===================================================================== */
  const loader = $("#loader"), count = $("#loader-count");
  let started = false;

  function startLoop() {
    if (G) G.ticker.add((t, dt) => Canvas.update(dt));
    else {
      let prev = performance.now();
      const loop = (now) => { Canvas.update(Math.min(now - prev, 50)); prev = now; requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }
  }

  function intro() {
    if (started) return;
    started = true;
    Canvas.build();
    Canvas.bind((i, img) => openViewer(WORKS, i, img));
    startLoop();
    fitTitle(); fitContact();
    setView(view);
    setCategory(new URLSearchParams(location.search).get("cat") || "todos", false);
    scrollEffects();
    const goToWorks = new URLSearchParams(location.search).has("cat");

    if (!animate) {
      loader.remove();
      if (goToWorks) $("#trabajos").scrollIntoView();
      return;
    }
    if (lenis) lenis.stop();
    const tl = G.timeline({
      onComplete: () => {
        loader.remove();
        if (lenis) lenis.start();
        if (goToWorks) setTimeout(() => (lenis ? lenis.scrollTo("#trabajos", { duration: 1.6 }) : $("#trabajos").scrollIntoView({ behavior: "smooth" })), 150);
      },
    });
    tl.to(loader, { clipPath: "inset(0 0 100% 0)", duration: 1.05, ease: "expo.inOut" }, 0.15)
      .from(".hero__char", { yPercent: 115, duration: 1.1, stagger: 0.035, ease: "expo.out" }, 0.75)
      .from(".tile__in", {
        scale: 0.4, opacity: 0, duration: 1.3, ease: "expo.out",
        stagger: { each: 0.015, from: "center" },
      }, 0.6)
      .from(".hero__foot > *, .nav > *", { opacity: 0, y: 14, duration: 0.8, stagger: 0.06, ease: "power3.out" }, 1.1);
  }

  const shownProgress = { v: 0 };
  function setProgress(p) {
    if (!G || reduce) { count.textContent = Math.round(p * 100); return; }
    G.to(shownProgress, {
      v: p * 100, duration: 0.6, ease: "power2.out", overwrite: true,
      onUpdate: () => { count.textContent = Math.round(shownProgress.v); },
    });
  }

  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  const safety = new Promise((r) => setTimeout(r, 5000)); // nunca bloquear más de 5 s
  Promise.race([Promise.all([preload(setProgress), fontsReady]), safety]).then(() => {
    if (G && !reduce) {
      G.to(shownProgress, {
        v: 100, duration: 0.35, overwrite: true,
        onUpdate: () => { count.textContent = Math.round(shownProgress.v); },
        onComplete: intro,
      });
    } else intro();
  });
})();
