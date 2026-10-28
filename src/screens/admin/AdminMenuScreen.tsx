import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../theme/colors";
import { logout } from "../../utils/adminAuth";
import { useLivePlaces } from "../../hooks/useLivePlaces";
import { useVisitStats } from "../../hooks/useVisitStats";
import { subscribeToPlaceOverrides } from "../../services/placesRemote";

const formatNumber = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const timeAgo = (ms: number): string => {
  const diffSec = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  if (diffSec < 60) return "เมื่อครู่";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} นาทีก่อน`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} ชม.ก่อน`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} วันก่อน`;
};

const MANAGE_ITEMS = [
  {
    key: "edit",
    icon: "map-marker-outline",
    iconBg: "#EAF5DD",
    iconColor: "#27500A",
    title: "แก้ไขข้อมูลสถานที่",
    subtitle: "แก้ชื่อ คำอธิบาย รูปภาพ เบอร์ติดต่อ",
    screen: "AdminEditList",
  },
  {
    key: "changePassword",
    icon: "key-outline",
    iconBg: "#E4EFFB",
    iconColor: "#0C447C",
    title: "เปลี่ยนรหัสผ่าน",
    subtitle: "แก้ไขอีเมลและรหัสผ่านของแอดมิน",
    screen: "AdminChangePassword",
  },
] as const;

const OTHER_ITEMS = [
  {
    key: "help",
    icon: "help-circle-outline",
    iconBg: "#FBEAE3",
    iconColor: "#4A1B0C",
    title: "ช่วยเหลือ",
    subtitle: "วิธีใช้งานหน้าแอดมิน",
    screen: "AdminHelp",
  },
] as const;

export default function AdminMenuScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { places } = useLivePlaces();
  const { counts, totalVisits } = useVisitStats();
  const [lastUpdatedMs, setLastUpdatedMs] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToPlaceOverrides((overrides) => {
      let latest = 0;
      Object.values(overrides).forEach((o) => {
        const ms = o.updatedAt?.toMillis?.();
        if (typeof ms === "number" && ms > latest) latest = ms;
      });
      setLastUpdatedMs(latest > 0 ? latest : null);
    });
    return unsubscribe;
  }, []);

  const topPlaces = useMemo(
    () =>
      places
        .map((p) => ({ place: p, count: counts[p.id] ?? 0 }))
        .filter((x) => x.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3),
    [places, counts]
  );

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
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#35C71A", "#1B7A0B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.heroRow}>
            <View>
              <Text style={styles.heroSubtitle}>ผู้ดูแลระบบ</Text>
              <Text style={styles.heroTitle}>Admin</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={13} color="#FFFFFF" />
              <Text style={styles.logoutText}>ออกจากระบบ</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* สถิติภาพรวม */}
          <Text style={styles.sectionLabel}>ภาพรวม</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: "#1B7A0B" }]}>
                {places.length}
              </Text>
              <Text style={styles.statLabel}>สถานที่</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: "#0C447C" }]}>
                {formatNumber(totalVisits)}
              </Text>
              <Text style={styles.statLabel}>ยอดเข้าชมรวม</Text>
            </View>
            <View style={styles.statCard}>
              <Text
                style={[styles.statValue, styles.statValueSmall, { color: "#633806" }]}
                numberOfLines={1}
              >
                {lastUpdatedMs ? timeAgo(lastUpdatedMs) : "-"}
              </Text>
              <Text style={styles.statLabel}>แก้ไขล่าสุด</Text>
            </View>
          </View>

          {/* สถานที่ยอดนิยม */}
          <Text style={styles.sectionLabel}>สถานที่ยอดนิยม</Text>
          <View style={styles.card}>
            {topPlaces.length === 0 ? (
              <Text style={styles.emptyText}>ยังไม่มีข้อมูลการเข้าชม</Text>
            ) : (
              topPlaces.map((item, idx) => (
                <View
                  key={item.place.id}
                  style={[
                    styles.rankRow,
                    idx < topPlaces.length - 1 && styles.rowDivider,
                  ]}
                >
                  <Text style={styles.rankNumber}>{idx + 1}</Text>
                  <Text style={styles.rankName} numberOfLines={1}>
                    {item.place.name}
                  </Text>
                  <Text style={styles.rankCount}>{formatNumber(item.count)}</Text>
                </View>
              ))
            )}
          </View>

          {/* จัดการข้อมูล */}
          <Text style={styles.sectionLabel}>จัดการข้อมูล</Text>
          <View style={styles.card}>
            {MANAGE_ITEMS.map((item, idx) => (
              <MenuRow
                key={item.key}
                item={item}
                isLast={idx === MANAGE_ITEMS.length - 1}
                onPress={() => navigation.navigate(item.screen)}
              />
            ))}
          </View>

          {/* อื่น ๆ */}
          <Text style={styles.sectionLabel}>อื่น ๆ</Text>
          <View style={styles.card}>
            {OTHER_ITEMS.map((item, idx) => (
              <MenuRow
                key={item.key}
                item={item}
                isLast={idx === OTHER_ITEMS.length - 1}
                onPress={() => navigation.navigate(item.screen)}
              />
            ))}
          </View>

          <View style={{ height: 24 }} />
        </View>
      </ScrollView>
    </View>
  );
}

function MenuRow({
  item,
  isLast,
  onPress,
}: {
  item: {
    icon: string;
    iconBg: string;
    iconColor: string;
    title: string;
    subtitle: string;
  };
  isLast: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.menuRow, !isLast && styles.rowDivider]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIconCircle, { backgroundColor: item.iconBg }]}>
        <MaterialCommunityIcons
          name={item.icon as any}
          size={18}
          color={item.iconColor}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={COLORS.textSecondary}
      />
    </TouchableOpacity>
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
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 5,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "600",
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
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    ...cardShadow,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  statValueSmall: {
    fontSize: 13,
    marginTop: 3,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 24,
    ...cardShadow,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  emptyText: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    paddingVertical: 16,
    textAlign: "center",
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 11,
  },
  rankNumber: {
    width: 20,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  rankName: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  rankCount: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#1B7A0B",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});