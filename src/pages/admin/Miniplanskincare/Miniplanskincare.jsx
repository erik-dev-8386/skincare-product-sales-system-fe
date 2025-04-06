import {
    Button,
    Form,
    Input,
    Modal,
    Table,
    Popconfirm,
    Select,
    Tag,
    Tooltip,
    InputNumber,
    Spin,
  } from "antd";
  import { useForm } from "antd/es/form/Form";
  import { useEffect, useState, useCallback } from "react";
  import api from "../../../config/api";
  import { toast, ToastContainer } from "react-toastify";
  import MyEditor from "../../../component/TinyMCE/MyEditor";
  
  const MiniPlanSkincare = () => {
    const { Option } = Select;
    const [miniPlanList, setMiniPlanList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [form] = useForm();
    const [editingPlan, setEditingPlan] = useState(null);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [skinCarePlans, setSkinCarePlans] = useState([]);
    const [selectedSkinCarePlan, setSelectedSkinCarePlan] = useState(null);
  
    const statusMapping = {
      1: { text: "HOẠT ĐỘNG", color: "green" },
      2: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
    };
  
    const columns = [
      {
        title: <p className="title-product-management">Bước số</p>,
        dataIndex: "stepNumber",
        key: "stepNumber",
      },
      {
        title: <p className="title-product-management">Hành động</p>,
        dataIndex: "action",
        key: "action",
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
      {
        title: <p className="title-product-management">Lộ trình chăm sóc da</p>,
        dataIndex: "skinCarePlan",
        key: "skinCarePlan",
        render: (skinCarePlan) => skinCarePlan?.description || "N/A",
      },
      {
        title: <p className="title-product-management">Trạng thái</p>,
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
        title: <p className="title-product-management">Nút điều khiển</p>,
        key: "actions",
        render: (text, record) => (
          <div className="button" style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "20px", alignItems: "center" }}>
            <Tooltip title="Sửa">
              <Button
                color="orange"
                variant="filled"
                onClick={() => handleEditPlan(record)}
                style={{ margin: 3, border: "2px solid", width: "20px" }}
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </Button>
            </Tooltip>
            <Tooltip title="Chi tiết">
              <Button
                color="primary"
                variant="filled"
                type="default"
                onClick={() => handleViewDetails(record)}
                style={{ margin: 3, border: "2px solid", width: "20px" }}
              >
                <i className="fa-solid fa-eye"></i>
              </Button>
            </Tooltip>
            <Tooltip title="Xóa">
              <Popconfirm
                title="Bạn có muốn xóa bước này không?"
                onConfirm={() => handleDeletePlan(record.miniSkinCarePlanId)}
                okText="Có"
                cancelText="Không"
              >
                <Button
                  color="red"
                  variant="filled"
                  style={{ margin: 3, border: "2px solid", width: "20px" }}
                >
                  <i className="fa-solid fa-trash"></i>
                </Button>
              </Popconfirm>
            </Tooltip>
          </div>
        ),
      },
    ];
  
    const fetchMiniPlans = useCallback(async () => {
      setLoading(true);
      try {
        const response = await api.get("/mini-skin-care");
        setMiniPlanList(response.data);
      } catch (error) {
        console.error(
          "Error fetching mini plans:",
          error.response?.data?.message || error.message
        );
        toast.error("Lỗi khi tải danh sách các bước chăm sóc da!");
      } finally {
        setLoading(false);
      }
    }, []);
  
    const fetchSkinCarePlans = useCallback(async () => {
      setLoading(true);
      try {
        const response = await api.get("/plan-skin-cares/users");
        const processedPlans = response.data.map(plan => ({
          ...plan,
          skinCarePlanId: plan.skinCarePlanId,
          description: plan.description,
          skinType: plan.skinType,
          status: plan.status
        }));
        
        console.log("Loaded skin care plans:", processedPlans);
        setSkinCarePlans(processedPlans);
      } catch (error) {
        console.error(
          "Error fetching skin care plans:",
          error.response?.data?.message || error.message
        );
        toast.error("Lỗi khi tải danh sách lộ trình chăm sóc da!");
      } finally {
        setLoading(false);
      }
    }, []);
  
    useEffect(() => {
      fetchMiniPlans();
      fetchSkinCarePlans();
    }, [fetchMiniPlans, fetchSkinCarePlans]);
  
    const handleSearch = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/mini-skin-care/info/${searchText}`);
        setMiniPlanList(response.data);
      } catch (error) {
        console.error(
          "Error searching mini plans:",
          error.response?.data?.message || error.message
        );
        toast.error("Tìm kiếm các bước chăm sóc da không thành công!");
      } finally {
        setLoading(false);
      }
    };
  
    const handleOpenModal = () => {
      setModalOpen(true);
      if (!editingPlan) {
        form.resetFields();
      }
    };
  
    const handleCloseModal = () => {
      setModalOpen(false);
      form.resetFields();
      setEditingPlan(null);
      setSelectedSkinCarePlan(null);
    };
  
    const handleViewDetails = (plan) => {
      setSelectedPlan(plan);
      setDetailModalOpen(true);
    };
  
    const handleCloseDetailModal = () => {
      setDetailModalOpen(false);
      setSelectedPlan(null);
    };
  
    const handleEditPlan = (plan) => {
      setEditingPlan(plan);
      setSelectedSkinCarePlan(plan.skinCarePlan);
      form.setFieldsValue({
        stepNumber: plan.stepNumber,
        action: plan.action,
        skinCarePlan: plan.skinCarePlan?.description,
        status: plan.status,
      });
      setModalOpen(true);
    };
  
    const handleSubmitForm = async (values) => {
      try {
        if (!values.action || values.action.trim() === '') {
          toast.error("Hành động không được để trống!");
          return;
        }
  
        if (!selectedSkinCarePlan) {
          toast.error("Vui lòng chọn lộ trình chăm sóc da!");
          return;
        }
  
        const planData = {
          stepNumber: values.stepNumber,
          action: values.action.trim(),
          skinCarePlanId: selectedSkinCarePlan.skinCarePlanId,
          status: editingPlan ? values.status : 1
        };
  
        console.log("Payload being sent:", planData);
  
        if (editingPlan) {
          await api.put(`/mini-skin-care/${editingPlan.miniSkinCarePlanId}`, planData);
          toast.success("Cập nhật thành công!");
        } else {
          await api.post("/mini-skin-care", planData);
          toast.success("Thêm mới thành công!");
        }
  
        fetchMiniPlans();
        handleCloseModal();
      } catch (error) {
        console.error("Error saving:", error);
        console.error("Error response:", error.response);
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      }
    };
  
    const handleDeletePlan = async (id) => {
      try {
        await api.delete(`/mini-skin-care/${id}`);
        toast.success("Đã xóa bước chăm sóc da thành công!");
        fetchMiniPlans();
      } catch (error) {
        console.error(
          "Error deleting mini plan:",
          error.response?.data?.message || error.message
        );
        toast.error("Xóa bước chăm sóc da không thành công!");
      }
    };
  
    const handleSkinCarePlanChange = (value) => {
      const selectedPlan = skinCarePlans.find(plan => plan.description === value);
      setSelectedSkinCarePlan(selectedPlan);
    };
  
    return (
      <div>
        <ToastContainer />
        <h1>Quản lý các bước chăm sóc da</h1>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Nhập tên hành động để tìm kiếm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginRight: 8 }}
          />
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
          <Button
            onClick={() => {
              setSearchText("");
              fetchMiniPlans();
            }}
            style={{ margin: 8 }}
          >
            Reset
          </Button>
          <Button type="primary" onClick={handleOpenModal}>
            <i className="fa-solid fa-plus"></i> Thêm bước chăm sóc da mới
          </Button>
        </div>
        <Table
          loading={loading}
          dataSource={miniPlanList}
          columns={columns}
          rowKey="miniSkinCarePlanId"
          style={{ marginTop: 16 }}
        />
        <Modal
          title={editingPlan ? "Chỉnh sửa bước chăm sóc da" : "Tạo bước chăm sóc da mới"}
          open={isModalOpen}
          onCancel={handleCloseModal}
          onOk={() => form.submit()}
          okText={editingPlan ? "Lưu thay đổi" : "Tạo"}
          cancelText="Hủy"
        >
          <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
            <Form.Item
              label="Bước số"
              name="stepNumber"
              rules={[
                { required: true, message: "Bước số không được bỏ trống!" },
                {
                  type: "number",
                  min: 1,
                  message: "Bước số phải lớn hơn 0!",
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Hành động"
              name="action"
              rules={[{ required: true, message: "Hành động không được để trống!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Lộ trình chăm sóc da"
              name="skinCarePlan"
              rules={[{ required: true, message: "Lộ trình chăm sóc da không được để trống!" }]}
            >
              <Select onChange={handleSkinCarePlanChange}>
                {skinCarePlans.map((plan) => (
                  <Option key={plan.skinCarePlanId} value={plan.description}>
                    {plan.description} - {plan.skinType?.skinName || "Không xác định"}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {editingPlan && (
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[
                  { required: true, message: "Trạng thái không được bỏ trống!" },
                ]}
              >
                <Select>
                  <Option value={1}>HOẠT ĐỘNG</Option>
                  <Option value={2}>KHÔNG HOẠT ĐỘNG</Option>
                </Select>
              </Form.Item>
            )}
          </Form>
        </Modal>
        <Modal
          title="Chi tiết bước chăm sóc da"
          open={isDetailModalOpen}
          onCancel={handleCloseDetailModal}
          footer={null}
          width={800}
        >
          {selectedPlan && (
            <div>
              <p>
                <strong>ID: </strong> {selectedPlan.miniSkinCarePlanId}
              </p>
              <p>
                <strong>Bước số: </strong> {selectedPlan.stepNumber}
              </p>
              <p>
                <strong>Hành động: </strong> {selectedPlan.action}
              </p>
              <p>
                <strong>Lộ trình chăm sóc da: </strong> {selectedPlan.skinCarePlan?.description || "N/A"}
              </p>
              <p>
                <strong>Loại da: </strong> {selectedPlan.skinCarePlan?.skinType?.skinName || "N/A"}
              </p>
              <p>
                <strong>Trạng thái: </strong>
                {selectedPlan.status !== undefined ? (
                  <Tag color={statusMapping[selectedPlan.status]?.color}>
                    {statusMapping[selectedPlan.status]?.text}
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
  
  export default MiniPlanSkincare;