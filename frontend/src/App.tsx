import Sidebar from "./components/common/Sidebar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <AppRoutes />
    </div>
  )}
      {/* <ProfileButton
        key={1}
        profileType={"son"}
        label={"Son"}
        selected={false}
        count={count}
        onSelect={() => alert("User selected")}
        onCountChange={(delta) => {
          setCount((prev) => prev + delta)
        }}
      />
      <ProfileButton
        key={2}
        profileType={"father"}
        label={"Father"}
        selected={false}
        onSelect={() => alert("User selected")}
        onCountChange={(delta) => {
          setCount((prev) => prev + delta)
        }}
      />
    // <BrowserRouter>
    //   <Home />
    //   <Routes>
    //     {renderRoutes(AppRoutes)}
    //   </Routes>
    //   </BrowserRouter>
  ) */}

export default App
