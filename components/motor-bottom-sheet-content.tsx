import { View, Text, Pressable } from "react-native";
import { useState, useMemo } from "react";
import _ from "lodash";
import { Feather } from "@expo/vector-icons";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { TextInput } from "react-native";

export const MotorBottomSheetContent = ({
  motor,
  setSelectedMotor,
  dismiss,
}) => {
  const [query, setQuery] = useState<string>("");

  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
  };

  const debouncedQueryChange = useMemo(
    () => _.debounce(handleQueryChange, 300),
    []
  );

  const filteredMerk: { id: string; model: string }[] = useMemo(
    () =>
      motor.filter((item) =>
        item.model.toLowerCase().includes(query.toLowerCase())
      ),
    [motor, query]
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "#161616",
          paddingHorizontal: 10,
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            backgroundColor: "#252525",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 7,
            overflow: "hidden",
          }}
        >
          <Feather name="search" size={18} color="#616161" />
          <TextInput
            style={{
              color: "#f1f3f5",
              fontSize: 18,
              fontFamily: "satoshi-regular",
              width: "100%",
            }}
            placeholderTextColor={"#616161"}
            placeholder="Cari"
            onChangeText={debouncedQueryChange}
          />
        </View>
      </View>
      <BottomSheetFlatList
        contentContainerStyle={
          {
            // paddingHorizontal: 10,
            // gap: 10,
          }
        }
        data={filteredMerk}
        keyExtractor={(item, index) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              setSelectedMotor(item);
              dismiss();
            }}
            style={({ pressed }) => [
              {
                paddingVertical: 15,
                paddingHorizontal: 15,
                borderBottomWidth: 0.8,
                borderBottomColor: "#252525",
                backgroundColor: pressed ? "#242424" : "#161616",
              },
            ]}
          >
            <Text
              style={{
                color: "#f1f3f5",
                fontSize: 18,
                fontFamily: "satoshi-regular",
              }}
            >
              {item.model}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};
