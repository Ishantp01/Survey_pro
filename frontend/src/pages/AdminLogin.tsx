import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { login } = useAuth();

  const handleLogin = () => {
    if (
      credentials.username === "admin" &&
      credentials.password === "admin123"
    ) {
      login("admin_dummy_token", "admin"); // Pass "admin" as role
      toast.success("✅ Logged in successfully!");
    } else {
      toast.error("❌ Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 via-white to-sky-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center bg-sky-200 rounded-full mb-4">
            <Lock className="w-8 h-8 text-sky-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
        </div>

        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
          className="w-full mb-4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          className="w-full mb-6 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-lg transition-all duration-300"
        >
          Login
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default AdminLogin;
