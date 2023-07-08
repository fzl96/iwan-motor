import { Animated, Easing } from "react-native";

export const RotationAnimation = ({ children }) => {
  const animatedValue = new Animated.Value(0);
  const startAnimation = () => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  // Call the startAnimation function to start the animation
  startAnimation();

  return (
    <Animated.View
      style={{
        transform: [
          {
            rotate: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", "360deg"],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
};
