// src/components/Feed.tsx
import React, { useMemo, useState } from 'react';
import Post, { PostData } from './Post';
import CommentModal from './CommentModal';
import EditPostModal from './EditPostModal';
import { usePostContext } from '../context/PostContext';

// Helper: đổi 1 số class Tailwind trong content -> class Bootstrap tương đương (đơn giản)
function toBootstrapContent(html: string) {
  if (!html) return html;
  return html
    .replace(/text-blue-500/g, 'text-primary')
    .replace(/font-semibold/g, 'fw-semibold')
    .replace(/ml-1/g, 'ms-1');
}

const Feed: React.FC = () => {
  console.log('Feed render');
  const { state, updatePost, deletePost } = usePostContext();

  // Chuẩn hoá content -> Bootstrap 1 lần
  const posts: PostData[] = useMemo(
    () =>
      state.posts.map(p => ({
        ...p,
        content: toBootstrapContent(p.content),
      })),
    [state.posts]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
  const [postToEdit, setPostToEdit] = useState<PostData | null>(null);

  const handleOpenModal = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      console.log('Setting selected post:', post);
      setIsModalOpen(true);
    }
    console.log('Open modal for post ID:', postId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleEditPost = (post: PostData) => {
    setPostToEdit(post);
  };

  const handleDeletePost = (postId: number) => {
    deletePost(postId);
  };

  const handleSaveEdit = (updatedPost: PostData) => {
    updatePost(updatedPost.id, {
      content: updatedPost.content,
      image: updatedPost.image,
      location: updatedPost.location,
      emotion: updatedPost.emotion
    });
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
      {posts.map(post => (
        <div key={post.id} className="mb-4">
          <Post 
            post={post} 
            onCommentClick={handleOpenModal}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        </div>
      ))}

      {/* CommentModal bản Bootstrap cần prop show */}
      {selectedPost && (
        <CommentModal
          show={isModalOpen}
          onClose={handleCloseModal}
          post={selectedPost}
        />
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
