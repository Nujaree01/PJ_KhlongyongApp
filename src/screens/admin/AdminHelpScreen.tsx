import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../theme/colors";

const HELP_SECTIONS = [
  {
    icon: "map-marker-radius-outline",
    iconBg: "#EAF5DD",
    iconColor: "#27500A",
    title: "แก้ไขข้อมูลสถานที่",
    body:
      "เลือกสถานที่จากรายการ แล้วแก้ไขชื่อ คำอธิบาย เคล็ดลับ เวลาเปิด-ปิด เบอร์โทร หรือรูปภาพ (ใส่เป็นลิงก์ URL) จากนั้นกด \"บันทึกการเปลี่ยนแปลง\" ข้อมูลจะอัปเดตให้ผู้ใช้ทุกคนเห็นทันทีแบบ real-time โดยไม่ต้องอัปเดตแอปใหม่",
  },
  {
    icon: "map-marker-path",
    iconBg: "#E4EFFB",
    iconColor: "#0C447C",
    title: "พิกัดและลำดับเส้นทาง",
    body:
      "พิกัด ลำดับจุด และหมวดหมู่ของแต่ละสถานที่ ยังไม่สามารถแก้ไขผ่านหน้านี้ได้ ต้องแก้ในไฟล์ data/places.ts โดยนักพัฒนาโดยตรง",
  },
  {
    icon: "wifi-off",
    iconBg: "#FBEAE3",
    iconColor: "#4A1B0C",
    title: "บันทึกไม่สำเร็จ",
    body:
      "ถ้าบันทึกแล้วขึ้นข้อความผิดพลาด ให้เช็คว่าเชื่อมต่ออินเทอร์เน็ตอยู่ และตรวจสอบว่าตั้งค่า Firebase ในแอปถูกต้องแล้ว",
  },
  {
    icon: "account-key-outline",
    iconBg: "#FDF1DC",
    iconColor: "#633806",
    title: "เปลี่ยนรหัสผ่านแอดมิน",
    body:
      "ไปที่เมนู \"เปลี่ยนรหัสผ่าน\" ในหน้าแอดมิน กรอกอีเมลและรหัสผ่านปัจจุบันเพื่อยืนยันตัวตน แล้วตั้งอีเมลและรหัสผ่านใหม่",
  },
];

export default function AdminHelpScreen() {
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
            <Text style={styles.heroSubtitle}>ผู้ดูแลระบบ</Text>
            <Text style={styles.heroTitle}>ช่วยเหลือ</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {HELP_SECTIONS.map((s, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconCircle, { backgroundColor: s.iconBg }]}>
                  <MaterialCommunityIcons
                    name={s.icon as any}
                    size={18}
                    color={s.iconColor}
                  />
                </View>
                <Text style={styles.cardTitle}>{s.title}</Text>
              </View>
              <Text style={styles.cardBody}>{s.body}</Text>
            </View>
          ))}
          <View style={{ height: 24 }} />
        </View>
      </ScrollView>
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
    padding: 14,
    marginBottom: 12,
    ...cardShadow,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  cardIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 13.5, fontWeight: "700", color: COLORS.textPrimary },
  cardBody: { fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 19 },
});