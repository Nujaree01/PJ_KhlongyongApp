export interface Coordinate {
    latitude: number;
    longitude: number;
}

const toRad = (value: number) => (value * Math.PI) / 180;

export function haversineDistanceKm(a: Coordinate, b: Coordinate): number {
    const R = 6371; // รัศมีโลก (กม.)
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);

    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

    return R * c;
}

export function totalRouteDistanceKm(points: Coordinate[]): number {
    let total = 0;
    for (let i = 1; i < points.length; i++) {
        total += haversineDistanceKm(points[i - 1], points[i]);
    }
    return total;
}