import { Button, Form, Input, Modal, Table, Popconfirm, Upload, Select, Col, Row, Tag, Image } from "antd";
import { useForm } from "antd/es/form/Form";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../../config/api";
import MyEditor from "../../../component/TinyMCE/MyEditor";

const SkinTypeManagement = () => {
  const [skinTypeList, setSkinTypeList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = useForm();
  const [editingSkinType, setEditingSkinType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]); // Danh sách file ảnh
  const [imagePreviews, setImagePreviews] = useState([]); // Danh sách URL ảnh tạm thời
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSkinType, setSelectedSkinType] = useState(null);
  const [searchText, setSearchText] = useState("");
  const { Option } = Select;

  const statusColors = {
    1: { text: "HOẠT ĐỘNG", color: "green" },
    2: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
    3: { text: "ĐÃ XÓA", color: "gray" },
  };

  const columns = [
    { title: "Tên loại da", dataIndex: "skinName", key: "skinName" },
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
    { title: "Điểm tối thiểu", dataIndex: "minMark", key: "minMark" },
    { title: "Điểm tối đa", dataIndex: "maxMark", key: "maxMark" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusData = statusColors[status] || {
          text: "KHÔNG BIẾT",
          color: "default",
        };
        return <Tag color={statusData.color}>{statusData.text}</Tag>;
      },
    },
    {
      title: "Ảnh",
      dataIndex: "skinTypeImages",
      key: "skinTypeImages",
      render: (images) => (
        <div>
          {images &&
            images.map((image, index) => (
              <Image
                key={index}
                src={image.imageURL}
                alt="Skin Type"
                style={{ width: 50, height: 50, marginRight:  8 }}
              />
            ))}
        </div>
      ),
    },
    {
      title: "Nút điều khiển",
      key: "actions",
      render: (text, record) => (
        <div className="button" style={{display: "flex", justifyContent: "center", flexDirection: "column", width: 100}}>
          <Button
            color="orange"
            variant="filled"
            onClick={() => handleEditSkinType(record)}
            style={{ margin: 3, border: "2px solid " }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
            Sửa
          </Button>
          <Button
            color="primary"
            variant="filled"
            onClick={() => handleViewDetails(record)}
            style={{ margin: 3, border: "2px solid " }}
          >
            <i className="fa-solid fa-eye"></i>
            Chi tiết
          </Button>
          <Popconfirm
            title="Bạn có muốn xóa loại da này không?"
            onConfirm={() => handleDeleteSkinType(record.skinTypeId)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              color="red"
              variant="filled"
              style={{ margin: 3, border: "2px solid " }}
            >
              <i className="fa-solid fa-trash"></i>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const fetchSkinTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/skin-types");
      setSkinTypeList(response.data);
    } catch (error) {
      console.error(
        "Error fetching skin types:",
        error.response?.data?.message || error.message
      );
      toast.error("Lỗi khi tải danh sách loại da!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkinTypes();
  }, [fetchSkinTypes]);

  const handleSearch = async () => {
    try {
      const response = await api.get(`/skin-types/search/${searchText}`);
      setSkinTypeList(response.data);
    } catch (error) {
      console.error("Error searching discounts:", error);
      toast.error("Tìm kiếm loại da không thành công!");
    }
  };

  // const handleSearch = async () => {
  //   if (!searchText.trim()) {
  //     fetchSkinTypes(); // Nếu ô tìm kiếm trống, hiển thị toàn bộ danh sách
  //     return;
  //   }
  
  //   setLoading(true);
  //   try {
  //     const response = await api.get(`/skin-types/search/${searchText}`); // Gọi API với đúng đường dẫn
  //     setSkinTypeList(response.data);
  //   } catch (error) {
  //     console.error(
  //       "Error searching skin types:",
  //       error.response?.data?.message || error.message
  //     );
  //     toast.error("Tìm kiếm loại da không thành công!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    form.resetFields();
    setEditingSkinType(null);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleViewDetails = (skinType) => {
    setSelectedSkinType(skinType);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedSkinType(null);
  };

  const handleSubmitForm = async (values) => {
    // Check for duplicate skin type name
    const isDuplicate = skinTypeList.some(
      (skinType) =>
        skinType.skinName === values.skinName &&
        (!editingSkinType || skinType.skinTypeId !== editingSkinType.skinTypeId) // Allow editing the same skin type
    );

    if (isDuplicate) {
      toast.error("Tên loại da đã tồn tại! Vui lòng nhập tên khác.");
      return; // Prevent form submission
    }

    const formData = new FormData();
    formData.append(
      "skinTypeDTO",
      new Blob([JSON.stringify(values)], { type: "application/json" })
    );
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      let response;
      if (editingSkinType) {
        // Update existing skin type
        response = await api.put(
          `/skin-types/${editingSkinType.skinTypeId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Đã sửa loại da thành công!");
      } else {
        // Create new skin type
        response = await api.post("/skin-types", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Đã thêm loại da mới thành công!");
      }

      // Update skinTypeList state
      setSkinTypeList((prevList) => {
        if (editingSkinType) {
          return prevList.map((item) =>
            item.skinTypeId === editingSkinType.skinTypeId
              ? response.data
              : item
          );
        } else {
          return [...prevList, response.data];
        }
      });

      fetchSkinTypes(); // Refresh skin type list
      handleCloseModal();
    } catch (error) {
      console.error(
        "Error saving skin type:",
        error.response?.data?.message || error.message
      );

      // Customized error messages
      if (editingSkinType) {
        toast.error("Sửa loại da này không thành công!");
      } else {
        toast.error("Thêm loại da này không thành công!");
      }
    }
  };

  const handleEditSkinType = (skinType) => {
    setEditingSkinType(skinType);
    form.setFieldsValue(skinType);
    setImagePreviews(skinType.skinTypeImages.map((img) => img.imageURL)); // Hiển thị ảnh hiện tại khi chỉnh sửa
    setModalOpen(true);
  };

  const handleDeleteSkinType = async (skinTypeId) => {
    try {
      await api.delete(`/skin-types/${skinTypeId}`);
      toast.success("Đã xóa loại da này thành công!");
      fetchSkinTypes();
    } catch (error) {
      console.error(
        "Error deleting skin type:",
        error.response?.data?.message || error.message
      );
      toast.error("Xóa loại da không thành công!");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Quản lý loại da</h1>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Nhập tên loại da để tìm kiếm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300, marginRight:  8 }}
        />
        <Button type="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
        <Button
          onClick={() => {
            setSearchText("");
            fetchSkinTypes();
          }}
          style={{ marginLeft: 8, margin: 8 }}
        >
          Reset
        </Button>
        <Button type="primary" onClick={handleOpenModal}>
          <i className="fa-solid fa-plus"></i>
          Thêm loại da mới
        </Button>
      </div>
      <Table
        loading={loading}
        dataSource={skinTypeList}
        columns={columns}
        rowKey="skinTypeId"
        style={{ marginTop: 16 }}
      />
      <Modal
        title={editingSkinType ? "Chỉnh sửa loại da" : "Tạo loại da mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText={editingSkinType ? "Lưu thay đổi" : "Tạo"}
        cancelText="Hủy"
        width={800}
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
          <Form.Item
            label="Tên loại da"
            name="skinName"
            rules={[
              { required: true, message: "Tên loại da không được để trống!" },
            ]}
          >
            <Input />
          </Form.Item>
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Điểm tối thiểu" name="minMark">
                <Input type="number" />
              </Form.Item>
              <Form.Item label="Điểm tối đa" name="maxMark">
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tải hình ảnh lên">
                <Upload
                  multiple
                  beforeUpload={(file) => {
                    setImageFiles((prev) => [...prev, file]);
                    setImagePreviews((prev) => [
                      ...prev,
                      URL.createObjectURL(file),
                    ]); // Tạo URL tạm thời để hiển thị ảnh
                    return false; // Ngăn chặn việc tự động upload
                  }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
                {imagePreviews.map((preview, index) => (
                  <Image
                    key={index}
                    src={preview}
                    alt="Preview"
                    width={100}
                    style={{ marginTop: 8, marginRight:  8 }}
                  />
                ))}
              </Form.Item>
              {editingSkinType && (
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[
                    { required: false, message: "Trạng thái không được để trống!" },
                  ]}
                >
                  <Select>
                    <Option value={1}>HOẠT ĐỘNG</Option>
                    <Option value={2}>KHÔNG HOẠT ĐỘNG</Option>
                    <Option value={3}>ĐÃ XÓA</Option>
                  </Select>
                </Form.Item>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        title="Chi tiết loại da"
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={800}
      >
        {selectedSkinType && (
          <div>
            <p>
              <strong>ID: </strong> {selectedSkinType.skinTypeId}
            </p>
            <p>
              <strong>Tên loại da: </strong> {selectedSkinType.skinName}
            </p>
            <p>
              <strong>Mô tả: </strong>
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: selectedSkinType.description }}
            />
            <p>
              <strong>Điểm tối thiểu: </strong> {selectedSkinType.minMark}
            </p>
            <p>
              <strong>Điểm tối đa: </strong> {selectedSkinType.maxMark}
            </p>
            <p>
              <strong>Ảnh: </strong>
              {selectedSkinType.skinTypeImages.map((image, index) => (
                <img
                  key={index}
                  src={image.imageURL}
                  alt="Skin Type"
                  style={{ width: 100, marginRight:  8 }}
                />
              ))}
            </p>
            <p>
              <strong>Trạng Thái:</strong>
              {selectedSkinType.status !== undefined ? (
                <Tag color={statusColors[selectedSkinType.status]?.color}>
                  {statusColors[selectedSkinType.status]?.text}
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

export default SkinTypeManagement;