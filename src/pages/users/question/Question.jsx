// // // // // import React, { useState, useEffect } from 'react';
// // // // // import axios from 'axios';
// // // // // import './Question.css';
// // // // // import api from '../../../config/api';
// // // // // import { jwtDecode } from 'jwt-decode';
// // // // // import { Modal } from 'antd'; // Import Modal từ antd

// // // // // export default function Question() {
// // // // //     const [questions, setQuestions] = useState([]);
// // // // //     const [answers, setAnswers] = useState({});
// // // // //     const [result, setResult] = useState("");
// // // // //     const [loading, setLoading] = useState(true);
// // // // //     const [error, setError] = useState(null);
// // // // //     const [isPopupOpen, setIsPopupOpen] = useState(false); // State để điều khiển pop-up
// // // // //     const [skinTypeInfo, setSkinTypeInfo] = useState(null); // State để lưu thông tin loại da
// // // // //     const [totalMark, setTotalMark] = useState(0); // State để lưu tổng điểm
// // // // //     const [answeredCount, setAnsweredCount] = useState(0); // State để lưu số câu hỏi đã trả lời

// // // // //     // Hàm loại bỏ các thẻ HTML
// // // // //     const removeHtmlTags = (html) => {
// // // // //         if (!html) return '';
// // // // //         return html.replace(/<\/?[^>]+(>|$)/g, "");
// // // // //     };

// // // // //     // Hàm giải mã HTML entities
// // // // //     const decodeHtmlEntities = (html) => {
// // // // //         const textArea = document.createElement('textarea');
// // // // //         textArea.innerHTML = html;
// // // // //         return textArea.value;
// // // // //     };

// // // // //     // Fetch danh sách câu hỏi khi component được mount
// // // // //     useEffect(() => {
// // // // //         const fetchQuestions = async () => {
// // // // //             try {
// // // // //                 const response = await api.get('/skin-tests/questions-answers/1');
// // // // //                 const sortedQuestions = response.data.questions.sort((a, b) => a.order - b.order);
// // // // //                 setQuestions(sortedQuestions);
// // // // //                 setLoading(false);
// // // // //             } catch (err) {
// // // // //                 setError(err.message);
// // // // //                 setLoading(false);
// // // // //             }
// // // // //         };

// // // // //         fetchQuestions();
// // // // //     }, []);

// // // // //     // Hàm xử lý khi người dùng chọn đáp án
// // // // //     const handleChange = (questionId, answerId, mark) => {
// // // // //         // Kiểm tra xem câu hỏi này đã được trả lời chưa
// // // // //         const isNewAnswer = !answers[questionId];

// // // // //         // Cập nhật answers
// // // // //         setAnswers({
// // // // //             ...answers,
// // // // //             [questionId]: {
// // // // //                 answerId: answerId,
// // // // //                 mark: mark
// // // // //             }
// // // // //         });

// // // // //         // Nếu là câu trả lời mới, tăng answeredCount
// // // // //         if (isNewAnswer) {
// // // // //             setAnsweredCount(prevCount => prevCount + 1);
// // // // //         }
// // // // //     };

// // // // //     // Hàm xử lý khi người dùng nhấn nút "Gửi bài"
// // // // //     const handleSubmit = async () => {
// // // // //         const token = localStorage.getItem('token'); // Lấy token từ localStorage

// // // // //         if (!token) {
// // // // //             console.log("Không tìm thấy token.");
// // // // //             return;
// // // // //         }

// // // // //         try {
// // // // //             const decodedToken = jwtDecode(token); // Giải mã token
// // // // //             const userEmail = decodedToken.sub; // Lấy email từ trường "sub"

// // // // //             // Chuẩn bị dữ liệu để gửi lên server
// // // // //             const answerList = Object.entries(answers).map(([questionId, answer]) => ({
// // // // //                 questionId: questionId,
// // // // //                 answerId: answer.answerId
// // // // //             }));

// // // // //             const submitData = {
// // // // //                 email: userEmail, // Sử dụng email thay vì userId
// // // // //                 answers: answerList // Sử dụng answers thay vì answerList
// // // // //             };

// // // // //             // Gọi API submitTest
// // // // //             const response = await api.post('/skin-tests/1/submitTest', submitData);

// // // // //             // Xử lý response từ server
// // // // //             if (response.data) {
// // // // //                 setResult(`Kết quả của bạn: ${response.data.resultContent || 'Đã nhận được kết quả'}`);
// // // // //                 setTotalMark(response.data.totalMark); // Lưu tổng điểm

// // // // //                 // Lấy thông tin loại da từ API
// // // // //                 const skinTypeResponse = await api.get(`/skin-types/${response.data.skinTypeId}`);
// // // // //                 setSkinTypeInfo(skinTypeResponse.data); // Lưu thông tin loại da
// // // // //                 setIsPopupOpen(true); // Mở pop-up
// // // // //             } else {
// // // // //                 setResult("Không thể gửi bài kiểm tra. Vui lòng thử lại.");
// // // // //             }
// // // // //         } catch (err) {
// // // // //             // Xử lý lỗi nếu có
// // // // //             setResult("Không thể gửi bài kiểm tra. Vui lòng thử lại.");
// // // // //             console.error("Lỗi khi gửi bài kiểm tra:", err);
// // // // //         }
// // // // //     };

// // // // //     // Hàm đóng pop-up
// // // // //     const closePopup = () => {
// // // // //         setIsPopupOpen(false);
// // // // //     };

// // // // //     // Hàm tạo liên kết dựa trên loại da
// // // // //     const getSkinCareLink = (skinName) => {
// // // // //         switch (skinName) {
// // // // //             case 'Khô':
// // // // //                 return 'http://localhost:5173/listskincare/Kho';
// // // // //             case 'Thường':
// // // // //                 return 'http://localhost:5173/listskincare/Thuong';
// // // // //             case 'Nhạy cảm':
// // // // //                 return 'http://localhost:5173/listskincare/Nhaycam';
// // // // //             case 'Hỗn hợp':
// // // // //                 return 'http://localhost:5173/listskincare/Honhop';
// // // // //             case 'Dầu':
// // // // //                 return 'http://localhost:5173/listskincare/Dau';
// // // // //             default:
// // // // //                 return '#';
// // // // //         }
// // // // //     };

// // // // //     // Tính toán tiến độ làm bài
// // // // //     const progress = (answeredCount / questions.length) * 100;

// // // // //     // Hiển thị loading nếu đang tải dữ liệu
// // // // //     if (loading) {
// // // // //         return <div className="loading-container">Đang tải bài kiểm tra...</div>;
// // // // //     }

// // // // //     // Hiển thị lỗi nếu có
// // // // //     if (error) {
// // // // //         return <div className="error-container">Lỗi: {error}</div>;
// // // // //     }

// // // // //     return (
// // // // //         <div className="container haven-skin-question">
// // // // //             <h1 className="test-title">Bài kiểm tra loại da</h1>

// // // // //             {/* Hiển thị số câu hỏi đã trả lời và tổng số câu hỏi */}
// // // // //             <div className="progress-info">
// // // // //                 {answeredCount}/{questions.length} câu
// // // // //             </div>

