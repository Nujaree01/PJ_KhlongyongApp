// navigation/AdminStack.tsx
// Stack Navigator ย่อยสำหรับแท็บ "แอดมิน" — เช็คสถานะ login ก่อนตัดสินหน้าเริ่มต้น

import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminLoginScreen from "../screens/admin/AdminLoginScreen";
import AdminMenuScreen from "../screens/admin/AdminMenuScreen";
import AdminEditListScreen from "../screens/admin/AdminEditListScreen";
import AdminEditPlaceScreen from "../screens/admin/AdminEditPlaceScreen";
import AdminHelpScreen from "../screens/admin/AdminHelpScreen";
import { isLoggedIn } from "../utils/adminAuth";
import { COLORS } from "../theme/colors";

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  const [checking, setChecking] = useState(true);
  const [initialRoute, setInitialRoute] = useState<"AdminLogin" | "AdminMenu">(
    "AdminLogin"
  );

  useEffect(() => {
    isLoggedIn().then((ok) => {
      setInitialRoute(ok ? "AdminMenu" : "AdminLogin");
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={COLORS.routeRed} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="AdminMenu" component={AdminMenuScreen} />
      <Stack.Screen name="AdminEditList" component={AdminEditListScreen} />
      <Stack.Screen name="AdminEditPlace" component={AdminEditPlaceScreen} />
      <Stack.Screen name="AdminHelp" component={AdminHelpScreen} />
    </Stack.Navigator>
  );
}
