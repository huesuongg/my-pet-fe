import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { usePostContext } from "../context/PostContext";
import { PostData, ForumComment } from "../types/forum.types";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

interface CommentModalProps {
  show: boolean;
  onClose: () => void;
  post: PostData;
}

const CommentModal: React.FC<CommentModalProps> = ({ show, onClose, post }) => {
  const [commentText, setCommentText] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { state, fetchPost, toggleLike, toggleFavorite, addComment, toggleCommentLike, editComment, deleteCommentHard } = usePostContext();
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [optimisticLikeMap, setOptimisticLikeMap] = useState<Record<string, boolean>>({});

  const user = useSelector((state: RootState) => state.auth.user);
  const userAvatar = user?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU';
  
  // Lấy post data mới nhất từ context (ưu tiên selectedPost nếu trùng id)
  const currentPost = (state.selectedPost && state.selectedPost.id === post.id)
    ? state.selectedPost
    : (state.posts.find(p => p.id === post.id) || post);

  // Reset carousel + tải chi tiết post (đảm bảo comments đã populate)
  useEffect(() => {
    if (show) {
      setCurrentImageIndex(0);
      fetchPost(post.id);
    }
  }, [show, fetchPost, post.id]);

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
      addComment(currentPost.id, commentText.trim());
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
    setOptimisticLikeMap(prev => ({ ...prev, [String(commentId)]: !(prev[String(commentId)] ?? false) }));
    toggleCommentLike(currentPost.id, commentId);
  };

  const handleDeleteComment = (commentId: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;
    deleteCommentHard(currentPost.id, commentId);
  };

  const startEditComment = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditText(currentContent);
  };

  const submitEditComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCommentId || !editText.trim()) return;
    editComment(currentPost.id, editingCommentId, editText.trim());
    setEditingCommentId(null);
    setEditText("");
  };

  // XÓA Reply state dư thừa

  // Carousel functions
  const images = currentPost.images || (currentPost.image ? [currentPost.image] : []);
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Bỏ toàn bộ handler Reply

  // Component để render comment tree
  const renderComment = (comment: ForumComment, isReply = false) => {
    const isOwner = user?.username && comment.author?.name && user.username === comment.author.name;
    const optimisticFlag = optimisticLikeMap[String(comment.id)];
    const isLikedUi = typeof optimisticFlag === 'boolean' ? optimisticFlag : !!comment.isLiked;
    const likeCountUi = isLikedUi
      ? (comment.isLiked ? (comment.likes || 0) : (comment.likes || 0) + 1)
      : (comment.isLiked ? Math.max(0, (comment.likes || 0) - 1) : (comment.likes || 0));

    return (
      <div key={comment.id} className={`d-flex align-items-start gap-2 mb-3 ${isReply ? 'ms-4' : ''}`}>
        <img
          src={comment.author.profilePic || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU'}
          alt="Commenter"
          className="rounded-circle"
          style={{ width: 32, height: 32, objectFit: "cover" }}
        />
        <div className="bg-light p-2 rounded-3 w-100 position-relative">
          <div className="fw-semibold small mb-1">
            {comment.author.name}
          </div>
          {editingCommentId === comment.id ? (
            <form onSubmit={submitEditComment} className="d-flex gap-2">
              <input className="form-control form-control-sm" value={editText} onChange={(e) => setEditText(e.target.value)} />
              <button className="btn btn-primary btn-sm" type="submit">Lưu</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditingCommentId(null); setEditText(""); }}>Hủy</button>
            </form>
          ) : (
            <div className="small">{comment.content}</div>
          )}
          <div className="d-flex gap-2 text-muted small mt-1">
            <span className="text-muted">{comment.timestamp}</span>
            <span
              role="button"
              className={`text-decoration-none cursor-pointer ${isLikedUi ? 'text-primary fw-bold' : 'hover-text-primary'}`}
              onClick={() => handleCommentLike(comment.id)}
            >
              {isLikedUi ? 'Đã thích' : 'Thích'}
            </span>
            {!isReply && isOwner && (
              <>
                <span role="button" className="text-decoration-none hover-text-primary cursor-pointer" onClick={() => startEditComment(comment.id, comment.content)}>
                Sửa
                </span>
                <span role="button" className="text-decoration-none text-danger cursor-pointer" onClick={() => handleDeleteComment(comment.id)}>
                Xóa
                </span>
              </>
            )}
          </div>
          {/* Like count indicator */}
          {likeCountUi && likeCountUi > 0 && (
            <div className="position-absolute top-0 end-0 me-2 mt-1">
              <span className="badge bg-primary rounded-pill">
              👍 {likeCountUi}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

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
                  {/* Left: Media Carousel */}
                  <div className="col-12 col-md-7 bg-dark d-flex align-items-center justify-content-center position-relative">
                    {images.length > 0 ? (
                      <>
                        {/* Main Image */}
                        <img
                          src={images[currentImageIndex]}
                          alt={`Post content ${currentImageIndex + 1}`}
                          className="img-fluid"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="24"%3EImage Error%3C/text%3E%3C/svg%3E';
                          }}
                          style={{ maxHeight: "78vh", objectFit: "contain" }}
                        />
                        
                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                          <>
                            <button
                              className="btn btn-light position-absolute start-0 top-50 translate-middle-y ms-2"
                              onClick={prevImage}
                              style={{ zIndex: 10 }}
                            >
                              <ChevronLeftIcon />
                            </button>
                            <button
                              className="btn btn-light position-absolute end-0 top-50 translate-middle-y me-2"
                              onClick={nextImage}
                              style={{ zIndex: 10 }}
                            >
                              <ChevronRightIcon />
                            </button>
                          </>
                        )}
                        
                        {/* Image Counter */}
                        {images.length > 1 && (
                          <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2">
                            <span className="badge bg-dark bg-opacity-75 text-white">
                              {currentImageIndex + 1} / {images.length}
                            </span>
                          </div>
                        )}
                        
                        {/* Thumbnail Dots */}
                        {images.length > 1 && (
                          <div className="position-absolute bottom-0 start-0 end-0 d-flex justify-content-center mb-4">
                            <div className="d-flex gap-1">
                              {images.map((_, index) => (
                                <button
                                  key={index}
                                  className={`btn btn-sm rounded-circle ${
                                    index === currentImageIndex ? 'btn-primary' : 'btn-secondary'
                                  }`}
                                  onClick={() => setCurrentImageIndex(index)}
                                  style={{ width: '8px', height: '8px', padding: 0 }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </>
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
                        src={
                          currentPost.author?.avatar ||
                          currentPost.author?.profilePic ||
                          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU'
                        }
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
                      
                      {/* Tags Display */}
                      {currentPost.tags && currentPost.tags.length > 0 && (
                        <div className="d-flex flex-wrap gap-1 mt-2">
                          {currentPost.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="badge bg-primary text-white"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
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
                              
                              {/* Reply UI removed */}
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
                          src={userAvatar}
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
