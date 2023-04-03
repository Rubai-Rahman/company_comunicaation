type Message = {
  id: number;
  text: string;
  sender: "me" | "other";
};

const messages: Message[] = [
  {
    id: 1,
    text: "Hey, how's it going?",
    sender: "other",
  },
  {
    id: 2,
    text: "Pretty good, thanks for asking!",
    sender: "me",
  },
  {
    id: 3,
    text: "What have you been up to lately?",
    sender: "me",
  },
  {
    id: 4,
    text: "Just working on some projects, you?",
    sender: "other",
  },
  {
    id: 5,
    text: "Same here, just keeping busy with work.",
    sender: "me",
  },
];

const Chat: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <div className="flex flex-row items-center justify-between bg-white p-4 border-b-2 border-gray-300">
        <div className="flex flex-row items-center space-x-2">
          <span className="text-lg font-semibold text-gray-800">Chat</span>
        </div>
        <button className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-scroll p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.sender === "me" ? "items-end" : "items-start"
            } mb-4`}
          >
            <div
              className={`max-w-xs rounded-lg shadow-md ${
                message.sender === "me"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-300">
                <span className="font-semibold">
                  {message.sender === "me" ? "You" : "Other Person"}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="px-4 py-2">{message.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
