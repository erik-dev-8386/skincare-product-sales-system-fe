import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  Popconfirm,
  DatePicker,
  Select,
  Col,
  Row,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../../config/api";
import MyEditor from "../../../component/TinyMCE/MyEditor";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import { EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
const ListProduct = () => {
  const [productList, setProductList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const columns = [
    { title: "ID sản phẩm", dataIndex: "productId", key: "productId" },
    { title: "Tên sản phẩm", dataIndex: "productName", key: "productName" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    { title: "Thành phần", dataIndex: "ingredients", key: "ingredients" },
    { title: "Giá gốc", dataIndex: "unitPrice", key: "unitPrice" },
    { title: "Giá giảm", dataIndex: "discountPrice", key: "discountPrice" },
    { title: "Tồn kho", dataIndex: "quantity", key: "quantity" },
    { title: "Ngày sản xuất", dataIndex: "mfg", key: "mfg" },
    { title: "Ngày hết hạn", dataIndex: "exp", key: "exp" },
    { title: "Trọng lượng", dataIndex: "netWeight", key: "netWeight" },

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
      title: "Thương hiệu",
      dataIndex: "brandId",
      key: "brandId",
      render: (id) => getDisplayName(id, brands),
    },
    {
      title: "Loại da",
      dataIndex: "skinTypeId",
      key: "skinTypeId",
      render: (id) => getDisplayName(id, skinTypes),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (id) => getDisplayName(id, categories),
    },
    {
      title: "Giảm giá",
      dataIndex: "discountId",
      key: "discountId",
      render: (id) => getDisplayName(id, discounts),
    },

    {
      title: "Nút điều khiển",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            onClick={() => handleEditProduct(record)}
            style={{ marginRight: 8 }}
          >
            <i className="fa-solid fa-pen-to-square"></i> Sửa
          </Button>
          <Button
            color="primary"
            variant="filled"
            type="default"
            onClick={() => handleViewDetails(record)}
            style={{ marginRight: 8, border: "2px solid " }}
          >
            <i className="fa-solid fa-eye"></i> Chi tiết
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

  // const getDisplayName = (id, list) =>
  //   list.find((item) => String(item.id) === String(id))?.name || "N/A";

  const getDisplayName = (id, list) => {
    // Nếu id đã là name, trả về trực tiếp
    if (list.some((item) => item.name === id)) {
      return id;
    }

    // Nếu id là số, tìm kiếm trong danh sách
    return list.find((item) => String(item.id) === String(id))?.name || id;
  };

  const fetchData = async () => {
    try {
      const endpoints = [
        { key: "products", url: "/products" },
        { key: "brands", url: "/brands/list-name-brands" },
        { key: "categories", url: "/categories/list-name-categories" },
        { key: "discounts", url: "/discounts/list-name-discounts" },
        { key: "skinTypes", url: "/skin-types/list-name-skin-types" },
      ];

      const responses = await Promise.all(
        endpoints.map(({ url }) => api.get(url))
      );

      const data = responses.reduce((acc, res, index) => {
        acc[endpoints[index].key] = res.data;
        return acc;
      }, {});

      setProductList(data.products);
      setBrands(data.brands);
      setCategories(data.categories);
      setDiscounts(data.discounts);
      setSkinTypes(data.skinTypes);
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

  //   const fetchIdByName = async (name, type) => {
  //     try {
  //       const response = await api.get(`/${type}/name/${name}`);
  //       setSelectedIds((prev) => ({ ...prev, [type]: response.data }));
  //     } catch (error) {
  //       console.error(`Error fetching ${type} ID:`, error);
  //     }
  //   };

  const getIdByName = (name, type) => {
    const map = {
      brands,
      categories,
      discounts,
      skinTypes,
    };
    return map[type]?.find((item) => item.name === name)?.id || null;
  };

  const handleViewDetails = (productList) => {
    setSelectedProduct(productList);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedProduct(null);
  };
  const handleSubmitForm = async (values) => {
    try {
      const productData = {
        ...values,
        brandId: getIdByName(values.brandName, "brands"),
        categoryId: getIdByName(values.categoryName, "categories"),
        discountId: getIdByName(values.discountName, "discounts"),
        skinTypeId: getIdByName(values.skinTypeName, "skinTypes"),
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.productId}`, productData);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await api.post("/products", productData);
        toast.success("Thêm sản phẩm thành công!");
      }

      handleCloseModal();
      await fetchData();
    } catch (error) {
      console.error(
        "Lỗi khi gửi request:",
        error.response?.data || error.message
      );
      toast.error("Xử lý sản phẩm không thành công!");
    }
  };

  const handleEditProduct = (product) => {
    console.log("Product being edited:", product); // Debug dữ liệu sản phẩm
    if (!product) {
      console.error("Product is undefined!");
      return;
    }

    setEditingProduct(product);

    form.setFieldsValue({
      ...product,
      brandName: getDisplayName(product.brandId, brands),
      categoryName: getDisplayName(product.categoryId, categories),
      discountName: getDisplayName(product.discountId, discounts),
      skinTypeName: getDisplayName(product.skinTypeId, skinTypes),
    });

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
      <Table
        dataSource={productList}
        columns={columns}
        rowKey="productId"
        style={{ marginTop: 16 }}
      />

      <Modal
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText={editingProduct ? "Lưu thay đổi" : "Tạo"}
        cancelText="Hủy"
        width={800}
      >
        <Form
          form={form}
          labelCol={{ span: 24 }}
          onFinish={handleSubmitForm}
          layout="vertical"
        >
          <Row gutter={16}>
            {/* Cột 1 */}
            <Col span={12}>
              <Form.Item
                label="Tên sản phẩm"
                name="productName"
                rules={[
                  {
                    required: true,
                    message: "Tên sản phẩm không được để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[
                  { required: true, message: "Mô tả không được để trống!" },
                ]}
              >
                <MyEditor
                  value={form.getFieldValue("description")}
                  onChange={(value) =>
                    form.setFieldsValue({ description: value })
                  }
                />
              </Form.Item>
              <Form.Item
                label="Thành phần"
                name="ingredients"
                rules={[
                  {
                    required: true,
                    message: "Thành phần không được để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Giá gốc"
                name="unitPrice"
                rules={[
                  { required: true, message: "Giá gốc không được để trống!" },
                ]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                label="Giá giảm"
                name="discountPrice"
                rules={[
                  { required: true, message: "Giá giảm không được để trống!" },
                ]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                label="Tồn kho"
                name="quantity"
                rules={[
                  { required: true, message: "Tồn kho không được để trống!" },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>

            {/* Cột 2 */}
            <Col span={12}>
              <Form.Item
                label="Ngày sản xuất"
                name="mfg"
                rules={[
                  {
                    required: true,
                    message: "Ngày sản xuất không được để trống!",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Hạn sử dụng"
                name="exp"
                rules={[
                  {
                    required: true,
                    message: "Hạn sử dụng không được để trống!",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Trọng lượng (g)"
                name="netWeight"
                rules={[
                  {
                    required: true,
                    message: "Trọng lượng không được để trống!",
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label="Thương hiệu"
                name="brandName"
                rules={[
                  {
                    required: true,
                    message: "Thương hiệu không được để trống!",
                  },
                ]}
              >
                <Select onChange={(value) => fetchIdByName(value, "brands")}>
                  {brands.map((brand) => (
                    <Select.Option key={brand} value={brand}>
                      {brand}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Loại da"
                name="skinTypeName"
                rules={[
                  { required: true, message: "Loại da không được để trống!" },
                ]}
              >
                <Select
                  onChange={(value) => fetchIdByName(value, "skin-types")}
                >
                  {skinTypes.map((skinType) => (
                    <Select.Option key={skinType} value={skinType}>
                      {skinType}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Danh mục"
                name="categoryName"
                rules={[
                  { required: true, message: "Danh mục không được để trống!" },
                ]}
              >
                <Select
                  onChange={(value) => fetchIdByName(value, "categories")}
                >
                  {categories.map((category) => (
                    <Select.Option key={category} value={category}>
                      {category}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Giảm giá"
                name="discountName"
                rules={[
                  { required: true, message: "Giảm giá không được để trống!" },
                ]}
              >
                <Select onChange={(value) => fetchIdByName(value, "discounts")}>
                  {discounts.map((discount) => (
                    <Select.Option key={discount} value={discount}>
                      {discount}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal chi tiết sản phẩm */}
      <Modal
        title="Chi tiết sản phẩm"
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
      >
        {selectedProduct && (
          <div>
            <p>
              <strong>ID sản phẩm:</strong> {selectedProduct.productId}
            </p>
            <p>
              <strong>Tên sản phẩm:</strong> {selectedProduct.productName}
            </p>
            <p>
              <strong>Mô tả:</strong>{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: selectedProduct.description,
                }}
              />
            </p>
            <p>
              <strong>Thành phần:</strong> {selectedProduct.ingredients}
            </p>
            <p>
              <strong>Giá gốc:</strong> {selectedProduct.unitPrice}
            </p>
            <p>
              <strong>Giá giảm:</strong> {selectedProduct.discountPrice}
            </p>
            <p>
              <strong>Số lượng:</strong> {selectedProduct.quantity}
            </p>
            <p>
              <strong>Ngày sản xuất:</strong> {selectedProduct.mfg}
            </p>
            <p>
              <strong>Ngày hết hạn:</strong> {selectedProduct.exp}
            </p>
            <p>
              <strong>Trọng lượng:</strong> {selectedProduct.netWeight}g
            </p>
            <p>
              <strong>Thương hiệu:</strong>{" "}
              {getDisplayName(selectedProduct.brandId, brands)}
            </p>
            <p>
              <strong>Loại da:</strong>{" "}
              {getDisplayName(selectedProduct.skinTypeId, skinTypes)}
            </p>
            <p>
              <strong>Loại sản phẩm:</strong>{" "}
              {getDisplayName(selectedProduct.categoryId, categories)}
            </p>
            <p>
              <strong>Giảm giá:</strong>{" "}
              {getDisplayName(selectedProduct.discountId, discounts)}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ListProduct;
