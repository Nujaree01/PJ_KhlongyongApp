import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Landmark } from "../types";
import { CATEGORY_COLORS, CATEGORY_LABELS, COLORS } from "../theme/colors";

interface Props {
  landmark: Landmark | null;
  visible: boolean;
  onClose: () => void;
  onNavigatePress?: (landmark: Landmark) => void;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function PlaceDetailModal({
  landmark,
  visible,
  onClose,
  onNavigatePress,
}: Props) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 6,
        speed: 14,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!landmark) return null;

  const colors = CATEGORY_COLORS[landmark.category];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={[styles.sheet, { transform: [{ translateY }] }]}
          >
            <View style={styles.handle} />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="ปิด"
            >
              <MaterialCommunityIcons name="close" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <View style={styles.headerRow}>
              <View style={[styles.iconCircle, { backgroundColor: colors.fill }]}>
                <MaterialCommunityIcons
                  name={colors.icon as any}
                  size={28}
                  color={colors.text}
                />
              </View>
              <View style={styles.headerText}>
                <Text style={[styles.orderLabel, { color: colors.text }]}>
                  จุดที่ {landmark.order} · {CATEGORY_LABELS[landmark.category]}
                </Text>
                <Text style={styles.title}>{landmark.name}</Text>
                {landmark.nameEn ? (
                  <Text style={styles.subtitle}>{landmark.nameEn}</Text>
                ) : null}
              </View>
            </View>

            <Text style={styles.description}>{landmark.description}</Text>

            {typeof landmark.distanceFromStartKm === "number" && (
              <View style={styles.metaRow}>
                <MaterialCommunityIcons
                  name="map-marker-distance"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.metaText}>
                  ห่างจากจุดเริ่มต้นประมาณ {landmark.distanceFromStartKm} กม.
                </Text>
              </View>
            )}

            {landmark.isCoordinateApproximate && (
              <View style={styles.metaRow}>
                <MaterialCommunityIcons
                  name="map-marker-alert-outline"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.metaText}>
                  ตำแหน่งบนแผนที่เป็นค่าประมาณ
                </Text>
              </View>
            )}

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={() => onNavigatePress?.(landmark)}
              >
                <MaterialCommunityIcons name="directions" size={18} color="#fff" />
                <Text style={styles.navigateButtonText}>นำทางไปจุดนี้</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: "center",
    marginBottom: 12,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  headerRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  orderLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
    marginTop: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  navigateButton: {
    flex: 1,
    backgroundColor: COLORS.routeRed,
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  navigateButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
