

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Building2, Users, Layers, ChevronDown, Award } from "lucide-react";
// import Heading from "./Heading";

// export default function Home() {
//   // Headquarters and options
//   const headOptions = ["사장직속", "경영기획본부", "철강본부", "소재바이오본부", "에너지사업본부", "가스사업본부"];
//   const options: Record<string, string[]> = {
//     사장직속: ["-"],
//     경영기획본부: ["본부 직속","경영기획실","사업관리실","재무IR실","국제금융실","인사문화실","디지털혁신실","법무실","커뮤니케이션실"],
//     철강본부: ["본부 직속","열연조강사업실","후판선재사업실","냉연사업실","스테인리스사업실","에너지인프라강재사업실","자동차소재사업실","모빌리티사업실"],
//     소재바이오본부: ["본부 직속","원료소재사업실","식량사업개발실","식량사업실","산업소재사업실"],
//     에너지사업본부: ["본부 직속","발전사업개발실","LNG사업실","터미널사업실","에너지기술지원실","에너지운영실"],
//     가스사업본부: ["본부 직속","E&P사업실","가스개발사업실","가스전운영실"],
//   };
//   const levelOptions = ["그룹장/섹션리더","본부/실/그룹 주무","실장 이상","일반(P1~P2)","일반(P3~P4)","일반(P5~P6)"];

//   // Form state
//   const [selectedHead, setSelectedHead] = useState(headOptions[0]);
//   const [selectedDept, setSelectedDept] = useState(options[headOptions[0]][0]);
//   const [groupName, setGroupName] = useState("");
//   const [selectedLevel, setSelectedLevel] = useState(levelOptions[0]);
//   const [loading, setLoading] = useState(false);
//   const [linkId, setLinkId] = useState<string | null>(null);

//   // Fetch or reuse linkId from localStorage
//   useEffect(() => {
//     const storedLinkId = localStorage.getItem("linkId");
//     if (storedLinkId) {
//       setLinkId(storedLinkId);
//     } else {
//       // Fetch a new link from the backend
//       const fetchLink = async () => {
//         try {
//           const res = await axios.get("http://localhost:5000/api/form/generate");
//           setLinkId(res.data.linkId);
//           localStorage.setItem("linkId", res.data.linkId); // Save in localStorage
//         } catch (err) {
//           console.error("Error fetching form link", err);
//         }
//       };
//       fetchLink();
//     }
//   }, []);

//   // Handle form submission
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   const storedLinkId = localStorage.getItem("linkId");
//   if (!storedLinkId) {
//     alert("Form link not ready yet.");
//     return;
//   }

//   setLoading(true);
//   try {
//     const rawData = {
//       headquarters: selectedHead,
//       division: selectedDept,
//       group: groupName,
//       position: selectedLevel,
//     };

//     const res = await axios.post(
//       `http://localhost:5000/api/form/${storedLinkId}/submit`,
//       rawData
//     );

//     if (res.data.success) {
//       alert(res.data.message);
//       window.open(
//         `http://localhost:5000/api/form/${storedLinkId}/submit`,
//         "_blank"
//       );
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Something went wrong while submitting the form.");
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex flex-col items-center px-6 py-12">
//       <Heading />
//       <div className="backdrop-blur-xl rounded-2xl p-12 max-w-4xl w-full">
//         <h2 className="text-2xl font-semibold text-green-700 mb-6">[조사 개요]</h2>
//         <div className="text-gray-700 text-lg leading-relaxed space-y-3 mb-10">
//           <p>
//             이번 조사는 근무시간 중 업무 활용 현황을 파악하기 위한 것입니다. <br />
//             특히 회의·보고 활동이 실제로 얼마나 시간을 차지하는지 확인하고,
//             앞으로 더 효율적인 근무 방식을 설계하기 위한 기초 자료로 활용됩니다.
//           </p>
//           <ul className="list-disc list-inside space-y-1 pl-2">
//             <li>조사 기간: 2025년 9월 18일(목) ~ 10월 2일(목), 총 2주(10영업일)</li>
//             <li>매일 퇴근 전까지 시간대별로 구분해 제시된 항목에서 선택하시면 됩니다.</li>
//             <li>답변은 그룹별 집계·분석되며, 개인 식별에는 사용되지 않습니다.</li>
//             <li>여러분의 응답은 불필요한 업무를 줄이고, 회의·보고 문화를 개선하는 근거가 됩니다.</li>
//           </ul>
//         </div>

