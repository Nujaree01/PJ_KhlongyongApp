// services/placesRemote.ts
// อ่าน/เขียนข้อมูล "ส่วนที่แก้ไขได้" ของแต่ละสถานที่ ผ่าน Firestore
// collection: "places", document id = place.id (เช่น "phutthamonthon")
// เก็บเฉพาะ field ที่แอดมินแก้ไขได้ ไม่เก็บพิกัด/ลำดับ (ยังคุมจาก data/places.ts เหมือนเดิม)

import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface PlaceOverride {
  name?: string;
  nameEn?: string;
  description?: string;
  highlight?: string;
  tips?: string[];
  openHours?: string;
  phone?: string;
  imageUrl?: string; // รูปจาก URL (แทนที่ require() local เมื่อแอดมินอัปเดต)
}

export type PlaceOverridesMap = Record<string, PlaceOverride>;

const COLLECTION_NAME = "places";

/**
 * ฟัง Firestore แบบ real-time — เรียก callback ทุกครั้งที่มีการแก้ไขข้อมูลจากที่ไหนก็ตาม
 * คืนค่า unsubscribe function สำหรับเลิกฟังตอน component unmount
 */
export function subscribeToPlaceOverrides(
  onUpdate: (overrides: PlaceOverridesMap) => void,
  onError?: (error: unknown) => void
): () => void {
  const colRef = collection(db, COLLECTION_NAME);

  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      const overrides: PlaceOverridesMap = {};
      snapshot.forEach((docSnap) => {
        overrides[docSnap.id] = docSnap.data() as PlaceOverride;
      });
      onUpdate(overrides);
    },
    (error) => {
      console.warn("subscribeToPlaceOverrides error:", error);
      onError?.(error);
    }
  );

  return unsubscribe;
}

/** บันทึกการแก้ไขของสถานที่ 1 จุด ขึ้น Firestore */
export async function savePlaceOverride(
  placeId: string,
  data: PlaceOverride
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, placeId);
  await setDoc(
    docRef,
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
