// src/components/PostModal.tsx
import React, { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import profilePic from "../../../assets/profile-pic.jpg";

interface PostModalProps {
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ onClose }) => {
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    const { classList } = document.body;
    classList.add("overflow-hidden");
    return () => classList.remove("overflow-hidden");
  }, []);

  // Click outside to close
  const onOverlayMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  }, [onClose]);

  const overlay = (
    <div
      className="modal fade show d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", display: "block" }}
      role="dialog"
      aria-modal="true"
      aria-label="Tạo bài viết"
      onMouseDown={onOverlayMouseDown}
    >
      <div
        ref={panelRef}
        className="modal-dialog modal-dialog-centered modal-lg"
      >
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">Tạo bài viết</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            >
             
            </button>
          </div>

          {/* Content */}
          <div className="modal-body">
            {/* User info */}
            <div className="d-flex align-items-center mb-3">
              <img
                src={profilePic}
                alt="Profile"
                className="rounded-circle me-2"
                style={{ width: "48px", height: "48px", objectFit: "cover" }}
              />
              <div>
                <p className="fw-semibold mb-0">Cristiano Ronaldo</p>
                <small className="text-muted"><span className="me-1">🔒</span> Chỉ mình tôi</small>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              className="form-control mb-3"
              rows={4}
              placeholder="Bạn đang nghĩ gì?"
            />

            {/* Add to post */}
            <div className="d-flex justify-content-between align-items-center border rounded p-2">
              <span className="fw-semibold text-secondary">Thêm vào bài viết của bạn</span>
              <div className="d-flex gap-2 fs-5">
                <button className="btn btn-link p-0" title="Ảnh" aria-label="Ảnh">🖼️</button>
                <button className="btn btn-link p-0" title="Gắn thẻ" aria-label="Gắn thẻ">👥</button>
                <button className="btn btn-link p-0" title="Cảm xúc" aria-label="Cảm xúc">😊</button>
                <button className="btn btn-link p-0" title="Vị trí" aria-label="Vị trí">📍</button>
                <button className="btn btn-link p-0" title="Khác" aria-label="Khác">…</button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-primary w-100 disabled">Đăng</button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
};

export default PostModal;
