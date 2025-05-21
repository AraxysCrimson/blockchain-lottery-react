import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

// Thêm xử lý lỗi toàn cục
window.addEventListener('error', (event) => {
  console.error('Lỗi toàn cục:', event.error);
});

// Thêm xử lý promise rejection không được bắt
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejection không được xử lý:', event.reason);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();