import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { CustomStack } from "../../../components/custom-stack";
import { BottomSheet } from "../../../components/bottom-sheet";
import { useCallback, useRef } from "react";
import { useSheet } from "../../../hooks/use-sheet";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { getDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useRouter } from "expo-router";
import { RoomBottomSheetContent } from "../../../components/room-bottom-sheet-content";
import { CustomAlert } from "../../../components/custom-alert";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useData } from "../../../hooks/use-data";
import { useFocusEffect } from "expo-router";

const ItemDetails = () => {
  const { setSelectedMotor } = useData();
  const { dismiss } = useBottomSheetModal();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [motor, setMotor] = useState(null);
  const [loading, setLoading] = useState(false);
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
        setLoading(true);
        const docRef = doc(db, "inventory", Array.isArray(id) ? id[0] : id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMotor(docSnap.data());
          setLoading(false);
          setSelectedMotor(docSnap.data());
        } else {
          console.log("No such document!");
        }
      };
      getItem();
    }, [id])
  );

  const handleDelete = async () => {
    const docRef = doc(db, "inventory", Array.isArray(id) ? id[0] : id);
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
        <View>
          <Image
            source={{ uri: motor?.foto }}
            style={{
              height: 350,
              // width: "100%",
              resizeMode: "cover",
              margin: 20,
              borderRadius: 15,
            }}
          />
          <View
            style={{
              marginHorizontal: 20,
              paddingBottom: 20,
              gap: 5,
              borderBottomColor: "#252525",
              borderBottomWidth: 1,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontFamily: "satoshi-bold",
                color: "#f1f3f5",
              }}
            >
              {motor?.model}
            </Text>
            <Text
              style={{
                fontSize: 17,
                fontFamily: "satoshi-regular",
                color: "#f1f3f5",
              }}
            >
              {motor?.merk} {motor?.tahun}
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "satoshi-bold",
                color: "#f1f3f5",
              }}
            >
              {formatter.format(motor?.harga_jual)}
            </Text>
          </View>
          <View style={{ marginTop: 15, marginHorizontal: 20, gap: 10 }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "satoshi-bold",
                color: "#f1f3f5",
              }}
            >
              Keterangan
            </Text>

            <ScrollView
              contentContainerStyle={{
                gap: 10,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.specsTitle}>Tahun</Text>
                  <Text style={styles.specsValue}>{motor?.tahun}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.specsTitle}>Warna</Text>
                  <Text style={styles.specsValue}>{motor?.warna}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.specsTitle}>Tanggal Masuk</Text>
                  <Text style={styles.specsValue}>
                    {new Date(
                      motor?.tanggal_masuk?.toDate()
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.specsTitle}>Jumlah Stok</Text>
                  <Text style={styles.specsValue}>{motor?.stok} Unit</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.specsTitle}>No. Mesin</Text>
                  <Text style={styles.specsValue}>{motor?.no_mesin}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.specsTitle}>No. Polisi</Text>
                  <Text style={styles.specsValue}>{motor?.no_polisi}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
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
            router.push(`room/edit/${Array.isArray(id) ? id[0] : id}`);
          }}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  specsTitle: {
    fontSize: 15,
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
