export interface Coordinate {
  latitude: number;
  longitude: number;
}

export type LandmarkCategory =
  | "start"
  | "end"
  | "market"
  | "nature"
  | "learning"
  | "temple"
  | "farm"
  | "university"
  | "rest";

export interface Landmark {
  id: string;
  order: number;
  name: string;
  nameEn?: string;
  category: LandmarkCategory;
  description: string;
  coordinate: Coordinate;
  distanceFromStartKm?: number;
  imageUrl?: string;
  isCoordinateApproximate?: boolean;
}

export interface RouteInfo {
  totalDistanceKm: number;
  startPoint: Landmark;
  endPoint: Landmark;
  waypoints: Landmark[];
}
