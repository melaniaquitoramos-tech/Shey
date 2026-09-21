/* =========================================================
   Para Shey · Día de las Flores Amarillas
   Animaciones, carta, galería, música y lightbox
   ========================================================= */

(() => {
  "use strict";

  /* --------------------------------------------------
     1. PÉTALOS DE GIRASOL CAYENDO (Canvas)
  -------------------------------------------------- */
  const canvas = document.getElementById("petals");
  const ctx = canvas.getContext("2d");

  const COLORS = ["#ffd23e", "#ffc64a", "#f5a400", "#ff9f1c", "#ffe259", "#ffb83d"];

  let petals = [];
  let w = 0;
  let h = 0;

  function makePetal(initial) {
    const size = 9 + Math.random() * 16;
    return {
      x: initial ? Math.random() * w : -40,
      y: initial ? Math.random() * h : -40 - Math.random() * 200,
      size,
      vy: 0.6 + Math.random() * 1.7,
      sway: 0.4 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.06,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      opacity: 0.55 + Math.random() * 0.35,
      blur: Math.random() < 0.25 ? 3 : 0,
    };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    if (p.blur) {
      ctx.filter = `blur(${p.blur}px)`;
    }
    const half = p.size / 2;
    const gradient = ctx.createLinearGradient(0, -half, 0, half);
    gradient.addColorStop(0, p.color);
    gradient.addColorStop(1, "#d98a00");
    ctx.fillStyle = gradient;
    ctx.globalAlpha = p.opacity;

    ctx.beginPath();
    ctx.moveTo(0, -half);
    ctx.bezierCurveTo(p.size * 0.85, -half * 0.6, p.size * 0.85, half * 0.6, 0, half);
    ctx.bezierCurveTo(-p.size * 0.85, half * 0.6, -p.size * 0.85, -half * 0.6, 0, -half);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of petals) {
      p.phase += 0.02;
      p.x += Math.sin(p.phase) * p.sway * 0.6;
      p.y += p.vy;
      p.rot += p.vrot;
      if (p.y > h + 50) {
        Object.assign(p, makePetal(false));
      }
      drawPetal(p);
    }
    requestAnimationFrame(draw);
  }

  let burstParticles = [];

  function burstFrom(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      const p = makePetal(true);
      p.x = x;
      p.y = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 2;
      p.gravity = 0.08;
      p.life = 1;
      burstParticles.push(p);
    }
  }

  function animateBurst() {
    for (const p of burstParticles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rot += p.vrot * 4;
      p.life -= 0.012;
      drawPetal(p);
    }
    burstParticles = burstParticles.filter((p) => p.life > 0 && p.y < h + 60);
    if (burstParticles.length) {
      requestAnimationFrame(animateBurst);
    }
  }

  resize();
  petals = Array.from({ length: 34 }, () => makePetal(true));
  window.addEventListener("resize", resize);
  requestAnimationFrame(draw);

  /* --------------------------------------------------
     2. SUBTÍTULO CON MÁQUINA DE ESCRIBIR (hero)
  -------------------------------------------------- */
  const heroSub = document.getElementById("hero-sub");
  const phrases = [
    "Hoy el mundo florece de amarillo, contigo en mi corazón.",
    "El 21 de septiembre nació por ti… y florece para ti.",
    "Gracias por existir en mi vida, mi niña hermosa.",
  ];

  function typewriter(node, text, speed, hold, onDone) {
    const cursor = document.createElement("span");
    cursor.className = "type-cursor";
    node.textContent = "";
    node.appendChild(cursor);
    let i = 0;
    const timer = (done) => {
      setTimeout(() => {
        if (i < text.length) {
          cursor.before(document.createTextNode(text[i++]));
          timer(done);
        } else {
          setTimeout(() => {
            cursor.remove();
            done();
          }, hold);
        }
      }, speed);
    };
    timer(onDone);
  }

  let phraseIndex = 0;
  const loopSubtitles = () => {
    const phrase = phrases[phraseIndex % phrases.length];
    typewriter(heroSub, phrase, 30, 1800, () => {
      phraseIndex++;
      setTimeout(loopSubtitles, 900);
    });
  };
  loopSubtitles();

  /* --------------------------------------------------
     3. CARTA ROMÁNTICA (máquina de escribir)
  -------------------------------------------------- */
  const letterLines = [
    "Hoy, 21 de septiembre, el día de las flores amarillas, quiero regalarte algo más que flores: quiero regalarte mis palabras.",
    "No voy a olvidar jamás aquel 27 de diciembre en que nos conocimos, ni el instante exacto en que nos dimos nuestro primer beso.",
    "Si al inicio llegaste a pensar que no me interesabas, estabas completamente equivocada. Desde el primer día me pareciste una chica atractiva y, con el tiempo, mucho más que eso.",
    "Tu sencillez, tu cariño y tu lealtad me enseñaron a amar de verdad. Por eso este presente no son solo flores: son el reflejo claro de tu esencia y de tu naturaleza.",
    "Porque las flores amarillas llevan el color de tu alma: brillan como tú, mi niña hermosa.",
    "Te amo mucho. Hoy, mañana y siempre.",
  ];

  const letterBody = document.getElementById("carta-body");
  const greeting = document.getElementById("carta-greeting");

  function typeLetterLine(text) {
    return new Promise((resolve) => {
      const p = document.createElement("p");
      letterBody.appendChild(p);
      typewriter(p, text, 14, 200, resolve);
    });
  }

  async function writeLetter() {
    await typeLetterLine(letterLines[0]);
    for (let i = 1; i < letterLines.length; i++) {
      await new Promise((r) => setTimeout(r, 140));
      await typeLetterLine(letterLines[i]);
    }
    typewriter(greeting, "Para ti, mi niña hermosa…", 24, 1600, () => {});
  }

  /* --------------------------------------------------
     4. REVELAR AL HACER SCROLL
  -------------------------------------------------- */
  const ioOptions = { threshold: 0.15, rootMargin: "0px 0px -40px 0px" };
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    }
  }, ioOptions);

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const letterObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          writeLetter();
          letterObserver.disconnect();
          break;
        }
      }
    },
    { threshold: 0.35 }
  );
  letterObserver.observe(document.querySelector(".carta-paper"));

  /* --------------------------------------------------
     5. GALERÍA AUTOMÁTICA (assets/fotos/fotoN.jpg)
  -------------------------------------------------- */
  const exts = ["jpg", "jpeg", "png", "webp", "avif"];
  const found = [];

  function probe() {
    return new Promise((resolve) => {
      let pending = 0;
      let done = false;
      const check = () => {
        if (done) return;
        if (--pending <= 0) {
          done = true;
          resolve();
        }
      };

      for (let i = 1; i <= 50; i++) {
        for (const ext of exts) {
          pending++;
          const img = new Image();
          img.onload = () => {
            found.push(`assets/fotos/foto${i}.${ext}`);
            check();
          };
          img.onerror = check;
          img.src = `assets/fotos/foto${i}.${ext}`;
        }
      }
    });
  }

  function buildGallery() {
    const grid = document.getElementById("galleryGrid");
    if (!found.length) {
      const hint = document.createElement("div");
      hint.className = "gallery-hint";
      hint.textContent =
        "Aún no hay fotos. Colócalas en la carpeta assets/fotos/ como foto1.jpg, foto2.jpg, etc.";
      grid.appendChild(hint);
      return;
    }
    grid.innerHTML = "";
    found.forEach((src, idx) => {
      const item = document.createElement("div");
      item.className = "gallery-item";
      item.style.setProperty("--rot", (Math.random() * 2 - 1).toFixed(2) + "deg");
      item.style.transitionDelay = (idx * 0.05).toFixed(2) + "s";
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Recuerdo ${idx + 1}`;
      img.loading = "lazy";
      item.appendChild(img);
      item.addEventListener("click", () => openLightbox(idx));
      grid.appendChild(item);
      io.observe(item);
    });
  }

  probe().then(buildGallery);

  /* --------------------------------------------------
     6. LIGHTBOX
  -------------------------------------------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  let current = 0;

  function showImage(idx) {
    current = (idx + found.length) % found.length;
    lightboxImg.src = found[current];
    lightboxImg.alt = `Recuerdo ${current + 1}`;
  }

  function openLightbox(idx) {
    if (!found.length) return;
    showImage(idx);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(current - 1);
  });
  document.getElementById("lightboxNext").addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(current + 1);
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(current - 1);
    if (e.key === "ArrowRight") showImage(current + 1);
  });

  /* --------------------------------------------------
     7. MÚSICA
  -------------------------------------------------- */
  const music = document.getElementById("music");
  const musicBtn = document.getElementById("musicBtn");
  let missingAudio = false;

  musicBtn.addEventListener("click", () => {
    if (missingAudio) return;
    if (music.paused) {
      music
        .play()
        .then(() => {
          musicBtn.classList.add("playing");
          musicBtn.classList.remove("muted");
        })
        .catch(() => {});
    } else {
      music.pause();
      musicBtn.classList.remove("playing");
      musicBtn.classList.add("muted");
    }
  });

  music.addEventListener("error", () => {
    missingAudio = true;
    musicBtn.classList.add("muted");
    musicBtn.title = "Coloca tu canción en assets/musica/musica.mp3";
  });

  /* --------------------------------------------------
     8. EXPLOSIÓN DE PÉTALOS AL PULSAR BOTÓN
  -------------------------------------------------- */
  document.getElementById("btnBurst").addEventListener("click", (e) => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        burstFrom(
          w / 2 + (Math.random() * 140 - 70),
          h * 0.45 + (Math.random() * 200 - 100),
          70
        );
        animateBurst();
      }, i * 220);
    }
  });

  })();