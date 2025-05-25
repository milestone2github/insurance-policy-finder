// src/App.tsx
// import React, { useState } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from "./components/common/Sidebar";
import AppRoutes from "./routes/AppRoutes";

// import MedicalReviewWizard from './wizards/MedicalReviewWizard';
// import ExistingPolicyWizard from './wizards/ExistingPolicyWizard';
// import FinalDataPage from './components/common/ReviewPage';

// import {
//   DUMMY_PERSONAL,
//   DUMMY_LIFESTYLE,
//   DUMMY_MEDICAL,
// } from './constants/dummy';

export default function App() {
  // Lifted state for all flows
  // const [medicalAnswers, setMedicalAnswers] = useState<any>(null);
  // const [policyData, setPolicyData] = useState<any[]>([]);

  return (
		<div className="flex h-screen">
			<Sidebar />
			<div className="flex-grow overflow-auto bg-gray-50">
				<AppRoutes />
			</div>
		</div>
		// <BrowserRouter>
		//   <Routes>
		//     <Route
		//       path="/medicalreview"
		//       element={
		//         <MedicalReviewWizard
		//           onComplete={(answers) => {
		//             setMedicalAnswers(answers);
		//             // navigate to next
		//             window.location.href = '/existingpolicy';
		//           }}
		//         />
		//       }
		//     />
		//     <Route
		//       path="/existingpolicy"
		//       element={
		//         <ExistingPolicyWizard
		//           onComplete={(policies) => {
		//             setPolicyData(policies);
		//             window.location.href = '/finaldata';
		//           }}
		//         />
		//       }
		//     />
		//     <Route
		//       path="/finaldata"
		//       element={
		//         <FinalDataPage
		//           personal={DUMMY_PERSONAL}
		//           lifestyle={DUMMY_LIFESTYLE}
		//           medical={medicalAnswers || DUMMY_MEDICAL}
		//           policies={policyData}
		//           onEditSection={(section) => {
		//             const map: Record<number, string> = {
		//               1: '/medicalreview',
		//               2: '/medicalreview',
		//               3: '/medicalreview',
		//               4: '/existingpolicy',
		//             };
		//             window.location.href = map[section] || '/medicalreview';
		//           }}
		//           onConfirm={() => {
		//             console.log('Submitting everything…');
		//             // send full payload
		//             const payload = {
		//               medical: medicalAnswers,
		//               policies: policyData,
		//             };
		//             // e.g. axios.post('/api/submit', payload)
		//           }}
		//         />
		//       }
		//     />
		//     <Route path="*" element={<Navigate to="/medicalreview" replace />} />
		//   </Routes>
		// </BrowserRouter>
	);
}