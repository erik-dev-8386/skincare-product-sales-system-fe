// import {
//   Button,
//   Form,
//   Input,
//   Modal,
//   Table,
//   Popconfirm,
//   Select,
//   Tag,
//   Tooltip,
//   InputNumber,
//   Spin,
// } from "antd";
// import { useForm } from "antd/es/form/Form";
// import { useEffect, useState, useCallback } from "react";
// import api from "../../../config/api";
// import { toast, ToastContainer } from "react-toastify";

// const MiniPlanSkincare = () => {
//   const { Option } = Select;
//   const [miniPlanList, setMiniPlanList] = useState([]);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [form] = useForm();
//   const [editingPlan, setEditingPlan] = useState(null);
//   const [isDetailModalOpen, setDetailModalOpen] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [skinCarePlans, setSkinCarePlans] = useState([]);

//   const statusMapping = {
//     1: { text: "HOẠT ĐỘNG", color: "green" },
//     2: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
//   };

//   const columns = [
//     {
//       title: <p className="title-product-management">Bước số</p>,
//       dataIndex: "stepNumber",
//       key: "stepNumber",
//     },
//     {
//       title: <p className="title-product-management">Hành động</p>,
//       dataIndex: "action",
//       key: "action",
//       render: (text) => (
//         <div
//           dangerouslySetInnerHTML={{
//             __html:
//               text && typeof text === "string"
//                 ? text.length > 50
//                   ? text.substring(0, 50) + "..."
//                   : text
//                 : "",
//           }}
//         />
//       ),
//     },
//     {
//       title: <p className="title-product-management">Lộ trình chăm sóc da</p>,
//       dataIndex: "skinCarePlan",
//       key: "skinCarePlan",
//       render: (skinCarePlan) => skinCarePlan?.description || "N/A",
//     },
//     {
//       title: <p className="title-product-management">Trạng thái</p>,
//       dataIndex: "status",
//       key: "status",
//       render: (status) => {
//         const statusInfo = statusMapping[status] || {
//           text: "KHÔNG BIẾT",
//           color: "default",
//         };
//         return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
//       },
//     },
//     {
//       title: <p className="title-product-management">Nút điều khiển</p>,
//       key: "actions",
//       render: (text, record) => (
//         <div className="button" style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "20px", alignItems: "center" }}>
//           <Tooltip title="Sửa">
//             <Button
//               color="orange"
//               variant="filled"
//               onClick={() => handleEditPlan(record)}
//               style={{ margin: 3, border: "2px solid", width: "20px" }}
//             >
//               <i className="fa-solid fa-pen-to-square"></i>
//             </Button>
//           </Tooltip>
//           <Tooltip title="Chi tiết">
//             <Button
//               color="primary"
//               variant="filled"
//               type="default"
//               onClick={() => handleViewDetails(record)}
//               style={{ margin: 3, border: "2px solid", width: "20px" }}
//             >
//               <i className="fa-solid fa-eye"></i>
//             </Button>
//           </Tooltip>
//           <Tooltip title="Xóa">
//             <Popconfirm
//               title="Bạn có muốn xóa bước này không?"
//               onConfirm={() => handleDeletePlan(record.action, record.skinCarePlan?.description)}
//               okText="Có"
//               cancelText="Không"
//             >
//               <Button
//                 color="red"
//                 variant="filled"
//                 style={{ margin: 3, border: "2px solid", width: "20px" }}
//               >
//                 <i className="fa-solid fa-trash"></i>
//               </Button>
//             </Popconfirm>
//           </Tooltip>
//         </div>
//       ),
//     },
//   ];

//   const fetchMiniPlans = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/mini-skin-cares");
//       setMiniPlanList(response.data);
//     } catch (error) {
//       console.error(
//         "Error fetching mini plans:",
//         error.response?.data?.message || error.message
//       );
//       toast.error("Lỗi khi tải danh sách các bước chăm sóc da!");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const fetchSkinCarePlans = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/plan-skin-cares/show");
//       console.log("Loaded skin care plans:", response.data);
//       setSkinCarePlans(response.data);
//     } catch (error) {
//       console.error(
//         "Error fetching skin care plans:",
//         error.response?.data?.message || error.message
//       );
//       toast.error("Lỗi khi tải danh sách lộ trình chăm sóc da!");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchMiniPlans();
//     fetchSkinCarePlans();
//   }, [fetchMiniPlans, fetchSkinCarePlans]);

//   const handleSearch = async () => {
//     if (!searchText.trim()) {
//       fetchMiniPlans();
//       return;
//     }
    
