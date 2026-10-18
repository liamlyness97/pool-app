import { fetchGame } from "@/api/venue-api";
import { chalkTheme, radii, spacing } from "@rackup/ui-tokens";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const c = chalkTheme.colors;

type FramesTrackerProps = {
  you: number;
  guest: number;
  incrementYou: () => void;
  decrementYou: () => void;
  incrementGuest: () => void;
  decrementGuest: () => void;
};

function TimePlayed() {
  return (
    <View
      style={{
        backgroundColor: c.surface,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: c.ink,
        paddingVertical: spacing.xxl,
        alignItems: "center",
        gap: spacing.sm,
      }}
    >
      <Text
        style={{
          color: c.muted,
        }}
      >
        Time played
      </Text>
      <Text
        style={{
          color: c.ink,
          fontSize: 50,
          fontWeight: "700",
        }}
      >
        00:42:10
      </Text>
      <Text
        style={{
          color: c.muted,
        }}
      >
        Running total
      </Text>
    </View>
  );
}

function FramesTracker() {
  return (
    <View style={{ gap: spacing.sm }}>
      <View>
        <Text style={{ color: c.ink, fontWeight: "700" }}>Frames</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: spacing.lg,
        }}
      >
        <View
          style={{
            flexGrow: 1,
            alignItems: "center",
            backgroundColor: c.surface,
            borderRadius: radii.md,
            borderWidth: 1,
            borderColor: c.ink,
            paddingVertical: spacing.lg,
            gap: spacing.sm,
          }}
        >
          <View>
            <Text
              style={{
                fontWeight: "700",
              }}
            >
              You
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontWeight: "900",
                fontSize: 40,
              }}
            >
              2
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: spacing.sm,
            }}
          >
            <Pressable
              style={{
                borderWidth: 1,
                borderColor: c.ink,
                height: 40,
                width: 40,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: radii.sm,
              }}
            >
              <MaterialDesignIcons name="minus" size={20} />
            </Pressable>
            <Pressable
              style={{
                borderWidth: 1,
                borderColor: c.ink,
                height: 40,
                width: 40,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: radii.sm,
                backgroundColor: c.ink,
              }}
            >
              <MaterialDesignIcons name="plus" color={c.surface} size={20} />
            </Pressable>
          </View>
        </View>
        <View
          style={{
            flexGrow: 1,
            alignItems: "center",
            backgroundColor: c.surface,
            borderRadius: radii.md,
            borderWidth: 1,
            borderColor: c.ink,
            paddingVertical: spacing.lg,
            gap: spacing.sm,
          }}
        >
          <View>
            <Text
              style={{
                fontWeight: "700",
              }}
            >
              Guest
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontWeight: "900",
                fontSize: 40,
              }}
            >
              1
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: spacing.sm,
            }}
          >
            <Pressable
              style={{
                borderWidth: 1,
                borderColor: c.ink,
                height: 40,
                width: 40,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: radii.sm,
              }}
            >
              <MaterialDesignIcons name="minus" size={20} />
            </Pressable>
            <Pressable
              style={{
                borderWidth: 1,
                borderColor: c.ink,
                height: 40,
                width: 40,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: radii.sm,
                backgroundColor: c.ink,
              }}
            >
              <MaterialDesignIcons name="plus" color={c.surface} size={20} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function GameScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();

  const { data, isPending, isError, refectch } = useQuery({
    queryKey: ["game", code],
    queryFn: () => fetchGame({ code }),
  });

  if (isError || !data) return <Text>Game not found</Text>;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: c.bg,
        gap: spacing.xl,
      }}
    >
      <View>
        {isPending ? (
          <Text>Loading...</Text>
        ) : (
          <View style={{ gap: spacing.xl, paddingHorizontal: spacing.xl }}>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                {data.table.name}
              </Text>
            </View>
            <TimePlayed />
            <FramesTracker />
          </View>
        )}
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
          style={{
            paddingVertical: spacing.lg,
            backgroundColor: c.ink,
            borderWidth: 1,
            borderColor: c.accent,
            borderRadius: radii.md,
          }}
        >
          <Text
            style={{ color: c.surface, textAlign: "center", fontWeight: "800" }}
          >
            End Game
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
