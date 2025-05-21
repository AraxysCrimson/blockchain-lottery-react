// src/components/TransactionHistory.js
import React, { useState, useEffect, useCallback } from 'react';
import './TransactionHistory.css';
import web3 from '../web3';
import lottery from '../Lottery';

const TransactionHistory = ({ currentAccount, isManager }) => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Hàm hiển thị địa chỉ đầy đủ với khả năng sao chép
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

  // Hàm tạo giao dịch mới - chuyển thành useCallback để tránh warning
  const createTransaction = useCallback((type, hash, status, amount, timestamp, gasUsed = '0', gasPrice = '0') => {
    return {
      id: hash || `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      hash,
      status,
      amount,
      timestamp: timestamp || Date.now(),
      gasUsed,
      gasPrice,
      from: currentAccount,
    };
  }, [currentAccount]);

  // Hàm lấy lịch sử giao dịch từ localStorage
  const getTransactionsFromStorage = useCallback(() => {
    try {
      const storedTransactions = localStorage.getItem('lottery_transactions') || '[]';
      return JSON.parse(storedTransactions);
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử giao dịch từ localStorage:', error);
      return [];
    }
  }, []);

  // Hàm lưu giao dịch vào localStorage
  const saveTransactionsToStorage = useCallback((txs) => {
    try {
      localStorage.setItem('lottery_transactions', JSON.stringify(txs));
    } catch (error) {
      console.error('Lỗi khi lưu lịch sử giao dịch vào localStorage:', error);
    }
  }, []);

  // Tải lịch sử giao dịch
  const loadTransactions = useCallback(() => {
    setIsLoading(true);
    
    try {
      // Lấy tất cả giao dịch từ localStorage
      const allTransactions = getTransactionsFromStorage();
      
      // Sắp xếp giao dịch theo thời gian giảm dần
      const sortedTransactions = allTransactions.sort((a, b) => b.timestamp - a.timestamp);
      
      setTransactions(sortedTransactions);
      
      // Cập nhật tổng số trang
      setTotalPages(Math.ceil(sortedTransactions.length / transactionsPerPage));
    } catch (error) {
      console.error('Lỗi khi tải lịch sử giao dịch:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getTransactionsFromStorage, transactionsPerPage]);

  // Theo dõi sự kiện từ contract
  useEffect(() => {
    // Lắng nghe sự kiện mua vé từ contract
    const setupContractListeners = async () => {
      try {
        // Lắng nghe sự kiện PlayerEntered
        lottery.events.PlayerEntered({}, async (error, event) => {
          if (error) {
            console.error('Lỗi khi lắng nghe sự kiện PlayerEntered:', error);
            return;
          }
          
          const { transactionHash, returnValues } = event;
          const { player, amount } = returnValues;
          
          // Chỉ xử lý nếu người chơi là tài khoản hiện tại
          if (player.toLowerCase() === currentAccount.toLowerCase()) {
            console.log('Phát hiện sự kiện PlayerEntered cho tài khoản hiện tại');
            
            // Tạo giao dịch mới
            const newTx = createTransaction(
              'Enter',
              transactionHash,
              'Đã xác nhận',
              web3.utils.fromWei(amount, 'ether'),
              Date.now()
            );
            
            // Thêm vào danh sách giao dịch
            const currentTxs = getTransactionsFromStorage();
            const updatedTxs = [newTx, ...currentTxs];
            saveTransactionsToStorage(updatedTxs);
            setTransactions(updatedTxs);
            
            // Cập nhật tổng số trang
            setTotalPages(Math.ceil(updatedTxs.length / transactionsPerPage));
          }
        });

        // Lắng nghe sự kiện WinnerPicked
        lottery.events.WinnerPicked({}, async (error, event) => {
          if (error) {
            console.error('Lỗi khi lắng nghe sự kiện WinnerPicked:', error);
            return;
          }
          
          const { transactionHash, returnValues } = event;
          
          // Tạo giao dịch mới
          const newTx = createTransaction(
            'Pick Winner',
            transactionHash,
            'Đã xác nhận',
            web3.utils.fromWei(returnValues.amount, 'ether'),
            Date.now()
          );
          
          // Thêm vào danh sách giao dịch
          const currentTxs = getTransactionsFromStorage();
          const updatedTxs = [newTx, ...currentTxs];
          saveTransactionsToStorage(updatedTxs);
          setTransactions(updatedTxs);
          
          // Cập nhật tổng số trang
          setTotalPages(Math.ceil(updatedTxs.length / transactionsPerPage));
        });
      } catch (error) {
        console.error('Lỗi khi thiết lập lắng nghe sự kiện:', error);
      }
    };

    setupContractListeners();
  }, [currentAccount, getTransactionsFromStorage, saveTransactionsToStorage, createTransaction, transactionsPerPage]);

  // Theo dõi sự kiện từ giao diện người dùng
  useEffect(() => {
    // Hàm xử lý khi người dùng gửi form mua vé
    const handleEnterLottery = async (event) => {
      // Kiểm tra xem form có phải là form mua vé không
      if (event.target && event.target.id === 'enter-form') {
        event.preventDefault();
        
        const amountInput = document.getElementById('enter-amount');
        if (amountInput) {
          const amount = amountInput.value;
          
          // Tạo giao dịch tạm thời
          const pendingTx = createTransaction(
            'Enter',
            null,
            'Đang xử lý',
            amount,
            Date.now()
          );
          
          // Thêm vào danh sách giao dịch
          const currentTxs = getTransactionsFromStorage();
          const updatedTxs = [pendingTx, ...currentTxs];
          saveTransactionsToStorage(updatedTxs);
          setTransactions(updatedTxs);
          
          // Cập nhật tổng số trang
          setTotalPages(Math.ceil(updatedTxs.length / transactionsPerPage));
          
          console.log('Đã thêm giao dịch mua vé tạm thời:', pendingTx);
        }
      }
    };

    // Hàm xử lý khi người dùng nhấn nút Pick Winner
    const handlePickWinner = () => {
      // Tạo giao dịch tạm thời
      const pendingTx = createTransaction(
        'Pick Winner',
        null,
        'Đang xử lý',
        '0',
        Date.now()
      );
      
      // Thêm vào danh sách giao dịch
      const currentTxs = getTransactionsFromStorage();
      const updatedTxs = [pendingTx, ...currentTxs];
      saveTransactionsToStorage(updatedTxs);
      setTransactions(updatedTxs);
      
      // Cập nhật tổng số trang
      setTotalPages(Math.ceil(updatedTxs.length / transactionsPerPage));
      
      console.log('Đã thêm giao dịch Pick Winner tạm thời:', pendingTx);
    };

    // Hàm xử lý khi có yêu cầu làm mới lịch sử giao dịch
    const handleRefreshTransactions = () => {
      loadTransactions();
    };

    // Đăng ký lắng nghe các sự kiện
    document.addEventListener('submit', handleEnterLottery);
    window.addEventListener('pickWinnerClicked', handlePickWinner);
    window.addEventListener('refreshTransactions', handleRefreshTransactions);
    
    // Tải lịch sử giao dịch ban đầu
    loadTransactions();
    
    // Hủy đăng ký khi component unmount
    return () => {
      document.removeEventListener('submit', handleEnterLottery);
      window.removeEventListener('pickWinnerClicked', handlePickWinner);
      window.removeEventListener('refreshTransactions', handleRefreshTransactions);
    };
  }, [currentAccount, getTransactionsFromStorage, loadTransactions, saveTransactionsToStorage, createTransaction, transactionsPerPage]);

  // Mở modal chi tiết giao dịch
  const openTransactionDetails = (tx) => {
    setSelectedTransaction(tx);
    setShowModal(true);
  };

  // Đóng modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  // Chuyển đổi giá trị ETH sang USD (giả định)
  const convertToUSD = (ethValue) => {
    // Giả định tỷ giá 1 ETH = 2000 USD
    const ethRate = 2000;
    return (parseFloat(ethValue) * ethRate).toFixed(2);
  };

  // Tính phí gas
  const calculateGasFee = (gasUsed, gasPrice) => {
    return (parseFloat(gasUsed) * parseFloat(gasPrice) / 1e9).toFixed(8);
  };

  // Phân trang
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Chuyển đến trang trước
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Chuyển đến trang tiếp theo
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Chuyển đến một trang cụ thể
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Tạo mảng các nút phân trang
  const renderPaginationButtons = () => {
    const pageButtons = [];
    
    // Hiển thị tất cả các nút trang (vì thường không quá nhiều)
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <button 
          key={i} 
          className={`pagination-button ${currentPage === i ? 'active' : ''}`} 
          onClick={() => goToPage(i)}
        >
          {i}
        </button>
      );
    }
    
    return pageButtons;
  };

  // Render modal chi tiết giao dịch
  const renderTransactionModal = () => {
    if (!selectedTransaction) return null;
    
    const tx = selectedTransaction;
    const gasFee = calculateGasFee(tx.gasUsed, tx.gasPrice);
    const totalCost = tx.type === 'Enter' ? 
      (parseFloat(tx.amount) + parseFloat(gasFee)).toFixed(8) : 
      gasFee;
    
    return (
      <div className={`transaction-modal-overlay ${showModal ? 'show' : ''}`} onClick={closeModal}>
        <div className="transaction-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{tx.type === 'Enter' ? 'Tham Gia Xổ Số' : 'Chọn Người Thắng'}</h2>
            <button className="close-btn" onClick={closeModal}>&times;</button>
          </div>
          
          <div className="modal-body">
            <div className="transaction-status">
              <div className={`status-badge ${tx.status === 'Đã xác nhận' ? 'confirmed' : 'pending'}`}>
                {tx.status}
              </div>
              <div className="transaction-date">
                {new Date(tx.timestamp).toLocaleString('vi-VN')}
              </div>
            </div>
            
            <div className="transaction-details">
              <div className="detail-row">
                <div className="detail-label">Số lượng</div>
                <div className="detail-value">
                  {tx.type === 'Enter' ? '-' : ''}{tx.amount} ETH
                  <div className="detail-usd">${convertToUSD(tx.amount)} USD</div>
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">Phí gas</div>
                <div className="detail-value">
                  {gasFee} ETH
                  <div className="detail-usd">${convertToUSD(gasFee)} USD</div>
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">Phí tối đa mỗi gas</div>
                <div className="detail-value">
                  {parseFloat(tx.gasPrice).toFixed(9)} ETH
                  <div className="detail-usd">${convertToUSD(parseFloat(tx.gasPrice).toFixed(9))} USD</div>
                </div>
              </div>
              
              <div className="detail-row total-row">
                <div className="detail-label">Tổng cộng</div>
                <div className="detail-value">
                  {tx.type === 'Enter' ? '-' : ''}{totalCost} ETH
                  <div className="detail-usd">${convertToUSD(totalCost)} USD</div>
                </div>
              </div>
            </div>
            
            <div className="transaction-activity">
              <div className="activity-header">
                <h3>Hoạt động</h3>
              </div>
              
              <div className="activity-items">
                <div className="activity-item">
                  <div className="activity-icon">
                    <div className="icon-mini">↑</div>
                  </div>
                  <div className="activity-text">
                    <strong>Từ:</strong>
                    <div className="address-container">
                      {displayFullAddress(tx.from)}
                    </div>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">
                    <div className="icon-mini">↓</div>
                  </div>
                  <div className="activity-text">
                    <strong>Đến:</strong>
                    <div className="address-container">
                      {displayFullAddress(lottery.options.address)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Hiển thị thông tin phân trang
  const renderPaginationInfo = () => {
    if (transactions.length === 0) return null;
    
    const startItem = (currentPage - 1) * transactionsPerPage + 1;
    const endItem = Math.min(startItem + currentTransactions.length - 1, transactions.length);
    
    return (
      <div className="pagination-info">
        Hiển thị <span className="highlight">{startItem}-{endItem}</span> trên tổng số <span className="highlight">{transactions.length}</span> giao dịch
      </div>
    );
  };

  // Render danh sách giao dịch theo kiểu bảng (giống PlayersList)
  const renderTransactionsTable = () => {
    if (transactions.length === 0) {
      return (
        <div className="no-transactions-message">
          <div className="no-transactions-icon">📝</div>
          <p>Chưa có giao dịch nào</p>
          <p>Các giao dịch của bạn sẽ hiển thị ở đây!</p>
        </div>
      );
    }

    return (
      <div className="transactions-table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Loại</th>
              <th>Trạng thái</th>
              <th>Số lượng</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((tx, index) => {
              // Tính toán STT thực tế dựa trên trang hiện tại
              const realIndex = (currentPage - 1) * transactionsPerPage + index;
              
              return (
                <tr 
                  key={tx.id} 
                  onClick={() => openTransactionDetails(tx)}
                  className={`transaction-row ${tx.type === 'Pick Winner' ? 'winner-row' : ''}`}
                >
                  <td>{realIndex + 1}</td>
                  <td>
                    <div className="transaction-type">
                      <span className={`type-icon ${tx.type === 'Pick Winner' ? 'winner-icon' : 'enter-icon'}`}>
                        {tx.type === 'Pick Winner' ? '🏆' : '🎟️'}
                      </span>
                      <span>{tx.type === 'Enter' ? 'Tham Gia Xổ Số' : 'Chọn Người Thắng'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${tx.status === 'Đã xác nhận' ? 'confirmed' : 'pending'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="amount-cell">
                    <div className="eth-amount">{tx.amount} ETH</div>
                    <div className="usd-amount">${convertToUSD(tx.amount)}</div>
                  </td>
                  <td>{new Date(tx.timestamp).toLocaleString('vi-VN')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="transaction-history-section">
      <div className="section-header">
        <h3>Lịch sử giao dịch {transactions.length > 0 && `(${transactions.length})`}</h3>
      </div>
      
      <div className="transaction-content">
        {isLoading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Đang tải lịch sử giao dịch...</p>
          </div>
        ) : (
          <>
            {renderTransactionsTable()}
            
            {/* Hiển thị phân trang nếu có nhiều giao dịch */}
            {transactions.length > transactionsPerPage && (
              <div className="pagination-container">
                {renderPaginationInfo()}
                <div className="pagination">
                  <button 
                    className="pagination-button pagination-nav" 
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    &laquo;
                  </button>
                  
                  {renderPaginationButtons()}
                  
                  <button 
                    className="pagination-button pagination-nav" 
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    &raquo;
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {renderTransactionModal()}
    </div>
  );
};

export default TransactionHistory;
