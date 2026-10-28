import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCFfEUWioEXDIruW554_0QN-3_uFD_Rw_c",
  authDomain: "khlongyongapp.firebaseapp.com",
  projectId: "khlongyongapp",
  storageBucket: "khlongyongapp.firebasestorage.app",
  messagingSenderId: "135980757536",
  appId: "1:135980757536:web:4c48fb209fe0d72ba00245",
  measurementId: "G-KCT0J46RB7"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);

let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  authInstance = getAuth(app);
}
export const auth = authInstance;