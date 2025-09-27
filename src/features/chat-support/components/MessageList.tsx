// src/features/chat-support/components/MessageList.tsx
import React from "react";
import type { Message } from "./types";

type Props = {
  messages: Message[];
  otherAvatar: string;
  dateLabel?: string;
};

const MessageList: React.FC<Props> = ({ messages, otherAvatar, dateLabel }) => {
  return (
    <div>
      {dateLabel && (
        <div className="text-center mb-3">
          <span className="badge text-bg-light border">{dateLabel}</span>
        </div>
      )}

      {messages.map((m) => {
        const isMe = m.sender === "me";
        const bubbleBase =
          "p-2 rounded-4 shadow-sm";
        const bubbleClass = isMe ? "bg-primary text-white" : "bg-white border";
        const wrapperJustify = isMe ? "justify-content-end" : "justify-content-start";

        return (
          <div
            key={m.id}
            className={`d-flex ${wrapperJustify} align-items-end mb-2`}
          >
            {/* Avatar cho 'other' */}
            {!isMe && (
              <img
                src={otherAvatar}
                alt="other"
                className="rounded-circle me-2"
                style={{ width: 32, height: 32, objectFit: "cover" }}
              />
            )}

            {/* Bubble */}
            <div
              className={`${bubbleBase} ${bubbleClass}`}
              style={{ maxWidth: "75%" }}
            >
              {m.type === "call-card" ? (
                <div className={`p-2 ${isMe ? "text-white" : ""}`}>
                  <div className="fw-semibold mb-1">Audio Call</div>
                  <div className={`small ${isMe ? "text-white-50" : "text-muted"}`}>
                    {m.time ?? "Now"}
                  </div>
                </div>
              ) : m.type === "link" && m.text ? (
                <a
                  href={m.text}
                  target="_blank"
                  rel="noreferrer"
                  className={isMe ? "text-white text-decoration-underline" : ""}
                >
                  {m.text}
                </a>
              ) : (
                <span>{m.text}</span>
              )}
            </div>

            {/* Avatar cho 'me' (ẩn) – giữ layout gọn, không render */}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
