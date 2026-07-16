/* ===========================================================
   GAJA COLLEGE — Login / Signup widget
   Self-contained: injects its own button, modal, styles & logic.
   Requires firebase-config.js to be loaded BEFORE this file.

   HOW TO USE
   Add these lines just before </body> in index.html, in this order:

     <script src="firebase-config.js"></script>
     <script src="auth-widget.js"></script>

   (This file loads the Firebase SDK itself via CDN — you don't
   need to add any other script tags.)
   =========================================================== */

(function () {
  "use strict";

  if (!window.firebaseConfig) {
    console.error("auth-widget.js: firebase-config.js must be loaded first.");
    return;
  }

  // ---------- Load Firebase SDK (compat build, no bundler needed) ----------
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  Promise.all([
    loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"),
    loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"),
    loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js")
  ]).then(init).catch(err => console.error("Failed to load Firebase SDK:", err));

  function init() {
    firebase.initializeApp(window.firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // ---------- STYLES ----------
    const style = document.createElement("style");
    style.textContent = `
      .aw-launcher{
        position:fixed; left:22px; bottom:22px; z-index:9998;
        font-family:'IBM Plex Mono', monospace;
        background:#122a40; color:#f2f0ea;
        border:1px solid rgba(80,160,190,0.4);
        border-radius:2px;
        padding:12px 18px;
        font-size:13px; font-weight:500; letter-spacing:0.03em;
        display:flex; align-items:center; gap:8px;
        cursor:pointer;
        box-shadow:0 6px 20px rgba(0,0,0,0.35);
        transition:all .18s ease;
      }
      .aw-launcher:hover{ border-color:#d9642c; color:#d9642c; }

      .aw-user-pill{
        position:fixed; left:22px; bottom:22px; z-index:9998;
        font-family:'IBM Plex Mono', monospace;
        background:#122a40; border:1px solid rgba(80,160,190,0.4);
        color:#f2f0ea; padding:10px 14px;
        display:flex; align-items:center; gap:10px;
        font-size:12.5px;
        box-shadow:0 6px 20px rgba(0,0,0,0.35);
      }
      .aw-user-pill .aw-role{
        font-size:9.5px; letter-spacing:0.08em; text-transform:uppercase;
        background:#d9642c; color:#0b1b2b; padding:2px 6px; font-weight:700;
      }
      .aw-user-pill button{
        background:none; border:none; color:#8fa1b3; cursor:pointer;
        font-family:'IBM Plex Mono', monospace; font-size:12px;
        border-left:1px solid rgba(80,160,190,0.3); padding-left:10px;
      }
      .aw-user-pill button:hover{ color:#ef7a3c; }

      .aw-overlay{
        position:fixed; inset:0; z-index:9999;
        background:rgba(6,14,22,0.86);
        backdrop-filter:blur(6px);
        display:none; align-items:center; justify-content:center;
        padding:20px;
        font-family:'IBM Plex Sans', sans-serif;
      }
      .aw-overlay.open{ display:flex; }

      .aw-modal{
        background:#0b1b2b;
        border:1px solid rgba(80,160,190,0.3);
        max-width:380px; width:100%;
        padding:32px 28px 28px;
        position:relative;
        color:#f2f0ea;
      }
      .aw-close{
        position:absolute; top:14px; right:14px;
        background:none; border:1px solid rgba(80,160,190,0.3);
        color:#f2f0ea; width:30px; height:30px;
        font-size:15px; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
      }
      .aw-close:hover{ border-color:#d9642c; color:#d9642c; }

      .aw-eyebrow{
        font-family:'IBM Plex Mono', monospace;
        font-size:11px; letter-spacing:0.12em; text-transform:uppercase;
        color:#d9642c; display:flex; align-items:center; gap:8px; margin-bottom:8px;
      }
      .aw-eyebrow::before{ content:""; width:18px; height:1px; background:#d9642c; display:inline-block; }
      .aw-modal h2{
        font-family:'Space Grotesk', sans-serif;
        font-size:22px; text-transform:uppercase; font-weight:700; margin-bottom:20px;
      }

      .aw-tabs{ display:flex; margin-bottom:20px; border-bottom:1px solid rgba(80,160,190,0.25); }
      .aw-tab{
        flex:1; text-align:center; padding:10px 0;
        font-family:'IBM Plex Mono', monospace; font-size:12.5px; letter-spacing:0.04em;
        color:#8fa1b3; cursor:pointer; background:none; border:none;
        border-bottom:2px solid transparent; margin-bottom:-1px;
      }
      .aw-tab.active{ color:#f2f0ea; border-bottom-color:#d9642c; }

      .aw-field{ margin-bottom:14px; }
      .aw-field label{
        display:block; font-family:'IBM Plex Mono', monospace;
        font-size:11px; letter-spacing:0.05em; text-transform:uppercase;
        color:#8fa1b3; margin-bottom:6px;
      }
      .aw-field input{
        width:100%; background:#122a40; border:1px solid rgba(80,160,190,0.3);
        color:#f2f0ea; padding:10px 12px; font-size:14px; font-family:'IBM Plex Sans', sans-serif;
      }
      .aw-field input:focus{ outline:none; border-color:#d9642c; }

      .aw-submit{
        width:100%; background:#d9642c; color:#0b1b2b; border:none;
        padding:12px 0; font-family:'IBM Plex Mono', monospace; font-size:13px;
        font-weight:600; letter-spacing:0.04em; cursor:pointer; margin-top:4px;
        transition:background .15s ease;
      }
      .aw-submit:hover{ background:#ef7a3c; }
      .aw-submit:disabled{ opacity:0.6; cursor:not-allowed; }

      .aw-error{
        font-family:'IBM Plex Mono', monospace; font-size:12px;
        color:#ef7a3c; margin-bottom:12px; display:none;
      }
      .aw-error.show{ display:block; }

      .aw-forgot{
        text-align:center; margin-top:14px;
        font-family:'IBM Plex Mono', monospace; font-size:11.5px;
      }
      .aw-forgot a{ color:#8fa1b3; cursor:pointer; text-decoration:underline; }
      .aw-forgot a:hover{ color:#f2f0ea; }

      @media (max-width:600px){
        .aw-launcher{ padding:9px 13px; font-size:11px; left:14px; bottom:14px; }
        .aw-user-pill{ padding:8px 10px; font-size:11px; left:14px; bottom:14px; gap:7px; }
        .aw-user-pill span:first-child{ max-width:80px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .aw-modal{ padding:24px 18px 20px; max-width:100%; }
        .aw-modal h2{ font-size:19px; }
      }
      @media (max-width:380px){
        .aw-launcher{ padding:8px 11px; font-size:10px; }
      }
    `;
    document.head.appendChild(style);

    // ---------- MARKUP ----------
    const launcher = document.createElement("button");
    launcher.className = "aw-launcher";
    launcher.innerHTML = `👤 Login`;

    const overlay = document.createElement("div");
    overlay.className = "aw-overlay";
    overlay.innerHTML = `
      <div class="aw-modal">
        <button class="aw-close" aria-label="Close">✕</button>
        <p class="aw-eyebrow">Sheet A-01 / Account Access</p>

        <div class="aw-tabs">
          <button class="aw-tab active" data-tab="login">Log In</button>
          <button class="aw-tab" data-tab="signup">Sign Up</button>
        </div>

        <p class="aw-error" id="awError"></p>

        <form id="awLoginForm">
          <div class="aw-field">
            <label>Email</label>
            <input type="email" id="awLoginEmail" required>
          </div>
          <div class="aw-field">
            <label>Password</label>
            <input type="password" id="awLoginPassword" required>
          </div>
          <button type="submit" class="aw-submit">Log In</button>
          <p class="aw-forgot"><a id="awForgotLink">Forgot password?</a></p>
        </form>

        <form id="awSignupForm" style="display:none;">
          <div class="aw-field">
            <label>Full Name</label>
            <input type="text" id="awSignupName" required>
          </div>
          <div class="aw-field">
            <label>Email</label>
            <input type="email" id="awSignupEmail" required>
          </div>
          <div class="aw-field">
            <label>Password (6+ characters)</label>
            <input type="password" id="awSignupPassword" minlength="6" required>
          </div>
          <button type="submit" class="aw-submit">Create Account</button>
        </form>
      </div>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector(".aw-close");
    const tabs = overlay.querySelectorAll(".aw-tab");
    const loginForm = overlay.querySelector("#awLoginForm");
    const signupForm = overlay.querySelector("#awSignupForm");
    const errorEl = overlay.querySelector("#awError");
    const forgotLink = overlay.querySelector("#awForgotLink");

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.classList.add("show");
    }
    function clearError() {
      errorEl.classList.remove("show");
      errorEl.textContent = "";
    }
    function friendlyError(code) {
      const map = {
        "auth/email-already-in-use": "That email already has an account. Try logging in instead.",
        "auth/invalid-email": "That email address doesn't look right.",
        "auth/weak-password": "Password should be at least 6 characters.",
        "auth/user-not-found": "No account found with that email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/too-many-requests": "Too many attempts. Please wait a moment and try again."
      };
      return map[code] || "Something went wrong. Please try again.";
    }

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        clearError();
        if (tab.dataset.tab === "login") {
          loginForm.style.display = "block";
          signupForm.style.display = "none";
        } else {
          loginForm.style.display = "none";
          signupForm.style.display = "block";
        }
      });
    });

    // ---------- OPEN / CLOSE ----------
    launcher.addEventListener("click", () => {
      clearError();
      overlay.classList.add("open");
    });
    closeBtn.addEventListener("click", () => overlay.classList.remove("open"));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("open");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") overlay.classList.remove("open");
    });

    // ---------- LOGIN ----------
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearError();
      const email = overlay.querySelector("#awLoginEmail").value.trim();
      const password = overlay.querySelector("#awLoginPassword").value;
      const btn = loginForm.querySelector(".aw-submit");
      btn.disabled = true;
      auth.signInWithEmailAndPassword(email, password)
        .then(() => { overlay.classList.remove("open"); loginForm.reset(); })
        .catch(err => showError(friendlyError(err.code)))
        .finally(() => { btn.disabled = false; });
    });

    // ---------- SIGN UP ----------
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearError();
      const name = overlay.querySelector("#awSignupName").value.trim();
      const email = overlay.querySelector("#awSignupEmail").value.trim();
      const password = overlay.querySelector("#awSignupPassword").value;
      const btn = signupForm.querySelector(".aw-submit");
      btn.disabled = true;

      auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
          return cred.user.updateProfile({ displayName: name }).then(() =>
            db.collection("users").doc(cred.user.uid).set({
              name: name,
              email: email,
              role: "student",
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
          );
        })
        .then(() => { overlay.classList.remove("open"); signupForm.reset(); })
        .catch(err => showError(friendlyError(err.code)))
        .finally(() => { btn.disabled = false; });
    });

    // ---------- FORGOT PASSWORD ----------
    forgotLink.addEventListener("click", () => {
      const email = overlay.querySelector("#awLoginEmail").value.trim();
      if (!email) { showError("Enter your email above first, then click Forgot password."); return; }
      clearError();
      auth.sendPasswordResetEmail(email)
        .then(() => showError("Password reset email sent — check your inbox."))
        .catch(err => showError(friendlyError(err.code)));
    });

    // ---------- AUTH STATE ----------
    let userPill = null;

    auth.onAuthStateChanged(user => {
      if (userPill) { userPill.remove(); userPill = null; }

      if (user) {
        launcher.style.display = "none";
        db.collection("users").doc(user.uid).get().then(doc => {
          const role = doc.exists ? doc.data().role : "student";
          const name = user.displayName || user.email;
          userPill = document.createElement("div");
          userPill.className = "aw-user-pill";
          userPill.innerHTML = `
            <span>${name}</span>
            <span class="aw-role">${role}</span>
            <button id="awLogoutBtn">Log Out</button>
          `;
          document.body.appendChild(userPill);
          userPill.querySelector("#awLogoutBtn").addEventListener("click", () => auth.signOut());
        });
      } else {
        launcher.style.display = "flex";
      }
    });
  }
})();
