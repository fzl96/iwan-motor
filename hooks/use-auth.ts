import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

export const useAuth = () => {
  const { user, isLoggedIn, loading, initialized } = useContext(AuthContext);

  return {
    user,
    isLoggedIn,
    loading,
    initialized,
  };
};
