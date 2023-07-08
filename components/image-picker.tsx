import { View, Text, StyleSheet, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";

interface PickImageProps {
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  currentImage?: string;
}

const PickImage = ({ image, setImage, currentImage }: PickImageProps) => {
  const getImageName = (uri) => {
    const split = uri.split("/");
    const name = split[split.length - 1];
    const extention = name.split(".")[1];

    // if name is too long, cut it and add "..."
    if (name.length > 20) {
      return `${name.substr(0, 20)}...${extention}`;
    }
    return name;
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <Pressable style={style.button} onPress={pickImage}>
      <View style={style.textContainer}>
        <Feather name="image" size={20} color="#6d6d6d" />
        <Text
          style={[
            style.text,
            {
              color: image || currentImage ? "#f1f3f5" : "#707070",
            },
          ]}
        >
          {image
            ? getImageName(image)
            : currentImage
            ? currentImage
            : "Pilih foto"}
        </Text>
      </View>
    </Pressable>
  );
};

const style = StyleSheet.create({
  button: {
    backgroundColor: "#242424",
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  text: {
    fontFamily: "satoshi-medium",
    fontSize: 14,
  },
});

export default PickImage;
