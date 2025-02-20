import { Button, Form, Input, Modal, Table, Popconfirm, DatePicker, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import api from "../../../config/api";

const ListProduct = () => {
    const [productList, setProductList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [form] = useForm();
    const [editingProduct, setEditingProduct] = useState(null);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [skinTypes, setSkinTypes] = useState([]);

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
        { title: "Brand ID", dataIndex: "brandId", key: "brandId", render: (brandId) => brands.find(b => b.id === brandId)?.name || "Unknown" },
        { title: "Skin Type ID", dataIndex: "skinTypeId", key: "skinTypeId", render: (skinTypeId) => skinTypes.find(b => b.id === skinTypeId)?.name || "Unknown" },
        { title: "Category ID", dataIndex: "categoryId", key: "categoryId", render: (categoryId) => categories.find(b => b.id === categoryId)?.name || "Unknown" },
        { title: "Discount ID", dataIndex: "discountId", key: "discountId", render: (discountId) => discounts.find(b => b.id === discountId)?.name || "Unknown" },


        {
            title: "Actions", key: "actions", render: (text, record) => (
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
            )
        },
    ];

    const fetchData = async () => {
        try {
            const [productsRes, brandsRes, categoriesRes, discountsRes, skinTypesRes] = await Promise.all([
                api.get("/products"),
                // api.get("/add-list-products"),
                api.get("/brands/list-name-brands"),
                api.get("/categories/list-name-categories"),
                api.get("/discounts/list-name-discounts"),
                api.get("/skin-types/list-name-skin-types")
            ]);
            setProductList(productsRes.data);
            setBrands(brandsRes.data.map(name => ({ id: name, name })));
            setCategories(categoriesRes.data.map(name => ({ id: name, name })));
            setDiscounts(discountsRes.data.map(name => ({ id: name, name })));
            setSkinTypes(skinTypesRes.data.map(name => ({ id: name, name })));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
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
        try {
            console.log("Dữ liệu gửi lên:", values); // Kiểm tra dữ liệu gửi đi
    
            const response = editingProduct
                ? await api.put(`/products/${editingProduct.productId}`, values)
                : await api.post("/products", values);
    
            console.log("Phản hồi từ API:", response.data); // Kiểm tra phản hồi từ API
    
            toast.success(editingProduct ? "Cập nhật sản phẩm thành công!" : "Thêm sản phẩm thành công!");
            fetchData();
            handleCloseModal();
        } catch (error) {
            console.error("Lỗi khi gửi request:", error.response?.data || error.message); // In lỗi chi tiết
            toast.error("Xử lý sản phẩm không thành công!");
        }
    };
    

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        form.setFieldsValue(product);
        handleOpenModal();
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await api.delete(`/products/${productId}`);
            toast.success("Xóa sản phẩm thành công!");
            fetchData();
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
                // title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                // open={isModalOpen}
                // onCancel={handleCloseModal}
                // onOk={() => form.submit()}

                title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                open={isModalOpen}
                onCancel={handleCloseModal}
                onOk={() => form.submit()}
            >
                {/* <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}> */}
                <Form
                    form={form}
                    labelCol={{ span: 24 }}
                    onFinish={handleSubmitForm}
                    initialValues={{ productName: "", description: "", ingredients: "", unitPrice: "", discountPrice: "", quantity: "", netWeight: "" }}
                >
                    <Form.Item label="Tên sản phẩm" name="productName" rules={[{ required: true, message: "Tên sản phẩm không được để trống!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: "Mô tả không được để trống!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Thành phần" name="ingredients" rules={[{ required: true, message: "Thành phần không được để trống!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Giá gốc" name="unitPrice" rules={[{ required: true, message: "Giá gốc không được để trống!" }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Giá giảm" name="discountPrice" rules={[{ required: true, message: "Giá giảm không được để trống!" }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Tồn kho" name="quantity" rules={[{ required: true, message: "Tồn kho không được để trống!" }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Ngày sản xuất" name="mfg" rules={[{ required: true, message: "Ngày sản xuất không được để trống!" }]}>
                    <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item label="Hạn sử dụng" name="exp" rules={[{ required: true, message: "Hạn sử dụng không được để trống!" }]}>
                    <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item label="Trọng lượng (g)" name="quantity" rules={[{ required: true, message: "Trọng lượng không được để trống!" }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Thương hiệu" name="brandId" rules={[{ required: true, message: "Tên sản phẩm không được để trống!" }]}>
                        <Select>
                            {brands.map(brand => <Select.Option key={brand.id} value={brand.id}>{brand.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Loại da" name="skinTypeId" rules={[{ required: true, message: "Tên sản phẩm không được để trống!" }]}>
                        <Select>
                            {skinTypes.map(skinType => <Select.Option key={skinType.id} value={skinType.id}>{skinType.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Danh mục" name="categoryId" rules={[{ required: true, message: "Tên sản phẩm không được để trống!" }]}>
                        <Select>
                            {categories.map(category => <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Giảm giá" name="discountId" rules={[{ required: true, message: "Tên sản phẩm không được để trống!" }]}>
                        <Select>
                            {discounts.map(discount => <Select.Option key={discount.id} value={discount.id}>{discount.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ListProduct;
