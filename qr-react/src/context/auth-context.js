import { createContext } from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    userId: null,
    userDetails: null,
    token: null,
    login: () => {}, 
    logout: () => {}
});
