// screens/admin/AdminHelpScreen.tsx
// หน้าช่วยเหลือ — อธิบายวิธีใช้งานหน้าแอดมิน

import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../theme/colors";

const HELP_SECTIONS = [
  {
    icon: "map-marker-radius-outline",
    title: "แก้ไขข้อมูลสถานที่",
    body:
      "เลือกสถานที่จากรายการ แล้วแก้ไขชื่อ คำอธิบาย เคล็ดลับ เวลาเปิด-ปิด เบอร์โทร หรือรูปภาพ (ใส่เป็นลิงก์ URL) จากนั้นกด \"บันทึกการเปลี่ยนแปลง\" ข้อมูลจะอัปเดตให้ผู้ใช้ทุกคนเห็นทันทีแบบ real-time โดยไม่ต้องอัปเดตแอปใหม่",
  },
  {
    icon: "map-marker-path",
    title: "พิกัดและลำดับเส้นทาง",
    body:
      "พิกัด (ละติจูด/ลองจิจูด) ลำดับจุด และหมวดหมู่ของแต่ละสถานที่ ยังไม่สามารถแก้ไขผ่านหน้านี้ได้ ต้องแก้ในไฟล์ data/places.ts โดยนักพัฒนาโดยตรง",
  },
  {
    icon: "wifi-off",
    title: "บันทึกไม่สำเร็จ",
    body:
      "ถ้าบันทึกแล้วขึ้นข้อความผิดพลาด ให้เช็คว่าเชื่อมต่ออินเทอร์เน็ตอยู่ และตรวจสอบว่าตั้งค่า Firebase ในแอปถูกต้องแล้ว",
  },
  {
    icon: "account-key-outline",
    title: "เปลี่ยนรหัสผ่านแอดมิน",
    body:
      "ขณะนี้ยังไม่มีเมนูเปลี่ยนรหัสผ่านในแอป หากต้องการเปลี่ยน กรุณาติดต่อผู้พัฒนาระบบ",
  },
];

export default function AdminHelpScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ช่วยเหลือ</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {HELP_SECTIONS.map((s, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name={s.icon as any}
                size={20}
                color={COLORS.routeRed}
              />
              <Text style={styles.cardTitle}>{s.title}</Text>
            </View>
            <Text style={styles.cardBody}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
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
  body: {
    backgroundColor: COLORS.background,
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary },
  cardBody: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
});
