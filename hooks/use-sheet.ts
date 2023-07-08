import { useMemo, useCallback } from "react";

export const useSheet = ({ sheetRef, snapPoints }) => {
  const points = useMemo(() => snapPoints, [snapPoints]);

  const handlePresentModalPress = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return {
    points,
    handlePresentModalPress,
    handleSheetChanges,
  };
};
