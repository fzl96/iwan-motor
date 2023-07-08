import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { BottomSheet } from "./bottom-sheet";
import { useRef } from "react";
import { useSheet } from "../hooks/use-sheet";
import { ChangePassword } from "./change-password-form";

export const UserBottomSheet = ({ user, onPressLogout, onPressChange }) => {
  const sheetRef = useRef(null);
  const { points, handleSheetChanges, handlePresentModalPress } = useSheet({
    sheetRef: sheetRef,
    snapPoints: ["60%", "60%"],
  });

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 5,
        paddingBottom: 20,
        paddingHorizontal: 15,
        justifyContent: "center",
      }}
    >
      <View style={{ backgroundColor: "#252525", borderRadius: 10 }}>
        <Pressable
          onPress={handlePresentModalPress}
          style={({ pressed }) => [
            styles.bottomSheetBtn,
            {
              backgroundColor: pressed ? "#3a3a3a" : "transparent",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#555557",
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 17, color: "#f1f3f5" }}>
              Ganti Password
            </Text>
            <Feather name="lock" size={22} color="#f1f3f5" />
          </View>
        </Pressable>
        <Pressable
          onPress={onPressLogout}
          style={({ pressed }) => [
            styles.bottomSheetBtn,
            {
              backgroundColor: pressed ? "#3a3a3a" : "transparent",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 16, color: "#fe2f40" }}>Logout</Text>
            <Feather name="log-out" size={20} color="#fe2f40" />
          </View>
        </Pressable>
      </View>
      <BottomSheet
        sheetRef={sheetRef}
        handleSheetChanges={handleSheetChanges}
        snapPoints={points}
      >
        <ChangePassword />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheetBtn: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
});
