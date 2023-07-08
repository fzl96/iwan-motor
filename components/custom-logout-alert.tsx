import { Modal, View, Text, Pressable } from "react-native";

export const CustomLogoutAlert = ({ showAlert, setShowAlert, onPress }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showAlert}
      onRequestClose={() => {
        setShowAlert(false);
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#252525",
            width: "65%",
            borderRadius: 15,
          }}
        >
          <View
            style={{
              paddingTop: 30,
              paddingBottom: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "satoshi-bold",
                color: "#f1f3f5",
                textAlign: "center",
              }}
            >
              Logout?
            </Text>
          </View>
          <View>
            <Pressable
              onPress={onPress}
              style={({ pressed }) => [
                {
                  alignItems: "center",
                  borderTopColor: "#555557",
                  borderTopWidth: 0.2,
                  paddingVertical: 15,
                  backgroundColor: pressed ? "#363636" : "transparent",
                  borderBottomStartRadius: 0,
                  borderBottomEndRadius: 0,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "satoshi-regular",
                  color: "#fe2f40",
                }}
              >
                Logout
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setShowAlert(false)}
              style={({ pressed }) => [
                {
                  alignItems: "center",
                  borderTopColor: "#555557",
                  borderTopWidth: 0.2,
                  paddingVertical: 15,
                  backgroundColor: pressed ? "#363636" : "transparent",
                  borderBottomStartRadius: 15,
                  borderBottomEndRadius: 15,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "satoshi-regular",
                  color: "#f1f3f5",
                }}
              >
                Batal
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
