import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { TextInput } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useToast } from "react-native-toast-notifications";
import { getAuth, updatePassword } from "firebase/auth";
import { RotationAnimation } from "./rotation-animation";
import { AntDesign } from "@expo/vector-icons";

export const ChangePassword = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const toast = useToast();
  const { dismiss, dismissAll } = useBottomSheetModal();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [newPassword, confirmNewPassword]);

  const handleSubmit = async () => {
    if (newPassword !== confirmNewPassword) {
      setError("Password tidak sama");
      return;
    }
    let id = toast.show("Mengganti...", {
      type: "custom_type",
      placement: "bottom",
      animationType: "slide-in",
      animationDuration: 100,
      duration: 10000,
      icon: (
        <RotationAnimation>
          <AntDesign name="loading1" size={18} color="white" />
        </RotationAnimation>
      ),
    });

    await updatePassword(user, newPassword);
    toast.hide(id);
    toast.show("Password diganti", {
      type: "custom_type",
      placement: "bottom",
      duration: 1000,
      animationType: "slide-in",
      icon: <Feather name="check" size={18} color="white" />,
    });

    dismissAll();
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 5,
        paddingBottom: 20,
        paddingHorizontal: 15,
        justifyContent: "center",
        gap: 15,
      }}
    >
      <View style={{ backgroundColor: "#252525", borderRadius: 10 }}>
        <TextInput
          placeholder="Password Baru"
          secureTextEntry={true}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholderTextColor="#707070"
          style={{
            padding: 15,
            fontFamily: "satoshi-medium",
            fontSize: 17,
            color: "#f1f3f5",
            borderBottomWidth: 0.5,
            borderBottomColor: "#555557",
          }}
        />
        <TextInput
          placeholder="Konfirmasi Password Baru"
          secureTextEntry={true}
          onChangeText={setConfirmNewPassword}
          value={confirmNewPassword}
          placeholderTextColor="#707070"
          style={{
            padding: 15,
            fontFamily: "satoshi-medium",
            fontSize: 17,
            color: "#f1f3f5",
          }}
        />
      </View>
      {error && (
        <Text
          style={{
            color: "#fe2f40",
            fontSize: 14,
            fontFamily: "satoshi-medium",
          }}
        >
          {error}
        </Text>
      )}
      <View style={{ backgroundColor: "#252525", borderRadius: 10 }}>
        <Pressable
          onPress={() => handleSubmit()}
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
            <Text style={{ fontSize: 16, color: "#f1f3f5" }}>Simpan</Text>
            <Feather name="save" size={20} color="#f1f3f5" />
          </View>
        </Pressable>
        <Pressable
          onPress={() => dismiss()}
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
            <Text style={{ fontSize: 17, color: "#f1f3f5" }}>Batal</Text>
            <Feather name="x" size={22} color="#f1f3f5" />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheetBtn: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
});
