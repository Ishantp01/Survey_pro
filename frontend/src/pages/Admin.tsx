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

  // --- CSV Export ---
  const exportToCSV = () => {
    if (typeof window === "undefined") return; // ✅ prevent SSR crash

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
      "실",
      "그룹",
      "직급",
      "이메일",
    ];

    // build csvContent here 👇
    const csvContent = [
      headers.join(","), // add headers
      ...surveyData.flatMap((entry) =>
        (entry.slots || []).map((slot: any) =>
          [
            format(new Date(entry.submittedAt), "yyyy-MM-dd", { locale: enIN }),
            slot.timeRange || "N/A",
            `"${slot.activity1 || "N/A"}"`,
            `"${slot.activity2 || "N/A"}"`,
            `"${entry.headquarters || "N/A"}"`,
            `"${entry.division || "N/A"}"`,
            `"${entry.group || "N/A"}"`,
            `"${entry.position || "N/A"}"`,
            `"${entry.email || entry.userEmail || "N/A"}"`,
          ].join(",")
        )
      ),
    ].join("\n");

    // ✅ correct usage
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [timeslotRes, formRes] = await Promise.all([
          apiFetch("/api/timeslot/all", { method: "GET", headers }),
          apiFetch("/api/form/responses/all", { method: "GET", headers }),
        ]);

        const timeslotData = await timeslotRes.json();
        const formData = await formRes.json();

        console.log("Timeslot Data:", timeslotData);
        console.log("Form Data:", formData);

        // ✅ Adjust keys to match backend
        const timeslotList = timeslotData.submissions || [];
        const formList = formData.responses || [];

        // Merge timeslot + form
        const mergedData = timeslotList.map((timeslot: any) => {
          const form = formList.find(
            (f: any) => f.email === timeslot.userEmail
          ) || {
            headquarters: "N/A",
            division: "N/A",
            group: "N/A",
            position: "N/A",
            email: timeslot.userEmail,
            submittedAt: timeslot.submittedAt || Date.now(),
          };

          return {
            ...timeslot,
            ...form,
            slots: timeslot.slots || [],
            submittedAt: form.submittedAt || timeslot.submittedAt || Date.now(),
          };
        });

        console.log("Merged Data:", mergedData);

        setSurveyData(mergedData);
        setStats({
          totalSubmissions: mergedData.length,
          avgTimeSpent: calculateAvgTimeSpent(mergedData),
          completionRate: calculateCompletionRate(mergedData),
          topDept: calculateTopDept(mergedData),
        });
      } catch (error: any) {
        console.error("Error fetching survey data:", error);
        setError(error.message || "Error fetching survey data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateAvgTimeSpent = (_: any[]) => "N/A";
  const calculateCompletionRate = (_: any[]) => "N/A";

  const calculateTopDept = (data: any[]) => {
    if (!data.length) return "N/A";
    const deptCounts = data.reduce((acc: any, curr: any) => {
      const dept = curr.headquarters || "N/A";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(deptCounts).reduce((a, b) =>
      deptCounts[a] > deptCounts[b] ? a : b
    );
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-800">총 제출 수</h3>
              <BarChart3 className="w-5 h-5 text-sky-700" />
            </div>
            <p className="text-3xl font-extrabold text-sky-700">
              {stats.totalSubmissions}
            </p>
          </div>
          <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-800">
                평균 소요 시간
              </h3>
              <Calendar className="w-5 h-5 text-sky-700" />
            </div>
            <p className="text-3xl font-extrabold text-sky-700">
              {stats.avgTimeSpent}
            </p>
          </div>
          <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-800">완료율</h3>
              <BarChart3 className="w-5 h-5 text-sky-700" />
            </div>
            <p className="text-3xl font-extrabold text-sky-700">
              {stats.completionRate}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-gray-100">
          <h3 className="text-lg font-semibold text-sky-600 mb-4">상위 본부</h3>
          <p className="text-2xl font-extrabold text-sky-700">
            {stats.topDept}
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-sky-600 mb-4">
            제출 데이터
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
                  <th scope="col" className="px-6 py-3">
                    이메일
                  </th>
                </tr>
              </thead>
              <tbody>
                {surveyData.length > 0 ? (
                  surveyData.flatMap((entry, index) =>
                    (entry.slots || []).map((slot: any, slotIndex: number) => (
                      <tr
                        key={`${index}-${slotIndex}`}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          {format(new Date(entry.submittedAt), "yyyy-MM-dd", {
                            locale: enIN,
                          })}
                        </td>
                        <td className="px-6 py-4">{slot.timeRange || "N/A"}</td>
                        <td className="px-6 py-4">{slot.activity1 || "N/A"}</td>
                        <td className="px-6 py-4">{slot.activity2 || "N/A"}</td>
                        <td className="px-6 py-4">
                          {entry.headquarters || "N/A"}
                        </td>
                        <td className="px-6 py-4">{entry.division || "N/A"}</td>
                        <td className="px-6 py-4">{entry.group || "N/A"}</td>
                        <td className="px-6 py-4">{entry.position || "N/A"}</td>
                        <td className="px-6 py-4">
                          {entry.email || entry.userEmail || "N/A"}
                        </td>
                      </tr>
                    ))
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