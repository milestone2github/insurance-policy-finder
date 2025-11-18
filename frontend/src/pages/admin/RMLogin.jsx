// RM OAuth

import { useEffect } from "react";
import { SiZoho } from "react-icons/si";
import login from "../../assets/login.png";
import toast from "react-hot-toast";
import logo from "../../assets/mNiveshLogo.png";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const RMLogin = () => {
	// ---------------------------
	// 1. Run login validation on mount
	// ---------------------------
	useEffect(() => {
		async function checkValidLogin() {
			try {
				const res = await axios.get(`${baseUrl}/auth/zoho/getAccessToken`, {
					withCredentials: true,
				});
                
				// console.log("response data:-- ", res.data); // debug
				const isRM = res?.data?.isRM === true;
				localStorage.setItem("isRM", isRM ? "true" : "false");
				// localStorage.setItem("rmId", res?.data?.rmId);

				if (isRM) {
					window.location.replace("/");
				}
			} catch (err) {
				localStorage.setItem("isRM", "false");
			}
		}

		checkValidLogin();
	}, []);

	// ---------------------------
	// 2. Read ?error=... params from callback
	// ---------------------------
	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const error = searchParams.get("error");

		if (!error) return;

		if (error === "permissionDenied") toast.error("Access not allowed");
		else if (error === "InternalServerError") toast.error("Server failure");
		else toast.error("Login failed");
	}, []);

	// ---------------------------
	// 3. If already RM, don't show login page
	// ---------------------------
	const isRM = localStorage.getItem("isRM") === "true";
	if (isRM) return null;

	// ---------------------------
	// 4. Zoho Login redirect
	// ---------------------------
	const handleLoginWithZoho = () => {
		const frontendRedirectUrl = encodeURIComponent(window.location.origin);
		window.location.href = `${baseUrl}/auth/zoho?redirect=${frontendRedirectUrl}`;
	};

	// ---------------------------
	// 5. UI
	// ---------------------------
	return (
		<section className="fixed w-full h-full left-0 z-50 flex justify-center items-center bg-white">
			<div className="login flex mx-12 py-12 sm:py-0 lg:mx-[17rem]">
				<div className="login-page w-full sm:px-3 sm:w-[50%] flex flex-col justify-center items-center">
					<h1 className="text-center text-[28.8px] lg:text-4xl my-auto">
						Welcome to NiveshOnline
					</h1>
					<h3 className="text-center text-md lg:text-2xl my-auto">
						INSURANCE POLICY FINDER PORTAL
					</h3>

					<button
						onClick={handleLoginWithZoho}
						className="text-[16px] flex items-center gap-3 py-1 hover:bg-[#DD5709] hover:text-white px-2 mt-5 text-[#DD5709] border border-[#DD5709] rounded-md"
					>
						<SiZoho className="text-4xl" /> Login with Zoho
					</button>
				</div>

				<div className="hidden px-4 login-img sm:flex items-center justify-center bg-blue-800 w-[50%] rounded-md">
					<img src={login} alt="" />
				</div>
			</div>

			<img src={logo} alt="" className="absolute top-4 right-4 w-44" />
		</section>
	);
};

export default RMLogin;
