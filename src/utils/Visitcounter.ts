// utils/visitCounter.ts
// ระบบนับจำนวนครั้งที่ผู้ใช้เปิดดูรายละเอียดแต่ละสถานที่ เก็บถาวรในเครื่องด้วย AsyncStorage

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "@khlongyong_visit_counts";

export type VisitCounts = Record<string, number>;

/** อ่านข้อมูลตัวนับทั้งหมดจาก AsyncStorage */
export async function loadVisitCounts(): Promise<VisitCounts> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as VisitCounts) : {};
    } catch (err) {
        console.warn("โหลดข้อมูลตัวนับการเข้าชมล้มเหลว:", err);
        return {};
    }
}

/** บันทึกข้อมูลตัวนับทั้งหมดกลับลง AsyncStorage */
async function saveVisitCounts(counts: VisitCounts): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
    } catch (err) {
        console.warn("บันทึกข้อมูลตัวนับการเข้าชมล้มเหลว:", err);
    }
}

/** เพิ่มตัวนับของสถานที่ 1 จุด แล้วคืนค่าตัวนับใหม่ทั้งหมด */
export async function incrementVisitCount(
    placeId: string
): Promise<VisitCounts> {
    const current = await loadVisitCounts();
    const updated: VisitCounts = {
        ...current,
        [placeId]: (current[placeId] ?? 0) + 1,
    };
    await saveVisitCounts(updated);
    return updated;
}

/** ล้างข้อมูลตัวนับทั้งหมด (ใช้สำหรับปุ่ม "รีเซ็ตสถิติ") */
export async function resetVisitCounts(): Promise<VisitCounts> {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return {};
}

/**
 * Hook สำหรับใช้ในหน้าจอ: โหลดตัวนับตอน mount
 * และมีฟังก์ชัน recordVisit(placeId) ให้เรียกเมื่อผู้ใช้เปิดดูสถานที่
 */
export function useVisitCounts() {
    const [counts, setCounts] = useState<VisitCounts>({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadVisitCounts().then((c) => {
            setCounts(c);
            setLoaded(true);
        });
    }, []);

    const recordVisit = useCallback(async (placeId: string) => {
        const updated = await incrementVisitCount(placeId);
        setCounts(updated);
    }, []);

    const resetAll = useCallback(async () => {
        const cleared = await resetVisitCounts();
        setCounts(cleared);
    }, []);

    const totalVisits = Object.values(counts).reduce((sum, n) => sum + n, 0);
    const visitedPlacesCount = Object.keys(counts).filter(
        (k) => counts[k] > 0
    ).length;

    return { counts, loaded, recordVisit, resetAll, totalVisits, visitedPlacesCount };
}