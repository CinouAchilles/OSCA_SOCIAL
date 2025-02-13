import { useState } from "react";
import Xsvg from "../../../component/svgs/x";
import EmailIcon from "@mui/icons-material/Email"; // Email icon
import LockIcon from "@mui/icons-material/Lock"; // Lock icon
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";

// Sanitization function to prevent XSS attacks
const sanitizeInput = (input) => {
  return input
    .replace(/</g, "&lt;") // Replace < with &lt;
    .replace(/>/g, "&gt;") // Replace > with &gt;
    .replace(/&/g, "&amp;") // Replace & with &amp;
    .replace(/"/g, "&quot;") // Replace " with &quot;
    .replace(/'/g, "&#x27;"); // Replace ' with &#x27;
};

//todo ,, when someone login next time when he try to login he will find hes account ready in corner of the page and just modify the logo of x put it in form

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const queryClient = useQueryClient()

  const { mutate  } = useMutation({
    mutationFn: async (userData) => {
      setIsLoading(true); // Set loading state before request
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error.message || "Network error");
      }
    },
    onSuccess: () => {
      setFormData({ email: "", password: "" });
      // navigate("/"); // Uncomment to navigate after login
      queryClient.invalidateQueries({queryKey: ["authUser"]})

      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const submitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Sanitize form data
    const sanitizedData = {
      email: sanitizeInput(formData.email),
      password: sanitizeInput(formData.password),
    };

    // Validate form data
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (
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
    console.log("Logging in...");

    toast
      .promise(
        new Promise((resolve, reject) => {
          mutate(sanitizedData, {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error),
          });
        }),
        {
          loading: "Logging in...",
          success: <b>Logged in successfully!</b>,
          error: (error) => <b>{error.message || "Something went wrong"}.</b>,
        },
        {
          style: { background: "#333", color: "#fff" },
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };
  //tomorrow inchallah modify the code to save the token in the local storage and redirect the user to the dashboard and finisht the logout functionality 


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
          Log in to Your Account
        </h2>

        {/* Form */}
        <form className="flex flex-col space-y-6" onSubmit={submitForm}>
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
            className="w-full p-3 !mt-8 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transform hover:translate-y-[-4px] transition-all focus:scale-95"
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Log In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup" // Link to your signup page
            className="text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
