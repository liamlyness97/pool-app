import { fetchTables, TableStatus, VenueTable } from "@/api/venue-api";
import { chalkTheme, radii, spacing } from "@rackup/ui-tokens";
import { useQuery } from "@tanstack/react-query";
import { Text, View, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const c = chalkTheme.colors;

const STATUS_STYLE: Record<
  TableStatus,
  { label: string; bg: string; text: string }
> = {
  free: { label: "Free", bg: c.freeBg, text: c.freeText },
  in_use: { label: "In use", bg: c.busyBg, text: c.busyText },
  reserved: { label: "Reserved", bg: c.reservedBg, text: c.reservedText },
};

function TableCard({ table }: { table: VenueTable }) {
  const status = STATUS_STYLE[table.status];
  const detail = [table.kind, table.size, table.note]
    .filter(Boolean)
    .join(" . ");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${table.name}, ${status.label}`}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.lg,
        padding: spacing.lg,
        borderWidth: 1.5,
        borderColor: c.border,
        borderRadius: radii.md,
        backgroundColor: c.surface,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: c.ink }}>
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
    </Pressable>
  );
}

export default function TablesScreen() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["tables"],
    queryFn: fetchTables,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.lg }}>
        <Text style={{ fontSize: 30, fontWeight: "800", color: c.ink }}>
          Tables
        </Text>
        <Text style={{ marginTop: 6, fontSize: 14, color: c.muted }}>
          Tap a table to book it or join the queue.
        </Text>
      </View>
      {isPending ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.md,
          }}
        >
          <Text style={{ color: c.ink }}>Couldn't load tables.</Text>
          <Pressable onPress={() => refetch()} accessibilityRole="button">
            <Text style={{ color: c.accent, fontWeight: "700" }}>
              Try again
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(table) => table.id}
          contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}
          renderItem={({ item }) => <TableCard table={item} />}
        />
      )}
    </SafeAreaView>
  );
}
