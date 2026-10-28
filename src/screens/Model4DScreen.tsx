import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../theme/colors";
import { TOTAL_ROUTE_DISTANCE_KM, LANDMARKS } from "../data/landmarks";

const PILLARS = [
  {
    id: "nature",
    title: "ท่องเที่ยว\nธรรมชาติ",
    subtitle: "Natural Tourism",
    icon: "leaf",
    fill: "#EAF5DD",
    text: "#27500A",
  },
  {
    id: "product",
    title: "ผลิตภัณฑ์\nชุมชน",
    subtitle: "Community Products",
    icon: "basket",
    fill: "#FDF1DC",
    text: "#633806",
  },
  {
    id: "leisure",
    title: "พักผ่อน\nสมัยใหม่",
    subtitle: "Modern Leisure",
    icon: "coffee",
    fill: "#E4EFFB",
    text: "#0C447C",
  },
  {
    id: "culture",
    title: "มรดก\nวัฒนธรรม",
    subtitle: "Cultural Heritage",
    icon: "church",
    fill: "#FBEAE3",
    text: "#4A1B0C",
  },
];

const USER_HELP_ITEMS = [
  { icon: "magnify", text: "พิมพ์ค้นหาชื่อสถานที่ในช่องค้นหา" },
  { icon: "map-marker", text: "แตะหมุดเพื่อดูรายละเอียดสถานที่" },
  { icon: "crop-free", text: 'กด "ภาพรวม" ดูทั้งเส้นทางในครั้งเดียว' },
];

export default function Model4DScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#35C71A", "#1B7A0B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.brandRow}>
            <View style={styles.logoCircle}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.brandName}>เที่ยวคลองโยง</Text>
              <Text style={styles.brandNameEn}>Khlong Yong Trail</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>ข้อมูลชุมชนคลองโยง</Text>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.pillarGrid}>
            {PILLARS.map((pillar) => (
              <View key={pillar.id} style={styles.pillarCard}>
                <View style={[styles.pillarIcon, { backgroundColor: pillar.fill }]}>
                  <MaterialCommunityIcons
                    name={pillar.icon as any}
                    size={18}
                    color={pillar.text}
                  />
                </View>
                <Text style={styles.pillarTitle}>{pillar.title}</Text>
                <Text style={styles.pillarSubtitle}>{pillar.subtitle}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionLabel}>วิธีใช้งานแผนที่ help</Text>
          <View style={styles.helpCard}>
            {USER_HELP_ITEMS.map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.helpItemRow,
                  idx < USER_HELP_ITEMS.length - 1 && styles.helpItemDivider,
                ]}
              >
                <View style={styles.helpItemIconCircle}>
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={14}
                    color={COLORS.routeRed}
                  />
                </View>
                <Text style={styles.helpItemText}>{item.text}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionLabel}>ติดต่อเรา</Text>
          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => Linking.openURL("tel:034989676")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#35C71A", "#1B7A0B"]}
              style={styles.contactIconCircle}
            >
              <MaterialCommunityIcons name="phone" size={19} color="#FFFFFF" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactTitle}>องค์การบริหารส่วนตำบล</Text>
              <Text style={styles.contactPhone}>034-989676</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          <View style={{ height: 24 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 44,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    lineHeight: 29,
  },
  heroTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  heroTagText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 22,
    marginTop: -18,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  pillarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  pillarCard: {
    width: "47.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pillarIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  pillarTitle: {
    fontSize: 12.5,
    fontWeight: "700",
    color: COLORS.textPrimary,
    lineHeight: 17,
  },
  pillarSubtitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  helpCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  helpItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  helpItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  helpItemIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FBEAE3",
    alignItems: "center",
    justifyContent: "center",
  },
  helpItemText: {
    flex: 1,
    fontSize: 12.5,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  contactIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  contactTitle: {
    fontSize: 12.5,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  contactPhone: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#1B7A0B",
    marginTop: 2,
  },
  brandRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  marginBottom: 18,
},
logoCircle: {
  width: 52,
  height: 52,
  borderRadius: 26,
  backgroundColor: "#FFFFFF",
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
  elevation: 4,
},
logoImage: {
  width: 34,
  height: 34,
},
brandName: {
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: "800",
},
brandNameEn: {
  color: "rgba(255,255,255,0.75)",
  fontSize: 11,
  marginTop: 2,
},
});