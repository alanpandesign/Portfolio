(() => {
  const CH = window.CHAPTERS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pad = n => String(n).padStart(2, "0");
  const V = s => `assets/video/${s}`;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ONLINE = !!window.ONLINE; // 線上版：只附預覽片段、不嵌入 YouTube
  const WEB = { sportsnote: "hero", anim: "web" }; // 線上版有 720p 完整版的影片
  // 手機或省流量模式：點開播放 720p 手機版（檔案約 1/3，點了馬上能看）
  const MOBILE = matchMedia("(max-width: 900px), (pointer: coarse)").matches || !!(navigator.connection && navigator.connection.saveData);
  const HAS_M = new Set(["sportsnote", "on-event", "breaker", "breaker-short", "lin-doc", "vface", "cactus", "day0", "tsmc", "fx-guide", "anim", "oasis"]);
  const FULL = s => ONLINE ? (WEB[s] ? `${V(s)}-${WEB[s]}.mp4` : `${V(s)}-preview.mp4`) : `${V(s)}${MOBILE && HAS_M.has(s) ? "-m" : ""}.mp4`;
  const DUR = { anim: "1:34", tsmc: "1:05", "fx-guide": "0:30", sportsnote: "1:17", "on-event": "0:43", breaker: "1:14", "breaker-short": "0:52", "lin-doc": "1:37", vface: "0:43", cactus: "0:30", oasis: "13:28", day0: "0:52" };
  const tcFrom = (sec, fps = 24) => `${pad(Math.floor(sec / 3600))}:${pad(Math.floor(sec / 60) % 60)}:${pad(Math.floor(sec) % 60)}:${pad(Math.floor((sec % 1) * fps))}`;

  /* ---------- 素材 HTML ---------- */
  const title = (p, m) => esc(m.title || p.title);
  function media(m, p, extra = "") {
    const ar = m.ar || 16 / 9;
    if (m.youtube && ONLINE) return `<a class="item ytlink ${extra}" style="--ar:${ar}" href="https://www.youtube.com/watch?v=${m.youtube}" target="_blank" rel="noopener"><span class="ytc"><b>▶</b>在 YouTube 觀看<em>3D Animation &amp; Motion Design Showreel 2022–2023</em></span></a>`;
    if (m.youtube) return `<div class="item yt ${extra}" style="--ar:${ar}" data-yt="${m.youtube}"></div>`;
    if (m.img) return `<div class="item ${extra}" style="--ar:${ar}" data-lb="img" data-src="assets/img/${m.img}" data-title="${title(p, m)}"><img src="assets/img/${m.img}" alt="${title(p, m)}" loading="lazy"><div class="cap"><span>${title(p, m)}</span><em>VIEW ⤢</em></div></div>`;
    return `<div class="item ${extra}" style="--ar:${ar}" data-lb="video" data-src="${FULL(m.video)}" data-title="${title(p, m)}">
      <video class="auto" data-src="${V(m.video)}-preview.mp4" poster="${V(m.video)}-poster.jpg" muted autoplay loop playsinline preload="none"></video>
      <span class="badge">▶ VIDEO</span><div class="cap"><span>${title(p, m)}</span><em>▶ 完整版 ${DUR[m.video] || ""}</em></div></div>`;
  }
  function phone(ph, p) {
    const inner = ph.video
      ? `<video class="auto" data-src="${V(ph.video)}-preview.mp4" poster="${V(ph.video)}-poster.jpg" muted autoplay loop playsinline preload="none"></video>`
      : `<img src="assets/img/${ph.img}" alt="${esc(ph.title)}" loading="lazy">`;
    const lb = ph.video ? `data-lb="video" data-src="${FULL(ph.video)}"` : `data-lb="img" data-src="assets/img/${ph.img}"`;
    return `<div class="ph reveal"><div class="phone" ${lb} data-title="${esc(ph.title)}"><div class="scr"><span class="island"></span>${inner}
      <div class="ui"><span>♥</span><span>✉</span><span>➦</span></div></div></div><h4>${esc(ph.title)}</h4><p>${esc(ph.sub || "")}</p></div>`;
  }
  const metaHTML = p => `<dl class="meta">${Object.entries(p.meta || {}).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;

  /* ---------- 章節與專案 ---------- */
  const total = CH.reduce((n, c) => n + c.projects.length, 0);
  let pn = 0;
  $("#chapters").innerHTML = CH.map((c, ci) => {
    const label = c.outline + (c.gap ? " " : "") + c.solid, chName = `CH ${c.no} — ${label}`;
    const chap = `<section class="slide chap ${ci % 2 ? "glow-l" : "glow-r"}" id="${c.id}" data-ch="${chName}">
      <div class="frame center">
        <div class="years reveal">${esc(c.years)}</div>
        <h2 class="reveal" style="--len:${(c.outline + c.solid).length + (c.gap ? 0.4 : 0)}"><span class="o">${esc(c.outline)}</span>${c.gap ? " " : ""}${esc(c.solid)}</h2>
        <div class="zh reveal">${esc(c.zh)}</div>
        <div class="pills reveal">${c.pills.map(x => `<span class="pill">${esc(x)}</span>`).join("")}</div>
        <div class="bgno">${c.no}</div>
      </div></section>`;
    const projs = c.projects.map(p => {
      pn++;
      let body;
      if (p.layout === "phones") {
        body = `<div class="pbody"><div class="ptext reveal"><h3>${esc(p.title)}</h3><div class="en">${esc(p.en)}</div>${metaHTML(p)}<p>${esc(p.desc)}</p>
          <div class="note">Produced by Alan Pan</div></div><div class="phones">${p.phones.map(x => phone(x, p)).join("")}</div></div>`;
      } else if (p.layout === "feature") {
        const stills = (p.stills || []).map(s => media({ img: `stills/${s}.jpg`, ar: 16 / 9, title: p.title }, p)).join("");
        body = `<div class="pbody"><div class="ptext reveal"><h3>${esc(p.title)}</h3><div class="en">${esc(p.en)}</div>${metaHTML(p)}
          <h6>Project Overview</h6><p>${esc(p.overview)}</p><h6>My Contribution</h6><p>${esc(p.contribution)}</p><div class="note">Produced by Alan Pan</div></div>
          <div class="reveal"><div class="row">${media(p.main, p)}</div>${stills ? `<div class="stills">${stills}</div>` : ""}</div></div>`;
      } else {
        body = `<div class="pbody"><div class="ptext reveal"><h3>${esc(p.title)}</h3><div class="en">${esc(p.en)}</div>${metaHTML(p)}<p>${esc(p.desc)}</p>
          ${p.scope ? `<div class="scope"><h6>Scope of Work</h6><ul>${p.scope.map(s => `<li>${esc(s)}</li>`).join("")}</ul></div>` : ""}
          <div class="note">Produced by Alan Pan</div></div>
          <div class="collage reveal">${p.rows.map(r => `<div class="row">${r.map(m => media(m, p)).join("")}</div>`).join("")}</div></div>`;
      }
      return `<section class="slide proj glow-soft" id="p${pn}" data-ch="${chName}"><div class="frame">
        <div class="ptop eyebrow"><span>${esc(p.category)} &nbsp;—&nbsp; ${esc(p.client)}</span><span class="r">${esc(label)} · ${c.no}</span></div>
        ${body}
        <div class="pbot"><span>Project ${pn}</span><i></i><span>${pad(pn)} / ${pad(total)}</span></div>
      </div></section>`;
    }).join("");
    return chap + projs;
  }).join("");

  /* ---------- INDEX ---------- */
  $("#ixList").innerHTML = CH.map(c => `<li class="reveal"><a href="#${c.id}" data-pv="${c.preview || ""}" data-img="${c.previewImg || ""}" data-yt="${c.previewYt || ""}">
    <span class="n">${c.no}.</span><span class="t">${esc(c.outline + (c.gap ? " " : "") + c.solid)}</span><span class="z">${esc(c.zh)}</span></a></li>`).join("");
  const pv = $("#ixPreview"), pvV = $("video", pv), pvI = $("img", pv);
  $$("#ixList a").forEach(a => {
    a.addEventListener("mouseenter", () => {
      if (a.dataset.pv) { pvI.hidden = true; pvV.hidden = false; pvV.src = V(a.dataset.pv) + "-preview.mp4"; pvV.play().catch(() => {}); }
      else { pvV.hidden = true; pvI.hidden = false; if (!a.dataset.img && ONLINE) return; pvI.src = a.dataset.img ? "assets/img/" + a.dataset.img : `https://i.ytimg.com/vi/${a.dataset.yt}/hqdefault.jpg`; }
      pv.classList.add("on");
    });
    a.addEventListener("mouseleave", () => { pv.classList.remove("on"); pvV.pause(); });
    a.addEventListener("mousemove", e => { pv.style.left = e.clientX + 30 + "px"; pv.style.top = e.clientY - 90 + "px"; });
  });
  /* ---------- HERO：素材庫 ---------- */
  const binItems = [["sportsnote", "運動筆記 Showreel"], ["breaker", "破局者年會 2026"], ["day0", "Day 0 挑戰"], ["oasis", "OASIS 紀錄片"], ["on-event", "On 揪跑活動"],
    ["lin-doc", "林小安談紀錄片"], ["vface", "La glow V臉油"], ["cactus", "La glow 仙人掌"], ["breaker-short", "破局 短影音"], ["tsmc", "上車台積電"], ["fx-guide", "新手入門外匯"]];
  $("#bin").innerHTML = binItems.map(([s, t]) => `<a href="#" data-lb="video" data-src="${FULL(s)}" data-title="${t}" style="background-image:url('${V(s)}-poster.jpg')"><em>${DUR[s]}</em><span>${t}.mp4</span></a>`).join("")
    + `<a href="#photography" style="background-image:url('assets/img/on-cloudflow.jpg')"><em>IMG</em><span>On_Cloudflow.jpg</span></a>`
    + `<a href="#" data-lb="video" data-src="${FULL("anim")}" data-title="3D Animation Showreel" style="background-image:url('${V("anim")}-poster.jpg')"><em>1:34</em><span>3D_Showreel.mp4</span></a>`
