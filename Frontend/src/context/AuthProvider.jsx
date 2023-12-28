import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import getUser from "../utils/GetUser";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(async () => {
		const fetchUser = async () => {
			if (!jwt) {
				navigate("/login");
				return;
			}

			try {
				const res = await getUser(jwt);

				if (res.status === 400) {
					navigate("/login");
					return;
				}

				const userData = await res.json();
				setUser(userData.user);
				setIsLoggedIn(true);
			} catch (error) {
				console.error("Error fetching user:", error);
				navigate("/login");
			}
		};
		console.log(user);
		fetchUser();
	}, []);

	const login = (user, jwt) => {
		setUser(user);
		setIsLoggedIn(true);
		Cookies.set("jwt", jwt);
	};

	const logout = () => {
		setIsLoggedIn(false);
		setUser(null);

		Cookies.remove("jwt");
	};

	return <AuthContext.Provider value={{ user, isLoggedIn }}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
	return useContext(AuthContext);
};
