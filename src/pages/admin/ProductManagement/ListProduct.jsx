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
import { name } from "@cloudinary/url-gen/actions/namedTransformation";
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
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div
          dangerouslySetInnerHTML={{
            __html:
              text && typeof text === "string"
                ? text.length > 50
                  ? text.substring(0, 50) + "..."
                  : text
                : "",
          }}
        />
      ),
    },
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
            color="orange"
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
            title="Bạn có chắc muốn xóa sản phẩm này không?"
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

  const getDisplayName = (id, list) => {
    // Nếu id đã là name, trả về trực tiếp
    if (list.some((item) => item.name === id)) {
      return item.name;
    }

    // Nếu id là số, tìm kiếm trong danh sách
    return list.find((item) => String(item.id) === String(id))?.name || id;
  };

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

  // const fetchData = async () => {
  //     try {
  //         const [productsRes, brandsRes, categoriesRes, discountsRes, skinTypesRes] = await Promise.all([
  //             api.get("/products"),
  //             api.get("/brands/list-name-brands"),
  //             api.get("/categories/list-name-categories"),
  //             api.get("/discounts/list-name-discounts"),
  //             api.get("/skin-types/list-name-skin-types"),
  //         ]);

  //         console.log("Products:", productsRes.data);
  //         console.log("Brands:", brandsRes.data);
  //         console.log("Categories:", categoriesRes.data);
  //         console.log("Discounts:", discountsRes.data);
  //         console.log("SkinTypes:", skinTypesRes.data);

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

  useEffect(() => {
    if (editingProduct) {
      form.setFieldsValue({
        id: editingProduct.id,
        name: editingProduct.name,
        price: editingProduct.price,
        quantity: editingProduct.quantity,
        description: editingProduct.description,
        imageUrl: editingProduct.imageUrl,
        brandId: editingProduct.brandId,
        categoryId: editingProduct.categoryId,
        discountId: editingProduct.discountId,
        skinTypeId: editingProduct.skinTypeId,
        brandName: getDisplayName(editingProduct.brandId, brands),
        categoryName: getDisplayName(editingProduct.categoryId, categories),
        discountName: getDisplayName(editingProduct.discountId, discounts),
        skinTypeName: getDisplayName(editingProduct.skinTypeId, skinTypes),
      });
    }
  }, [editingProduct]);

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

  const handleViewDetails = (productList) => {
    setSelectedProduct(productList);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedProduct(null);
  };
  const getIdByName = (name, type) => {
    const map = {
      brands,
      categories,
      discounts,
      skinTypes,
    };
    return map[type]?.find((item) => item.name === name)?.id || null;
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

  //   const handleSubmitForm = async (values) => {
  //     try {
  //       const productData = {
  //         ...values,
  //         brandId: selectedIds.brands,
  //         skinTypeId: selectedIds["skin-types"],
  //         categoryId: selectedIds.categories,
  //         discountId: selectedIds.discounts,
  //       };

  //       if (editingProduct) {
  //         await api.put(`/products/${editingProduct.productId}`, productData);
  //         toast.success("Cập nhật sản phẩm thành công!");
  //       } else {
  //         await api.post("/products", productData);
  //         toast.success("Thêm sản phẩm thành công!");
  //       }

  //       handleCloseModal();
  //       await fetchData(); // Gọi lại danh sách để cập nhật tên
  //     } catch (error) {
  //       console.error(
  //         "Lỗi khi gửi request:",
  //         error.response?.data || error.message
  //       );
  //       toast.error("Xử lý sản phẩm không thành công!");
  //     }
  //   };

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
    if (!product) {
      console.error("Product is undefined!");
      return;
    }

    console.log("Product being edited:", product); // Debug dữ liệu sản phẩm

    // Cập nhật sản phẩm đang chỉnh sửa
    setEditingProduct(product);

    // Đảm bảo rằng tất cả các trường được đặt đúng giá trị
    form.setFieldsValue({
      id: product.id, // Nếu bạn cần lưu ID để cập nhật
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      imageUrl: product.imageUrl,
      brandId: product.brandId,
      categoryId: product.categoryId,
      discountId: product.discountId,
      skinTypeId: product.skinTypeId,
      brandName: getDisplayName(product.brandId, brands),
      categoryName: getDisplayName(product.categoryId, categories),
      discountName: getDisplayName(product.discountId, discounts),
      skinTypeName: getDisplayName(product.skinTypeId, skinTypes),
    });

    // Mở modal chỉnh sửa
    setModalOpen(true);
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

  // // them moi thu
  // const isEditing = (record) => record.key === editingKey;

  // const edit = (record) => {
  //   setEditingKey(record.key);
  //   setEditedRecord({ ...record });
  // };

  // const save = () => {
  //   setProducts((prev) =>
  //     prev.map((item) => (item.key === editingKey ? { ...editedRecord } : item))
  //   );
  //   setEditingKey(null);
  // };

  // const cancel = () => {
  //   setEditingKey(null);
  // };

  // const handleInputChange = (e, field) => {
  //   setEditedRecord({ ...editedRecord, [field]: e.target.value });
  // };

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

      {/* Modal thêm/sửa sản phẩm */}
      <Modal
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitForm}>
          <Form.Item
            label="Tên sản phẩm"
            name="productName"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <MyEditor />
          </Form.Item>
          <Form.Item label="Thành phần" name="ingredients">
            <Input />
          </Form.Item>
          <Form.Item
            label="Giá gốc"
            name="unitPrice"
            rules={[{ required: true, message: "Vui lòng nhập giá gốc!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Giá giảm" name="discountPrice">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Ngày sản xuất" name="mfg">
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày hết hạn" name="exp">
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Trọng lượng" name="netWeight">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Thương hiệu" name="brandName">
            <Select>
              {brands.map((brand) => (
                <Select.Option key={brand.id} value={brand.name}>
                  {brand.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Loại da" name="skinTypeName">
            <Select>
              {skinTypes.map((type) => (
                <Select.Option key={type.id} value={type.name}>
                  {type.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Loại sản phẩm" name="categoryName">
            <Select>
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.name}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Giảm giá" name="discountName">
            <Select>
              {discounts.map((discount) => (
                <Select.Option key={discount.id} value={discount.name}>
                  {discount.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
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
