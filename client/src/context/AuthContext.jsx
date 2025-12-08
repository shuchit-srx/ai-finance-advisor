import { createContext, useContext, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        () => JSON.parse(localStorage.getItem("user")) || null
    );
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const { data } = await api.post("/auth/login", { email, password });
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Login failed",
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setLoading(true);
        try {
            const { data } = await api.post("/auth/register", {
                name,
                email,
                password,
            });
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Registration failed",
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider
            value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
