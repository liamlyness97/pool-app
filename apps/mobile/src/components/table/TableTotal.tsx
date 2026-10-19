import { chalkTheme, radii, spacing } from "@rackup/ui-tokens";
import { Text, View } from "react-native";

const c = chalkTheme.colors;

export default function TableTotal({
  price,
  duration,
}: {
  price: number;
  duration: number;
}) {
  const subTotal = price * duration;
  const tax = subTotal * 0.2;
  const total = subTotal + tax;
  return (
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
      <View style={{ gap: spacing.sm }}>
        <Text style={{ color: c.muted }}>
          {duration} {duration > 1 ? "hours" : "hour"}
        </Text>
        <Text style={{ fontWeight: "800", fontSize: 18 }}>Total</Text>
      </View>
      <View style={{ gap: spacing.sm }}>
        <Text style={{ color: c.muted, textAlign: "right" }}>
          £{subTotal.toFixed(2)}
        </Text>
        <Text style={{ fontWeight: "800", fontSize: 18, textAlign: "right" }}>
          £{total.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}
