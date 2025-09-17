import { useState, useEffect } from "react";
import { Building2, Users, Layers, ChevronDown, Award } from "lucide-react";
import Heading from "./Heading";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { toast, ToastContainer } from "react-toastify";
import LogoutButton from "./LogoutButton";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const headOptions = [
    "사장직속",
    "경영기획본부",
    "경영지원본부",
    "철강본부",
    "소재바이오본부",
    "에너지사업본부",
    "가스사업본부",
  ];

  const options: { [key: string]: string[] } = {
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
    경영지원본부: [
      "본부 직속",
      "구매물류그룹(미얀마)",
      "생산운영그룹(미얀마)",
      "설비기술그룹(미얀마)",
      "인사행정그룹(미얀마)",
      "재무회계그룹(미얀마)",
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

  const groupOptions: {
    [key: string]: string[] | { [key: string]: string[] };
  } = {
    사장직속: ["-", "윤리경영사무국", "정도경영1그룹", "정도경영2그룹"],
    경영기획본부: {
      "본부 직속": [
        "경영전략그룹",
        "재무기획그룹",
        "지속가능경영그룹",
        "투자심사그룹",
      ],
      경영기획실: ["ERM그룹", "무역금융그룹", "자금그룹"],
      사업관리실: [
        "구조조정TF",
        "법인지사관리그룹",
        "사업전략그룹",
        "신사업기획그룹",
        "투자관리1그룹",
        "투자관리2그룹",
      ],
      재무IR실: [
        "IR그룹",
        "관리회계그룹",
        "내부회계섹션",
        "세무그룹",
        "재무회계그룹",
      ],
      국제금융실: [],
      인사문화실: [
        "HR그룹",
        "노무후생그룹",
        "조직문화혁신그룹",
        "행정지원그룹",
      ],
      디지털혁신실: ["IT기획그룹", "IT혁신그룹", "정보보호그룹"],
      법무실: ["법무1그룹", "법무2그룹", "안전보건그룹"],
      커뮤니케이션실: [
        "대외협력그룹",
        "사회공헌그룹",
        "여자탁구단",
        "홍보그룹",
        "DX추진반",
        "DX추진반장",
      ],
    },
    경영지원본부: {
      "본부 직속": [],
      "구매물류그룹(미얀마)": [],
      "생산운영그룹(미얀마)": [],
      "설비기술그룹(미얀마)": [],
      "인사행정그룹(미얀마)": [],
      "재무회계그룹(미얀마)": [],
    },
    철강본부: {
      "본부 직속": [],
      열연조강사업실: [
        "열연내수그룹",
        "열연수출1그룹",
        "열연수출2그룹",
        "조강그룹",
      ],
      후판선재사업실: [
        "선재내수그룹",
        "선재수출그룹",
        "후판내수그룹",
        "후판수출그룹",
      ],
      냉연사업실: [
        "냉연내수그룹",
        "냉연수출1그룹",
        "냉연수출2그룹",
        "냉연수출3그룹",
      ],
      스테인리스사업실: ["STS시장개발그룹", "STS아시아그룹", "STS유럽미주그룹"],
      에너지인프라강재사업실: [
        "에너지강재그룹",
        "인프라강재그룹",
        "태양광강재그룹",
        "풍력강재그룹",
      ],
      자동차소재사업실: [
        "E파워트레인부품그룹",
        "모터코아판매그룹",
        "인프라부품그룹",
        "전기강판판매그룹",
      ],
      모빌리티사업실: [
        "동서남아그룹",
        "미구주그룹",
        "일본그룹",
        "중국그룹",
        "전사 CRM 구축 TF",
        "철강영업지원1섹션",
        "철강영업지원2섹션",
        "철강영업지원3섹션",
        "철강영업지원4섹션",
        "철강사업운영그룹",
      ],
    },
    소재바이오본부: {
      "본부 직속": ["소재바이오사업운영섹션", "공공프로젝트그룹"],
      원료소재사업실: [
        "기초소재그룹",
        "바이오&케미컬그룹",
        "바이오사업개발그룹",
        "소재바이오영업지원섹션",
      ],
      식량사업개발실: ["면방사업TF", "식량투자기획그룹", "유지사업개발그룹"],
      식량사업실: ["곡물1그룹", "곡물2그룹", "곡물3그룹", "식물유지그룹"],
      산업소재사업실: [
        "이차전지광물그룹",
        "이차전지소재그룹",
        "철강원료1그룹",
        "철강원료2그룹",
        "철강원료3그룹",
        "철강자원그룹",
      ],
    },
    에너지사업본부: {
      "본부 직속": ["3~4호기 신예화추진반"],
      발전사업개발실: [],
      LNG사업실: ["LNG조달그룹", "LNG트레이딩그룹", "선박연료사업그룹"],
      터미널사업실: ["터미널건설추진반"],
      에너지기술지원실: ["기술지원그룹", "에너지행정지원그룹", "혁신섹션"],
      에너지운영실: [
        "(광양)안전섹션",
        "(인천)안전섹션",
        "발전운영그룹",
        "발전정비그룹",
        "터미널운영그룹",
        "에너지정책그룹",
        "저탄소에너지사업그룹",
        "전력거래그룹",
      ],
    },
    가스사업본부: {
      "본부 직속": [],
      "E&P사업실": ["시추생산그룹", "저류평가섹션"],
      가스개발사업실: [],
      가스전운영실: [],
    },
  };

  const levelOptions = [
    "E1",
    "E2",
    "E3",
    "E4",
    "E5",
    "E6",
    "E7",
    "Ez",
    "P1",
    "P10",
    "P2",
    "P3",
    "P4",
    "P5",
    "P6",
    "P7",
    "P8",
    "P9",
    "Pz",
    "대리",
    "부관리직",
    "부총괄직",
    "수석",
    "주무",
    "총괄직",
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

  const [selectedHead, setSelectedHead] = useState(headOptions[0]);
  const [selectedDept, setSelectedDept] = useState(options[headOptions[0]][0]);
  const [selectedGroup, setSelectedGroup] = useState(
    (Array.isArray(groupOptions[headOptions[0]])
      ? (groupOptions[headOptions[0]] as string[])[0]
      : Object.values(
          groupOptions[headOptions[0]] as { [key: string]: string[] }
        )[0]?.[0]) || "-"
  );
  const [selectedLevel, setSelectedLevel] = useState(levelOptions[0]);
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
  const [linkId, setLinkId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const availableGroups = Array.isArray(groupOptions[selectedHead])
      ? groupOptions[selectedHead]
      : groupOptions[selectedHead][selectedDept] || ["-"];
    setSelectedGroup(availableGroups[0] || "-");
  }, [selectedHead, selectedDept]);

  const updateSlot = (idx: number, field: string, value: string) => {
    setSlots((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Only include slots with both activities selected, and send only timeRange, activity1, activity2
      const slotsPayload = slots
        .filter((slot) => slot.activity1 && slot.activity2)
        .map((slot) => ({
          timeRange: slot.timeRange,
          activity1:
            slot.activity1 === "기타" ? slot.customTask1 : slot.activity1,
          activity2:
            slot.activity2 === "기타" ? slot.customTask2 : slot.activity2,
        }));

      if (slotsPayload.length === 0) {
        setError("최소 1개 이상의 시간대에 대해 업무를 선택해 주세요.");
        setLoading(false);
        return;
      }

      // Prepare form payload
      const formPayload = {
        headquarters: selectedHead,
        division: selectedDept,
        group: selectedGroup,
        position: selectedLevel,
      };

      const token = localStorage.getItem("token");

      // Hit both APIs in parallel
      const [timeslotRes, formRes] = await Promise.all([
        apiFetch("/api/timeslot/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ slots: slotsPayload }),
        }),
        apiFetch(`/api/form/${linkId}/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(formPayload),
        }),
      ]);

      const timeslotData = await timeslotRes.json();
      const formData = await formRes.json();

      if (
        timeslotRes.ok &&
        timeslotData.success &&
        formRes.ok &&
        formData.success
      ) {
        alert("제출이 완료되었습니다!");
      } else {
        toast.error(
          timeslotData.message || formData.message || "제출에 실패했습니다."
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("제출 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-sky-50 flex flex-col items-center px-6 py-12">
      <div className="w-full flex justify-end mb-4">
        <LogoutButton />
      </div>
      <Heading />
      <div className="backdrop-blur-xl rounded-2xl p-12 max-w-4xl w-full">
        <h2 className="text-2xl font-semibold text-sky-700 mb-6">
          [조사 개요]
        </h2>
        <div className="text-gray-700 text-lg leading-relaxed space-y-3 mb-10">
          <p>
            이번 조사는 근무시간 중 업무 활용 현황을 파악하기 위한 것입니다.
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

        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-xl mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-sky-600" />
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-md pr-10 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-gray-50 hover:bg-white shadow-sm transition appearance-none"
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
              <Users className="w-6 h-6 text-sky-600" />
              2. 소속 실 선택 *
            </label>
            <div className="relative w-full md:w-3/5">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-md pr-10 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-gray-50 hover:bg-white shadow-sm transition appearance-none"
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
              <Layers className="w-6 h-6 text-sky-600" />
              3. 소속 그룹 선택 *
            </label>
            <div className="relative w-full md:w-3/5">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-md pr-10 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-gray-50 hover:bg-white shadow-sm transition appearance-none"
              >
                {(Array.isArray(groupOptions[selectedHead])
                  ? groupOptions[selectedHead]
                  : groupOptions[selectedHead][selectedDept] || ["-"]
                ).map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Award className="w-6 h-6 text-sky-600" />
              4. 직급 선택(주무의 경우 주무 선택) *
            </label>
            <div className="relative w-full md:w-3/5">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-md pr-10 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-gray-50 hover:bg-white shadow-sm transition appearance-none"
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

          <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold text-sky-600 mb-4">
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
              className="bg-gradient-to-r from-sky-700 to-sky-500 text-white font-semibold px-16 py-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-[1.05] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "다음"}
            </button>
          </div>
        </form>
      </div>
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
