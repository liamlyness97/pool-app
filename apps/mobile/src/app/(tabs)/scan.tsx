import { spacing, chalkTheme } from "@rackup/ui-tokens";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const c = chalkTheme.colors;

export default function Scan() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.lg }}>
        <Text style={{ fontSize: 30, fontWeight: "800", color: c.ink }}>
          Start your game
        </Text>
        <Text style={{ marginTop: 6, fontSize: 14, color: c.muted }}>
          Point your camera at the QR code on the table.
        </Text>
      </View>
    </SafeAreaView>
  );
}
