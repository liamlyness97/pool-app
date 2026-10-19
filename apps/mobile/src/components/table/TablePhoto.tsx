import { chalkTheme, radii, spacing } from "@rackup/ui-tokens";
import { Text, View } from "react-native";

const c = chalkTheme.colors;

export default function TablePhoto() {
  return (
    <View style={{ paddingHorizontal: spacing.md }}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: 150,
          borderColor: c.muted,
          borderWidth: 1,
          borderStyle: "dashed",
          borderRadius: radii.md,
        }}
      >
        <Text style={{ color: c.muted, textAlign: "center" }}>Table photo</Text>
      </View>
    </View>
  );
}
