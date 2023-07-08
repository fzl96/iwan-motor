import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { CustomStack } from "../../../components/custom-stack";
import { TransitionPresets } from "@react-navigation/stack";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useEffect, useMemo } from "react";
import { useSheet } from "../../../hooks/use-sheet";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Input from "../../../components/input";
import DatePicker from "../../../components/date-picker";
import { MaterialIcons, Feather, AntDesign } from "@expo/vector-icons";
import PickImage from "../../../components/image-picker";
import { BottomSheet } from "../../../components/bottom-sheet";
import { MerkBottomSheetContent } from "../../../components/merk-bottom-sheet-content";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useToast } from "react-native-toast-notifications";
import { RotationAnimation } from "../../../components/rotation-animation";
import { useData } from "../../../hooks/use-data";
import { MotorUpdateSschema } from "../../../config/schema";

type DataForm = {
  foto?: string;
  model: string;
  harga_modal: number;
  harga_jual: number;
  stok: number;
  tanggal_masuk: Date;
  no_rangka: string;
  merk: string;
  no_mesin: string;
  no_polisi: string;
  tahun: number;
  warna: string;
  updatedAt: Date;
};

const EditItem = () => {
  const { id: motorId } = useLocalSearchParams();
  const { selectedMotor, merk } = useData();
  const router = useRouter();
  const toast = useToast();
  const sheetRef = useRef(null);
  const { dismiss } = useBottomSheetModal();
  const { points, handleSheetChanges, handlePresentModalPress } = useSheet({
    sheetRef,
    snapPoints: ["60%", "60%"],
  });
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(MotorUpdateSschema),
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
  const [date, setDate] = useState<Date>();
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  const getImageName = (uri) => {
    const uriSplit = uri.split("/");
    const imageName = uriSplit[uriSplit.length - 1].split(".")[0];
    const extention = uriSplit[uriSplit.length - 1].split(".")[1];

    // return image name + _ + timestamp
    return `${imageName}_${Date.now()}.${extention}`;
  };

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

  const getImageNameFromLink = (link: string) => {
    const startIndex = link.lastIndexOf("/") + 1;
    const endIndex = link.indexOf("?");

    if (startIndex === -1 || endIndex === -1) {
      return null; // Invalid link format
    }

    const encodedImageName = link.substring(startIndex, endIndex);
    const decodedImageName = decodeURIComponent(encodedImageName);

    const name = decodedImageName.split("/")[1];
    const extention = decodedImageName.split(".")[1];

    if (name.length > 20) {
      return `${name.substr(0, 20)}...${extention}`;
    }
    return name;
  };

  useEffect(() => {
    if (!selectedMotor) return;
    const imageName = getImageNameFromLink(selectedMotor.foto);
    setCurrentImage(imageName);
    setSelectedMerk({
      id: "placeholder",
      name: selectedMotor.merk,
    });
    const date = new Date(selectedMotor.tanggal_masuk.toDate());
    setDate(date);
  }, [selectedMotor]);

  const onSubmit = async (data) => {
    let id = toast.show("Mengupdate...", {
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
    if (!selectedMerk.id) {
      setErrorsState((prev) => ({ ...prev, merk: "Merk harus diisi" }));
    }
    if (!date) {
      setErrorsState((prev) => ({
        ...prev,
        tanggalMasuk: "Tanggal masuk harus diisi",
      }));
    }

    const dataToUpdate: DataForm = {
      model: data.model,
      harga_modal: parseInt(data.modal),
      harga_jual: parseInt(data.jual),
      merk: selectedMerk.name,
      stok: parseInt(data.stok),
      tanggal_masuk: date,
      no_rangka: data.rangka,
      no_mesin: data.mesin,
      no_polisi: data.polisi,
      tahun: parseInt(data.tahun),
      warna: data.warna,
      updatedAt: new Date(),
    };

    let imageUrl;
    if (image) {
      imageUrl = await uploadImage(image);
      dataToUpdate.foto = imageUrl;
    }

    const docRef = doc(
      db,
      "inventory",
      Array.isArray(motorId) ? motorId[0] : motorId
    );
    await updateDoc(docRef, dataToUpdate);
    router.back();
    toast.hide(id);
    toast.show("Data diupdate", {
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

  const dirty = useMemo(() => {
    const currentImage = getImageNameFromLink(selectedMotor?.foto);
    const currentMerk = selectedMotor?.merk;
    const currentTanggalMasuk = new Date(selectedMotor?.tanggal_masuk.toDate());

    return (
      isDirty ||
      currentImage !== image ||
      currentMerk !== selectedMerk.name ||
      new Date(date).getTime() !== currentTanggalMasuk.getTime()
    );
  }, [isDirty, image, selectedMerk, date]);

  return (
    <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
      <CustomStack.Screen
        options={{
          headerTitle: "Edit",
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
              disabled={disabled || !dirty}
              onPress={handleSubmit(onSubmit)}
            >
              <Text
                style={{
                  color: "#19a2ff",
                  fontSize: 18,
                  fontFamily: "satoshi-medium",
                  opacity: disabled || !dirty ? 0.5 : 1,
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
            <PickImage
              image={image}
              setImage={setImage}
              currentImage={currentImage}
            />
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
            currentValue={selectedMotor.model}
          />
          <Input
            label="Harga Modal"
            name="modal"
            control={control}
            placeholder="Masukkan Harga Modal"
            type="numeric"
            errors={errors}
            currentValue={selectedMotor.harga_modal}
          />
          <Input
            label="Harga Jual"
            name="jual"
            control={control}
            placeholder="Masukkan Harga Jual"
            type="numeric"
            errors={errors}
            currentValue={selectedMotor.harga_jual}
          />
          <Input
            label="Stok"
            name="stok"
            control={control}
            placeholder="Masukkan Jumlah Stok"
            type="numeric"
            errors={errors}
            currentValue={selectedMotor.stok}
          />
          <View style={{ gap: 5 }}>
            <Text style={style.label}>Tanggal Masuk</Text>
            <DatePicker
              date={selectedMotor.tanggal_masuk.toDate()}
              setDate={setDate}
            />
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
            currentValue={selectedMotor.no_rangka}
          />
          <Input
            label="No. Mesin"
            name="mesin"
            control={control}
            placeholder="Masukkan No. Mesin"
            type="text"
            errors={errors}
            currentValue={selectedMotor.no_mesin}
          />
          <Input
            label="No. Polisi"
            name="polisi"
            control={control}
            placeholder="Masukkan No. Polisi"
            type="text"
            errors={errors}
            currentValue={selectedMotor.no_polisi}
          />
          <Input
            label="Tahun"
            name="tahun"
            control={control}
            placeholder="Masukkan Tahun"
            type="numeric"
            errors={errors}
            currentValue={selectedMotor.tahun}
          />
          <Input
            label="Warna"
            name="warna"
            control={control}
            placeholder="Masukkan Warna"
            type="text"
            errors={errors}
            currentValue={selectedMotor.warna}
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

export default EditItem;
