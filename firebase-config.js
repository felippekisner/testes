import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCqWaY2RdgWVcJyZUZmAvnL7YJ41Et8Y6s",
  authDomain: "organizadorlp.firebaseapp.com",
  projectId: "organizadorlp",
  storageBucket: "organizadorlp.firebasestorage.app",
  messagingSenderId: "233130911029",
  appId: "1:233130911029:web:78e0542cd09f7830b4987c",
  measurementId: "G-WZP1LGTPQY"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

