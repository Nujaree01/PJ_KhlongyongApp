// screens/admin/AdminEditListScreen.tsx
// รายการสถานที่ทั้งหมด — แตะเพื่อไปแก้ไขทีละจุด

import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { PLACES } from "../../data/places";
import { CATEGORY_COLORS } from "../../theme/colors";
import { COLORS } from "../../theme/colors";

export default function AdminEditListScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>แก้ไขข้อมูลสถานที่</Text>
      </View>

      <FlatList
        data={PLACES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const cat = CATEGORY_COLORS[item.category];
          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() =>
                navigation.navigate("AdminEditPlace", { placeId: item.id })
              }
              activeOpacity={0.8}
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
                name="pencil-outline"
                size={18}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.routeRed },
  header: {
    backgroundColor: COLORS.routeRed,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  dot: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary },
  rowSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
});
