// src/components/FAQ.js
import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  // State để theo dõi câu hỏi nào đang mở
  const [activeIndex, setActiveIndex] = useState(null);

  // Danh sách câu hỏi và trả lời
  const faqItems = [
    {
      question: 'Xổ số Blockchain là gì?',
      answer: 'Xổ số Blockchain là một ứng dụng phi tập trung (dApp) được xây dựng trên nền tảng Ethereum, sử dụng công nghệ Smart Contract để đảm bảo tính minh bạch và công bằng trong quá trình chọn người chiến thắng.'
    },
    {
      question: 'Làm thế nào để tham gia xổ số?',
      answer: 'Để tham gia xổ số, bạn cần có ví MetaMask đã được cài đặt. Sau đó, kết nối ví của bạn với ứng dụng, nhập số lượng ETH bạn muốn tham gia (tối thiểu 0.01 ETH) và xác nhận giao dịch.'
    },
    {
      question: 'Làm thế nào để biết tôi đã thắng?',
      answer: 'Khi quản trị viên chọn người thắng cuộc, kết quả sẽ được hiển thị trên trang chủ và số tiền thưởng sẽ được chuyển tự động vào ví của người thắng cuộc. Bạn cũng có thể kiểm tra lịch sử giao dịch trong phần "Lịch sử".'
    },
    {
      question: 'Tỷ lệ thắng được tính như thế nào?',
      answer: 'Tỷ lệ thắng phụ thuộc vào số lượng người tham gia. Mỗi địa chỉ tham gia sẽ được tính là một vé số. Ví dụ, nếu có 10 người tham gia, mỗi người có tỷ lệ thắng là 10%.'
    },
    {
      question: 'Có giới hạn số lần tham gia không?',
      answer: 'Không có giới hạn số lần tham gia. Bạn có thể tham gia nhiều lần với cùng một địa chỉ ví, mỗi lần tham gia sẽ tăng cơ hội thắng của bạn.'
    },
    {
      question: 'Phí gas là gì và tôi phải trả bao nhiêu?',
      answer: 'Phí gas là khoản phí bạn phải trả cho mạng Ethereum để xử lý giao dịch của bạn. Phí này phụ thuộc vào tình trạng tắc nghẽn của mạng Ethereum và không liên quan đến ứng dụng xổ số của chúng tôi. Bạn có thể điều chỉnh phí gas trong ví MetaMask của mình.'
    },
    {
      question: 'Làm thế nào để đảm bảo tính công bằng của xổ số?',
      answer: 'Tính công bằng được đảm bảo bởi hợp đồng thông minh (Smart Contract) trên blockchain Ethereum. Quá trình chọn người thắng cuộc hoàn toàn ngẫu nhiên và minh bạch, mã nguồn có thể được kiểm tra bởi bất kỳ ai.'
    },
    {
      question: 'Tôi có thể rút lại tiền đã tham gia không?',
      answer: 'Không, sau khi bạn đã tham gia xổ số, bạn không thể rút lại tiền. Tiền của bạn sẽ nằm trong hợp đồng cho đến khi có người thắng cuộc được chọn.'
    }
  ];

  // Hàm để toggle câu hỏi
  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-section">
      <div className="faq-container">
        <h2 className="faq-title">Câu Hỏi Thường Gặp</h2>
        
        <div className="faq-list">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <div 
                className="faq-question"
                onClick={() => toggleQuestion(index)}
              >
                <h3>{item.question}</h3>
                <span className="faq-toggle">
                  {activeIndex === index ? '−' : '+'}
                </span>
              </div>
              
              <div className={`faq-answer ${activeIndex === index ? 'show' : ''}`}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
