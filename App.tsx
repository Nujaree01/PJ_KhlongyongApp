import React from "react";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapScreen from "./src/screens/MapScreen";
import Model4DScreen from "./src/screens/Model4DScreen";
import AdminScreen from "./src/screens/AdminScreen";
import PlaceDetailScreen from "./src/screens/PlaceDetailScreen";
import SplashScreen from "./src/screens/SplashScreen";
import { COLORS } from "./src/theme/colors";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="แผนที่"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.routeRed,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<string, string> = {
            แผนที่: "map-outline",
            แอดมิน: "shield-account-outline",
            Info: "shape-outline",
          };
          return (
            <MaterialCommunityIcons
              name={(iconMap[route.name] ?? "circle") as any}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="แผนที่" component={MapScreen} />
      <Tab.Screen name="แอดมิน" component={AdminScreen} />
      <Tab.Screen name="Info" component={Model4DScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen
            name="PlaceDetail"
            component={PlaceDetailScreen}
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
