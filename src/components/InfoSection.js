// src/components/InfoSection.js
import React from 'react';
import './InfoSection.css';

function InfoSection({ winner, winAmount, manager, currentAccount, message }) {
  // Hàm để hiển thị địa chỉ đầy đủ với khả năng sao chép
  const displayFullAddress = (address) => {
    const copyToClipboard = () => {
      navigator.clipboard.writeText(address);
      alert('Đã sao chép địa chỉ vào clipboard!');
    };

    return (
      <div className="full-address-container">
        <span className="full-address">{address}</span>
        <button className="copy-button" onClick={copyToClipboard} title="Sao chép địa chỉ">
          📋
        </button>
      </div>
    );
  };

  return (
    <div className="info-section">
      {winner && (
        <div className="card winner-card">
          <div className="card-header">
            <div className="icon-wrapper trophy-icon">🏆</div>
            <h3>Người Chiến Thắng Gần Đây</h3>
          </div>
          <div className="winner-info">
            <div className="info-row">
              <span className="info-label">Địa chỉ:</span>
              <div className="info-value highlight address-value">
                {displayFullAddress(winner)}
              </div>
            </div>
            <div className="info-row">
              <span className="info-label">Số tiền thắng:</span>
              <span className="info-value highlight win-amount">{winAmount} ETH</span>
            </div>
          </div>
        </div>
      )}

      <div className="card contract-info">
        <div className="card-header">
          <div className="icon-wrapper user-icon">👤</div>
          <h3>Thông Tin Hợp Đồng</h3>
        </div>
        <div className="info-content">
          <div className="info-row">
            <span className="info-label">Địa chỉ người quản lý:</span>
            <div className="info-value address-value">
              {displayFullAddress(manager)}
            </div>
          </div>
          <div className="info-row">
            <span className="info-label">Địa chỉ của bạn:</span>
            <div className="info-value address-value">
              {displayFullAddress(currentAccount)}
            </div>
          </div>
          <div className="info-row">
            <span className="info-label">Trạng thái:</span>
            {currentAccount.toLowerCase() === manager.toLowerCase() ? (
              <span className="badge manager-badge">Quản lý</span>
            ) : (
              <span className="badge user-badge">Người dùng</span>
            )}
          </div>
        </div>
      </div>

      {message && (
        <div className={`message-container ${message.includes('Lỗi') ? 'error' : 'success'}`}>
          <div className={`icon-wrapper message-icon ${message.includes('Lỗi') ? 'error-icon' : 'success-icon'}`}>
            {message.includes('Lỗi') ? '⚠️' : '✅'}
          </div>
          <p className="message-text">{message}</p>
        </div>
      )}
    </div>
  );
}

export default InfoSection;
