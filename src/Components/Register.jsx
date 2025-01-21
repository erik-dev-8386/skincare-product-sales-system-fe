import React, { useState } from 'react';
import './register.css';

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
            <img
                alt="Haven Skin logo with a leaf design"
                height="100"
                src="./public/images/logo.jpg"
                width="100"
            />
            <h1>Đăng ký</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Họ và tên</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="phone">Số điện thoại</label>
                <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="password">Mật khẩu</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="password">Xác nhận lại mật khẩu</label>
                <input
                    id="passworddd"
                    name="passworddd"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Đăng ký</button>
            </form>
        </div>
    );
}
