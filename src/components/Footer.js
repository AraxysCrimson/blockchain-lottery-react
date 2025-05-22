// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../logo.png'; // Import logo từ thư mục src

function Footer() {
  // Năm hiện tại cho copyright
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo">
            <Link to="/" className="logo-icon">
              <img src={logo} alt="Logo" className="footer-logo-image" />
            </Link>
            <h3>XỔ SỐ BLOCKCHAIN</h3>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h4>Thông tin</h4>
              <ul>
                <li><Link to="/info#about">Giới thiệu</Link></li>
                <li><Link to="/info#how-it-works">Cách thức hoạt động</Link></li>
                <li><Link to="/info#smart-contract">Smart Contract</Link></li>
                <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Tài nguyên</h4>
              <ul>
                <li><a href="https://etherscan.io" target="_blank" rel="noopener noreferrer">Etherscan</a></li>
                <li><a href="https://cryptosec.info/audits/" target="_blank" rel="noopener noreferrer">Audit & Bảo mật</a></li>
                <li><a href="https://ethereum.org/en/learn/" target="_blank" rel="noopener noreferrer">Blockchain 101</a></li>
                <li><a href="https://web3js.readthedocs.io/en/v1.7.0/" target="_blank" rel="noopener noreferrer">Web3.js API</a></li>
              </ul>
            </div>

            
            <div className="footer-section">
              <h4>Liên hệ</h4>
              <ul>
                <li><a href="mailto:nvduy21@pdu.edu.vn">nvduy21@pdu.edu.vn</a></li>
                <li><a href="tel:+84365790125">+84 365 790 125</a></li>
                <li>
                  <div className="social-links">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                      </svg>
                    </a>
                    <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7.666c-.75.35-.85 1.15-.5 1.7.45.55 1.5.75 2.1.55l3.8-1.3 2.1 5.9c.252.71 1.17 1.05 1.87.78.75-.25 1.05-1.25.75-1.9L11.1 11.9l8.3-2.33c.75-.25 1.05-1.25.75-1.9-.25-.65-1.05-1.05-1.75-.85l-10.5 3.75-3.5-1c-.5-.15-.8-.65-.8-1.15.05-.5.4-.9.9-1l16-7.5c.5-.25.9-.8.9-1.33 0-.55-.35-1.1-.85-1.33z"></path>
                      </svg>
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {currentYear} Xổ Số Blockchain - Được xây dựng trên nền tảng Ethereum - Bài Tập lớn môn Chuyên đề - Nhóm 3 Duy, Hiếu, Sâm, Vĩnh</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