// // // // //             {/* Progress Bar */}
// // // // //             <div className="progress-bar-container">
// // // // //                 <div
// // // // //                     className="progress-bar"
// // // // //                     style={{ width: `${progress}%` }}
// // // // //                 ></div>
// // // // //             </div>

// // // // //             {/* Hiển thị danh sách câu hỏi */}
// // // // //             {questions.map((question, index) => {
// // // // //                 const answerLabels = ['A', 'B', 'C', 'D', 'E']; // Nhãn cho các đáp án
// // // // //                 return (
// // // // //                     <div key={question.questionId} className="question-container">
// // // // //                         <h2 className="question-title">Q{index + 1}: {decodeHtmlEntities(removeHtmlTags(question.questionContent))}</h2>
// // // // //                         <ul className="options-list">
// // // // //                             {question.answers.map((answer, ansIndex) => (
// // // // //                                 <li key={answer.answerId}>
// // // // //                                     <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: "100%" }}>
// // // // //                                         <input
// // // // //                                             type="radio"
// // // // //                                             name={`q${question.questionId}`}
// // // // //                                             value={answer.answerId}
// // // // //                                             onChange={() => handleChange(question.questionId, answer.answerId, answer.mark)}
// // // // //                                         />
// // // // //                                         <span className="answer-label"> <strong>{answerLabels[ansIndex]}.</strong> </span>
// // // // //                                         <span className="answer-content">
// // // // //                                             {decodeHtmlEntities(removeHtmlTags(answer.answerContent))}
// // // // //                                         </span>
// // // // //                                         <span className="points">({answer.mark} điểm)</span>
// // // // //                                     </label>
// // // // //                                 </li>
// // // // //                             ))}
// // // // //                         </ul>
// // // // //                     </div>
// // // // //                 );
// // // // //             })}

// // // // //             {/* Nút "Gửi bài" */}
// // // // //             <button className="submit-btn" onClick={handleSubmit}>Gửi bài</button>

// // // // //             {/* Hiển thị kết quả */}
// // // // //             {result && <div className="result-message">{result}</div>}

// // // // //             {/* Modal hiển thị thông tin loại da */}
// // // // //             <Modal
// // // // //                 title={<p style={{backgroundColor: "#900001", color: "white", padding: 5, width: "95%", fontSize: "lagne"}}>Kết quả bài kiểm tra loại da</p>}
// // // // //                 visible={isPopupOpen}
// // // // //                 onOk={closePopup}
// // // // //                 onCancel={closePopup}
// // // // //                 footer={[
// // // // //                     <button key="close" onClick={closePopup} style={{padding: 5, borderRadius: 5, color: "white", backgroundColor: "red", border: "2px solid red"}}>
// // // // //                         Đóng
// // // // //                     </button>
// // // // //                 ]}
// // // // //             >
// // // // //                 {skinTypeInfo && (
// // // // //                     <>
// // // // //                         <p><strong>Loại da của bạn:</strong> Da {skinTypeInfo.skinName}</p>
// // // // //                         <p><strong>Mô tả:</strong> {decodeHtmlEntities(removeHtmlTags(skinTypeInfo.description))}</p>
// // // // //                         <p><strong>Điểm số:</strong> {totalMark}</p>
// // // // //                         {skinTypeInfo.skinTypeImages && skinTypeInfo.skinTypeImages.length > 0 && (
// // // // //                             <img
// // // // //                                 src={skinTypeInfo.skinTypeImages[0].imageURL}
// // // // //                                 alt="Hình ảnh loại da"
// // // // //                                 style={{ width: '100%', maxWidth: '300px', marginTop: '10px' }}
// // // // //                             />
// // // // //                         )}
// // // // //                         {/* Nút "Bấm vào đây để xem lộ trình chăm sóc da" */}
// // // // //                         <a
// // // // //                             href={getSkinCareLink(skinTypeInfo.skinName)}
// // // // //                             target="_blank"
// // // // //                             rel="noopener noreferrer"
// // // // //                             style={{ display: 'block', marginTop: '20px', textAlign: 'center' }}
// // // // //                         >
// // // // //                             <button type="primary" style={{padding: 5, borderRadius: 5, color: "black", backgroundColor: "yellow", border: "2px solid yellow"}}>
// // // // //                                 Bấm vào đây để xem lộ trình chăm sóc da {skinTypeInfo.skinName}
// // // // //                             </button>
// // // // //                         </a>
// // // // //                     </>
// // // // //                 )}
// // // // //             </Modal>
// // // // //         </div>
// // // // //     );
// // // // // }
// // // // import React, { useState, useEffect } from 'react';
// // // // import axios from 'axios';
// // // // import './Question.css';
// // // // import api from '../../../config/api';
// // // // import { jwtDecode } from 'jwt-decode';
// // // // import { Modal } from 'antd';
// // // // import { LeftOutlined, RightOutlined } from '@ant-design/icons';

// // // // export default function Question() {
// // // //     const [questions, setQuestions] = useState([]);
// // // //     const [answers, setAnswers] = useState({});
// // // //     const [result, setResult] = useState("");
// // // //     const [loading, setLoading] = useState(true);
// // // //     const [error, setError] = useState(null);
// // // //     const [isPopupOpen, setIsPopupOpen] = useState(false);
// // // //     const [skinTypeInfo, setSkinTypeInfo] = useState(null);
// // // //     const [totalMark, setTotalMark] = useState(0);
// // // //     const [answeredCount, setAnsweredCount] = useState(0);
// // // //     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

// // // //     // Remove HTML tags
// // // //     const removeHtmlTags = (html) => {
// // // //         if (!html) return '';
// // // //         return html.replace(/<\/?[^>]+(>|$)/g, "");
// // // //     };

// // // //     // Decode HTML entities
// // // //     const decodeHtmlEntities = (html) => {
// // // //         const textArea = document.createElement('textarea');
// // // //         textArea.innerHTML = html;
// // // //         return textArea.value;
// // // //     };

// // // //     // Fetch questions
// // // //     useEffect(() => {
// // // //         const fetchQuestions = async () => {
// // // //             try {
// // // //                 const response = await api.get('/skin-tests/questions-answers/1');
// // // //                 const sortedQuestions = response.data.questions.sort((a, b) => a.order - b.order);
// // // //                 setQuestions(sortedQuestions);
// // // //                 setLoading(false);
// // // //             } catch (err) {
// // // //                 setError(err.message);
// // // //                 setLoading(false);
// // // //             }
// // // //         };

// // // //         fetchQuestions();
// // // //     }, []);

// // // //     // Handle answer selection
// // // //     const handleChange = (questionId, answerId, mark) => {
// // // //         const isNewAnswer = !answers[questionId];

// // // //         setAnswers({
// // // //             ...answers,
// // // //             [questionId]: {
// // // //                 answerId: answerId,
// // // //                 mark: mark
// // // //             }
// // // //         });

// // // //         if (isNewAnswer) {
// // // //             setAnsweredCount(prevCount => prevCount + 1);
// // // //         }

// // // //         // Auto advance to next question if not last question
// // // //         if (currentQuestionIndex < questions.length - 1) {
// // // //             setTimeout(() => {
// // // //                 goToNextQuestion();
// // // //             }, 300);
// // // //         }
// // // //     };

// // // //     // Submit test
// // // //     const handleSubmit = async () => {
// // // //         const token = localStorage.getItem('token');

