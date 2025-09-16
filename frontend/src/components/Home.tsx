import { useState } from "react";
import { Building2, Users, Layers } from "lucide-react";
import Heading from "./Heading";

export default function Home() {
  const headOptions = [
    "사장직속",
    "경영기획본부",
    "철강본부",
    "소재바이오본부",
    "에너지사업본부",
    "가스사업본부",
  ];

  const options: Record<string, string[]> = {
    사장직속: ["-"],
    경영기획본부: [
      "본부 직속",
      "경영기획실",
      "사업관리실",
      "재무IR실",
      "국제금융실",
      "인사문화실",
      "디지털혁신실",
      "법무실",
      "커뮤니케이션실",
    ],
    철강본부: [
      "본부 직속",
      "열연조강사업실",
      "후판선재사업실",
      "냉연사업실",
      "스테인리스사업실",
      "에너지인프라강재사업실",
      "자동차소재사업실",
      "모빌리티사업실",
    ],
    소재바이오본부: [
      "본부 직속",
      "원료소재사업실",
      "식량사업개발실",
      "식량사업실",
      "산업소재사업실",
    ],
    에너지사업본부: [
      "본부 직속",
      "발전사업개발실",
      "LNG사업실",
      "터미널사업실",
      "에너지기술지원실",
      "에너지운영실",
    ],
    가스사업본부: ["본부 직속", "E&P사업실", "가스개발사업실", "가스전운영실"],
  };

  const levelOptions = [
    "그룹장/섹션리더",
    "본부/실/그룹 주무",
    "실장 이상",
    "일반(P1~P2)",
    "일반(P3~P4)",
    "일반(P5~P6)",
  ];

  const [selectedHead, setSelectedHead] = useState(headOptions[0]);
  const [selectedDept, setSelectedDept] = useState(options[headOptions[0]][0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex flex-col items-center px-4 py-10">
      <Heading />

      <div className="backdrop-blur-xl bg-white/80 shadow-2xl rounded-2xl p-10 max-w-3xl w-full border border-gray-200">
        {/* Section Header */}
<<<<<<< HEAD
        <h2 className="text-lg font-semibold text-green-600 mb-3">
=======
        <h2 className="text-xl font-semibold text-green-700 mb-4">
>>>>>>> e4bbb1be02e208b9c3a696463d91d5decf1e99c0
          [조사 개요]
        </h2>

        {/* Description */}
        <div className="text-gray-700 text-sm leading-relaxed space-y-3 mb-8">
          <p>
            이번 조사는 근무시간 중 업무 활용 현황을 파악하기 위한 것입니다.
            특히 회의·보고 활동이 실제로 얼마나 시간을 차지하는지 확인하고,
            앞으로 더 효율적인 근무 방식을 설계하기 위한 기초 자료로 활용됩니다.
          </p>
<<<<<<< HEAD
          <ul className="list-disc list-inside space-y-1">
=======
          <ul className="list-disc list-inside space-y-1 pl-2">
>>>>>>> e4bbb1be02e208b9c3a696463d91d5decf1e99c0
            <li>
              조사 기간: 2025년 9월 18일(목) ~ 10월 2일(목), 총 2주(10영업일)
            </li>
            <li>
              매일 퇴근 전까지 시간대별로 구분해 제시된 항목에서 선택하시면
              됩니다.
            </li>
            <li>
              답변은 그룹별 집계·분석되며, 개인 식별에는 사용되지 않습니다.
            </li>
            <li>
              여러분의 응답은 불필요한 업무를 줄이고, 회의·보고 문화를 개선하는
<<<<<<< HEAD
              중요한 근거가 됩니다.
=======
              근거가 됩니다.
>>>>>>> e4bbb1be02e208b9c3a696463d91d5decf1e99c0
            </li>
          </ul>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Question 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
<<<<<<< HEAD
              <Building2 className="w-4 h-4 text-green-700" />* 1. 귀하의{" "}
              <span className="text-green-700 font-semibold">소속 본부</span>를
              선택해 주세요.
=======
              <Building2 className="w-5 h-5 text-green-600" />* 1. 소속 본부
              선택
>>>>>>> e4bbb1be02e208b9c3a696463d91d5decf1e99c0
            </label>
            <select
              value={selectedHead}
              onChange={(e) => {
                const newHead = e.target.value;
                setSelectedHead(newHead);
                setSelectedDept(options[newHead][0]);
              }}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white shadow-sm transition"
            >
              {headOptions.map((head) => (
                <option key={head} value={head}>
                  {head}
                </option>
              ))}
            </select>
          </div>

          {/* Question 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
<<<<<<< HEAD
              <Users className="w-4 h-4 text-green-700" />* 2. 귀하의{" "}
              <span className="text-green-700 font-semibold">소속 실</span>을
              선택해 주세요.
=======
              <Users className="w-5 h-5 text-green-600" />* 2. 소속 실 선택
>>>>>>> e4bbb1be02e208b9c3a696463d91d5decf1e99c0
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white shadow-sm transition"
            >
              {options[selectedHead].map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Question 3 */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
<<<<<<< HEAD
              <Layers className="w-4 h-4 text-green-700" />* 3. 귀하의{" "}
              <span className="text-green-700 font-semibold">소속 그룹</span>을
              입력해 주세요.
=======
              <Layers className="w-5 h-5 text-green-600" />* 3. 그룹
>>>>>>> e4bbb1be02e208b9c3a696463d91d5decf1e99c0
            </label>
            <input
              type="text"
              placeholder="소속 그룹명 입력"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white shadow-sm transition"
            />
          </div>

          {/* Question 4 */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              * 4.직급 선택(주무의 경우 주무 선택)
            </label>
            <select
              defaultValue={levelOptions[0]}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white shadow-sm transition"
            >
              {levelOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-700 to-green-500 text-white font-semibold px-12 py-3 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-[1.05]"
            >
              다음
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
