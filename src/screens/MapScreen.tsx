import React, { useState, useRef, useEffect } from "react";
import { useMemo } from "react";
import { fetchRouteCoordinates } from "../utils/Fetchroute";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import MapView, { Marker, Polyline, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { PLACES, Place, ROUTE_COORDINATES, ROUTE_TITLE, ROUTE_TOTAL_DISTANCE_KM, } from "../data/places";
import { useLivePlaces } from "../hooks/useLivePlaces";
import { useVisitStats } from "../hooks/useVisitStats";
import { computeMarkerOffsets, resolveMarkerOverlaps } from "../utils/RouteGeometry";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, CATEGORY_COLORS } from "../theme/colors";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";

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
  const { places: PLACES } = useLivePlaces();

  const { counts, recordVisit } = useVisitStats();

  const [roadRoute, setRoadRoute] = useState(ROUTE_COORDINATES);
  const [currentZoomDelta, setCurrentZoomDelta] = useState(INITIAL_REGION.latitudeDelta);
  const [searchText, setSearchText] = useState("");
  const [panelHeight, setPanelHeight] = useState(100);
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

  const searchResults = searchText.trim()
    ? PLACES.filter((p) =>
      p.name.toLowerCase().includes(searchText.trim().toLowerCase()) ||
      (p.nameEn ?? "").toLowerCase().includes(searchText.trim().toLowerCase())
    )
    : [];
  const handleSelectSearchResult = (place: Place) => {
    setSearchText("");
    focusPlace(place);
  };

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

  const showFullRoute = (animated: boolean = true) => {
    const { height } = Dimensions.get("window");
    mapRef.current?.fitToCoordinates(ROUTE_COORDINATES, {
      edgePadding: {
        top: Math.round(height * 0.12),
        right: 40,
        bottom: panelHeight + 20,
        left: 40,
      },
      animated,
    });
  };

  return (
    <SafeAreaView style={styles.container}>


      <View style={[styles.searchWrapper, { top: insets.top + 10 }]}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={18} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="ค้นหาสถานที่..."
            placeholderTextColor={COLORS.textSecondary}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <MaterialCommunityIcons name="close-circle" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {searchResults.length > 0 && (
          <View style={styles.searchResultsBox}>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.searchResultRow}
                  onPress={() => handleSelectSearchResult(item)}
                >
                  <View
                    style={[
                      styles.searchResultDot,
                      { backgroundColor: CATEGORY_COLORS[item.category].fill },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={CATEGORY_COLORS[item.category].icon as any}
                      size={14}
                      color={CATEGORY_COLORS[item.category].text}
                    />
                  </View>
                  <Text style={styles.searchResultText} numberOfLines={1}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        initialRegion={INITIAL_REGION}
        toolbarEnabled={false}
        onRegionChangeComplete={(region) => setCurrentZoomDelta(region.latitudeDelta)}
        onMapReady={() => showFullRoute(false)}
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
          strokeWidth={8}
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
                {currentZoomDelta < 0.25 && (
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
                  <View style={styles.calloutHintRow}>
                    <Text style={styles.calloutHint} numberOfLines={1}>
                      แตะเพื่อดูรายละเอียด
                    </Text>
                    <MaterialCommunityIcons name="arrow-right" size={12} color="#8A8378" />
                  </View>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.bottomPanel} onLayout={(e) => setPanelHeight(e.nativeEvent.layout.height)}>
        <View style={styles.bottomPanelRow}>
          <View style={styles.panelLogoCircle}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.panelLogoImage}
              resizeMode="contain"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bottomPanelTitle} numberOfLines={1}>
              {ROUTE_TITLE}
            </Text>
            <View style={styles.bottomPanelStatsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="road-variant" size={14} color={COLORS.textSecondary} />
                <Text style={styles.statText}>
                  {routeInfo ? `${routeInfo.distanceKm.toFixed(1)} กม.` : `${ROUTE_TOTAL_DISTANCE_KM} กม.`}
                </Text>
              </View>
              {routeInfo && (
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="clock-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.statText}>{Math.round(routeInfo.durationMin)} นาที</Text>
                </View>
              )}
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="map-marker-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.statText}>{PLACES.length} จุด</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.overviewPillButton}
            onPress={() => showFullRoute()}
          >
            <MaterialCommunityIcons name="crop-free" size={14} color="#FFFFFF" />
            <Text style={styles.overviewPillButtonText}>ภาพรวม</Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF3",
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
    minWidth: 120,
    maxWidth: 175,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  calloutTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2D2A26",
  },
  calloutHintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  calloutHint: {
    fontSize: 10.5,
    color: "#8A8378",
  },
  searchWrapper: {
    position: "absolute",
    left: 14,
    right: 14,
    zIndex: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: COLORS.textPrimary,
    padding: 0,
  },
  searchResultsBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginTop: 6,
    maxHeight: 220,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    overflow: "hidden",
  },
  searchResultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchResultDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  searchResultText: {
    flex: 1,
    fontSize: 13.5,
    color: COLORS.textPrimary,
  },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 10,
  },
  panelLogoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F8EF",
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  panelLogoImage: {
    width: 22,
    height: 22,
  },
  bottomPanelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  bottomPanelTitle: {
    fontSize: 14.5,
    fontWeight: "800",
    color: "#2D2A26",
    marginBottom: 4,
  },
  bottomPanelStatsRow: {
    flexDirection: "row",
    gap: 14,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
  },
  overviewPillButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#2FBB15",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  overviewPillButtonText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "700",
  },
});