// // // //         if (!token) {
// // // //             console.log("Không tìm thấy token.");
// // // //             return;
// // // //         }

// // // //         try {
// // // //             const decodedToken = jwtDecode(token);
// // // //             const userEmail = decodedToken.sub;

// // // //             const answerList = Object.entries(answers).map(([questionId, answer]) => ({
// // // //                 questionId: questionId,
// // // //                 answerId: answer.answerId
// // // //             }));

// // // //             const submitData = {
// // // //                 email: userEmail,
// // // //                 answers: answerList
// // // //             };

// // // //             const response = await api.post('/skin-tests/1/submitTest', submitData);

// // // //             if (response.data) {
// // // //                 setResult(`Kết quả của bạn: ${response.data.resultContent || 'Đã nhận được kết quả'}`);
// // // //                 setTotalMark(response.data.totalMark);

// // // //                 const skinTypeResponse = await api.get(`/skin-types/${response.data.skinTypeId}`);
// // // //                 setSkinTypeInfo(skinTypeResponse.data);
// // // //                 setIsPopupOpen(true);
// // // //             } else {
// // // //                 setResult("Không thể gửi bài kiểm tra. Vui lòng thử lại.");
// // // //             }
// // // //         } catch (err) {
// // // //             setResult("Không thể gửi bài kiểm tra. Vui lòng thử lại.");
// // // //             console.error("Lỗi khi gửi bài kiểm tra:", err);
// // // //         }
// // // //     };

// // // //     const closePopup = () => {
// // // //         setIsPopupOpen(false);
// // // //     };

// // // //     const getSkinCareLink = (skinName) => {
// // // //         switch (skinName) {
// // // //             case 'Khô':
// // // //                 return 'http://localhost:5173/listskincare/Kho';
// // // //             case 'Thường':
// // // //                 return 'http://localhost:5173/listskincare/Thuong';
// // // //             case 'Nhạy cảm':
// // // //                 return 'http://localhost:5173/listskincare/Nhaycam';
// // // //             case 'Hỗn hợp':
// // // //                 return 'http://localhost:5173/listskincare/Honhop';
// // // //             case 'Dầu':
// // // //                 return 'http://localhost:5173/listskincare/Dau';
// // // //             default:
// // // //                 return '#';
// // // //         }
// // // //     };

// // // //     // Navigation functions
// // // //     const goToNextQuestion = () => {
// // // //         if (currentQuestionIndex < questions.length - 1) {
// // // //             setCurrentQuestionIndex(currentQuestionIndex + 1);
// // // //         }
// // // //     };

// // // //     const goToPrevQuestion = () => {
// // // //         if (currentQuestionIndex > 0) {
// // // //             setCurrentQuestionIndex(currentQuestionIndex - 1);
// // // //         }
// // // //     };

// // // //     const progress = (answeredCount / questions.length) * 100;

// // // //     if (loading) {
// // // //         return <div className="loading-container">Đang tải bài kiểm tra...</div>;
// // // //     }

// // // //     if (error) {
// // // //         return <div className="error-container">Lỗi: {error}</div>;
// // // //     }

// // // //     return (
// // // //         <div className="flashcard-container">
// // // //             <h1 className="test-title">Bài kiểm tra loại da</h1>

// // // //             {/* Progress info */}
// // // //             <div className="progress-info">
// // // //                 {answeredCount}/{questions.length} câu
// // // //             </div>

// // // //             {/* Progress Bar */}
// // // //             <div className="progress-bar-container">
// // // //                 <div
// // // //                     className="progress-bar"
// // // //                     style={{ width: `${progress}%` }}
// // // //                 ></div>
// // // //             </div>

// // // //             {/* Flashcard area - shows only current question */}
// // // //             {questions.length > 0 && (
// // // //                 <div className="flashcard">
// // // //                     <div className="question-card">
// // // //                         <h2 className="question-title">Q{currentQuestionIndex + 1}: {decodeHtmlEntities(removeHtmlTags(questions[currentQuestionIndex].questionContent))}</h2>
// // // //                         <ul className="options-list">
// // // //                             {questions[currentQuestionIndex].answers.map((answer, ansIndex) => {
// // // //                                 const answerLabels = ['A', 'B', 'C', 'D', 'E'];
// // // //                                 return (
// // // //                                     <li key={answer.answerId}>
// // // //                                         <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: "100%" }}>
// // // //                                             <input
// // // //                                                 type="radio"
// // // //                                                 name={`q${questions[currentQuestionIndex].questionId}`}
// // // //                                                 value={answer.answerId}
// // // //                                                 checked={answers[questions[currentQuestionIndex].questionId]?.answerId === answer.answerId}
// // // //                                                 onChange={() => handleChange(
// // // //                                                     questions[currentQuestionIndex].questionId, 
// // // //                                                     answer.answerId, 
// // // //                                                     answer.mark
// // // //                                                 )}
// // // //                                             />
// // // //                                             <span className="answer-label"> <strong>{answerLabels[ansIndex]}.</strong> </span>
// // // //                                             <span className="answer-content">
// // // //                                                 {decodeHtmlEntities(removeHtmlTags(answer.answerContent))}
// // // //                                             </span>
// // // //                                             <span className="points">({answer.mark} điểm)</span>
// // // //                                         </label>
// // // //                                     </li>
// // // //                                 );
// // // //                             })}
// // // //                         </ul>
// // // //                     </div>

// // // //                     {/* Navigation controls */}
// // // //                     <div className="flashcard-navigation">
// // // //                         <button 
// // // //                             onClick={goToPrevQuestion} 
// // // //                             disabled={currentQuestionIndex === 0}
// // // //                             className="nav-button prev-button"
// // // //                         >
// // // //                             <LeftOutlined /> Câu trước
// // // //                         </button>
// // // //                         <span className="current-question">
// // // //                             Câu {currentQuestionIndex + 1}/{questions.length}
// // // //                         </span>
// // // //                         <button 
// // // //                             onClick={goToNextQuestion} 
// // // //                             disabled={currentQuestionIndex === questions.length - 1}
// // // //                             className="nav-button next-button"
// // // //                         >
// // // //                             Câu sau <RightOutlined />
// // // //                         </button>
// // // //                     </div>
// // // //                 </div>
// // // //             )}

// // // //             {/* Submit button */}
// // // //             <div className="submit-container">
// // // //                 <button className="submit-btn" onClick={handleSubmit}>Gửi bài</button>
// // // //             </div>

// // // //             {/* Result message */}
// // // //             {result && <div className="result-message">{result}</div>}

