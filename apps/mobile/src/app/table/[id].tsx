import { chalkTheme, spacing } from "@rackup/ui-tokens";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Link, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const c = chalkTheme.colors;

export default function TableDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: c.bg, paddingHorizontal: spacing.md }}
    >
      <Link href="/" asChild>
        <Pressable
          style={{
            gap: spacing.md,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialDesignIcons size={40} name="chevron-left" color={c.ink} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            Table {id}
          </Text>
        </Pressable>
      </Link>
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.lg }}>
        <Text style={{ fontSize: 30, fontWeight: "800", color: c.ink }}>
          Temp Text
        </Text>
      </View>
    </SafeAreaView>
  );
}
