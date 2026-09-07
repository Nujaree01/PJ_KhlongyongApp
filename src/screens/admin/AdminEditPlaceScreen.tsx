// screens/admin/AdminEditPlaceScreen.tsx
// ฟอร์มแก้ไขข้อมูลสถานที่ 1 จุด — บันทึกขึ้น Firestore (ทุกคนเห็นการเปลี่ยนแปลงแบบ real-time)

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { PLACES } from "../../data/places";
import { COLORS } from "../../theme/colors";
import { savePlaceOverride } from "../../services/placesRemote";

type ParamList = { AdminEditPlace: { placeId: string } };

export default function AdminEditPlaceScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ParamList, "AdminEditPlace">>();
  const { placeId } = route.params;

  const basePlace = PLACES.find((p) => p.id === placeId);

  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [description, setDescription] = useState("");
  const [highlight, setHighlight] = useState("");
  const [tipsText, setTipsText] = useState(""); // แต่ละบรรทัด = 1 tip
  const [openHours, setOpenHours] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!basePlace) return;
    setName(basePlace.name);
    setNameEn(basePlace.nameEn || "");
    setDescription(basePlace.description);
    setHighlight(basePlace.highlight);
    setTipsText((basePlace.tips || []).join("\n"));
    setOpenHours(basePlace.openHours || "");
    setPhone(basePlace.phone || "");
  }, [placeId]);

  if (!basePlace) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <Text style={{ padding: 20 }}>ไม่พบสถานที่นี้</Text>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePlaceOverride(placeId, {
        name: name.trim(),
        nameEn: nameEn.trim(),
        description: description.trim(),
        highlight: highlight.trim(),
        tips: tipsText
          .split("\n")
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
        openHours: openHours.trim(),
        phone: phone.trim(),
        ...(imageUrl.trim() ? { imageUrl: imageUrl.trim() } : {}),
      });
      Alert.alert("บันทึกสำเร็จ", "ข้อมูลถูกอัปเดตแล้ว ทุกคนจะเห็นการเปลี่ยนแปลงนี้", [
        { text: "ตกลง", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.warn(err);
      Alert.alert(
        "บันทึกไม่สำเร็จ",
        "ตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือการตั้งค่า Firebase แล้วลองใหม่"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          แก้ไข: {basePlace.name}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.form}>
          <Field label="ชื่อสถานที่ (ไทย)" value={name} onChangeText={setName} />
          <Field label="ชื่อสถานที่ (อังกฤษ)" value={nameEn} onChangeText={setNameEn} />
          <Field
            label="คำอธิบาย"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <Field label="ข้อความสั้นใต้หมุด (highlight)" value={highlight} onChangeText={setHighlight} />
          <Field
            label="เคล็ดลับการเที่ยว (1 บรรทัด = 1 ข้อ)"
            value={tipsText}
            onChangeText={setTipsText}
            multiline
          />
          <Field label="เวลาเปิด-ปิด" value={openHours} onChangeText={setOpenHours} />
          <Field label="เบอร์โทรติดต่อ" value={phone} onChangeText={setPhone} />
          <Field
            label="ลิงก์รูปภาพ (URL) — เว้นว่างถ้าไม่เปลี่ยนรูป"
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="https://..."
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  multiline,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        placeholder={placeholder}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
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
  headerTitle: { color: "#fff", fontSize: 15, fontWeight: "700", flex: 1 },
  form: {
    backgroundColor: COLORS.background,
    padding: 16,
    paddingBottom: 40,
  },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputMultiline: {
    minHeight: 90,
  },
  saveButton: {
    backgroundColor: COLORS.routeRed,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
