import { Routes, Route } from "react-router-dom";
import Personal from "../pages/Personal";
import NamesInput from "../pages/NamesInput";

function PersonalRoutes() {
  return (
    <Routes>
      <Route path="" element={<Personal />} />
      <Route path="names" element={<NamesInput />} />
    </Routes>
  );
}

export default PersonalRoutes;