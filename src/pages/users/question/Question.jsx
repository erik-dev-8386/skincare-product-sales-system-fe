import React from 'react'
import Footer from "../../../component/Footer/Footer";
import Header from '../../../component/Header/Header';
import '../question/Question.css';
import { useState } from "react";

export default function Question() {

    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState("");

    const handleChange = (e) => {
        setAnswers({ ...answers, [e.target.name]: parseInt(e.target.value) });
    };

    const handleSubmit = () => {
        const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0);

        let skinType = "";
        if (totalScore <= 10) {
            skinType = "Da dầu";
        } else if (totalScore <= 20) {
            skinType = "Da hỗn hợp";
        } else if (totalScore <= 30) {
            skinType = "Da thường";
        } else if (totalScore <= 40) {
            skinType = "Da khô";
        } else {
            skinType = "Da nhạy cảm";
        }

        setResult(`Loại da của bạn là: ${skinType}`);
    };


    return (
        <>
            {/* <Header /> */}
            <div className="containerr">
                <h2 className="question-title">Q1: Da của bạn thường trông ra sao vào buổi chiều?</h2>
                <ul className="options-list">
                    <li><input type="radio" name="q1" value="1" onChange={handleChange}/> Trán, mũi và cằm bị bóng dầu nhưng phần còn lại trên mặt lại bình thường hoặc khô. <span className="points">(1 điểm)</span></li>
                    <li><input type="radio" name="q1" value="5" onChange={handleChange}/> Da của tôi không bị bóng, khá khô và có cảm giác căng ở một số khu vực. <span className="points">(5 điểm)</span> </li>
                    <li><input type="radio" name="q1" value="2" onChange={handleChange}/> Toàn bộ khuôn mặt tôi bị bóng, có cảm giác nhờn dầu và dễ bị mụn đầu đen và mụn trứng cá<span className="points">(2 điểm)</span></li>
                    <li><input type="radio" name="q1" value="3" onChange={handleChange}/> Da của tôi mềm mại và thấy dễ chịu khi chạm vào  <span className="points">(3 điểm)</span></li>
                    <li><input type="radio" name="q1" value="4" onChange={handleChange}/> Da của tôi bị khô và tôi có thể nhận thấy một số nếp nhăn  <span className="points">(4 điểm)</span></li>
                </ul>

                <h2 className="question-title">Q2: Vùng trán của bạn trông như thế nào?</h2>
                <ul className="options-list">
                    <li><input type="radio" name="q2" value="4" onChange={handleChange}/> Da khá phẳng mịn, với một vài nếp nhăn nhẹ.  <span className="points">(4 điểm)</span></li>
                    <li><input type="radio" name="q2" value="2" onChange={handleChange}/> Tôi nhận thấy một vài vết bong tróc dọc theo đường chân tóc, lông mày và giữa hai bên lông mày.  <span className="points">(2 điểm)</span></li>
                    <li><input type="radio" name="q2" value="1" onChange={handleChange}/> Da bóng nhờn và không được mịn. Có những nốt mụn nhỏ và một số mụn đầu đen.  <span className="points">(1 điểm)</span></li>
                    <li><input type="radio" name="q2" value="3" onChange={handleChange}/> Da mịn và láng mượt. Không có dấu hiệu bong tróc.  <span className="points">(3 điểm)</span></li>
                    <li><input type="radio" name="q2" value="5" onChange={handleChange}/> Điều đầu tiên tôi nhận thấy là các nếp nhăn.  <span className="points">(5 điểm)</span></li>
                </ul>

                <h2 className="question-title">Q3: Hãy mô tả phần má và vùng dưới mắt của bạn.</h2>
                <ul className="options-list">
                    <li><input type="radio" name="q3" value="2" onChange={handleChange}/>Hầu như không có vết nhăn dễ thấy nào. Chỉ có một số vùng da khô có thể nhìn ra.  <span className="points">(2 điểm)</span></li>
                    <li><input type="radio" name="q3" value="5" onChange={handleChange}/>Da bị kích ứng và khô. Có cảm giác da bị căng.  <span className="points">(5 điểm)</span></li>
                    <li><input type="radio" name="q3" value="1" onChange={handleChange}/>Lỗ chân lông nở rộng và có khuyết điểm dưới dạng mụn đầu đen hay đốm mụn trắng.  <span className="points">(1 điểm)</span></li>
                    <li><input type="radio" name="q3" value="5" onChange={handleChange}/>Da nhẵn mịn với lỗ chân lông se khít.  <span className="points">(3 điểm)</span></li>
                    <li><input type="radio" name="q3" value="4" onChange={handleChange}/>Có các nếp nhăn rõ rệt. Da khá khô.  <span className="points">(4 điểm)</span></li>
                </ul>

                <h2 className="question-title">Q4: Da của bạn có dễ gặp phải các vấn đề về thâm, hay đỏ rát không?</h2>
                <ul className="options-list">
                    <li><input type="radio" name="q4" value="2" onChange={handleChange}/>Có, nhưng chỉ ở vùng chữ T (trán, mũi và cằm).  <span className="points">(2 điểm)</span></li>
                    <li><input type="radio" name="q4" value="5" onChange={handleChange}/>Da tôi hơi đỏ, có chút tấy, và có chỗ không đồng đều về độ ẩm.  <span className="points">(5 điểm)</span></li>
                    <li><input type="radio" name="q4" value="1" onChange={handleChange}/>Có. Tôi thường gặp phải các vấn đề trên.  <span className="points">(1 điểm)</span></li>
                    <li><input type="radio" name="q4" value="4" onChange={handleChange}/>Đôi khi.  <span className="points">(4 điểm)</span></li>
                    <li><input type="radio" name="q4" value="3" onChange={handleChange}/>Hầu như không bao giờ.  <span className="points">(3 điểm)</span></li>
                </ul>

                <h2 className="question-title">Q5: Hiện giờ điều gì là quan trọng nhất với bạn khi lựa chọn một sản phẩm chăm sóc da?</h2>
                <ul className="options-list">
                    <li><input type="radio" name="q5" value="2" onChange={handleChange}/>Sản phẩm giúp tôi đối phó với sự bóng dầu nhưng vẫn có tác dụng dưỡng ẩm.    <span className="points">(2 điểm)</span></li>
                    <li><input type="radio" name="q5" value="5" onChange={handleChange}/>Sản phẩm giúp làm dịu và nuôi dưỡng làm da của tôi sâu từ bên trong.  <span className="points">(5 điểm)</span></li>
                    <li><input type="radio" name="q5" value="1" onChange={handleChange}/>Sản phẩm có khả năng thẩm thấu nhanh và cải thiện làn da của tôi một cách nhanh chóng. <span className="points">(1 điểm)</span></li>
                    <li><input type="radio" name="q5" value="3" onChange={handleChange}/>Sản phẩm giữ cho da tôi mịn màng và mềm mại như hiện tại. <span className="points">(3 điểm)</span></li>
                    <li><input type="radio" name="q5" value="4" onChange={handleChange}/>Sản phẩm giúp nuôi dưỡng sâu làn da của tôi và giúp ngăn ngừa các dấu hiệu lão hóa sớm. <span className="points">(4 điểm)</span></li>
                </ul>

                <h2 className="question-title">Q6: Da của bạn có dễ hình thành các vết hằn và nếp nhăn?</h2>
                <ul className="options-list">
                    <li><input type="radio" name="q6" value="4" onChange={handleChange}/>Tôi bị một vài vết hằn do da khô.    <span className="points">(4 điểm)</span></li>
                    <li><input type="radio" name="q6" value="2" onChange={handleChange}/>Có. Tôi bị các nếp nhăn quanh vùng mắt và/hoặc ở khóe miệng.  <span className="points">(2 điểm)</span></li>
                    <li><input type="radio" name="q6" value="1" onChange={handleChange}/>Không, tôi hầu như không có nếp nhăn. <span className="points">(1 điểm)</span></li>
                    <li><input type="radio" name="q6" value="3" onChange={handleChange}/>Không hẳn, da của tôi lão hóa tương đối chậm <span className="points">(3 điểm)</span></li>
                </ul>

                <h2 className="question-title">Q7: Da mặt bạn đã thay đổi ra sao trong 5 năm trở lại đây?</h2>
                <ul className="options-list">
                    <li><input type="radio" name="q7" value="2" onChange={handleChange}/>Da tôi bị bóng dầu nhiều hơn ở vùng chữ T (trán, mũi và cằm).    <span className="points">(2 điểm)</span></li>
                    <li><input type="radio" name="q7" value="5" onChange={handleChange}/>Da tôi dễ bong tróc hơn và thường cảm thấy căng.  <span className="points">(5 điểm)</span></li>
                    <li><input type="radio" name="q7" value="1" onChange={handleChange}/>Da có nhiều khuyết điểm hơn so với trước đây. <span className="points">(1 điểm)</span></li>
                    <li><input type="radio" name="q7" value="3" onChange={handleChange}/>Da tôi vẫn ở tình trạng tốt và dễ dàng chăm sóc. <span className="points">(3 điểm)</span></li>
                    <li><input type="radio" name="q7" value="4" onChange={handleChange}/>Da tôi có vẻ mỏng đi và kém đàn hồi hơn, và thêm các nếp nhăn và vết hằn. <span className="points">(4 điểm)</span></li>
                </ul>

                <h2 className="question-title">Q8: Giới tính của bạn là</h2>
                <ul className="options-list">
                    <li><input type="radio" name="q8" value="3" onChange={handleChange}/>Nam <span className="points">(3 điểm)</span></li>
                    <li><input type="radio" name="q8" value="3" onChange={handleChange}/>Nữ <span className="points">(3 điểm)</span></li>
                </ul>

                <h2 className="question-title">Q9: Độ tuổi của bạn là</h2>
                <ul className="options-list">
                    <li><input type="radio" name="q9" value="1" onChange={handleChange}/>Dưới 25 <span className="points">(3 điểm)</span></li>
                    <li><input type="radio" name="q9" value="3" onChange={handleChange}/>Từ 25 tới 40 <span className="points">(3 điểm)</span></li>
                    <li><input type="radio" name="q9" value="4" onChange={handleChange}/>Từ 40 tới 50 <span className="points">(4 điểm)</span></li>
                    <li><input type="radio" name="q9" value="5" onChange={handleChange}/>Trên 50 <span className="points">(5 điểm)</span></li>
                </ul>

                <button className="submit-btn" onClick={handleSubmit}>Submit</button>

                {result && <div className="result-message">{result}</div>}
            </div>
            {/* <Footer /> */}
        </>
    )
}
