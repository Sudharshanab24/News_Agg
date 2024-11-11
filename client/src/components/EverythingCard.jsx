import React from "react";
import axios from "axios";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";

function Card(props) {
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to save articles.");
      return;
    }

    const articleData = {
      title: props.title,
      imgUrl: props.imgUrl,
      description: props.description,
      url: props.url,
      source: props.source,
      author: props.author,
      publishedAt: props.publishedAt,
    };

    try {
      const response = await axios.post(
        'http://16.170.202.31:3000/save-article',
        articleData,
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Send the token in the header
          },
        }
      );
      alert("Article saved successfully!");
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Failed to save the article.");
    }
  };

  const emailSubject = `Check out this article: ${props.title}`;
  const emailBody = `I thought you might be interested in this article:\n\n${props.title}\n${props.description}\n\nRead more here: ${props.url}`;

  // Conditionally render the card only if imgUrl is present
  if (!props.imgUrl) return null;

  return (
    <div className="everything-card mt-10">
      <div className="everything-card flex flex-wrap p-5 gap-1 mb-1">
        <button 
          className="save-button bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleSave}
        >
          Save
        </button>
        <div className="share">
          <div className="share-buttons flex gap-2 mt-2">
            <FacebookShareButton url={props.url} quote={props.title}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={props.url} title={props.title}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <WhatsappShareButton url={props.url} title={props.title}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            {/* Email Share Button */}
            <a
              href={`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
              className="email-share-button"
              aria-label="Share via Gmail"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48">
                <path fill="#4285f4" d="M24 24L44 10V38H24z"/>
                <path fill="#34a853" d="M4 38V10l20 14z"/>
                <path fill="#fbbc05" d="M44 10H24l-4 3-4-3H4l20 14z"/>
                <path fill="#ea4335" d="M24 24L4 10h4v28h12V28h8v10h12V10h4z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <b className="title">{props.title}</b>
        <div className="everything-card-img mx-auto">
          <img className="everything-card-img" src={props.imgUrl} alt="img" />
        </div>
        <div className="description">
          <p className="description-text leading-7">
            {props.description?.substring(0, 200)}
          </p>
        </div>
        <div className="info">
          <div className="source-info flex items-center gap-2">
            <span className="font-semibold">Source:</span>
            <a
              href={props.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link underline break-words"
            >
              {props.source.substring(0, 70)}
            </a>
          </div>
          <div className="origin flex flex-col">
            <p className="origin-item">
              <span className="font-semibold">Author:</span>
              {props.author}
            </p>
            <p className="origin-item">
              <span className="font-semibold">Published At:</span>
              ({props.publishedAt})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
