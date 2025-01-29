import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/auth/signup/SignUp";
import Login from "./pages/auth/login/Login";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
    <div>
      <h1 className="testh1 text-center  text-6xl">Hello World</h1>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/" element={<Login />} />
        <Route path="/" element={<SignUp/>} />
      </Routes>

    </div>
  );
}

export default App;
