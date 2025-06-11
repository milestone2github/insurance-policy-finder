import { Toaster } from "react-hot-toast";
import Sidebar from "./components/common/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/common/Header";

// export default function App() {

//   return (
// 		<div className="flex h-screen">
// 			<Sidebar />
// 			<div className="flex-grow overflow-auto bg-gray-50">
// 				<Toaster position="bottom-center" />
// 				<AppRoutes />
// 			</div>
// 		</div>
// 	);
// }

// export default function App() {
// 	return (
// 		<div className="flex h-screen">
// 			<Sidebar />

// 			<div className="flex-grow flex flex-col overflow-auto bg-white">
// 				{/* Top Bar */}
// 				<div className="w-full">
// 					{/* Dark blue bar (header) */}
// 					<div className="h-6 bg-[#1F2937]" />
// 					{/* Orange line (progress bar placeholder) */}
// 					<div className="h-1 bg-orange-500 w-1/5" />
// 				</div>

// 				{/* Main Content */}
// 				<div className="flex-grow overflow-auto bg-gray-50">
// 					<Toaster position="bottom-center" />
// 					<AppRoutes />
// 				</div>
// 			</div>
// 		</div>
// 	);

export default function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow flex flex-col overflow-auto bg-white">
        <Header />
        <div className="flex-grow overflow-auto bg-gray-50">
          <Toaster position="bottom-center" />
          <AppRoutes />
        </div>
      </div>
    </div>
  );
}