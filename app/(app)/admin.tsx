import { Stack } from "expo-router";
import { View, Text } from "react-native";
/**
 * Home screen component for authenticated users.
 * @returns {JSX.Element}
 */
export default function AdminHome() {
  return (
    <>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Admin Home</Text>
        <Text>Only visible to ADMIN users</Text>
      </View>
    </>
  );
}
