import { Button, Form, Input, Modal, Table, Popconfirm, DatePicker, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const ListProduct = () => {
    const [productList, setProductList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [form] = useForm();
    const [editingProduct, setEditingProduct] = useState(null);

    const columns = [
        { title: "Product ID", dataIndex: "productId", key: "productId" },
        { title: "Product Name", dataIndex: "productName", key: "productName" },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "Ingredients", dataIndex: "ingredients", key: "ingredients" },
        { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice" },
        { title: "Discount Price", dataIndex: "discountPrice", key: "discountPrice" },
        { title: "Stock", dataIndex: "quantity", key: "quantity" },
        { title: "Manufacture Date", dataIndex: "mfg", key: "mfg" },
        { title: "Expiry Date", dataIndex: "exp", key: "exp" },
        { title: "Net Weight", dataIndex: "netWeight", key: "netWeight" },
        { title: "Discount ID", dataIndex: "discountId", key: "discountId" },
        { title: "Category", dataIndex: "categoryId", key: "categoryId" },
        { title: "Brand", dataIndex: "brandId", key: "brandId" },
        { title: "Skin Type", dataIndex: "skinTypeId", key: "skinTypeId" },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <div>
                    <Button onClick={() => handleEditProduct(record)} style={{ marginRight: 8 }}>
                        <i className="fa-solid fa-pen-to-square"></i> Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa sản phẩm này không?"
                        onConfirm={() => handleDeleteProduct(record.productId)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger>
                            <i className="fa-solid fa-trash"></i> Xóa
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8080/haven-skin/products");
            setProductList(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        form.resetFields();
        setEditingProduct(null);
    };

    const handleSubmitForm = async (values) => {
        if (editingProduct) {
            try {
                await axios.put(`http://localhost:8080/haven-skin/products/${editingProduct.productId}`, values);
                toast.success("Cập nhật sản phẩm thành công!");
                fetchProducts();
                handleCloseModal();
            } catch (error) {
                toast.error("Cập nhật sản phẩm không thành công!");
            }
        } else {
            try {
                await axios.post("http://localhost:8080/haven-skin/products", values);
                toast.success("Thêm sản phẩm thành công");
                fetchProducts();
                handleCloseModal();
            } catch (error) {
                toast.error("Thêm sản phẩm không thành công!");
            }
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        form.setFieldsValue(product);
        handleOpenModal();
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:8080/haven-skin/products/${productId}`);
            toast.success("Xóa sản phẩm thành công!");
            fetchProducts();
        } catch (error) {
            toast.error("Xóa sản phẩm không thành công!");
        }
    };

    return (
        <div>
            <ToastContainer />
            <h1>Quản lý sản phẩm</h1>
            <Button type="primary" onClick={handleOpenModal}>
                <i className="fa-solid fa-plus"></i> Thêm sản phẩm mới
            </Button>
            <Table dataSource={productList} columns={columns} rowKey="productId" style={{ marginTop: 16 }} />
            <Modal
                title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                open={isModalOpen}
                onCancel={handleCloseModal}
                onOk={() => form.submit()}
            >
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
                    <Form.Item
                        label="Tên sản phẩm"
                        name="productName"
                        rules={[{ required: true, message: "Tên sản phẩm không được để trống!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: false, message: "Mô tả phẩm không được để trống!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Thành phần"
                        name="ingredients"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Giá gốc"
                        name="unitPrice">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Giá giảm"
                        name="discountPrice">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Tồn kho"
                        name="quantity">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Ngày sản xuất"
                        name="mfg">
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Hạn sử dụng"
                        name="exp">
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Trọng lượng (g)"
                        name="netWeight">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Mã giảm giá"
                        name="discountId">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Danh mục"
                        name="categoryId">
                        <Select> <Select.Option value="1">Danh mục 1</Select.Option>
                            <Select.Option value="2">Danh mục 2</Select.Option>
                        </Select> </Form.Item>
                    <Form.Item label="Thương hiệu" name="brandId">
                        <Select> <Select.Option value="1">Thương hiệu A</Select.Option>
                            <Select.Option value="2">Thương hiệu B</Select.Option>
                        </Select> </Form.Item>
                    <Form.Item label="Loại da" name="skinTypeId"> <Input /> </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ListProduct;
