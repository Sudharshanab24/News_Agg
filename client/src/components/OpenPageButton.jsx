// src/components/OpenPageButton.js
import React from 'react';

function OpenPageButton() {
  const openPage = () => {
    window.open('/map.html', '_blank'); // Replace with your HTML page
  };

  return (
    <button
      onClick={openPage}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      Google map
    </button>
  );
}

export default OpenPageButton;
