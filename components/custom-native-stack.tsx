import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { withLayoutContext } from "expo-router";

const { Navigator } = createNativeStackNavigator();

export const CustomNativeStack = withLayoutContext<
  NativeStackNavigationOptions,
  typeof Navigator
>(Navigator);
