// src/components/Header.js
import React from 'react';
import { Link, NavLink } from 'react-router-dom';  // Thêm import này
import './Header.css';
import logo from '../logo.png';

function Header() {
  // Hàm mở MetaMask khi nhấn vào nút kết nối ví
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Đã kết nối với ví:', accounts[0]);
        // Gán vào state nếu cần
      } catch (error) {
        console.error('Người dùng từ chối kết nối:', error);
      }
    } else {
      alert("MetaMask chưa được cài đặt!");
    }
  };
  

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo">
            <img src={logo} alt="Logo" className="logo-image" />
          </Link>
          <div className="brand-text">
            <h1>XỔ SỐ BLOCKCHAIN</h1>
            <p className="subtitle">Hệ thống xổ số minh bạch trên nền tảng Ethereum</p>
          </div>
        </div>
        
        <nav className="main-nav">
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
                Trang chủ
              </NavLink>
            </li>
            <li>
              <NavLink to="/info" className={({ isActive }) => isActive ? "active" : ""}>
                Thông tin
              </NavLink>
            </li>
            <li>
              <NavLink to="/faq" className={({ isActive }) => isActive ? "active" : ""}>
                Hỏi đáp
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="connect-wallet">
          <button className="connect-btn" onClick={connectWallet}>
            <span className="connect-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M22 10h-4a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h4"></path>
              </svg>
            </span>
            <span>Kết nối ví</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
