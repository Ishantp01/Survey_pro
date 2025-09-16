import { useState, useEffect } from "react";
import { BarChart3, Calendar, Filter, Download } from "lucide-react";
import Heading from "../components/Heading";

// Define TypeScript types for survey data
type TaskOption =
  | "업무 1만 수행"
  | "영업/직무 관련 업무수행"
  | "업무 관련 커뮤니케이션(메일, 메신저, 전화 등)"
  | "회의·보고 자료 작성"
  | "회의·보고 참석"
  | "재무/정산/결산 업무"
  | "교육 참여"
  | string; // For "기타" with free-text input

type SurveyEntry = {
  date: string; // e.g., "2025-09-18"
  timeInterval: string; // e.g., "07:00-07:30"
  task1: TaskOption;
  task2: TaskOption;
};

type TimeRangeData = {
  totalSubmissions: number;
  avgTimeSpent: string;
  completionRate: string;
  topDept: string;
  surveyEntries: SurveyEntry[];
};

type TimeRangeKey = "surveyPeriod";

const mockData: Record<TimeRangeKey, TimeRangeData> = {
  surveyPeriod: {
    totalSubmissions: 450,
    avgTimeSpent: "14m 10s",
    completionRate: "90%",
    topDept: "본부 A",
    surveyEntries: [
      // Sample data for Sep 18, 2025
      {
        date: "2025-09-18",
        timeInterval: "07:00-07:30",
        task1: "영업/직무 관련 업무수행",
        task2: "업무 1만 수행",
      },
      {
        date: "2025-09-18",
        timeInterval: "07:30-08:00",
        task1: "업무 관련 커뮤니케이션(메일, 메신저, 전화 등)",
        task2: "기타: 팀 회의 준비",
      },
      {
        date: "2025-09-18",
        timeInterval: "21:30-22:00",
        task1: "회의·보고 자료 작성",
        task2: "회의·보고 참석",
      },
      // Sample data for Sep 19, 2025
      {
        date: "2025-09-19",
        timeInterval: "07:00-07:30",
        task1: "교육 참여",
        task2: "업무 1만 수행",
      },
      // Add more entries as needed for other dates and intervals
      // In a real app, this would come from the backend
    ],
  },
};

// Generate 30-minute time intervals from 07:00 to 22:00
const timeIntervals = (() => {
  const intervals: string[] = [];
  for (let hour = 7; hour < 22; hour++) {
    intervals.push(
      `${hour.toString().padStart(2, "0")}:00-${hour
        .toString()
        .padStart(2, "0")}:30`
    );
    intervals.push(`${hour.toString().padStart(2, "0")}:30-${hour + 1}:00`);
  }
  return intervals;
})();

// Working days from Sep 18 to Oct 2, excluding weekends
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

export default function Admin() {
  const [activeTab] = useState<TimeRangeKey>("surveyPeriod");
  const [dateRange, setDateRange] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [surveyData, setSurveyData] = useState<SurveyEntry[]>(
    mockData.surveyPeriod.surveyEntries
  );

  const data = mockData[activeTab];

  const toggleFilters = () => setShowFilters(!showFilters);

  // Backend integration placeholder
  useEffect(() => {
    // Fetch survey data from backend
    // Example: Replace with your API endpoint
    /*
    const fetchData = async () => {
      try {
        const response = await fetch('/api/survey-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dateRange, deptFilter }),
        });
        const result = await response.json();
        setSurveyData(result.surveyEntries);
      } catch (error) {
        console.error('Error fetching survey data:', error);
      }
    };
    fetchData();
    */
  }, [dateRange, deptFilter]);

  // Filter data based on dateRange and deptFilter
  const filteredData = surveyData.filter((entry) => {
    const dateMatch = dateRange === "all" || entry.date === dateRange;
    // Add department filter logic here when integrated with backend
    // For now, deptFilter is not applied to mock data
    return dateMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-4 py-10">
      <Heading />
      <div className="max-w-7xl mx-auto">
        <Link to={"/generate-form-link"}>
          {" "}
          <button className="bg-green-600 p-2 font-bold text-lg rounded-xl px-3 mb-10 justify-end flex">
            Generate form Link
          </button>
        </Link>
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-green-700 mb-2">
              POSCO International 관리자 대시보드
            </h1>
            <p className="text-gray-600">수행 업무 조사 데이터 분석</p>
          </div>
          <button className="bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-green-800 transition">
            <Download className="w-4 h-4" />
            데이터 내보내기
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              필터
            </h2>
            <button
              onClick={toggleFilters}
              className="text-green-700 hover:text-green-800"
            >
              {showFilters ? "숨기기" : "보이기"}
            </button>
          </div>
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  기간
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white transition"
                >
                  <option value="all">전체 (9월 18일 ~ 10월 2일)</option>
                  {workingDays.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  본부 필터
                </label>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white transition"
                >
                  <option value="all">전체</option>
                  <option value="본부 A">본부 A</option>
                  <option value="본부 B">본부 B</option>
                  <option value="본부 C">본부 C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  실 필터
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white transition">
                  <option>전체</option>
                  <option>실 A</option>
                  <option>실 B</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  그룹 필터
                </label>
                <input
                  type="text"
                  placeholder="그룹 검색"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white transition"
                />
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-800">총 제출 수</h3>
              <BarChart3 className="w-5 h-5 text-green-700" />
            </div>
            <p className="text-3xl font-extrabold text-green-700">
              {data.totalSubmissions}
            </p>
          </div>
          <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-800">
                평균 소요 시간
              </h3>
              <Calendar className="w-5 h-5 text-green-700" />
            </div>
            <p className="text-3xl font-extrabold text-green-700">
              {data.avgTimeSpent}
            </p>
          </div>
          <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-800">완료율</h3>
              <BarChart3 className="w-5 h-5 text-green-700" />
            </div>
            <p className="text-3xl font-extrabold text-green-700">
              {data.completionRate}
            </p>
          </div>
        </div>

        {/* Top Department */}
        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-gray-100">
          <h3 className="text-lg font-semibold text-green-600 mb-4">
            상위 본부
          </h3>
          <p className="text-2xl font-extrabold text-green-700">
            {data.topDept}
          </p>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-green-600 mb-4">
            제출 추이 (9월 18일 ~ 10월 2일)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-800 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    날짜
                  </th>
                  <th scope="col" className="px-6 py-3">
                    시간
                  </th>
                  <th scope="col" className="px-6 py-3">
                    업무 1
                  </th>
                  <th scope="col" className="px-6 py-3">
                    업무 2
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((entry, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">{entry.date}</td>
                      <td className="px-6 py-4">{entry.timeInterval}</td>
                      <td className="px-6 py-4">{entry.task1}</td>
                      <td className="px-6 py-4">{entry.task2}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-600"
                    >
                      데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
