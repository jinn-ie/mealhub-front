// components/LoadingOverlay.jsx
import React from 'react';
import ReactDOM from 'react-dom';
// import '../index.css'; // 스타일 따로 관리

const LoadingOverlay = () => {
  return ReactDOM.createPortal(
    <div id="loading-overlay">
      <div className="spinner-container">
        <div className="spinner"></div>
        <p className="loading-text">메뉴를 추천하는 중...</p>
      </div>
    </div>,
    document.body
  );
};

export default LoadingOverlay;
