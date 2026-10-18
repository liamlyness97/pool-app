import { bookTable, fetchTable, VenueTable } from "@/api/venue-api";
import { chalkTheme, radii, spacing } from "@rackup/ui-tokens";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { STATUS_STYLE } from "../(tabs)";
import { useState } from "react";
import { FlatList } from "react-native-gesture-handler";

const c = chalkTheme.colors;

type TableCardProps = {
  table: VenueTable;
};

type DurationProps = {
  duration: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

type StartTimeProps = {
  availability: string[];
  selected: string;
  onSelect: (time: string) => void;
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

function StartTime({ availability, selected, onSelect }: StartTimeProps) {
  return (
    <View style={{ paddingHorizontal: spacing.md, gap: spacing.sm }}>
      <View>
        <Text style={{ color: c.ink, fontWeight: "700" }}>Start time</Text>
      </View>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{ gap: 10 }}
        showsHorizontalScrollIndicator={false}
      >
        <Pressable
          onPress={() => onSelect("Now")}
          style={
            selected == "Now"
              ? {
                  width: 100,
                  height: 50,
                  justifyContent: "center",
                  backgroundColor: c.ink,
                  borderWidth: 1,
                  borderColor: c.ink,
                  borderRadius: radii.sm,
                }
              : {
                  width: 100,
                  height: 50,
                  justifyContent: "center",
                  backgroundColor: c.bg,
                  borderRadius: radii.sm,
                  borderWidth: 1,
                }
          }
        >
          <Text
            style={
              selected == "Now"
                ? { color: c.surface, textAlign: "center" }
                : { color: c.ink, textAlign: "center" }
            }
          >
            Now
          </Text>
        </Pressable>
        {availability?.map((time) => (
          <Pressable
            key={time}
            onPress={() => onSelect(time)}
            style={
              selected == time
                ? {
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    backgroundColor: c.ink,
                    borderWidth: 1,
                    borderColor: c.ink,
                    borderRadius: radii.sm,
                  }
                : {
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    backgroundColor: c.bg,
                    borderRadius: radii.sm,
                    borderWidth: 1,
                  }
            }
          >
            <Text
              style={
                selected == time
                  ? { color: c.surface, textAlign: "center" }
                  : { color: c.ink, textAlign: "center" }
              }
            >
              {time}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function TableTotal({ price, duration }: { price: number; duration: number }) {
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

function Duration({ duration, onIncrement, onDecrement }: DurationProps) {
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
          onPress={onDecrement}
          style={{ paddingHorizontal: spacing.sm }}
        >
          <MaterialDesignIcons name="minus" size={20} />
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>{duration} hour</Text>
        <Pressable
          onPress={onIncrement}
          style={{ paddingHorizontal: spacing.sm }}
        >
          <MaterialDesignIcons name="plus" size={20} />
        </Pressable>
      </View>
    </View>
  );
}

export default function TableDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [duration, setDuration] = useState(1);
  const [time, setTime] = useState<string>("Now");

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["table", id],
    queryFn: () => fetchTable(id),
  });

  const mutation = useMutation({
    mutationFn: bookTable,
  });

  if (isError || !data) return <Text>Table not found</Text>;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: c.bg,
        gap: spacing.xl,
      }}
    >
      <View style={{ gap: spacing.xl, paddingHorizontal: spacing.md }}>
        <Link href="/" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Return to Tables"
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

        <StartTime
          availability={data.availability}
          selected={time}
          onSelect={setTime}
        />

        <Duration
          duration={duration}
          onIncrement={() => setDuration((d) => d + 1)}
          onDecrement={() => setDuration((d) => Math.max(1, d - 1))}
        />

        <TableTotal price={data.price} duration={duration} />
      </View>
      {mutation.isSuccess ? (
        <View>
          <Text>Booking successful</Text>
        </View>
      ) : null}

      <View
        style={{
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          borderTopWidth: 1,
          gap: spacing.sm,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reserve and pay"
          onPress={() => {
            mutation.mutate({
              tableId: data.id,
              startTime: time,
              hours: duration,
            });
          }}
          style={{
            paddingVertical: spacing.lg,
            backgroundColor: c.accent,
            borderWidth: 1,
            borderColor: c.accent,
            borderRadius: radii.md,
          }}
        >
          {mutation.isPending ? (
            <Text
              style={{
                color: c.surface,
                textAlign: "center",
                fontSize: 16,
              }}
            >
              Booking in progress...
            </Text>
          ) : (
            <Text
              style={{
                color: c.surface,
                textAlign: "center",
                fontSize: 16,
                fontWeight: "800",
              }}
            >
              Reserve and pay
            </Text>
          )}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Join queue"
          style={{
            paddingVertical: spacing.lg,
            backgroundColor: c.bg,
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
            Join the queue instead
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