// // // //             {/* Result modal */}
// // // //             <Modal
// // // //                 title={<p style={{backgroundColor: "#900001", color: "white", padding: 5, width: "95%", fontSize: "large"}}>Kết quả bài kiểm tra loại da</p>}
// // // //                 visible={isPopupOpen}
// // // //                 onOk={closePopup}
// // // //                 onCancel={closePopup}
// // // //                 footer={[
// // // //                     <button key="close" onClick={closePopup} style={{padding: 5, borderRadius: 5, color: "white", backgroundColor: "red", border: "2px solid red"}}>
// // // //                         Đóng
// // // //                     </button>
// // // //                 ]}
// // // //             >
// // // //                 {skinTypeInfo && (
// // // //                     <>
// // // //                         <p><strong>Loại da của bạn:</strong> Da {skinTypeInfo.skinName}</p>
// // // //                         <p><strong>Mô tả:</strong> {decodeHtmlEntities(removeHtmlTags(skinTypeInfo.description))}</p>
// // // //                         <p><strong>Điểm số:</strong> {totalMark}</p>
// // // //                         {skinTypeInfo.skinTypeImages && skinTypeInfo.skinTypeImages.length > 0 && (
// // // //                             <img
// // // //                                 src={skinTypeInfo.skinTypeImages[0].imageURL}
// // // //                                 alt="Hình ảnh loại da"
// // // //                                 style={{ width: '100%', maxWidth: '300px', marginTop: '10px' }}
// // // //                             />
// // // //                         )}
// // // //                         <a
// // // //                             href={getSkinCareLink(skinTypeInfo.skinName)}
// // // //                             target="_blank"
// // // //                             rel="noopener noreferrer"
// // // //                             style={{ display: 'block', marginTop: '20px', textAlign: 'center' }}
// // // //                         >
// // // //                             <button type="primary" style={{padding: 5, borderRadius: 5, color: "black", backgroundColor: "yellow", border: "2px solid yellow"}}>
// // // //                                 Bấm vào đây để xem lộ trình chăm sóc da {skinTypeInfo.skinName}
// // // //                             </button>
// // // //                         </a>
// // // //                     </>
// // // //                 )}
// // // //             </Modal>
// // // //         </div>
// // // //     );
// // // // }

// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';
// // // import './Question.css';
// // // import api from '../../../config/api';
// // // import { jwtDecode } from 'jwt-decode';
// // // import { Modal } from 'antd';
// // // import { LeftOutlined, RightOutlined } from '@ant-design/icons';

// // // export default function Question() {
// // //     const [questions, setQuestions] = useState([]);
// // //     const [answers, setAnswers] = useState({});
// // //     const [result, setResult] = useState("");
// // //     const [loading, setLoading] = useState(true);
// // //     const [error, setError] = useState(null);
// // //     const [isPopupOpen, setIsPopupOpen] = useState(false);
// // //     const [skinTypeInfo, setSkinTypeInfo] = useState(null);
// // //     const [totalMark, setTotalMark] = useState(0);
// // //     const [answeredCount, setAnsweredCount] = useState(0);
// // //     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

// // //     // Remove HTML tags
// // //     const removeHtmlTags = (html) => {
// // //         if (!html) return '';
// // //         return html.replace(/<\/?[^>]+(>|$)/g, "");
// // //     };

// // //     // Decode HTML entities
// // //     const decodeHtmlEntities = (html) => {
// // //         const textArea = document.createElement('textarea');
// // //         textArea.innerHTML = html;
// // //         return textArea.value;
// // //     };

// // //     // Fetch questions
// // //     useEffect(() => {
// // //         const fetchQuestions = async () => {
// // //             try {
// // //                 const response = await api.get('/skin-tests/questions-answers/1');
// // //                 const sortedQuestions = response.data.questions.sort((a, b) => a.order - b.order);
// // //                 setQuestions(sortedQuestions);
// // //                 setLoading(false);
// // //             } catch (err) {
// // //                 setError(err.message);
// // //                 setLoading(false);
// // //             }
// // //         };

// // //         fetchQuestions();
// // //     }, []);

// // //     // Handle answer selection with auto-advance
// // //     const handleChange = (questionId, answerId, mark) => {
// // //         const isNewAnswer = !answers[questionId];

// // //         setAnswers({
// // //             ...answers,
// // //             [questionId]: {
// // //                 answerId: answerId,
// // //                 mark: mark
// // //             }
// // //         });

// // //         if (isNewAnswer) {
// // //             setAnsweredCount(prevCount => prevCount + 1);
// // //         }

// // //         // Auto advance to next question after a short delay
// // //         setTimeout(() => {
// // //             if (currentQuestionIndex < questions.length - 1) {
// // //                 setCurrentQuestionIndex(currentQuestionIndex + 1);
// // //             }
// // //         }, 300); // 300ms delay for smooth transition
// // //     };

// // //     // Submit test
// // //     const handleSubmit = async () => {
// // //         const token = localStorage.getItem('token');

// // //         if (!token) {
// // //             console.log("Không tìm thấy token.");
// // //             return;
// // //         }

// // //         try {
// // //             const decodedToken = jwtDecode(token);
// // //             const userEmail = decodedToken.sub;

// // //             const answerList = Object.entries(answers).map(([questionId, answer]) => ({
// // //                 questionId: questionId,
// // //                 answerId: answer.answerId
// // //             }));

// // //             const submitData = {
// // //                 email: userEmail,
// // //                 answers: answerList
// // //             };

// // //             const response = await api.post('/skin-tests/1/submitTest', submitData);

// // //             if (response.data) {
// // //                 setResult(`Kết quả của bạn: ${response.data.resultContent || 'Đã nhận được kết quả'}`);
// // //                 setTotalMark(response.data.totalMark);

// // //                 const skinTypeResponse = await api.get(`/skin-types/${response.data.skinTypeId}`);
// // //                 setSkinTypeInfo(skinTypeResponse.data);
// // //                 setIsPopupOpen(true);
// // //             } else {
// // //                 setResult("Không thể gửi bài kiểm tra. Vui lòng thử lại.");
// // //             }
// // //         } catch (err) {
// // //             setResult("Không thể gửi bài kiểm tra. Vui lòng thử lại.");
// // //             console.error("Lỗi khi gửi bài kiểm tra:", err);
// // //         }
// // //     };

// // //     const closePopup = () => {
// // //         setIsPopupOpen(false);
// // //     };

// // //     const getSkinCareLink = (skinName) => {
// // //         switch (skinName) {
// // //             case 'Khô':
// // //                 return 'http://localhost:5173/listskincare/Kho';
// // //             case 'Thường':
// // //                 return 'http://localhost:5173/listskincare/Thuong';
// // //             case 'Nhạy cảm':
// // //                 return 'http://localhost:5173/listskincare/Nhaycam';
// // //             case 'Hỗn hợp':
// // //                 return 'http://localhost:5173/listskincare/Honhop';
// // //             case 'Dầu':
// // //                 return 'http://localhost:5173/listskincare/Dau';
// // //             default:
// // //                 return '#';
// // //         }
// // //     };

// // //     // Navigation functions
// // //     const goToNextQuestion = () => {
// // //         if (currentQuestionIndex < questions.length - 1) {
// // //             setCurrentQuestionIndex(currentQuestionIndex + 1);
// // //         }
// // //     };

// // //     const goToPrevQuestion = () => {
// // //         if (currentQuestionIndex > 0) {
// // //             setCurrentQuestionIndex(currentQuestionIndex - 1);
// // //         }
// // //     };

// // //     const progress = (answeredCount / questions.length) * 100;

// // //     if (loading) {
// // //         return <div className="loading-container">Đang tải bài kiểm tra...</div>;
// // //     }

// // //     if (error) {
// // //         return <div className="error-container">Lỗi: {error}</div>;
// // //     }

// // //     return (
// // //         <div className="flashcard-container">
// // //             <h1 className="test-title">Bài kiểm tra loại da</h1>

