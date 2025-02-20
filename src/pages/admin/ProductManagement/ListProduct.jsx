import { Button, Form, Input, Modal, Table, Popconfirm, DatePicker, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
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
    const [selectedIds, setSelectedIds] = useState({});

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
    
        // Hiển thị tên thay vì ID bằng cách tìm trong danh sách
        // {
        //     title: "Brand",
        //     dataIndex: "brandId",
        //     key: "brandId",
        //     render: (brandId) => brands.find((b) => b.id === brandId)?.name || "N/A",
        // },
        // {
        //     title: "Skin Type",
        //     dataIndex: "skinTypeId",
        //     key: "skinTypeId",
        //     render: (skinTypeId) => skinTypes.find((s) => s.id === skinTypeId)?.name || "N/A",
        // },
        // {
        //     title: "Category",
        //     dataIndex: "categoryId",
        //     key: "categoryId",
        //     render: (categoryId) => categories.find((c) => c.id === categoryId)?.name || "N/A",
        // },
        // {
        //     title: "Discount",
        //     dataIndex: "discountId",
        //     key: "discountId",
        //     render: (discountId) => discounts.find((d) => d.id === discountId)?.name || "N/A",
        // },

        {
            title: "Brand",
            dataIndex: "brandId",
            key: "brandId",
            render: (brandId) => {
                const brand = brands.find((b) => String(b.id) === String(brandId));
                return brand ? brand.name : "N/A";
            },
        },
        {
            title: "Skin Type",
            dataIndex: "skinTypeId",
            key: "skinTypeId",
            render: (skinTypeId) => {
                const skinType = skinTypes.find((s) => String(s.id) === String(skinTypeId));
                return skinType ? skinType.name : "N/A";
            },
        },
        {
            title: "Category",
            dataIndex: "categoryId",
            key: "categoryId",
            render: (categoryId) => {
                const category = categories.find((c) => String(c.id) === String(categoryId));
                return category ? category.name : "N/A";
            },
        },
        {
            title: "Discount",
            dataIndex: "discountId",
            key: "discountId",
            render: (discountId) => {
                const discount = discounts.find((d) => String(d.id) === String(discountId));
                return discount ? discount.name : "N/A";
            },
        },
        
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
    

    // const fetchData = async () => {
    //     try {
    //         const [productsRes, brandsRes, categoriesRes, discountsRes, skinTypesRes] = await Promise.all([
    //             api.get("/products"),
    //             api.get("/brands/list-name-brands"),
    //             api.get("/categories/list-name-categories"),
    //             api.get("/discounts/list-name-discounts"),
    //             api.get("/skin-types/list-name-skin-types"),
    //         ]);
    //         setProductList(productsRes.data);
    //         setBrands(brandsRes.data);
    //         setCategories(categoriesRes.data);
    //         setDiscounts(discountsRes.data);
    //         setSkinTypes(skinTypesRes.data);
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     }
    // };


    const fetchData = async () => {
        try {
            const [productsRes, brandsRes, categoriesRes, discountsRes, skinTypesRes] = await Promise.all([
                api.get("/products"),
                api.get("/brands/list-name-brands"),
                api.get("/categories/list-name-categories"),
                api.get("/discounts/list-name-discounts"),
                api.get("/skin-types/list-name-skin-types"),
            ]);
    
            console.log("Products:", productsRes.data);
            console.log("Brands:", brandsRes.data);
            console.log("Categories:", categoriesRes.data);
            console.log("Discounts:", discountsRes.data);
            console.log("SkinTypes:", skinTypesRes.data);
    
            setProductList(productsRes.data);
            setBrands(brandsRes.data);
            setCategories(categoriesRes.data);
            setDiscounts(discountsRes.data);
            setSkinTypes(skinTypesRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        console.log("Brands Loaded:", brands);
        console.log("SkinTypes Loaded:", skinTypes);
        console.log("Categories Loaded:", categories);
        console.log("Discounts Loaded:", discounts);
    }, [brands, skinTypes, categories, discounts]);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        form.resetFields();
        setEditingProduct(null);
    };

    const fetchIdByName = async (name, type) => {
        try {
            const response = await api.get(`/${type}/name/${name}`);
            setSelectedIds(prev => ({ ...prev, [type]: response.data }));
        } catch (error) {
            console.error(`Error fetching ${type} ID:`, error);
        }
    };

    // const handleSubmitForm = async (values) => {
    //     try {
    //         const productData = { ...values, ...selectedIds };
    //         const response = editingProduct
    //             ? await api.put(`/products/${editingProduct.productId}`, productData)
    //             : await api.post("/products", productData);

    //         toast.success(editingProduct ? "Cập nhật sản phẩm thành công!" : "Thêm sản phẩm thành công!");
    //         fetchData();
    //         handleCloseModal();
    //     } catch (error) {
    //         console.error("Lỗi khi gửi request:", error.response?.data || error.message);
    //         toast.error("Xử lý sản phẩm không thành công!");
    //     }
    // };

    const handleSubmitForm = async (values) => {
        try {
            const productData = {
                ...values,
                brandId: selectedIds.brands,
                skinTypeId: selectedIds["skin-types"],
                categoryId: selectedIds.categories,
                discountId: selectedIds.discounts,
            };
    
            if (editingProduct) {
                await api.put(`/products/${editingProduct.productId}`, productData);
                toast.success("Cập nhật sản phẩm thành công!");
            } else {
                await api.post("/products", productData);
                toast.success("Thêm sản phẩm thành công!");
            }
    
            handleCloseModal();
            await fetchData(); // Gọi lại danh sách để cập nhật tên
        } catch (error) {
            console.error("Lỗi khi gửi request:", error.response?.data || error.message);
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
            <Button type="primary" onClick={() => setModalOpen(true)}>
                <i className="fa-solid fa-plus"></i> Thêm sản phẩm mới
            </Button>
            <Table dataSource={productList} columns={columns} rowKey="productId" style={{ marginTop: 16 }} />
            <Modal title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"} open={isModalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()}>
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
                    <Form.Item label="Tên sản phẩm" name="productName" rules={[{ required: true }]}>
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

                    <Form.Item label="Thương hiệu" name="brandName" rules={[{ required: true }]}>
                        <Select onChange={(value) => fetchIdByName(value, "brands")}>
                            {brands.map(brand => (
                                <Select.Option key={brand} value={brand}>{brand}</Select.Option>
                                // <Select.Option key={brand.id} value={brand.name}>{brand.name}</Select.Option>

                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Loại da" name="skinTypeName" rules={[{ required: true }]}>
                        <Select onChange={(value) => fetchIdByName(value, "skin-types")}>
                            {skinTypes.map(skinType => (
                                <Select.Option key={skinType} value={skinType}>{skinType}</Select.Option>
                                // <Select.Option key={skinType.id} value={skinType.name}>{skinType.name}</Select.Option>

                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Danh mục" name="categoryName" rules={[{ required: true }]}>
                        <Select onChange={(value) => fetchIdByName(value, "categories")}>
                            {categories.map(category => (
                                <Select.Option key={category} value={category}>{category}</Select.Option>
                                // <Select.Option key={category.id} value={category.name}>{category.name}</Select.Option>


                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Giảm giá" name="discountName" rules={[{ required: true }]}>
                        <Select onChange={(value) => fetchIdByName(value, "discounts")}>
                            {discounts.map(discount => (
                                <Select.Option key={discount} value={discount}>{discount}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ListProduct;
