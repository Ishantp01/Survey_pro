import React from "react";
import { User, Lock } from "lucide-react"; // icons for username and password

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex justify-center items-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-3xl w-full border border-gray-100">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-green-700 mb-4 text-center">
          POSCO International 로그인
        </h1>

        {/* Description */}
        <div className="text-gray-700 text-sm leading-relaxed mb-8 text-center">
          <p></p>
        </div>

        {/* Form */}
        <form className="space-y-6">
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 hover:bg-white transition"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-700 cursor-pointer text-white font-semibold px-10 py-3 rounded-lg shadow-lg hover:bg-green-800 transition transform hover:scale-[1.02]"
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
