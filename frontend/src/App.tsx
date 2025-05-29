import Sidebar from "./components/common/Sidebar";
import AppRoutes from "./routes/AppRoutes";

export default function App() {

  return (
		<div className="flex h-screen">
			<Sidebar />
			<div className="flex-grow overflow-auto bg-gray-50">
				<AppRoutes />
			</div>
		</div>
	);
}