import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { PLACES } from "../data/places";
import { COLORS, CATEGORY_COLORS, CATEGORY_LABELS } from "../theme/colors";

type ParamList = {
    PlaceDetail: { placeId: string };
};

export default function PlaceDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<ParamList, "PlaceDetail">>();
    const { placeId } = route.params;

    const place = PLACES.find((p) => p.id === placeId);

    if (!place) {
        return (
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <Text style={styles.notFoundText}>ไม่พบข้อมูลสถานที่</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backLinkText}>← กลับ</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const category = CATEGORY_COLORS[place.category];

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={[styles.header, { backgroundColor: category.fill }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={22}
                        color={category.text}
                    />
                </TouchableOpacity>

                <View style={styles.headerIconCircle}>
                    <MaterialCommunityIcons
                        name={category.icon as any}
                        size={40}
                        color={category.text}
                    />
                </View>

                <Text style={[styles.badge, { color: category.text }]}>
                    {CATEGORY_LABELS[place.category]}
                </Text>
                <Text style={[styles.title, { color: category.text }]}>
                    {place.name}
                </Text>
                {place.nameEn ? (
                    <Text style={[styles.subtitle, { color: category.text }]}>
                        {place.nameEn}
                    </Text>
                ) : null}
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                {place.image ? (
                    <Image source={place.image} style={styles.placeImage} resizeMode="cover" />
                ) : null}

                <Text style={styles.description}>{place.description}</Text>

                {place.tips && place.tips.length > 0 && (
                    <View style={styles.tipsBox}>
                        <Text style={styles.tipsHeader}>💡 เคล็ดลับการเที่ยว</Text>
                        {place.tips.map((tip, idx) => (
                            <Text key={idx} style={styles.tipItem}>
                                • {tip}
                            </Text>
                        ))}
                    </View>
                )}

                {place.openHours && (
                    <View style={styles.metaRow}>
                        <MaterialCommunityIcons
                            name="clock-outline"
                            size={18}
                            color={COLORS.textSecondary}
                        />
                        <Text style={styles.metaText}>{place.openHours}</Text>
                    </View>
                )}
                {place.phone && (
                    <View style={styles.metaRow}>
                        <MaterialCommunityIcons
                            name="phone-outline"
                            size={18}
                            color={COLORS.textSecondary}
                        />
                        <Text style={styles.metaText}>{place.phone}</Text>
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    notFoundText: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 15,
        color: COLORS.textSecondary,
    },
    backLinkText: {
        textAlign: "center",
        marginTop: 12,
        fontSize: 14,
        color: COLORS.routeRed,
        fontWeight: "700",
    },
    header: {
        paddingTop: 8,
        paddingHorizontal: 20,
        paddingBottom: 24,
        alignItems: "center",
    },
    backButton: {
        alignSelf: "flex-start",
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "rgba(255,255,255,0.5)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 6,
    },
    headerIconCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: "rgba(255,255,255,0.55)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },
    badge: {
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 6,
        opacity: 0.85,
    },
    title: {
        fontSize: 21,
        fontWeight: "800",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 13,
        marginTop: 3,
        opacity: 0.8,
        textAlign: "center",
    },
    body: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    placeImage: {
        width: "100%",
        height: 200,
        borderRadius: 16,
        marginBottom: 18,
        backgroundColor: COLORS.surface,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: COLORS.textPrimary,
    },
    tipsBox: {
        marginTop: 18,
        backgroundColor: COLORS.surface,
        borderRadius: 14,
        padding: 14,
    },
    tipsHeader: {
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 6,
        color: COLORS.textPrimary,
    },
    tipItem: {
        fontSize: 13.5,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 14,
    },
    metaText: {
        fontSize: 14,
        color: COLORS.textPrimary,
    },
});