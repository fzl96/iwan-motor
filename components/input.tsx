import { useController } from "react-hook-form";
import { Text, TextInput, View, StyleSheet } from "react-native";

interface InputProps {
  label: string;
  name: string;
  control: any;
  placeholder: string;
  type: "numeric" | "text";
  errors: any;
  currentValue?: string | number;
}

const Input = ({
  label,
  name,
  control,
  placeholder,
  type,
  errors,
  currentValue,
}: InputProps) => {
  const { field } = useController({
    control,
    defaultValue: currentValue
      ? currentValue.toString()
      : type === "numeric"
      ? "0"
      : "",
    name,
  });

  return (
    <View style={style.container}>
      <Text style={style.label}>{label}</Text>
      <TextInput
        placeholderTextColor={"#707070"}
        style={style.input}
        placeholder={placeholder}
        value={field.value}
        onChangeText={(value) => {
          type === "numeric" ? field.onChange(+value) : field.onChange(value);
        }}
        inputMode={type}
        keyboardType={type === "numeric" ? "numeric" : "default"}
      />
      {errors[name] && (
        <Text
          style={{
            color: "#fe2f40",
            fontSize: 14,
            fontFamily: "satoshi-regular",
          }}
        >
          {errors[name].message}
        </Text>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    gap: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f1f3f5",
    fontFamily: "satoshi-medium",
  },
  input: {
    fontSize: 15,
    borderRadius: 15,
    backgroundColor: "#242424",
    paddingHorizontal: 20,
    paddingVertical: 13,
    fontFamily: "satoshi-medium",
    color: "#f1f3f5",
  },
});

export default Input;
