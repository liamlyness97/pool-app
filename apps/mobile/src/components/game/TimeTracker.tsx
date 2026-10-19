import { chalkTheme, radii, spacing } from "@rackup/ui-tokens";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

type TimePlayedProps = {
  startTime: string;
  endTime: string;
};

const c = chalkTheme.colors;

function formatRemaining(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function useCountdown(endsAt: string) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const endsMs = new Date(endsAt).getTime();

    if (Date.now() >= endsMs) {
      setNow(Date.now());
      return;
    }

    const id = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= endsMs) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [endsAt]);

  const remainingMs = Math.max(0, new Date(endsAt).getTime() - now);

  return {
    remainingMs,
    isFinished: remainingMs === 0,
    label: formatRemaining(remainingMs),
  };
}

function CountdownTimer({ endsAt }: { endsAt: string }) {
  const { label, isFinished } = useCountdown(endsAt);
  return (
    <Text
      style={{
        color: c.ink,
        fontSize: 50,
        fontWeight: "700",
      }}
    >
      {isFinished ? "Session finished" : label}
    </Text>
  );
}

export default function TimeTracker({ startTime, endTime }: TimePlayedProps) {
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
        Time left
      </Text>
      <CountdownTimer endsAt={endTime} />
      <Text
        style={{
          color: c.muted,
        }}
      >
        Paid until{" "}
        {new Date(endTime).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );
}
