/* Honesty League — motion narrative + kinetic type (GSAP). */
(function () {
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fineHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let ctx = null;
  let tickId = 0;

  function splitChars(el) {
    if (!el || el.dataset.split === "1") return;
    const text = el.textContent.trim();
    el.dataset.split = "1";
    el.setAttribute("aria-label", text);
    el.textContent = "";
    const words = text.split(/(\s+)/);
    words.forEach((word) => {
      if (/^\s+$/.test(word)) {
        el.appendChild(document.createTextNode(word));
        return;
      }
      const wrap = document.createElement("span");
      wrap.className = "kt-word";
      [...word].forEach((ch) => {
        const s = document.createElement("span");
        s.className = "kt-ch";
        s.textContent = ch;
        wrap.appendChild(s);
      });
      el.appendChild(wrap);
    });
  }

  function weekProgress() {
    const open = window.HonestyClock?.opensAt?.() ?? Date.now();
    const close = window.HonestyClock?.closesAt?.() ?? Date.now() + 1;
    const now = Date.now();
    const rehearse = open - 7 * 86400000;
    if (now < open) {
      return Math.min(1, Math.max(0, (now - rehearse) / Math.max(1, open - rehearse)));
    }
    return Math.min(1, Math.max(0, (now - open) / Math.max(1, close - open)));
  }

  function spawnParticles(x, y) {
    const layer = document.createElement("div");
    layer.className = "ink-burst";
    document.body.appendChild(layer);
    const n = 18;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      p.className = "ink-dot";
      p.style.left = x + "px";
      p.style.top = y + "px";
      layer.appendChild(p);
      const angle = (Math.PI * 2 * i) / n + Math.random() * 0.4;
      const dist = 48 + Math.random() * 70;
      if (window.gsap) {
        gsap.fromTo(
          p,
          { x: 0, y: 0, scale: 0.4, opacity: 1 },
          {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist - 20,
            scale: 0,
            opacity: 0,
            duration: 0.7 + Math.random() * 0.25,
            ease: "power2.out",
          },
        );
      }
    }
    window.setTimeout(() => layer.remove(), 1000);
  }

  function kinetic(root) {
    if (reduced() || !window.gsap) return;
    const heads = root.querySelectorAll(".kinetic, .live-headline");
    heads.forEach((h) => {
      splitChars(h);
      const chars = h.querySelectorAll(".kt-ch");
      gsap.from(chars, {
        yPercent: 110,
        rotateX: -65,
        opacity: 0,
        duration: 0.7,
        stagger: 0.028,
        ease: "power3.out",
        delay: 0.12,
      });
    });
    const lede = root.querySelector(".lede");
    if (lede) {
      splitChars(lede);
      gsap.from(lede.querySelectorAll(".kt-word"), {
        y: 18,
        opacity: 0,
        duration: 0.55,
        stagger: 0.06,
        ease: "power2.out",
        delay: 0.35,
      });
    }
  }

  function seats(root) {
    const cards = root.querySelectorAll(".seat-card");
    if (!cards.length) return;
    if (window.gsap && !reduced()) {
      gsap.from(cards, {
        y: 28,
        opacity: 0,
        rotateX: 8,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.55,
      });
    }
    cards.forEach((card) => {
      const seat = card.dataset.seat;
      card.addEventListener("click", (e) => {
        if (e.target.closest("[data-lock-seat]")) {
          const r = e.target.getBoundingClientRect();
          spawnParticles(r.left + r.width / 2, r.top + r.height / 2);
          card.classList.add("is-locked", "is-flipped");
          const lock = e.target.closest("[data-lock-seat]");
          if (lock) lock.textContent = lock.dataset.lockedLabel || "Locked in";
          if (typeof window.HonestyLockSeat === "function") window.HonestyLockSeat(seat);
          return;
        }
        if (e.target.closest("[data-sit-seat]")) {
          if (typeof window.HonestyPickSeat === "function") window.HonestyPickSeat(seat);
          return;
        }
        if (!fineHover()) {
          card.classList.toggle("is-flipped");
          return;
        }
        if (typeof window.HonestyPickSeat === "function") window.HonestyPickSeat(seat);
      });
    });
  }

  function meter(root) {
    const fill = root.querySelector(".score-meter-fill");
    const nowEl = root.querySelector(".score-meter-now");
    if (!fill) return;
    const apply = () => {
      const p = weekProgress();
      const pct = Math.round(p * 100);
      if (nowEl) nowEl.textContent = pct + "%";
      const bar = fill.parentElement?.parentElement;
      if (bar) bar.setAttribute("aria-valuenow", String(pct));
      if (window.gsap && !reduced()) gsap.to(fill, { width: pct + "%", duration: 0.8, ease: "power2.out" });
      else fill.style.width = pct + "%";
    };
    apply();
    window.clearInterval(tickId);
    tickId = window.setInterval(apply, 1000);
  }

  function prediction(root) {
    const btn = root.querySelector("#predict");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      if (btn.disabled) return;
      const r = btn.getBoundingClientRect();
      spawnParticles(r.left + r.width / 2, r.top + r.height / 2);
      btn.classList.add("is-locked");
      btn.dataset.locked = "1";
      const label = btn.querySelector(".predict-label");
      if (label) label.textContent = btn.dataset.lockedLabel || "Locked in";
      if (window.gsap && !reduced()) {
        gsap.fromTo(btn, { scale: 0.96 }, { scale: 1, duration: 0.35, ease: "back.out(2)" });
      }
      const sheet = root.querySelector(".desk-sheet");
      if (sheet) {
        sheet.classList.add("is-locked");
        window.setTimeout(() => sheet.classList.remove("is-locked"), 2200);
      }
      if (typeof window.HonestyLock === "function") window.HonestyLock();
      e.preventDefault();
    });
  }

  function air() {
    const track = document.querySelector(".air-track");
    if (!track || reduced() || !window.gsap) return;
    gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
  }

  function boot(root) {
    if (ctx) ctx.revert();
    window.clearInterval(tickId);
    if (!root) return;
    if (window.gsap) {
      document.documentElement.classList.add("has-gsap");
      ctx = gsap.context(() => {
        kinetic(root);
        seats(root);
        meter(root);
        prediction(root);
        air();
      }, root);
    } else {
      seats(root);
      meter(root);
      prediction(root);
    }
  }

  window.HonestyMotion = { boot, spawnParticles, weekProgress };
})();
