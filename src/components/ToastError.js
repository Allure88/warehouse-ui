import React from 'react';

const ToastError = ({ message, onClose }) => {
  return (
    <div
      className="alert alert-danger alert-dismissible fade show"
      role="alert"
      style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1050 }}
    >
      {message}
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  );
};

export default ToastError;