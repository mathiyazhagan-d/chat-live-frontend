import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const navigate = useNavigate();

  // Fetch chats from the server
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  };

  // Set logged user and fetch chats on component mount or when `fetchAgain` changes
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setLoggedUser(userInfo);
    } else {
      navigate("/login"); // Redirect to login if userInfo is not available
    }
    fetchChats();
  }, [fetchAgain]);

  return (
    <div
      className={`${
        selectedChat ? "hidden md:flex" : "flex"
      } flex-col items-center p-3 bg-white w-full md:w-1/3 rounded-lg border border-gray-300`}
    >
      {/* Header */}
      <div className="flex justify-between items-center w-full pb-3 px-3 text-xl md:text-2xl font-semibold">
        My Chats
        <GroupChatModal>
          <button className="flex items-center px-3 py-2 text-sm md:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            New Group Chat
          </button>
        </GroupChatModal>
      </div>

      {/* Chat List */}
      <div className="flex flex-col p-3 bg-gray-100 w-full h-full rounded-lg overflow-y-auto">
        {chats && chats.length > 0 ? (
          <div className="space-y-2">
            {chats.map((chat) => {
              // Get the sender's name or group chat name
              const senderName = chat.isGroupChat
                ? chat.chatName
                : getSender(loggedUser, chat.users);

              return (
                <div
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className={`cursor-pointer px-3 py-2 rounded-lg ${
                    selectedChat === chat
                      ? "bg-teal-500 text-white"
                      : "bg-gray-200"
                  } hover:bg-gray-300`}
                >
                  <p className="font-medium">{senderName}</p>
                  {chat.latestMessage && (
                    <p className="text-xs text-gray-600">
                      <b>{chat.latestMessage.sender.name}: </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default MyChats;
