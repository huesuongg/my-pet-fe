// src/features/chat-support/components/types.ts
export type ChatChannelType = {
  id: string;
  name: string;
  avatar: string;
  verified?: boolean;
  /** Giữ để tương thích cũ, nhưng không bắt buộc nữa */
  lastMessage?: string;

  /** Layout mới giống mock */
  previewBold: string;      // phần đậm đầu dòng
  previewRest?: string;     // phần còn lại
  time: string;             // ví dụ "2 days"
};

export type Message = {
  id: string;
  sender: "me" | "other";
  text?: string;
  time?: string;
  type?: "text" | "link" | "call-card";
};
