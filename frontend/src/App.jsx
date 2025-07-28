import { Toaster } from "react-hot-toast";
import Sidebar from "./components/common/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/common/Header";

export default function App() {
  return (
		<div className="flex h-screen overflow-auto">
			<Sidebar />
			<div className="flex flex-col grow bg-white">
				<Header />
				<div className="flex-1 justify-center overflow-y-auto bg-gray-50">
					<Toaster position="bottom-center" />
					<AppRoutes />
				</div>
			</div>
		</div>
	);
}