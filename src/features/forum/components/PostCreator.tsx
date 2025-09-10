// src/components/PostCreator.tsx
import React from 'react';
import profilePic from '../../../assets/profile-pic.jpg';

const PostCreator: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <img
          src={profilePic}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <input
            type="text"
            placeholder="Bạn đang nghĩ gì?"
            className="w-full bg-gray-100 p-3 rounded-full outline-none"
          />
        </div>
      </div>
      <div className="flex justify-around border-t pt-4">
        <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
          <span className="text-red-500">🔴</span>
          <span>Live Video</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
          <span className="text-green-500">📸</span>
          <span>Photo/Video</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
          <span className="text-yellow-500">😀</span>
          <span>Cảm xúc/Hoạt động</span>
        </button>
      </div>
    </div>
  );
};

export default PostCreator;