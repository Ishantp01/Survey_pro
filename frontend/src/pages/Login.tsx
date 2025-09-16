import React, { useState } from "react";
import { User, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Heading from "../components/Heading";
import { apiFetch } from "../utils/api";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!email || !password) {
        setError("이메일과 비밀번호를 입력해 주세요");
        return;
      }
      const res = await apiFetch(`/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 420 || (res.ok && data && data.success)) {
        if (data && data.token) {
          login(data.token);
        } else {
          setError("Unexpected response from server");
        }
        return;
      }
      setError((data && data.message) || "Login failed");
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex-col bg-gradient-to-br from-green-50 to-white flex justify-center items-center px-4 py-10">
      <Heading />
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-3xl w-full border border-gray-100">
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}
        {/* Description */}
        <div className="text-gray-700 text-sm leading-relaxed mb-8 text-center">
          <p></p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={onSubmit}>
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-green-700" />
              "조사 관련 안내 메일을 받으신 이메일 주소를 입력해
              주세요(예:yoonk.lee@poscointl.com)"
            </label>

            <input
              type="text"
              placeholder="ID를 입력해 주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white transition"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-700" />
              임시비밀 번호 입력
            </label>
            <input
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white transition"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-700 cursor-pointer text-white font-semibold px-10 py-3 rounded-lg shadow-lg hover:bg-green-800 transition transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
