/* ===========================================================
   GAJA COLLEGE — "Pick Your Favorite" duel/swap game widget
   Self-contained: injects its own button, modal, styles & logic.
   Just include this file with a single <script> tag — nothing
   else in your existing HTML/CSS needs to change.

   HOW TO USE
   1. Put this file (game-widget.js) in your repo, same level as index.html.
   2. Put your 10 images in the SAME folder, named 1.jpeg, 2.jpeg ... 10.jpeg
      (edit IMAGE_COUNT / IMAGE_EXT below if your naming differs).
   3. Add this one line just before </body> in index.html:
        <script src="game-widget.js"></script>
   =========================================================== */

(function () {
  "use strict";

  // ---------- CONFIG ----------
  const IMAGE_COUNT = 10;          // how many images you have
  const IMAGE_EXT = "jpeg";        // change to "jpg" / "png" etc if needed
  const IMAGE_PREFIX = "";         // e.g. "images/" if photos are in a subfolder
  const GAME_TITLE = "Pick Your Favorite";

  const IMAGES = Array.from({ length: IMAGE_COUNT }, (_, i) => `${IMAGE_PREFIX}${i + 1}.${IMAGE_EXT}`);

  // ---------- STYLES ----------
  const style = document.createElement("style");
  style.textContent = `
    .gw-launcher{
      position:fixed; right:22px; bottom:22px; z-index:9998;
      font-family:'IBM Plex Mono', monospace;
      background:#d9642c; color:#0b1b2b;
      border:none; border-radius:2px;
      padding:14px 20px;
      font-size:13px; font-weight:600; letter-spacing:0.04em;
      display:flex; align-items:center; gap:8px;
      cursor:pointer;
      box-shadow:0 6px 20px rgba(0,0,0,0.35);
      transition:transform .18s ease, background .18s ease;
    }
    .gw-launcher:hover{ background:#ef7a3c; transform:translateY(-2px); }

    .gw-overlay{
      position:fixed; inset:0; z-index:9999;
      background:rgba(6,14,22,0.86);
      backdrop-filter:blur(6px);
      display:none; align-items:center; justify-content:center;
      padding:20px;
      font-family:'IBM Plex Sans', sans-serif;
    }
    .gw-overlay.open{ display:flex; }

    .gw-modal{
      background:#0b1b2b;
      border:1px solid rgba(80,160,190,0.3);
      max-width:820px; width:100%;
      padding:34px 30px 30px;
      position:relative;
      color:#f2f0ea;
    }
    .gw-close{
      position:absolute; top:16px; right:16px;
      background:none; border:1px solid rgba(80,160,190,0.3);
      color:#f2f0ea; width:32px; height:32px;
      font-size:16px; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      transition:all .15s ease;
    }
    .gw-close:hover{ border-color:#d9642c; color:#d9642c; }

    .gw-head{ margin-bottom:22px; }
    .gw-eyebrow{
      font-family:'IBM Plex Mono', monospace;
      font-size:11px; letter-spacing:0.12em; text-transform:uppercase;
      color:#d9642c; display:flex; align-items:center; gap:8px; margin-bottom:8px;
    }
    .gw-eyebrow::before{ content:""; width:18px; height:1px; background:#d9642c; display:inline-block; }
    .gw-head h2{
      font-family:'Space Grotesk', sans-serif;
      font-size:24px; text-transform:uppercase; font-weight:700;
    }
    .gw-progress{
      font-family:'IBM Plex Mono', monospace; font-size:12px; color:#8fa1b3;
      margin-top:6px;
    }

    .gw-arena{
      display:grid; grid-template-columns:1fr auto 1fr; gap:18px;
      align-items:center;
    }
    .gw-card{
      position:relative;
      border:1px solid rgba(80,160,190,0.3);
      aspect-ratio:4/5;
      overflow:hidden;
      cursor:pointer;
      background:#122a40;
    }
    .gw-card img{
      width:100%; height:100%; object-fit:cover; display:block;
      transition:transform .3s ease, opacity .3s ease;
    }
    .gw-card:hover img{ transform:scale(1.05); }
    .gw-card:hover{ border-color:#d9642c; }
    .gw-card.entering{ animation:gwSlideIn .4s ease; }
    .gw-card.picked{ border-color:#d9642c; }
    .gw-card .gw-tag{
      position:absolute; top:10px; left:10px;
      font-family:'IBM Plex Mono', monospace; font-size:10.5px;
      background:rgba(11,27,43,0.75); color:#f2f0ea;
      padding:4px 8px; letter-spacing:0.06em; text-transform:uppercase;
    }
    @keyframes gwSlideIn{
      from{ opacity:0; transform:translateX(24px); }
      to{ opacity:1; transform:translateX(0); }
    }

    .gw-vs{
      font-family:'Space Grotesk', sans-serif;
      font-size:15px; font-weight:700; color:#8fa1b3;
    }

    .gw-result{
      text-align:center; padding:20px 0 4px;
    }
    .gw-result img{
      width:220px; height:220px; object-fit:cover;
      border:1px solid #d9642c; margin:0 auto 18px;
    }
    .gw-result h3{
      font-family:'Space Grotesk', sans-serif;
      text-transform:uppercase; font-size:22px; margin-bottom:8px;
    }
    .gw-result p{ color:#8fa1b3; font-size:14px; margin-bottom:22px; }

    .gw-btn{
      font-family:'IBM Plex Mono', monospace; font-size:13px;
      background:#d9642c; color:#0b1b2b; border:none;
      padding:11px 22px; cursor:pointer; font-weight:600;
      letter-spacing:0.04em;
      transition:background .15s ease;
    }
    .gw-btn:hover{ background:#ef7a3c; }

    @media (max-width:600px){
      .gw-arena{ grid-template-columns:1fr; }
      .gw-vs{ text-align:center; }
      .gw-launcher{ padding:12px 16px; font-size:12px; }
    }
  `;
  document.head.appendChild(style);

  // ---------- MARKUP ----------
  const launcher = document.createElement("button");
  launcher.className = "gw-launcher";
  launcher.innerHTML = `🎮 Play`;
  launcher.setAttribute("aria-label", "Open image game");

  const overlay = document.createElement("div");
  overlay.className = "gw-overlay";
  overlay.innerHTML = `
    <div class="gw-modal" role="dialog" aria-modal="true" aria-label="${GAME_TITLE}">
      <button class="gw-close" aria-label="Close game">✕</button>
      <div class="gw-head">
        <p class="gw-eyebrow">Campus Game / Sheet G-01</p>
        <h2>${GAME_TITLE}</h2>
        <p class="gw-progress" id="gwProgress"></p>
      </div>
      <div id="gwBody"></div>
    </div>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(overlay);

  const gwBody = overlay.querySelector("#gwBody");
  const gwProgress = overlay.querySelector("#gwProgress");
  const closeBtn = overlay.querySelector(".gw-close");

  // ---------- GAME STATE ----------
  let pool = [];        // images not yet introduced
  let current = [];     // the two images currently facing off
  let round = 0;
  let totalRounds = IMAGE_COUNT - 1;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startGame() {
    pool = shuffle(IMAGES);
    current = [pool.shift(), pool.shift()];
    round = 1;
    renderArena();
  }

  function renderArena(enteringIndex) {
    gwProgress.textContent = `Round ${round} of ${totalRounds}`;
    gwBody.innerHTML = `
      <div class="gw-arena">
        <div class="gw-card" data-slot="0">
          <span class="gw-tag">Option A</span>
          <img src="${current[0]}" alt="Option A" onerror="this.closest('.gw-card').innerHTML='<span style=\\'display:flex;align-items:center;justify-content:center;height:100%;color:#8fa1b3;font-family:IBM Plex Mono,monospace;font-size:12px;padding:12px;text-align:center;\\'>Image not found:<br>${current[0]}</span>'">
        </div>
        <div class="gw-vs">VS</div>
        <div class="gw-card" data-slot="1">
          <span class="gw-tag">Option B</span>
          <img src="${current[1]}" alt="Option B" onerror="this.closest('.gw-card').innerHTML='<span style=\\'display:flex;align-items:center;justify-content:center;height:100%;color:#8fa1b3;font-family:IBM Plex Mono,monospace;font-size:12px;padding:12px;text-align:center;\\'>Image not found:<br>${current[1]}</span>'">
        </div>
      </div>
    `;
    if (enteringIndex !== undefined) {
      const card = gwBody.querySelector(`.gw-card[data-slot="${enteringIndex}"]`);
      if (card) card.classList.add("entering");
    }
    gwBody.querySelectorAll(".gw-card").forEach(card => {
      card.addEventListener("click", () => pick(parseInt(card.dataset.slot)));
    });
  }

  function pick(winnerSlot) {
    const winner = current[winnerSlot];

    if (pool.length === 0) {
      // no more challengers left — winner is the champion
      renderResult(winner);
      return;
    }

    const nextChallenger = pool.shift();
    const loserSlot = winnerSlot === 0 ? 1 : 0;
    current[loserSlot] = nextChallenger;
    round++;
    renderArena(loserSlot);
  }

  function renderResult(champion) {
    gwProgress.textContent = `Complete — ${IMAGE_COUNT} of ${IMAGE_COUNT} images seen`;
    gwBody.innerHTML = `
      <div class="gw-result">
        <img src="${champion}" alt="Champion">
        <h3>Champion</h3>
        <p>This one beat every other image in the set.</p>
        <button class="gw-btn" id="gwReplay">Play Again</button>
      </div>
    `;
    gwBody.querySelector("#gwReplay").addEventListener("click", startGame);
  }

  // ---------- OPEN / CLOSE ----------
  launcher.addEventListener("click", () => {
    overlay.classList.add("open");
    startGame();
  });
  closeBtn.addEventListener("click", () => overlay.classList.remove("open"));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("open");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") overlay.classList.remove("open");
  });
})();
