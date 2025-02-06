import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/auth/signup/SignUp";
import Login from "./pages/auth/login/Login";
import HomePage from "./pages/home/HomePage";
import Notfound from "./pages/Notfound";
import NotificationsPage from "./pages/notification/NotificationsPage";
import ProfilePage from "./pages/profile/Profile";
import { useQuery } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { Toaster } from "react-hot-toast";

function App() {
  const { data:authUser, isLoading, error, isError } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = res.json();
        if(data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message || "Network error");
      }
    },
  });
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-900">
        <div className="flex flex-col items-center">
          <CircularProgress size={60} thickness={5} color="primary" />
          <p className="mt-4 text-gray-300 text-lg font-semibold animate-pulse">
            Loading, please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path="/" element={authUser ?  <HomePage /> : <Navigate to="login"/>} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/"/>} />
        <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/"/>} />
        <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to="/login"/> } />
        <Route path="/profile/:username" element={authUser ? <ProfilePage />: <Navigate to="/login"/> }/>
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  );
}

export default App;
