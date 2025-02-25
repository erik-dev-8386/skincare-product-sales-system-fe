import React, { useEffect, useState, useNavigate } from "react";
import api from "../../../config/api";
import { Layout, Menu, Table, Card, Statistic, Button, Form, Input, Modal, Popconfirm } from "antd";
import { UserOutlined, DashboardOutlined, AppstoreOutlined, PercentageOutlined, InboxOutlined } from "@ant-design/icons";
import cot from '../../../assets/cot.jpg';
import tron from '../../../assets/tron.jpg';
import axios from "axios";
import "./DashBoard.css"

export default function DashBoard() {

    const [users, setUsers] = useState([]);
    const [staff, setStaff] = useState([]);
    const [products, setProduct] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [skinTypes, setSkinTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState("users");

    const [form] = Form.useForm();

    useEffect(() => {
        axios.get("https://jsonplaceholder.typicode.com/users")
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching user data:", error));
    }, []);

    useEffect(() => {
        api.get("/users")
            .then(response => {
                setStaff(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching staff data:", error));
    }, []);

    useEffect(() => {
        api.get("/products")
            .then(response => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching products data:", error));
    }, []);

    useEffect(() => {
        api.get("/brands")
            .then(response => {
                setBrands(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching brands data:", error));
    }, []);

    useEffect(() => {
        api.get("/categories")
            .then(response => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching category data:", error));
    }, []);

    useEffect(() => {
        api.get("/discounts")
            .then(response => {
                setDiscounts(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching discount data:", error));
    }, []);

    useEffect(() => {
        api.get("/skin-types")
            .then(response => {
                setSkinTypes(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching discount data:", error));
    }, []);



    const userColumns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
    ];



    return (
        <>
            <div className="row">
                <div className="col-md-3">
                    <Card>
                        <Statistic title="Total Users" value={users.length} />
                    </Card>
                </div>
                <div className="col-md-3">
                    <Card>
                        <Statistic title="Total Staff" value={staff.length} />
                    </Card>
                </div>
                <div className="col-md-3">
                    <Card>
                        <Statistic title="Total Products" value={products.length} />
                    </Card>
                </div>
                <div className="col-md-3">
                    <Card>
                        <Statistic title="Total Brands" value={brands.length} />
                    </Card>
                </div>
                <div className="col-md-3">
                    <Card>
                        <Statistic title="Total Categories" value={categories.length} />
                    </Card>
                </div>
                <div className="col-md-3">
                    <Card>
                        <Statistic title="Total Discounts" value={discounts.length} />
                    </Card>
                </div>
                <div className="col-md-3">
                    <Card>
                        <Statistic title="Total Skin Types" value={skinTypes.length} />
                    </Card>
                </div>


            </div>

            <div className="row mt-4">
                <div className="col-md-6">
                    <img src={cot} alt="Da kho" className='bieudo' />
                </div>
                <div className="col-md-6">
                    <img src={tron} alt="Da kho" className='bieudo' />
                </div>
            </div>
        </>
    )
}
