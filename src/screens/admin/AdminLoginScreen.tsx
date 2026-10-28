import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../theme/colors";
import { login } from "../../utils/adminAuth";

export default function AdminLoginScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("กรอกไม่ครบ", "กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    setLoading(true);
    const ok = await login(username.trim(), password);
    setLoading(false);

    if (ok) {
      navigation.replace("AdminMenu");
    } else {
      Alert.alert("เข้าสู่ระบบไม่สำเร็จ", "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
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
        style={[styles.hero, { paddingTop: insets.top + 36 }]}
      >
        <View style={styles.heroIconCircle}>
          <MaterialCommunityIcons name="shield-account" size={34} color="#FFFFFF" />
        </View>
        <Text style={styles.heroTitle}>เข้าสู่ระบบแอดมิน</Text>
        <Text style={styles.heroSubtitle}>สำหรับผู้ดูแลระบบเท่านั้น</Text>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.card}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>อีเมล</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="admin@khlongyong.local"
              placeholderTextColor={COLORS.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>รหัสผ่าน</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="รหัสผ่าน"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                style={styles.eyeButton}
              >
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 44,
  },
  heroIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  heroTitle: { color: "#FFFFFF", fontSize: 19, fontWeight: "800" },
  heroSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12.5,
    marginTop: 4,
  },
  body: {
    flex: 1,
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
    padding: 18,
    ...cardShadow,
  },
  fieldGroup: { marginBottom: 16 },
  label: {
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
  passwordRow: { flexDirection: "row", alignItems: "center" },
  eyeButton: { position: "absolute", right: 12, padding: 4 },
  loginButton: {
    backgroundColor: "#1B7A0B",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  loginButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});