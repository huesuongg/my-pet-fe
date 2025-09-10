// src/components/Post.tsx
import React from 'react';
import profilePic from '../../../assets/profile-pic.jpg';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';

const Post: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Post Header */}
      <div className="flex items-center space-x-2 mb-4">
        <img
          src={profilePic}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold mt-2">Cristiano Ronaldo</p>
          <p className="text-gray-500 text-sm">June 24 2020, 13:40 PM</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-800">
          Subscribe @Easy Tutorials Youtube channel to watch more videos on website development and UI designs.
          <a href="#" className="text-blue-500 font-semibold ml-1">
            #EasyTutorials
          </a>
          <a href="#" className="text-blue-500 font-semibold ml-1">
            #YouTubeChannel
          </a>
        </p>
      </div>
      <div className="rounded-lg overflow-hidden">
        <img
          src="https://i.ytimg.com/vi/Xg8TTKuSGbA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCL4hPFub58tYi3AWG56h5w_fuwRw"
          alt="Post content"
          className="w-full object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t pt-4 mt-4 text-gray-500 text-sm">
        <div className="flex space-x-4">
          <div className="flex items-center">
            <span className="mr-1 text-blue-500">{<ThumbUpIcon fontSize="small" />}</span>
            120
          </div>
          <div className="flex items-center">
            <span className="mr-1">{<ChatBubbleOutlineIcon fontSize="small" />}</span>
            45
          </div>
          <div className="flex items-center">
            <span className="mr-1">{<FavoriteBorderIcon fontSize="small" />}</span>
            20
          </div>
        </div>
        <div>
          <span className="mr-2"><FontAwesomeIcon icon={faShare} size="lg" /> Share</span>
        </div>
      </div>
    </div>
  );
};

export default Post;