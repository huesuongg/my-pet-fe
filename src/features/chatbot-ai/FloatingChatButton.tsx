import React from "react";
import styles from "./floatingChatButton.module.css";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

type Props = {
  onClick: () => void;
  ariaLabel?: string;
  unreadCount?: number;
};

const FloatingChatButton: React.FC<Props> = ({ onClick, ariaLabel = "Open chat", unreadCount }) => {
  return (
    <button
      type="button"
      className={styles.floatingChatButton}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <ChatBubbleOutlineIcon fontSize="medium" />
      {typeof unreadCount === "number" && unreadCount > 0 && (
        <span className={styles.badge}>{unreadCount > 99 ? "99+" : unreadCount}</span>
      )}
    </button>
  );
};

export default FloatingChatButton;
