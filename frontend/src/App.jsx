import { Toaster } from "react-hot-toast";
import Sidebar from "./components/common/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/common/Header";

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