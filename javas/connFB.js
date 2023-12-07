import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { collection, query, where, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyCD3jq-3G-6i6ECYAUa6gt0MYrLvco6R4I",
    authDomain: "pia-gcw-6945f.firebaseapp.com",
    databaseURL: "https://pia-gcw-6945f-default-rtdb.firebaseio.com",
    projectId: "pia-gcw-6945f",
    storageBucket: "pia-gcw-6945f.appspot.com",
    messagingSenderId: "594098419666",
    appId: "1:594098419666:web:0b1bb2cd7f8841a9f3fa0b",
    measurementId: "G-XPD4EB4FL4"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export function initializeFirebase() {
  return new Promise((resolve, reject) => {
    const firebaseObjects = {
      auth,
      db,
    };
    resolve(firebaseObjects);
  });
}
