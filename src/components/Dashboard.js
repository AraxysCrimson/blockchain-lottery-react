// src/components/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import './Dashboard.css';

function Dashboard({ 
  balance, 
  players, 
  accountBalance, 
  isPlayerParticipating, 
  value, 
  setValue, 
  onSubmit, 
  isLoading, 
  isManager, 
  pickWinner 
}) {
  const [error, setError] = useState('');
  const [inputTouched, setInputTouched] = useState(false);
  const MIN_ENTRY = 0.01; // Phí tham gia tối thiểu

  // Kiểm tra giá trị nhập vào và xác định loại lỗi
  const validateInput = useCallback(() => {
    if (!value) {
      return '';
    }
    
    const numValue = parseFloat(value);
    
    // Kiểm tra nếu giá trị không phải là số
    if (isNaN(numValue)) {
      return 'invalid_format';
    }
    
    // Kiểm tra nếu giá trị là số âm
    if (numValue <= 0) {
      return 'negative_value';
    }
    
    // Kiểm tra nếu giá trị nhỏ hơn mức tối thiểu
    if (numValue < MIN_ENTRY) {
      return 'below_minimum';
    }
    
    // Kiểm tra nếu giá trị lớn hơn số dư tài khoản
    if (numValue > parseFloat(accountBalance)) {
      return 'insufficient_balance';
    }
    
    return '';
  }, [value, accountBalance, MIN_ENTRY]);

  // Cập nhật lỗi khi giá trị thay đổi
  useEffect(() => {
    if (inputTouched) {
      setError(validateInput());
    }
  }, [value, inputTouched, validateInput]);

  // Xử lý khi người dùng thay đổi giá trị
  const handleValueChange = (event) => {
    setValue(event.target.value);
    setInputTouched(true);
  };

  // Hiển thị thông báo lỗi dựa trên loại lỗi
  const getErrorMessage = () => {
    switch (error) {
      case 'invalid_format':
        return 'Vui lòng chỉ nhập số (ví dụ: 0.01)';
      case 'negative_value':
        return 'Giá trị phải lớn hơn 0';
      case 'below_minimum':
        return `Số tiền tối thiểu là ${MIN_ENTRY} ETH`;
      case 'insufficient_balance':
        return 'Số dư của bạn không đủ để đặt cược số tiền này';
      default:
        return '';
    }
  };

  // Kiểm tra xem giá trị nhập vào có hợp lệ không
  const isValidInput = error === '';

  // Xử lý sự kiện submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidInput && value && !isLoading) {
      onSubmit();
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <div className="stats-card">
          <div className="card-header">
            <h3>Thống kê</h3>
            <div className="card-icon">📊</div>
          </div>
          <div className="stats-item">
            <span>Giải thưởng hiện tại</span>
            <span className="highlight prize-value">{balance} ETH</span>
          </div>
          <div className="stats-item">
            <span>Số người tham gia</span>
            <span className="highlight">{players.length}</span>
          </div>
          <div className="stats-item">
            <span>Số dư ví của bạn</span>
            <span className="highlight">{parseFloat(accountBalance).toFixed(4)} ETH</span>
          </div>
          <div className="stats-item">
            <span>Trạng thái</span>
            <span className={`status ${isPlayerParticipating ? 'active' : 'inactive'}`}>
              {isPlayerParticipating ? 'Đã tham gia' : 'Chưa tham gia'}
            </span>
          </div>
        </div>

        <div className="action-card">
          <div className="card-header">
            <h3>Tham Gia Xổ Số</h3>
            <div className="card-icon">🎫</div>
          </div>
          <div className="form-container">
            <div className="form-group">
              <label htmlFor="ethAmount">Số ETH muốn đặt cược:</label>
              <div className={`input-wrapper ${error ? 'input-error-border' : ''}`}>
                <input
                  id="ethAmount"
                  type="number"
                  step="0.01"
                  min={MIN_ENTRY}
                  value={value}
                  onChange={handleValueChange}
                  placeholder="Ví dụ: 0.01"
                  onBlur={() => setInputTouched(true)}
                  autoComplete="off"
                  className="input-field"
                />
                <span className="currency-symbol">ETH</span>
              </div>
              {inputTouched && error && (
                <div className="input-error">
                  <span className="error-icon">⚠️</span>
                  <span>{getErrorMessage()}</span>
                </div>
              )}
            </div>
            <button 
              onClick={handleSubmit} 
              className="btn btn-primary buy-ticket-btn" 
              disabled={isLoading || !isValidInput || !value}
              type="button"
            >
              {isLoading ? 
                <><span className="spinner"></span>Đang xử lý...</> : 
                <>Mua Vé Số <span className="btn-icon">→</span></>
              }
            </button>
            <p className="min-entry">Phí tham gia tối thiểu: <span className="highlight-small">{MIN_ENTRY} ETH</span></p>
            
            <div className="action-tips">
              <div className="tip-item">
                <span className="tip-icon">💡</span>
                <span>Mỗi vé mua sẽ tăng cơ hội chiến thắng của bạn</span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🔄</span>
                <span>Kết quả xổ số sẽ được công bố vào lúc 17:00 hàng ngày</span>
              </div>
            </div>
          </div>
        </div>

        {isManager && (
          <div className="admin-card">
            <div className="card-header">
              <h3>Quản Lý Xổ Số</h3>
              <div className="card-icon admin-icon">👑</div>
            </div>
            <div className="admin-status">
              <span className="admin-badge">Admin</span>
              <p>Bạn là người quản lý hợp đồng này</p>
            </div>
            <button 
              onClick={pickWinner} 
              className="btn btn-danger admin-btn" 
              disabled={isLoading || players.length === 0}
              type="button"
            >
              {isLoading ? 
                <><span className="spinner"></span>Đang xử lý...</> : 
                <>Chọn Người Chiến Thắng <span className="btn-icon">🏆</span></>
              }
            </button>
            {players.length === 0 && (
              <p className="no-players-warning">
                <span className="warning-icon">⚠️</span> Chưa có người tham gia, không thể chọn người chiến thắng
              </p>
            )}
            
            <div className="admin-info">
              <div className="info-item">
                <span className="info-icon">ℹ️</span>
                <span>Khi chọn người chiến thắng, toàn bộ số dư sẽ được chuyển cho người thắng</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🔒</span>
                <span>Chỉ admin mới có quyền chọn người chiến thắng</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
