import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Question.css';
import api from '../../../config/api';
import { jwtDecode } from 'jwt-decode';
import { Modal } from 'antd'; // Import Modal từ antd

export default function Question() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State để điều khiển pop-up
    const [skinTypeInfo, setSkinTypeInfo] = useState(null); // State để lưu thông tin loại da
    const [totalMark, setTotalMark] = useState(0); // State để lưu tổng điểm
    const [answeredCount, setAnsweredCount] = useState(0); // State để lưu số câu hỏi đã trả lời

    // Hàm loại bỏ các thẻ HTML
    const removeHtmlTags = (html) => {
        if (!html) return '';
        return html.replace(/<\/?[^>]+(>|$)/g, "");
    };

    // Hàm giải mã HTML entities
    const decodeHtmlEntities = (html) => {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = html;
        return textArea.value;
    };

    // Fetch danh sách câu hỏi khi component được mount
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

    // Hàm xử lý khi người dùng chọn đáp án
    const handleChange = (questionId, answerId, mark) => {
        // Kiểm tra xem câu hỏi này đã được trả lời chưa
        const isNewAnswer = !answers[questionId];

        // Cập nhật answers
        setAnswers({
            ...answers,
            [questionId]: {
                answerId: answerId,
                mark: mark
            }
        });

        // Nếu là câu trả lời mới, tăng answeredCount
        if (isNewAnswer) {
            setAnsweredCount(prevCount => prevCount + 1);
        }
    };

    // Hàm xử lý khi người dùng nhấn nút "Gửi bài"
    const handleSubmit = async () => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage

        if (!token) {
            console.log("Không tìm thấy token.");
            return;
        }

        try {
            const decodedToken = jwtDecode(token); // Giải mã token
            const userEmail = decodedToken.sub; // Lấy email từ trường "sub"

            // Chuẩn bị dữ liệu để gửi lên server
            const answerList = Object.entries(answers).map(([questionId, answer]) => ({
                questionId: questionId,
                answerId: answer.answerId
            }));

            const submitData = {
                email: userEmail, // Sử dụng email thay vì userId
                answers: answerList // Sử dụng answers thay vì answerList
            };

            // Gọi API submitTest
            const response = await api.post('/skin-tests/1/submitTest', submitData);

            // Xử lý response từ server
            if (response.data) {
                setResult(`Kết quả của bạn: ${response.data.resultContent || 'Đã nhận được kết quả'}`);
                setTotalMark(response.data.totalMark); // Lưu tổng điểm

                // Lấy thông tin loại da từ API
                const skinTypeResponse = await api.get(`/skin-types/${response.data.skinTypeId}`);
                setSkinTypeInfo(skinTypeResponse.data); // Lưu thông tin loại da
                setIsPopupOpen(true); // Mở pop-up
            } else {
                setResult("Không thể gửi bài kiểm tra. Vui lòng thử lại.");
            }
        } catch (err) {
            // Xử lý lỗi nếu có
            setResult("Không thể gửi bài kiểm tra. Vui lòng thử lại.");
            console.error("Lỗi khi gửi bài kiểm tra:", err);
        }
    };

    // Hàm đóng pop-up
    const closePopup = () => {
        setIsPopupOpen(false);
    };

    // Hàm tạo liên kết dựa trên loại da
    const getSkinCareLink = (skinName) => {
        switch (skinName) {
            case 'Khô':
                return 'http://localhost:5173/listskincare/Kho';
            case 'Thường':
                return 'http://localhost:5173/listskincare/Thuong';
            case 'Nhạy cảm':
                return 'http://localhost:5173/listskincare/Nhaycam';
            case 'Hỗn hợp':
                return 'http://localhost:5173/listskincare/Honhop';
            case 'Dầu':
                return 'http://localhost:5173/listskincare/Dau';
            default:
                return '#';
        }
    };

    // Tính toán tiến độ làm bài
    const progress = (answeredCount / questions.length) * 100;

    // Hiển thị loading nếu đang tải dữ liệu
    if (loading) {
        return <div className="loading-container">Đang tải bài kiểm tra...</div>;
    }

    // Hiển thị lỗi nếu có
    if (error) {
        return <div className="error-container">Lỗi: {error}</div>;
    }

    return (
        <div className="container haven-skin-question">
            <h1 className="test-title">Bài kiểm tra loại da</h1>

            {/* Hiển thị số câu hỏi đã trả lời và tổng số câu hỏi */}
            <div className="progress-info">
                {answeredCount}/{questions.length} câu
            </div>

            {/* Progress Bar */}
            <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Hiển thị danh sách câu hỏi */}
            {questions.map((question, index) => {
                const answerLabels = ['A', 'B', 'C', 'D', 'E']; // Nhãn cho các đáp án
                return (
                    <div key={question.questionId} className="question-container">
                        <h2 className="question-title">Q{index + 1}: {decodeHtmlEntities(removeHtmlTags(question.questionContent))}</h2>
                        <ul className="options-list">
                            {question.answers.map((answer, ansIndex) => (
                                <li key={answer.answerId}>
                                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: "100%" }}>
                                        <input
                                            type="radio"
                                            name={`q${question.questionId}`}
                                            value={answer.answerId}
                                            onChange={() => handleChange(question.questionId, answer.answerId, answer.mark)}
                                        />
                                        <span className="answer-label"> <strong>{answerLabels[ansIndex]}.</strong> </span>
                                        <span className="answer-content">
                                            {decodeHtmlEntities(removeHtmlTags(answer.answerContent))}
                                        </span>
                                        <span className="points">({answer.mark} điểm)</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}

            {/* Nút "Gửi bài" */}
            <button className="submit-btn" onClick={handleSubmit}>Gửi bài</button>

            {/* Hiển thị kết quả */}
            {result && <div className="result-message">{result}</div>}

            {/* Modal hiển thị thông tin loại da */}
            <Modal
                title={<p style={{backgroundColor: "#900001", color: "white", padding: 5, width: "95%", fontSize: "lagne"}}>Kết quả bài kiểm tra loại da</p>}
                visible={isPopupOpen}
                onOk={closePopup}
                onCancel={closePopup}
                footer={[
                    <button key="close" onClick={closePopup} style={{padding: 5, borderRadius: 5, color: "white", backgroundColor: "red", border: "2px solid red"}}>
                        Đóng
                    </button>
                ]}
            >
                {skinTypeInfo && (
                    <>
                        <p><strong>Loại da của bạn:</strong> Da {skinTypeInfo.skinName}</p>
                        <p><strong>Mô tả:</strong> {decodeHtmlEntities(removeHtmlTags(skinTypeInfo.description))}</p>
                        <p><strong>Điểm số:</strong> {totalMark}</p>
                        {skinTypeInfo.skinTypeImages && skinTypeInfo.skinTypeImages.length > 0 && (
                            <img
                                src={skinTypeInfo.skinTypeImages[0].imageURL}
                                alt="Hình ảnh loại da"
                                style={{ width: '100%', maxWidth: '300px', marginTop: '10px' }}
                            />
                        )}
                        {/* Nút "Bấm vào đây để xem lộ trình chăm sóc da" */}
                        <a
                            href={getSkinCareLink(skinTypeInfo.skinName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'block', marginTop: '20px', textAlign: 'center' }}
                        >
                            <button type="primary" style={{padding: 5, borderRadius: 5, color: "black", backgroundColor: "yellow", border: "2px solid yellow"}}>
                                Bấm vào đây để xem lộ trình chăm sóc da {skinTypeInfo.skinName}
                            </button>
                        </a>
                    </>
                )}
            </Modal>
        </div>
    );
}