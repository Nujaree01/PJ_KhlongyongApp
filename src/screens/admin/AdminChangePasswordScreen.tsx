import React, { useState } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../theme/colors";
import { changeCredentials } from "../../utils/adminAuth";

export default function AdminChangePasswordScreen() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!currentPassword.trim()) {
            Alert.alert("กรอกไม่ครบ", "กรุณากรอกรหัสผ่านปัจจุบันเพื่อยืนยันตัวตน");
            return;
        }
        if (!newPassword.trim()) {
            Alert.alert("กรอกไม่ครบ", "กรุณากรอกรหัสผ่านใหม่");
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert("รหัสผ่านสั้นเกินไป", "รหัสผ่านใหม่ควรมีอย่างน้อย 6 ตัวอักษร");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("รหัสผ่านไม่ตรงกัน", "กรุณายืนยันรหัสผ่านใหม่ให้ตรงกัน");
            return;
        }

        setSaving(true);
        try {
            const result = await changeCredentials(currentPassword, newUsername, newPassword);
            if (!result.ok) {
                Alert.alert("เปลี่ยนไม่สำเร็จ", result.error ?? "รหัสผ่านปัจจุบันไม่ถูกต้อง");
                setSaving(false);
                return;
            }
            Alert.alert("เปลี่ยนสำเร็จ", "อัปเดตบัญชีเรียบร้อยแล้ว", [
                { text: "ตกลง", onPress: () => navigation.goBack() },
            ]);
        } catch {
            Alert.alert("เกิดข้อผิดพลาด", "ลองใหม่อีกครั้ง");
        } finally {
            setSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
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
                        <Text style={styles.heroTitle}>เปลี่ยนรหัสผ่าน</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.body}>
                    <View style={styles.infoBox}>
                        <MaterialCommunityIcons name="information-outline" size={16} color="#0C447C" />
                        <Text style={styles.infoText}>
                            ต้องกรอกรหัสผ่านปัจจุบันให้ถูกต้องก่อน ถึงจะเปลี่ยนเป็นอีเมล/รหัสผ่านใหม่ได้
                        </Text>
                    </View>

                    <Text style={styles.sectionLabel}>บัญชีปัจจุบัน</Text>
                    <View style={styles.card}>
                        <PasswordField
                            label="รหัสผ่านปัจจุบัน"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            show={showPasswords}
                        />
                    </View>

                    <Text style={styles.sectionLabel}>บัญชีใหม่</Text>
                    <View style={styles.card}>
                        <Field label="อีเมลใหม่" value={newUsername} onChangeText={setNewUsername} />
                        <PasswordField
                            label="รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            show={showPasswords}
                        />
                        <View style={{ marginBottom: 0 }}>
                            <PasswordField
                                label="ยืนยันรหัสผ่านใหม่"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                show={showPasswords}
                                noMargin
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.toggleRow}
                        onPress={() => setShowPasswords((v) => !v)}
                    >
                        <MaterialCommunityIcons
                            name={showPasswords ? "eye-off-outline" : "eye-outline"}
                            size={16}
                            color={COLORS.textSecondary}
                        />
                        <Text style={styles.toggleText}>
                            {showPasswords ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        <Text style={styles.saveButtonText}>
                            {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                        </Text>
                    </TouchableOpacity>

                    <View style={{ height: 24 }} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function Field({
    label,
    value,
    onChangeText,
}: {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
}) {
    return (
        <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
                autoCorrect={false}
            />
        </View>
    );
}

function PasswordField({
    label,
    value,
    onChangeText,
    show,
    noMargin,
}: {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    show: boolean;
    noMargin?: boolean;
}) {
    return (
        <View style={[styles.fieldGroup, noMargin && { marginBottom: 0 }]}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!show}
                autoCapitalize="none"
                autoCorrect={false}
            />
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
    infoBox: {
        flexDirection: "row",
        gap: 8,
        backgroundColor: "#E4EFFB",
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
    },
    infoText: { flex: 1, fontSize: 12, color: "#0C447C", lineHeight: 18 },
    sectionLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.textPrimary,
        marginBottom: 10,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        ...cardShadow,
    },
    fieldGroup: { marginBottom: 14 },
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
    toggleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 20,
    },
    toggleText: { fontSize: 12.5, color: COLORS.textSecondary },
    saveButton: {
        backgroundColor: "#1B7A0B",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
    },
    saveButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});