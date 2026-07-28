import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LANDMARKS, TOTAL_ROUTE_DISTANCE_KM } from "../data/landmarks";
import { Coordinate, Landmark } from "../types";
import { fetchRouteCoordinates } from "../utils/fetchRoute";
import { CATEGORY_COLORS, COLORS } from "../theme/colors";
import PlaceDetailModal from "../components/PlaceDetailModal";

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [routeCoords, setRouteCoords] = useState<Coordinate[]>(
    LANDMARKS.map((l) => l.coordinate)
  );
  const [isLoadingRoute, setIsLoadingRoute] = useState(true);
  const [isFallbackRoute, setIsFallbackRoute] = useState(true);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setIsLoadingRoute(true);
      const result = await fetchRouteCoordinates(LANDMARKS);
      if (!isMounted) return;
      setRouteCoords(result.coordinates);
      setIsFallbackRoute(result.isFallback);
      setIsLoadingRoute(false);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkerPress = (landmark: Landmark) => {
    setSelectedLandmark(landmark);
    setModalVisible(true);
    mapRef.current?.animateToRegion(
      {
        latitude: landmark.coordinate.latitude,
        longitude: landmark.coordinate.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      400
    );
  };

  const handleCardPress = (landmark: Landmark) => {
    handleMarkerPress(landmark);
  };

  const handleNavigatePress = (landmark: Landmark) => {
    const { latitude, longitude } = landmark.coordinate;
    const url = Platform.select({
      ios: `maps:0,0?q=${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${encodeURIComponent(
        landmark.name
      )})`,
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>เส้นทางท่องเที่ยวเชื่อมโยง</Text>
        <Text style={styles.headerTitle}>พุทธมณฑล → ตลาดน้ำลำพญา</Text>
        <View style={styles.headerRow}>
          <MaterialCommunityIcons name="map-marker-distance" size={14} color="#fff" />
          <Text style={styles.headerMeta}>
            ระยะทางรวมประมาณ {TOTAL_ROUTE_DISTANCE_KM} กิโลเมตร
          </Text>
          {isFallbackRoute && !isLoadingRoute && (
            <Text style={styles.headerMetaWarn}> · เส้นทางประมาณ (ไม่มี API key)</Text>
          )}
        </View>
      </View>

      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 13.865,
            longitude: 100.245,
            latitudeDelta: 0.35,
            longitudeDelta: 0.35,
          }}
        >
          <Polyline
            coordinates={routeCoords}
            strokeColor={COLORS.routeRed}
            strokeWidth={4}
          />

          {LANDMARKS.map((landmark) => {
            const colors = CATEGORY_COLORS[landmark.category];
            return (
              <Marker
                key={landmark.id}
                coordinate={landmark.coordinate}
                onPress={() => handleMarkerPress(landmark)}
              >
                <View
                  style={[
                    styles.markerPin,
                    { backgroundColor: colors.fill, borderColor: colors.text },
                  ]}
                >
                  <Text style={[styles.markerText, { color: colors.text }]}>
                    {landmark.order}
                  </Text>
                </View>
              </Marker>
            );
          })}
        </MapView>

        {isLoadingRoute && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={COLORS.routeRed} />
            <Text style={styles.loadingText}>กำลังคำนวณเส้นทางตามถนนจริง...</Text>
          </View>
        )}
      </View>

      <FlatList
        horizontal
        data={LANDMARKS}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardList}
        renderItem={({ item }) => {
          const colors = CATEGORY_COLORS[item.category];
          const isSelected = selectedLandmark?.id === item.id;
          return (
            <TouchableOpacity
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => handleCardPress(item)}
            >
              <View style={[styles.cardIcon, { backgroundColor: colors.fill }]}>
                <MaterialCommunityIcons
                  name={colors.icon as any}
                  size={22}
                  color={colors.text}
                />
              </View>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <PlaceDetailModal
        landmark={selectedLandmark}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onNavigatePress={handleNavigatePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.routeRed,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerSubtitle: { color: "#fff", opacity: 0.85, fontSize: 11 },
  headerTitle: { color: "#fff", fontSize: 17, fontWeight: "700", marginTop: 2 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  headerMeta: { color: "#fff", fontSize: 12, opacity: 0.9 },
  headerMetaWarn: { color: "#FDE9E9", fontSize: 11 },
  mapWrapper: { flex: 1 },
  loadingOverlay: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: { fontSize: 12, color: COLORS.textSecondary },
  markerPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  markerText: { fontSize: 12, fontWeight: "700" },
  cardList: { paddingHorizontal: 12, paddingVertical: 12, gap: 10 },
  card: {
    width: 110,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: COLORS.routeRed,
  },
  cardIcon: {
    height: 52,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 6,
  },
});
