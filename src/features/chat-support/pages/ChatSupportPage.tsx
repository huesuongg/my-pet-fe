// src/features/chat-support/pages/ChatSupportPage.tsx
import React, { useMemo, useState } from "react";
import { ChatChannelType, Message } from "../components/types";
import ChatSideBar from "../components/ChatSideBar";
import ChatContent from "../components/ChatContent";

// Tạo nhiều channel demo
const makeChannels = (n: number): ChatChannelType[] =>
  Array.from({ length: n }, (_, i) => ({
    id: String(i + 1),
    name: `User ${i + 1}`,
    avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
    verified: i % 5 === 0,
    previewBold: `Sample preview message ${i + 1}`,
    time: `${(i % 59) + 1} min`,
  }));

// Tạo nhiều message demo
const makeMessages = (n: number): Message[] =>
  Array.from({ length: n }, (_, i) => {
    const isMe = i % 2 === 0;
    if (i % 10 === 0) {
      return { id: `m${i}`, sender: isMe ? "me" : "other", type: "call-card", time: "03:29 PM" };
    }
    if (i % 6 === 0) {
      return {
        id: `m${i}`,
        sender: isMe ? "me" : "other",
        type: "link",
        text: "https://www.envato.com/atomic-power-plant-engine/",
        time: "03:29 PM",
      };
    }
    return {
      id: `m${i}`,
      sender: isMe ? "me" : "other",
      type: "text",
      text: isMe ? "Thanks! Checking now." : "I hope this article helps.",
      time: "03:29 PM",
    };
  });

const ChatSupportPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string>("2");

  const channels = useMemo(() => makeChannels(40), []);
  const messages = useMemo(() => makeMessages(80), []);

  const active = channels.find((c) => c.id === activeId) ?? channels[0];

  return (
    <div
      className="position-relative d-flex bg-white shadow rounded overflow-hidden m-5"
      style={{ height: "calc(100vh - 6rem)" }} // m-5: 3rem top + 3rem bottom
    >
      {/* Nút mở sidebar (mobile) */}
      <button
        className="btn btn-light border position-absolute top-0 start-0 m-2 d-lg-none z-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebarOffcanvas"
        aria-controls="sidebarOffcanvas"
        title="Open chats"
      >
        ☰ Chats
      </button>

      {/* Sidebar cố định trên ≥ lg; ẩn trên < lg */}
      <div className="d-none d-lg-block">
        <ChatSideBar
          channels={channels}
          activeId={activeId}
          onSelect={setActiveId}
        />
      </div>

      {/* Content – luôn hiển thị full phần còn lại */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden" style={{ minWidth: 0 }}>
        <ChatContent
          otherName={active.name}
          otherAvatar={active.avatar}
          messages={messages}
        />
      </div>

      {/* Offcanvas Sidebar cho mobile */}
      <div
        className="offcanvas offcanvas-start d-lg-none"
        tabIndex={-1}
        id="sidebarOffcanvas"
        aria-labelledby="sidebarOffcanvasLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="sidebarOffcanvasLabel">Chats</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body p-0">
          {/* Dùng lại ChatSideBar; để vừa offcanvas, ta bọc trong div đặt width 100% */}
          <div style={{ width: "100%", height: "100%" }}>
            <ChatSideBar
              channels={channels}
              activeId={activeId}
              onSelect={(id) => {
                setActiveId(id);
                // đóng offcanvas sau khi chọn
                const el = document.getElementById("sidebarOffcanvas");
                if (el) {
                  const bootstrap = (window as typeof window & { bootstrap?: { Offcanvas?: { getOrCreateInstance: (el: HTMLElement) => { hide?: () => void } } } }).bootstrap;
                  const off = bootstrap?.Offcanvas?.getOrCreateInstance(el);
                  off?.hide?.();
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSupportPage;
