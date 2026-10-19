import { chalkTheme, radii, spacing } from "@rackup/ui-tokens";
import { Pressable, ScrollView, Text, View } from "react-native";

type StartTimeProps = {
  availability: string[];
  selected: string;
  onSelect: (time: string) => void;
};

const c = chalkTheme.colors;

export default function StartTime({
  availability,
  selected,
  onSelect,
}: StartTimeProps) {
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
