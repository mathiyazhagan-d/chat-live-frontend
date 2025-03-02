import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "../ChatLoading";
import ProfileModal from "./ProfileModal";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge, { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  // Handle Click Outside for Notifications & Profile Dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      alert("Please enter something in search");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
    } catch (error) {
      alert("Error occurred! Failed to load search results.");
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setIsDrawerOpen(false);
    } catch (error) {
      alert("Error fetching the chat.");
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <div className="flex justify-between items-center bg-white w-full p-2 border-b-2 shadow-sm">
        {/* Search Button */}
        <button
          className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md"
          onClick={() => setIsDrawerOpen(true)}
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
          <span className="hidden md:inline">Search User</span>
        </button>

        {/* Logo */}
        <h1 className="text-2xl font-semibold">Chat-Live</h1>

        {/* Icons: Notification & Profile */}
        <div className="flex items-center space-x-4">
          {/* Notification Icon with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="cursor-pointer relative"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon className="h-6 w-6 text-gray-700" />
            </div>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                <div className="p-3 font-semibold border-b">Notifications</div>
                <ul className="max-h-64 overflow-y-auto">
                  {notification.length > 0 ? (
                    notification.map((item, index) => (
                      <li
                        key={index}
                        className="p-3 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        {item.chat.isGroupChat
                          ? `New Message in ${item.chat.chatName}`
                          : `New Message from ${getSender(
                              user,
                              item.chat.users
                            )}`}
                      </li>
                    ))
                  ) : (
                    <li className="p-3 text-sm text-gray-500">
                      No new notifications
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center space-x-2 bg-white p-2 rounded-md"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img
                src={user.pic}
                alt="Avatar"
                className="h-8 w-8 rounded-full"
              />
              <ChevronDownIcon className="h-4 w-4 text-gray-700" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md">
                <ProfileModal user={user}>
                  <button className="block px-4 py-2 text-left w-full hover:bg-gray-100">
                    My Profile
                  </button>
                </ProfileModal>
                <hr />
                <button
                  onClick={logoutHandler}
                  className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-start">
          <div className="bg-white w-96 h-full shadow-lg p-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold">Search Users</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center mt-4 border border-gray-300 rounded-md overflow-hidden">
              <span className="p-2 bg-gray-200">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
              </span>
              <input
                type="text"
                placeholder="Search by name or email"
                className="flex-1 p-2 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
              >
                Go
              </button>
            </div>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}

            {loadingChat && (
              <p className="text-center text-gray-500 mt-2">Loading...</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SideDrawer;