// // //             {/* Progress info */}
// // //             <div className="progress-info">
// // //                 {answeredCount}/{questions.length} câu
// // //             </div>

// // //             {/* Progress Bar */}
// // //             <div className="progress-bar-container">
// // //                 <div
// // //                     className="progress-bar"
// // //                     style={{ width: `${progress}%` }}
// // //                 ></div>
// // //             </div>

// // //             {/* Flashcard area - shows only current question */}
// // //             {questions.length > 0 && (
// // //                 <div className="flashcard">
// // //                     <div className="question-card">
// // //                         <h2 className="question-title">Q{currentQuestionIndex + 1}: {decodeHtmlEntities(removeHtmlTags(questions[currentQuestionIndex].questionContent))}</h2>
// // //                         <ul className="options-list">
// // //                             {questions[currentQuestionIndex].answers.map((answer, ansIndex) => {
// // //                                 const answerLabels = ['A', 'B', 'C', 'D', 'E'];
// // //                                 return (
// // //                                     <li key={answer.answerId}>
// // //                                         <label className="answer-label-container">
// // //                                             <input
// // //                                                 type="radio"
// // //                                                 name={`q${questions[currentQuestionIndex].questionId}`}
// // //                                                 value={answer.answerId}
// // //                                                 checked={answers[questions[currentQuestionIndex].questionId]?.answerId === answer.answerId}
// // //                                                 onChange={() => handleChange(
// // //                                                     questions[currentQuestionIndex].questionId, 
// // //                                                     answer.answerId, 
// // //                                                     answer.mark
// // //                                                 )}
// // //                                             />
// // //                                             <span className="answer-label"> <strong>{answerLabels[ansIndex]}.</strong> </span>
// // //                                             <span className="answer-content">
// // //                                                 {decodeHtmlEntities(removeHtmlTags(answer.answerContent))}
// // //                                             </span>
// // //                                             <span className="points">({answer.mark} điểm)</span>
// // //                                         </label>
// // //                                     </li>
// // //                                 );
// // //                             })}
// // //                         </ul>
// // //                     </div>

// // //                     {/* Navigation controls */}
// // //                     <div className="flashcard-navigation">
// // //                         <button 
// // //                             onClick={goToPrevQuestion} 
// // //                             disabled={currentQuestionIndex === 0}
// // //                             className="nav-button prev-button"
// // //                         >
// // //                             <LeftOutlined /> Câu trước
// // //                         </button>
// // //                         <span className="current-question">
// // //                             Câu {currentQuestionIndex + 1}/{questions.length}
// // //                         </span>
// // //                         <button 
// // //                             onClick={goToNextQuestion} 
// // //                             disabled={currentQuestionIndex === questions.length - 1}
// // //                             className="nav-button next-button"
// // //                         >
// // //                             Câu sau <RightOutlined />
// // //                         </button>
// // //                     </div>
// // //                 </div>
// // //             )}

// // //             {/* Submit button - only shown on last question */}
// // //             {currentQuestionIndex === questions.length - 1 && (
// // //                 <div className="submit-container">
// // //                     <button className="submit-btn" onClick={handleSubmit}>Gửi bài</button>
// // //                 </div>
// // //             )}

// // //             {/* Result message */}
// // //             {result && <div className="result-message">{result}</div>}

// // //             {/* Result modal */}
// // //             <Modal
// // //                 title={<p style={{backgroundColor: "#900001", color: "white", padding: 5, width: "95%", fontSize: "large"}}>Kết quả bài kiểm tra loại da</p>}
// // //                 visible={isPopupOpen}
// // //                 onOk={closePopup}
// // //                 onCancel={closePopup}
// // //                 footer={[
// // //                     <button key="close" onClick={closePopup} style={{padding: 5, borderRadius: 5, color: "white", backgroundColor: "red", border: "2px solid red"}}>
// // //                         Đóng
// // //                     </button>
// // //                 ]}
// // //             >
// // //                 {skinTypeInfo && (
// // //                     <>
// // //                         <p><strong>Loại da của bạn:</strong> Da {skinTypeInfo.skinName}</p>
// // //                         <p><strong>Mô tả:</strong> {decodeHtmlEntities(removeHtmlTags(skinTypeInfo.description))}</p>
// // //                         <p><strong>Điểm số:</strong> {totalMark}</p>
// // //                         {skinTypeInfo.skinTypeImages && skinTypeInfo.skinTypeImages.length > 0 && (
// // //                             <img
// // //                                 src={skinTypeInfo.skinTypeImages[0].imageURL}
// // //                                 alt="Hình ảnh loại da"
// // //                                 style={{ width: '100%', maxWidth: '300px', marginTop: '10px' }}
// // //                             />
// // //                         )}
// // //                         <a
// // //                             href={getSkinCareLink(skinTypeInfo.skinName)}
// // //                             target="_blank"
// // //                             rel="noopener noreferrer"
// // //                             style={{ display: 'block', marginTop: '20px', textAlign: 'center' }}
// // //                         >
// // //                             <button type="primary" style={{padding: 5, borderRadius: 5, color: "black", backgroundColor: "yellow", border: "2px solid yellow"}}>
// // //                                 Bấm vào đây để xem lộ trình chăm sóc da {skinTypeInfo.skinName}
// // //                             </button>
// // //                         </a>
// // //                     </>
// // //                 )}
// // //             </Modal>
// // //         </div>
// // //     );
// // // }

// // import React, { useState, useEffect } from 'react';
// // import './Question.css';
// // import api from '../../../config/api';
// // import { jwtDecode } from 'jwt-decode';
// // import { Modal } from 'antd';
// // import { LeftOutlined, RightOutlined, SmileOutlined, SkinOutlined, StarFilled, CloseOutlined } from '@ant-design/icons';

// // export default function Question() {
// //     const [questions, setQuestions] = useState([]);
// //     const [answers, setAnswers] = useState({});
// //     const [result, setResult] = useState("");
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);
// //     const [isPopupOpen, setIsPopupOpen] = useState(false);
// //     const [skinTypeInfo, setSkinTypeInfo] = useState(null);
// //     const [totalMark, setTotalMark] = useState(0);
// //     const [answeredCount, setAnsweredCount] = useState(0);
// //     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

// //     // Remove HTML tags
// //     const removeHtmlTags = (html) => {
// //         if (!html) return '';
// //         return html.replace(/<\/?[^>]+(>|$)/g, "");
// //     };

// //     // Decode HTML entities
// //     const decodeHtmlEntities = (html) => {
// //         const textArea = document.createElement('textarea');
// //         textArea.innerHTML = html;
// //         return textArea.value;
// //     };

// //     // Fetch questions
// //     useEffect(() => {
// //         const fetchQuestions = async () => {
// //             try {
// //                 const response = await api.get('/skin-tests/questions-answers/1');
// //                 const sortedQuestions = response.data.questions.sort((a, b) => a.order - b.order);
// //                 setQuestions(sortedQuestions);
// //                 setLoading(false);
// //             } catch (err) {
// //                 setError(err.message);
// //                 setLoading(false);
// //             }
// //         };

// //         fetchQuestions();
// //     }, []);

