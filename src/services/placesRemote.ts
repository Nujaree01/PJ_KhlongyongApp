import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { PlaceCategory } from "../data/places";

export interface PlaceOverride {
  name?: string;
  nameEn?: string;
  description?: string;
  highlight?: string;
  tips?: string[];
  openHours?: string;
  phone?: string;
  imageUrl?: string;
  updatedAt?: { toMillis: () => number };
  order?: number, 
  category?: PlaceCategory, 
  latitude?: number, 
  longitude?: number
}

export type PlaceOverridesMap = Record<string, PlaceOverride>;

const COLLECTION_NAME = "places";

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
