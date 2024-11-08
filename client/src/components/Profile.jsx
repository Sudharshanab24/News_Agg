import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './Profile.css'; // Import CSS for styles

function Profile() {
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]); // Initialize articles as an empty array
  const navigate = useNavigate(); // For navigation
  
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in.');
        navigate('/login'); // Redirect to login if no token is found
        return;
      }

      // Fetch user profile and articles
      const response = await fetch('http://localhost:3000/profile', {
        headers: { Authorization: `Bearer ${token}` }, // Set the Bearer token
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData); // Set user data
        setArticles(userData.articles || []); // Ensure articles is an array even if undefined
      } else {
        alert('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) return <div>Loading...</div>;
  
  return (
    <div className="profile-container bg-black">
      <div className="profile-content">
        <h2>User Profile</h2>
        <p className="username">Hai,{user.name}</p>
        <p className="save">Saved Article</p>

        <div className="articles-container">
          {articles.length > 0 ? (
            articles.map(article => (
              <div key={article._id} className="article-card">
                <h4>{article.title}</h4>
                <img src={article.imgUrl} alt={article.title} />
                <p>{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
              </div>
            ))
          ) : (
            <p>No articles found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
