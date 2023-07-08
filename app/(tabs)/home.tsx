import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  TouchableHighlight,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { useData } from "../../hooks/use-data";
import { useMemo } from "react";
import { DashboardCard } from "../../components/dashboard-card";
import { Feather } from "@expo/vector-icons";

const Home = () => {
  const { sales, loading, motor } = useData();
  const formatter = useMemo(() => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
  }, []);

  const total = useMemo(() => {
    return sales.reduce((acc, curr) => {
      return acc + curr.motor.harga_jual;
    }, 0);
  }, [sales]);

  const totalSpend = useMemo(() => {
    return sales.reduce((acc, curr) => {
      return acc + curr.motor.harga_beli;
    }, 0);
  }, [sales]);

  const stocks = useMemo(() => {
    return motor.reduce((acc, curr) => {
      return acc + curr.stok;
    }, 0);
  }, [motor]);

  const formattedCurrency = (value) => {
    if (value >= 10000000000) {
      return `Rp ${(value / 1000000000).toFixed(2)} M`;
    }

    return formatter.format(value);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 20,
        }}
      >
        <Text
          style={{ color: "white", fontSize: 25, fontFamily: "satoshi-bold" }}
        >
          {new Date().toLocaleString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size={"large"} color={"#f1f3f5"} />
          </View>
        ) : (
          <View style={{ gap: 20 }}>
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 15,
                }}
              >
                <DashboardCard
                  title={"Kas Masuk"}
                  value={formattedCurrency(total)}
                  color={"#26c667"}
                  icon={
                    <Feather name="dollar-sign" size={24} color="#f1f3f5" />
                  }
                />
                <DashboardCard
                  title={"Kas Keluar"}
                  value={formattedCurrency(totalSpend)}
                  color={"#ef4b56"}
                  icon={
                    <Feather name="dollar-sign" size={24} color="#f1f3f5" />
                  }
                />
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 15,
                  marginTop: 15,
                }}
              >
                <DashboardCard
                  title={"Total Penjualan"}
                  value={sales.length}
                  color={"#7c7ff3"}
                  icon={
                    <Feather name="shopping-cart" size={24} color="#f1f3f5" />
                  }
                />
                <DashboardCard
                  title={"Stok Barang"}
                  value={stocks}
                  color={"#ce359a"}
                  icon={<Feather name="archive" size={24} color="#f1f3f5" />}
                />
              </View>
            </View>
            <View
              style={{
                gap: 10,
              }}
            >
              <Text style={{ color: "#696969" }}>Transaksi terakhir</Text>
              <View
                style={{
                  borderRadius: 10,
                  backgroundColor: "#1f1f1f",
                }}
              >
                {sales
                  .sort((a, b) => b.tanggal.toDate() - a.tanggal.toDate())
                  .slice(0, 3)
                  .map((item, index) => (
                    <Link
                      key={item.id}
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
                          // gap: 20,
                          // padding: 10,
                          borderBottomWidth: index === sales.length - 1 ? 0 : 1,
                          borderBottomColor: "#252525",
                          flex: 1,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 20,
                            padding: 15,
                          }}
                        >
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
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "baseline",
                                gap: 1,
                              }}
                            >
                              <Text
                                style={{
                                  color: "#f1f3f5",
                                  fontSize: 15,
                                }}
                              >
                                {item.tanggal
                                  .toDate()
                                  .toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}{" "}
                                ,{" "}
                              </Text>
                              <Text
                                style={{
                                  color: "#696969",
                                  fontSize: 15,
                                }}
                              >
                                {item.diterima}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableHighlight>
                    </Link>
                  ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
export default Home;
