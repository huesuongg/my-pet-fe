// src/features/chat-support/components/MessageBubble.tsx
import React from "react";

export type Message = {
  id: string;
  sender: "me" | "other";
  text?: string;
  time?: string;
  type?: "text" | "link" | "call-card";
  callKind?: "outgoing" | "missed";
};

type Props = {
  msg: Message;
  avatarOther?: string;
};

const MessageBubble: React.FC<Props> = ({ msg, avatarOther }) => {
  if (msg.type === "call-card") {
    const isMe = msg.sender === "me";
    return (
      <div className={`flex mb-4 ${isMe ? "justify-start" : "justify-end"}`}>
        <div
          className={[
            "rounded-2xl shadow-sm border",
            "bg-white",
            "flex items-center gap-3 px-4 py-3",
          ].join(" ")}
        >
          <div className="w-10 h-10 rounded-lg bg-gray-200" />
          <div>
            <p className="font-semibold text-gray-700">
              {msg.callKind === "missed" ? "Missed Audio Call" : "Outgoing Audio Call"}
            </p>
            <p className="text-xs text-gray-400">{msg.time}</p>
          </div>
        </div>
      </div>
    );
  }

  const isMe = msg.sender === "me";

  return (
    <div className={`flex items-start gap-3 mb-4 ${isMe ? "justify-end" : ""}`}>
      {!isMe && (
        <img
          src={avatarOther}
          alt="other"
          className="w-12 h-12 rounded-full object-cover mt-1"
        />
      )}

      <div
        className={[
          "max-w-[60%] rounded-2xl px-4 py-2",
          isMe ? "bg-[#1D4ED8] text-white rounded-br-xl" : "bg-white text-gray-800 rounded-bl-xl",
          !isMe && "shadow-sm",
        ].join(" ")}
      >
        {msg.type === "link" ? (
          <a
            className={`underline break-words ${isMe ? "text-white" : "text-blue-600"}`}
            href={msg.text}
            target="_blank"
            rel="noreferrer"
          >
            {msg.text}
          </a>
        ) : (
          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