// //     // Handle answer selection with auto-advance
// //     const handleChange = (questionId, answerId, mark) => {
// //         const isNewAnswer = !answers[questionId];

// //         setAnswers({
// //             ...answers,
// //             [questionId]: {
// //                 answerId: answerId,
// //                 mark: mark
// //             }
// //         });

// //         if (isNewAnswer) {
// //             setAnsweredCount(prevCount => prevCount + 1);
// //         }

// //         // Auto advance to next question after a short delay
// //         setTimeout(() => {
// //             if (currentQuestionIndex < questions.length - 1) {
// //                 setCurrentQuestionIndex(currentQuestionIndex + 1);
// //             }
// //         }, 300);
// //     };

// //     // Submit test
// //     const handleSubmit = async () => {
// //         const token = localStorage.getItem('token');

// //         if (!token) {
// //             console.log("Không tìm thấy token.");
// //             return;
// //         }

// //         try {
// //             const decodedToken = jwtDecode(token);
// //             const userEmail = decodedToken.sub;

// //             const answerList = Object.entries(answers).map(([questionId, answer]) => ({
// //                 questionId: questionId,
// //                 answerId: answer.answerId
// //             }));

// //             const submitData = {
// //                 email: userEmail,
// //                 answers: answerList
// //             };

// //             setLoading(true);
// //             const response = await api.post('/skin-tests/1/submitTest', submitData);

// //             if (response.data) {
// //                 setResult(`Kết quả của bạn: ${response.data.resultContent || 'Đã nhận được kết quả'}`);
// //                 setTotalMark(response.data.totalMark);

// //                 const skinTypeResponse = await api.get(`/skin-types/${response.data.skinTypeId}`);
// //                 setSkinTypeInfo(skinTypeResponse.data);
// //                 setIsPopupOpen(true);
// //             } else {
// //                 setResult("Không thể gửi bài kiểm tra. Vui lòng thử lại.");
// //             }
// //         } catch (err) {
// //             setResult("Không thể gửi bài kiểm tra. Vui lòng thử lại.");
// //             console.error("Lỗi khi gửi bài kiểm tra:", err);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const closePopup = () => {
// //         setIsPopupOpen(false);
// //     };

// //     const getSkinCareLink = (skinName) => {
// //         switch (skinName) {
// //             case 'Khô': return '/listskincare/Kho';
// //             case 'Thường': return '/listskincare/Thuong';
// //             case 'Nhạy cảm': return '/listskincare/Nhaycam';
// //             case 'Hỗn hợp': return '/listskincare/Honhop';
// //             case 'Dầu': return '/listskincare/Dau';
// //             default: return '#';
// //         }
// //     };

// //     // Navigation functions
// //     const goToNextQuestion = () => {
// //         if (currentQuestionIndex < questions.length - 1) {
// //             setCurrentQuestionIndex(currentQuestionIndex + 1);
// //         }
// //     };

// //     const goToPrevQuestion = () => {
// //         if (currentQuestionIndex > 0) {
// //             setCurrentQuestionIndex(currentQuestionIndex - 1);
// //         }
// //     };

// //     const progress = (answeredCount / questions.length) * 100;

// //     // Render result popup
// //     const renderResultPopup = () => {
// //         if (!skinTypeInfo) return null;

// //         const getSkinTypeAssets = () => {
// //             switch(skinTypeInfo.skinName) {
// //                 case 'Khô': 
// //                     return {
// //                         color: '#FFA726',
// //                         gradient: 'linear-gradient(135deg, #FFA726, #FFD54F)',
// //                         icon: '🌵'
// //                     };
// //                 case 'Dầu': 
// //                     return {
// //                         color: '#4CAF50',
// //                         gradient: 'linear-gradient(135deg, #4CAF50, #81C784)',
// //                         icon: '💧'
// //                     };
// //                 case 'Hỗn hợp': 
// //                     return {
// //                         color: '#9C27B0',
// //                         gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
// //                         icon: '🌈'
// //                     };
// //                 case 'Nhạy cảm': 
// //                     return {
// //                         color: '#2196F3',
// //                         gradient: 'linear-gradient(135deg, #2196F3, #64B5F6)',
// //                         icon: '🌸'
// //                     };
// //                 case 'Thường': 
// //                     return {
// //                         color: '#FFC107',
// //                         gradient: 'linear-gradient(135deg, #FFC107, #FFD54F)',
// //                         icon: '🌟'
// //                     };
// //                 default: 
// //                     return {
// //                         color: '#607D8B',
// //                         gradient: 'linear-gradient(135deg, #607D8B, #90A4AE)',
// //                         icon: '✨'
// //                     };
// //             }
// //         };

// //         const assets = getSkinTypeAssets();

// //         return (
// //             <Modal
// //                 title={null}
// //                 visible={isPopupOpen}
// //                 onCancel={closePopup}
// //                 footer={null}
// //                 width={650}
// //                 bodyStyle={{ padding: 0 }}
// //                 closable={false}
// //                 centered
// //             >
// //                 <div className="result-popup">
// //                     <div className="popup-header" style={{ background: assets.gradient }}>
// //                         <button className="close-btn" onClick={closePopup}>
// //                             <CloseOutlined />
// //                         </button>
// //                         <div className="header-content">
// //                             <span className="skin-icon">{assets.icon}</span>
// //                             <h2>Kết Quả Bài Kiểm Tra Da</h2>
// //                             <p>Chúc mừng bạn đã hoàn thành bài kiểm tra!</p>
// //                         </div>
// //                     </div>

// //                     <div className="popup-body">
// //                         <div className="result-summary">
// //                             <div className="skin-type-card">
// //                                 <div className="card-icon">
// //                                     <SkinOutlined style={{ color: assets.color, fontSize: 24 }} />
// //                                 </div>
// //                                 <div className="card-content">
// //                                     <h3>Loại da của bạn</h3>
// //                                     <div className="skin-type" style={{ color: assets.color }}>
// //                                         Da {skinTypeInfo.skinName}
// //                                     </div>
// //                                 </div>
// //                             </div>

// //                             <div className="score-card">
// //                                 <div className="card-icon">
// //                                     <StarFilled style={{ color: assets.color, fontSize: 24 }} />
// //                                 </div>
// //                                 <div className="card-content">
// //                                     <h3>Điểm số</h3>
// //                                     <div className="score" style={{ color: assets.color }}>
// //                                         {totalMark}/100
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         <div className="skin-description">
// //                             <h3>Đặc điểm da {skinTypeInfo.skinName}</h3>
// //                             <p>{decodeHtmlEntities(removeHtmlTags(skinTypeInfo.description))}</p>
// //                         </div>

// //                         {skinTypeInfo.skinTypeImages?.length > 0 && (
// //                             <div className="skin-image-container">
// //                                 <img
// //                                     src={skinTypeInfo.skinTypeImages[0].imageURL}
// //                                     alt={`Da ${skinTypeInfo.skinName}`}
// //                                     className="skin-image"
// //                                 />
// //                             </div>
// //                         )}

