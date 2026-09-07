// screens/admin/AdminMenuScreen.tsx
// เมนูหลักหลัง login สำเร็จ — แก้ไขข้อมูลสถานที่ / ช่วยเหลือ / ออกจากระบบ

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../theme/colors";
import { logout } from "../../utils/adminAuth";

const MENU_ITEMS = [
  {
    key: "edit",
    icon: "map-marker-radius-outline",
    title: "แก้ไขข้อมูลสถานที่",
    subtitle: "แก้ชื่อ คำอธิบาย รูปภาพ เบอร์ติดต่อ",
    screen: "AdminEditList",
  },
  {
    key: "help",
    icon: "help-circle-outline",
    title: "ช่วยเหลือ",
    subtitle: "วิธีใช้งานหน้าแอดมิน",
    screen: "AdminHelp",
  },
] as const;

export default function AdminMenuScreen() {
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    Alert.alert("ออกจากระบบ", "ต้องการออกจากระบบแอดมินหรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ออกจากระบบ",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.replace("AdminLogin");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>แอดมิน</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialCommunityIcons name="logout" size={16} color="#fff" />
          <Text style={styles.logoutText}>ออกจากระบบ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.menuCard}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.8}
          >
            <View style={styles.menuIconCircle}>
              <MaterialCommunityIcons
                name={item.icon as any}
                size={24}
                color={COLORS.routeRed}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>
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
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  logoutText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  body: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  menuIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  menuTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
