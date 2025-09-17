import { useState, useEffect } from "react";
import { BarChart3, Calendar, Download } from "lucide-react";
import { format } from "date-fns";
import Heading from "../components/Heading";
import { apiFetch } from "../utils/api";
import { Link } from "react-router-dom";
import { enIN } from "date-fns/locale";
import LogoutButton from "../components/LogoutButton";

export default function Admin() {
  const [surveyData, setSurveyData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    avgTimeSpent: "0m 0s",
    completionRate: "0%",
    topDept: "N/A",
  });
  const [selectedDate, setSelectedDate] = useState<string>("");

  // --- Fetch Data ---
  const fetchData = async (date?: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const url = date
        ? `/api/form/responses/by-date?date=${date}`
        : "/api/form/responses/all";

      const res = await apiFetch(url, { method: "GET", headers });
      const data = await res.json();

      if (!data.success)
        throw new Error(data.message || "Failed to fetch data");

      const responses = data.responses || [];

      setSurveyData(responses);
      setStats({
        totalSubmissions: responses.length,
        avgTimeSpent: calculateAvgTimeSpent(responses),
        completionRate: calculateCompletionRate(responses),
        topDept: calculateTopDept(responses),
      });
    } catch (error: any) {
      console.error("Error fetching survey data:", error);
      setError(error.message || "Error fetching survey data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateAvgTimeSpent = (_: any[]) => "N/A";
  const calculateCompletionRate = (_: any[]) => "N/A";

  const calculateTopDept = (data: any[]) => {
    if (!data.length) return "N/A";
    const deptCounts = data.reduce((acc: any, curr: any) => {
      const dept = curr.department || "N/A";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(deptCounts).reduce((a, b) =>
      deptCounts[a] > deptCounts[b] ? a : b
    );
  };

  // --- CSV Export ---
  const exportToCSV = () => {
    if (surveyData.length === 0) {
      alert("내보낼 데이터가 없습니다.");
      return;
    }

    const headers = [
      "날짜",
      "시간",
      "업무 1",
      "업무 2",
      "본부",
      "팀",
      "그룹",
      "직급",
      "이메일",
    ];

    const csvContent = [
      headers.join(","),
      ...surveyData.flatMap((entry) =>
        (entry.timeSlots || []).map((slot: any) =>
          [
            format(new Date(entry.submittedAt), "yyyy-MM-dd", { locale: enIN }),
            slot.timeRange || "N/A",
            `"${slot.task1 || "N/A"}"`,
            `"${slot.task2 || "N/A"}"`,
            `"${entry.department || "N/A"}"`,
            `"${entry.team || "N/A"}"`,
            `"${entry.group || "N/A"}"`,
            `"${entry.position || "N/A"}"`,
            `"${entry.email || "N/A"}"`,
          ].join(",")
        )
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `survey_data_${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white px-4 py-10">
      <div className="w-full flex justify-end mb-4">
        <LogoutButton />
      </div>
      <Heading />
      <div className="max-w-7xl mx-auto">
        <Link to="/generate-form-link">
          <button className="bg-sky-600 p-2 font-bold text-lg rounded-xl px-3 mb-10 justify-end flex">
            Generate Form Link
          </button>
        </Link>

        {/* --- Date Filter --- */}
        <div className="mb-6 flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              if (e.target.value) {
                fetchData(e.target.value);
              } else {
                fetchData(); // show all if cleared
              }
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />
          <button
            onClick={() => {
              setSelectedDate("");
              fetchData();
            }}
            className="bg-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-300"
          >
            Reset
          </button>
        </div>

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-sky-700 mb-2">
              POSCO International 관리자 대시보드
            </h1>
            <p className="text-gray-600">수행 업무 조사 데이터 분석</p>
          </div>
          <button
            onClick={exportToCSV}
            className="bg-sky-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-sky-800 transition"
          >
            <Download className="w-4 h-4" />
            데이터 내보내기
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-xl mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading && <div className="text-center text-gray-600">Loading...</div>}

        <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-sky-600 mb-4">
            제출 데이터
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-800 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">날짜</th>
                  <th className="px-6 py-3">시간</th>
                  <th className="px-6 py-3">업무 1</th>
                  <th className="px-6 py-3">업무 2</th>
                  <th className="px-6 py-3">본부</th>
                  <th className="px-6 py-3">팀</th>
                  <th className="px-6 py-3">그룹</th>
                  <th className="px-6 py-3">직급</th>
                  <th className="px-6 py-3">이메일</th>
                </tr>
              </thead>
              <tbody>
                {surveyData.length > 0 ? (
                  surveyData.flatMap((entry, index) =>
                    (entry.timeSlots || []).map(
                      (slot: any, slotIndex: number) => (
                        <tr
                          key={`${index}-${slotIndex}`}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            {format(new Date(entry.submittedAt), "yyyy-MM-dd", {
                              locale: enIN,
                            })}
                          </td>
                          <td className="px-6 py-4">
                            {slot.timeRange || "N/A"}
                          </td>
                          <td className="px-6 py-4">{slot.task1 || "N/A"}</td>
                          <td className="px-6 py-4">{slot.task2 || "N/A"}</td>
                          <td className="px-6 py-4">
                            {entry.department || "N/A"}
                          </td>
                          <td className="px-6 py-4">{entry.team || "N/A"}</td>
                          <td className="px-6 py-4">{entry.group || "N/A"}</td>
                          <td className="px-6 py-4">
                            {entry.position || "N/A"}
                          </td>
                          <td className="px-6 py-4">{entry.email || "N/A"}</td>
                        </tr>
                      )
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={9}
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
