import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Login
window.loginUser = (email, pass) => {
  signInWithEmailAndPassword(auth, email, pass)
 .then(() => { alert("Login ho gaya!"); closeAuthModal(); })
 .catch((e) => alert(e.message));
}

// Signup
window.signupUser = (email, pass) => {
  createUserWithEmailAndPassword(auth, email, pass)
 .then(() => { alert("Account ban gaya!"); closeAuthModal(); })
 .catch((e) => alert(e.message));
}

// Logout
window.logoutUser = () => signOut(auth);

// Navbar me naam change karna
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("auth-btn").innerHTML = `${user.email} | <button onclick="logoutUser()">Logout</button>`;
  } else {
    document.getElementById("auth-btn").innerHTML = `<button onclick="openAuthModal()">Login</button>`;
  }
});
