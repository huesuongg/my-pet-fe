// src/components/ProfileHeader.tsx
import React, { useState } from "react";
import profileCover from "../../../assets/profile-cover.jpg";
import AddIcon from "@mui/icons-material/Add";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import PostModal from "./PostModal";
import SimpleEditModal, { ProfileData } from "./SimpleEditModal";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";


interface ProfileHeaderProps {
  onProfileUpdate?: (data: ProfileData) => void;
  profileData?: ProfileData;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onProfileUpdate }) => {
  console.log('Profile Header render');
  
  const user = useSelector((state: RootState) => state.auth.user);
  console.log('========');
  console.log('Full User Object:', user);
  console.log('Avatar:', user?.avatar);
  console.log('Background Image:', user?.backgroundImg);
  console.log('All user keys:', user ? Object.keys(user) : 'user is null');

  const userProfileType = 1; // For demonstration, keep this as 2 to show "Follow" button logic
  const [isFollowing, setIsFollowing] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý modal
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false); // State để quản lý edit profile modal

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenEditProfileModal = () => {
    console.log('Opening edit profile modal');
    setIsEditProfileModalOpen(true);
  };
  const handleCloseEditProfileModal = () => {
    console.log('Closing edit profile modal');
    setIsEditProfileModalOpen(false);
  };

  const handleProfileSave = (profileData: ProfileData) => {
    if (onProfileUpdate) {
      onProfileUpdate(profileData);
    }
    console.log('Profile updated:', profileData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cover Photo */}
      <div className="relative h-64 md:h-80">
        <img
          key={user?.backgroundImg || 'default-bg'} // Force re-render khi backgroundImg thay đổi
          src={user?.backgroundImg || profileCover}
          alt="Profile Cover"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback nếu ảnh lỗi
            const target = e.target as HTMLImageElement;
            if (target.src !== profileCover) {
              target.src = profileCover;
            }
          }}
        />
      </div>

      <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between -mt-16 md:-mt-20 z-10 relative">
        <div className="flex items-center space-x-4">
          <img
            key={user?.avatar || 'default-avatar'} // Force re-render khi avatar thay đổi
            src={user?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU'}
            alt="Profile"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover"
            onError={(e) => {
              // Fallback nếu ảnh lỗi
              const target = e.target as HTMLImageElement;
              if (target.src !== 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU') {
                target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU';
              }
            }}
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {user?.username || 'Quốc HuyHuy'}
            </h1>
            <p className="text-gray-500 pt-2">
              120 Bài viết - 120 Theo dõi - 120 Người theo dõi
            </p>
          </div>
        </div>

        {/* Conditional Rendering của các nút - căn phải */}
        <div className="flex space-x-3 mt-8 md:mt-0">
          {userProfileType === 1 ? (
            // Case 1: My profile
            <>
              <button
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                onClick={handleOpenModal}
              >
                <AddIcon className="mr-2" /> Thêm bài viết
              </button>
              <button
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                style={{ marginLeft: "10px" }}
                onClick={handleOpenEditProfileModal}
              >
                <EditSquareIcon className="mr-2" /> Chỉnh sửa trang cá nhân
              </button>
            </>
          ) : (
            // Case 2: Another user's profile
            <>
              <button
                className={`flex items-center px-4 py-2 transition-colors rounded-full
                  ${isFollowing ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? (
                  <CancelIcon className="mr-2" />
                ) : (
                  <AddIcon className="mr-2" />
                )}
                {isFollowing ? "Hủy theo dõi" : "Theo dõi"}
              </button>
              <button
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                style={{ marginLeft: "10px" }}
              >
                <SearchIcon className="mr-2" /> Tìm kiếm
              </button>
            </>
          )}
        </div>
      </div>
      {isModalOpen && <PostModal onClose={handleCloseModal} />}
      <SimpleEditModal
        show={isEditProfileModalOpen}
        onClose={handleCloseEditProfileModal}
        onSave={handleProfileSave}
      />
    </div>
  );
};

export default ProfileHeader;
