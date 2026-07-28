import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapScreen from "./src/screens/MapScreen";
import Model4DScreen from "./src/screens/Model4DScreen";
import { COLORS } from "./src/theme/colors";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        initialRouteName="Model 4D"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: COLORS.routeRed,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarIcon: ({ color, size }) => {
            const iconMap: Record<string, string> = {
              แผนที่: "map-outline",
              "Model 4D": "shape-outline",
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
        <Tab.Screen name="Model 4D" component={Model4DScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
