import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import StartTest from "./pages/StartTest";
import TestScreen from "./pages/TestScreen";
import TestFinished from "./pages/TestFinished";
import Blocked from "./pages/Blocked";
import AdminLogin from "./pages/AdminLogin";
import AdminResults from "./pages/AdminResults";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
  const sessionToken = useLocalStorage("SESSION_TOKEN");

  console.log("[App] App component rendered, sessionToken:", sessionToken);

  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-linear-to-br from-ice-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Default route → Register page */}
              <Route path="/" element={<Navigate to="/register" />} />

              {/* Public routes */}
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />

              {/* PROTECTED ROUTES */}
              <Route
                path="/start-test"
                element={
                  sessionToken ? <StartTest /> : <Navigate to="/register" />
                }
              />

              <Route
                path="/test-screen"
                element={
                  sessionToken ? <TestScreen /> : <Navigate to="/register" />
                }
              />

              <Route
                path="/test-finished"
                element={
                  sessionToken ? <TestFinished /> : <Navigate to="/register" />
                }
              />

              <Route path="/blocked" element={<Blocked />} />

              {/* ADMIN ROUTES */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/results" element={<AdminResults />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
