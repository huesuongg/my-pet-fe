// src/components/chat/ChatChannel.tsx
import React from "react";
import { ChatChannelType } from "./types";
import styles from "./chatChannel.module.css";

type Props = {
  channel: ChatChannelType;
  active?: boolean;
  onClick: (id: string) => void;
};

const ChatChannel: React.FC<Props> = ({ channel, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(channel.id)}
      className={`${styles.container} ${active ? styles.active : ""}`}
    >
      {/* Avatar */}
      <img
        src={channel.avatar}
        alt={channel.name}
        className={styles.avatar}
      />

      {/* Text block */}
      <div className={styles.textBlock}>
        {/* Header (name + verified) */}
        <div className={styles.header}>
          <p className={styles.name} title={channel.name}>
            {channel.name}
          </p>
          {channel.verified && <span className={styles.verified} aria-label="verified" />}
        </div>

        {/* Preview + time */}
        <div className={styles.previewRow}>
          <span className={styles.previewBold} title={channel.previewBold}>
            {channel.previewBold}
          </span>

          {channel.previewRest && (
            <span className={styles.previewRest} title={channel.previewRest}>
              {channel.previewRest}
            </span>
          )}

          <span className={styles.dot}>•</span>
          <span className={styles.time}>{channel.time}</span>
        </div>
      </div>
    </button>
  );
};

export default ChatChannel;
