import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TouchableHighlight,
} from "react-native";
import { CustomStack } from "../../../components/custom-stack";
import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { BottomSheet } from "../../../components/bottom-sheet";
import { MainBottomSheetContent } from "../../../components/main-bottom-sheet-content";
import { useRouter, Link, Tabs } from "expo-router";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { useData } from "../../../hooks/use-data";
import { kwitansi } from "../../../types";
import { generateSalesPDF } from "../../../lib/generate-sales-pdf";

const sales = () => {
  const sheetRef = useRef(null);
  const { sales, loading } = useData();
  const { generatePdf } = generateSalesPDF(sales);
  const { dismiss } = useBottomSheetModal();
  const router = useRouter();
  const snapPoints = useMemo(() => ["20%", "20%"], []);

  const handlePresentModalPress = useCallback(() => {
    sheetRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0f0f0f",
      }}
    >
      <CustomStack.Screen
        options={{
          headerTitle: "Daftar Transaksi",
          headerTitleStyle: {
            color: "#f1f3f5",
            fontSize: 30,
            fontFamily: "satoshi-bold",
          },
          headerShadowVisible: false,
          headerTintColor: "#f1f3f5",
          headerStyle: {
            backgroundColor: "#0f0f0f",
          },
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePresentModalPress}
              disabled={loading}
            >
              <Feather
                name="bar-chart-2"
                size={24}
                color="#f1f3f5"
                style={{
                  transform: [{ rotate: "-90deg" }],
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#f1f3f5"
          style={{
            marginTop: 20,
          }}
        />
      ) : (
        <FlashList
          data={sales}
          estimatedItemSize={100}
          keyExtractor={(item: kwitansi) => item.id}
          renderItem={({ item }: { item: kwitansi }) => (
            <Link
              href={{
                pathname: "sales/[id]",
                params: { id: item.id },
              }}
              asChild={true}
            >
              <TouchableHighlight
                underlayColor={"#252525"}
                activeOpacity={0.7}
                style={{
                  flexDirection: "row",
                  gap: 20,
                  padding: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "#252525",
                  flex: 1,
                }}
              >
                <View style={{ flexDirection: "row", gap: 20 }}>
                  <View style={{ gap: 5 }}>
                    <Text
                      style={{
                        color: "#f1f3f5",
                        fontSize: 16,
                        fontFamily: "satoshi-medium",
                      }}
                    >
                      {item.motor.model}
                    </Text>
                    <Text
                      style={{
                        color: "#555557",
                        fontSize: 15,
                      }}
                    >
                      {item.diterima}
                    </Text>
                    <Text
                      style={{
                        color: "#f1f3f5",
                        fontSize: 15,
                      }}
                    >
                      {item.tanggal.toDate().toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                </View>
              </TouchableHighlight>
            </Link>
          )}
        />
      )}

      <BottomSheet
        sheetRef={sheetRef}
        snapPoints={snapPoints}
        handleSheetChanges={handleSheetChanges}
      >
        <MainBottomSheetContent
          onPressAdd={() => {
            dismiss();
            router.push("sales/create");
          }}
          onPressExport={() => {
            dismiss();
            generatePdf();
          }}
        />
      </BottomSheet>
    </View>
  );
};

export default sales;