//     setLoading(true);
//     try {
//       const response = await api.get(`/mini-skin-cares/info/${searchText}`);
//       setMiniPlanList(response.data);
//     } catch (error) {
//       console.error(
//         "Error searching mini plans:",
//         error.response?.data?.message || error.message
//       );
//       toast.error("Tìm kiếm các bước chăm sóc da không thành công!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenModal = () => {
//     setModalOpen(true);
//     if (!editingPlan) {
//       form.resetFields();
//     }
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     form.resetFields();
//     setEditingPlan(null);
//   };

//   const handleViewDetails = (plan) => {
//     setSelectedPlan(plan);
//     setDetailModalOpen(true);
//   };

//   const handleCloseDetailModal = () => {
//     setDetailModalOpen(false);
//     setSelectedPlan(null);
//   };

//   const handleEditPlan = (plan) => {
//     setEditingPlan(plan);
//     form.setFieldsValue({
//       stepNumber: plan.stepNumber,
//       action: plan.action,
//       skinCarePlan: plan.skinCarePlan?.description,
//       status: plan.status,
//     });
//     setModalOpen(true);
//   };

//   const handleSubmitForm = async (values) => {
//     try {
//       if (!values.action || values.action.trim() === '') {
//         toast.error("Hành động không được để trống!");
//         return;
//       }

//       if (!values.skinCarePlan) {
//         toast.error("Vui lòng chọn lộ trình chăm sóc da!");
//         return;
//       }

//       const planData = {
//         stepNumber: values.stepNumber,
//         action: values.action.trim(),
//         status: editingPlan ? values.status : 1
//       };

//       console.log("Payload being sent:", planData);

//       if (editingPlan) {
//         await api.put(`/mini-skin-cares/${values.action}/${values.skinCarePlan}`, planData);
//         toast.success("Cập nhật thành công!");
//       } else {
//         await api.post(`/mini-skin-cares/${values.skinCarePlan}`, planData);
//         toast.success("Thêm mới thành công!");
//       }

//       fetchMiniPlans();
//       handleCloseModal();
//     } catch (error) {
//       console.error("Error saving:", error);
//       console.error("Error response:", error.response);
//       toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
//     }
//   };

//   const handleDeletePlan = async (action, description) => {
//     if (!action || !description) {
//       toast.error("Thiếu thông tin để xóa bước chăm sóc da!");
//       return;
//     }
    
//     try {
//       await api.delete(`/mini-skin-cares/${action}/${description}`);
//       toast.success("Đã xóa bước chăm sóc da thành công!");
//       fetchMiniPlans();
//     } catch (error) {
//       console.error(
//         "Error deleting mini plan:",
//         error.response?.data?.message || error.message
//       );
//       toast.error("Xóa bước chăm sóc da không thành công!");
//     }
//   };

