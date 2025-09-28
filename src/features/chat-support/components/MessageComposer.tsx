// src/features/chat-support/components/MessageComposer.tsx
import React, { useCallback, useState } from "react";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

type Props = {
  onSend: (text: string) => void;
  onAttach?: () => void;
  onCamera?: () => void;
  onEmoji?: () => void;
  onMic?: () => void;
};

const MessageComposer: React.FC<Props> = ({
  onSend,
  onAttach,
  onCamera,
  onEmoji,
  onMic,
}) => {
  const [value, setValue] = useState("");

  const doSend = useCallback(() => {
    const t = value.trim();
    if (!t) return;
    onSend(t);
    setValue("");
  }, [value, onSend]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      doSend();
    }
  };

  return (
    <div className="d-flex align-items-center gap-2">
      {/* Pill input with icons inside */}
      <div className="input-group bg-white border rounded-pill shadow-sm overflow-hidden">
        {/* Mic (left) */}
        <button
          type="button"
          className="btn btn-link text-primary px-3"
          onClick={onMic}
          title="Voice"
        >
          <MicNoneOutlinedIcon fontSize="small" />
        </button>

        {/* Text input */}
        <input
          type="text"
          className="form-control border-0"
          placeholder="Write Something..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          style={{ boxShadow: "none" }}
        />

        {/* Right icons */}
        <button
          type="button"
          className="btn btn-link text-primary px-2"
          onClick={onAttach}
          title="Attach"
        >
          <AttachFileOutlinedIcon fontSize="small" />
        </button>
        <button
          type="button"
          className="btn btn-link text-primary px-2"
          onClick={onCamera}
          title="Camera"
        >
          <PhotoCameraOutlinedIcon fontSize="small" />
        </button>
        <button
          type="button"
          className="btn btn-link text-primary px-3"
          onClick={onEmoji}
          title="Emoji"
        >
          <InsertEmoticonOutlinedIcon fontSize="small" />
        </button>
      </div>

      {/* Send button (separate circle) */}
      <button
        type="button"
        className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-0"
        style={{ width: 40, height: 40 }}
        onClick={doSend}
        title="Send"
      >
        <SendRoundedIcon />
      </button>
    </div>
  );
};

export default MessageComposer;
