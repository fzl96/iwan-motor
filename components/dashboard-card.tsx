import { View, Text, StyleSheet } from "react-native";

export const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <View style={style.container}>
      <View
        style={{
          backgroundColor: color,
          borderRadius: 10,
          padding: 10,
        }}
      >
        {icon}
      </View>
      <View style={style.textContainer}>
        <Text style={style.title}>{title}</Text>
        <Text style={style.value}>{value}</Text>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: "#1e1e1e",
    alignItems: "flex-start",
    borderRadius: 10,
    padding: 15,
    gap: 10,
    flex: 1,
  },
  iconContainer: {},
  icon: {
    width: 30,
    height: 30,
  },
  textContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 5,
  },
  title: {
    color: "#f1f3f5",
    fontFamily: "satoshi-medium",
    fontSize: 15,
  },
  value: {
    color: "#f1f3f5",
    fontFamily: "satoshi-bold",
    fontSize: 19,
  },
});
