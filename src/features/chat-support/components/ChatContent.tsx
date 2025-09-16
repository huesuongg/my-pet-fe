// src/features/chat-support/components/ChatContent.tsx
import React, { useCallback } from "react";
import ChatOtherHeader from "./ChatOtherHeader";
import MessageList from "./MessageList";
import MessageComposer from "./MessageComposer";
import type { Message } from "./types";

type Props = {
  otherName: string;
  otherAvatar: string;
  messages: Message[];
};

const ChatContent: React.FC<Props> = ({ otherName, otherAvatar, messages }) => {
  const handleSend = useCallback((t: string) => {
    console.log("send:", t);
  }, []);

  return (
    <section
      className="d-flex flex-column flex-grow-1"
      style={{ backgroundColor: "#EAF3FF", minHeight: 0 }}
    >
      {/* Header */}
      <div className="sticky-top bg-white border-bottom px-3 py-2">
        <ChatOtherHeader
          name={otherName}
          avatar={otherAvatar}
          status="Active"
        />
      </div>

      {/* Messages */}
      <div className="flex-grow-1 overflow-auto px-3 py-3">
        <MessageList
          messages={messages}
          otherAvatar={otherAvatar}
          dateLabel="Aug 22, 2022, 3:05 PM"
        />
      </div>

      {/* Composer */}
      <div className="bg-white border-top px-3 py-2">
        <MessageComposer onSend={handleSend} />
      </div>
    </section>
  );
};

export default ChatContent;
