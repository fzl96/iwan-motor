import { View, Text } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import { CustomStack } from "../components/custom-stack";

const StartPage = () => {
  const { user, initialized } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    if (!navigationState?.key || !initialized) return;

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/login");
    } else if (user) {
      // Redirect away from the sign-in page.
      router.replace("/(tabs)/home");
    }
  }, [user, segments, navigationState?.key, initialized]);

  return (
    <View>
      <CustomStack.Screen
        options={{
          headerShown: false,
        }}
      />
    </View>
  );
};

export default StartPage;
