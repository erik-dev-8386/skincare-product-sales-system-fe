import React, { useState, useEffect } from 'react';
import './Question.css';
import api from '../../../config/api';
import { jwtDecode } from 'jwt-decode';
import { Modal } from 'antd';
import { 
  LeftOutlined, 
  RightOutlined, 
  CloseOutlined, 
  SkinOutlined, 
  SmileOutlined, 
  StarFilled, 
  ShareAltOutlined,
  CheckOutlined
} from '@ant-design/icons';

const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [skinTypeInfo, setSkinTypeInfo] = useState(null);
  const [totalMark, setTotalMark] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);


  const removeHtmlTags = (html) => html?.replace(/<\/?[^>]+(>|$)/g, "") || '';
  const decodeHtmlEntities = (html) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
  };


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get('/skin-tests/questions-answers/1');
        const sortedQuestions = response.data.questions.sort((a, b) => a.order - b.order);
        setQuestions(sortedQuestions);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);


  const handleAnswerSelect = (questionId, answerId, mark) => {
    const isNewAnswer = !answers[questionId];
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: { answerId, mark }
    }));

    if (isNewAnswer) setAnsweredCount(prev => prev + 1);


    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 300);
  };


  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      const answerList = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answerId: answer.answerId
      }));

      setLoading(true);
      const response = await api.post('/skin-tests/1/submitTest', {
        email: decodedToken.sub,
        answers: answerList
      });

      if (response.data) {
        setTotalMark(response.data.totalMark);
        setSkinTypeInfo(response.data); 
        setIsPopupOpen(true);
      }
    } catch (err) {
      console.error("Error submitting test:", err);
    } finally {
      setLoading(false);
    }
  };


  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const getSkinTypeAssets = (skinName) => {
    const assets = {
      'Khô': {
        color: '#FFB6C1',
        gradient: 'linear-gradient(135deg, #FFB6C1, #FFD1DC)',
        icon: '🌸',
        tips: [
          'Sử dụng kem dưỡng ẩm chứa Hyaluronic Acid và Ceramides',
          'Tránh rửa mặt với nước quá nóng',
          'Đắp mặt nạ dưỡng ẩm 2-3 lần/tuần'
        ]
      },
      'Dầu': {
        color: '#98FB98',
        gradient: 'linear-gradient(135deg, #98FB98, #E0F7FA)',
        icon: '💎',
        tips: [
          'Sử dụng sữa rửa mặt dịu nhẹ không chứa dầu',
          'Thoa kem dưỡng ẩm dạng gel không gây bít tắc',
          'Sử dụng giấy thấm dầu khi cần thiết'
        ]
      },
      'Hỗn hợp': {
        color: '#BA55D3',
        gradient: 'linear-gradient(135deg, #BA55D3, #E6E6FA)',
        icon: '✨',
        tips: [
          'Sử dụng sản phẩm phù hợp cho từng vùng da',
          'Tẩy tế bào chết 1-2 lần/tuần',
          'Dưỡng ẩm vùng khô, kiểm soát dầu vùng chữ T'
        ]
      },
      'Nhạy cảm': {
        color: '#ADD8E6',
        gradient: 'linear-gradient(135deg, #ADD8E6, #F0F8FF)',
        icon: '🌷',
        tips: [
          'Chọn sản phẩm không chứa hương liệu và cồn',
          'Thử sản phẩm mới trên vùng da nhỏ trước',
          'Tránh các thành phần gây kích ứng'
        ]
      },
      'Thường': {
        color: '#FFD700',
        gradient: 'linear-gradient(135deg, #FFD700, #FFFACD)',
        icon: '🌟',
        tips: [
          'Duy trì thói quen chăm sóc da cơ bản',
          'Sử dụng kem chống nắng mỗi ngày',
          'Tẩy tế bào chết 1-2 lần/tuần'
        ]
      }
    };

    return assets[skinName] || {
      color: '#D3D3D3',
      gradient: 'linear-gradient(135deg, #D3D3D3, #FFFFFF)',
      icon: '💖',
      tips: []
    };
  };

  const getSkinCareLink = (skinName) => {
    const links = {
      'Khô': '/listskincare/Kho',
      'Thường': '/listskincare/Thuong',
      'Nhạy cảm': '/listskincare/Nhaycam',
      'Hỗn hợp': '/listskincare/Honhop',
      'Dầu': '/listskincare/Dau'
    };
    return links[skinName] || '#';
  };

  // Render functions
  const renderLoading = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Đang tải bài kiểm tra...</p>
    </div>
  );

  const renderError = () => (
    <div className="error-container">
      <div className="error-icon">!</div>
      <h3>Đã xảy ra lỗi</h3>
      <p>{error}</p>
      <button className="retry-btn" onClick={() => window.location.reload()}>
        Thử lại
      </button>
    </div>
  );

  const renderResultPopup = () => {
    if (!skinTypeInfo || !skinTypeInfo.skinType) return null;
    
    const assets = getSkinTypeAssets(skinTypeInfo.skinType.skinName);
    const skinName = skinTypeInfo.skinType.skinName;

    const skinImage = skinTypeInfo.skinType.skinTypeImages?.[0]?.imageURL || 
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';

    return (
      <Modal
        visible={isPopupOpen}
        onCancel={() => setIsPopupOpen(false)}
        footer={null}
        width={700}
        bodyStyle={{ padding: 0 }}
        closable={false}
        centered
        className="result-modal"
      >
        <div className="result-popup">
    
          <div className="popup-header" style={{ background: assets.gradient }}>
            <button className="close-btn" onClick={() => setIsPopupOpen(false)}>
              <CloseOutlined />
            </button>
            <div className="header-content">
              <div className="skin-icon" style={{ backgroundColor: assets.color }}>
                {assets.icon}
              </div>
              <h2>Kết Quả Chẩn Đoán Da</h2>
            </div>
          </div>


          <div className="popup-body">
            <div className="result-summary">
              <div className="result-card">
                <div className="card-decoration" style={{ backgroundColor: assets.color }} />
                <div className="card-content">
                  <h3><SkinOutlined /> Loại da của bạn</h3>
                  <div className="skin-type" style={{ color: assets.color }}>
                    Da {skinName}
                  </div>
                  <div className="skin-score">
                    <StarFilled style={{ color: assets.color }} />
                    <span>Điểm: {totalMark}/100</span>
                  </div>
                </div>
              </div>

              <div className="skin-image-container">
                <img src={skinImage} alt={`Da ${skinName}`} />
                <div className="image-overlay" style={{ backgroundColor: `${assets.color}20` }} />
              </div>
            </div>

            <div className="skin-details">
              <h3><SkinOutlined /> Đặc điểm da {skinName}</h3>
              <p>{decodeHtmlEntities(removeHtmlTags(skinTypeInfo.skinType.description))}</p>

              <div className="beauty-tips">
                <h4><SmileOutlined /> Mẹo chăm sóc</h4>
                <ul>
                  {assets.tips.map((tip, index) => (
                    <li key={index}><CheckOutlined /> {tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="action-buttons">
              <a
                href={getSkinCareLink(skinName)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button 
                  className="primary-btn"
                  style={{ 
                    backgroundColor: assets.color,
                    boxShadow: `0 4px 20px ${assets.color}60`
                  }}
                >
                  Xem lộ trình chăm sóc cho da {skinName}
                </button>
              </a>
            </div>
          </div>

 
          <div className="popup-footer">
            <p>Hãy chăm sóc làn da của bạn mỗi ngày để luôn rạng rỡ!</p>
          </div>
        </div>
      </Modal>
    );
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    const answerLabels = ['A', 'B', 'C', 'D', 'E'];

    return (
      <div className="question-area">
        <div className="question-card">
          <h2 className="question-title">
            Câu {currentQuestionIndex + 1}: {decodeHtmlEntities(removeHtmlTags(question.questionContent))}
          </h2>
          
          <ul className="options-list">
            {question.answers.map((answer, index) => (
              <li key={answer.answerId}>
                <label className="option-item">
                  <input
                    type="radio"
                    name={`q${question.questionId}`}
                    checked={answers[question.questionId]?.answerId === answer.answerId}
                    onChange={() => handleAnswerSelect(question.questionId, answer.answerId, answer.mark)}
                  />
                  <span className="option-label">{answerLabels[index]}.</span>
                  <span className="option-text">
                    {decodeHtmlEntities(removeHtmlTags(answer.answerContent))}
                  </span>
                  <span className="option-point">({answer.mark} điểm)</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="navigation-controls">
          <button 
            onClick={goToPrevQuestion} 
            disabled={currentQuestionIndex === 0}
            className="nav-btn prev-btn"
          >
            <LeftOutlined /> Câu trước
          </button>
          
          <span className="question-counter">
            Câu {currentQuestionIndex + 1}/{questions.length}
          </span>
          
          {currentQuestionIndex === questions.length - 1 ? (
            <button 
              onClick={handleSubmit}
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Gửi bài'}
            </button>
          ) : (
            <button 
              onClick={goToNextQuestion} 
              disabled={currentQuestionIndex === questions.length - 1}
              className="nav-btn next-btn"
            >
              Câu sau <RightOutlined />
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) return renderLoading();
  if (error) return renderError();

  return (
  
    <div className="quiz-container">
      <div className="quiz-header">
        <h1 className="test-title">Bài kiểm tra loại da</h1>
        
        <div className="progress-container">
          <div className="progress-info">
            {answeredCount}/{questions.length} câu đã trả lời
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {questions.length > 0 && renderQuestion()}
      {renderResultPopup()}
    </div>
    
  );
};

export default Question;