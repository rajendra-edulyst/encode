import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAL69kXHSiWbyVyrxxOPgTkvbYGOQZQbac",
  authDomain: "encode-d92ce.firebaseapp.com",
  projectId: "encode-d92ce",
  storageBucket: "encode-d92ce.firebasestorage.app",
  messagingSenderId: "1036532864069",
  appId: "1:1036532864069:web:fd5edc5631a36248153f2c",
  measurementId: "G-9B2708D05B"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { firebaseApp, messaging };
