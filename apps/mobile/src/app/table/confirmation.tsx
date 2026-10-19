import { chalkTheme, radii, spacing } from "@rackup/ui-tokens";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const c = chalkTheme.colors;

export default function ConfirmationScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: c.bg,
      }}
    >
      <View
        style={{
          paddingTop: 62,
          alignItems: "center",
          gap: spacing.xl,
        }}
      >
        <View
          style={{
            padding: spacing.xl,
            backgroundColor: c.freeBg,
            borderRadius: 50,
          }}
        >
          <MaterialDesignIcons name="check" color={c.freeText} size={45} />
        </View>
        <View>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 40,
              textAlign: "center",
            }}
          >
            Table booked
          </Text>
          <Text style={{ marginTop: 6, fontSize: 14, color: c.muted }}>
            Scan the QR code on the table when you arrive
          </Text>
        </View>
      </View>
      <View>
        <View
          style={{
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            borderTopWidth: 1,
            gap: spacing.sm,
          }}
        >
          <Link
            accessibilityRole="button"
            accessibilityLabel="Reserve and pay"
            href="/(tabs)/scan"
            style={{
              paddingVertical: spacing.lg,
              backgroundColor: c.accent,
              borderWidth: 1,
              borderColor: c.accent,
              borderRadius: radii.md,
            }}
          >
            <Text
              style={{
                color: c.surface,
                textAlign: "center",
                fontSize: 16,
                fontWeight: "800",
              }}
            >
              Scan to start
            </Text>
          </Link>
          <Link
            href="/"
            asChild
            style={{
              paddingVertical: spacing.lg,
              borderWidth: 1,
              borderColor: c.ink,
              borderRadius: radii.md,
            }}
          >
            <Text
              style={{
                color: c.ink,
                textAlign: "center",
                fontSize: 16,
              }}
            >
              Back to tables
            </Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
