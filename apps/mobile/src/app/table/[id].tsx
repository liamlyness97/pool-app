import { fetchTable, VenueTable } from "@/api/venue-api";
import { chalkTheme, radii, spacing } from "@rackup/ui-tokens";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { STATUS_STYLE } from "../(tabs)";

const c = chalkTheme.colors;

type TableCardProps = {
  table: VenueTable;
};

function TablePhoto() {
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

function TableDetails({ table }: TableCardProps) {
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
          Temp Text
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

function StartTime() {
  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={{ gap: 10, paddingHorizontal: spacing.md }}
      showsHorizontalScrollIndicator={false}
      contentInset={{ left: spacing.lg }}
    >
      <View
        style={{
          width: 100,
          height: 50,
          justifyContent: "center",
          backgroundColor: c.ink,
          borderWidth: 1,
          borderColor: c.ink,
          borderRadius: radii.sm,
        }}
      >
        <Text style={{ color: c.surface, textAlign: "center" }}>Now</Text>
      </View>
      <View
        style={{
          width: 100,
          height: 50,
          justifyContent: "center",
          backgroundColor: c.bg,
          borderRadius: radii.sm,
          borderWidth: 1,
        }}
      >
        <Text style={{ color: c.ink, textAlign: "center" }}>19:30</Text>
      </View>
      <View
        style={{
          width: 100,
          height: 50,
          justifyContent: "center",
          backgroundColor: c.bg,
          borderRadius: radii.sm,
          borderWidth: 1,
        }}
      >
        <Text style={{ color: c.ink, textAlign: "center" }}>20:00</Text>
      </View>
      <View
        style={{
          width: 100,
          height: 50,
          justifyContent: "center",
          backgroundColor: c.bg,
          borderRadius: radii.sm,
          borderWidth: 1,
        }}
      >
        <Text style={{ color: c.ink, textAlign: "center" }}>20:30</Text>
      </View>
      <View
        style={{
          width: 100,
          height: 50,
          justifyContent: "center",
          backgroundColor: c.bg,
          borderRadius: radii.sm,
          borderWidth: 1,
        }}
      >
        <Text style={{ color: c.ink, textAlign: "center" }}>21:00</Text>
      </View>
      <View
        style={{
          width: 100,
          height: 50,
          justifyContent: "center",
          backgroundColor: c.bg,
          borderRadius: radii.sm,
          borderWidth: 1,
        }}
      >
        <Text style={{ color: c.ink, textAlign: "center" }}>21:30</Text>
      </View>
      <View
        style={{
          width: 100,
          height: 50,
          justifyContent: "center",
          backgroundColor: c.bg,
          borderRadius: radii.sm,
          borderWidth: 1,
        }}
      >
        <Text style={{ color: c.ink, textAlign: "center" }}>22:00</Text>
      </View>
      <View
        style={{
          width: 100,
          height: 50,
          justifyContent: "center",
          backgroundColor: c.bg,
          borderRadius: radii.sm,
          borderWidth: 1,
        }}
      >
        <Text style={{ color: c.ink, textAlign: "center" }}>22:30</Text>
      </View>
    </ScrollView>
  );
}

export default function TableDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["table"],
    queryFn: () => fetchTable(id),
  });

  if (isError || !data) return <Text>Table not found</Text>;

  return (
    <SafeAreaView
      style={{
        backgroundColor: c.bg,
        paddingHorizontal: spacing.md,
        gap: spacing.lg,
      }}
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
      <TablePhoto />

      <TableDetails table={data} />

      <StartTime />
    </SafeAreaView>
  );
}
