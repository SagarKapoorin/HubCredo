import { useMemo, useState, type ReactNode } from "react";
import { apiClient } from "../lib/apiClient";
import { AuthContext, type AuthContextValue, type LoginPayload, type SignupPayload, type User } from "./auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (payload: LoginPayload) => {
    try {
      setLoading(true);
      const response = await apiClient.post<User>("/api/auth/login", payload);
      setUser(response.data);
    } catch (error: unknown) {
      let message = "Request failed";
      if (typeof error === "object" && error !== null && "response" in error) {
        const anyError = error as { response?: { data?: unknown } };
        const data = anyError.response?.data;
        if (typeof data === "string") {
          message = data;
        } else if (data && typeof data === "object" && "message" in data && typeof (data as { message?: unknown }).message === "string") {
          message = (data as { message: string }).message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload: SignupPayload) => {
    try {
      setLoading(true);
      const response = await apiClient.post<User>("/api/auth/signup", payload);
      setUser(response.data);
    } catch (error: unknown) {
      let message = "Request failed";
      if (typeof error === "object" && error !== null && "response" in error) {
        const anyError = error as { response?: { data?: unknown } };
        const data = anyError.response?.data;
        if (typeof data === "string") {
          message = data;
        } else if (data && typeof data === "object" && "message" in data && typeof (data as { message?: unknown }).message === "string") {
          message = (data as { message: string }).message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      signup,
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
