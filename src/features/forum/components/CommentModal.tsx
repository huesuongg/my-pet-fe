import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";

export interface Author {
  name: string;
  profilePic: string;
}
export interface PostData {
  image: string;
  timestamp: string;
  content: string; // HTML string
  author: Author;
  likes: number;
  comments: number;
  favorites: number;
}

interface CommentModalProps {
  show: boolean;
  onClose: () => void;
  post: PostData;
}

const CommentModal: React.FC<CommentModalProps> = ({ show, onClose, post }) => {
  // Khóa scroll body + lắng nghe ESC
  useEffect(() => {
    if (!show) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [show, onClose]);

  if (!show) return null;

  const modal = (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />

      {/* Modal */}
      <div
        className="modal fade show"
        role="dialog"
        aria-modal="true"
        aria-labelledby="commentModalLabel"
        style={{ display: "block", zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content" style={{ height: "80vh" }}>
            {/* Header */}
            <div className="modal-header position-relative">
              <h5
                className="modal-title text-center w-100"
                id="commentModalLabel"
              >
                Bình luận
              </h5>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-flex align-items-center position-absolute top-0 end-0 m-2"
                onClick={onClose}
                aria-label="Close"
                title="Đóng"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            {/* Body: chia 2 cột */}
            <div className="modal-body p-0">
              <div className="container-fluid h-100">
                <div className="row g-0 h-100">
                  {/* Left: Media */}
                  <div className="col-12 col-md-7 bg-dark d-flex align-items-center justify-content-center">
                    <img
                      src={post.image}
                      alt="Post content"
                      className="img-fluid"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://via.placeholder.com/800x600?text=No+Image";
                      }}
                      style={{ maxHeight: "78vh", objectFit: "contain" }}
                    />
                  </div>

                  {/* Right: nội dung + comments */}
                  <div
                    className="col-12 col-md-5 d-flex flex-column"
                    style={{ maxHeight: "78vh" }}
                  >
                    {/* Post header */}
                    <div className="border-bottom p-3 d-flex align-items-center gap-2">
                      <img
                        src={post.author.profilePic}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: 48, height: 48, objectFit: "cover" }}
                      />
                      <div>
                        <div className="fw-semibold">{post.author.name}</div>
                        <div className="text-muted small">{post.timestamp}</div>
                      </div>
                    </div>

                    {/* Post content */}
                    <div
                      className="p-3 border-bottom"
                      style={{ overflow: "auto" }}
                    >
                      <div
                        className="text-body"
                        dangerouslySetInnerHTML={{ __html: post.content || "" }}
                      />
                    </div>

                    {/* Comments list (placeholder) */}
                    <div
                      className="flex-grow-1 p-3"
                      style={{ overflowY: "auto" }}
                    >
                      <div className="d-flex align-items-start gap-2 mb-3">
                        <img
                          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop"
                          alt="Commenter"
                          className="rounded-circle"
                          style={{ width: 32, height: 32, objectFit: "cover" }}
                        />
                        <div className="bg-light p-2 rounded-3 w-100">
                          <div className="fw-semibold small mb-1">
                            User Name
                          </div>
                          <div className="small">This is a great video!</div>
                          <div className="d-flex gap-2 text-muted small mt-1">
                            <span
                              role="button"
                              className="text-decoration-none"
                            >
                              Like
                            </span>
                            <span
                              role="button"
                              className="text-decoration-none"
                            >
                              Reply
                            </span>
                            <span>3h</span>
                          </div>
                        </div>
                      </div>
                      {/* TODO: map comments thực tế ở đây */}
                    </div>

                    {/* Actions + Input */}
                    <div className="border-top p-3">
                      {/* Actions */}
                      <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
                        <div className="d-flex gap-3">
                          <span
                            className="d-inline-flex align-items-center gap-1"
                            role="button"
                          >
                            <ThumbUpIcon fontSize="small" /> {post.likes}
                          </span>
                          <span
                            className="d-inline-flex align-items-center gap-1"
                            role="button"
                          >
                            <ChatBubbleOutlineIcon fontSize="small" />{" "}
                            {post.comments}
                          </span>
                          <span
                            className="d-inline-flex align-items-center gap-1"
                            role="button"
                          >
                            <FavoriteBorderIcon fontSize="small" />{" "}
                            {post.favorites}
                          </span>
                        </div>
                        <span
                          role="button"
                          className="d-inline-flex align-items-center gap-1"
                        >
                          <FontAwesomeIcon icon={faShare} /> Share
                        </span>
                      </div>

                      {/* Input */}
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={post.author.profilePic}
                          alt="User"
                          className="rounded-circle"
                          style={{ width: 40, height: 40, objectFit: "cover" }}
                        />
                        <input
                          type="text"
                          className="form-control rounded-pill"
                          placeholder="Write a comment..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer (nếu muốn thêm nút phụ) */}
            {/* <div className="modal-footer">...</div> */}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
};

export default CommentModal;
