import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
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
    const insets = useSafeAreaInsets();
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
            <View style={styles.heroWrapper}>
                <View style={styles.imageWrapper}>
                    {place.image ? (
                        <Image source={place.image} style={styles.image} resizeMode="cover" />
                    ) : (
                        <View style={[styles.image, styles.imagePlaceholder, { backgroundColor: category.fill }]}>
                            <MaterialCommunityIcons name={category.icon as any} size={36} color={category.text} />
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.backButton, { top: insets.top + 8 }]}
                        onPress={() => navigation.goBack()}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={20} color="#2D2A26" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.bodyPanel}>
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

                        <Text style={styles.sectionLabel}>ตำแหน่งบนเส้นทาง</Text>
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => navigation.goBack()}
                            style={styles.miniMapWrapper}
                        >
                            <MapView
                                style={StyleSheet.absoluteFill}
                                provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
                                initialRegion={{
                                    latitude: place.latitude,
                                    longitude: place.longitude,
                                    latitudeDelta: 0.05,
                                    longitudeDelta: 0.05,
                                }}
                                scrollEnabled={false}
                                zoomEnabled={false}
                                rotateEnabled={false}
                                pitchEnabled={false}
                                toolbarEnabled={false}
                                pointerEvents="none"
                            >
                                {places
                                    .filter((p) => p.id !== place.id)
                                    .map((p) => (
                                        <Marker
                                            key={p.id}
                                            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                                        >
                                            <View style={styles.dimDot} />
                                        </Marker>
                                    ))}
                                <Marker coordinate={{ latitude: place.latitude, longitude: place.longitude }}>
                                    <View style={styles.highlightDot} />
                                </Marker>
                            </MapView>

                            <View style={styles.miniMapBadge}>
                                <MaterialCommunityIcons name="arrow-expand" size={12} color="#2D2A26" />
                                <Text style={styles.miniMapBadgeText}>ดูแผนที่เต็ม</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>

                <View style={[styles.badge, { backgroundColor: category.fill }]}>
                    <Text style={[styles.badgeText, { color: category.text }]}>
                        {CATEGORY_LABELS[place.category]}
                    </Text>
                </View>
            </View>
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
    heroWrapper: {
        position: "relative",
    },
    imageWrapper: {
        height: 200,
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
        left: 14,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "rgba(255,255,255,0.9)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    badge: {
        position: "absolute",
        top: 187,
        left: 18,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 999,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "700",
    },
    bodyPanel: {
        paddingHorizontal: 18,
        paddingTop: 26,
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
    },
    title: {
        fontSize: 21,
        fontWeight: "800",
        color: COLORS.textPrimary,
        marginTop: 6,
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    tagline: {
        fontSize: 15,
        color: COLORS.textPrimary,
        marginTop: 12,
        lineHeight: 22,
        fontWeight: "500",
    },
    quickFactsRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 18,
    },
    quickFactCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
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
    sectionLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.textSecondary,
        marginTop: 4,
        marginBottom: 8,
    },
    miniMapWrapper: {
        height: 130,
        borderRadius: 12,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: COLORS.border,
        position: "relative",
    },
    dimDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.textSecondary,
        opacity: 0.5,
    },
    highlightDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.routeRed,
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    miniMapBadge: {
        position: "absolute",
        bottom: 8,
        right: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    miniMapBadgeText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#2D2A26",
    },
});