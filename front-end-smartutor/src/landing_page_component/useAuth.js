import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
	const history = useNavigate();

	useEffect(() => {
		const user = localStorage.getItem("user");
		if (!user) {
			// Redirect to login if user not found in localStorage
			history("/");
		}
	}, [history]);

	return;
};

export default useAuth;
