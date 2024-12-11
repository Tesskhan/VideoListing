// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCSDKIqEWXfqQVnuHBL8r09knEA91HNfT4",
  authDomain: "to-do-list-app-97ecf.firebaseapp.com",
  projectId: "to-do-list-app-97ecf",
  storageBucket: "to-do-list-app-97ecf.firebasestorage.app",
  messagingSenderId: "11228058009",
  appId: "1:11228058009:web:a5e5bc7e07101b8f338308",
  measurementId: "G-FHB92DZSVP"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth, Firestore y Storage
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
