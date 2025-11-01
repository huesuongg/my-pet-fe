// src/components/Post.tsx
import React, { memo, useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { usePostContext } from "../context/PostContext";
import { PostData } from "../types/forum.types";

interface PostProps {
  post: PostData;
  onCommentClick: (postId: number | string) => void;
  onEdit?: (post: PostData) => void;
  onDelete?: (postId: number | string) => void;
}

const Post: React.FC<PostProps> = ({ post, onCommentClick, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toggleLike, toggleFavorite } = usePostContext();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
  // Check if current user is the author of this post
  const isAuthor = currentUser?.id === post.author.id;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    setShowDropdown(false);
    onEdit?.(post);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      onDelete?.(post.id);
    }
  };

  const handleLike = () => {
    if (post.isFavorited) return;
    toggleLike(post.id);
  };

  const handleFavorite = () => {
    if (post.isLiked) return;
    toggleFavorite(post.id);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-5">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <img
            src={post.author.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU'}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold mt-2" style={{ marginBottom: "0px" }}>
                {post.author.name}
              </p>
              {post.location && (
                <span className="px-2 py-1 text-xs text-white rounded" style={{ backgroundColor: '#6c757d', border: '1px solid #5a6268' }}>
                  📍 {post.location}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">{post.timestamp || new Date().toLocaleString('vi-VN')}</p>
          </div>
        </div>
        
        {/* Three dots menu - Chỉ hiển thị cho bài viết của user hiện tại */}
        {isAuthor && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Tùy chọn"
            >
              <MoreVertIcon />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]" style={{ width: '150px' }}>
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                >
                  <EditIcon fontSize="small" />
                  Chỉnh sửa
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600"
                >
                  <DeleteIcon fontSize="small" />
                  Xóa
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p
          className="text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></p>
        
        {/* Emotion and Location Display */}
        {(post.emotion || post.location) && (
          <div className="flex items-center space-x-2 mt-2">
            {post.emotion && (
              <span className="text-lg">{post.emotion}</span>
            )}
            {post.location && (
              <span className="text-gray-500 text-sm flex items-center">
                📍 {post.location}
              </span>
            )}
          </div>
        )}

        {/* Tags Display */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Post Image - Only show first image */}
      {(post.image || (post.images && post.images.length > 0)) && (
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={post.image || (post.images && post.images[0]) || ''}
            alt="Post content"
            className="w-full object-cover"
            onError={(e) => {
              // Dùng data URL thay vì external service
              (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="18"%3EImage Error%3C/text%3E%3C/svg%3E';
            }}
          />
          {/* Show indicator if there are more images */}
          {post.images && post.images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
              +{post.images.length - 1} ảnh
            </div>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t pt-4 mt-4 text-gray-500 text-sm">
        <div className="flex space-x-4">
          <button 
            className={`flex items-center transition-colors ${
              post.isFavorited 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:text-blue-500"
            }`}
            onClick={handleLike}
            disabled={post.isFavorited}
          >
            <span className="mr-1">
              {post.isLiked ? (
                <ThumbUpIcon fontSize="small" className="text-blue-500" />
              ) : (
                <ThumbUpIcon fontSize="small" />
              )}
            </span>
            <span className={post.isLiked ? "text-blue-500 font-medium" : ""}>
              {post.likes || 0}
            </span>
          </button>
          <button
            className="flex items-center cursor-pointer hover:text-blue-500 transition-colors"
            onClick={() => onCommentClick(post.id)}
          >
            <span className="mr-1">
              <ChatBubbleOutlineIcon fontSize="small" />
            </span>
            {post.comments || 0}
          </button>
          <button 
            className={`flex items-center transition-colors ${
              post.isLiked 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:text-red-500"
            }`}
            onClick={handleFavorite}
            disabled={post.isLiked}
          >
            <span className="mr-1">
              {post.isFavorited ? (
                <FavoriteIcon fontSize="small" className="text-red-500" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </span>
            <span className={post.isFavorited ? "text-red-500 font-medium" : ""}>
              {post.favorites || 0}
            </span>
          </button>
        </div>
        <div>
          <span className="mr-2 cursor-pointer hover:text-blue-500 transition-colors">
            <FontAwesomeIcon icon={faShare} size="lg" /> Share
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(Post);
