// src/components/PlayersList.js
import React, { useState, useEffect, useCallback } from 'react';
import './PlayersList.css';

function PlayersList({ players, currentAccount, shortenAddress, title = "Danh Sách Người Tham Gia" }) {
  // Số lượng người chơi hiển thị trên mỗi trang
  const PLAYERS_PER_PAGE = 5;
  
  // State cho trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  // Tổng số trang
  const [totalPages, setTotalPages] = useState(1);
  // Danh sách người chơi trên trang hiện tại
  const [currentPlayers, setCurrentPlayers] = useState([]);

  // Hàm cập nhật danh sách người chơi cho trang hiện tại - đặt trong useCallback
  const updateCurrentPlayers = useCallback(() => {
    if (!players || players.length === 0) {
      setCurrentPlayers([]);
      return;
    }
    
    const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE;
    const endIndex = Math.min(startIndex + PLAYERS_PER_PAGE, players.length);
    setCurrentPlayers(players.slice(startIndex, endIndex));
  }, [players, currentPage, PLAYERS_PER_PAGE]);

  // Tính toán tổng số trang và cập nhật danh sách người chơi hiện tại khi players thay đổi
  useEffect(() => {
    if (players && players.length > 0) {
      const total = Math.ceil(players.length / PLAYERS_PER_PAGE);
      setTotalPages(total);
      
      // Đảm bảo trang hiện tại không vượt quá tổng số trang
      if (currentPage > total) {
        setCurrentPage(1);
      }
      
      // Cập nhật danh sách người chơi cho trang hiện tại
      updateCurrentPlayers();
    } else {
      setTotalPages(1);
      setCurrentPlayers([]);
    }
  }, [players, currentPage, updateCurrentPlayers, PLAYERS_PER_PAGE]);

  // Cập nhật danh sách người chơi khi trang hiện tại thay đổi
  useEffect(() => {
    updateCurrentPlayers();
  }, [currentPage, updateCurrentPlayers]);

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
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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

  // Xử lý trường hợp không có người chơi
  const renderEmptyState = () => (
    <div className="no-players-message">
      <div className="no-players-icon">👥</div>
      <p>Chưa có người tham gia xổ số</p>
      <p>Hãy là người đầu tiên tham gia!</p>
    </div>
  );

  // Xử lý hiển thị bảng người chơi
  const renderPlayersTable = () => (
    <div className="players-table-container">
      <table className="players-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Địa Chỉ Ví</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {currentPlayers.map((player, index) => {
            // Tính toán STT thực tế dựa trên trang hiện tại
            const realIndex = (currentPage - 1) * PLAYERS_PER_PAGE + index;
            
            return (
              <tr 
                key={index} 
                className={player.toLowerCase() === currentAccount.toLowerCase() ? 'current-user' : ''}
              >
                <td>{realIndex + 1}</td>
                <td>{shortenAddress ? shortenAddress(player) : player}</td>
                <td>
                  {player.toLowerCase() === currentAccount.toLowerCase() ? 
                    <span className="user-badge">Bạn</span> : 
                    <span className="player-badge">Người chơi</span>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Hiển thị thông tin phân trang
  const renderPaginationInfo = () => {
    if (!players || players.length === 0) return null;
    
    const startItem = (currentPage - 1) * PLAYERS_PER_PAGE + 1;
    const endItem = Math.min(startItem + currentPlayers.length - 1, players.length);
    
    return (
      <div className="pagination-info">
        Hiển thị <span className="highlight">{startItem}-{endItem}</span> trên tổng số <span className="highlight">{players.length}</span> người chơi
      </div>
    );
  };

  return (
    <div className="players-section">
      <h3>{title} {players && players.length > 0 && `(${players.length})`}</h3>
      {!players || players.length === 0 ? renderEmptyState() : renderPlayersTable()}
      
      {/* Hiển thị phân trang nếu có nhiều người chơi */}
      {players && players.length > PLAYERS_PER_PAGE && (
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
    </div>
  );
}

export default PlayersList;
