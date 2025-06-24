import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { acceptUserAPI, loginAPI } from "../Services/AuthService";
import React from "react";
import axios from "axios";
import { User } from "../Models/User";

type UserContextType = {
  user: User | null;
  token: string | null;
  acceptUser: (token: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    const token = localStorage.getItem("accessToken");

    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }

    setIsReady(true);
  }, []);

  const acceptUser = async (token: string) => {
    await acceptUserAPI(token)
      .then((response) => {
        if (response) {
          localStorage.setItem("accessToken", token);

          const user: User = response.data;
          localStorage.setItem("currentUser", JSON.stringify(user))

          setToken(token!);
          setUser(user!);

          navigate("/");
        }
      })
  };

  const isLoggedIn = () => {
    return !!user;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    setUser(null);
    setToken("");
    navigate("/login");
  };

  return (
    <UserContext.Provider
      value={{ user, token, logout, isLoggedIn, acceptUser }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
