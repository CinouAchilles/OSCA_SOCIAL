import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/auth/signup/SignUp";
import Login from "./pages/auth/login/Login";
import HomePage from "./pages/home/HomePage";
import Notfound from "./pages/Notfound";

function App() {
  return (
    <div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="*" element={<Notfound/>}/>
      </Routes>

    </div>
  );
}

export default App;
