// src/components/UserPostsContent.tsx
import React, { useMemo, useState, useEffect } from 'react';
import Post from './Post';
import CommentModal from './CommentModal';
import EditPostModal from './EditPostModal';
import { usePostContext } from '../context/PostContext';
import { PostData } from '../types/forum.types';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';

// Extended PostData for edit operation (same as EditPostModal)
interface UpdatedPostData extends PostData {
  imageFiles?: File[];   // New files to upload
  keepImages?: string[]; // Existing URLs to keep
  address?: string;      // Location address for backend
}

// Payload for updatePost
interface UpdatePostPayload {
  content?: string;
  image?: string;
  images?: string[];
  location?: string;
  tags?: string[];
  address?: string;
  imageFiles?: File[];
  keepImages?: string[];
}

// Helper: đổi 1 số class Tailwind trong content -> class Bootstrap tương đương
function toBootstrapContent(html: string) {
  if (!html) return html;
  return html
    .replace(/text-blue-500/g, 'text-primary')
    .replace(/font-semibold/g, 'fw-semibold')
    .replace(/ml-1/g, 'ms-1');
}

const UserPostsContent: React.FC = () => {
  console.log('UserPostsContent render');
  const { state, fetchPosts, updatePost, deletePost } = usePostContext();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Load posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filter posts của user hiện tại
  const userPosts: PostData[] = useMemo(() => {
    // Safety check: ensure state.posts is an array
    if (!Array.isArray(state.posts)) {
      console.warn('UserPostsContent: state.posts is not an array:', state.posts);
      return [];
    }

    if (!currentUser?.id) {
      console.warn('UserPostsContent: No current user found');
      return [];
    }

    // Filter posts theo author.id của user hiện tại
    const filtered = state.posts
      .filter(post => {
        const authorId = post.author?.id || post.author?.id;
        const userId = currentUser.id || currentUser.id;
        return String(authorId) === String(userId);
      })
      .map(p => ({
        ...p,
        content: toBootstrapContent(p.content),
        timestamp: p.timestamp || new Date().toLocaleString('vi-VN'),
        likes: p.likes || 0,
        comments: p.comments || 0,
        favorites: p.favorites || 0,
        isLiked: p.isLiked || false,
        isFavorited: p.isFavorited || false,
        commentsList: p.commentsList || [],
        author: {
          ...p.author,
          avatar: p.author.avatar || p.author.profilePic || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU',
          profilePic: p.author.profilePic || p.author.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU'
        }
      }));

    console.log('UserPostsContent: Filtered posts for user', currentUser.id, ':', filtered.length, 'posts');
    return filtered;
  }, [state.posts, currentUser?.id]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
  const [postToEdit, setPostToEdit] = useState<PostData | null>(null);

  // Pagination state (5 posts per page)
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(userPosts.length / pageSize));
  }, [userPosts.length]);

  // Ensure currentPage is valid when posts change
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return userPosts.slice(start, start + pageSize);
  }, [userPosts, currentPage]);

  const handleOpenModal = (postId: number | string) => {
    const post = userPosts.find(p => p.id === postId || p.id === String(postId) || p.id === Number(postId));
    if (post) {
      setSelectedPost(post);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleEditPost = (post: PostData) => {
    setPostToEdit(post);
  };

  const handleDeletePost = (postId: number | string) => {
    deletePost(postId);
  };

  const handleSaveEdit = (updatedPost: PostData | UpdatedPostData) => {
    console.log('UserPostsContent.handleSaveEdit: Received updatedPost:', updatedPost);
    
    const extendedPost = updatedPost as UpdatedPostData;
    const payload: UpdatePostPayload = {
      content: updatedPost.content,
      image: updatedPost.image,
      images: updatedPost.images,
      location: updatedPost.location,
      tags: updatedPost.tags,
      address: updatedPost.location,
      imageFiles: extendedPost.imageFiles,
      keepImages: extendedPost.keepImages,
    };
    
    updatePost(updatedPost.id, payload);
    setPostToEdit(null);
  };

  const handleCloseEdit = () => {
    setPostToEdit(null);
  };

  // Pagination helper function
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="space-y-4">
      {paginatedPosts.length > 0 ? (
        <>
          {paginatedPosts.map(post => (
            <div key={post.id} className="mb-4">
              <Post 
                post={post} 
                onCommentClick={handleOpenModal}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 my-4 select-none mt-8">
              <button
                className={`px-3 py-2 rounded-md border text-sm ${currentPage === 1 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                &lt;
              </button>

              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">
                      …
                    </span>
                  );
                }
                const pageNum = page as number;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    className={`px-3 py-2 rounded-md text-sm min-w-[40px] transition-colors ${
                      isActive
                        ? 'bg-blue-50 border-2 border-blue-600 text-blue-600 font-semibold'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    style={isActive ? { borderColor: '#2563eb' } : undefined}
                    onClick={() => setCurrentPage(pageNum)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className={`px-3 py-2 rounded-md border text-sm ${currentPage === totalPages ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                &gt;
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <svg 
              className="w-16 h-16 text-gray-400 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <p className="text-gray-500 text-lg font-medium">
              Hiện tại chưa có bài viết nào
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Bắt đầu chia sẻ những khoảnh khắc của bạn!
            </p>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {isModalOpen && selectedPost && (
        <CommentModal 
          show={isModalOpen} 
          onClose={handleCloseModal} 
          post={selectedPost} 
        />
      )}

      {/* Edit Post Modal */}
      {postToEdit && (
        <EditPostModal
          post={postToEdit}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default UserPostsContent;

