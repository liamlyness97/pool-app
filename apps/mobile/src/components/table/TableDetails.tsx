import { VenueTable } from "@/api/venue-api";
import { STATUS_STYLE } from "@/app/(tabs)";
import { chalkTheme, radii, spacing } from "@rackup/ui-tokens";
import { Text, View } from "react-native";

const c = chalkTheme.colors;

type TableCardProps = {
  table: VenueTable;
};

export default function TableDetails({ table }: TableCardProps) {
  const status = STATUS_STYLE[table.status];
  const detail = [
    table.kind,
    table.size,
    `£${table.price} per hour`,
    table.note,
  ]
    .filter(Boolean)
    .join(" . ");
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 30, fontWeight: "800", color: c.ink }}>
          {table.name}
        </Text>
        <Text style={{ marginTop: 2, fontSize: 13, color: c.muted }}>
          {detail}
        </Text>
      </View>
      <View
        style={{
          paddingVertical: 6,
          paddingHorizontal: spacing.md,
          borderRadius: radii.md,
          backgroundColor: status.bg,
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: "700", color: status.text }}>
          {status.label}
        </Text>
      </View>
    </View>
  );
}
