import { spacing, chalkTheme } from "@rackup/ui-tokens";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const c = chalkTheme.colors;

export default function Ranks() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.md }}>
        <Text style={{ fontSize: 30, fontWeight: "800", color: c.ink }}>
          Leaderboard
        </Text>
        <Text style={{ marginTop: 6, fontSize: 14, color: c.muted }}>
          Frames wont at [VENUE NAME] this month.
        </Text>
      </View>
    </SafeAreaView>
  );
}