// //                         <div className="action-buttons">
// //                             <a
// //                                 href={getSkinCareLink(skinTypeInfo.skinName)}
// //                                 target="_blank"
// //                                 rel="noopener noreferrer"
// //                                 className="care-plan-link"
// //                             >
// //                                 <button 
// //                                     className="care-plan-btn"
// //                                     style={{ 
// //                                         backgroundColor: assets.color,
// //                                         boxShadow: `0 4px 12px ${assets.color}40`
// //                                     }}
// //                                 >
// //                                     Xem lộ trình chăm sóc da
// //                                 </button>
// //                             </a>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </Modal>
// //         );
// //     };

// //     if (loading && !isPopupOpen) {
// //         return (
// //             <div className="loading-container">
// //                 <div className="loading-spinner"></div>
// //                 <p>Đang tải bài kiểm tra...</p>
// //             </div>
// //         );
// //     }

// //     if (error) {
// //         return (
// //             <div className="error-container">
// //                 <div className="error-icon">!</div>
// //                 <h3>Đã xảy ra lỗi</h3>
// //                 <p>{error}</p>
// //                 <button 
// //                     className="retry-btn"
// //                     onClick={() => window.location.reload()}
// //                 >
// //                     Thử lại
// //                 </button>
// //             </div>
// //         );
// //     }

// //     const answerLabels = ['A', 'B', 'C', 'D', 'E'];

// //     return (
// //         <div className="quiz-container">
// //             <div className="quiz-header">
// //                 <h1 className="test-title">Bài kiểm tra loại da</h1>
                
// //                 <div className="progress-container">
// //                     <div className="progress-info">
// //                         {answeredCount}/{questions.length} câu đã trả lời
// //                     </div>
// //                     <div className="progress-bar-container">
// //                         <div
// //                             className="progress-bar"
// //                             style={{ width: `${progress}%` }}
// //                         ></div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {questions.length > 0 && (
// //                 <div className="question-area">
// //                     <div className="question-card">
// //                         <h2 className="question-title">
// //                             Câu {currentQuestionIndex + 1}: {decodeHtmlEntities(removeHtmlTags(questions[currentQuestionIndex].questionContent))}
// //                         </h2>
                        
// //                         <ul className="options-list">
// //                             {questions[currentQuestionIndex].answers.map((answer, ansIndex) => (
// //                                 <li key={answer.answerId}>
// //                                     <label className="option-item">
// //                                         <input
// //                                             type="radio"
// //                                             name={`q${questions[currentQuestionIndex].questionId}`}
// //                                             value={answer.answerId}
// //                                             checked={answers[questions[currentQuestionIndex].questionId]?.answerId === answer.answerId}
// //                                             onChange={() => handleChange(
// //                                                 questions[currentQuestionIndex].questionId, 
// //                                                 answer.answerId, 
// //                                                 answer.mark
// //                                             )}
// //                                         />
// //                                         <span className="option-label">{answerLabels[ansIndex]}.</span>
// //                                         <span className="option-text">
// //                                             {decodeHtmlEntities(removeHtmlTags(answer.answerContent))}
// //                                         </span>
// //                                         <span className="option-point">({answer.mark} điểm)</span>
// //                                     </label>
// //                                 </li>
// //                             ))}
// //                         </ul>
// //                     </div>

// //                     <div className="navigation-controls">
// //                         <button 
// //                             onClick={goToPrevQuestion} 
// //                             disabled={currentQuestionIndex === 0}
// //                             className="nav-btn prev-btn"
// //                         >
// //                             <LeftOutlined /> Câu trước
// //                         </button>
                        
// //                         <span className="question-counter">
// //                             Câu {currentQuestionIndex + 1}/{questions.length}
// //                         </span>
                        
// //                         {currentQuestionIndex === questions.length - 1 ? (
// //                             <button 
// //                                 onClick={handleSubmit}
// //                                 className="submit-btn"
// //                                 disabled={loading}
// //                             >
// //                                 {loading ? 'Đang gửi...' : 'Gửi bài'}
// //                             </button>
// //                         ) : (
// //                             <button 
// //                                 onClick={goToNextQuestion} 
// //                                 disabled={currentQuestionIndex === questions.length - 1}
// //                                 className="nav-btn next-btn"
// //                             >
// //                                 Câu sau <RightOutlined />
// //                             </button>
// //                         )}
// //                     </div>
// //                 </div>
// //             )}

// //             {result && !isPopupOpen && (
// //                 <div className="result-message">{result}</div>
// //             )}

// //             {renderResultPopup()}
// //         </div>
// //     );
// // }

// import React, { useState, useEffect } from 'react';
// import api from '../../../config/api';
// import { jwtDecode } from 'jwt-decode';
// import { Modal } from 'antd';
// import { LeftOutlined, RightOutlined } from '@ant-design/icons';
// import './Question.css';

// export default function Question() {
//     const [questions, setQuestions] = useState([]);
//     const [answers, setAnswers] = useState({});
//     const [result, setResult] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isPopupOpen, setIsPopupOpen] = useState(false);
//     const [skinTypeInfo, setSkinTypeInfo] = useState(null);
//     const [totalMark, setTotalMark] = useState(0);
//     const [answeredCount, setAnsweredCount] = useState(0);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

//     const removeHtmlTags = (html) => {
//         if (!html) return '';
//         return html.replace(/<\/?[^>]+(>|$)/g, "");
//     };

//     const decodeHtmlEntities = (html) => {
//         const textArea = document.createElement('textarea');
//         textArea.innerHTML = html;
//         return textArea.value;
//     };

//     useEffect(() => {
//         const fetchQuestions = async () => {
//             try {
//                 const response = await api.get('/skin-tests/questions-answers/1');
//                 const sortedQuestions = response.data.questions.sort((a, b) => a.order - b.order);
//                 setQuestions(sortedQuestions);
//                 setLoading(false);
//             } catch (err) {
//                 setError(err.message);
//                 setLoading(false);
//             }
//         };

//         fetchQuestions();
//     }, []);

//     const handleChange = (questionId, answerId, mark) => {
//         const isNewAnswer = !answers[questionId];

//         setAnswers({
//             ...answers,
//             [questionId]: {
//                 answerId: answerId,
//                 mark: mark
//             }
//         });

//         if (isNewAnswer) {
//             setAnsweredCount(prevCount => prevCount + 1);
//         }
//     };

//     const handleSubmit = async () => {
//         const token = localStorage.getItem('token');

//         if (!token) {
//             console.log("Token not found.");
//             return;
//         }

//         try {
//             const decodedToken = jwtDecode(token);
//             const userEmail = decodedToken.sub;

//             const answerList = Object.entries(answers).map(([questionId, answer]) => ({
//                 questionId: questionId,
//                 answerId: answer.answerId
//             }));

//             const submitData = {
//                 email: userEmail,
//                 answers: answerList
//             };

//             const response = await api.post('/skin-tests/1/submitTest', submitData);

//             if (response.data) {
//                 setResult(`Your result: ${response.data.resultContent || 'Result received'}`);
//                 setTotalMark(response.data.totalMark);

//                 const skinTypeResponse = await api.get(`/skin-types/${response.data.skinTypeId}`);
//                 setSkinTypeInfo(skinTypeResponse.data);
//                 setIsPopupOpen(true);
//             } else {
//                 setResult("Unable to submit the test. Please try again.");
//             }
//         } catch (err) {
//             setResult("Unable to submit the test. Please try again.");
//             console.error("Error submitting test:", err);
//         }
//     };

