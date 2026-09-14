import React, { createContext, ReactNode, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = user !== null;

const login = (userData: User) => {
  setUser(userData);
};

const logout = () => {
  setUser(null);
};

  return (
    <AuthContext.Provider
       value={{
          user,
          isAuthenticated,
          login,
          logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}