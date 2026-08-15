import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";
import { TOTAL_ROUTE_DISTANCE_KM, LANDMARKS } from "../data/landmarks";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const PILLARS = [
  {
    id: "nature",
    title: "การท่องเที่ยวเชิงธรรมชาติ",
    subtitle: "Natural Tourism",
    icon: "leaf",
    fill: "#97C459",
    text: "#27500A",
    description:
      "ส่งเสริมการท่องเที่ยวเชิงนิเวศริมคลองโยง สวนเกษตร และพื้นที่สีเขียวตลอดเส้นทาง",
  },
  {
    id: "product",
    title: "ผลิตภัณฑ์ชุมชน",
    subtitle: "Community Products",
    icon: "basket",
    fill: "#FAC775",
    text: "#633806",
    description:
      "สนับสนุนสินค้าเกษตรและงานฝีมือจากชุมชน ให้นักท่องเที่ยวได้เลือกซื้อระหว่างเส้นทาง",
  },
  {
    id: "leisure",
    title: "แหล่งพักผ่อนสมัยใหม่",
    subtitle: "Modern Leisure",
    icon: "coffee",
    fill: "#85B7EB",
    text: "#0C447C",
    description:
      "จุดพักผ่อน ร้านกาแฟ และพื้นที่นันทนาการที่รองรับนักท่องเที่ยวยุคใหม่",
  },
  {
    id: "culture",
    title: "มรดกทางวัฒนธรรม",
    subtitle: "Cultural Heritage",
    icon: "church",
    fill: "#F0997B",
    text: "#4A1B0C",
    description:
      "อนุรักษ์วัด ตลาดน้ำ และวิถีชีวิตดั้งเดิมของชุมชนคลองโยงให้คงอยู่คู่การท่องเที่ยว",
  },
];

export default function Model4DScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Information ชุมชนคลองโยง</Text>
        </View>

        <View style={styles.pillarGrid}>
          {PILLARS.map((pillar) => (
            <View key={pillar.id} style={styles.pillarCard}>
              <View style={[styles.pillarIcon, { backgroundColor: pillar.fill }]}>
                <MaterialCommunityIcons
                  name={pillar.icon as any}
                  size={24}
                  color={pillar.text}
                />
              </View>
              <Text style={styles.pillarTitle}>{pillar.title}</Text>
              <Text style={styles.pillarSubtitle}>{pillar.subtitle}</Text>
              <Text style={styles.pillarDescription}>{pillar.description}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.routeSummaryCard}
          onPress={() => navigation.navigate("แผนที่")}
        >
          <View style={styles.routeSummaryHeader}>
            <MaterialCommunityIcons name="map-marker-path" size={20} color="#fff" />
            <Text style={styles.routeSummaryTitle}>เส้นทางท่องเที่ยวเชื่อมโยง</Text>
          </View>
          <Text style={styles.routeSummaryText}>
            พุทธมณฑล → ตลาดน้ำลำพญา · {TOTAL_ROUTE_DISTANCE_KM} กม. ·{" "}
            {LANDMARKS.length} จุดหมาย
          </Text>
          <View style={styles.routeSummaryLink}>
            <Text style={styles.routeSummaryLinkText}>ดูแผนที่เส้นทาง</Text>
            <MaterialCommunityIcons name="arrow-right" size={14} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>ติดต่อองค์การบริหารส่วนตำบล</Text>
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL("tel:034989676")}
          >
            <MaterialCommunityIcons name="phone" size={18} color={COLORS.routeRed} />
            <Text style={styles.contactText}>034-989676</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.routeRed },
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 32 },
  header: {
    backgroundColor: COLORS.routeRed,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerSubtitle: { color: "#fff", opacity: 0.85, fontSize: 11 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 },
  pillarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 10,
  },
  pillarCard: {
    width: "47%",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
  },
  pillarIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  pillarTitle: { fontSize: 13, fontWeight: "700", color: COLORS.textPrimary },
  pillarSubtitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
    marginBottom: 6,
  },
  pillarDescription: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  routeSummaryCard: {
    backgroundColor: COLORS.routeRed,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 12,
    marginTop: 4,
  },
  routeSummaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  routeSummaryTitle: { color: "#fff", fontSize: 14, fontWeight: "700" },
  routeSummaryText: {
    color: "#fff",
    opacity: 0.9,
    fontSize: 12,
    marginTop: 6,
  },
  routeSummaryLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
  },
  routeSummaryLinkText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  contactCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    marginTop: 16,
  },
  contactTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactText: { fontSize: 14, color: COLORS.textPrimary, fontWeight: "600" },
});
