import React from "react";
import WeatherSection from "./WeatherSection";
import NewsFeedsDashboard from "./NewsFeedsDashboard";

const NewsFeedLeftSideBar: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Weather Section */}
      <WeatherSection />

      <div className="bg-white p-4 rounded-lg shadow-md">
        <NewsFeedsDashboard
          active="Feed"
          onChange={(k) => console.log("switch:", k)}
          onCreatePost={() => console.log("create post")}
        />
      </div>
    </div>
  );
};

export default NewsFeedLeftSideBar;
