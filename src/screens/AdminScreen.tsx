import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../theme/colors";

export default function AdminScreen() {
    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>แอดมิน</Text>
            </View>

            <View style={styles.body}>
                <View style={styles.iconCircle}>
                    <MaterialCommunityIcons
                        name="shield-account-outline"
                        size={44}
                        color={COLORS.routeRed}
                    />
                </View>
                <Text style={styles.placeholderTitle}>อยู่ระหว่างการพัฒนา</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.routeRed,
    },
    header: {
        backgroundColor: COLORS.routeRed,
        paddingTop: 14,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    body: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
    },
    iconCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: COLORS.surface,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    placeholderTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.textPrimary,
        marginBottom: 10,
        textAlign: "center",
    },
    placeholderText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        textAlign: "center",
        lineHeight: 20,
    },
});