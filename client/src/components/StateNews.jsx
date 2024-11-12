import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./StateNews.css";

function StateNews() {
  const { stateName } = useParams(); 
  const [videos, setVideos] = useState([]);
  const apiKey = 'AIzaSyDlb6Yht6nC1Kf1jyvyteipL3FPOY5Bsp4';

  // Function to fetch videos by state
  const fetchVideosByState = (state) => {
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${state} breaking news&type=video&maxResults=9&key=${apiKey}`)
      .then((response) => response.json())
      .then((data) => setVideos(data.items))
      .catch((error) => console.error("Error fetching state news:", error));
  };

  useEffect(() => {
    if (stateName) {
      fetchVideosByState(stateName); 
    }
  }, [stateName]);

  return (
    <div className="state-news-container">
      <h2></h2>
      <div className="video-grid">
        {videos.length > 0 ? (
          videos.map((video, index) => (
            <div key={index} className="video-card">
              <iframe
                className="video-iframe"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                title={video.snippet.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <h3 className="video-title">{video.snippet.title}</h3>
            </div>
          ))
        ) : (
          <p>No videos available for {stateName}</p>
        )}
      </div>
    </div>
  );
}

export default StateNews;
