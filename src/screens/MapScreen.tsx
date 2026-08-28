import React, { useState, useRef, useEffect } from "react";
import { useMemo } from "react";
import { fetchRouteCoordinates } from "../utils/Fetchroute";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import MapView, { Marker, Polyline, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { PLACES, Place, ROUTE_COORDINATES, ROUTE_TITLE, ROUTE_TOTAL_DISTANCE_KM, } from "../data/places";
import { useVisitCounts } from "../utils/Visitcounter";
import { computeMarkerOffsets, resolveMarkerOverlaps } from "../utils/RouteGeometry";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, CATEGORY_COLORS } from "../theme/colors";
import { useNavigation } from "@react-navigation/native";

const INITIAL_REGION = {
  latitude: 13.83,
  longitude: 100.255,
  latitudeDelta: 0.14,
  longitudeDelta: 0.14,
};

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const { counts, recordVisit } = useVisitCounts();

  const [roadRoute, setRoadRoute] = useState(ROUTE_COORDINATES);
  const [currentZoomDelta, setCurrentZoomDelta] = useState(INITIAL_REGION.latitudeDelta);
  const [routeInfo, setRouteInfo] = useState<{
    distanceKm: number;
    durationMin: number;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const origin = ROUTE_COORDINATES[0];
    const destination = ROUTE_COORDINATES[ROUTE_COORDINATES.length - 1];

    fetchRouteCoordinates([origin, destination]).then((result) => {
      if (!isMounted) return;
      setRoadRoute(result.coordinates);
      if (!result.isFallback) {
        setRouteInfo({
          distanceKm: result.distanceMeters / 1000,
          durationMin: result.durationSeconds / 60,
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const markerOffsets = useMemo(
    () => {
      const base = computeMarkerOffsets(PLACES, roadRoute, 1);
      const resolved = resolveMarkerOverlaps(base, 130);
      return resolved;
    },
    [roadRoute]
  );
  const offsetById = useMemo(() => {
    const map: Record<string, { trueCoordinate: any; displayCoordinate: any }> = {};
    markerOffsets.forEach((o) => (map[o.id] = o));
    return map;
  }, [markerOffsets]);

  const focusPlace = (place: Place) => {
    mapRef.current?.animateToRegion(
      {
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },
      450
    );
  };

  const openPlaceDetail = (place: Place) => {
    recordVisit(place.id);
    navigation.navigate("PlaceDetail", { placeId: place.id });
  };

  const showFullRoute = () => {
    mapRef.current?.fitToCoordinates(ROUTE_COORDINATES, {
      edgePadding: { top: 60, right: 40, bottom: 180, left: 40 },
      animated: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{ROUTE_TITLE}</Text>
          <Text style={styles.headerSubtitle}>
            {routeInfo
              ? `ระยะทางจริงตามถนน ${routeInfo.distanceKm.toFixed(1)} กม. · ประมาณ ${Math.round(routeInfo.durationMin)} นาที`
              : `ระยะทางรวมประมาณ ${ROUTE_TOTAL_DISTANCE_KM} กิโลเมตร · ${PLACES.length} จุด`}
          </Text>
        </View>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        initialRegion={INITIAL_REGION}
        toolbarEnabled={false}
        onRegionChangeComplete={(region) => setCurrentZoomDelta(region.latitudeDelta)}
      >
        {markerOffsets.map((o) => (
          <Polyline
            key={`connector-${o.id}`}
            coordinates={[o.trueCoordinate, o.displayCoordinate]}
            strokeColor="#8A8378"
            strokeWidth={1.5}
            lineDashPattern={[5, 4]}
          />
        ))}

        <Polyline
          coordinates={roadRoute}
          strokeColor="#D7263D"
          strokeWidth={4}
        />

        {PLACES.map((place) => (
          <Marker
            key={`true-${place.id}`}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
          >
            <View style={styles.trueDot} />
          </Marker>
        ))}

        {PLACES.map((place) => {
          const visitCount = counts[place.id] ?? 0;
          const offset = offsetById[place.id];
          const displayCoordinate = offset ? offset.displayCoordinate : { latitude: place.latitude, longitude: place.longitude };
          return (
            <Marker
              key={place.id}
              coordinate={displayCoordinate}
              onPress={() => focusPlace(place)}
              onCalloutPress={() => openPlaceDetail(place)}
              tracksViewChanges={true}
              anchor={{ x: 0.5, y: 1 }}
              calloutAnchor={{ x: 0.5, y: -0.15 }}
            >
              <View style={styles.markerWrapper}>
                {currentZoomDelta < 0.04 && (
                  <View style={styles.markerLabelBubble}>
                    <Text style={styles.markerLabelText}>
                      {place.name}
                    </Text>
                  </View>
                )}
                <View
                  style={[
                    styles.markerPin,
                    { backgroundColor: CATEGORY_COLORS[place.category].fill },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={CATEGORY_COLORS[place.category].icon as any}
                    size={16}
                    color={CATEGORY_COLORS[place.category].text}
                  />
                </View>
                {visitCount > 0 && (
                  <View style={styles.visitBadge}>
                    <Text style={styles.visitBadgeText}>
                      {visitCount > 99 ? "99+" : visitCount}
                    </Text>
                  </View>
                )}
              </View>

              <Callout tooltip onPress={() => openPlaceDetail(place)}>
                <View style={styles.calloutCard}>
                  {place.image ? (
                    <Image
                      source={place.image}
                      style={styles.calloutImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.calloutImagePlaceholder}>
                      <MaterialCommunityIcons
                        name="image-off-outline"
                        size={22}
                        color="#B5AFA0"
                      />
                    </View>
                  )}
                  <Text style={styles.calloutHint}>แตะเพื่อดูรายละเอียด →</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <TouchableOpacity
        style={[styles.overviewButton, { top: insets.top + 10 }]}
        onPress={showFullRoute}
      >
        <Text style={styles.overviewButtonText}>ภาพรวมเส้นทาง</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF3",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#FFFBF3",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#2D2A26",
  },
  headerSubtitle: {
    fontSize: 12.5,
    color: "#8A8378",
    marginTop: 2,
  },
  statsBadge: {
    backgroundColor: "#2D2A26",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  statsNumber: {
    color: "#FFFBF3",
    fontWeight: "800",
    fontSize: 16,
  },
  statsLabel: {
    color: "#C9C2B3",
    fontSize: 9.5,
    marginTop: 1,
  },
  map: {
    flex: 1,
  },
  markerWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerPin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  markerText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
  trueDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2D2A26",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  visitBadge: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: COLORS.routeRed,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  visitBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  overviewButton: {
    position: "absolute",
    right: 14,
    backgroundColor: "#2FBB15",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    zIndex: 10,
  },
  overviewButtonText: {
    color: "#FFFBF3",
    fontSize: 12.5,
    fontWeight: "700",
  },
  markerLabelBubble: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginBottom: 3,
    maxWidth: 160,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  markerLabelText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#2D2A26",
    textAlign: "center",
  },
  calloutCard: {
    width: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  calloutImage: {
    width: "100%",
    height: 90,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#F3ECDB",
  },
  calloutImagePlaceholder: {
    width: "100%",
    height: 90,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#F3ECDB",
    alignItems: "center",
    justifyContent: "center",
  },
  calloutTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2D2A26",
  },
  calloutHint: {
    fontSize: 10.5,
    color: "#8A8378",
    marginTop: 2,
    textAlign: "center",
  },
});