// src/features/chat-support/components/ChatOtherHeader.tsx
import React from "react";

type Props = {
  name: string;
  avatar: string;
  status?: string; // "Active"
};

const ChatOtherHeader: React.FC<Props> = ({
  name,
  avatar,
  status = "Active",
}) => {
  return (
    <div className="d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-2">
        <img
          src={avatar}
          alt={name}
          className="rounded-circle"
          style={{ width: 40, height: 40, objectFit: "cover" }}
        />
        <div className="d-flex flex-column">
          <strong>{name}</strong>
          <small className="text-success">{status}</small>
        </div>
      </div>

    
    </div>
  );
};

export default ChatOtherHeader;
