// src/components/CountdownBanner.js
import React, { useState, useEffect, useRef } from 'react';
import './CountdownBanner.css';

function CountdownBanner({ timeUntilDraw, formatDrawTime, sloganChangeInterval = 3000 }) {
  const [randomPhraseIndex, setRandomPhraseIndex] = useState(0);
  // Sử dụng useRef để lưu trữ thông tin về interval
  const intervalIdRef = useRef(null);
  // Sử dụng useRef để lưu trữ thời gian thay đổi slogan
  const intervalTimeRef = useRef(sloganChangeInterval);
  
  // Mảng các câu slogan hấp dẫn
  const catchphrases = [
    "Sau {time} biết đâu bạn lại thành đại gia!",
    "Còn {time}, vận may đang gõ cửa nhà bạn!",
    "Một cú click - ngàn điều ước, chỉ còn {time}!",
    "Tích cực mua vé, thần Tài sẽ ghé!",
    "Xoay chuyển vận mệnh, chỉ cách {time}!",
    "Đừng chần chừ, may mắn chỉ chờ {time}!",
    "Bỏ lỡ hôm nay, tiếc cả đời!",
    "Mỗi giây trôi qua là một cơ hội bay xa!",
    "Thời gian không chờ đợi - {time} là thời khắc quyết định!",
    "Chỉ một vé, mở khóa tương lai vàng son!",
    "Mỗi giấc mơ lớn đều bắt đầu từ một cơ hội nhỏ!",
    "Tay nắm vé, lòng chạm vào điều kỳ diệu!",
    "Hạnh phúc có khi chỉ cách {time} nữa thôi!",
    "Bầu trời vận may đang chờ bạn vẽ lên điều kỳ diệu!",
    "Bạn sẽ là người viết tiếp câu chuyện kỳ tích?",
    "Nhanh tay kẻo lỡ, còn {time} nữa thôi!",
    "Vé trong tay, cơ hội ngay hôm nay!",
    "Giàu hay không, quyết định trong {time}!",
    "Càng nhanh tay, càng gần vận may!",
    "Một khoảnh khắc chậm chân - cả đời tiếc nuối!",
    "May mắn đang gọi tên bạn!",
    "Một ngày đẹp trời để trở thành triệu phú!",
    "Mua vé hôm nay, kể chuyện thần kỳ ngày mai!",
    "Chỉ còn {time}, chớp lấy khoảnh khắc thay đổi đời mình!",
    "Bạn + {time} + một chiếc vé = điều kỳ diệu!",
    "Đồng hồ đang đếm ngược tới vận may!",
    "Hãy để {time} nữa biến bạn thành huyền thoại!",
    "Thành công đến từ hành động, không phải chờ đợi!",
    "Chờ gì nữa? {time} là của bạn!",
    "Thần may mắn không gõ cửa hai lần!",
    "Hãy là người tạo ra kết thúc có hậu cho hôm nay!",
    "Bạn xứng đáng với một lần bứt phá!",
    "Chớp lấy khoảnh khắc, đổi lấy tương lai!",
    "Cú nhấp chuột đáng giá cả cuộc đời!",
    "Khi bạn hành động, vũ trụ sẽ phản hồi!",
    "Bí quyết của người giàu? Dám thử vận may!",
    "Thử vận hôm nay, thắng lớn ngày mai!",
    "Bạn không thua khi thử, bạn chỉ thua khi bỏ cuộc!",
    "Một tấm vé – ngàn hy vọng – một cuộc đời mới!",
    "Nếu không phải bây giờ thì khi nào?",
    "Vé số không chỉ là trò chơi – đó là niềm tin!",
    "Hành trình triệu phú bắt đầu bằng cú click đầu tiên!",
    "Bạn đã đủ gan để thay đổi vận mệnh?",
    "Chưa thử thì chưa biết, còn {time} để chọn lựa!"
  ];
  
  // Cập nhật thời gian thay đổi slogan nếu prop thay đổi
  useEffect(() => {
    intervalTimeRef.current = sloganChangeInterval;
    
    // Nếu interval đã tồn tại, xóa và tạo lại với thời gian mới
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      
      intervalIdRef.current = setInterval(() => {
        setRandomPhraseIndex(prevIndex => {
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * catchphrases.length);
          } while (newIndex === prevIndex && catchphrases.length > 1);
          return newIndex;
        });
      }, intervalTimeRef.current);
    }
    
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [sloganChangeInterval, catchphrases.length]);
  
  // Khởi tạo slogan ngẫu nhiên và thiết lập interval lần đầu
  useEffect(() => {
    // Khởi tạo với một câu slogan ngẫu nhiên
    setRandomPhraseIndex(Math.floor(Math.random() * catchphrases.length));
    
    // Tạo interval để đổi câu slogan theo thời gian đã cấu hình
    intervalIdRef.current = setInterval(() => {
      setRandomPhraseIndex(prevIndex => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * catchphrases.length);
        } while (newIndex === prevIndex && catchphrases.length > 1);
        return newIndex;
      });
    }, intervalTimeRef.current);
    
    // Dọn dẹp interval khi component unmount
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Thay thế placeholder {time} bằng thời gian thực
  const formattedPhrase = catchphrases[randomPhraseIndex].replace('{time}', 
    `<span class="time-highlight">${timeUntilDraw}</span>`);
  
  return (
    <div className="countdown-banner">
      <div className="countdown-info">
        <div className="countdown-text">
          <h2 className="title">
            <span className="icon-wrapper">✨</span>
            Xổ số sắp diễn ra!
          </h2>
          <p className="draw-time">Hàng ngày lúc {formatDrawTime()}</p>
          <p className="catchphrase" dangerouslySetInnerHTML={{ __html: formattedPhrase }}></p>
        </div>
        
        <div className="countdown-timer">
          <span className="icon-wrapper">⏱️</span>
          <span className="timer-text">{timeUntilDraw}</span>
        </div>
      </div>
    </div>
  );
}

// Sử dụng React.memo để tránh re-render không cần thiết
export default React.memo(CountdownBanner);