//     const closePopup = () => {
//         setIsPopupOpen(false);
//     };

//     const getSkinCareLink = (skinName) => {
//         const links = {
//             'Khô': 'http://localhost:5173/listskincare/Kho',
//             'Thường': 'http://localhost:5173/listskincare/Thuong',
//             'Nhạy cảm': 'http://localhost:5173/listskincare/Nhaycam',
//             'Hỗn hợp': 'http://localhost:5173/listskincare/Honhop',
//             'Dầu': 'http://localhost:5173/listskincare/Dau'
//         };
//         return links[skinName] || '#';
//     };

//     const progress = (answeredCount / questions.length) * 100;

//     if (loading) {
//         return <div className="loading-container">Loading the test...</div>;
//     }

//     if (error) {
//         return <div className="error-container">Error: {error}</div>;
//     }

//     return (
//         <div className="container">
//             <h1 className="test-title">Skin Type Test</h1>

//             <div className="progress-info">
//                 {answeredCount}/{questions.length} questions
//             </div>

//             <div className="progress-bar-container">
//                 <div className="progress-bar" style={{ width: `${progress}%` }}></div>
//             </div>

//             {questions.length > 0 && (
//                 <div className="flashcard">
//                     <div className="question-card">
//                         <h2 className="question-title">
//                             Q{currentQuestionIndex + 1}: {decodeHtmlEntities(removeHtmlTags(questions[currentQuestionIndex].questionContent))}
//                         </h2>
//                         <ul className="options-list">
//                             {questions[currentQuestionIndex].answers.map((answer, ansIndex) => (
//                                 <li key={answer.answerId}>
//                                     <label className="answer-label-container">
//                                         <input
//                                             type="radio"
//                                             name={`q${questions[currentQuestionIndex].questionId}`}
//                                             value={answer.answerId}
//                                             checked={answers[questions[currentQuestionIndex].questionId]?.answerId === answer.answerId}
//                                             onChange={() => handleChange(
//                                                 questions[currentQuestionIndex].questionId, 
//                                                 answer.answerId, 
//                                                 answer.mark
//                                             )}
//                                         />
//                                         <span className="answer-label"><strong>{String.fromCharCode(65 + ansIndex)}.</strong></span>
//                                         <span className="answer-content">
//                                             {decodeHtmlEntities(removeHtmlTags(answer.answerContent))}
//                                         </span>
//                                         <span className="points">({answer.mark} points)</span>
//                                     </label>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     <div className="flashcard-navigation">
//                         <button 
//                             onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} 
//                             disabled={currentQuestionIndex === 0}
//                             className="nav-button prev-button"
//                         >
//                             <LeftOutlined /> Previous Question
//                         </button>
//                         <span className="current-question">
//                             Question {currentQuestionIndex + 1}/{questions.length}
//                         </span>
//                         <button 
//                             onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} 
//                             disabled={currentQuestionIndex === questions.length - 1}
//                             className="nav-button next-button"
//                         >
//                             Next Question <RightOutlined />
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {currentQuestionIndex === questions.length - 1 && (
//                 <div className="submit-container">
//                     <button className="submit-btn" onClick={handleSubmit}>Submit</button>
//                 </div>
//             )}

//             {result && <div className="result-message">{result}</div>}

//             <Modal
//                 title={<p style={{backgroundColor: "#900001", color: "white", padding: 5}}>Skin Type Test Result</p>}
//                 visible={isPopupOpen}
//                 onOk={closePopup}
//                 onCancel={closePopup}
//                 footer={[
//                     <button key="close" onClick={closePopup} style={{padding: 5, borderRadius: 5, color: "white", backgroundColor: "red"}}>
//                         Close
//                     </button>
//                 ]}
//             >
//                 {skinTypeInfo && (
//                     <>
//                         <p><strong>Your skin type:</strong> {skinTypeInfo.skinName}</p>
//                         <p><strong>Description:</strong> {decodeHtmlEntities(removeHtmlTags(skinTypeInfo.description))}</p>
//                         <p><strong>Score:</strong> {totalMark}</p>
//                         {skinTypeInfo.skinTypeImages && skinTypeInfo.skinTypeImages.length > 0 && (
//                             <img
//                                 src={skinTypeInfo.skinTypeImages[0].imageURL}
//                                 alt="Skin type image"
//                                 style={{ width: '100%', maxWidth: '300px', marginTop: '10px' }}
//                             />
//                         )}
//                         <a
//                             href={getSkinCareLink(skinTypeInfo.skinName)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                         >
//                             <button style={{padding: 5, borderRadius: 5, backgroundColor: "yellow"}}>
//                                 Click here for your skin care routine
//                             </button>
//                         </a>
//                     </>
//                 )}
//             </Modal>
//         </div>
//     );
// }

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

  // Utility functions
  const removeHtmlTags = (html) => html?.replace(/<\/?[^>]+(>|$)/g, "") || '';
  const decodeHtmlEntities = (html) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
  };

  // Fetch questions
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

  // Handle answer selection
  const handleAnswerSelect = (questionId, answerId, mark) => {
    const isNewAnswer = !answers[questionId];
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: { answerId, mark }
    }));

    if (isNewAnswer) setAnsweredCount(prev => prev + 1);

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 300);
  };

  // Submit test
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
        const skinTypeResponse = await api.get(`/skin-types/${response.data.skinTypeId}`);
        setSkinTypeInfo(skinTypeResponse.data);
        setIsPopupOpen(true);
      }
    } catch (err) {
      console.error("Error submitting test:", err);
    } finally {
      setLoading(false);
    }
  };

  // Navigation
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

  // Skin type assets
  const getSkinTypeAssets = (skinName) => {
    const assets = {
      'Khô': {
        color: '#FFB6C1',
        gradient: 'linear-gradient(135deg, #FFB6C1, #FFD1DC)',
        icon: '🌸',
        image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
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
        image: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
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
        image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
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
        image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
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
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
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
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
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
    if (!skinTypeInfo) return null;
    
    const assets = getSkinTypeAssets(skinTypeInfo.skinName);
    const skinName = skinTypeInfo.skinName;

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
          {/* Header */}
          <div className="popup-header" style={{ background: assets.gradient }}>
            <button className="close-btn" onClick={() => setIsPopupOpen(false)}>
              <CloseOutlined />
            </button>
            <div className="header-content">
              <div className="skin-icon" style={{ backgroundColor: assets.color }}>
                {assets.icon}
              </div>
              <h2>Kết Quả Chẩn Đoán Da</h2>
              <p>Chúc mừng bạn đã hoàn thành bài kiểm tra!</p>
            </div>
          </div>

          {/* Body */}
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
                <img src={assets.image} alt={`Da ${skinName}`} />
                <div className="image-overlay" style={{ backgroundColor: `${assets.color}20` }} />
              </div>
            </div>

            <div className="skin-details">
              <h3><SkinOutlined /> Đặc điểm da {skinName}</h3>
              <p>{decodeHtmlEntities(removeHtmlTags(skinTypeInfo.description))}</p>

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
                  Xem sản phẩm cho da {skinName}
                </button>
              </a>
              
              <button className="share-btn">
                <ShareAltOutlined /> Chia sẻ kết quả
              </button>
            </div>
          </div>

          {/* Footer */}
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