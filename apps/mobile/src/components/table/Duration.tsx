import { chalkTheme, radii, spacing } from "@rackup/ui-tokens";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Pressable, Text, View } from "react-native";

const c = chalkTheme.colors;

type DurationProps = {
  duration: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export default function Duration({
  duration,
  onIncrement,
  onDecrement,
}: DurationProps) {
  return (
    <View style={{ gap: spacing.sm }}>
      <View>
        <Text style={{ color: c.ink, fontWeight: "700" }}>Duration</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: c.surface,
          borderWidth: 1,
          borderColor: c.ink,
          borderRadius: radii.md,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={onDecrement}
          style={{ paddingHorizontal: spacing.sm }}
        >
          <MaterialDesignIcons name="minus" size={20} />
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>{duration} hour</Text>
        <Pressable
          onPress={onIncrement}
          style={{ paddingHorizontal: spacing.sm }}
        >
          <MaterialDesignIcons name="plus" size={20} />
        </Pressable>
      </View>
    </View>
  );
}
