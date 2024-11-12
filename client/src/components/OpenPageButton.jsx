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
        padding: '5px 5px',
        backgroundColor: '#1b05ae',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        width:'50px',
      }}
    >
      Map
    </button>
  );
}

export default OpenPageButton;
