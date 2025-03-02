import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Replace useHistory with useNavigate
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Replace useHistory with useNavigate
  const { setUser } = ChatState();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      alert("Please fill all the fields"); // Replace Chakra UI toast with a simple alert
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      alert("Login Successful"); // Replace Chakra UI toast with a simple alert
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats"); // Use navigate instead of history.push
    } catch (error) {
      alert(`Error Occurred: ${error.response.data.message}`); // Replace Chakra UI toast with a simple alert
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Email Input */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Password Input */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={show ? "text" : "password"}
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleClick}
            className="absolute inset-y-0 right-0 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Login Button */}
      <button
        onClick={submitHandler}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* Guest User Credentials Button */}
      <button
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
        className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Get Guest User Credentials
      </button>
    </div>
  );
};

export default Login;
