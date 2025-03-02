import { useNavigate } from "react-router-dom";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  const navigate = useNavigate();

  return (
    <div
      className={`${
        selectedChat ? "flex" : "hidden md:flex"
      } flex-col items-center p-3 bg-white w-full md:w-[68%] rounded-lg border border-gray-300`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default Chatbox;
