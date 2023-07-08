import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export const RoomBottomSheetContent = ({ onPressEdit, onPressDelete }) => {
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
          onPress={onPressEdit}
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
            <Text style={{ fontSize: 16, color: "#f1f3f5" }}>Edit</Text>
            <Feather name="edit" size={20} color="#f1f3f5" />
          </View>
        </Pressable>
        <Pressable
          onPress={onPressDelete}
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
            <Text style={{ fontSize: 17, color: "#fe2f40" }}>Hapus</Text>
            <Feather name="trash" size={22} color="#fe2f40" />
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
