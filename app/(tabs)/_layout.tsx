import { Tabs } from "expo-router/tabs";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BottomSheet } from "../../components/bottom-sheet";
import { useRef, useState } from "react";
import { useSheet } from "../../hooks/use-sheet";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { UserBottomSheet } from "../../components/user-bottom-sheet";
import { useAuth } from "../../hooks/use-auth";
import { CustomLogoutAlert } from "../../components/custom-logout-alert";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";

export default function AppLayout() {
  const router = useRouter();
  const { user } = useAuth();
  const { dismiss } = useBottomSheetModal();
  const sheetRef = useRef(null);
  const { points, handleSheetChanges, handlePresentModalPress } = useSheet({
    snapPoints: ["20%", "20%"],
    sheetRef: sheetRef,
  });

  const [showAlert, setShowAlert] = useState(false);

  const logout = async () => {
    setShowAlert(false);
    dismiss();
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            borderTopWidth: 0,
            // elevation: 0,
            backgroundColor: "#0f0f0f",
            height: 60,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            // headerShown: false,
            headerTitle: "Home",
            headerTitleStyle: {
              color: "#f1f3f5",
              fontSize: 30,
              fontFamily: "satoshi-bold",
            },
            headerRight: () => (
              <TouchableOpacity
                onPress={handlePresentModalPress}
                activeOpacity={0.7}
                style={{
                  marginRight: 10,
                }}
              >
                <Feather name="user" size={24} color="#f1f3f5" />
              </TouchableOpacity>
            ),
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: "#0f0f0f",
            },
            tabBarIcon: ({ focused }) => (
              <Feather
                name="bar-chart-2"
                size={30}
                style={{}}
                color={focused ? "#f1f3f5" : "#555557"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="sales"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Feather
                name="shopping-cart"
                size={25}
                style={{}}
                color={focused ? "#f1f3f5" : "#555557"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="room"
          options={{
            headerShown: false,

            tabBarIcon: ({ focused }) => (
              <Feather
                name="list"
                size={25}
                style={{}}
                color={focused ? "#f1f3f5" : "#555557"}
              />
            ),
          }}
        />
      </Tabs>
      <CustomLogoutAlert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        onPress={() => logout()}
      />
      <BottomSheet
        sheetRef={sheetRef}
        snapPoints={points}
        handleSheetChanges={handleSheetChanges}
      >
        <UserBottomSheet
          user={user}
          onPressChange={() => console.log("test")}
          onPressLogout={() => setShowAlert(true)}
        />
      </BottomSheet>
    </>
  );
}
