import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Pressable,
} from "react-native";
import { Place, CATEGORY_COLORS, CATEGORY_LABELS } from "../data/places";

interface Props {
  place: Place | null;
  visible: boolean;
  onClose: () => void;
  visitCount?: number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function PlaceDetailModal({
  place,
  visible,
  onClose,
  visitCount = 0,
}: Props) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
    } else {
      slideAnim.setValue(SCREEN_HEIGHT);
    }
  }, [visible]);

  if (!place) return null;

  const accentColor = CATEGORY_COLORS[place.category];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={[
              styles.sheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <View
                  style={[styles.badge, { backgroundColor: accentColor + "22" }]}
                >
                  <Text style={[styles.badgeText, { color: accentColor }]}>
                    {CATEGORY_LABELS[place.category]}
                  </Text>
                </View>
                <Text style={styles.title}>{place.name}</Text>
                {place.nameEn ? (
                  <Text style={styles.subtitle}>{place.nameEn}</Text>
                ) : null}
                {visitCount > 0 && (
                  <Text style={styles.visitCountText}>
                    👁 เข้าชมแล้ว {visitCount} ครั้ง
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.body}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.description}>{place.description}</Text>

              {place.tips && place.tips.length > 0 && (
                <View style={styles.tipsBox}>
                  <Text style={styles.tipsHeader}>เคล็ดลับการเที่ยว</Text>
                  {place.tips.map((tip, idx) => (
                    <Text key={idx} style={styles.tipItem}>
                      • {tip}
                    </Text>
                  ))}
                </View>
              )}

              {place.openHours && (
                <Text style={styles.metaLine}>{place.openHours}</Text>
              )}
              {place.phone && (
                <Text style={styles.metaLine}>{place.phone}</Text>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[styles.closeCta, { backgroundColor: accentColor }]}
              onPress={onClose}
            >
              <Text style={styles.closeCtaText}>ปิดหน้าต่างนี้</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFBF3",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.65,
    paddingBottom: 24,
    overflow: "hidden",
  },
  accentBar: {
    height: 5,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2D2A26",
  },
  subtitle: {
    fontSize: 13,
    color: "#8A8378",
    marginTop: 2,
  },
  visitCountText: {
    fontSize: 12,
    color: "#B08900",
    marginTop: 5,
    fontWeight: "600",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFE9DD",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#2D2A26",
    fontWeight: "700",
  },
  body: {
    paddingHorizontal: 20,
    marginTop: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: "#4A453D",
  },
  tipsBox: {
    marginTop: 16,
    backgroundColor: "#FFF3D6",
    borderRadius: 14,
    padding: 14,
  },
  tipsHeader: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
    color: "#7A5B10",
  },
  tipItem: {
    fontSize: 13.5,
    color: "#6B5A2E",
    lineHeight: 20,
  },
  metaLine: {
    fontSize: 14,
    marginTop: 10,
    color: "#4A453D",
  },
  closeCta: {
    marginHorizontal: 20,
    marginTop: 18,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
  },
  closeCtaText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});