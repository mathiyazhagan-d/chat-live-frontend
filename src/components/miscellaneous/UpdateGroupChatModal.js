import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const { selectedChat, setSelectedChat, user } = ChatState();
  const navigate = useNavigate();

  // Search users
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading search results", error);
      setLoading(false);
    }
  };

  // Rename Group Chat
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setShowModal(false); // Close modal after renaming
    } catch (error) {
      console.error("Error renaming group", error);
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  // Add User to Group
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) return;

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      console.error("Error adding user", error);
      setLoading(false);
    }
  };

  // Remove User from Group
  const handleRemove = async (user1) => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      if (user1._id === user._id) {
        setSelectedChat(null);
      } else {
        setSelectedChat(data);
      }

      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      console.error("Error removing user", error);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button to Open Modal */}
      <button
        onClick={() => setShowModal(true)}
        className="p-2 rounded-md"
      >
        👁️
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            <h2 className="text-2xl font-semibold text-center mb-4">
              {selectedChat.chatName}
            </h2>

            {/* List of Selected Users */}
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </div>

            {/* Rename Group Input */}
            <div className="flex mb-3">
              <input
                type="text"
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                className="flex-1 border p-2 rounded-l"
              />
              <button
                onClick={handleRename}
                className="bg-teal-500 text-white px-4 py-2 rounded-r"
                disabled={renameloading}
              >
                {renameloading ? "Updating..." : "Update"}
              </button>
            </div>

            {/* Add User Input */}
            <input
              type="text"
              placeholder="Add User to group"
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />

            {/* Search Results */}
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}

            {/* Leave Group Button */}
            <div className="text-center mt-4">
              <button
                onClick={() => handleRemove(user)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Leave Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupChatModal;
