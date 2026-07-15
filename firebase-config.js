<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyATSNBTUww9jj57K31",
    authDomain: "gaja-college.firebaseapp.com",
    projectId: "gaja-college",
    storageBucket: "gaja-college.firebasestorage.app",
    messagingSenderId: "483828479737",
    appId: "1:483828479737:web:838c0d",
    measurementId: "G-ZW4FHLC6VQ"
  };

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
</script>
