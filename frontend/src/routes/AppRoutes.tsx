import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NamesInput from "../pages/NamesInput";
import PersonalRoutes from "./PersonalRoutes";
import Lifestyle from "../pages/Lifestyle";

function AppRoutes () {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/personal" element={<PersonalRoutes />} />  
        <Route path="/input-names" element={<NamesInput />} />  
        <Route path="/lifestyle" element={<Lifestyle />} />  
    </Routes>
    </>
  )
}

export default AppRoutes