import { useState } from "react";
import Xsvg from "../../../component/svgs/x";
import PersonIcon from "@mui/icons-material/Person"; // User icon
import EmailIcon from "@mui/icons-material/Email"; // Email icon
import LockIcon from "@mui/icons-material/Lock"; // Lock icon
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail"; // Username icon
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";


// Sanitization function to prevent XSS attacks
const sanitizeInput = (input) => {
    return input
      .replace(/</g, "&lt;") // Replace < with &lt;
      .replace(/>/g, "&gt;") // Replace > with &gt;
      .replace(/&/g, "&amp;") // Replace & with &amp;
      .replace(/"/g, "&quot;") // Replace " with &quot;
      .replace(/'/g, "&#x27;"); // Replace ' with &#x27;
  };

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });

  const submitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Sanitize form data
    const sanitizedData = {
      username: sanitizeInput(formData.username),
      fullname: sanitizeInput(formData.fullname),
      email: sanitizeInput(formData.email),
      password: sanitizeInput(formData.password),
    };

    // Validate form data
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    const fullnameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;

    if (
      sanitizedData.username.trim() === "" ||
      sanitizedData.fullname.trim() === "" ||
      sanitizedData.email.trim() === "" ||
      sanitizedData.password.trim() === ""
    ) {
      toast.error("Please fill all the fields", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      setIsLoading(false);
      return;
    }

    if (!usernameRegex.test(sanitizedData.username)) {
      toast.error(
        "Username must be 3-16 characters long and can only contain letters, numbers, and underscores",
        {
          style: {
            background: "#333",
            color: "#fff",
          },
        }
      );
      setIsLoading(false);
      return;
    }

    if (!fullnameRegex.test(sanitizedData.fullname)) {
      toast.error(
        "Full name must contain two names and be 3-50 characters long and can only contain letters and spaces",
        {
          style: {
            background: "#333",
            color: "#fff",
          },
        }
      );
      setIsLoading(false);
      return;
    }

    if (!emailRegex.test(sanitizedData.email)) {
      toast.error("Please enter a valid email address", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      setIsLoading(false);
      return;
    }

    if (sanitizedData.password.length < 8) {
      toast.error("Password must be at least 8 characters", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      setIsLoading(false);
      return;
    }

    // Simulate an API call
    setTimeout(() => {
      console.log("Form submitted", sanitizedData);
      toast.success("Account created successfully", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      setIsLoading(false);
      setFormData({
        username: "",
        fullname: "",
        email: "",
        password: "",
      });
    }, 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-evenly bg-gray-900 text-white p-3 md:p-6 dark:bg-gray-950">
      <Toaster />

      {/* Icon for larger screens */}
      <div className="hidden md:flex justify-center my-4">
        <Xsvg className={"w-52 h-52 text-blue-400"} />
      </div>

      <div className="w-full max-w-md bg-gray-800 p-4 md:p-6 rounded-2xl shadow-4xl dark:bg-gray-900">
        {/* Icon for smaller screens (inside the form) */}
        <div className="md:hidden flex justify-center my-4">
          <Xsvg className="w-12 h-12 text-blue-400" />
        </div>

        <h2 className="text-center text-2xl font-semibold my-4">
          Create an Account
        </h2>

        {/* Form */}
        <form className="flex flex-col space-y-6" onSubmit={submitForm}>
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-gray-400 text-sm mb-1"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AlternateEmailIcon className="text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:border-blue-400"
                placeholder="JohnDoe"
                required
                title="Username must be 3-16 characters long and can only contain letters, numbers, and underscores"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
          </div>

          {/* Full Name Field */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-gray-400 text-sm mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PersonIcon className="text-gray-400" />
              </div>
              <input
                id="fullName"
                type="text"
                className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:border-blue-400"
                placeholder="John Doe"
                required
                title="Full name must contain at least two words and only letters and spaces"
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-400 text-sm mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EmailIcon className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:border-blue-400"
                placeholder="you@example.com"
                required
                title="Please enter a valid email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-400 text-sm mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-10 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:border-blue-400"
                placeholder="••••••••"
                required
                title="Password must be at least 8 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <VisibilityOffIcon className="text-gray-400" />
                ) : (
                  <VisibilityIcon className="text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-3 !mt-8 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transform hover:translate-y-[-4px] transition-all focus:scale-95 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
