// src/components/Feed.tsx
import React, { useMemo, useState, useEffect } from "react";
import Post from "./Post";
import CommentModal from "./CommentModal";
import EditPostModal from "./EditPostModal";
import { usePostContext } from "../context/PostContext";
import { PostData } from "../types/forum.types";

// Helper: đổi 1 số class Tailwind trong content -> class Bootstrap tương đương (đơn giản)
function toBootstrapContent(html: string) {
  if (!html) return html;
  return html
    .replace(/text-blue-500/g, "text-primary")
    .replace(/font-semibold/g, "fw-semibold")
    .replace(/ml-1/g, "ms-1");
}

export interface PostUpdatePayload {
  content?: string;
  image?: string | null;
  images?: string[]; // nếu bạn đang dùng string[] URL
  location?: string | null;
  tags?: string[];
  address?: string | null;
  imageFiles?: File[]; // ảnh mới local
  keepImages?: boolean; // giữ ảnh cũ
}

const Feed: React.FC = () => {
  console.log("Feed render");
  const { state, fetchPosts, updatePost, deletePost } = usePostContext();

  // Debug logging
  console.log("Feed: state.posts type:", typeof state.posts);
  console.log("Feed: state.posts isArray:", Array.isArray(state.posts));
  console.log("Feed: state.posts value:", state.posts);

  // Load posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Chuẩn hoá content -> Bootstrap 1 lần
  const posts: PostData[] = useMemo(() => {
    // Safety check: ensure state.posts is an array
    if (!Array.isArray(state.posts)) {
      console.warn("Feed: state.posts is not an array:", state.posts);
      return [];
    }

    return state.posts.map((p) => ({
      ...p,
      content: toBootstrapContent(p.content),
      timestamp: p.timestamp || new Date().toLocaleString("vi-VN"),
      likes: p.likes || 0,
      comments: p.comments || 0,
      favorites: p.favorites || 0,
      isLiked: p.isLiked || false,
      isFavorited: p.isFavorited || false,
      commentsList: p.commentsList || [],
      author: {
        ...p.author,
        // Đồng bộ cả avatar và profilePic để các component đều hiển thị đúng
        avatar:
          p.author.avatar ||
          p.author.profilePic ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU",
        profilePic:
          p.author.profilePic ||
          p.author.avatar ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU",
      },
    }));
  }, [state.posts]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
  const [postToEdit, setPostToEdit] = useState<PostData | null>(null);

  // Pagination state (5 posts per page)
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(posts.length / pageSize));
  }, [posts.length]);

  // Ensure currentPage is valid when posts change
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return posts.slice(start, start + pageSize);
  }, [posts, currentPage]);

  const handleOpenModal = (postId: number | string) => {
    const post = posts.find(
      (p) =>
        p.id === postId || p.id === String(postId) || p.id === Number(postId)
    );
    if (post) {
      setSelectedPost(post);
      console.log("Setting selected post:", post);
      setIsModalOpen(true);
    } else {
      console.log(
        "Post not found for ID:",
        postId,
        "Available posts:",
        posts.map((p) => p.id)
      );
    }
    console.log("Open modal for post ID:", postId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleEditPost = (post: PostData) => {
    setPostToEdit(post);
  };

  const handleDeletePost = (postId: number | string) => {
    deletePost(postId); // Giữ nguyên ID type (có thể là string từ MongoDB)
  };

  const handleSaveEdit = (
    updatedPost: PostData & { imageFiles?: File[]; keepImages?: boolean }
  ) => {
    console.log("====== Feed.handleSaveEdit ======");
    console.log("Received updatedPost:", updatedPost);

    const payload: PostUpdatePayload = {
      content: updatedPost.content,
      image: updatedPost.image,
      images: updatedPost.images,
      location: updatedPost.location,
      tags: updatedPost.tags,
      address: updatedPost.location, // nếu backend nhận 'address'
      imageFiles: updatedPost.imageFiles, // ⬅ không any
      keepImages: updatedPost.keepImages, // ⬅ không any
    };

    console.log("✅ Feed payload to send to updatePost:", {
      postId: updatedPost.id,
      content: payload.content,
      keepImages: payload.keepImages,
      imageFiles: payload.imageFiles?.map((f) => f.name) ?? [],
      tags: payload.tags,
      address: payload.address,
    });
    console.log("================================");

    // type an toàn vì updatePost đã mở rộng nhận PostUpdatePayload
    updatePost(updatedPost.id, payload as unknown as Partial<PostData>);
    setPostToEdit(null);
  };

  const handleCloseEditModal = () => {
    setPostToEdit(null);
  };

  return (
    // Đổi container Tailwind -> Bootstrap
    <div className="container py-3">
      {/* Nút refresh để test */}
      {/* <div className="mb-3 d-flex gap-2">
        <button 
          onClick={refreshPosts}
          className="btn btn-outline-primary btn-sm"
        >
          🔄 Refresh Posts
        </button>
        <button 
          onClick={clearAndReloadPosts}
          className="btn btn-outline-danger btn-sm"
        >
          🗑️ Clear & Reload
        </button>
      </div> */}

      {/* Nếu Post.tsx vẫn dùng Tailwind thì vẫn render được.
          Khi rảnh bạn có thể port Post.tsx sang Bootstrap cho đồng bộ UI. */}
      {paginatedPosts.length > 0 ? (
        paginatedPosts.map((post) => (
          <div key={post.id} className="mb-4">
            <Post
              post={post}
              onCommentClick={handleOpenModal}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          </div>
        ))
      ) : (
        <div className="text-center py-5">
          <p className="text-muted">
            {state.loading
              ? "Đang tải posts..."
              : "Chưa có posts nào. Hãy tạo post đầu tiên!"}
          </p>
          {state.error && (
            <div className="alert alert-warning mt-3">
              <strong>Lỗi:</strong> {state.error}
            </div>
          )}
        </div>
      )}

      {/* CommentModal bản Bootstrap cần prop show */}
      {selectedPost && (
        <CommentModal
          show={isModalOpen}
          onClose={handleCloseModal}
          post={selectedPost}
        />
      )}

      {/* Pagination */}
      {posts.length > pageSize && (
        <div className="flex items-center justify-center gap-2 my-4 select-none">
          <button
            className={`px-3 py-2 rounded-md border text-sm ${currentPage === 1 ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "hover:bg-gray-50"}`}
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            &lt;
          </button>

          {(() => {
            const items: (number | string)[] = [];
            const add = (v: number | string) => items.push(v);
            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) add(i);
            } else {
              const left = Math.max(2, currentPage - 1);
              const right = Math.min(totalPages - 1, currentPage + 1);
              add(1);
              if (left > 2) add("...");
              for (let i = left; i <= right; i++) add(i);
              if (right < totalPages - 1) add("...");
              add(totalPages);
            }
            return items.map((it, idx) => {
              if (it === "...") {
                return (
                  <span key={`dots-${idx}`} className="px-3 py-2 text-gray-500">
                    …
                  </span>
                );
              }
              const pageNum = it as number;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  className={`px-3 py-2 rounded-md text-sm min-w-[40px] transition-colors ${
                    isActive
                      ? "bg-blue-50 border-2 !border-blue-600 !text-blue-600 font-semibold"
                      : "bg-white border border-blue-200 hover:bg-gray-50"
                  }`}
                  style={isActive ? { borderColor: "#2563eb" } : undefined}
                  onClick={() => setCurrentPage(pageNum)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {pageNum}
                </button>
              );
            });
          })()}

          <button
            className={`px-3 py-2 rounded-md border text-sm ${currentPage === totalPages ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "hover:bg-gray-50"}`}
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            &gt;
          </button>
        </div>
      )}

      {/* EditPostModal */}
      {postToEdit && (
        <EditPostModal
          post={postToEdit}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default Feed;
