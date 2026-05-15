import { Redirect, router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/authStore";

import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";

export default function AppLayout() {
  const { isAuthenticated, logout  } = useAuthStore();

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingLeft:20,
          paddingRight:10,
          backgroundColor: "#f2f2f2",
        },
        tabBarLabelStyle: {
          fontSize: 12,          
          width: 200,
        },
        tabBarActiveTintColor: "#5B7552",
        tabBarInactiveTintColor: "#8f8e8e",
        tabBarItemStyle: {
          width: 200,
          borderRadius: 16,
          marginHorizontal: 6,
          padding: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="donations/index"
        options={{
          title: "Doações",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cash" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="animals"
        options={{
          title: "Animais",
          tabBarIcon: ({ color }) => (
            <Ionicons name="paw" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="logout"
        options={{
          title: "Sair",
          tabBarIcon: ({ color }) => (
            <Ionicons name="log-out-outline" size={22} color={color} />
          ),
          tabBarActiveBackgroundColor: "#d7c8e3",
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            logout();
            router.replace('/login')
          },
        }}
      />
    </Tabs>
  );
}