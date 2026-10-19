import { fetchTable } from "@/api/venue-api";
import { chalkTheme, radii, spacing } from "@rackup/ui-tokens";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import TablePhoto from "@/components/table/TablePhoto";
import TableDetails from "@/components/table/TableDetails";
import StartTime from "@/components/table/StartTime";
import TableTotal from "@/components/table/TableTotal";
import Duration from "@/components/table/Duration";

const c = chalkTheme.colors;

export default function TableDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [duration, setDuration] = useState(1);
  const [time, setTime] = useState<string>("Now");

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["table", id],
    queryFn: () => fetchTable(id),
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

      <View
        style={{
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          borderTopWidth: 1,
          gap: spacing.sm,
        }}
      >
        <Link
          href={{
            pathname: "/table/payment",
            params: {
              tableId: id,
              duration: duration,
              startTime: time,
              price: data.price,
            },
          }}
          asChild
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reserve and pay"
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
              Continue to payment
            </Text>
          </Pressable>
        </Link>
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
