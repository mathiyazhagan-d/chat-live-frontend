
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Replace useHistory with useNavigate

const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [picLoading, setPicLoading] = useState(false);

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      alert("Please fill all the fields"); // Replace Chakra UI toast with a simple alert
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      alert("Passwords do not match"); // Replace Chakra UI toast with a simple alert
      setPicLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );

      alert("Registration Successful"); // Replace Chakra UI toast with a simple alert
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      navigate("/chats"); // Use navigate instead of history.push
    } catch (error) {
      alert(`Error Occurred: ${error.response.data.message}`); // Replace Chakra UI toast with a simple alert
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      alert("Please select an image!"); // Replace Chakra UI toast with a simple alert
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-live");
      data.append("cloud_name", "dfr2ledta");
      fetch("https://api.cloudinary.com/v1_1/dfr2ledta/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      alert("Please select a valid image (JPEG/PNG)!"); // Replace Chakra UI toast with a simple alert
      setPicLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={show ? "text" : "password"}
            placeholder="Enter Password"
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

      {/* Confirm Password Input */}
      <div>
        <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmpassword"
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
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

      {/* Profile Picture Upload */}
      <div>
        <label htmlFor="pic" className="block text-sm font-medium text-gray-700">
          Upload Your Picture
        </label>
        <input
          id="pic"
          type="file"
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Sign Up Button */}
      <button
        onClick={submitHandler}
        disabled={picLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {picLoading ? "Signing Up..." : "Sign Up"}
      </button>
    </div>
  );
};

export default Signup;