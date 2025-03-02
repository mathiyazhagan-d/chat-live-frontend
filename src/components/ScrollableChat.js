import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div className="flex items-center" key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <div className="relative group">
                <img
                  className="w-8 h-8 rounded-full mr-2 cursor-pointer"
                  src={m.sender.pic}
                  alt={m.sender.name}
                />
                <span className="absolute bottom-0 left-0 hidden group-hover:block text-xs bg-gray-800 text-white px-2 py-1 rounded-md">
                  {m.sender.name}
                </span>
              </div>
            )}
            <span
              className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm ${
                m.sender._id === user._id ? "bg-blue-200" : "bg-green-200"
              }`}
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
