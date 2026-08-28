import React from "react";
import { View, Image, StyleSheet, ActivityIndicator, useWindowDimensions } from "react-native";
import { COLORS } from "../theme/colors";

const SPLASH_LOGO = require("../assets/splash-logo.png");
const IMAGE_ASPECT_RATIO = 1552 / 750; 

export default function SplashScreen() {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();

    let imageHeight = screenHeight;
    let imageWidth = imageHeight / IMAGE_ASPECT_RATIO;

    if (imageWidth > screenWidth) {
        imageWidth = screenWidth;
        imageHeight = imageWidth * IMAGE_ASPECT_RATIO;
    }

    return (
        <View style={styles.container}>
            <Image
                source={SPLASH_LOGO}
                style={{ width: imageWidth, height: imageHeight }}
                resizeMode="cover"
            />
            <ActivityIndicator
                size="small"
                color={COLORS.routeRed}
                style={styles.loader}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFBF3",
        alignItems: "center",
        justifyContent: "center",
    },
    loader: {
        position: "absolute",
        bottom: "10%",
        alignSelf: "center",
    },
});