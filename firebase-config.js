/* ===========================================================
   FIREBASE CONFIG
   Paste your own project's config object below.

   HOW TO GET IT:
   1. Go to https://console.firebase.google.com and create a project
      (free "Spark" plan is enough).
   2. In your project, click the "</>" (Web) icon to register a web app.
   3. Firebase will show you a config object like the one below —
      copy YOUR values in here.
   4. In the left sidebar: Build → Authentication → Get Started →
      enable the "Email/Password" sign-in method.
   5. In the left sidebar: Build → Firestore Database → Create database
      (start in production mode, pick any region close to you).
   6. In Firestore, go to the "Rules" tab and paste the rules from
      the README instructions Claude gave you, then Publish.
   =========================================================== */

window.firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};
