import React from "react";

interface TypingIndicatorProps {
  typingUsers: { [key: string]: string };
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (Object.keys(typingUsers).length === 0) return null;
  return (
    <div className="flex items-center space-x-2 p-3 text-sm text-gray-500">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      </div>
      <span>
        {Object.values(typingUsers).join(", ")}
        {Object.keys(typingUsers).length === 1 ? " is" : " are"} typing...
      </span>
    </div>
  );
};

export default TypingIndicator; 