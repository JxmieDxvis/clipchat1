const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("user-email").textContent = user.email;
    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    loadClips();
  } else {
    authSection.classList.remove("hidden");
    appSection.classList.add("hidden");
  }
});

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(err => document.getElementById("auth-msg").textContent = err.message);
}

function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .catch(err => document.getElementById("auth-msg").textContent = err.message);
}

function logout() {
  auth.signOut();
}

function uploadClip() {
  const file = document.getElementById("videoFile").files[0];
  if (!file) return alert("Please choose a video file.");
  const user = auth.currentUser;
  const fileName = `${user.uid}_${Date.now()}.mp4`;
  const ref = storage.ref("clips/" + fileName);

  ref.put(file).then(snapshot => {
    snapshot.ref.getDownloadURL().then(url => {
      db.collection("clips").add({
        user: user.email,
        url: url,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert("Clip uploaded!");
      loadClips();
    });
  });
}

function loadClips() {
  const feed = document.getElementById("videoFeed");
  feed.innerHTML = "Loading...";
  db.collection("clips")
    .orderBy("timestamp", "desc")
    .get().then(snapshot => {
      const now = Date.now();
      feed.innerHTML = "";
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const time = data.timestamp?.toDate().getTime() || 0;
        if (now - time <= 24 * 60 * 60 * 1000) { // 24h
          const video = document.createElement("video");
          video.src = data.url;
          video.controls = true;
          feed.appendChild(video);
        }
      });
    });
}
