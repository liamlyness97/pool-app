import { chalkTheme, radii, spacing } from "@rackup/ui-tokens";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Pressable, Text, View } from "react-native";

const c = chalkTheme.colors;

type FramesTrackerProps = {
  name: string;
  frames: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export default function FramesTracker({
  name,
  frames,
  onIncrement,
  onDecrement,
}: FramesTrackerProps) {
  return (
    <View
      style={{
        flexGrow: 1,
        alignItems: "center",
        backgroundColor: c.surface,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: c.ink,
        paddingVertical: spacing.lg,
        gap: spacing.sm,
      }}
    >
      <View>
        <Text
          style={{
            fontWeight: "700",
          }}
        >
          {name}
        </Text>
      </View>
      <View>
        <Text
          style={{
            fontWeight: "900",
            fontSize: 40,
          }}
        >
          {frames}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: spacing.sm,
        }}
      >
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: c.ink,
            height: 40,
            width: 40,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: radii.sm,
          }}
          onPress={onDecrement}
        >
          <MaterialDesignIcons name="minus" size={20} />
        </Pressable>
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: c.ink,
            height: 40,
            width: 40,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: radii.sm,
            backgroundColor: c.ink,
          }}
          onPress={onIncrement}
        >
          <MaterialDesignIcons name="plus" color={c.surface} size={20} />
        </Pressable>
      </View>
    </View>
  );
}
