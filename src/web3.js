// src/web3.js
import Web3 from 'web3';

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  try {
    // Yêu cầu quyền truy cập tài khoản
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        console.log("Đã kết nối với tài khoản MetaMask:", accounts[0]);
      })
      .catch(error => {
        console.error("Người dùng từ chối truy cập:", error);
      });
  } catch (error) {
    console.error("Lỗi khi yêu cầu truy cập MetaMask:", error);
  }
} else if (window.web3) {
  // Phiên bản cũ của MetaMask
  console.log("Sử dụng phiên bản cũ của MetaMask");
  web3 = new Web3(window.web3.currentProvider);
} else {
  console.error("MetaMask chưa được cài đặt!");
  alert("MetaMask chưa được cài đặt! Vui lòng cài đặt MetaMask để sử dụng ứng dụng.");
}

export default web3;