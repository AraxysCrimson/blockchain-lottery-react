// src/App.js
import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import web3 from './web3';
import lottery from './Lottery';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
//import Dashboard from './components/Dashboard';
//import InfoSection from './components/InfoSection';
import AboutSection from './components/AboutSection';
//import CountdownBanner from './components/CountdownBanner';
//import PlayersList from './components/PlayersList';
import FAQ from './components/FAQ';
//import TransactionHistory from './components/TransactionHistory';
import HomePage from './components/HomePage';

function App() {
  // Định nghĩa tất cả state
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentAccount, setCurrentAccount] = useState('');
  const [winner, setWinner] = useState('');
  const [winAmount, setWinAmount] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [timeUntilDraw, setTimeUntilDraw] = useState('');
  const [isManager, setIsManager] = useState(false);
  

  // Thời gian xổ số hàng ngày - 17h tối (17:00)
  const DRAW_HOUR = 17;
  const DRAW_MINUTE = 0;

  // Rút gọn địa chỉ để hiển thị
  const shortenAddress = (address) => {
    if (!address) return 'N/A';
    return address.substring(0, 6) + '...' + address.substring(address.length - 4);
  };

  // Định dạng thời gian xổ số
  const formatDrawTime = () => {
    return `${DRAW_HOUR}:${DRAW_MINUTE.toString().padStart(2, '0')}`;
  };

  // Hàm tạo giao dịch mới cho localStorage
  const createTransaction = useCallback((type, hash, status, amount, timestamp) => {
    return {
      id: hash || `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      hash,
      status,
      amount,
      timestamp: timestamp || Date.now(),
      gasUsed: '0',
      gasPrice: '0',
      from: currentAccount,
    };
  }, [currentAccount]);

  // Hàm lấy lịch sử giao dịch từ localStorage
  const getTransactionsFromStorage = () => {
    try {
      const storedTransactions = localStorage.getItem('lottery_transactions') || '[]';
      return JSON.parse(storedTransactions);
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử giao dịch từ localStorage:', error);
      return [];
    }
  };

  // Hàm lưu giao dịch vào localStorage
  const saveTransactionsToStorage = (txs) => {
    try {
      localStorage.setItem('lottery_transactions', JSON.stringify(txs));
    } catch (error) {
      console.error('Lỗi khi lưu lịch sử giao dịch vào localStorage:', error);
    }
  };

  // Các hàm xử lý
  const onSubmit = async () => {
    setIsLoading(true);
    setMessage('Đang xử lý giao dịch...');
    
    try {
      const accounts = await web3.eth.getAccounts();
      console.log("Tài khoản đang tham gia xổ số:", accounts[0]);
      
      // Tạo giao dịch tạm thời trước khi gửi
      const pendingTx = createTransaction(
        'Enter',
        null,
        'Đang xử lý',
        value,
        Date.now()
      );
      
      // Lưu giao dịch tạm thời vào localStorage
      const storedTxs = getTransactionsFromStorage();
      saveTransactionsToStorage([pendingTx, ...storedTxs]);
      
      // Kích hoạt sự kiện làm mới giao dịch
      window.dispatchEvent(new CustomEvent('refreshTransactions'));
      
      // Gửi giao dịch đến blockchain
      const result = await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether')
      });
      
      console.log("Đã tham gia xổ số thành công, hash:", result.transactionHash);
      
      // Cập nhật giao dịch với hash thực tế
      const updatedTx = {
        ...pendingTx,
        hash: result.transactionHash,
        status: 'Đã xác nhận',
      };
      
      // Cập nhật localStorage
      const currentTxs = getTransactionsFromStorage();
      const updatedTxs = currentTxs.map(tx => 
        tx.id === pendingTx.id ? updatedTx : tx
      );
      saveTransactionsToStorage(updatedTxs);
      
      // Kích hoạt sự kiện làm mới giao dịch
      window.dispatchEvent(new CustomEvent('refreshTransactions'));
      
      setMessage('Bạn đã tham gia xổ số thành công!');
      setValue('');
      await refreshData();
    } catch (error) {
      console.error("Lỗi khi tham gia xổ số:", error);
      setMessage('Lỗi: ' + error.message);
      
      // Xóa giao dịch đang xử lý nếu có lỗi
      const currentTxs = getTransactionsFromStorage();
      const filteredTxs = currentTxs.filter(tx => tx.status !== 'Đang xử lý');
      saveTransactionsToStorage(filteredTxs);
      
      // Kích hoạt sự kiện làm mới giao dịch
      window.dispatchEvent(new CustomEvent('refreshTransactions'));
    }
    
    setIsLoading(false);
  };

  const pickWinner = async () => {
    setIsLoading(true);
    setMessage('Đang chọn người chiến thắng...');
    
    try {
      const accounts = await web3.eth.getAccounts();
      console.log("Tài khoản gọi pickWinner:", accounts[0]);
      
      // Tạo giao dịch tạm thời
      const pendingTx = createTransaction(
        'Pick Winner',
        null,
        'Đang xử lý',
        balance,
        Date.now()
      );
      
      // Lưu giao dịch tạm thời vào localStorage
      const storedTxs = getTransactionsFromStorage();
      saveTransactionsToStorage([pendingTx, ...storedTxs]);
      
      // Kích hoạt sự kiện làm mới giao dịch
      window.dispatchEvent(new CustomEvent('refreshTransactions'));
      window.dispatchEvent(new CustomEvent('pickWinnerClicked'));
      
      // Gửi giao dịch đến blockchain
      const tx = await lottery.methods.pickWinner().send({
        from: accounts[0]
      });
      
      console.log("Kết quả giao dịch pickWinner:", tx);
      
      // Cập nhật giao dịch với hash thực tế
      const updatedTx = {
        ...pendingTx,
        hash: tx.transactionHash,
        status: 'Đã xác nhận',
      };
      
      // Cập nhật localStorage
      const currentTxs = getTransactionsFromStorage();
      const updatedTxs = currentTxs.map(tx => 
        tx.id === pendingTx.id ? updatedTx : tx
      );
      saveTransactionsToStorage(updatedTxs);
      
      setMessage('Đã chọn người chiến thắng thành công!');
      
      // Đợi một chút để blockchain cập nhật
      setTimeout(async () => {
        await refreshData();
        
        // Gửi sự kiện để cập nhật lịch sử
        console.log("Phát sự kiện pickWinnerSuccess");
        window.dispatchEvent(new CustomEvent('pickWinnerSuccess'));
        window.dispatchEvent(new CustomEvent('refreshTransactions'));
        
        // Cập nhật thông tin người thắng gần nhất nếu có
        try {
          if (lottery.methods.getLatestWinner) {
            console.log("Đang lấy thông tin người thắng gần nhất...");
            const latestWinner = await lottery.methods.getLatestWinner().call();
            console.log("Thông tin người thắng gần nhất:", latestWinner);
            
            if (latestWinner && latestWinner[0]) {
              setWinner(latestWinner[0]);
              setWinAmount(web3.utils.fromWei(latestWinner[1].toString(), 'ether'));
            }
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người thắng gần nhất:", error);
        }
        
        setMessage('Đã chọn người chiến thắng thành công! Lịch sử đã được cập nhật.');
      }, 2000);
      
    } catch (error) {
      console.error("Lỗi khi chọn người thắng:", error);
      setMessage('Lỗi: ' + error.message);
      
      // Xóa giao dịch đang xử lý nếu có lỗi
      const currentTxs = getTransactionsFromStorage();
      const filteredTxs = currentTxs.filter(tx => tx.status !== 'Đang xử lý');
      saveTransactionsToStorage(filteredTxs);
      
      // Kích hoạt sự kiện làm mới giao dịch
      window.dispatchEvent(new CustomEvent('refreshTransactions'));
    }
    
    setIsLoading(false);
  };

  const refreshData = async () => {
    try {
      console.log("Đang làm mới dữ liệu...");
      
      const playersList = await lottery.methods.getPlayers().call();
      console.log("Danh sách người chơi:", playersList);
      setPlayers(playersList);
      
      const contractBalance = await web3.eth.getBalance(lottery.options.address);
      console.log("Số dư hợp đồng:", web3.utils.fromWei(contractBalance, 'ether'), "ETH");
      setBalance(web3.utils.fromWei(contractBalance, 'ether'));
      
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        const balance = await web3.eth.getBalance(accounts[0]);
        console.log("Số dư tài khoản người dùng:", web3.utils.fromWei(balance, 'ether'), "ETH");
        setAccountBalance(web3.utils.fromWei(balance, 'ether'));
        setCurrentAccount(accounts[0]);
        
        // Cập nhật trạng thái isManager
        const managerAddress = await lottery.methods.manager().call();
        setIsManager(accounts[0].toLowerCase() === managerAddress.toLowerCase());
      }
      
      // Gửi sự kiện để cập nhật lịch sử
      console.log("Phát sự kiện forceRefreshWinnerHistory");
      window.dispatchEvent(new CustomEvent('forceRefreshWinnerHistory'));
      window.dispatchEvent(new CustomEvent('refreshTransactions'));
    } catch (error) {
      console.error("Lỗi khi làm mới dữ liệu:", error);
    }
  };

  useEffect(() => {
    console.log("App component đã được khởi tạo");
    
    const loadBlockchainData = async () => {
      try {
        console.log("Đang tải dữ liệu blockchain...");
        
        // Lấy thông tin manager
        const managerAddress = await lottery.methods.manager().call();
        console.log("Địa chỉ manager:", managerAddress);
        setManager(managerAddress);
        
        // Lấy danh sách người chơi
        const playersList = await lottery.methods.getPlayers().call();
        console.log("Danh sách người chơi:", playersList);
        setPlayers(playersList);
        
        // Lấy số dư của hợp đồng
        const contractBalance = await web3.eth.getBalance(lottery.options.address);
        console.log("Số dư hợp đồng:", web3.utils.fromWei(contractBalance, 'ether'), "ETH");
        setBalance(web3.utils.fromWei(contractBalance, 'ether'));
        
        // Lấy tài khoản hiện tại
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          console.log("Tài khoản hiện tại:", accounts[0]);
          setCurrentAccount(accounts[0]);
          
          // Lấy số dư của tài khoản người dùng
          const balance = await web3.eth.getBalance(accounts[0]);
          console.log("Số dư tài khoản người dùng:", web3.utils.fromWei(balance, 'ether'), "ETH");
          setAccountBalance(web3.utils.fromWei(balance, 'ether'));
          
          // Cập nhật trạng thái isManager
          setIsManager(accounts[0].toLowerCase() === managerAddress.toLowerCase());
        }
        
        // Thử lấy thông tin người thắng gần nhất
        try {
          if (lottery.methods.getLatestWinner) {
            console.log("Đang thử lấy thông tin người thắng gần nhất...");
            const latestWinner = await lottery.methods.getLatestWinner().call();
            console.log("Thông tin người thắng gần nhất:", latestWinner);
            
            if (latestWinner && latestWinner[0]) {
              setWinner(latestWinner[0]);
              setWinAmount(web3.utils.fromWei(latestWinner[1].toString(), 'ether'));
            }
          }
        } catch (error) {
          console.log("Không có người thắng gần nhất hoặc lỗi:", error.message);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setIsLoading(false);
      }
    };
    
    loadBlockchainData();
    
    // Lắng nghe sự kiện thay đổi tài khoản MetaMask
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts) => {
        console.log("Tài khoản MetaMask đã thay đổi:", accounts[0]);
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          const balance = await web3.eth.getBalance(accounts[0]);
          setAccountBalance(web3.utils.fromWei(balance, 'ether'));
          
          // Cập nhật trạng thái isManager
          const managerAddress = await lottery.methods.manager().call();
          setIsManager(accounts[0].toLowerCase() === managerAddress.toLowerCase());
        } else {
          setCurrentAccount('');
          setAccountBalance('0');
          setIsManager(false);
        }
        
        // Kích hoạt sự kiện làm mới giao dịch khi đổi tài khoản
        window.dispatchEvent(new CustomEvent('refreshTransactions'));
      });
    }
    
    // Cập nhật thời gian còn lại đến lần xổ số tiếp theo
    const updateTimeUntilDraw = () => {
      const now = new Date();
      const drawTime = new Date();
      
      drawTime.setHours(DRAW_HOUR, DRAW_MINUTE, 0, 0);
      
      // Nếu thời gian hiện tại đã qua thời gian xổ số, tính cho ngày mai
      if (now > drawTime) {
        drawTime.setDate(drawTime.getDate() + 1);
      }
      
      const timeDiff = drawTime - now;
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      setTimeUntilDraw(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };
    
    updateTimeUntilDraw();
    const timerInterval = setInterval(updateTimeUntilDraw, 1000);
    
    // Thiết lập auto refresh dữ liệu mỗi 30 giây
    const refreshInterval = setInterval(refreshData, 30000);
    
    // Lắng nghe sự kiện từ contract
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
          
          console.log('Phát hiện sự kiện PlayerEntered:', player, amount);
          
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
            
            // Kiểm tra xem giao dịch này đã tồn tại chưa
            const exists = currentTxs.some(tx => tx.hash === transactionHash);
            if (!exists) {
              const updatedTxs = [newTx, ...currentTxs];
              saveTransactionsToStorage(updatedTxs);
              window.dispatchEvent(new CustomEvent('refreshTransactions'));
            }
            
            await refreshData();
          }
        });

        // Lắng nghe sự kiện WinnerPicked
        lottery.events.WinnerPicked({}, async (error, event) => {
          if (error) {
            console.error('Lỗi khi lắng nghe sự kiện WinnerPicked:', error);
            return;
          }
          
          const { transactionHash, returnValues } = event;
          
          console.log('Phát hiện sự kiện WinnerPicked:', returnValues);
          
          // Tạo giao dịch mới
          const newTx = createTransaction(
            'Pick Winner',
            transactionHash,
            'Đã xác nhận',
            web3.utils.fromWei(returnValues.amount || '0', 'ether'),
            Date.now()
          );
          
          // Thêm vào danh sách giao dịch
          const currentTxs = getTransactionsFromStorage();
          
          // Kiểm tra xem giao dịch này đã tồn tại chưa
          const exists = currentTxs.some(tx => tx.hash === transactionHash);
          if (!exists) {
            const updatedTxs = [newTx, ...currentTxs];
            saveTransactionsToStorage(updatedTxs);
            window.dispatchEvent(new CustomEvent('refreshTransactions'));
          }
          
          await refreshData();
        });
      } catch (error) {
        console.error('Lỗi khi thiết lập lắng nghe sự kiện:', error);
      }
    };
    
    setupContractListeners();
    
    return () => {
      console.log("App component đang được hủy");
      clearInterval(timerInterval);
      clearInterval(refreshInterval);
      
      // Hủy lắng nghe sự kiện thay đổi tài khoản
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, [currentAccount, createTransaction]);

  // Kiểm tra xem người dùng có đang tham gia không
  //const isPlayerParticipating = players.some(player => player.toLowerCase() === currentAccount.toLowerCase());

  
  return (
    <div className="app-wrapper">
      <Header />
      <div className="app-container">
        <main className="app-main">
          <Routes>
          <Route
            path="/"
            element={
              <HomePage
                timeUntilDraw={timeUntilDraw}
                formatDrawTime={formatDrawTime}
                balance={balance}
                players={players}
                accountBalance={accountBalance}
                isPlayerParticipating={players.some(player => player.toLowerCase() === currentAccount.toLowerCase())}
                value={value}
                setValue={setValue}
                onSubmit={onSubmit}
                isLoading={isLoading}
                isManager={isManager}
                pickWinner={pickWinner}
                currentAccount={currentAccount}
                winner={winner}
                winAmount={winAmount}
                manager={manager}
                message={message}
                shortenAddress={shortenAddress}
              />
            }
          />
            <Route path="/info" element={<AboutSection />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;