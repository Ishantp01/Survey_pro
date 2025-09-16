import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
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
        {/* Form access route - requires authentication */}
        <Route
          path="/form/:linkId"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            // <ProtectedRoute>
            //   <Admin />
            // </ProtectedRoute>
            <Admin/ >
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
