import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { CustomStack } from "../../components/custom-stack";
import { BottomSheet } from "../../components/bottom-sheet";
import { useCallback, useRef } from "react";
import { useSheet } from "../../hooks/use-sheet";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useRouter } from "expo-router";
import { RoomBottomSheetContent } from "../../components/room-bottom-sheet-content";
import { CustomAlert } from "../../components/custom-alert";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "expo-router";
import { generateKwitansiPDF } from "../../lib/generate-kwitansi";

const ItemDetails = () => {
  const { dismiss } = useBottomSheetModal();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const sheetRef = useRef(null);
  const { points, handleSheetChanges, handlePresentModalPress } = useSheet({
    sheetRef,
    snapPoints: ["20%", "20%"],
  });
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  useFocusEffect(
    useCallback(() => {
      const getItem = async () => {
        const docRef = doc(db, "sales", Array.isArray(id) ? id[0] : id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSale(docSnap.data());
          setLoading(false);
        } else {
          console.log("No such document!");
        }
      };
      getItem();
    }, [id])
  );

  const { generatePdf } = generateKwitansiPDF(sale);

  const handleDelete = async () => {
    if (!sale) return;
    const motorRef = doc(db, "inventory", sale.motor.id);
    const docRef = doc(db, "sales", Array.isArray(id) ? id[0] : id);
    await deleteDoc(docRef);
    await updateDoc(motorRef, {
      stok: sale.motor.sisa_stok + 1,
    });

    setShowAlert(false);
    await deleteDoc(docRef);
    dismiss();
    ToastAndroid.show("Item berhasil dihapus", ToastAndroid.SHORT);
    router.back();
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <CustomStack.Screen
        options={{
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
              overlayStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            };
          },
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#0f0f0f",
          },
          headerBackImage: () => (
            <Feather
              name="arrow-left"
              size={30}
              color="#f1f3f5"
              style={{ marginLeft: 10 }}
            />
          ),
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={1}
              onPress={handlePresentModalPress}
              style={{
                marginRight: 20,
                padding: 3,
                borderRadius: 50,
                borderWidth: 1,
                alignItems: "center",
                justifyContent: "center",
                borderColor: "#f1f3f5",
              }}
            >
              <Feather
                name="more-vertical"
                size={17}
                color="#f1f3f5"
                style={{}}
              />
            </TouchableOpacity>
          ),
        }}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#f1f3f5" />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{
              padding: 20,
              gap: 20,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "satoshi-medium",
                  color: "#f1f3f5",
                }}
              >
                {sale.invoiceId}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "satoshi-medium",
                  color: "#f1f3f5",
                }}
              >
                {sale.tanggal.toDate().toLocaleString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.specsTitle}>Telah diterima dari : </Text>
              <Text style={styles.specsValue}>{sale.diterima}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.specsTitle}>Alamat : </Text>
              <Text style={styles.specsValue}>{sale.alamat}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.specsTitle}>No. HP : </Text>
              <Text style={styles.specsValue}>{sale.noHp}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.specsTitle}>Uang Sejumlah : </Text>
              <Text style={styles.specsValue}>
                {formatter.format(sale.pembayaran)}
              </Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.specsTitle}>Untuk Pembayaran: </Text>
              <Text
                style={styles.specsValue}
              >{`1 Unit Sepeda Motor ${sale.motor.model}`}</Text>
            </View>
            <View style={styles.specContainer}>
              <View style={styles.detailContainer}>
                <Text style={styles.specsTitle}>Type</Text>
                <Text style={styles.specsValue}>{sale.motor.type}</Text>
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.specsTitle}>No. Pol</Text>
                <Text style={styles.specsValue}>{sale.motor.no_polisi}</Text>
              </View>
            </View>
            <View style={styles.specContainer}>
              <View style={styles.detailContainer}>
                <Text style={styles.specsTitle}>No. Rangka</Text>
                <Text style={styles.specsValue}>{sale.motor.no_rangka}</Text>
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.specsTitle}>Tahun</Text>
                <Text style={styles.specsValue}>{sale.motor.tahun}</Text>
              </View>
            </View>
            <View style={styles.specContainer}>
              <View style={styles.detailContainer}>
                <Text style={styles.specsTitle}>No. Mesin</Text>
                <Text style={styles.specsValue}>{sale.motor.no_mesin}</Text>
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.specsTitle}>Warna</Text>
                <Text style={styles.specsValue}>{sale.motor.warna}</Text>
              </View>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.specsTitle}>Keterangan : </Text>
              <Text style={styles.specsValue}>{sale.keterangan ?? ""}</Text>
            </View>
          </ScrollView>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              backgroundColor: "#0f0f0f",
              padding: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                generatePdf();
              }}
              style={{
                backgroundColor: "#252525",
                paddingVertical: 15,
                paddingHorizontal: 20,
                borderRadius: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                // alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: "satoshi-regular",
                  color: "#f1f3f5",
                }}
              >
                Print Kwitansi
              </Text>
              <Feather name="file-text" size={20} color="#f1f3f5" />
            </TouchableOpacity>
          </View>
        </>
      )}

      <CustomAlert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        onPress={handleDelete}
      />
      <BottomSheet
        sheetRef={sheetRef}
        snapPoints={points}
        handleSheetChanges={handleSheetChanges}
      >
        <RoomBottomSheetContent
          onPressDelete={() => setShowAlert(true)}
          onPressEdit={() => {
            dismiss();
            router.push(`sales/edit/${Array.isArray(id) ? id[0] : id}`);
          }}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    gap: 4,
    flex: 1,
  },
  specContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  specsTitle: {
    fontSize: 16,
    fontFamily: "satoshi-regular",
    color: "#f1f3f5",
  },
  specsValue: {
    fontSize: 17,
    fontFamily: "satoshi-medium",
    color: "#f1f3f5",
  },
});

export default ItemDetails;
