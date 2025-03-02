import { useState } from "react";

const ProfileModal = ({ user, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {children ? (
        <span onClick={() => setIsOpen(true)}>{children}</span>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
        >
          👁
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <img
                className="w-36 h-36 rounded-full border"
                src={user.pic}
                alt={user.name}
              />
              <p className="text-lg">Email: {user.email}</p>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileModal;