//         <form className="space-y-8" onSubmit={handleSubmit}>
//           {/* Headquarters */}
//           <div>
//             <label className="block text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
//               <Building2 className="w-6 h-6 text-green-600" />
//               1. 소속 본부 선택 *
//             </label>
//             <div className="relative w-full md:w-3/5">
//               <select
//                 value={selectedHead}
//                 onChange={(e) => {
//                   const newHead = e.target.value;
//                   setSelectedHead(newHead);
//                   setSelectedDept(options[newHead][0]);
//                 }}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 text-md pr-10 focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white shadow-sm transition appearance-none"
//               >
//                 {headOptions.map((head) => <option key={head} value={head}>{head}</option>)}
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
//             </div>
//           </div>

//           {/* Department */}
//           <div>
//             <label className="block text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
//               <Users className="w-6 h-6 text-green-600" />
//               2. 소속 실 선택 *
//             </label>
//             <div className="relative w-full md:w-3/5">
//               <select
//                 value={selectedDept}
//                 onChange={(e) => setSelectedDept(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 text-md pr-10 focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white shadow-sm transition appearance-none"
//               >
//                 {options[selectedHead].map((dept) => <option key={dept} value={dept}>{dept}</option>)}
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
//             </div>
//           </div>

//           {/* Group */}
//           <div>
//             <label className="block text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
//               <Layers className="w-6 h-6 text-green-600" />
//               3. 그룹 *
//             </label>
//             <input
//               type="text"
//               placeholder="소속 그룹명 입력"
//               value={groupName}
//               onChange={(e) => setGroupName(e.target.value)}
//               className="w-full md:w-3/5 border border-gray-300 rounded-lg px-4 py-3 text-md focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white shadow-sm transition"
//             />
//           </div>

//           {/* Position */}
//           <div>
//             <label className="block text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
//               <Award className="w-6 h-6 text-green-600" />
//               4. 직급 선택(주무의 경우 주무 선택) *
//             </label>
//             <div className="relative w-full md:w-3/5">
//               <select
//                 value={selectedLevel}
//                 onChange={(e) => setSelectedLevel(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 text-md pr-10 focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white shadow-sm transition appearance-none"
//               >
//                 {levelOptions.map((level) => <option key={level} value={level}>{level}</option>)}
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
//             </div>
//           </div>

