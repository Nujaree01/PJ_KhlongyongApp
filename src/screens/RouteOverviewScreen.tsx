import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LANDMARKS, TOTAL_ROUTE_DISTANCE_KM } from "../data/landmarks";
import { Landmark } from "../types";
import { CATEGORY_COLORS, CATEGORY_LABELS, COLORS } from "../theme/colors";
import PlaceDetailModal from "../components/PlaceDetailModal";
import { Linking, Platform } from "react-native";

export default function RouteOverviewScreen() {
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);

  const openDetail = (landmark: Landmark) => {
    setSelectedLandmark(landmark);
    setModalVisible(true);
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
        <Text style={styles.headerSubtitle}>ภาพรวมเส้นทาง</Text>
        <Text style={styles.headerTitle}>
          {LANDMARKS.length} จุดหมาย · {TOTAL_ROUTE_DISTANCE_KM} กม.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.timelineContainer}>
        <View style={styles.centerLine} />

        {LANDMARKS.map((landmark, index) => {
          const isLeft = index % 2 === 0;
          const colors = CATEGORY_COLORS[landmark.category];

          return (
            <View key={landmark.id} style={styles.row}>
              <View style={[styles.side, isLeft ? null : styles.sideEmpty]}>
                {isLeft && (
                  <TimelineCard
                    landmark={landmark}
                    colors={colors}
                    align="right"
                    onPress={() => openDetail(landmark)}
                  />
                )}
              </View>

              <View style={styles.centerColumn}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: colors.fill, borderColor: colors.text },
                  ]}
                >
                  <Text style={[styles.dotText, { color: colors.text }]}>
                    {landmark.order}
                  </Text>
                </View>
              </View>

              <View style={[styles.side, isLeft ? styles.sideEmpty : null]}>
                {!isLeft && (
                  <TimelineCard
                    landmark={landmark}
                    colors={colors}
                    align="left"
                    onPress={() => openDetail(landmark)}
                  />
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <PlaceDetailModal
        landmark={selectedLandmark}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onNavigatePress={handleNavigatePress}
      />
    </View>
  );
}

function TimelineCard({
  landmark,
  colors,
  align,
  onPress,
}: {
  landmark: Landmark;
  colors: { fill: string; text: string; icon: string };
  align: "left" | "right";
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, align === "right" ? styles.cardRight : styles.cardLeft]}
      onPress={onPress}
    >
      <View style={[styles.cardIcon, { backgroundColor: colors.fill }]}>
        <MaterialCommunityIcons name={colors.icon as any} size={18} color={colors.text} />
      </View>
      <Text style={[styles.cardLabel, { color: colors.text }]}>
        {CATEGORY_LABELS[landmark.category]}
      </Text>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {landmark.name}
      </Text>
      {typeof landmark.distanceFromStartKm === "number" && (
        <Text style={styles.cardDistance}>
          กม. ที่ {landmark.distanceFromStartKm}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.routeRed,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerSubtitle: { color: "#fff", opacity: 0.85, fontSize: 11 },
  headerTitle: { color: "#fff", fontSize: 17, fontWeight: "700", marginTop: 2 },
  timelineContainer: { paddingVertical: 20, paddingHorizontal: 12 },
  centerLine: {
    position: "absolute",
    top: 20,
    bottom: 20,
    left: "50%",
    width: 3,
    marginLeft: -1.5,
    backgroundColor: COLORS.routeRed,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 100,
  },
  side: { flex: 1 },
  sideEmpty: {},
  centerColumn: {
    width: 40,
    alignItems: "center",
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  dotText: { fontSize: 12, fontWeight: "700" },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
  },
  cardLeft: { marginLeft: 8 },
  cardRight: { marginRight: 8 },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  cardLabel: { fontSize: 10, fontWeight: "600" },
  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  cardDistance: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
