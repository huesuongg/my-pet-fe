// src/components/PostCreator.tsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import PostModal from "./PostModal";

const PostCreator: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý modal
  const user = useSelector((state: RootState) => state.auth.user);
  
  const userAvatar = user?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU';

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <img
          src={userAvatar}
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
          <span className="text-green-500 text-2xl">#</span>
          <span className="font-medium">Tags</span>
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
