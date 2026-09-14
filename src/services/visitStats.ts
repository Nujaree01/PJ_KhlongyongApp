import {
    collection,
    doc,
    onSnapshot,
    setDoc,
    increment,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type VisitStatsMap = Record<string, number>;

const COLLECTION_NAME = "visitStats";

export function subscribeToVisitStats(
    onUpdate: (stats: VisitStatsMap) => void,
    onError?: (error: unknown) => void
): () => void {
    const colRef = collection(db, COLLECTION_NAME);

    const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
            const stats: VisitStatsMap = {};
            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                stats[docSnap.id] = typeof data.count === "number" ? data.count : 0;
            });
            onUpdate(stats);
        },
        (error) => {
            console.warn("subscribeToVisitStats error:", error);
            onError?.(error);
        }
    );

    return unsubscribe;
}

export async function incrementVisitStat(placeId: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, placeId);
    try {
        await setDoc(
            docRef,
            { count: increment(1), lastVisitedAt: serverTimestamp() },
            { merge: true }
        );
    } catch (err) {
        console.warn("incrementVisitStat ล้มเหลว:", err);
    }
}