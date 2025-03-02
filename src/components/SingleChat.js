import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ScrollableChat from "./ScrollableChat";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const ENDPOINT = "http://localhost:5000"; // Backend URL
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { selectedChat, setSelectedChat, user,notification,setNotification } = ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        setLoading(true);
        const { data } = await axios.get(
          `/api/message/${selectedChat._id}`,
          config
        );
        setMessages(data);
        setLoading(false);
        socket.emit("join chat", selectedChat._id);
      } catch (error) {
        alert("Failed to load messages");
      }
    };

    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //  if (!notification.includes(newMessageReceived)) {
        //    setNotification([newMessageReceived, ...notification]);
        //    setFetchAgain(!fetchAgain);
        //  }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });
  }, []);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat },
          config
        );
        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        alert("Failed to send the message");
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= 3000 && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, 3000);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col w-full h-full p-4 bg-gray-100 rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-300">
            <button onClick={() => setSelectedChat(null)} className="md:hidden">
              <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
            <div className="text-xl font-semibold">
              {!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={() => {}}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              )}
            </div>
          </div>

          {/* Chat Messages (Fix: Ensures input stays at bottom) */}
          <div className="flex flex-col flex-grow overflow-hidden">
            <div className="flex-grow overflow-y-auto">
              {messages.length > 0 ? (
                <ScrollableChat messages={messages} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No messages yet, start the conversation!
                </div>
              )}
            </div>

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ width: "70px", height: "30px" }}>
                <Lottie options={defaultOptions} height="100%" width="100%" />
              </div>
            )}

            {/* Message Input */}
            <div className="p-2 bg-white border-t border-gray-300">
              <input
                type="text"
                placeholder="Enter a message..."
                className="w-full p-3 bg-gray-200 rounded-lg outline-none"
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={sendMessage}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          Click on a user to start chatting
        </div>
      )}
    </>
  );
};

export default SingleChat;
