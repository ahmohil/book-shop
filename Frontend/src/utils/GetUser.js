const getUser = async (jwt) => {
	const user = await fetch(`${import.meta.env.VITE_API_URL}/get-user`, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
	});

	return user;
};

export default getUser;
