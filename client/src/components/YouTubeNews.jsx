import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './YouTubeNews.css';

const YouTubeNews = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  const apiKey = 'AIzaSyDlb6Yht6nC1Kf1jyvyteipL3FPOY5Bsp4';
  useEffect(() => {
    const fetchNewsVideos = async () => {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=breaking+news&type=video&key=${apiKey}&maxResults=10`;


      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          setVideos(data.items);
        } else {
          // console.log('No news videos found');
        }
      } catch (error) {
        setError('');
        console.error('Error:', error);
      }
    };

    fetchNewsVideos();
  }, []);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div>
      
      {error && <p>{error}</p>}
      <div className="video-list">
        {videos.length === 0 ? (
          <p></p>
        ) : (
          <Slider {...settings}>
            {videos.map((video) => (
              <div key={video.id} className="video-item">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${video.id.videoId}`}
                  title={video.snippet.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <h4 className="video-title">{video.snippet.title}</h4>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default YouTubeNews;
