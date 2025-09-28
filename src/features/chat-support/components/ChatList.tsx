// src/components/chat/ChatList.tsx
import React from "react";
import ChatChannel from "./ChatChannel";
import { ChatChannelType } from "./types";

type Props = {
  channels: ChatChannelType[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

const ChatList: React.FC<Props> = ({ channels, activeId, onSelect }) => {
  return (
    <div className="flex flex-col">
      {channels.map((c, idx) => (
        <div key={c.id}>
          <ChatChannel
            channel={c}
            active={c.id === activeId}
            onClick={onSelect}
          />
          {/* đường kẻ rất mảnh giống ảnh 2 */}
          {idx !== channels.length - 1 && (
            <div className="mx-3 border-b border-gray-100" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
