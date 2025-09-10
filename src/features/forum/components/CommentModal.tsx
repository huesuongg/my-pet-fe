// src/components/CommentModal.tsx
import { createPortal } from "react-dom";
import profilePic from "../../../assets/profile-pic.jpg";
import Post from "./Post";
import { useEffect, useRef, useCallback } from "react";

interface CommentModalProps {
  onClose: () => void;
  title?: string; // tiêu đề modal, mặc định giống FB: "Bài viết của Huy"
}

const CommentModal: React.FC<CommentModalProps> = ({
  onClose,
  title = "Bài viết của Huy",
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // lock body scroll while open
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  // click outside to close
  const onOverlayMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        onClose();
    },
    [onClose]
  );

  const overlay = (
    <div
      className="modal fade show d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,.5)", display: "block" }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={onOverlayMouseDown}
    >
      <div
        ref={panelRef}
        className="modal-dialog modal-dialog-centered modal-xl"
        role="document"
      >
        <div className="modal-content" style={{ maxHeight: "90vh" }}>
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title fw-semibold">{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          {/* Body: hiển thị lại nội dung Post như cũ */}
          <div className="modal-body overflow-auto">
            <Post />
          </div>

          {/* Footer: khung nhập bình luận (giống ảnh) */}
          <div className="modal-footer w-100">
            <div className="d-flex align-items-start w-100 gap-2">
              <img
                src={profilePic}
                alt="Me"
                className="rounded-circle"
                style={{ width: 36, height: 36, objectFit: "cover" }}
              />
              <div className="flex-grow-1">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Bình luận dưới tên Quốc Huy"
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    title="Gửi"
                  >
                    ✈️
                  </button>
                </div>
                <div className="d-flex align-items-center gap-2 mt-2 text-muted">
                  <button className="btn btn-sm btn-light">😊</button>
                  <button className="btn btn-sm btn-light">📷</button>
                  <button className="btn btn-sm btn-light">🎞️</button>
                  <button className="btn btn-sm btn-light">📎</button>
                  <button className="btn btn-sm btn-light">GIF</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
};

export default CommentModal;
