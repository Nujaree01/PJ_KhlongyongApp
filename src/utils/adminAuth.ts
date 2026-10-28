// utils/adminAuth.ts
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
} from "firebase/auth";
import { auth } from "../services/firebase";

export async function login(email: string, password: string): Promise<boolean> {
  try {
    await signInWithEmailAndPassword(auth, email.trim(), password);
    return true;
  } catch (err) {
    console.warn("login ล้มเหลว:", err);
    return false;
  }
}

export async function logout(): Promise<void> {
  await firebaseSignOut(auth);
}

export function isLoggedIn(): Promise<boolean> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
}

export function subscribeToAuthState(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function changeCredentials(
  currentPassword: string,
  newEmail: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string }> {
  const user = auth.currentUser;
  if (!user || !user.email) {
    return { ok: false, error: "ยังไม่ได้เข้าสู่ระบบ" };
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    if (newEmail.trim() && newEmail.trim() !== user.email) {
      await updateEmail(user, newEmail.trim());
    }
    if (newPassword.trim()) {
      await updatePassword(user, newPassword);
    }

    return { ok: true };
  } catch (err: any) {
    console.warn("changeCredentials ล้มเหลว:", err);
    return { ok: false, error: err?.message ?? "เกิดข้อผิดพลาด" };
  }
}