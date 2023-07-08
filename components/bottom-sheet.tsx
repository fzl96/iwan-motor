import { useCallback } from "react";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";

export const BottomSheet = ({
  sheetRef,
  snapPoints,
  handleSheetChanges,
  children,
}) => {
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "#171717" }}
      handleIndicatorStyle={{
        backgroundColor: "#383838",
        marginTop: 5,
        width: 40,
        height: 4,
      }}
    >
      {children}
    </BottomSheetModal>
  );
};
