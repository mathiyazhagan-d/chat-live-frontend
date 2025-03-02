const ChatLoading = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="h-11 bg-gray-300 animate-pulse rounded-md"
        ></div>
      ))}
    </div>
  );
};

export default ChatLoading;
