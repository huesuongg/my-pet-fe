// src/components/Post.tsx
import React, { memo } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";

// Định nghĩa kiểu dữ liệu cho Post
export interface PostData {
  id: number;
  author: {
    name: string;
    profilePic: string;
  };
  timestamp: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  favorites: number;
}

interface PostProps {
  post: PostData;
  onCommentClick: (postId: number) => void;
}

const Post: React.FC<PostProps> = ({ post, onCommentClick }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-5">
      {/* Post Header */}
      <div className="flex items-center space-x-2 mb-4">
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

      {/* Post Content */}
      <div className="mb-4">
        <p
          className="text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></p>
      </div>
      <div className="rounded-lg overflow-hidden">
        <img
          src={post.image}
          alt="Post content"
          className="w-full object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t pt-4 mt-4 text-gray-500 text-sm">
        <div className="flex space-x-4">
          <div className="flex items-center">
            <span className="mr-1 text-blue-500">
              {<ThumbUpIcon fontSize="small" />}
            </span>
            {post.likes}
          </div>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => onCommentClick(post.id)}
          >
            <span className="mr-1">
              {<ChatBubbleOutlineIcon fontSize="small" />}
            </span>
            {post.comments}
          </div>
          <div className="flex items-center">
            <span className="mr-1">
              {<FavoriteBorderIcon fontSize="small" />}
            </span>
            {post.favorites}
          </div>
        </div>
        <div>
          <span className="mr-2 cursor-pointer">
            <FontAwesomeIcon icon={faShare} size="lg" /> Share
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(Post);
