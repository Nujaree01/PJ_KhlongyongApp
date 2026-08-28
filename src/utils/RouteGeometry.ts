import { Coordinate, haversineDistanceKm } from "./Distance";

export interface NearestPointResult {
    point: Coordinate;
    distanceKm: number;
}

export function findNearestPointOnRoute(
    target: Coordinate,
    routeCoords: Coordinate[]
): NearestPointResult {
    let nearest = routeCoords[0];
    let minDist = Infinity;

    for (const point of routeCoords) {
        const d = haversineDistanceKm(target, point);
        if (d < minDist) {
            minDist = d;
            nearest = point;
        }
    }

    return { point: nearest, distanceKm: minDist };
}

export function computeConnectorLines<T extends { id: string; latitude: number; longitude: number }>(
    places: T[],
    routeCoords: Coordinate[],
    thresholdKm: number = 0.35
): { id: string; coordinates: Coordinate[] }[] {
    if (routeCoords.length === 0) return [];

    return places
        .map((place) => {
            const target: Coordinate = {
                latitude: place.latitude,
                longitude: place.longitude,
            };
            const { point, distanceKm } = findNearestPointOnRoute(target, routeCoords);
            if (distanceKm <= thresholdKm) return null;
            return {
                id: place.id,
                coordinates: [target, point],
            };
        })
        .filter((c): c is { id: string; coordinates: Coordinate[] } => c !== null);
}

export interface MarkerOffsetResult {
    id: string;
    trueCoordinate: Coordinate;
    displayCoordinate: Coordinate;
}

export function computeMarkerOffsets<
    T extends { id: string; latitude: number; longitude: number }
>(
    places: T[],
    routeCoords: Coordinate[],
    offsetMeters: number = 90
): MarkerOffsetResult[] {
    if (routeCoords.length < 2) {
        return places.map((p) => ({
            id: p.id,
            trueCoordinate: { latitude: p.latitude, longitude: p.longitude },
            displayCoordinate: { latitude: p.latitude, longitude: p.longitude },
        }));
    }

    return places.map((place, idx) => {
        const target: Coordinate = {
            latitude: place.latitude,
            longitude: place.longitude,
        };

        // หาจุดที่ใกล้ที่สุดบนเส้นทางหลัก
        let nearestIdx = 0;
        let minDist = Infinity;
        routeCoords.forEach((pt, i) => {
            const d = haversineDistanceKm(target, pt);
            if (d < minDist) {
                minDist = d;
                nearestIdx = i;
            }
        });

        // หาทิศทางเส้นทาง ณ จุดนั้น จากจุดก่อน-หลัง
        const prevIdx = Math.max(0, nearestIdx - 1);
        const nextIdx = Math.min(routeCoords.length - 1, nearestIdx + 1);
        const p1 = routeCoords[prevIdx];
        const p2 = routeCoords[nextIdx];

        const dx = p2.longitude - p1.longitude;
        const dy = p2.latitude - p1.latitude;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;

        // เวกเตอร์ตั้งฉากกับเส้นทาง (หมุน 90 องศา)
        let perpX = -dy / len;
        let perpY = dx / len;

        // สลับข้างซ้าย-ขวาสลับกันไปตามลำดับ กันป้ายชนกันเป็นแถวเดียวฝั่งเดียว
        const side = idx % 2 === 0 ? 1 : -1;
        perpX *= side;
        perpY *= side;

        const metersPerDegLat = 111320;
        const metersPerDegLng =
            111320 * Math.cos((target.latitude * Math.PI) / 180);

        const displayCoordinate: Coordinate = {
            latitude: target.latitude + (perpY * offsetMeters) / metersPerDegLat,
            longitude: target.longitude + (perpX * offsetMeters) / metersPerDegLng,
        };

        return { id: place.id, trueCoordinate: target, displayCoordinate };
    });
}

export function resolveMarkerOverlaps(
    offsets: MarkerOffsetResult[],
    minSeparationMeters: number = 130
): MarkerOffsetResult[] {
    const metersPerDegLat = 111320;
    const results = offsets.map((o) => ({
        ...o,
        displayCoordinate: { ...o.displayCoordinate },
    }));

    const iterations = 10;
    for (let iter = 0; iter < iterations; iter++) {
        for (let i = 0; i < results.length; i++) {
            for (let j = i + 1; j < results.length; j++) {
                const a = results[i].displayCoordinate;
                const b = results[j].displayCoordinate;
                const distM =
                    haversineDistanceKm(a, b) * 1000; // กม. -> เมตร

                if (distM < minSeparationMeters) {
                    const metersPerDegLng =
                        111320 * Math.cos((a.latitude * Math.PI) / 180);

                    let dx = a.longitude - b.longitude;
                    let dy = a.latitude - b.latitude;
                    let len = Math.sqrt(dx * dx + dy * dy);

                    if (len === 0) {
                        // จุดซ้อนกันพอดี สุ่มทิศเพื่อเริ่มแยก
                        dx = Math.random() - 0.5;
                        dy = Math.random() - 0.5;
                        len = Math.sqrt(dx * dx + dy * dy) || 1;
                    }
                    dx /= len;
                    dy /= len;

                    const pushMeters = (minSeparationMeters - distM) / 2;
                    const pushLat = (pushMeters * dy) / metersPerDegLat;
                    const pushLng = (pushMeters * dx) / metersPerDegLng;

                    a.latitude += pushLat;
                    a.longitude += pushLng;
                    b.latitude -= pushLat;
                    b.longitude -= pushLng;
                }
            }
        }
    }

    return results;
}