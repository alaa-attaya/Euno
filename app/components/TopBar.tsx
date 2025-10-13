"use client";
import MaskedView from "@react-native-masked-view/masked-view";
import React from "react";
import { Dimensions, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

export default function TopBar() {
  const isDark = useColorScheme() === "dark";
  const { width } = Dimensions.get("window");
  const insets = useSafeAreaInsets();

  const accentColor = "#F6757A";
  const secondaryColor = "#F9BD72";
  const cardBg = isDark ? "#2A2A3D" : "#FEFBF3";

  const originalWidth = 399;
  const originalHeight = 106;

  // Increased height factor to make TopBar bigger
  const heightFactor = 0.45; // was 0.3
  const scaledHeight = width * (originalHeight / originalWidth) * heightFactor;

  return (
    <View
      style={{
        width: "100%",
        paddingTop: insets.top,
        alignItems: "center",
        backgroundColor: "transparent",
        zIndex: 50,
      }}
    >
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 10, // for Android shadow
        }}
      >
        <MaskedView
          style={{ width, height: scaledHeight }}
          maskElement={
            <Svg
              width={width}
              height={scaledHeight}
              viewBox={`0 0 ${originalWidth} ${originalHeight}`}
            >
              <Path
                d="M293.807 105.987H0C0 47.4534 46.9583 0 104.881 0H398.694C398.694 58.5336 351.735 105.987 293.807 105.987Z"
                fill="black"
              />
            </Svg>
          }
        >
          <View
            style={{
              backgroundColor: cardBg,
              width,
              height: scaledHeight,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 28, // slightly bigger font
                fontWeight: "bold",
                color: "white",
              }}
            >
              <Text style={{ color: accentColor }}>Eu</Text>
              <Text style={{ color: secondaryColor }}>no</Text>
            </Text>
          </View>
        </MaskedView>
      </View>
    </View>
  );
}
