import { useState, useEffect } from "react";
import { BarChart3, Calendar, Filter, Download } from "lucide-react";
import Heading from "../components/Heading";
import { apiFetch } from "../utils/api";
import { Link } from "react-router-dom";

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
  const [activeTab] = useState("surveyPeriod");
  const [dateRange, setDateRange] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [surveyData, setSurveyData] = useState([]);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    avgTimeSpent: "0m 0s",
    completionRate: "0%",
    topDept: "N/A",
  });

  const toggleFilters = () => setShowFilters(!showFilters);

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      alert("내보낼 데이터가 없습니다.");
      return;
    }

    const headers = [
      "날짜",
      "시간",
      "업무 1",
      "업무 2",
      "본부",
      "실",
      "그룹",
      "직급",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((entry) =>
        [
          entry.date,
          entry.timeInterval,
          `"${entry.task1}"`,
          `"${entry.task2}"`,
          `"${entry.headquarters}"`,
          `"${entry.division}"`,
          `"${entry.group}"`,
          `"${entry.position}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `survey_data_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch("/api/survey-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dateRange, deptFilter }),
        });
        const result = await response.json();
        setSurveyData(result.surveyEntries || []);
        setStats({
          totalSubmissions: result.totalSubmissions || 0,
          avgTimeSpent: result.avgTimeSpent || "0m 0s",
          completionRate: result.completionRate || "0%",
          topDept: result.topDept || "N/A",
        });
      } catch (error) {
        console.error("Error fetching survey data:", error);
      }
    };
    fetchData();
  }, [dateRange, deptFilter]);

  const filteredData = surveyData.filter((entry) => {
    const dateMatch = dateRange === "all" || entry.date === dateRange;
    const deptMatch = deptFilter === "all" || entry.headquarters === deptFilter;
    return dateMatch && deptMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-4 py-10">
      <Heading />
      <div className="max-w-7xl mx-auto">
        <Link to={"/generate-form-link"}>
          <button className="bg-green-600 p-2 font-bold text-lg rounded-xl px-3 mb-10 justify-end flex">
            Generate form Link
          </button>
        </Link>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-green-700 mb-2">
              POSCO International 관리자 대시보드
            </h1>
            <p className="text-gray-600">수행 업무 조사 데이터 분석</p>
          </div>
          <button
            onClick={exportToCSV}
            className="bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-green-800 transition"
          >
            <Download className="w-4 h-4" />
            데이터 내보내기
          </button>
        </div>

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
                  {Object.keys(options).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  실 필터
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white transition">
                  <option>전체</option>
                  {deptFilter !== "all" &&
                    options[deptFilter].map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-800">총 제출 수</h3>
              <BarChart3 className="w-5 h-5 text-green-700" />
            </div>
            <p className="text-3xl font-extrabold text-green-700">
              {stats.totalSubmissions}
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
              {stats.avgTimeSpent}
            </p>
          </div>
          <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-800">완료율</h3>
              <BarChart3 className="w-5 h-5 text-green-700" />
            </div>
            <p className="text-3xl font-extrabold text-green-700">
              {stats.completionRate}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-gray-100">
          <h3 className="text-lg font-semibold text-green-600 mb-4">
            상위 본부
          </h3>
          <p className="text-2xl font-extrabold text-green-700">
            {stats.topDept}
          </p>
        </div>

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
                  <th scope="col" className="px-6 py-3">
                    본부
                  </th>
                  <th scope="col" className="px-6 py-3">
                    실
                  </th>
                  <th scope="col" className="px-6 py-3">
                    그룹
                  </th>
                  <th scope="col" className="px-6 py-3">
                    직급
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
                      <td className="px-6 py-4">{entry.headquarters}</td>
                      <td className="px-6 py-4">{entry.division}</td>
                      <td className="px-6 py-4">{entry.group}</td>
                      <td className="px-6 py-4">{entry.position}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
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
