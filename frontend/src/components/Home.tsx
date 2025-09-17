import { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Layers,
  ChevronDown,
  Award,
  Calendar,
} from "lucide-react";
import Heading from "./Heading";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const headOptions = [
    "사장직속",
    "경영기획본부",
    "철강본부",
    "소재바이오본부",
    "에너지사업본부",
    "가스사업본부",
  ];
  const options = {
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

  const taskOptions1 = [
    "영업/직무 관련 업무수행",
    "업무 관련 커뮤니케이션(메일, 메신저, 전화 등)",
    "회의·보고 자료 작성",
    "회의·보고 참석",
    "재무/정산/결산 업무",
    "교육 참여",
    "기타",
  ];
  const taskOptions2 = ["업무 1만 수행", ...taskOptions1];

  const timeIntervals = [];
  for (let hour = 7; hour < 22; hour++) {
    timeIntervals.push(
      `${hour.toString().padStart(2, "0")}:00-${hour
        .toString()
        .padStart(2, "0")}:30`
    );
    timeIntervals.push(
      `${hour.toString().padStart(2, "0")}:30-${(hour + 1)
        .toString()
        .padStart(2, "0")}:00`
    );
  }

  const workingDays = [
    "2025-09-18",
    "2025-09-19",
    "2025-09-22",
    "2025-09-23",
    "2025-09-24",
    "2025-09-25",
    "2025-09-26",
    "2025-09-29",
    "2025-09-30",
    "2025-10-01",
    "2025-10-02",
  ];

  const [selectedHead, setSelectedHead] = useState(headOptions[0]);
  const [selectedDept, setSelectedDept] = useState(options[headOptions[0]][0]);
  const [groupName, setGroupName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(levelOptions[0]);
  const [selectedDate, setSelectedDate] = useState(workingDays[0]); // Default to first working day
  const [slots, setSlots] = useState(
    timeIntervals.map((timeRange) => ({
      timeRange,
      activity1: "",
      activity2: "",
      customTask1: "",
      customTask2: "",
    }))
  );
  const [loading, setLoading] = useState(false);
  const [linkId, setLinkId] = useState(null);

  useEffect(() => {
    const urlParts = location.pathname.split("/");
    const urlLinkId = urlParts[2] || null;
    const storedFormLink = localStorage.getItem("formLink");
    const storedLinkId = localStorage.getItem("linkId");

    if (urlLinkId) {
      setLinkId(urlLinkId);
      localStorage.setItem("linkId", urlLinkId);
    } else if (storedFormLink) {
      const extractedLinkId = storedFormLink.split("/").pop() || "";
      if (extractedLinkId) {
        setLinkId(extractedLinkId);
        localStorage.setItem("linkId", extractedLinkId);
        if (!urlLinkId && location.pathname === "/") {
          navigate(`/form/${extractedLinkId}`, { replace: true });
        }
      } else {
        console.warn(
          "Invalid form link format in localStorage:",
          storedFormLink
        );
      }
    } else if (storedLinkId) {
      setLinkId(storedLinkId);
      if (!urlLinkId && location.pathname === "/") {
        navigate(`/form/${storedLinkId}`, { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  const updateSlot = (idx, field, value) => {
    setSlots((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let currentLinkId = linkId;
    if (!currentLinkId) {
      const storedFormLink = localStorage.getItem("formLink");
      if (storedFormLink) {
        currentLinkId = storedFormLink.split("/").pop() || "";
      }
    }

    if (!currentLinkId) {
      alert("Form link not ready yet. Please generate a form link first.");
      return;
    }

    setLoading(true);
    try {
      const rawData = {
        headquarters: selectedHead,
        division: selectedDept,
        group: groupName,
        position: selectedLevel,
        date: selectedDate,
        slots: slots.map((slot) => ({
          timeRange: slot.timeRange,
          task1: slot.activity1 === "기타" ? slot.customTask1 : slot.activity1,
          task2: slot.activity2 === "기타" ? slot.customTask2 : slot.activity2,
        })),
      };

      const res = await apiFetch(`/api/form/${currentLinkId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rawData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert(data.message);
      } else {
        alert(data.message || "Form submission failed.");
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
        <h2 className="text-2xl font-semibold text-green-700 mb-6">
          [조사 개요]
        </h2>
        <div className="text-gray-700 text-lg leading-relaxed space-y-3 mb-10">
          <p>
            이번 조사는 근무시간 중 업무 활용 현황을 파악하기 위한 것입니다.{" "}
            <br />
            특히 회의·보고 활동이 실제로 얼마나 시간을 차지하는지 확인하고,
            앞으로 더 효율적인 근무 방식을 설계하기 위한 기초 자료로 활용됩니다.
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              조사 기간: 2025년 9월 18일(목) ~ 10월 2일(목), 총 2주(10영업일)
            </li>
            <li>
              매일 퇴근 전까지 시간대별로 업무 유형을 제시된 항목에서 선택하시면
              됩니다.
            </li>
            <li>
              답변은 그룹별 집계·분석되며, 개인 식별에는 사용되지 않습니다.
            </li>
            <li>
              여러분의 응답은 불필요한 업무를 줄이고, 회의·보고 문화를 개선하는
              중요한 근거가 됩니다.
            </li>
            <li>빠짐없이 참여해 주시면 감사하겠습니다.</li>
          </ul>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
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
                {headOptions.map((head) => (
                  <option key={head} value={head}>
                    {head}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

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
                {options[selectedHead].map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

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
                {levelOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
              {/* <Calendar className="w-6 h-6 text-green-600" /> */}
              5. 조사일 선택 *
            </label>
            <div className="relative w-full md:w-3/5">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-md pr-10 focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white shadow-sm transition appearance-none"
              >
                {workingDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold text-green-600 mb-4">
              조사일 각 시간대별 수행한 업무의 종류를 선택해 주세요.
            </h3>
            <p className="text-gray-600 mb-4">
              - 2개 이상의 업무를 동시 수행한 경우 비중이 높은 업무 2개를 각각
              선택합니다.
              <br />- 수행 업무가 미입력된 시간대는 정규 업무 시간이 아닌 것으로
              집계됩니다.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-gray-800 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      시간
                    </th>
                    <th scope="col" className="px-6 py-3">
                      업무 1의 옵션
                    </th>
                    <th scope="col" className="px-6 py-3">
                      업무 2의 옵션
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot, idx) => (
                    <tr
                      key={slot.timeRange}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">{slot.timeRange}</td>
                      <td className="px-6 py-4">
                        <select
                          value={slot.activity1}
                          onChange={(e) =>
                            updateSlot(idx, "activity1", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="">선택</option>
                          {taskOptions1.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {slot.activity1 === "기타" && (
                          <input
                            type="text"
                            value={slot.customTask1}
                            onChange={(e) =>
                              updateSlot(idx, "customTask1", e.target.value)
                            }
                            placeholder="기타 업무 입력"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-2"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={slot.activity2}
                          onChange={(e) =>
                            updateSlot(idx, "activity2", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="">선택</option>
                          {taskOptions2.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {slot.activity2 === "기타" && (
                          <input
                            type="text"
                            value={slot.customTask2}
                            onChange={(e) =>
                              updateSlot(idx, "customTask2", e.target.value)
                            }
                            placeholder="기타 업무 입력"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-2"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
