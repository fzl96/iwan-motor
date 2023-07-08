import { View, Text, Pressable, StyleSheet } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const DatePicker = ({ date, setDate }) => {
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      display: "spinner",
      value: date ?? new Date(),
      onChange,
      mode: "date",
      is24Hour: true,
      minimumDate: new Date(2000, 0, 1),
      maximumDate: new Date(2100, 11, 31),
      style: {
        backgroundColor: "#242424",
      },
    });
  };

  return (
    <View>
      <Pressable style={style.button} onPress={showDatepicker}>
        <Text
          style={[
            style.text,
            {
              color: date ? "#f1f3f5" : "#707070",
            },
          ]}
        >
          {date
            ? date.toLocaleString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "DD/MM/YYYY"}
        </Text>
      </Pressable>
    </View>
  );
};

const style = StyleSheet.create({
  button: {
    backgroundColor: "#242424",
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  text: {
    fontFamily: "satoshi-medium",
    fontSize: 14,
  },
});

export default DatePicker;
