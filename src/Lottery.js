// src/Lottery.js
import web3 from './web3';
import SimpleLottery from './build/contracts/SimpleLottery.json';

// Địa chỉ contract sau khi deploy
const contractAddress = "0xaf1fc69f1326aDdF9140779aF44743B6c99A3e0b";

// Kiểm tra ABI trước khi khởi tạo contract
if (!SimpleLottery.abi) {
  console.error("Không tìm thấy ABI trong file SimpleLottery.json");
}

// Log thông tin ABI để debug
console.log("ABI của contract:", SimpleLottery.abi);

// Kiểm tra xem có các event và function cần thiết không
const hasWinnerPickedEvent = SimpleLottery.abi.some(
  item => item.type === 'event' && item.name === 'WinnerPicked'
);
console.log("Contract có event WinnerPicked:", hasWinnerPickedEvent);

const hasGetWinnerHistoryFunction = SimpleLottery.abi.some(
  item => item.type === 'function' && item.name === 'getWinnerHistory'
);
console.log("Contract có function getWinnerHistory:", hasGetWinnerHistoryFunction);

const contract = new web3.eth.Contract(
  SimpleLottery.abi,
  contractAddress
);

// Log địa chỉ contract để xác nhận
console.log("Đã khởi tạo contract tại địa chỉ:", contractAddress);

export default contract;