;

  /* ---------- HERO：時間軸 PORTFOLIO（每個字母由片段組成） ---------- */
  const F = {
    P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
    O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
    T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
    L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    I: ["111", "010", "010", "010", "010", "010", "111"],
  };
  const word = "PORTFOLIO", LEFT = 5;
  const width = [...word].reduce((w, ch) => w + F[ch][0].length + 1, 0) - 1;
  const COLS = LEFT + width + 3;
  const names = ["V4", "V3", "V2", "V1", "A1", "A2", "A3", "A4"];
  $("#heads").innerHTML = names.map((n, i) => `<div class="${i > 3 ? "a" : ""}"><b>${n}</b>${i > 3 ? "M S" : "◉ 🔒"}</div>`).join("");
  const lanes = names.map((_, i) => `<div class="lane${i === 3 ? " split" : ""}" data-i="${i}"></div>`);
  const clips = names.map(() => []);
  const pct = c => (c / COLS * 100).toFixed(3) + "%";
  const clip = (row, c0, len, cls, delay) => clips[row].push(`<i class="clip ${cls}" style="left:${pct(c0)};width:calc(${pct(len)} - 1px);transition-delay:${delay}ms"></i>`);
  let col = LEFT;
  [...word].forEach(ch => {
    const g = F[ch];
    g.forEach((line, r) => {
      let s = -1;
      for (let k = 0; k <= line.length; k++) {
        if (line[k] === "1" && s < 0) s = k;
        if (line[k] !== "1" && s >= 0) { clip(r, col + s, k - s, "g", 500 + (col + s) * 22 + r * 14); s = -1; }
      }
    });
    col += g[0].length + 1;
  });
  clip(2, 0.3, 1.4, "b", 300); clip(3, 0, 3.6, "b", 260); clip(6, 0.2, 2.2, "b", 340);
  clip(7, 0, 22, "aud", 400); clip(7, 22.3, 16, "aud", 520); clip(7, 38.6, COLS - 39, "aud", 640);
  $("#lanes") && ($("#lanes").innerHTML = lanes.map((l, i) => l.replace("></div>", `>${clips[i].join("")}</div>`)).join(""));
  const ruler = $("#ruler");
  let rh = "";
  for (let i = 0; i <= 64; i++) rh += `<i class="${i % 8 ? "" : "m"}" style="left:${i / 64 * 100}%"></i>`;
  for (let i = 0; i < 8; i++) rh += `<span style="left:${i / 8 * 100}%">01:${pad(Math.floor(i * 10 / 60))}:${pad(i * 10 % 60)}:00</span>`;
  ruler.innerHTML = rh;

  /* ---------- HERO：監看同步 ---------- */
  const hv = $("#heroVid"), ph = $("#playhead");
  hv.addEventListener("timeupdate", () => {
    const d = hv.duration || 12, r = hv.currentTime / d, t = tcFrom(3600 + hv.currentTime);
    $("#tc").textContent = t; $("#tlTc").textContent = t;
    $("#scrub").style.width = r * 100 + "%"; $("#scrubHead").style.left = r * 100 + "%";
    ph.style.left = r * 100 + "%";
  });

  const snd = $("#heroSnd");
  snd.addEventListener("click", () => {
    hv.muted = !hv.muted; if (!hv.muted) hv.play().catch(() => {});
    snd.textContent = hv.muted ? "🔇 開啟聲音" : "🔊 關閉聲音"; snd.setAttribute("aria-pressed", String(!hv.muted));
  });

  /* ---------- 開場 ---------- */
  let seen = false; try { seen = sessionStorage.getItem("ap-seen") === "1"; sessionStorage.setItem("ap-seen", "1"); } catch (e) {}
  const LOAD = reduce || ONLINE ? 0 : seen ? 500 : 1700, t0 = performance.now();
  const loader = $("#loader");
  const finish = () => { loader && loader.classList.add("done"); document.body.classList.remove("loading"); setTimeout(() => { document.body.classList.add("ready"); onScroll(); }, 150); };
  if (!loader || !LOAD) finish();
  else {
    // 真實載入進度：字型 15%、封面圖 15%、封面影片緩衝 5 秒 70%；另有時間保底，最慢約 5 秒一定進站
    let fontsOK = 0, imgsOK = 0, shown = 0;
    document.fonts && document.fonts.ready.then(() => fontsOK = 1);
    const imgs = [hv.poster, "assets/img/portrait.jpg"];
    let loadedImgs = 0; imgs.forEach(src => { const im = new Image(); im.onload = im.onerror = () => { loadedImgs++; imgsOK = loadedImgs / imgs.length; }; im.src = src; });
    const vidProg = () => { try { const b = hv.buffered; return b.length ? Math.min(1, b.end(b.length - 1) / 5) : 0; } catch (e) { return 0; } };
    const MIN = seen ? 900 : 3000, MAX = 6000;
    // 標題逐字飛入，完成後 Alan 加上流光
    let ci = 0;
    $$(".ld-title > span").forEach(sp => { sp.innerHTML = [...sp.textContent].map(ch => `<span class="ch" style="--i:${ci++}">${ch}</span>`).join(""); });
    setTimeout(() => { const en = $(".ld-en"); if (en) { en.textContent = en.textContent; en.classList.add("shine"); } }, 250 + ci * 70 + 900);
    // 座右銘逐字打出
    const q = $("#ldQuote"), qt = q ? q.dataset.text : "", caret = q && q.querySelector(".caret");
    if (q) {
      const done = () => q.parentElement.classList.add("typed");
      if (seen || reduce) { q.insertBefore(document.createTextNode(qt), caret); done(); }
      else { let i = 0; setTimeout(function type() { q.insertBefore(document.createTextNode(qt[i++]), caret); if (i < qt.length) setTimeout(type, 70); else done(); }, 850); }
    }
    (function tick(now) {
      const el = now - t0;
      const real = fontsOK * .15 + imgsOK * .15 + (hv.readyState >= 3 ? 1 : vidProg()) * .7;
      const floor = Math.min(.95, el / 4000);                 // 網路再慢也會往前跑
      let target = Math.max(real, floor);
      if (el < MIN) target = Math.min(target, el / MIN);       // 至少讓動畫跑完
      if (el > MAX) target = 1;
      shown += (target - shown) * .12; if (target === 1 && shown > .995) shown = 1;
      const pct = Math.round(shown * 100);
      $("#ldNum").textContent = String(pct).padStart(3, "0");
      $("#loaderBar").style.width = pct + "%";
      $("#loaderTc").textContent = tcFrom(el / 1000);
      if (shown < 1) return requestAnimationFrame(tick);
      setTimeout(finish, seen ? 200 : 450);
    })(t0);
  }

  /* ---------- 自動播放（進入畫面才載入、離開暫停） ---------- */
  // 提前下載：影片離畫面還有約 1.5 個螢幕高時就先載入
  const load = v => { if (!v.getAttribute("src")) { v.preload = "auto"; v.src = v.dataset.src; v.load(); } };
  const pio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { load(e.target); pio.unobserve(e.target); } }), { rootMargin: "500px 0px 500px 0px" });
  // 進入畫面就播放，離開就暫停
  const io = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { load(v); v.play().catch(() => {}); } else v.pause();
  }), { threshold: 0.15 });
  $$("video.auto").forEach(v => { pio.observe(v); io.observe(v); });
  // 手機省電模式等情況會擋自動播放：使用者第一次觸碰畫面時，把畫面上的影片都重新播放
  const inView = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
  const kick = () => {
    $$("video.auto").forEach(v => { if (inView(v)) { if (!v.getAttribute("src")) v.src = v.dataset.src; if (v.paused) v.play().catch(() => {}); } });
    const h = $("#heroVid"); if (h && h.paused && inView(h) && !document.querySelector(".lb.open")) h.play().catch(() => {});
  };
  ["touchstart", "pointerdown", "keydown"].forEach(ev => addEventListener(ev, kick, { passive: true }));
  const yio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, id = el.dataset.yt;
    el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&rel=0&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="3D Animation Showreel"></iframe>`;
    yio.unobserve(el);
  }), { rootMargin: "200px" });
  $$("[data-yt].item").forEach(el => yio.observe(el));
  const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } }), { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => rio.observe(el));

  /* ---------- 燈箱（上一個／下一個） ---------- */
  const lb = $("#lb"), stage = $("#lbStage");
  let list = [], cur = 0;
  function show(i) {
    cur = (i + list.length) % list.length;
    const el = list[cur], src = el.dataset.src;
    stage.innerHTML = "";
    if (el.dataset.lb === "video") {
      // 在點擊當下直接呼叫 play()，手機才允許有聲播放；先顯示封面圖與讀取中
      const v = document.createElement("video");
      v.controls = true; v.playsInline = true; v.preload = "auto";
      v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", "");
      v.poster = src.replace(/(-m|-hero|-web|-preview)?\.mp4$/, "-poster.jpg");
      v.src = src;
      const spin = document.createElement("div"); spin.className = "lb-load"; spin.innerHTML = "<i></i><span>影片載入中…</span>";
      const snd = document.createElement("button"); snd.className = "lb-snd"; snd.textContent = "🔊 開啟聲音"; snd.hidden = true;
      snd.onclick = () => { v.muted = false; v.play().catch(() => {}); snd.hidden = true; };
      v.addEventListener("playing", () => spin.remove(), { once: true });
      v.addEventListener("error", () => { spin.querySelector("span").textContent = "影片載入失敗，請稍後再試"; });
      stage.append(v, spin, snd);
      const p = v.play();
      if (p) p.catch(() => { v.muted = true; v.play().then(() => { snd.hidden = false; }).catch(() => { spin.remove(); }); });
    } else stage.innerHTML = `<img src="${src}" alt="">`;
    $("#lbTitle").textContent = el.dataset.title || "";
    $("#lbCount").textContent = `${pad(cur + 1)} / ${pad(list.length)}`;
  }
  // 開燈箱時：停掉並釋放頁面上所有影片的下載，讓頻寬全部給完整版
  let freed = [];
  function freeAll() {
    freed = [];
    $$("video.auto").forEach(v => { v.pause(); if (v.getAttribute("src")) { v.removeAttribute("src"); v.load(); freed.push(v); } });
    hv.pause(); hv.dataset.src = hv.dataset.src || hv.getAttribute("src"); hv.removeAttribute("src"); hv.load();
  }
  function restoreAll() {
    hv.src = hv.dataset.src; hv.load(); hv.play().catch(() => {});
    freed.forEach(v => { if (inView(v)) { v.src = v.dataset.src; v.play().catch(() => {}); } }); freed = [];
  }
  function open(el) {
    freeAll();
    list = $$("main [data-lb]"); let i = list.indexOf(el);
    if (i < 0) { list = [el]; i = 0; }
    show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; hv.pause();
  }
  function close() { const v = stage.querySelector("video"); if (v) { v.pause(); v.removeAttribute("src"); v.load(); } lb.classList.remove("open"); stage.innerHTML = ""; document.body.style.overflow = ""; restoreAll(); }
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-lb]");
    if (!el) return;
    e.preventDefault(); open(el);
  });
  const reel = () => { const m = document.createElement("div"); m.dataset.lb = "video"; m.dataset.src = "assets/video/montage.mp4"; m.dataset.title = "Alan Pan 作品精彩混剪"; open(m); };
  $("#showreelBtn").addEventListener("click", reel); $("#heroPlay").addEventListener("click", reel);
  $("#lbClose").addEventListener("click", close);
  $("#lbPrev").addEventListener("click", () => show(cur - 1));
  $("#lbNext").addEventListener("click", () => show(cur + 1));
  lb.addEventListener("click", e => { if (e.target === lb || e.target === stage) close(); });
  addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close(); if (e.key === "ArrowRight") show(cur + 1); if (e.key === "ArrowLeft") show(cur - 1);
  });

  /* ---------- 自訂游標 ---------- */
  const cu = $("#cursor"), cuT = $("span", cu);
  let mx = -100, my = -100, cx = -100, cy = -100;
  addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; cu.classList.add("show"); });
  document.addEventListener("mouseleave", () => cu.classList.remove("show"));
  document.addEventListener("mouseover", e => {
    const t = e.target.closest("[data-lb],.ix-list a,.btn-gold");
    cu.classList.toggle("big", !!t);
    if (t) cuT.textContent = t.dataset.lb === "video" || t.classList.contains("btn-gold") ? "PLAY" : t.dataset.lb === "img" ? "VIEW" : "OPEN";
  });
  (function loop() { cx += (mx - cx) * .2; cy += (my - cy) * .2; cu.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();

  /* ---------- 捲動：導覽列、進度條、HUD ---------- */
  const secs = $$("[data-ch]"), nav = $("#nav"), hud = $("#hud");
  function onScroll() {
    const y = scrollY, H = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle("solid", y > 40);
    $("#progress").style.width = (y / H * 100) + "%";
    hud.classList.toggle("show", document.body.classList.contains("ready"));
    $("#hudTc").textContent = tcFrom(y / 60);
    let name = "CH 00 — INTRO";
    for (const s of secs) if (s.getBoundingClientRect().top < innerHeight * .5) name = s.dataset.ch.startsWith("CH") ? s.dataset.ch : s.dataset.ch;
    $("#hudCh").textContent = name;
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- 手機選單 ---------- */
  const bg = $("#burger"), mn = $("#mnav");
  bg.addEventListener("click", () => { bg.classList.toggle("on"); mn.classList.toggle("on"); });
  $$("a", mn).forEach(a => a.addEventListener("click", () => { bg.classList.remove("on"); mn.classList.remove("on"); }));

  /* ---------- 數字計數 ---------- */
  const fmt = (n, suf) => (n >= 10000 ? Math.round(n / 10000) + "萬" : Math.round(n)) + (suf || "");
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = +el.dataset.count, suf = el.dataset.suffix, t1 = performance.now();
    (function step(now) { const k = Math.min(1, (now - t1) / 1600), ease = 1 - Math.pow(1 - k, 3); el.textContent = fmt(to * ease, k === 1 ? suf : ""); if (k < 1) requestAnimationFrame(step); })(t1);
    cio.unobserve(el);
  }), { threshold: 0.5 });
  $$("[data-count]").forEach(el => cio.observe(el));

  /* ---------- 複製 Email／電話 ---------- */
  $$("[data-copy]").forEach(b => b.addEventListener("click", e => {
    const v = b.dataset.copy, t = $("#toast");
    const done = () => { t.textContent = `已複製 ${b.dataset.label || ""}`; t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 1800); };
    try { navigator.clipboard.writeText(v).then(done, () => getSelection().selectAllChildren(b)); } catch (err) { getSelection().selectAllChildren(b); }
  }));

  /* ---------- 瀏覽次數（從 1000 開始；每個瀏覽器只算一次，本機測試不計） ---------- */
  (async () => {
    const box = $("#views"), num = $("#viewsNum"); if (!box) return;
    const API = "https://abacus.jasoncameron.dev", KEY = "alanpandesign-portfolio/visits";
    const local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
    let counted = false; try { counted = localStorage.getItem("ap-viewed") === "1"; } catch (e) {}
    try {
      const r = await fetch(`${API}/${counted || local ? "get" : "hit"}/${KEY}`);
      const { value } = await r.json(); if (typeof value !== "number") return;
      if (!counted && !local) { try { localStorage.setItem("ap-viewed", "1"); } catch (e) {} }
      box.hidden = false; const hb = $("#hudViews"), hn = $("#hudViewsNum"); if (hb) hb.hidden = false;
      const from = Math.max(1000, value - 30), t1 = performance.now();
      (function step(now) { const k = Math.min(1, (now - t1) / 1200); const v = Math.round(from + (value - from) * (1 - Math.pow(1 - k, 3))).toLocaleString(); num.textContent = v; if (hn) hn.textContent = v; if (k < 1) requestAnimationFrame(step); })(t1);
    } catch (e) { /* 計數服務連不上時就不顯示 */ }
  })();
})();