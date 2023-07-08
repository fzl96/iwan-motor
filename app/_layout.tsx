import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeProvider } from "@react-navigation/native";
import { CustomStack } from "../components/custom-stack";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useCallback } from "react";
import { DataProvider } from "../context/data-context";
import Toast from "react-native-toast-message";
import { ToastProvider } from "react-native-toast-notifications";
import { Text, View } from "react-native";
import { AuthProvider } from "../context/auth-context";

SplashScreen.preventAutoHideAsync();

const layout = () => {
  const [loaded] = useFonts({
    "satoshi-light": require("../assets/fonts/Satoshi-Light.otf"),
    "satoshi-regular": require("../assets/fonts/Satoshi-Regular.otf"),
    "satoshi-medium": require("../assets/fonts/Satoshi-Medium.otf"),
    "satoshi-bold": require("../assets/fonts/Satoshi-Bold.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <>
      <ThemeProvider
        value={{
          dark: true,
          colors: {
            primary: "rgb(10, 132, 255)",
            background: "#0f0f0f",
            card: "rgb(18, 18, 18)",
            text: "rgb(229, 229, 231)",
            border: "rgb(39, 39, 41)",
            notification: "rgb(255, 69, 58)",
          },
        }}
      >
        <AuthProvider>
          <ToastProvider
            renderType={{
              custom_type: (toast) => (
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    paddingHorizontal: 15,
                    marginVertical: 5,
                    bottom: 50,
                  }}
                >
                  <View
                    style={{
                      borderRadius: 7,
                      backgroundColor: "#323232",
                      padding: 15,
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Text>{toast.icon}</Text>

                    <Text
                      style={{
                        color: "#f1f3f5",
                        fontFamily: "satoshi-medium",
                        fontSize: 15,
                      }}
                    >
                      {toast.message}
                    </Text>
                  </View>
                </View>
              ),
            }}
          >
            <BottomSheetModalProvider>
              <DataProvider>
                <CustomStack>
                  <CustomStack.Screen
                    name="(tabs)"
                    options={{ headerShown: false, headerShadowVisible: false }}
                  />
                </CustomStack>
              </DataProvider>
            </BottomSheetModalProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>

      <Toast />
    </>
  );
};

export default layout;
