// src/components/chat/ChatSideBar.tsx
import React from "react";
import ChatList from "./ChatList";
import { ChatChannelType } from "./types";
import { Search } from "@mui/icons-material";

type Props = {
  channels: ChatChannelType[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

const ChatSideBar: React.FC<Props> = ({ channels, activeId, onSelect }) => {
  return (
    <aside
      className="d-flex flex-column border-end bg-white"
      style={{ width: 320, height: "100%", minHeight: 0 }}
    >
      {/* Header */}
      <div className="px-4 pt-2 pb-2">
        <div className="d-flex align-items-center justify-content-center position-relative">
          <h1 className="fs-5 fw-semibold mb-0">Chats</h1>
        </div>
      </div>

      {/* Search pill */}
      <div className="px-3 pb-2">
        <div className="input-group rounded-pill bg-body-tertiary">
          <Search className="position-absolute text-muted" style={{ left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <div style={{ width: 32 }} /> {/* khoảng trống cho icon */}
          <input
            type="text"
            className="form-control border-0 bg-transparent"
            placeholder="Search contact / chat"
          />
        </div>
      </div>

      {/* Chỉ ChatList cuộn */}
      <div className="flex-grow-1 overflow-auto" style={{ minHeight: 0 }}>
        <ChatList channels={channels} activeId={activeId} onSelect={onSelect} />
      </div>
    </aside>
  );
};

export default ChatSideBar;
