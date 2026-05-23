import { createContext, useContext, useEffect, useState } from "react";
import UserAPI from "../apis/user.api.jsx";
import WebSocketAPI from "../apis/websocket.api.jsx";
import { STORAGE_KEYS } from "../constants/storage.constants.js";
import { clearStoredAuth, getValidAccessToken, hasStoredAuth } from "../helpers/token.helper.js";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      if (!hasStoredAuth()) {
        setUser(null);
        return null;
      }

      await getValidAccessToken();
      const response = await UserAPI.getProfile();

      if (response.isSuccess) {
        console.log("User profile:", response.data);
        setUser(response.data);

        // Lưu userId để chỗ khác dùng nếu cần
        localStorage.setItem(
            STORAGE_KEYS.userId,
            response.data.id || response.data.user_id
        );

        return response.data;
      }

      setUser(null);
      return null;
    } catch (error) {
      console.error("Error fetching profile:", error);
      clearStoredAuth();
      setUser(null);
      return null;
    }
  };

  const logout = async () => {
    await WebSocketAPI.disconnect();
    await UserAPI.logout();

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
