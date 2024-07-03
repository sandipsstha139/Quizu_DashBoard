"use client";
import ApiRequest from "@/utils/apiRequest";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken && storedToken.length > 0) {
        setToken(JSON.parse(storedToken));
        setIsAuthenticated(true);
      }
      if (!storedToken) {
        setIsAuthenticated(false);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await ApiRequest.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res?.data?.data?.user);
        setIsAuthenticated(true);
      } catch (error) {
        setUser({});
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    if (token && isAuthenticated) {
      fetchUser();
    }
  }, [token, isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        loading,
        setLoading,
        token,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
