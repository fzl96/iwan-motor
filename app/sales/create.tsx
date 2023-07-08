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
import { salesSchema } from "../../config/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { useRef, useState, useEffect, useMemo } from "react";
import { useSheet } from "../../hooks/use-sheet";
import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Input from "../../components/input";
import { MaterialIcons, Feather, AntDesign } from "@expo/vector-icons";
import { BottomSheet } from "../../components/bottom-sheet";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useToast } from "react-native-toast-notifications";
import { RotationAnimation } from "../../components/rotation-animation";
import { useData } from "../../hooks/use-data";
import { MotorBottomSheetContent } from "../../components/motor-bottom-sheet-content";

const Create = () => {
  const toast = useToast();
  const { motor } = useData();
  const { dismiss } = useBottomSheetModal();
  const router = useRouter();
  const sheetRef = useRef(null);
  const { points, handleSheetChanges, handlePresentModalPress } = useSheet({
    sheetRef,
    snapPoints: ["50%", "50%"],
  });
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(salesSchema),
  });
  const { isSubmitting, errors, isDirty } = formState;
  const [motorError, setMotorError] = useState("");
  const [selectedMotor, setSelectedMotor] = useState({
    id: "",
    foto: "",
    merk: "",
    model: "",
    harga_modal: 0,
    harga_jual: 0,
    stok: 0,
    tanggal_masuk: "",
    no_rangka: "",
    no_mesin: "",
    no_polisi: "",
    tahun: 0,
    warna: "",
  });

  useEffect(() => {
    setMotorError("");
  }, [selectedMotor]);

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}${month < 10 ? `0${month}` : month}${
      day < 10 ? `0${day}` : day
    }`;
  };

  const onSubmit = async (data) => {
    if (!selectedMotor.id) {
      setMotorError("Motor harus diisi");
      return;
    }

    if (selectedMotor.stok === 0) {
      setMotorError("Stok kosong");
      return;
    }

    if (selectedMotor.harga_jual > data.pembayaran) {
      toast.show("Pembayaran kurang", {
        type: "custom_type",
        placement: "bottom",
        duration: 2000,
        animationType: "slide-in",
        icon: <Feather name="x" size={18} color="white" />,
      });
      return;
    }

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
    const date = new Date();
    const tanggal = formatDate(date);
    const salesRef = collection(db, "sales");
    const count = await getCountFromServer(salesRef).then(
      (data) => data.data().count
    );
    const salesId = `INV-${tanggal}-${
      count < 10
        ? `000${count + 1}`
        : count < 100
        ? `00${count + 1}`
        : count + 1
    }`;

    const sales = {
      ...data,
      invoiceId: salesId,
      tanggal: date,
      updatedAt: date,
      motor: {
        id: selectedMotor.id,
        type: selectedMotor.merk,
        model: selectedMotor.model,
        harga_jual: selectedMotor.harga_jual,
        tanggal_masuk: selectedMotor.tanggal_masuk,
        no_rangka: selectedMotor.no_rangka,
        no_mesin: selectedMotor.no_mesin,
        no_polisi: selectedMotor.no_polisi,
        tahun: selectedMotor.tahun,
        warna: selectedMotor.warna,
        sisa_stok: selectedMotor.stok - 1,
        harga_beli: selectedMotor.harga_modal,
      },
    };
    await addDoc(salesRef, sales);
    const motorRef = doc(db, "inventory", selectedMotor.id);
    await updateDoc(motorRef, {
      stok: selectedMotor.stok - 1,
    });
    router.back();
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.form}>
          <View style={{ gap: 5 }}>
            <Text style={style.label}>Motor</Text>
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
                    fontSize: 15,
                    color: selectedMotor.id ? "#f1f3f5" : "#707070",
                  }}
                >
                  {selectedMotor.id ? selectedMotor.model : "Pilih motor"}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color={selectedMotor.id ? "#f1f3f5" : "#707070"}
                />
              </View>
            </Pressable>
            {selectedMotor.id && (
              <View
                style={{
                  marginTop: 5,
                  marginLeft: 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "satoshi-medium",
                    fontSize: 15,
                    color: "#f1f3f5",
                  }}
                >
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(selectedMotor.harga_jual)}
                </Text>
                <Text
                  style={{
                    fontFamily: "satoshi-medium",
                    fontSize: 15,
                    color: selectedMotor.stok === 0 ? "#fe2f40" : "#f1f3f5",
                  }}
                >
                  Stok: {selectedMotor.stok}
                </Text>
              </View>
            )}
            {motorError && (
              <Text
                style={{
                  color: "#fe2f40",
                  fontSize: 14,
                  fontFamily: "satoshi-regular",
                }}
              >
                {motorError}
              </Text>
            )}
          </View>
          <Input
            label="Diterima"
            name="diterima"
            control={control}
            placeholder="Masukkan Nama Penerima"
            type="text"
            errors={errors}
          />
          <Input
            label="Alamat"
            name="alamat"
            control={control}
            placeholder="Masukkan Alamat Penerima"
            type="text"
            errors={errors}
          />
          <Input
            label="No. HP"
            name="noHp"
            control={control}
            placeholder="Masukkan No. HP Penerima"
            type="text"
            errors={errors}
          />
          <Input
            label="Uang Sejumlah"
            name="pembayaran"
            control={control}
            placeholder="Masukkan Jumlah Uang"
            type="numeric"
            errors={errors}
          />
          <Input
            label="Catatan (optional)"
            name="keterangan"
            control={control}
            placeholder="Masukkan catatan"
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
        {motor && (
          <MotorBottomSheetContent
            motor={motor}
            setSelectedMotor={setSelectedMotor}
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
