import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login"); // State to manage active tab

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('../public/background.jpg')",
      }}
    >
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative w-full max-w-xl p-4">
        <div className="text-center p-6 bg-white rounded-lg shadow-md mb-8">
          <h1 className="text-4xl font-sans font-bold text-gray-800">
            chat-live
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Tabs */}
          <div className="flex justify-around mb-4">
            <button
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === "login"
                  ? "bg-blue-600 text-white" // Active tab style
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300" // Inactive tab style
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === "signup"
                  ? "bg-blue-600 text-white" // Active tab style
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300" // Inactive tab style
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "login" && (
              <div className="tab-panel">
                <Login />
              </div>
            )}
            {activeTab === "signup" && (
              <div className="tab-panel">
                <Signup />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
