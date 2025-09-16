import React from "react";
import { Building2, Users, Layers } from "lucide-react"; // icons

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex justify-center items-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-3xl w-full border border-gray-100">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-green-700 mb-4 text-center">
          POSCO International 수행 업무 조사
        </h1>

        {/* Section Header */}
        <h2 className="text-lg font-semibold text-green-600 mb-3">
          [조사 개요]
        </h2>

        {/* Description */}
        <div className="text-gray-700 text-sm leading-relaxed space-y-2 mb-8">
          <p>
            이번 조사는 근무시간 중 업무 활용 현황을 파악하기 위한 것입니다.
            특히 회의·보고 활동이 실제로 얼마나 시간을 차지하는지 확인하고,
            앞으로 더 효율적인 근무 방식을 설계하기 위한 기초 자료로 활용됩니다.
          </p>
          <ul className="list-disc list-inside space-y-1">
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
              중요한 근거가 됩니다.
            </li>
          </ul>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Question 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-green-700" />* 1. 귀하의{" "}
              <span className="text-green-700 font-semibold">소속 본부</span>를
              선택해 주세요.
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white transition">
              <option>선택하세요</option>
              <option>본부 A</option>
              <option>본부 B</option>
              <option>본부 C</option>
            </select>
          </div>

          {/* Question 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-green-700" />* 2. 귀하의{" "}
              <span className="text-green-700 font-semibold">소속 실</span>을
              선택해 주세요.
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white transition">
              <option>선택하세요</option>
              <option>실 A</option>
              <option>실 B</option>
              <option>실 C</option>
            </select>
          </div>

          {/* Question 3 */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-green-700" />* 3. 귀하의{" "}
              <span className="text-green-700 font-semibold">소속 그룹</span>을
              입력해 주세요.
            </label>
            <input
              type="text"
              placeholder="예: 경영기획그룹"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white transition"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-700 text-white font-semibold px-10 py-3 rounded-lg shadow-lg hover:bg-green-800 transition transform hover:scale-[1.02]"
            >
              다음
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
