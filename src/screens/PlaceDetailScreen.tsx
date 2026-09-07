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
import { useLivePlaces } from "../hooks/useLivePlaces";
import { COLORS, CATEGORY_COLORS, CATEGORY_LABELS } from "../theme/colors";

type ParamList = {
    PlaceDetail: { placeId: string };
};

export default function PlaceDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<ParamList, "PlaceDetail">>();
    const { placeId } = route.params;

    const { places } = useLivePlaces();
    const place = places.find((p) => p.id === placeId);

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
            <View style={styles.imageWrapper}>
                {place.image ? (
                    <Image source={place.image} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder, { backgroundColor: category.fill }]}>
                        <MaterialCommunityIcons name={category.icon as any} size={36} color={category.text} />
                    </View>
                )}

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <MaterialCommunityIcons name="arrow-left" size={20} color="#2D2A26" />
                </TouchableOpacity>

                <View style={[styles.badge, { backgroundColor: category.fill }]}>
                    <Text style={[styles.badgeText, { color: category.text }]}>
                        {CATEGORY_LABELS[place.category]}
                    </Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.body}>
                    <Text style={styles.title}>{place.name}</Text>
                    {place.nameEn ? <Text style={styles.subtitle}>{place.nameEn}</Text> : null}
                    {place.highlight ? <Text style={styles.tagline}>{place.highlight}</Text> : null}

                    {(place.openHours || place.phone) && (
                        <View style={styles.quickFactsRow}>
                            {place.openHours && (
                                <View style={styles.quickFactCard}>
                                    <View style={styles.quickFactLabelRow}>
                                        <MaterialCommunityIcons name="clock-outline" size={13} color={COLORS.textSecondary} />
                                        <Text style={styles.quickFactLabel}>เวลาเปิด</Text>
                                    </View>
                                    <Text style={styles.quickFactValue}>{place.openHours}</Text>
                                </View>
                            )}
                            {place.phone && (
                                <View style={styles.quickFactCard}>
                                    <View style={styles.quickFactLabelRow}>
                                        <MaterialCommunityIcons name="phone-outline" size={13} color={COLORS.textSecondary} />
                                        <Text style={styles.quickFactLabel}>โทร</Text>
                                    </View>
                                    <Text style={styles.quickFactValue}>{place.phone}</Text>
                                </View>
                            )}
                        </View>
                    )}

                    <Text style={styles.description}>{place.description}</Text>

                    {place.tips && place.tips.length > 0 && (
                        <View style={styles.tipsBox}>
                            <MaterialCommunityIcons name="lightbulb-outline" size={16} color="#B08900" style={{ marginTop: 1 }} />
                            <View style={{ flex: 1 }}>
                                {place.tips.map((tip, idx) => (
                                    <Text key={idx} style={styles.tipText}>{tip}</Text>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
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
    imageWrapper: {
        height: 200,
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    imagePlaceholder: {
        alignItems: "center",
        justifyContent: "center",
    },
    backButton: {
        position: "absolute",
        top: 14,
        left: 14,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "rgba(255,255,255,0.9)",
        alignItems: "center",
        justifyContent: "center",
    },
    badge: {
        position: "absolute",
        bottom: -14,
        left: 18,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 999,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "700",
    },
    body: {
        paddingHorizontal: 18,
        paddingTop: 24,
    },
    title: {
        fontSize: 21,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    tagline: {
        fontSize: 15,
        color: COLORS.textPrimary,
        marginTop: 10,
        lineHeight: 22,
    },
    quickFactsRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 16,
    },
    quickFactCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    quickFactLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginBottom: 2,
    },
    quickFactLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    quickFactValue: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    description: {
        fontSize: 13,
        color: COLORS.textSecondary,
        lineHeight: 21,
        marginTop: 16,
    },
    tipsBox: {
        flexDirection: "row",
        gap: 8,
        backgroundColor: "#FFF3D6",
        borderRadius: 12,
        padding: 12,
        marginTop: 16,
    },
    tipText: {
        fontSize: 13,
        color: "#6B5A2E",
        lineHeight: 19,
    },
});