const firebaseConfig = {
  apiKey: "AIzaSyB6KYjHAAbELcEKwstgh1AZb2abqImsb5g",
  authDomain: "worktracker-b6e6a.firebaseapp.com",
  projectId: "worktracker-b6e6a",
  storageBucket: "worktracker-b6e6a.appspot.com",
  messagingSenderId: "769755385406",
  appId: "1:769755385406:web:4b5b17781c973d259c4b6f"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => document.getElementById("message").textContent = "Registered!")
    .catch(err => document.getElementById("message").textContent = err.message);
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("auth-container").classList.add("hidden");
      document.getElementById("app-container").classList.remove("hidden");
      showPage("feed");
    })
    .catch(err => document.getElementById("message").textContent = err.message);
}

function logout() {
  auth.signOut().then(() => {
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("app-container").classList.add("hidden");
  });
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");
}
