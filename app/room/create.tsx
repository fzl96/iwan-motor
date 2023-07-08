import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { CustomStack } from "../../components/custom-stack";
import { TransitionPresets } from "@react-navigation/stack";
import { MotorSchema } from "../../config/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { useRef, useState, useMemo } from "react";
import { useSheet } from "../../hooks/use-sheet";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Input from "../../components/input";
import DatePicker from "../../components/date-picker";
import { MaterialIcons, Feather, AntDesign } from "@expo/vector-icons";
import PickImage from "../../components/image-picker";
import { BottomSheet } from "../../components/bottom-sheet";
import { MerkBottomSheetContent } from "../../components/merk-bottom-sheet-content";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useToast } from "react-native-toast-notifications";
import { RotationAnimation } from "../../components/rotation-animation";
import { useData } from "../../hooks/use-data";

const getImageName = (uri) => {
  const uriSplit = uri.split("/");
  const imageName = uriSplit[uriSplit.length - 1].split(".")[0];
  const extention = uriSplit[uriSplit.length - 1].split(".")[1];

  return `${imageName}_${Date.now()}.${extention}`;
};

const Create = () => {
  const router = useRouter();
  const toast = useToast();
  const sheetRef = useRef(null);
  const { merk } = useData();
  const { dismiss } = useBottomSheetModal();
  const { points, handleSheetChanges, handlePresentModalPress } = useSheet({
    sheetRef,
    snapPoints: ["60%", "60%"],
  });
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(MotorSchema),
  });
  const { isSubmitting, errors, isDirty } = formState;
  const [errorsState, setErrorsState] = useState({
    merk: "",
    tanggalMasuk: "",
  });
  const [selectedMerk, setSelectedMerk] = useState({
    id: "",
    name: "",
  });
  const [date, setDate] = useState();
  const [image, setImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const uploadImage = async (uri) => {
    const imageName = getImageName(uri);
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `images/${imageName}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    await uploadTask;

    const url = await getDownloadURL(uploadTask.snapshot.ref);
    return url;
  };

  const onSubmit = async (data) => {
    if (!selectedMerk.id)
      setErrorsState((prev) => ({ ...prev, merk: "Merk harus diisi" }));
    if (!date)
      setErrorsState((prev) => ({
        ...prev,
        tanggalMasuk: "Tanggal masuk harus diisi",
      }));
    let id = toast.show("Data sedang ditambahkan", {
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
    let imageUrl;
    if (image) {
      imageUrl = await uploadImage(image);
    } else {
      imageUrl =
        "https://firebasestorage.googleapis.com/v0/b/wan-mo.appspot.com/o/images%2Fplaceholder.png?alt=media&token=5d9abb9e-49ed-4d38-a322-677c89e5c229";
    }
    const motor = {
      foto: imageUrl,
      merk: selectedMerk.name,
      model: data.model,
      harga_modal: data.modal,
      harga_jual: data.jual,
      stok: data.stok,
      tanggal_masuk: date,
      no_rangka: data.rangka,
      no_mesin: data.mesin,
      no_polisi: data.polisi,
      tahun: data.tahun,
      warna: data.warna,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    router.back();
    const inventoryRef = collection(db, "inventory");
    await addDoc(inventoryRef, motor);
    toast.hide(id);
    toast.show("Data berhasil ditambahkan", {
      type: "custom_type",
      placement: "bottom",
      duration: 1000,
      animationType: "slide-in",
      icon: <Feather name="check" size={18} color="white" />,
    });
  };

  const disabled = useMemo(() => {
    return isSubmitting;
  }, [isSubmitting]);

  return (
    <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
      <CustomStack.Screen
        options={{
          headerTitle: "Tambah",
          headerTitleStyle: {
            color: "#f1f3f5",
            fontSize: 20,
            fontFamily: "satoshi-bold",
          },
          headerShadowVisible: false,
          headerTintColor: "#f1f3f5",
          headerStyle: {
            backgroundColor: "#0f0f0f",
          },
          presentation: "modal",
          ...TransitionPresets.ModalPresentationIOS,
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 20 }}
              activeOpacity={0.7}
              disabled={disabled || !isDirty}
              onPress={handleSubmit(onSubmit)}
            >
              <Text
                style={{
                  color: "#19a2ff",
                  fontSize: 18,
                  fontFamily: "satoshi-medium",
                  opacity: disabled || !isDirty ? 0.5 : 1,
                }}
              >
                Simpan
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 50,
        }}
      >
        <View style={style.form}>
          <View style={{ gap: 5 }}>
            <Text style={style.label}>Pilih Foto (optional)</Text>
            <PickImage image={image} setImage={setImage} />
          </View>
          <View style={{ gap: 5 }}>
            <Text style={style.label}>Merk</Text>
            <Pressable
              style={style.selectContainer}
              onPress={handlePresentModalPress}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "satoshi-medium",
                    color: !selectedMerk.id ? "#707070" : "#f1f3f5",
                  }}
                >
                  {selectedMerk.id ? selectedMerk.name : "Pilih Merk"}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color={!selectedMerk.id ? "#707070" : "#f1f3f5"}
                />
              </View>
            </Pressable>
            {errors.merk && (
              <Text style={{ color: "red", fontSize: 12 }}>
                {errorsState.merk}
              </Text>
            )}
          </View>
          <Input
            label="Model"
            name="model"
            control={control}
            placeholder="Masukkan Nama Model"
            type="text"
            errors={errors}
          />
          <Input
            label="Harga Modal"
            name="modal"
            control={control}
            placeholder="Masukkan Harga Modal"
            type="numeric"
            errors={errors}
          />
          <Input
            label="Harga Jual"
            name="jual"
            control={control}
            placeholder="Masukkan Harga Jual"
            type="numeric"
            errors={errors}
          />
          <Input
            label="Stok"
            name="stok"
            control={control}
            placeholder="Masukkan Jumlah Stok"
            type="numeric"
            errors={errors}
          />
          <View style={{ gap: 5 }}>
            <Text style={style.label}>Tanggal Masuk</Text>
            <DatePicker date={date} setDate={setDate} />
            {errors.tanggalMasuk && (
              <Text style={{ color: "red", fontSize: 12 }}>
                {errorsState.tanggalMasuk}
              </Text>
            )}
          </View>
          <Input
            label="No. Rangka"
            name="rangka"
            control={control}
            placeholder="Masukkan No. Rangka"
            type="text"
            errors={errors}
          />
          <Input
            label="No. Mesin"
            name="mesin"
            control={control}
            placeholder="Masukkan No. Mesin"
            type="text"
            errors={errors}
          />
          <Input
            label="No. Polisi"
            name="polisi"
            control={control}
            placeholder="Masukkan No. Polisi"
            type="text"
            errors={errors}
          />
          <Input
            label="Tahun"
            name="tahun"
            control={control}
            placeholder="Masukkan Tahun"
            type="numeric"
            errors={errors}
          />
          <Input
            label="Warna"
            name="warna"
            control={control}
            placeholder="Masukkan Warna"
            type="text"
            errors={errors}
          />
        </View>
      </ScrollView>

      <BottomSheet
        sheetRef={sheetRef}
        snapPoints={points}
        handleSheetChanges={handleSheetChanges}
      >
        {merk && (
          <MerkBottomSheetContent
            merk={merk}
            setSelectedMerk={setSelectedMerk}
            dismiss={dismiss}
          />
        )}
      </BottomSheet>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f1f3f5",
    fontFamily: "satoshi-medium",
  },
  contentContainer: {
    alignItems: "center",
  },
  itemContainer: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  itemText: {
    fontSize: 16,
    fontFamily: "satoshi-regular",
  },
  form: {
    gap: 15,
    padding: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: "blue",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerBtn: {
    marginRight: 10,
    color: "white",
    borderRadius: 50,
    padding: 4,
    borderWidth: 1,
    alignItems: "center",
  },
  searchContainer: {
    backgroundColor: "#242424",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 20,
  },
  searchInput: {
    fontFamily: "satoshi-regular",
    fontSize: 16,
    width: "100%",
  },
  selectContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#242424",
    borderRadius: 15,
  },
});

export default Create;
