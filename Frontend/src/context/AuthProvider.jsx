import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import getUser from "../utils/GetUser";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			const jwt = Cookies.get("jwt");
			if (!jwt) {
				return;
			}

			try {
				const res = await getUser(jwt);

				if (res.status === 400) {
					return;
				}

				const userData = await res.json();
				setUser(userData.user);
				setIsLoggedIn(true);
			} catch (error) {
				console.error("Error fetching user:", error);
				return;
			}
		};
		console.log(user);
		fetchUser();
	}, []);

	const login = (user, jwt) => {
		console.log(user);
		Cookies.set("jwt", jwt);
		setUser(user);
		setIsLoggedIn(true);
	};

	const logout = () => {
		setIsLoggedIn(false);
		setUser(null);

		Cookies.remove("jwt");
	};

	return <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
	return useContext(AuthContext);
};

export { AuthProvider, useAuth };
