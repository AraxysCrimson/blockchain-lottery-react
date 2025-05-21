// src/components/AboutSection.js
import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <div className="about-section">
      <div className="about-container">
        <h2 className="about-title">Thông Tin Xổ Số Blockchain</h2>
        
        <div className="about-card">
          <h3>Giới thiệu về Xổ Số Blockchain</h3>
          <p>
            Xổ số Blockchain là một ứng dụng phi tập trung (dApp) được xây dựng trên nền tảng Ethereum,
            sử dụng công nghệ Smart Contract để đảm bảo tính minh bạch và công bằng trong quá trình
            chọn người chiến thắng.
          </p>
        </div>
        
        <div className="about-card">
          <h3>Cách Thức Hoạt Động</h3>
          <p>
            1. Người chơi tham gia bằng cách gửi một lượng ETH tối thiểu vào hợp đồng.<br />
            2. Mỗi địa chỉ gửi tiền sẽ được ghi nhận là một vé số.<br />
            3. Khi đủ điều kiện, quản trị viên sẽ kích hoạt chức năng chọn người thắng cuộc.<br />
            4. Một người chơi ngẫu nhiên sẽ được chọn và nhận toàn bộ số tiền trong hợp đồng.
          </p>
        </div>
        
        <div className="about-card">
          <h3>Tính Năng Nổi Bật</h3>
          <ul className="feature-list">
            <li>
              <span className="feature-icon">🔒</span>
              <span className="feature-text">Bảo mật cao với công nghệ Blockchain</span>
            </li>
            <li>
              <span className="feature-icon">👁️</span>
              <span className="feature-text">Hoàn toàn minh bạch, mọi giao dịch đều có thể kiểm tra</span>
            </li>
            <li>
              <span className="feature-icon">⚡</span>
              <span className="feature-text">Giao dịch nhanh chóng trên mạng Ethereum</span>
            </li>
            <li>
              <span className="feature-icon">📱</span>
              <span className="feature-text">Giao diện thân thiện, dễ sử dụng</span>
            </li>
          </ul>
        </div>
        
        <div className="about-card">
          <h3>Hướng Dẫn Tham Gia</h3>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Kết nối ví MetaMask</h4>
                <p>Nhấn vào nút "Kết nối ví" ở góc phải màn hình</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Nhập số ETH muốn tham gia</h4>
                <p>Tối thiểu 0.01 ETH cho mỗi vé số</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Xác nhận giao dịch</h4>
                <p>Kiểm tra thông tin và xác nhận trong ví MetaMask của bạn</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Chờ kết quả</h4>
                <p>Theo dõi kết quả xổ số khi quản trị viên chọn người thắng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
