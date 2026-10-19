import { bookTable, fetchTable } from "@/api/venue-api";
import { chalkTheme, radii, spacing } from "@rackup/ui-tokens";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Crypto from "expo-crypto";

const c = chalkTheme.colors;

export type PaymentParams = {
  tableId: string;
  duration: string;
  startTime: string;
  price: string;
};

function CheckoutTotaL({
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
    <View style={{ paddingHorizontal: spacing.md }}>
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
          <Text style={{ color: c.muted }}>VAT</Text>
          <Text style={{ fontWeight: "800", fontSize: 18 }}>Total</Text>
        </View>
        <View style={{ gap: spacing.sm }}>
          <Text style={{ color: c.muted, textAlign: "right" }}>
            £{subTotal.toFixed(2)}
          </Text>
          <Text style={{ color: c.muted, textAlign: "right" }}>
            £{tax.toFixed(2)}
          </Text>
          <Text style={{ fontWeight: "800", fontSize: 18, textAlign: "right" }}>
            £{total.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function TableInfo({
  name,
  tableDetail,
  bookingDetail,
}: {
  name: string;
  tableDetail: string;
  bookingDetail: string;
}) {
  return (
    <View style={{ paddingHorizontal: spacing.md }}>
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
          <Text style={{ fontWeight: "800", fontSize: 18 }}>{name}</Text>
          <Text style={{ color: c.muted }}>{tableDetail}</Text>
          <Text style={{ color: c.muted }}>{bookingDetail}</Text>
        </View>
      </View>
    </View>
  );
}

export default function PaymentScreen() {
  const { tableId, duration, startTime, price } =
    useLocalSearchParams<PaymentParams>();

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["table", tableId],
    queryFn: () => fetchTable(tableId),
  });
  if (isError || !data) return <Text>Table not found</Text>;

  const tableDetail = [data.kind, data.size].filter(Boolean).join(" . ");
  const bookingDetail = [
    "Today",
    startTime,
    `${duration} ${Number(duration) > 1 ? "hours" : "hour"}`,
  ]
    .filter(Boolean)
    .join(" . ");

  const mutation = useMutation({
    mutationFn: bookTable,
    onSuccess: () => {
      router.replace({
        pathname: "/table/confirmation",
      });
    },
    onError: (error) => {
      console.log("Booking failed:", error);
    },
  });

  const subTotal = Number(price) * Number(duration);
  const tax = subTotal * 0.2;
  const total = subTotal + tax;
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "space-between" }}>
      <View style={{ gap: spacing.xl, paddingHorizontal: spacing.md }}>
        <Link href={`/table/${tableId}`} asChild>
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
              Payment
            </Text>
          </Pressable>
        </Link>
        <View style={{ paddingTop: spacing.lg, paddingHorizontal: spacing.md }}>
          <Text style={{ fontSize: 30, fontWeight: "800", color: c.ink }}>
            Check and pay
          </Text>
          <Text style={{ marginTop: 6, fontSize: 14, color: c.muted }}>
            Your table is held once payment goes through
          </Text>
        </View>
        <TableInfo
          name={data.name}
          tableDetail={tableDetail}
          bookingDetail={bookingDetail}
        />
        <CheckoutTotaL price={Number(price)} duration={Number(duration)} />
      </View>
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
              tableId: tableId,
              startTime: startTime,
              duration: Number(duration),
              idempotencyKey: Crypto.randomUUID(),
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
              Pay £{total.toFixed(2)}
            </Text>
          )}
        </Pressable>
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
            Cancel
          </Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
