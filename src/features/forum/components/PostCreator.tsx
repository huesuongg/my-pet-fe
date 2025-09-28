// src/components/PostCreator.tsx
import React, { useState } from "react";
import profilePic from "../../../assets/profile-pic.jpg";
import PostModal from "./PostModal";

const PostCreator: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý modal

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
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
            onFocus={handleOpenModal}
            readOnly
          />
        </div>
      </div>
      <div className="flex justify-around border-t pt-4">
        <button 
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          onClick={handleOpenModal}
        >
          <span className="text-blue-500 text-2xl" style={{ paddingBottom: '10px' }}>📷</span>
          <span className="font-medium">Ảnh</span>
        </button>
        <button 
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          onClick={handleOpenModal}
        >
          <span className="text-green-500 text-2xl">😊</span>
          <span className="font-medium">Cảm xúc</span>
        </button>
        <button 
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          onClick={handleOpenModal}
        >
          <span className="text-cyan-500 text-2xl">📍</span>
          <span className="font-medium">Vị trí</span>
        </button>
      </div>
      {isModalOpen && <PostModal onClose={handleCloseModal} />}
    </div>
  );
};

export default PostCreator;
