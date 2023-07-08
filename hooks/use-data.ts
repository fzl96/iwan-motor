import { useContext } from "react";
import { DataContext } from "../context/data-context";

export const useData = () => {
  const { motor, sales, loading, selectedMotor, setSelectedMotor, merk } =
    useContext(DataContext);

  return {
    motor,
    sales,
    loading,
    selectedMotor,
    setSelectedMotor,
    merk,
  };
};
