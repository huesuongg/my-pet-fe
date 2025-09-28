import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { PostData } from "./Post";
import { usePostContext } from "../context/PostContext";

// Import ForumComment type from context
import { ForumComment } from "../context/PostContext";

interface CommentModalProps {
  show: boolean;
  onClose: () => void;
  post: PostData;
}

const CommentModal: React.FC<CommentModalProps> = ({ show, onClose, post }) => {
  const [commentText, setCommentText] = useState("");
  const { state, toggleLike, toggleFavorite, addComment, toggleCommentLike, addReply } = usePostContext();
  
  // Lấy post data mới nhất từ context
  const currentPost = state.posts.find(p => p.id === post.id) || post;

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

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(currentPost.id, {
        author: {
          name: "Current User",
          profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop"
        },
        content: commentText.trim(),
        timestamp: new Date().toLocaleString('vi-VN'),
        likes: 0,
        isLiked: false
      });
      setCommentText("");
    }
  };

  const handleLike = () => {
    toggleLike(currentPost.id);
  };

  const handleFavorite = () => {
    toggleFavorite(currentPost.id);
  };

  const handleCommentLike = (commentId: number) => {
    toggleCommentLike(currentPost.id, commentId);
  };

  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim() && replyingTo) {
      addReply(currentPost.id, replyingTo, {
        author: {
          name: "Current User",
          profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop"
        },
        content: replyText.trim(),
        timestamp: new Date().toLocaleString('vi-VN'),
        likes: 0,
        isLiked: false,
        replies: []
      });
      setReplyText("");
      setReplyingTo(null);
    }
  };

  // Component để render comment tree
  const renderComment = (comment: ForumComment, isReply = false) => (
    <div key={comment.id} className={`d-flex align-items-start gap-2 mb-3 ${isReply ? 'ms-4' : ''}`}>
      <img
        src={comment.author.profilePic}
        alt="Commenter"
        className="rounded-circle"
        style={{ width: 32, height: 32, objectFit: "cover" }}
      />
      <div className="bg-light p-2 rounded-3 w-100 position-relative">
        <div className="fw-semibold small mb-1">
          {comment.author.name}
        </div>
        <div className="small">{comment.content}</div>
        <div className="d-flex gap-2 text-muted small mt-1">
          <span className="text-muted">{comment.timestamp}</span>
          <span
            role="button"
            className={`text-decoration-none cursor-pointer ${comment.isLiked ? 'text-primary fw-bold' : 'hover-text-primary'}`}
            onClick={() => handleCommentLike(comment.id)}
          >
            {comment.isLiked ? 'Đã thích' : 'Thích'}
          </span>
          {!isReply && (
            <span
              role="button"
              className="text-decoration-none hover-text-primary cursor-pointer"
              onClick={() => handleReply(comment.id)}
            >
              Trả lời
            </span>
          )}
        </div>
        {/* Like count indicator */}
        {comment.likes > 0 && (
          <div className="position-absolute top-0 end-0 me-2 mt-1">
            <span className="badge bg-primary rounded-pill">
              👍 {comment.likes}
            </span>
          </div>
        )}
      </div>
    </div>
  );

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
                    {currentPost.image ? (
                      <img
                        src={currentPost.image}
                        alt="Post content"
                        className="img-fluid"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://via.placeholder.com/800x600?text=No+Image";
                        }}
                        style={{ maxHeight: "78vh", objectFit: "contain" }}
                      />
                    ) : (
                      <div className="text-center text-white">
                        <h4>📝 Bài viết không có ảnh</h4>
                        <p>Chỉ có nội dung văn bản</p>
                      </div>
                    )}
                  </div>

                  {/* Right: nội dung + comments */}
                  <div
                    className="col-12 col-md-5 d-flex flex-column"
                    style={{ maxHeight: "78vh", minHeight: "500px" }}
                  >
                    {/* Post header */}
                    <div className="border-bottom p-3 d-flex align-items-center gap-2">
                      <img
                        src={currentPost.author.profilePic}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: 48, height: 48, objectFit: "cover" }}
                      />
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{currentPost.author.name}</div>
                        <div className="text-muted small">{currentPost.timestamp}</div>
                        {/* Emotion and Location */}
                        {(currentPost.emotion || currentPost.location) && (
                          <div className="d-flex gap-2 mt-1">
                            {currentPost.emotion && (
                              <span className="badge bg-primary">{currentPost.emotion}</span>
                            )}
                            {currentPost.location && (
                              <span className="badge bg-secondary">📍 {currentPost.location}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Post content */}
                    <div
                      className="p-3 border-bottom"
                      style={{ overflow: "auto" }}
                    >
                      <div
                        className="text-body"
                        dangerouslySetInnerHTML={{ __html: currentPost.content || "" }}
                      />
                    </div>

                    {/* Comments list */}
                    <div
                      className="flex-grow-1 p-3"
                      style={{ 
                        overflowY: "auto", 
                        maxHeight: "400px",
                        minHeight: "200px",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#ccc #f1f1f1"
                      }}
                    >
                      <div className="pb-3">
                        {currentPost.commentsList && Array.isArray(currentPost.commentsList) && currentPost.commentsList.length > 0 ? (
                          currentPost.commentsList.map((comment: ForumComment) => (
                            <div key={comment.id}>
                              {/* Main comment */}
                              {renderComment(comment)}
                              
                              {/* Replies */}
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="ms-4">
                                  {comment.replies.map((reply: ForumComment) => renderComment(reply, true))}
                                </div>
                              )}
                              
                              {/* Reply input for this comment */}
                              {replyingTo === comment.id && (
                                <div className="ms-4 mb-3">
                                  <form onSubmit={handleSubmitReply} className="d-flex align-items-center gap-2">
                                    <img
                                      src={currentPost.author.profilePic}
                                      alt="User"
                                      className="rounded-circle"
                                      style={{ width: 28, height: 28, objectFit: "cover" }}
                                    />
                                    <input
                                      type="text"
                                      className="form-control rounded-pill"
                                      placeholder={`Trả lời ${comment.author.name}...`}
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      autoFocus
                                    />
                                    <button
                                      type="submit"
                                      className="btn btn-primary rounded-pill px-3"
                                      disabled={!replyText.trim()}
                                    >
                                      Đăng
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-secondary rounded-pill px-3"
                                      onClick={() => {
                                        setReplyingTo(null);
                                        setReplyText("");
                                      }}
                                    >
                                      Hủy
                                    </button>
                                  </form>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted py-4">
                            <p>Chưa có bình luận nào</p>
                            <small>Hãy là người đầu tiên bình luận!</small>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions + Input */}
                    <div className="border-top p-3" style={{ flexShrink: 0 }}>
                      {/* Actions */}
                      <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
                        <div className="d-flex gap-3">
                          <button
                            className="d-inline-flex align-items-center gap-1 border-0 bg-transparent text-muted"
                            onClick={handleLike}
                          >
                            {currentPost.isLiked ? (
                              <ThumbUpIcon fontSize="small" className="text-blue-500" />
                            ) : (
                              <ThumbUpIcon fontSize="small" />
                            )}
                            <span className={currentPost.isLiked ? "text-blue-500 fw-medium" : ""}>
                              {currentPost.likes}
                            </span>
                          </button>
                          <span
                            className="d-inline-flex align-items-center gap-1"
                            role="button"
                          >
                            <ChatBubbleOutlineIcon fontSize="small" />{" "}
                            {currentPost.comments}
                          </span>
                          <button
                            className="d-inline-flex align-items-center gap-1 border-0 bg-transparent text-muted"
                            onClick={handleFavorite}
                          >
                            {currentPost.isFavorited ? (
                              <FavoriteIcon fontSize="small" className="text-red-500" />
                            ) : (
                              <FavoriteBorderIcon fontSize="small" />
                            )}
                            <span className={currentPost.isFavorited ? "text-red-500 fw-medium" : ""}>
                              {currentPost.favorites}
                            </span>
                          </button>
                        </div>
                        <span
                          role="button"
                          className="d-inline-flex align-items-center gap-1"
                        >
                          <FontAwesomeIcon icon={faShare} /> Share
                        </span>
                      </div>

                      {/* Input */}
                      <form onSubmit={handleSubmitComment} className="d-flex align-items-center gap-2">
                        <img
                          src={currentPost.author.profilePic}
                          alt="User"
                          className="rounded-circle"
                          style={{ width: 40, height: 40, objectFit: "cover" }}
                        />
                        <input
                          type="text"
                          className="form-control rounded-pill"
                          placeholder="Viết bình luận..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="btn btn-primary rounded-pill px-3"
                          disabled={!commentText.trim()}
                        >
                          Đăng
                        </button>
                      </form>
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
