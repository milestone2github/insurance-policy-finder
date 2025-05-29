import { NavLink, useLocation } from "react-router-dom";

const steps = [
  { label: "Personal", path: "/" },
  { label: "Lifestyle", path: "/lifestyle" },
  { label: "Medical/health conditions", path: "/medical-history" },
  { label: "Existing policy", path: "/policies" },
  { label: "Review", path: "/review" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-60 p-6 border-r bg-white h-full border border-transparent">
      <h1 className="text-xl font-bold mb-10 leading-tight">
        <span className="text-green-600">mNivesh</span>
      </h1>
      <ol className="space-y-4">
        {steps.map((step, i) => {
          const isActive = location.pathname.startsWith(step.path) || (step.path === "/" && location.pathname === "/");

          return (
            <li key={i} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isActive ? "bg-green-500" : "border border-gray-400"}`} />
              <NavLink
                to={step.path}
                className={`${isActive ? "text-green-600 font-semibold" : "text-gray-600"}`}
              >
                {step.label}
              </NavLink>
            </li>
          );
        })}
      </ol>
    </aside>
  );
};

export default Sidebar;


// const Sidebar = () => {
//   const steps = ["Personal", "Lifestyle", "Medical/health conditions", "Existing policy", "Review"];
//     return (
//       <aside className="w-60 p-6 border-r bg-white h-full">
//         <h1 className="text-xl font-bold mb-10 leading-tight">
//           Seshak<br /><span className="text-green-600">TruMatch</span>
//         </h1>
//         <ol className="space-y-4">
//           {steps.map((step, i) => (
//             <li key={i} className="flex items-center space-x-2">
//               <div className={`w-3 h-3 rounded-full ${i === currentStep ? "bg-green-500" : "border border-gray-400"}`} />
//               <span className={`${i === currentStep ? "text-green-600 font-semibold" : "text-gray-600"}`}>{step}</span>
//             </li>
//           ))}
//         </ol>
//       </aside>
//     );
// }

// export default Sidebar