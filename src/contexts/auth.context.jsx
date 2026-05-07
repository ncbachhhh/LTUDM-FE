import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import UserAPI from "../apis/user.api.jsx";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setUser(null);
        return null;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      const response = await UserAPI.getProfile();

      if (response.isSuccess) {
        console.log("User profile:", response.data);
        setUser(response.data);

        // Lưu userId để chỗ khác dùng nếu cần
        localStorage.setItem(
            "userId",
            response.data.id || response.data.user_id
        );

        return response.data;
      }

      setUser(null);
      return null;
    } catch (error) {
      console.error("Error fetching profile:", error);
      setUser(null);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");

    delete axios.defaults.headers.common["Authorization"];

    setUser(null);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      await getProfile();
      setLoading(false);
    };

    fetchProfile();
  }, []);

  return (
      <AuthContext.Provider
          value={{
            user,
            setUser,
            loading,
            setLoading,
            getProfile,
            logout,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
}