//           <div className="flex justify-center pt-6">
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-gradient-to-r from-green-700 to-green-500 text-white font-semibold px-16 py-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-[1.05] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? "Submitting..." : "다음"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import axios from "axios";
import { Building2, Users, Layers, ChevronDown, Award } from "lucide-react";
import Heading from "./Heading";
import { useLocation, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  // Headquarters and options
  const headOptions = ["사장직속", "경영기획본부", "철강본부", "소재바이오본부", "에너지사업본부", "가스사업본부"];
  const options: Record<string, string[]> = {
    사장직속: ["-"],
    경영기획본부: ["본부 직속","경영기획실","사업관리실","재무IR실","국제금융실","인사문화실","디지털혁신실","법무실","커뮤니케이션실"],
    철강본부: ["본부 직속","열연조강사업실","후판선재사업실","냉연사업실","스테인리스사업실","에너지인프라강재사업실","자동차소재사업실","모빌리티사업실"],
    소재바이오본부: ["본부 직속","원료소재사업실","식량사업개발실","식량사업실","산업소재사업실"],
    에너지사업본부: ["본부 직속","발전사업개발실","LNG사업실","터미널사업실","에너지기술지원실","에너지운영실"],
    가스사업본부: ["본부 직속","E&P사업실","가스개발사업실","가스전운영실"],
  };
  const levelOptions = ["그룹장/섹션리더","본부/실/그룹 주무","실장 이상","일반(P1~P2)","일반(P3~P4)","일반(P5~P6)"];

  // Form state
  const [selectedHead, setSelectedHead] = useState(headOptions[0]);
  const [selectedDept, setSelectedDept] = useState(options[headOptions[0]][0]);
  const [groupName, setGroupName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(levelOptions[0]);
  const [loading, setLoading] = useState(false);
  const [linkId, setLinkId] = useState<string | null>(null);

  // 🔹 Get linkId from URL or localStorage
  useEffect(() => {
    const urlParts = location.pathname.split("/"); // e.g. /form/<linkId>
    const urlLinkId = urlParts[2] || null;
    const storedLinkId = localStorage.getItem("linkId");

    if (urlLinkId) {
      setLinkId(urlLinkId);
      localStorage.setItem("linkId", urlLinkId); // persist for reloads
    } else if (storedLinkId) {
      setLinkId(storedLinkId);
    } else {
      alert("Invalid form link.");
      navigate("/"); // redirect if no link
    }
  }, [location.pathname, navigate]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedLinkId = localStorage.getItem("linkId");
    if (!storedLinkId) {
      alert("Form link not ready yet.");
      return;
    }

    setLoading(true);
    try {
      const rawData = {
        headquarters: selectedHead,
        division: selectedDept,
        group: groupName,
        position: selectedLevel,
      };

      const res = await axios.post(
        `http://localhost:5000/api/form/${storedLinkId}/submit`,
        rawData
      );

      if (res.data.success) {
        alert(res.data.message);
        // Optionally redirect to a "Thank you" page or open confirmation
        // window.open(`/form/${storedLinkId}/submitted`, "_blank");
      } else {
        alert(res.data.message || "Form submission failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex flex-col items-center px-6 py-12">
      <Heading />
      <div className="backdrop-blur-xl rounded-2xl p-12 max-w-4xl w-full">
        <h2 className="text-2xl font-semibold text-green-700 mb-6">[조사 개요]</h2>
        <div className="text-gray-700 text-lg leading-relaxed space-y-3 mb-10">
          <p>
            이번 조사는 근무시간 중 업무 활용 현황을 파악하기 위한 것입니다. <br />
            특히 회의·보고 활동이 실제로 얼마나 시간을 차지하는지 확인하고,
            앞으로 더 효율적인 근무 방식을 설계하기 위한 기초 자료로 활용됩니다.
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>조사 기간: 2025년 9월 18일(목) ~ 10월 2일(목), 총 2주(10영업일)</li>
            <li>매일 퇴근 전까지 시간대별로 구분해 제시된 항목에서 선택하시면 됩니다.</li>
            <li>답변은 그룹별 집계·분석되며, 개인 식별에는 사용되지 않습니다.</li>
            <li>여러분의 응답은 불필요한 업무를 줄이고, 회의·보고 문화를 개선하는 근거가 됩니다.</li>
          </ul>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Headquarters */}
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-green-600" />
              1. 소속 본부 선택 *
            </label>
            <div className="relative w-full md:w-3/5">
              <select
                value={selectedHead}
                onChange={(e) => {
                  const newHead = e.target.value;
                  setSelectedHead(newHead);
                  setSelectedDept(options[newHead][0]);
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-md pr-10 focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white shadow-sm transition appearance-none"
              >
                {headOptions.map((head) => <option key={head} value={head}>{head}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              2. 소속 실 선택 *
            </label>
            <div className="relative w-full md:w-3/5">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-md pr-10 focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white shadow-sm transition appearance-none"
              >
                {options[selectedHead].map((dept) => <option key={dept} value={dept}>{dept}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Group */}
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Layers className="w-6 h-6 text-green-600" />
              3. 그룹 *
            </label>
            <input
              type="text"
              placeholder="소속 그룹명 입력"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full md:w-3/5 border border-gray-300 rounded-lg px-4 py-3 text-md focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white shadow-sm transition"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Award className="w-6 h-6 text-green-600" />
              4. 직급 선택(주무의 경우 주무 선택) *
            </label>
            <div className="relative w-full md:w-3/5">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-md pr-10 focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white shadow-sm transition appearance-none"
              >
                {levelOptions.map((level) => <option key={level} value={level}>{level}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-700 to-green-500 text-white font-semibold px-16 py-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-[1.05] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "다음"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
