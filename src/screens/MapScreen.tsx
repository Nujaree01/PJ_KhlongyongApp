import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import {
  PLACES,
  Place,
  ROUTE_COORDINATES,
  ROUTE_TITLE,
  ROUTE_TOTAL_DISTANCE_KM,
  CATEGORY_COLORS,
} from "../data/places";
import PlaceDetailModal from "../components/PlaceDetailModal";
import { useVisitCounts } from "../utils/Visitcounter";

const INITIAL_REGION = {
  latitude: 13.83,
  longitude: 100.255,
  latitudeDelta: 0.14,
  longitudeDelta: 0.14,
};

export default function MapScreen() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const mapRef = useRef<MapView>(null);

  const { counts, recordVisit, resetAll, totalVisits, visitedPlacesCount } =
    useVisitCounts();

  const openPlace = (place: Place) => {
    setSelectedPlace(place);
    setModalVisible(true);
    recordVisit(place.id); // นับจำนวนครั้งที่เข้าชมสถานที่นี้

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

  const closeModal = () => setModalVisible(false);

  const handleResetStats = () => {
    Alert.alert(
      "รีเซ็ตสถิติการเข้าชม",
      "ต้องการล้างจำนวนการเข้าชมทั้งหมดหรือไม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        { text: "รีเซ็ต", style: "destructive", onPress: resetAll },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{ROUTE_TITLE}</Text>
          <Text style={styles.headerSubtitle}>
            ระยะทางรวมประมาณ {ROUTE_TOTAL_DISTANCE_KM} กิโลเมตร · {PLACES.length} จุด
          </Text>
        </View>

        {/* สรุปสถิติการเข้าชม */}
        <TouchableOpacity
          style={styles.statsBadge}
          onPress={handleResetStats}
          activeOpacity={0.7}
        >
          <Text style={styles.statsNumber}>{totalVisits}</Text>
          <Text style={styles.statsLabel}>
            เข้าชม · {visitedPlacesCount}/{PLACES.length} จุด
          </Text>
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        initialRegion={INITIAL_REGION}
        onMapReady={() => console.log("✅ MAP READY - แผนที่โหลดสำเร็จ")}
        onError={(e) => console.log("❌ MAP ERROR:", e.nativeEvent)}
      >
        <Polyline
          coordinates={ROUTE_COORDINATES}
          strokeColor="#D7263D"
          strokeWidth={4}
        />

        {PLACES.map((place) => {
          const visitCount = counts[place.id] ?? 0;
          return (
            <Marker
              key={place.id}
              coordinate={{ latitude: place.latitude, longitude: place.longitude }}
              onPress={() => openPlace(place)}
            >
              <View style={styles.markerWrapper}>
                <View
                  style={[
                    styles.markerPin,
                    { backgroundColor: CATEGORY_COLORS[place.category] },
                  ]}
                >
                  <Text style={styles.markerText}>{place.order}</Text>
                </View>
                {visitCount > 0 && (
                  <View style={styles.visitBadge}>
                    <Text style={styles.visitBadgeText}>
                      {visitCount > 99 ? "99+" : visitCount}
                    </Text>
                  </View>
                )}
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* การ์ดสถานที่แบบเลื่อนแนวนอน */}
      <View style={styles.cardsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsRow}
        >
          {PLACES.map((place) => {
            const visitCount = counts[place.id] ?? 0;
            return (
              <TouchableOpacity
                key={place.id}
                style={styles.card}
                onPress={() => openPlace(place)}
                activeOpacity={0.85}
              >
                <View style={styles.cardTopRow}>
                  <View
                    style={[
                      styles.cardDot,
                      { backgroundColor: CATEGORY_COLORS[place.category] },
                    ]}
                  >
                    <Text style={styles.cardDotText}>{place.order}</Text>
                  </View>
                  {visitCount > 0 && (
                    <View style={styles.cardVisitTag}>
                      <Text style={styles.cardVisitTagText}>
                        👁 {visitCount}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {place.name}
                </Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>
                  {place.highlight}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <PlaceDetailModal
        place={selectedPlace}
        visible={modalVisible}
        onClose={closeModal}
        visitCount={selectedPlace ? counts[selectedPlace.id] ?? 0 : 0}
      />
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
  visitBadge: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: "#D7263D",
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
  cardsWrapper: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
  },
  cardsRow: {
    paddingHorizontal: 14,
    gap: 10,
  },
  card: {
    width: 150,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  cardDotText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
  cardVisitTag: {
    backgroundColor: "#F3ECDB",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cardVisitTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6B5A2E",
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#2D2A26",
  },
  cardSubtitle: {
    fontSize: 11.5,
    color: "#8A8378",
    marginTop: 3,
  },
});