import { router, Stack } from "expo-router";
import { View, Text, Button } from "react-native";
/**
 * Home screen component for authenticated users.
 * @returns {JSX.Element}
 */
export default function Home() {
  return (
    <>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Home</Text>
        <Text>Only visible to signed-in users</Text>
        <Button
          title="Go to About"
          onPress={() => {
            router.push("/(app)/about");
          }}
        />
      </View>
    </>
  );
}
