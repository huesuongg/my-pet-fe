// src/components/ProfilePage.tsx
import React from 'react';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSidebar from '../components/ProfileSidebar';
import MainContent from '../components/MainContent';


const ProfilePage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto p-4">
        <ProfileHeader />
        <div className="flex flex-col md:flex-row mt-4 gap-4">
          <div className="w-full md:w-1/3">
            <ProfileSidebar />
          </div>
          <div className="w-full md:w-2/3">
            <MainContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;