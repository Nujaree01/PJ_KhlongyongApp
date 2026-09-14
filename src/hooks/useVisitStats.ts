import { useCallback, useEffect, useRef, useState } from "react";
import { subscribeToVisitStats, incrementVisitStat, VisitStatsMap } from "../services/visitStats";

export function useVisitStats() {
    const [counts, setCounts] = useState<VisitStatsMap>({});
    const [loaded, setLoaded] = useState(false);
    const lastRecordedRef = useRef<Record<string, number>>({});

    useEffect(() => {
        const unsubscribe = subscribeToVisitStats(
            (stats) => {
                setCounts(stats);
                setLoaded(true);
            },
            () => setLoaded(true)
        );
        return unsubscribe;
    }, []);

    const recordVisit = useCallback((placeId: string) => {
        const now = Date.now();
        const lastTime = lastRecordedRef.current[placeId] ?? 0;

        if (now - lastTime < 1500) {
            return;
        }

        lastRecordedRef.current[placeId] = now;
        incrementVisitStat(placeId);
    }, []);

    const totalVisits = Object.values(counts).reduce((sum, n) => sum + n, 0);
    const visitedPlacesCount = Object.keys(counts).filter((k) => counts[k] > 0).length;

    return { counts, loaded, recordVisit, totalVisits, visitedPlacesCount };
}