//   return (
//     <div>
//       <ToastContainer />
//       <h1>Quản lý các bước chăm sóc da</h1>
//       <div style={{ marginBottom: 16 }}>
//         <Input
//           placeholder="Nhập tên hành động để tìm kiếm"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           style={{ width: 300, marginRight: 8 }}
//           onPressEnter={handleSearch}
//         />
//         <Button type="primary" onClick={handleSearch}>
//           Tìm kiếm
//         </Button>
//         <Button
//           onClick={() => {
//             setSearchText("");
//             fetchMiniPlans();
//           }}
//           style={{ margin: 8 }}
//         >
//           Reset
//         </Button>
//         <Button type="primary" onClick={handleOpenModal}>
//           <i className="fa-solid fa-plus"></i> Thêm bước chăm sóc da mới
//         </Button>
//       </div>
//       <Table
//         loading={loading}
//         dataSource={miniPlanList}
//         columns={columns}
//         rowKey="miniSkinCarePlanId"
//         style={{ marginTop: 16 }}
//       />
//       <Modal
//         title={editingPlan ? "Chỉnh sửa bước chăm sóc da" : "Tạo bước chăm sóc da mới"}
//         open={isModalOpen}
//         onCancel={handleCloseModal}
//         onOk={() => form.submit()}
//         okText={editingPlan ? "Lưu thay đổi" : "Tạo"}
//         cancelText="Hủy"
//       >
//         <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
//           <Form.Item
//             label="Bước số"
//             name="stepNumber"
//             rules={[
//               { required: true, message: "Bước số không được bỏ trống!" },
//               {
//                 type: "number",
//                 min: 1,
//                 message: "Bước số phải lớn hơn 0!",
//               },
//             ]}
//           >
//             <InputNumber style={{ width: "100%" }} />
//           </Form.Item>
//           <Form.Item
//             label="Hành động"
//             name="action"
//             rules={[{ required: true, message: "Hành động không được để trống!" }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="Lộ trình chăm sóc da"
//             name="skinCarePlan"
//             rules={[{ required: true, message: "Lộ trình chăm sóc da không được để trống!" }]}
//           >
//             <Select>
//               {skinCarePlans.map((plan) => (
//                 <Option key={plan.skinCarePlanId} value={plan.description}>
//                   {plan.description} - {plan.skinType?.skinName || "Không xác định"}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>
//           {editingPlan && (
//             <Form.Item
//               label="Trạng thái"
//               name="status"
//               rules={[
//                 { required: true, message: "Trạng thái không được bỏ trống!" },
//               ]}
//             >
//               <Select>
//                 <Option value={1}>HOẠT ĐỘNG</Option>
//                 <Option value={2}>KHÔNG HOẠT ĐỘNG</Option>
//               </Select>
//             </Form.Item>
//           )}
//         </Form>
//       </Modal>
//       <Modal
//         title="Chi tiết bước chăm sóc da"
//         open={isDetailModalOpen}
//         onCancel={handleCloseDetailModal}
//         footer={null}
//         width={800}
//       >
//         {selectedPlan && (
//           <div>
//             <p>
//               <strong>ID: </strong> {selectedPlan.miniSkinCarePlanId}
//             </p>
//             <p>
//               <strong>Bước số: </strong> {selectedPlan.stepNumber}
//             </p>
//             <p>
//               <strong>Hành động: </strong> {selectedPlan.action}
//             </p>
//             <p>
//               <strong>Lộ trình chăm sóc da: </strong> {selectedPlan.skinCarePlan?.description || "N/A"}
//             </p>
//             <p>
//               <strong>Loại da: </strong> {selectedPlan.skinCarePlan?.skinType?.skinName || "N/A"}
//             </p>
//             <p>
//               <strong>Trạng thái: </strong>
//               {selectedPlan.status !== undefined ? (
//                 <Tag color={statusMapping[selectedPlan.status]?.color}>
//                   {statusMapping[selectedPlan.status]?.text}
//                 </Tag>
//               ) : (
//                 "Không xác định"
//               )}
//             </p>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default MiniPlanSkincare;



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

  const statusMapping = {
    
    0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
    1: { text: "HOẠT ĐỘNG", color: "green" },
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
              onConfirm={() => handleDeletePlan(record.action, record.skinCarePlan?.description)}
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
      const response = await api.get("/mini-skin-cares");
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
      const response = await api.get("/plan-skin-cares/show");
      console.log("Loaded skin care plans:", response.data);
      setSkinCarePlans(response.data);
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
    if (!searchText.trim()) {
      fetchMiniPlans();
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.get(`/mini-skin-cares/info/${searchText}`);
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
    const currentSkinCarePlan = plan.skinCarePlan?.description || "";
    
    form.setFieldsValue({
      stepNumber: plan.stepNumber,
      action: plan.action,
      skinCarePlan: currentSkinCarePlan,
      status: plan.status,
      // Store original values for reference
      originalAction: plan.action,
      originalSkinCarePlan: currentSkinCarePlan
    });
    setModalOpen(true);
  };

  const handleSubmitForm = async (values) => {
    try {
      if (!values.action || values.action.trim() === '') {
        toast.error("Hành động không được để trống!");
        return;
      }

      if (!values.skinCarePlan) {
        toast.error("Vui lòng chọn lộ trình chăm sóc da!");
        return;
      }

      const planData = {
        stepNumber: values.stepNumber,
        action: values.action.trim(),
        status: editingPlan ? values.status : 1
      };

      console.log("Payload being sent:", planData);

      if (editingPlan) {
        // For editing, use the original action and skinCarePlan values for the endpoint
        // When editing, we don't want to change the skinCarePlan association
        const originalAction = values.originalAction || editingPlan.action;
        const originalSkinCarePlan = values.originalSkinCarePlan || editingPlan.skinCarePlan?.description;
        
        await api.put(`/mini-skin-cares/${originalAction}/${originalSkinCarePlan}`, planData);
        toast.success("Cập nhật thành công!");
      } else {
        await api.post(`/mini-skin-cares/${values.skinCarePlan}`, planData);
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

  const handleDeletePlan = async (action, description) => {
    if (!action || !description) {
      toast.error("Thiếu thông tin để xóa bước chăm sóc da!");
      return;
    }
    
    try {
      await api.delete(`/mini-skin-cares/${action}/${description}`);
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
          onPressEnter={handleSearch}
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
          {/* Hidden fields to store original values */}
          <Form.Item name="originalAction" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="originalSkinCarePlan" hidden>
            <Input />
          </Form.Item>
          
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
            <Select disabled={editingPlan !== null}>
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
                <Option value={0}>KHÔNG HOẠT ĐỘNG</Option>
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