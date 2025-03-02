import { XMarkIcon } from "@heroicons/react/24/solid";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <div
      className="inline-flex items-center bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-lg m-1 cursor-pointer hover:bg-purple-600"
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span className="ml-1">(Admin)</span>}
      <XMarkIcon className="h-4 w-4 ml-2" />
    </div>
  );
};

export default UserBadgeItem;
