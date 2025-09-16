import { useState } from "react";
import { BarChart3, Calendar, Filter, Download } from "lucide-react";
import Heading from "../components/Heading";

// Define TypeScript types for mockData
type SubmissionByHour = { hour: string; count: number };
type SubmissionByDay = { day: string; count: number };

type TimeRangeData =
  | {
      totalSubmissions: number;
      avgTimeSpent: string;
      completionRate: string;
      topDept: string;
      submissionsByHour: SubmissionByHour[];
      submissionsByDay?: never;
    }
  | {
      totalSubmissions: number;
      avgTimeSpent: string;
      completionRate: string;
      topDept: string;
      submissionsByDay: SubmissionByDay[];
      submissionsByHour?: never;
    };

type TimeRangeKey = "last24h" | "lastWeek" | "last10Days";

const mockData: Record<TimeRangeKey, TimeRangeData> = {
  last24h: {
    totalSubmissions: 45,
    avgTimeSpent: "12m 30s",
    completionRate: "92%",
    topDept: "본부 A",
    submissionsByHour: [
      { hour: "00:00", count: 0 },
      { hour: "04:00", count: 2 },
      { hour: "08:00", count: 8 },
      { hour: "12:00", count: 15 },
      { hour: "16:00", count: 12 },
      { hour: "20:00", count: 8 },
      { hour: "23:00", count: 0 },
    ],
  },
  lastWeek: {
    totalSubmissions: 320,
    avgTimeSpent: "15m 20s",
    completionRate: "88%",
    topDept: "본부 B",
    submissionsByDay: [
      { day: "Mon", count: 50 },
      { day: "Tue", count: 55 },
      { day: "Wed", count: 60 },
      { day: "Thu", count: 52 },
      { day: "Fri", count: 58 },
      { day: "Sat", count: 25 },
      { day: "Sun", count: 20 },
    ],
  },
  last10Days: {
    totalSubmissions: 850,
    avgTimeSpent: "14m 45s",
    completionRate: "90%",
    topDept: "본부 A",
    submissionsByDay: [
      { day: "D-9", count: 70 },
      { day: "D-8", count: 75 },
      { day: "D-7", count: 80 },
      { day: "D-6", count: 85 },
      { day: "D-5", count: 90 },
      { day: "D-4", count: 95 },
      { day: "D-3", count: 88 },
      { day: "D-2", count: 92 },
      { day: "D-1", count: 85 },
      { day: "Today", count: 90 },
    ],
  },
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TimeRangeKey>("last24h");
  const [dateRange, setDateRange] = useState<TimeRangeKey>("last24h");
  const [deptFilter, setDeptFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const data = mockData[activeTab];

  const toggleFilters = () => setShowFilters(!showFilters);

  return (
    <div className="min-h-screen bg-gradient-to-br px-4 py-10">
      <Heading />
      <div className="max-w-7xl mx-auto">
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
                  onChange={(e) => {
                    const value = e.target.value as TimeRangeKey;
                    setDateRange(value);
                    setActiveTab(value);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white transition"
                >
                  <option value="last24h">지난 24시간</option>
                  <option value="lastWeek">지난 주</option>
                  <option value="last10Days">지난 10일</option>
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

        {/* Tabs */}
        <div className="bg-white shadow-xl rounded-xl border border-gray-100 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("last24h")}
              className={`px-6 py-4 font-semibold flex items-center gap-2 ${
                activeTab === "last24h"
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-gray-600 hover:text-green-700"
              } transition`}
            >
              <BarChart3 className="w-4 h-4" />
              지난 24시간
            </button>
            <button
              onClick={() => setActiveTab("lastWeek")}
              className={`px-6 py-4 font-semibold flex items-center gap-2 ${
                activeTab === "lastWeek"
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-gray-600 hover:text-green-700"
              } transition`}
            >
              <BarChart3 className="w-4 h-4" />
              지난 주
            </button>
            <button
              onClick={() => setActiveTab("last10Days")}
              className={`px-6 py-4 font-semibold flex items-center gap-2 ${
                activeTab === "last10Days"
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-gray-600 hover:text-green-700"
              } transition`}
            >
              <BarChart3 className="w-4 h-4" />
              지난 10일
            </button>
          </div>
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
            제출 추이 ({activeTab === "last24h" ? "시간별" : "일별"})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-800 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    {activeTab === "last24h" ? "시간" : "날짜"}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    제출 수
                  </th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === "last24h"
                  ? data.submissionsByHour
                  : data.submissionsByDay
                )?.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      {"hour" in item ? item.hour : item.day}
                    </td>
                    <td className="px-6 py-4">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}