// import { useState, useEffect } from "react";

export default function SignUp() {
  // Uncomment if you want to use dark mode
  // const [darkMode, setDarkMode] = useState(
  //   localStorage.getItem("theme") === "dark"
  // );

  // useEffect(() => {
  //   if (darkMode) {
  //     document.documentElement.classList.add("dark");
  //     localStorage.setItem("theme", "dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //     localStorage.setItem("theme", "light");
  //   }
  // }, [darkMode]);

  const submitForm = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="flex min-h-screen items-center justify-evenly bg-gray-900 text-white p-3 md:p-6 dark:bg-gray-950">
      {/* Icon for larger screens */}
      <div className="hidden md:flex justify-center my-4">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="w-48 h-48 text-blue-400"
          fill="currentColor"
        >
          <g>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </g>
        </svg>
      </div>

      <div className="w-full max-w-md bg-gray-800 p-5 md:p-6 rounded-2xl shadow-lg dark:bg-gray-900">
        {/* Icon for smaller screens (inside the form) */}
        <div className="md:hidden flex justify-center my-4">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="w-12 h-12 text-blue-400"
            fill="currentColor"
          >
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </g>
          </svg>
        </div>

        {/* Toggle Dark Mode Button (uncomment if needed)
        <div className="flex justify-end">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div> */}

        <h2 className="text-center text-2xl font-semibold my-4">
          Create an Account
        </h2>

        {/* Form */}
        <form className="flex flex-col space-y-5" onSubmit={submitForm}>
          <div>
            <label
              htmlFor="fullName"
              className="block text-gray-400 text-sm mb-1"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-400 text-sm mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-400 text-sm mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 !mt-8 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transform hover:translate-y-[-5px] transition-all"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
