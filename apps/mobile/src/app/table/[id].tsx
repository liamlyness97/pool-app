import { fetchTable, VenueTable } from "@/api/venue-api";
import { chalkTheme, radii, spacing } from "@rackup/ui-tokens";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { STATUS_STYLE } from "../(tabs)";
import { create } from "zustand";

const c = chalkTheme.colors;

type TableCardProps = {
  table: VenueTable;
};

const useDurationStore = create((set) => ({
  duration: 1,
  increment: () =>
    set((state) => ({
      duration: state.duration + 1,
    })),
  decrement: () =>
    set((state) => ({
      duration: state.duration != 1 ? state.duration - 1 : (state.duration = 1),
    })),
  reset: () => set({ duration: 1 }),
}));

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
    <View style={{ paddingHorizontal: spacing.md, gap: spacing.sm }}>
      <View>
        <Text style={{ color: c.ink, fontWeight: "700" }}>Start time</Text>
      </View>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{ gap: 10 }}
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
    </View>
  );
}

function Duration() {
  const duration = useDurationStore((state) => state.duration);
  const increment = useDurationStore((state) => state.increment);
  const decrement = useDurationStore((state) => state.decrement);

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
          onPress={decrement}
          style={{ paddingHorizontal: spacing.sm }}
        >
          <MaterialDesignIcons name="minus" size={20} />
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>{duration} hour</Text>
        <Pressable
          onPress={increment}
          style={{ paddingHorizontal: spacing.sm }}
        >
          <MaterialDesignIcons name="plus" size={20} />
        </Pressable>
      </View>
    </View>
  );
}

function TableTotal({ price }: { price: number }) {
  const duration = useDurationStore((state) => state.duration);
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
        gap: spacing.xl,
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

      <Duration />

      <TableTotal price={data.price} />
    </SafeAreaView>
  );
}
