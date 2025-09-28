// src/components/ProfilePage.tsx
import React, { useState } from 'react';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSidebar, { ProfileData } from '../components/ProfileSidebar';
import MainContent from '../components/MainContent';
import { PostProvider } from '../context/PostContext';

const ProfilePage: React.FC = () => {
  // State để lưu thông tin profile
  const [profileData, setProfileData] = useState<ProfileData>({
    intro: "Believe in yourself and you can do unbelievable things. 😊",
    workplace: "99media ltd",
    education: "Amity University",
    studied: "DPS Delhi",
    lives: "Bangalore, India",
    from: "Bangalore, India",
    avatar: "",
    background: ""
  });

  const handleProfileUpdate = (newProfileData: ProfileData) => {
    setProfileData(newProfileData);
    console.log('Profile updated in ProfilePage:', newProfileData);
  };

  return (
    <PostProvider>
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto p-4">
          <ProfileHeader 
            onProfileUpdate={handleProfileUpdate} 
            profileData={profileData}
          />
          <div className="flex flex-col md:flex-row mt-4 gap-4">
            <div className="w-full md:w-1/3">
              <ProfileSidebar 
                profileData={profileData}
              />
            </div>
            <div className="w-full md:w-2/3">
              <MainContent />
            </div>
          </div>
        </div>
      </div>
    </PostProvider>
  );
};

export default ProfilePage;