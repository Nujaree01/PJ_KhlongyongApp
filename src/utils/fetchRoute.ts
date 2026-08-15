import Constants from "expo-constants";
import { Coordinate } from "../types";

const DIRECTIONS_API_KEY: string | undefined =
  Constants.expoConfig?.extra?.googleDirectionsApiKey;

const DIRECTIONS_URL = "https://maps.googleapis.com/maps/api/directions/json";

function decodePolyline(encoded: string): Coordinate[] {
  const points: Coordinate[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return points;
}

interface FetchRouteResult {
  coordinates: Coordinate[];
  distanceMeters: number;
  durationSeconds: number;
  isFallback: boolean;
}

export async function fetchRouteCoordinates(
  waypointsInOrder: Coordinate[]
): Promise<FetchRouteResult> {
  const straightLineFallback = (): FetchRouteResult => ({
    coordinates: waypointsInOrder,
    distanceMeters: 0,
    durationSeconds: 0,
    isFallback: true,
  });

  if (!DIRECTIONS_API_KEY || waypointsInOrder.length < 2) {
    return straightLineFallback();
  }

  const origin = waypointsInOrder[0];
  const destination = waypointsInOrder[waypointsInOrder.length - 1];
  const middlePoints = waypointsInOrder.slice(1, -1);
  // Google Directions รองรับ waypoint ไม่เกิน 25 จุด (ไม่รวม origin/destination)
  const waypointsParam = middlePoints
    .map((l) => `${l.latitude},${l.longitude}`)
    .join("|");

  const params = new URLSearchParams({
    origin: `${origin.latitude},${origin.longitude}`,
    destination: `${destination.latitude},${destination.longitude}`,
    mode: "driving",
    language: "th",
    key: DIRECTIONS_API_KEY,
  });
  if (waypointsParam) {
    // ใช้ waypoints ตามลำดับที่กำหนดจริง (ไม่ให้ Google ปรับลำดับเอง)
    params.set("waypoints", waypointsParam);
  }

  try {
    const response = await fetch(`${DIRECTIONS_URL}?${params.toString()}`);
    const data = await response.json();

    if (data.status !== "OK" || !data.routes?.length) {
      console.warn("Directions API ไม่สำเร็จ:", data.status, data.error_message);
      return straightLineFallback();
    }

    const route = data.routes[0];
    const legs = route.legs ?? [];
    const distanceMeters = legs.reduce(
      (sum: number, leg: any) => sum + (leg.distance?.value ?? 0),
      0
    );
    const durationSeconds = legs.reduce(
      (sum: number, leg: any) => sum + (leg.duration?.value ?? 0),
      0
    );

    const coordinates = decodePolyline(route.overview_polyline.points);

    return {
      coordinates,
      distanceMeters,
      durationSeconds,
      isFallback: false,
    };
  } catch (error) {
    console.warn("เรียก Directions API ไม่สำเร็จ ใช้เส้นตรงสำรองแทน:", error);
    return straightLineFallback();
  }
}
