import { Stack } from "expo-router";
import { View, Text } from "react-native";
/**
 * Home screen component for authenticated users.
 * @returns {JSX.Element}
 */
export default function Home() {
  return (
    <>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Home</Text>
      </View>
    </>
  );
}
