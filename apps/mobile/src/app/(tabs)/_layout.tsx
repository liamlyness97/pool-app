import { Tabs } from "expo-router";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { chalkTheme, spacing } from "@rackup/ui-tokens";

const c = chalkTheme.colors;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.ink,
        tabBarStyle: {
          paddingTop: spacing.sm,
          backgroundColor: c.bg,
          borderColor: c.ink,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tables",
          tabBarIcon: ({ color }) => (
            <MaterialDesignIcons
              size={28}
              name="billiards-rack"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => (
            <MaterialDesignIcons size={28} name="scan-helper" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ranks"
        options={{
          title: "Ranks",
          tabBarIcon: ({ color }) => (
            <MaterialDesignIcons size={28} name="poll" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
