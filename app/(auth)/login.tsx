import { View, Text, KeyboardAvoidingView } from "react-native";
import { useController, useForm } from "react-hook-form";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomStack } from "../../components/custom-stack";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

const Input = ({ label, name, control, placeholder, icon, type }) => {
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const { field } = useController({
    control,
    defaultValue: "",
    name,
  });

  return (
    <View
      style={{
        padding: 15,
        backgroundColor: "#121212",
        flexDirection: "row",
        gap: 15,
        alignItems: "center",
        borderRadius: 15,
        borderColor: "#353535",
        borderWidth: 1,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          flex: 1,
          overflow: "hidden",
        }}
      >
        {icon}
        <TextInput
          secureTextEntry={type === "password" && isPasswordSecure}
          placeholder={placeholder}
          value={field.value}
          onChangeText={field.onChange}
          placeholderTextColor={"#707070"}
          keyboardType={type === "email" ? "email-address" : "default"}
          style={{
            fontFamily: "satoshi-medium",
            fontSize: 16,
            color: "#f1f3f5",
            width: "100%",
          }}
        />
      </View>
      {type === "password" && (
        <TouchableOpacity onPress={() => setIsPasswordSecure((prev) => !prev)}>
          <Feather name="eye" size={22} color="#707070" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const Login = () => {
  const router = useRouter();

  const { control, handleSubmit, watch } = useForm();
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [watch("email"), watch("password")]);

  const onSubmit = async (data) => {
    if (!data.email || !data.password) {
      setError("Email atau password salah");
      return;
    }
    try {
      const { email, password } = data;
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/home");
    } catch (error) {
      if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/wrong-password"
      ) {
        setError("Email atau password salah");
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <CustomStack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View
        style={{
          padding: 40,
          gap: 100,
          flex: 1,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 40,
              fontFamily: "satoshi-bold",
              color: "#f1f3f5",
            }}
          >
            LOGIN
          </Text>
          <Text
            style={{
              fontSize: 40,
              fontFamily: "satoshi-bold",
              color: "#f1f3f5",
            }}
          >
            IWAN MOTOR
          </Text>
        </View>
        <KeyboardAvoidingView>
          <View style={{ gap: 10 }}>
            <Input
              label="Email"
              name="email"
              control={control}
              placeholder="Email"
              type="email"
              icon={<Feather name="user" size={20} color="#707070" />}
            />
            <Input
              type="password"
              label="Password"
              name="password"
              control={control}
              placeholder="Password"
              icon={<Feather name="lock" size={20} color="#707070" />}
            />
            {error && (
              <Text
                style={{
                  color: "#fe2f40",
                  fontFamily: "satoshi-medium",
                  fontSize: 14,
                }}
              >
                {error}
              </Text>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          paddingHorizontal: 40,
          paddingVertical: 20,
        }}
      >
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
          style={{
            backgroundColor: "#f1f3f5",
            padding: 15,
            alignItems: "center",
            borderRadius: 15,
          }}
        >
          <Text
            style={{
              fontFamily: "satoshi-bold",
              fontSize: 16,
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;
