import { spacing, chalkTheme, radii } from "@rackup/ui-tokens";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Link } from "expo-router";

const c = chalkTheme.colors;

type CameraPreviewProps = {
  onScan: (data: string) => void;
};

function CameraPreview({ onScan }: CameraPreviewProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Pressable onPress={requestPermission}>
          <Text>Grant permission</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View>
      <CameraView
        style={{ borderRadius: radii.md, aspectRatio: "1/1" }}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={
          scanned
            ? undefined
            : ({ data }) => {
                setScanned(true);
                onScan(data);
              }
        }
        facing="back"
      />
    </View>
  );
}

export default function Scan() {
  const [qrCode, scanQrCode] = useState<string | null>(null);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: c.bg,
        justifyContent: "space-between",
      }}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,

          gap: spacing.xl,
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            gap: spacing.xl,
            paddingHorizontal: spacing.xl,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ paddingTop: spacing.lg }}>
            <Text style={{ fontSize: 30, fontWeight: "800", color: c.ink }}>
              Start your game
            </Text>
            <Text style={{ marginTop: 6, fontSize: 14, color: c.muted }}>
              Point your camera at the QR code on the table.
            </Text>
          </View>
          <CameraPreview onScan={(data) => scanQrCode(data)} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{ flex: 1, height: 3, backgroundColor: c.busyBg }}
            ></View>
            <View
              style={{
                paddingHorizontal: spacing.lg,
              }}
            >
              <Text style={{ color: c.ink }}>or enter the code</Text>
            </View>
            <View
              style={{ flex: 1, height: 2, backgroundColor: c.busyBg }}
            ></View>
          </View>
          <View>
            <View style={{ gap: spacing.sm }}>
              <Text style={{ color: c.ink, fontWeight: "700" }}>
                Table code
              </Text>
              <TextInput
                style={{
                  paddingHorizontal: spacing.md,
                  height: 45,
                  borderWidth: 1,
                  borderColor: c.ink,
                  borderRadius: radii.sm,
                  backgroundColor: c.surface,
                }}
                placeholder="e.g. 3-K7Q2"
                value={qrCode ? qrCode : ""}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View
        style={{
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          borderTopWidth: 1,
          gap: spacing.sm,
        }}
      >
        {qrCode ? (
          <Link
            href={{
              pathname: "/game/[code]",
              params: { code: qrCode },
            }}
            accessibilityRole="button"
            accessibilityLabel="Start game"
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
              Start Game
            </Text>
          </Link>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
