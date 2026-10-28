import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { PLACES } from "../../data/places";
import { COLORS, CATEGORY_COLORS } from "../../theme/colors";

export default function AdminEditListScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#35C71A", "#1B7A0B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.heroRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.heroSubtitle}>จัดการข้อมูล</Text>
            <Text style={styles.heroTitle}>แก้ไขข้อมูลสถานที่</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.card}>
          <FlatList
            data={PLACES}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item, index }) => {
              const cat = CATEGORY_COLORS[item.category];
              return (
                <TouchableOpacity
                  style={[
                    styles.row,
                    index < PLACES.length - 1 && styles.rowDivider,
                  ]}
                  onPress={() =>
                    navigation.navigate("AdminEditPlace", { placeId: item.id })
                  }
                  activeOpacity={0.7}
                >
                  <View style={[styles.dot, { backgroundColor: cat.fill }]}>
                    <MaterialCommunityIcons
                      name={cat.icon as any}
                      size={16}
                      color={cat.text}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowTitle}>{item.name}</Text>
                    <Text style={styles.rowSubtitle}>{item.highlight}</Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}

const cardShadow = {
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: { paddingHorizontal: 20, paddingBottom: 38 },
  heroRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  heroTitle: { color: "#FFFFFF", fontSize: 19, fontWeight: "800", marginTop: 2 },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 22,
    marginTop: -18,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    ...cardShadow,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  dot: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { fontSize: 13, fontWeight: "700", color: COLORS.textPrimary },
  rowSubtitle: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
});