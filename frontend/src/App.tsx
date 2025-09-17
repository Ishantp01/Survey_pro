
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin"; 
import ProtectedRoute from "./components/ProtectedRoute";
import Generateform from "./pages/Generateform";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

      

         <Route
          path="/generate-form-link"
          element={
            // <ProtectedRoute>
            //   <Generateform />
            // </ProtectedRoute>
            <Generateform />
          }
        />
        {/* Form access route - public access via form link */}
        <Route
          path="/form/:linkId"
          element={<Home />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;