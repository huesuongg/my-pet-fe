import React from "react";
import Ranking from "./Ranking";
import Sponsor from "./Sponsor";
import Ads from "./Ads";

const NewsFeedRightSideBar: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Weather Section */}
      <Ranking />

      {/*  Sponsor */}
      <Sponsor />

      {/* Ads */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <Ads />
      </div>
    </div>
  );
};

export default NewsFeedRightSideBar;
