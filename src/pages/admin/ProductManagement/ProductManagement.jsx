import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  Popconfirm,
  DatePicker,
  Col,
  Row,
  Tag,
  Upload,
  Image,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Select } from "antd";
import api from "../../../config/api";
import dayjs from "dayjs";
import MyEditor from "../../../component/TinyMCE/MyEditor";

const ProductManagement = () => {
  const { Option } = Select;
  const [ProductList, setProductList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [brands, setBrands] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // State for image files
  const [imagePreviews, setImagePreviews] = useState([]); // State for image previews

  const statusMapping = {
    1: { text: "CÓ SẴN", color: "green" },
    2: { text: "HẾT HÀNG", color: "red" },
    3: { text: "NGỪNG", color: "gray" },
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Giá gốc",
      dataIndex: "unitPrice",
      key: "unitPrice",
    },
    {
      title: "Giá giảm",
      dataIndex: "discountPrice",
      key: "discountPrice",
    },
    // {
    //   title: "Mô tả",
    //   dataIndex: "description",
    //   key: "description",
    //   render: (text) => (
    //     <div
    //       dangerouslySetInnerHTML={{
    //         __html:
    //           text && typeof text === "string"
    //             ? text.length > 50
    //               ? text.substring(0, 50) + "..."
    //               : text
    //             : "",
    //       }}
    //     />
    //   ),
    // },
    // {
    //   title: "Hướng dẫn sử dụng",
    //   dataIndex: "usageInstruction",
    //   key: "usageInstruction",
    //   render: (text) => (
    //     <div
    //       dangerouslySetInnerHTML={{
    //         __html:
    //           text && typeof text === "string"
    //             ? text.length > 50
    //               ? text.substring(0, 50) + "..."
    //               : text
    //             : "",
    //       }}
    //     />
    //   ),
    // },
    // {
    //   title: "Thành phần",
    //   dataIndex: "ingredients",
    //   key: "ingredients",
    // },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    // {
    //   title: "Ngày tạo",
    //   dataIndex: "createdTime",
    //   key: "createdTime",
    //   render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : ""),
    // },
    // {
    //   title: "Ngày xóa",
    //   dataIndex: "deletedTime",
    //   key: "deletedTime",
    //   render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : ""),
    // },
    // {
    //   title: "Ngày sản xuất",
    //   dataIndex: "mfg",
    //   key: "mfg",
    //   render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : ""),
    // },
    // {
    //   title: "Hạn sử dụng",
    //   dataIndex: "exp",
    //   key: "exp",
    //   render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : ""),
    // },
    // {
    //   title: "Khối lượng (g)",
    //   dataIndex: "netWeight",
    //   key: "netWeight",
    // },
    {
      title: "Giảm giá",
      dataIndex: "discountId",
      key: "discountId",
      render: (discountId) => {
        const discount = discounts.find((d) => d.discountId === discountId);
        return discount ? discount.discountName : "N/A";
      },
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId) => {
        const category = categories.find((c) => c.categoryId === categoryId);
        return category ? category.categoryName : "N/A";
      },
    },
    {
      title: "Thương hiệu",
      dataIndex: "brandId",
      key: "brandId",
      render: (brandId) => {
        const brand = brands.find((b) => b.brandId === brandId);
        return brand ? brand.brandName : "N/A";
      },
    },
    {
      title: "Loại da",
      dataIndex: "skinTypeId",
      key: "skinTypeId",
      render: (skinTypeId) => {
        const skinType = skinTypes.find((s) => s.skinTypeId === skinTypeId);
        return skinType ? skinType.skinName : "N/A";
      },
    },
    {
      title: "Ảnh",
      dataIndex: "productImages",
      key: "productImages",
      render: (images) => (
        <div>
          {images &&
            images.map((image, index) => (
              <Image
                key={index}
                src={image.imageURL}
                alt="Product"
                style={{ width: 50, height: 50, marginRight: 8 }}
              />
            ))}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusInfo = statusMapping[status] || {
          text: "KHÔNG BIẾT",
          color: "default",
        };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: "Nút điều khiển",
      key: "actions",
      render: (text, record) => (
        <div className="button">
          <Button
            color="orange"
            variant="filled"
            onClick={() => handleEditProduct(record)}
            style={{ marginRight: 8, border: "2px solid " }}
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
            title="Bạn có muốn xóa sản phẩm này không?"
            onConfirm={() => handleDeleteProduct(record.productId)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              color="red"
              variant="filled"
              style={{ marginRight: 8, border: "2px solid " }}
            >
              <i className="fa-solid fa-trash"></i> Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const brandsResponse = await api.get("/brands");
        setBrands(brandsResponse.data);

        const skinTypesResponse = await api.get("/skin-types");
        setSkinTypes(skinTypesResponse.data);

        const categoriesResponse = await api.get("/categories");
        setCategories(categoriesResponse.data);

        const discountsResponse = await api.get("/discounts");
        setDiscounts(discountsResponse.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await api.get("/products");
      setProductList(response.data);
    } catch (error) {
      console.error("Error fetching Products:", error);
      toast.error("Không thể tải danh sách sản phẩm!");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    form.resetFields();
    setEditingProduct(null);
    setImageFiles([]); // Reset image files
    setImagePreviews([]); // Reset image previews
  };

  const handleViewDetails = (Product) => {
    setSelectedProduct(Product);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedProduct(null);
  };

  // const handleSubmitForm = async (values) => {
  //     const formData = new FormData();

  //     // Append product data as JSON
  //     formData.append("productDTO", new Blob([JSON.stringify(values)], { type: "application/json" }));

  //     // Append image files
  //     imageFiles.forEach(file => {
  //         formData.append("images", file);
  //     });

  //     try {
  //         if (editingProduct) {
  //             // Update existing product
  //             await api.put(`/products/${editingProduct.productId}`, formData, {
  //                 headers: {
  //                     'Content-Type': 'multipart/form-data',
  //                 },
  //             });
  //             toast.success("Đã cập nhật sản phẩm thành công!");
  //         } else {
  //             // Create new product
  //             await api.post('/products', formData, {
  //                 headers: {
  //                     'Content-Type': 'multipart/form-data',
  //                 },
  //             });
  //             toast.success("Đã thêm sản phẩm mới thành công!");
  //         }
  //         fetchProduct();
  //         handleCloseModal();
  //     } catch (error) {
  //         console.error("Error submitting form:", error.response?.data?.message || error.message);
  //         toast.error("Lỗi khi thêm/cập nhật sản phẩm!");
  //     }
  // };
  const handleSubmitForm = async (values) => {
    const formData = new FormData();

    // Append product data as JSON
    formData.append(
      "products",
      new Blob([JSON.stringify(values)], { type: "application/json" })
    );

    // Append image files
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      if (editingProduct) {
        // Update existing product
        await api.put(`/products/${editingProduct.productId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Đã sửa sản phẩm thành công!");
      } else {
        // Create new product
        await api.post("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Đã thêm sản phẩm mới thành công!");
      }
      fetchProduct();
      handleCloseModal();
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data?.message || error.message
      );

      // Customized error messages
      if (editingProduct) {
        // Error while editing
        toast.error("Sửa sản phẩm này không thành công!");
      } else {
        // Error while adding
        toast.error("Thêm sản phẩm này không thành công!");
      }
    }
  };

  const handleEditProduct = (Product) => {
    setEditingProduct(Product);
    form.setFieldsValue({
      ...Product,
      createdTime: Product.createdTime ? dayjs(Product.createdTime) : null,
      deletedTime: Product.deletedTime ? dayjs(Product.deletedTime) : null,
      mfg: Product.mfg ? dayjs(Product.mfg) : null,
      exp: Product.exp ? dayjs(Product.exp) : null,
    });
    setImagePreviews(Product.productImages.map((img) => img.imageURL)); // Set image previews
    handleOpenModal();
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success("Đã xóa sản phẩm thành công!");
      fetchProduct();
    } catch (error) {
      toast.error("Xóa sản phẩm không thành công!");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Quản lý sản phẩm</h1>
      <Button type="primary" onClick={handleOpenModal}>
        <i className="fa-solid fa-plus"></i>
        Thêm sản phẩm mới
      </Button>
      <Table
        dataSource={ProductList}
        columns={columns}
        rowKey="productId"
        style={{ marginTop: 16 }}
      />
      <Modal
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}
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
                label="Giá gốc"
                name="unitPrice"
                rules={[
                  { required: true, message: "Giá gốc không được để trống!" },
                ]}
              >
                <Input type="number" />
              </Form.Item>
              {/* <Form.Item
                                label="Giá giảm"
                                name="discountPrice"
                                rules={[{ required: true, message: "Giá giảm không được để trống!" }]}
                            >
                                <Input type="number" />
                            </Form.Item> */}
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
                label="Số lượng"
                name="quantity"
                rules={[
                  { required: true, message: "Số lượng không được để trống!" },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            {/* Cột 2 */}
            <Col span={12}>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="Ngày tạo"
                    name="createdTime"
                    rules={[
                      {
                        required: false,
                        message: "Ngày tạo không được để trống!",
                      },
                    ]}
                  >
                    <DatePicker format="YYYY-MM-DD" />
                  </Form.Item>
                  <Form.Item
                    label="Ngày xóa"
                    name="deletedTime"
                    rules={[
                      {
                        required: false,
                        message: "Ngày xóa không được để trống!",
                      },
                    ]}
                  >
                    <DatePicker format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Ngày sản xuất"
                    name="mfg"
                    rules={[
                      {
                        required: false,
                        message: "Ngày sản xuất không được để trống!",
                      },
                    ]}
                  >
                    <DatePicker format="YYYY-MM-DD" />
                  </Form.Item>
                  <Form.Item
                    label="Hạn sử dụng"
                    name="exp"
                    rules={[
                      {
                        required: false,
                        message: "Hạn sử dụng không được để trống!",
                      },
                    ]}
                  >
                    <DatePicker format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
              </Row>
              {editingProduct && (
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[
                    {
                      required: false,
                      message: "Trạng thái không được để trống!",
                    },
                  ]}
                >
                  <Select>
                    <Option value={1}>CÓ SẴN</Option>
                    <Option value={2}>HẾT HÀNG</Option>
                    <Option value={3}>NGỪNG</Option>
                  </Select>
                </Form.Item>
              )}
              <Form.Item
                label="Khối lượng (g)"
                name="netWeight"
                rules={[
                  {
                    required: true,
                    message: "Khối lượng không được để trống!",
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                label="Thương hiệu"
                name="brandId"
                rules={[
                  {
                    required: true,
                    message: "Thương hiệu không được để trống!",
                  },
                ]}
              >
                <Select>
                  {brands.map((brand) => (
                    <Select.Option key={brand.brandId} value={brand.brandId}>
                      {brand.brandName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Loại da"
                name="skinTypeId"
                rules={[
                  { required: true, message: "Loại da không được để trống!" },
                ]}
              >
                <Select>
                  {skinTypes.map((skinType) => (
                    <Select.Option
                      key={skinType.skinTypeId}
                      value={skinType.skinTypeId}
                    >
                      {skinType.skinName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Danh mục"
                name="categoryId"
                rules={[
                  { required: true, message: "Danh mục không được để trống!" },
                ]}
              >
                <Select>
                  {categories.map((category) => (
                    <Select.Option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.categoryName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Giảm giá"
                name="discountId"
                rules={[
                  { required: true, message: "Giảm giá không được để trống!" },
                ]}
              >
                <Select>
                  {discounts.map((discount) => (
                    <Select.Option
                      key={discount.discountId}
                      value={discount.discountId}
                    >
                      {discount.discountName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Mô tả không được để trống!" }]}
          >
            <MyEditor
              value={form.getFieldValue("description") || ""}
              onChange={(value) => form.setFieldsValue({ description: value })}
            />
          </Form.Item>

          <Form.Item
            label="Hướng dẫn sử dụng"
            name="usageInstruction"
            rules={[
              {
                required: true,
                message: "Hướng dẫn sử dụng không được để trống!",
              },
            ]}
          >
            <MyEditor
              value={form.getFieldValue("usageInstruction") || ""}
              onChange={(value) =>
                form.setFieldsValue({ usageInstruction: value })
              }
            />
          </Form.Item>
          <Form.Item label="Tải hình ảnh lên">
            <Upload
              multiple
              beforeUpload={(file) => {
                setImageFiles((prev) => [...prev, file]);
                setImagePreviews((prev) => [
                  ...prev,
                  URL.createObjectURL(file),
                ]); // Create temporary URL for preview
                return false; // Prevent automatic upload
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {imagePreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt="Preview"
                style={{ width: 100, marginTop: 8, marginRight: 8 }}
              />
            ))}
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal Chi Tiết */}
      <Modal
        title={<h2>Chi tiết sản phẩm</h2>}
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={800}
      >
        {selectedProduct && (
          <div>
            <p>
              <strong>ID: </strong> {selectedProduct.productId}
            </p>
            <p>
              <strong>Tên sản phẩm: </strong> {selectedProduct.productName}
            </p>
            <p>
              <strong>Giá gốc: </strong> {selectedProduct.unitPrice}
            </p>
            <p>
              <strong>Giá giảm: </strong> {selectedProduct.discountPrice}
            </p>
            <p>
              <strong>Mô tả: </strong>
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
            />
            <p>
              <strong>Hướng dẫn sử dụng: </strong>
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: selectedProduct.usageInstruction }}
            />
            <p>
              <strong>Thành phần: </strong> {selectedProduct.ingredients}
            </p>
            <p>
              <strong>Số lượng: </strong> {selectedProduct.quantity}
            </p>
            <p>
              <strong>Ngày tạo: </strong>{" "}
              {selectedProduct.createdTime
                ? dayjs(selectedProduct.createdTime).format("YYYY-MM-DD")
                : "N/A"}
            </p>
            <p>
              <strong>Ngày xóa: </strong>{" "}
              {selectedProduct.deletedTime
                ? dayjs(selectedProduct.deletedTime).format("YYYY-MM-DD")
                : "N/A"}
            </p>
            <p>
              <strong>Ngày sản xuất: </strong>{" "}
              {selectedProduct.mfg
                ? dayjs(selectedProduct.mfg).format("YYYY-MM-DD")
                : "N/A"}
            </p>
            <p>
              <strong>Hạn sử dụng: </strong>{" "}
              {selectedProduct.exp
                ? dayjs(selectedProduct.exp).format("YYYY-MM-DD")
                : "N/A"}
            </p>
            <p>
              <strong>Khối lượng:</strong> {selectedProduct.netWeight} {"(g)"}
            </p>
            <p>
              <strong>Giảm giá: </strong>
              {discounts.find(
                (d) => d.discountId === selectedProduct.discountId
              )?.discountName || "N/A"}
            </p>
            <p>
              <strong>Loại sản phẩm: </strong>
              {categories.find(
                (c) => c.categoryId === selectedProduct.categoryId
              )?.categoryName || "N/A"}
            </p>
            <p>
              <strong>Thương hiệu: </strong>
              {brands.find((b) => b.brandId === selectedProduct.brandId)
                ?.brandName || "N/A"}
            </p>
            <p>
              <strong>Loại da: </strong>
              {skinTypes.find(
                (s) => s.skinTypeId === selectedProduct.skinTypeId
              )?.skinName || "N/A"}
            </p>
            <p>
              <strong>Ảnh: </strong>
              {selectedProduct.productImages.map((image, index) => (
                <img
                  key={index}
                  src={image.imageURL}
                  alt="Skin Type"
                  style={{ width: 100, marginRight: 8 }}
                />
              ))}
            </p>
            <p>
              <strong>Trạng Thái:</strong>
              {selectedProduct.status !== undefined ? (
                <Tag color={statusMapping[selectedProduct.status]?.color}>
                  {statusMapping[selectedProduct.status]?.text}
                </Tag>
              ) : (
                "Không xác định"
              )}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductManagement;

//=========================================================================================================

// import { Button, Form, Input, Modal, Table, Popconfirm, DatePicker, Col, Row, Tag } from "antd";
// import { useForm } from "antd/es/form/Form";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import { Select } from "antd";
// import api from "../../../config/api";
// import dayjs from "dayjs";
// import MyEditor from "../../../component/TinyMCE/MyEditor";

// const ProductManagement = () => {
//     const { Option } = Select;
//     const [ProductList, setProductList] = useState([]);
//     const [isModalOpen, setModalOpen] = useState(false);
//     const [form] = useForm();
//     const [editingProduct, setEditingProduct] = useState(null);
//     const [isDetailModalOpen, setDetailModalOpen] = useState(false);
//     const [selectedProduct, setSelectedProduct] = useState(null);

//     const [brands, setBrands] = useState([]);
//     const [skinTypes, setSkinTypes] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [discounts, setDiscounts] = useState([]);

//     const statusMapping = {

//         1: { text: "CÓ SẴN", color: "green" },
//         2: { text: "HẾT HÀNG", color: "red" },
//         3: { text: "NGỪNG", color: "gray" }
//     };

//     const columns = [
//         {
//             title: 'ID sản phẩm',
//             dataIndex: 'productId',
//             key: 'productId',
//         },
//         {
//             title: 'Tên sản phẩm',
//             dataIndex: 'productName',
//             key: 'productName',
//         },
//         {
//             title: 'Giá gốc',
//             dataIndex: 'unitPrice',
//             key: 'unitPrice',
//         },
//         {
//             title: 'Giá giảm',
//             dataIndex: 'discountPrice',
//             key: 'discountPrice',
//         },
//         {
//             title: 'Mô tả',
//             dataIndex: 'description',
//             key: 'description',
//             render: (text) => (
//                 <div dangerouslySetInnerHTML={{ __html: text && typeof text === "string" ? (text.length > 50 ? text.substring(0, 50) + "..." : text) : "" }} />
//             ),
//         },

//         {
//             title: 'Thành phần',
//             dataIndex: 'ingredients',
//             key: 'ingredients',
//         },

//         {
//             title: 'Số lượng',
//             dataIndex: 'quantity',
//             key: 'quantity',
//         },

//         {
//             title: 'Ngày tạo',
//             dataIndex: 'createdTime',
//             key: 'createdTime',
//             render: (date) => date ? dayjs(date).format("YYYY-MM-DD") : "",

//         },
//         {
//             title: 'Ngày xóa',
//             dataIndex: 'deletedTime',
//             key: 'deletedTime',
//             render: (date) => date ? dayjs(date).format("YYYY-MM-DD") : "",
//         },

//         {
//             title: 'Ngày sản xuất',
//             dataIndex: 'mfg',
//             key: 'mfg',
//             render: (date) => date ? dayjs(date).format("YYYY-MM-DD") : "",
//         },
//         {
//             title: 'Hạn sử dụng',
//             dataIndex: 'exp',
//             key: 'exp',
//             render: (date) => date ? dayjs(date).format("YYYY-MM-DD") : "",
//         },
//         {
//             title: 'Khối lượng (g)',
//             dataIndex: 'netWeight',
//             key: 'netWeight',
//         },

//         {
//             title: 'Giảm giá',
//             dataIndex: 'discountId',
//             key: 'discountId',
//             render: (discountId) => {
//                 const discount = discounts.find(d => d.discountId === discountId);
//                 return discount ? discount.discountName : "N/A";
//             },
//         },
//         {
//             title: 'Loại sản phẩm',
//             dataIndex: 'categoryId',
//             key: 'categoryId',
//             render: (categoryId) => {
//                 const category = categories.find(c => c.categoryId === categoryId);
//                 return category ? category.categoryName : "N/A";
//             },
//         },
//         {
//             title: 'Thương hiệu',
//             dataIndex: 'brandId',
//             key: 'brandId',
//             render: (brandId) => {
//                 const brand = brands.find(b => b.brandId === brandId);
//                 return brand ? brand.brandName : "N/A";
//             },
//         },
//         {
//             title: 'Loại da',
//             dataIndex: 'skinTypeId',
//             key: 'skinTypeId',
//             render: (skinTypeId) => {
//                 const skinType = skinTypes.find(s => s.skinTypeId === skinTypeId);
//                 return skinType ? skinType.skinName : "N/A";
//             },
//         },

//         {
//             title: 'Trạng thái',
//             dataIndex: 'status',
//             key: 'status',
//             render: (status) => {
//                 const statusInfo = statusMapping[status] || { text: "KHÔNG BIẾT", color: "default" };
//                 return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
//             }
//         },

//         {
//             title: 'Nút điều khiển',
//             key: 'actions',
//             render: (text, record) => (
//                 <div className="button">
//                     <Button color="orange" variant="filled" onClick={() => handleEditProduct(record)} style={{ marginRight: 8, border: "2px solid " }}>
//                         <i className="fa-solid fa-pen-to-square"></i> Sửa
//                     </Button>
//                     <Button color="primary" variant="filled" type="default" onClick={() => handleViewDetails(record)} style={{ marginRight: 8, border: "2px solid " }}>
//                         <i className="fa-solid fa-eye"></i> Chi tiết
//                     </Button>
//                     <Popconfirm
//                         title="Bạn có muốn xóa sản phẩm này không?"
//                         onConfirm={() => handleDeleteProduct(record.productId)}
//                         okText="Có"
//                         cancelText="Không"
//                     >
//                         <Button color="red" variant="filled" style={{ marginRight: 8, border: "2px solid " }} >
//                             <i className="fa-solid fa-trash"></i> Xóa
//                         </Button>
//                     </Popconfirm>
//                 </div>
//             ),
//         },
//     ];

//     useEffect(() => {
//         const fetchOptions = async () => {
//             try {
//                 const brandsResponse = await api.get('/brands');
//                 setBrands(brandsResponse.data);

//                 const skinTypesResponse = await api.get('/skin-types');
//                 setSkinTypes(skinTypesResponse.data);

//                 const categoriesResponse = await api.get('/categories');
//                 setCategories(categoriesResponse.data);

//                 const discountsResponse = await api.get('/discounts');
//                 setDiscounts(discountsResponse.data);
//             } catch (error) {
//                 console.error("Error fetching options:", error);
//             }
//         };

//         fetchOptions();
//     }, []);

//     const fetchIdByName = (value, type) => {
//         if (type === "brands") {
//             form.setFieldsValue({ brandId: value });
//         }
//         if (type === "skin-types") {
//             form.setFieldsValue({ skinTypeId: value });
//         }
//         if (type === "categories") {
//             form.setFieldsValue({ categoryId: value });
//         }
//         if (type === "discounts") {
//             form.setFieldsValue({ discountId: value });
//         }
//     };

//     const fetchProduct = async () => {
//         try {
//             const response = await api.get('/products');
//             setProductList(response.data);
//         } catch (error) {
//             console.error("Error fetching Products:", error);
//             toast.error("Không thể tải danh sách sản phẩm!");
//         }
//     };

//     useEffect(() => {
//         fetchProduct();
//     }, []);

//     const handleOpenModal = () => {
//         setModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setModalOpen(false);
//         form.resetFields();
//         setEditingProduct(null);
//     };

//     const handleViewDetails = (Product) => {
//         setSelectedProduct(Product);
//         setDetailModalOpen(true);
//     };

//     const handleCloseDetailModal = () => {
//         setDetailModalOpen(false);
//         setSelectedProduct(null);
//     };

//     const handleSubmitForm = async (values) => {
//         const formattedValues = {
//             ...values,
//             createdTime: values.createdTime?.format('YYYY-MM-DD'),
//             deletedTime: values.deletedTime?.format('YYYY-MM-DD'),
//             mfg: values.mfg?.format('YYYY-MM-DD'),
//             exp: values.exp?.format('YYYY-MM-DD'),
//         };

//         if (editingProduct) {
//             formattedValues.productId = editingProduct.productId;
//             try {
//                 await api.put(`/products/${editingProduct.productId}`, formattedValues);
//                 toast.success("Đã cập nhật sản phẩm thành công!");
//                 fetchProduct();
//                 handleCloseModal();
//             } catch (error) {
//                 toast.error("Cập nhật sản phẩm không thành công!");
//             }
//         } else {
//             try {
//                 await api.post('/products', formattedValues);
//                 toast.success("Đã thêm sản phẩm mới thành công!");
//                 fetchProduct();
//                 handleCloseModal();
//             } catch (error) {
//                 toast.error("Thêm sản phẩm mới không thành công!");
//             }
//         }
//     };

//     const handleEditProduct = (Product) => {
//         setEditingProduct(Product);
//         form.setFieldsValue({
//             ...Product,
//             createdTime: Product.createdTime ? dayjs(Product.createdTime) : null,
//             deletedTime: Product.deletedTime ? dayjs(Product.deletedTime) : null,
//             mfg: Product.mfg ? dayjs(Product.mfg) : null,
//             exp: Product.exp ? dayjs(Product.exp) : null,
//         });
//         handleOpenModal();
//     };

//     const handleDeleteProduct = async (id) => {
//         try {
//             await api.delete(`/products/${id}`);
//             toast.success("Đã xóa sản phẩm thành công!");
//             fetchProduct();
//         } catch (error) {
//             toast.error("Xóa sản phẩm không thành công!");
//         }
//     };

//     return (
//         <div >
//             <ToastContainer />
//             <h1>Quản lý sản phẩm</h1>
//             <Button type="primary" onClick={handleOpenModal}>
//                 <i className="fa-solid fa-plus"></i>
//                 Thêm sản phẩm mới
//             </Button>
//             <Table dataSource={ProductList} columns={columns} rowKey="productId" style={{ marginTop: 16 }} />
//             <Modal
//                 title={editingProduct ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}
//                 open={isModalOpen}
//                 onCancel={handleCloseModal}
//                 onOk={() => form.submit()}
//                 okText={editingProduct ? "Lưu thay đổi" : "Tạo"}
//                 cancelText="Hủy"
//                 width={800}
//             >
//                 <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm} layout="vertical">

//                     <Row gutter={16}>
//                         {/* Cột 1 */}
//                         <Col span={12}>
//                             <Form.Item
//                                 label="Tên sản phẩm"
//                                 name="productName"
//                                 rules={[{ required: true, message: "Tên sản phẩm không được để trống!" }]}
//                             >
//                                 <Input />
//                             </Form.Item>
//                             <Form.Item
//                                 label="Giá gốc"
//                                 name="unitPrice"
//                                 rules={[{ required: true, message: "Giá gốc không được để trống!" }]}
//                             >
//                                 <Input type="number" />
//                             </Form.Item>
//                             <Form.Item
//                                 label="Giá giảm"
//                                 name="discountPrice"
//                                 rules={[
//                                     { required: true, message: "Giá giảm không được để trống!" },
//                                     // { type: "number", min: 0, max: 100, message: "Giá trị phải từ 0 đến 100!" },
//                                 ]}
//                             >
//                                 <Input type="number" />
//                             </Form.Item>

//                             <Form.Item
//                                 label="Thành phần"
//                                 name="ingredients"
//                                 rules={[{ required: true, message: "Thành phần không được để trống!" }]}
//                             >
//                                 <Input />
//                             </Form.Item>

//                             <Form.Item
//                                 label="Số lượng"
//                                 name="quantity"
//                                 rules={[
//                                     { required: true, message: "Số lượng không được để trống!" },

//                                 ]}
//                             >
//                                 <Input type="number" />
//                             </Form.Item>

//                         </Col>

//                         {/* Cột 2 */}
//                         <Col span={12}>
//                             <Row gutter={24}>
//                                 <Col span={12}>

//                                     <Form.Item
//                                         label="Ngày tạo"
//                                         name="createdTime"
//                                         rules={[{ required: false, message: "Ngày tạo không được để trống!" }]}
//                                     >
//                                         <DatePicker value={dayjs()} format="YYYY-MM-DD" />
//                                     </Form.Item>
//                                     <Form.Item
//                                         label="Ngày xóa"
//                                         name="deletedTime"
//                                         rules={[{ required: false, message: "Ngày xóa không được để trống!" }]}
//                                     >
//                                         <DatePicker value={dayjs()} format="YYYY-MM-DD" />
//                                     </Form.Item>

//                                 </Col>

//                                 <Col span={12}>
//                                     <Form.Item
//                                         label="Ngày sản xuất"
//                                         name="mfg"
//                                         rules={[{ required: false, message: "Ngày sản xuất không được để trống!" }]}
//                                     >
//                                         <DatePicker value={dayjs()} format="YYYY-MM-DD" />
//                                     </Form.Item>
//                                     <Form.Item
//                                         label="Hạn sử dụng"
//                                         name="exp"
//                                         rules={[{ required: false, message: "Hạn sử dụng không được để trống!" }]}
//                                     >
//                                         <DatePicker value={dayjs()} format="YYYY-MM-DD" />
//                                     </Form.Item>

//                                 </Col>

//                             </Row>
//                             {editingProduct && (
//                                 <Form.Item
//                                     label="Trạng thái"
//                                     name="status"
//                                     rules={[{ required: false, message: "Trạng thái không được để trống!" }]}
//                                 >
//                                     <Select>
//                                         <Option value={1}>CÓ SẴN</Option>
//                                         <Option value={2}>HẾT HÀNG</Option>
//                                         <Option value={3}>NGỪNG</Option>
//                                     </Select>
//                                 </Form.Item>
//                             )}

//                             <Form.Item
//                                 label="Khối lượng (g)"
//                                 name="netWeight"
//                                 rules={[
//                                     { required: true, message: "Khối lượng không được để trống!" },

//                                 ]}
//                             >
//                                 <Input type="number" />
//                             </Form.Item>
//                             <Form.Item
//                                 label="Thương hiệu"
//                                 name="brandId"
//                                 rules={[
//                                     {
//                                         required: true,
//                                         message: "Thương hiệu không được để trống!",
//                                     },
//                                 ]}
//                             >
//                                 <Select onChange={(value) => fetchIdByName(value, "brands")}>
//                                     {brands.map((brand) => (
//                                         <Select.Option key={brand.brandId} value={brand.brandId}>
//                                             {brand.brandName}
//                                         </Select.Option>
//                                     ))}
//                                 </Select>
//                             </Form.Item>

//                             <Form.Item
//                                 label="Loại da"
//                                 name="skinTypeId"
//                                 rules={[
//                                     { required: true, message: "Loại da không được để trống!" },
//                                 ]}
//                             >
//                                 <Select onChange={(value) => fetchIdByName(value, "skin-types")}>
//                                     {skinTypes.map((skinType) => (
//                                         <Select.Option key={skinType.skinTypeId} value={skinType.skinTypeId}>
//                                             {skinType.skinName}
//                                         </Select.Option>
//                                     ))}
//                                 </Select>
//                             </Form.Item>

//                             <Form.Item
//                                 label="Danh mục"
//                                 name="categoryId"
//                                 rules={[
//                                     { required: true, message: "Danh mục không được để trống!" },
//                                 ]}
//                             >
//                                 <Select onChange={(value) => fetchIdByName(value, "categories")}>
//                                     {categories.map((category) => (
//                                         <Select.Option key={category.categoryId} value={category.categoryId}>
//                                             {category.categoryName}
//                                         </Select.Option>
//                                     ))}
//                                 </Select>
//                             </Form.Item>

//                             <Form.Item
//                                 label="Giảm giá"
//                                 name="discountId"
//                                 rules={[
//                                     { required: true, message: "Giảm giá không được để trống!" },
//                                 ]}
//                             >
//                                 <Select onChange={(value) => fetchIdByName(value, "discounts")}>
//                                     {discounts.map((discount) => (
//                                         <Select.Option key={discount.discountId} value={discount.discountId}>
//                                             {discount.discountName}
//                                         </Select.Option>
//                                     ))}
//                                 </Select>
//                             </Form.Item>
//                         </Col>
//                     </Row>

//                     <Form.Item
//                         label="Mô tả"
//                         name="description"
//                         rules={[{ required: true, message: "Mô tả không được để trống!" }]}>
//                         <MyEditor
//                             value={form.getFieldValue("description") || ""}
//                             onChange={(value) => form.setFieldsValue({ description: value })}
//                         />
//                     </Form.Item>

//                 </Form>
//             </Modal>
//             {/* Modal Chi Tiết */}
//             <Modal
//                 title="Chi tiết sản phẩm"
//                 open={isDetailModalOpen}
//                 onCancel={handleCloseDetailModal}
//                 footer={null}
//                 width={800}
//             >
//                 {selectedProduct && (
//                     <div>
//                         <p><strong>ID: </strong> {selectedProduct.productId}</p>
//                         <p><strong>Tên sản phẩm: </strong> {selectedProduct.productName}</p>
//                         <p><strong>Giá gốc: </strong> {selectedProduct.unitPrice}</p>
//                         <p><strong>Giá giảm: </strong> {selectedProduct.discountPrice}</p>
//                         <p><strong>Mô tả: </strong></p>
//                         <div dangerouslySetInnerHTML={{ __html: selectedProduct.description }} />
//                         <p><strong>Thành phần: </strong> {selectedProduct.ingredients}</p>
//                         <p><strong>Số lượng: </strong> {selectedProduct.quantity}</p>
//                         <p><strong>Ngày tạo: </strong> {selectedProduct.createdTime ? dayjs(selectedProduct.createdTime).format("YYYY-MM-DD") : "N/A"}</p>
//                         <p><strong>Ngày xóa: </strong> {selectedProduct.deletedTime ? dayjs(selectedProduct.deletedTime).format("YYYY-MM-DD") : "N/A"}</p>
//                         <p><strong>Ngày sản xuất: </strong> {selectedProduct.mfg ? dayjs(selectedProduct.mfg).format("YYYY-MM-DD") : "N/A"}</p>
//                         <p><strong>Hạn sử dụng: </strong> {selectedProduct.exp ? dayjs(selectedProduct.exp).format("YYYY-MM-DD") : "N/A"}</p>
//                         <p><strong>Khối lượng:</strong> {selectedProduct.netWeight} {"(g)"}</p>
//                         <p><strong>Giảm giá: </strong>
//                             {discounts.find(d => d.discountId === selectedProduct.discountId)?.discountName || "N/A"}
//                         </p>
//                         <p><strong>Loại sản phẩm: </strong>
//                             {categories.find(c => c.categoryId === selectedProduct.categoryId)?.categoryName || "N/A"}
//                         </p>
//                         <p><strong>Thương hiệu: </strong>
//                             {brands.find(b => b.brandId === selectedProduct.brandId)?.brandName || "N/A"}
//                         </p>
//                         <p><strong>Loại da: </strong>
//                             {skinTypes.find(s => s.skinTypeId === selectedProduct.skinTypeId)?.skinName || "N/A"}
//                         </p>
//                         <p><strong>Trạng Thái:</strong>
//                             {selectedProduct.status !== undefined ? (
//                                 <Tag color={statusMapping[selectedProduct.status]?.color}>
//                                     {statusMapping[selectedProduct.status]?.text}
//                                 </Tag>
//                             ) : "Không xác định"}
//                         </p>
//                     </div>
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default ProductManagement;
