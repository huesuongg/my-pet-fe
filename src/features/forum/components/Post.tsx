// src/components/Post.tsx
import React, { memo, useState, useRef, useEffect } from "react";
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

// Định nghĩa kiểu dữ liệu cho Post
export interface PostData {
  id: number;
  author: {
    name: string;
    profilePic: string;
  };
  timestamp: string;
  content: string;
  image?: string;
  location?: string;
  emotion?: string;
  likes: number;
  comments: number;
  favorites: number;
  isLiked: boolean;
  isFavorited: boolean;
  commentsList: Array<{
    id: number;
    author: {
      name: string;
      profilePic: string;
    };
    content: string;
    timestamp: string;
    likes: number;
    isLiked: boolean;
    replies?: Array<{
      id: number;
      author: {
        name: string;
        profilePic: string;
      };
      content: string;
      timestamp: string;
      likes: number;
      isLiked: boolean;
      replies?: Array<{
        id: number;
        author: {
          name: string;
          profilePic: string;
        };
        content: string;
        timestamp: string;
        likes: number;
        isLiked: boolean;
      }>;
    }>;
  }>;
}

interface PostProps {
  post: PostData;
  onCommentClick: (postId: number) => void;
  onEdit?: (post: PostData) => void;
  onDelete?: (postId: number) => void;
}

const Post: React.FC<PostProps> = ({ post, onCommentClick, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toggleLike, toggleFavorite } = usePostContext();

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
    // Nếu đã favorite thì không thể like
    if (post.isFavorited) {
      return;
    }
    toggleLike(post.id);
  };

  const handleFavorite = () => {
    // Nếu đã like thì không thể favorite
    if (post.isLiked) {
      return;
    }
    toggleFavorite(post.id);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-5">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <img
            src={post.author.profilePic}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold mt-2" style={{ marginBottom: "0px" }}>
              {post.author.name}
            </p>
            <p className="text-gray-500 text-sm">{post.timestamp}</p>
          </div>
        </div>
        
        {/* Three dots menu */}
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
      </div>
      
      {/* Post Image */}
      {post.image && (
        <div className="rounded-lg overflow-hidden">
          <img
            src={post.image}
            alt="Post content"
            className="w-full object-cover"
          />
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
              {post.likes}
            </span>
          </button>
          <button
            className="flex items-center cursor-pointer hover:text-blue-500 transition-colors"
            onClick={() => onCommentClick(post.id)}
          >
            <span className="mr-1">
              <ChatBubbleOutlineIcon fontSize="small" />
            </span>
            {post.comments}
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
              {post.favorites}
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
