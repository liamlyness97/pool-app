import { fetchGame } from "@/api/venue-api";
import FramesTracker from "@/components/game/FrameTracker";
import TimeTracker from "@/components/game/TimeTracker";
import { chalkTheme, radii, spacing } from "@rackup/ui-tokens";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const c = chalkTheme.colors;

export default function GameScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const [youScore, setYouScore] = useState<number>(0);
  const [guestScore, setGuestScore] = useState<number>(0);

  const { data, isPending, isError, refetch } = useQuery({
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
            <TimeTracker
              startTime={data.game.startTime}
              endTime={data.game.endTime}
            />
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
                <FramesTracker
                  name="You"
                  frames={youScore}
                  onIncrement={() => setYouScore((f) => f + 1)}
                  onDecrement={() => setYouScore((f) => Math.max(0, f - 1))}
                />
                <FramesTracker
                  name="Guest"
                  frames={guestScore}
                  onIncrement={() => setGuestScore((f) => f + 1)}
                  onDecrement={() => setGuestScore((f) => Math.max(0, f - 1))}
                />
              </View>
            </View>
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
          onPress={() => router.navigate("/")}
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
