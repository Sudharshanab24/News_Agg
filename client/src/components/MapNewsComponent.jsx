import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

function MapNewsComponent() {
  const [news, setNews] = useState([]);
  const [clickedCountry, setClickedCountry] = useState("");

  // Function to fetch news from the backend API
  const fetchNews = async (country) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/news?country=${country}`);
      if (response.data) {
        setNews(response.data);
      } else {
        alert('No news found for this country.');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      alert('Error fetching news.');
    }
  };

  // Handle map click and reverse geocoding to fetch country name
  function MapClick() {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;

        // Reverse geocoding API URL (Nominatim from OpenStreetMap)
        const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

        fetch(geocodeUrl)
          .then(response => response.json())
          .then(data => {
            if (data && data.address && data.address.country) {
              const countryName = data.address.country;
              setClickedCountry(countryName);
              alert('You clicked on: ' + countryName); // Display country name

              // Fetch news for the selected country from backend
              fetchNews(countryName);
            } else {
              alert('No country data found');
            }
          })
          .catch(err => {
            console.error('Error fetching country data:', err);
          });
      }
    });

    return null;
  }

  return (
    <div>
      <h3>Click on the map to get the country name and display news:</h3>
      <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClick />
      </MapContainer>

      {clickedCountry && (
        <div id="news-container" style={{ marginTop: '20px' }}>
          <h4>News for {clickedCountry}:</h4>
          {news.length > 0 ? (
            news.map((article, index) => (
              <div key={index} className="news-item" style={{ marginBottom: '15px' }}>
                <h4><a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a></h4>
                <p>{article.description || 'No description available.'}</p>
                <p><strong>Published at:</strong> {new Date(article.publishedAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No news found for this country.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MapNewsComponent;
