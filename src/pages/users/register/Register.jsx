import React, { useState } from 'react';
import './register.css';
import logo from "../../../assets/Logo_01.jpg"
export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted Data:', formData);
        alert('Đăng ký thành công!');
        // Thêm logic gửi dữ liệu ở đây (gửi API nếu cần)
    };

    return (
        <div className="register-form">
            <a href="/"><img
                alt="Haven Skin logo with a leaf design"
                height="100"
                src={logo}
                width="100"
            /></a>
            <h1>Đăng ký</h1>
            <form onSubmit={handleSubmit}>
                <div className='input-register'>
                    <label htmlFor="name">Họ và tên</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='input-register'>

                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                </div>
                <div className='input-register'>
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-register">
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-register">
                    <label htmlFor="password">Xác nhận lại mật khẩu</label>
                    <input
                        id="passworddd"
                        name="passworddd"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Đăng ký</button>
            </form>
        </div>
    );
}
