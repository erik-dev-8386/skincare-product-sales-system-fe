// // // ************************************************************
// // import React, { useEffect, useState, useCallback } from "react";
// // import { Button, Form, Input, Modal, Table, Popconfirm, Tag, Select, Tooltip, Space, Spin } from "antd";
// // import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
// // import api from "../../../config/api";
// // import { toast, ToastContainer } from "react-toastify";

// // const PlanSkincare = () => {
// //   const [planList, setPlanList] = useState([]);
// //   const [skinTypes, setSkinTypes] = useState([]);
// //   const [isModalOpen, setModalOpen] = useState(false);
// //   const [editingPlan, setEditingPlan] = useState(null);
// //   const [isDetailModalOpen, setDetailModalOpen] = useState(false);
// //   const [selectedPlan, setSelectedPlan] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [formInstance] = Form.useForm();

// //   const statusMapping = {
// //     0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
// //     1: { text: "HOẠT ĐỘNG", color: "green" },
// //   };

// //   const handleOpenModal = () => {
// //     formInstance.resetFields();
// //     setEditingPlan(null);
// //     setModalOpen(true);
// //   };

// //   const handleCloseModal = () => {
// //     formInstance.resetFields();
// //     setEditingPlan(null);
// //     setModalOpen(false);
// //   };

// //   const handleEditPlan = (plan) => {
// //     setEditingPlan(plan);
    
// //     console.log("Chỉnh sửa plan:", plan);
    
// //     formInstance.setFieldsValue({
// //       skinName: plan.skinType?.skinTypeId || "",
// //       description: plan.description,
// //       status: plan.status,
// //     });
    
// //     setModalOpen(true);
// //   };

// //   // Sửa đổi hàm handleDeletePlan để thực hiện xóa mềm thay vì xóa cứng
// //   const handleDeletePlan = async (plan) => {
// //     try {
// //       setLoading(true);
      
// //       if (!plan.skinType?.skinName || !plan.description) {
// //         console.error("Missing required skin name or description for deletion!");
// //         toast.error("Không tìm thấy đủ thông tin để vô hiệu hóa lộ trình");
// //         setLoading(false);
// //         return;
// //       }
      
// //       // Thay đổi thành PUT request để cập nhật trạng thái (soft delete)
// //       const updateUrl = `/plan-skin-cares/${encodeURIComponent(plan.skinType.skinName)}/${encodeURIComponent(plan.description)}`;
      
// //       console.log("Update URL for soft delete:", updateUrl);
      
// //       // Gửi request cập nhật status thành 0 (INACTIVE)
// //       await api.put(updateUrl, {
// //         description: plan.description,
// //         status: 0 // Đặt status thành INACTIVE (0)
// //       });
      
// //       toast.success("Đã vô hiệu hóa lộ trình thành công!");
// //       await fetchPlans();
// //     } catch (error) {
// //       console.error("Error deactivating plan:", error);
// //       toast.error("Vô hiệu hóa lộ trình không thành công!");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchSkinTypes = useCallback(async () => {
// //     try {
// //       const response = await api.get("/skin-types", {
// //         params: {
// //           minimal: true
// //         }
// //       });
      
// //       const typesWithData = response.data.map(type => ({
// //         value: type.skinTypeId,
// //         label: type.skinName
// //       }));
      
// //       console.log("Loaded skin types:", typesWithData);
// //       setSkinTypes(typesWithData);
// //     } catch (error) {
// //       console.error("Lỗi khi tải danh sách loại da:", error);
// //       toast.error("Không thể tải danh sách loại da!");
// //     }
// //   }, []);

// //   const fetchPlans = useCallback(async () => {
// //     setLoading(true);
// //     try {
// //       const response = await api.get("/plan-skin-cares/users");
// //       console.log("Raw plan data:", response.data);
      
// //       const plansWithSkinType = response.data.map(plan => ({
// //         ...plan,
// //         key: plan.skinCarePlanId || Math.random().toString(),
// //         skinTypeLabel: plan.skinType?.skinName || "Không xác định"
// //       }));
      
// //       console.log("Processed plans:", plansWithSkinType);
// //       setPlanList(plansWithSkinType);
// //     } catch (error) {
// //       console.error("Error fetching plans:", error);
// //       toast.error("Không thể tải danh sách lộ trình chăm sóc da!");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     const loadData = async () => {
// //       await fetchSkinTypes();
// //       await fetchPlans();
// //     };
// //     loadData();
// //   }, [fetchSkinTypes, fetchPlans]);

// //   const handleSubmitForm = async (values) => {
// //     try {
// //       setLoading(true);
// //       const payload = {
// //         description: values.description.trim(),
// //         status: values.status
// //       };
      
// //       console.log("Form values:", values);
// //       console.log("Payload:", payload);
  
// //       if (editingPlan) {
// //         // Update existing plan
// //         const skinName = editingPlan.skinType?.skinName;
        
// //         if (!skinName) {
// //           console.error("Không tìm thấy tên loại da!");
// //           toast.error("Không tìm thấy thông tin loại da");
// //           setLoading(false);
// //           return;
// //         }
        
// //         // Use the correct endpoint format with proper encoding
// //         const updateUrl = `/plan-skin-cares/${encodeURIComponent(skinName)}/${encodeURIComponent(editingPlan.description)}`;
        
// //         console.log("Update URL:", updateUrl);
        
// //         try {
// //           const updateResponse = await api.put(updateUrl, payload);
// //           console.log("Update response:", updateResponse);
// //           toast.success("Đã cập nhật lộ trình thành công!");
// //         } catch (putError) {
// //           console.error("PUT request failed details:", putError);
// //           toast.error(putError.response?.data || "Cập nhật lộ trình không thành công!");
// //           setLoading(false);
// //           return;
// //         }
// //       } else {
// //         // Create new plan
// //         const skinType = skinTypes.find(type => type.value === values.skinName);
// //         if (!skinType) {
// //           toast.error("Loại da không tồn tại");
// //           setLoading(false);
// //           return;
// //         }
        
// //         try {
// //           // Use the correct endpoint for creation
// //           const createUrl = `/plan-skin-cares/${encodeURIComponent(skinType.label)}`;
          
// //           console.log("Create URL:", createUrl);
// //           const createResponse = await api.post(createUrl, payload);
// //           console.log("Create response:", createResponse);
// //           toast.success("Đã thêm lộ trình mới thành công!");
// //         } catch (postError) {
// //           console.error("POST request failed:", postError);
// //           toast.error(postError.response?.data || "Thêm lộ trình mới không thành công!");
// //           setLoading(false);
// //           return;
// //         }
// //       }
  
// //       await fetchPlans();
// //       handleCloseModal();
// //     } catch (error) {
// //       console.error("Error submitting form:", error);
// //       toast.error(
// //         error.response?.data || 
// //         error.message ||
// //         (editingPlan 
// //           ? "Cập nhật lộ trình không thành công!" 
// //           : "Thêm lộ trình mới không thành công!")
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  
// //   const columns = [
// //     {
// //       title: "Loại da",
// //       dataIndex: "skinTypeLabel",
// //       key: "skinTypeLabel",
// //     },
// //     {
// //       title: "Mô tả",
// //       dataIndex: "description",
// //       key: "description",
// //       render: (text) => text || "Không có mô tả"
// //     },
// //     {
// //       title: "Trạng thái",
// //       dataIndex: "status",
// //       key: "status",
// //       render: (status) => {
// //         const statusData = statusMapping[status] || { text: "KHÔNG XÁC ĐỊNH", color: "gray" };
// //         return <Tag color={statusData.color}>{statusData.text}</Tag>;
// //       }
// //     },
// //     {
// //       title: "Thao tác",
// //       key: "actions",
// //       render: (_, record) => (
// //         <Space>
// //           <Tooltip title="Xem chi tiết">
// //             <Button 
// //               icon={<EyeOutlined />} 
// //               onClick={() => {
// //                 setSelectedPlan(record);
// //                 setDetailModalOpen(true);
// //               }}
// //             />
// //           </Tooltip>
// //           <Tooltip title="Chỉnh sửa">
// //             <Button 
// //               icon={<EditOutlined />} 
// //               onClick={() => handleEditPlan(record)}
// //             />
// //           </Tooltip>
// //           <Popconfirm
// //             title="Bạn có chắc muốn vô hiệu hóa lộ trình này?"
// //             onConfirm={() => handleDeletePlan(record)}
// //             okText="Có"
// //             cancelText="Không"
// //           >
// //             <Tooltip title="Vô hiệu hóa">
// //               <Button danger icon={<DeleteOutlined />} />
// //             </Tooltip>
// //           </Popconfirm>
// //         </Space>
// //       )
// //     }
// //   ];

// //   return (
// //     <div style={{ padding: 24 }}>
// //       <ToastContainer />
// //       <Spin spinning={loading}>
// //         <h1>Quản lý lộ trình chăm sóc da</h1>
        
// //         <div style={{ marginBottom: 16 }}>
// //           <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
// //             Thêm lộ trình mới
// //           </Button>
// //         </div>

// //         <Table
// //           dataSource={planList}
// //           columns={columns}
// //           rowKey="key"
// //           bordered
// //           loading={loading}
// //         />

// //         <Modal
// //           title={editingPlan ? "Chỉnh sửa lộ trình" : "Tạo lộ trình mới"}
// //           open={isModalOpen}
// //           onCancel={handleCloseModal}
// //           onOk={() => formInstance.submit()}
// //           okText={editingPlan ? "Cập nhật" : "Tạo"}
// //           cancelText="Hủy"
// //           width={800}
// //           confirmLoading={loading}
// //         >
// //           <Form form={formInstance} onFinish={handleSubmitForm} layout="vertical">
// //             <Form.Item
// //               label="Loại da"
// //               name="skinName"
// //               rules={[{ required: true, message: "Vui lòng chọn loại da!" }]}
// //             >
// //               <Select
// //                 options={skinTypes}
// //                 loading={skinTypes.length === 0}
// //                 placeholder="Chọn loại da"
// //                 showSearch
// //                 optionFilterProp="label"
// //                 disabled={!!editingPlan}
// //               />
// //             </Form.Item>

// //             <Form.Item
// //               label="Mô tả"
// //               name="description"
// //               rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
// //             >
// //               <Input.TextArea rows={4} />
// //             </Form.Item>

// //             <Form.Item
// //               label="Trạng thái"
// //               name="status"
// //               initialValue={1}
// //             >
// //               <Select>
// //                 <Select.Option value={1}>Hoạt động</Select.Option>
// //                 <Select.Option value={0}>Không hoạt động</Select.Option>
// //               </Select>
// //             </Form.Item>
// //           </Form>
// //         </Modal>

// //         <Modal
// //           title="Chi tiết lộ trình"
// //           open={isDetailModalOpen}
// //           onCancel={() => setDetailModalOpen(false)}
// //           footer={null}
// //           width={800}
// //         >
// //           {selectedPlan && (
// //             <div>
// //               <p><strong>Loại da:</strong> {selectedPlan.skinTypeLabel}</p>
// //               <p><strong>Mô tả:</strong> {selectedPlan.description}</p>
// //               <p><strong>Trạng thái:</strong> 
// //                 <Tag color={statusMapping[selectedPlan.status]?.color || 'gray'}>
// //                   {statusMapping[selectedPlan.status]?.text || 'Không xác định'}
// //                 </Tag>
// //               </p>
// //             </div>
// //           )}
// //         </Modal>
// //       </Spin>
// //     </div>
// //   );
// // };

// // export default PlanSkincare;
// //*******************************************************************
// // code Phúc

// import React, { useEffect, useState, useCallback } from "react";
// import { Button, Form, Input, Modal, Table, Popconfirm, Tag, Select, Tooltip, Space, Spin } from "antd";
// import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
// import api from "../../../config/api";
// import { toast, ToastContainer } from "react-toastify";

// const PlanSkincare = () => {
//   const [planList, setPlanList] = useState([]);
//   const [skinTypes, setSkinTypes] = useState([]);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [editingPlan, setEditingPlan] = useState(null);
//   const [isDetailModalOpen, setDetailModalOpen] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [formInstance] = Form.useForm();

//   const statusMapping = {
//     0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
//     1: { text: "HOẠT ĐỘNG", color: "green" },
//   };

//   const handleOpenModal = () => {
//     formInstance.resetFields();
//     setEditingPlan(null);
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     formInstance.resetFields();
//     setEditingPlan(null);
//     setModalOpen(false);
//   };

//   const handleEditPlan = (plan) => {
//     setEditingPlan(plan);
    
//     console.log("Chỉnh sửa plan:", plan);
    
//     formInstance.setFieldsValue({
//       skinName: plan.skinType?.skinTypeId || "",
//       description: plan.description,
//       status: plan.status,
//     });
    
//     setModalOpen(true);
//   };

//   const handleDeletePlan = async (plan) => {
//     try {
//       setLoading(true);
      
//       if (!plan.skinType?.skinName || !plan.description) {
//         console.error("Missing required skin name or description for deletion!");
//         toast.error("Không tìm thấy đủ thông tin để vô hiệu hóa lộ trình");
//         setLoading(false);
//         return;
//       }
      
//       // Thay đổi thành PUT request để cập nhật trạng thái (soft delete)
//       const updateUrl = `/plan-skin-cares/${encodeURIComponent(plan.skinType.skinName)}/${encodeURIComponent(plan.description)}`;
      
//       console.log("Update URL for soft delete:", updateUrl);
      
//       // Gửi request cập nhật status thành 0 (INACTIVE)
//       await api.put(updateUrl, {
//         description: plan.description,
//         status: 0 // Đặt status thành INACTIVE (0)
//       });
      
//       toast.success("Đã vô hiệu hóa lộ trình thành công!");
//       await fetchPlans();
//     } catch (error) {
//       console.error("Error deactivating plan:", error);
//       toast.error("Vô hiệu hóa lộ trình không thành công!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSkinTypes = useCallback(async () => {
//     try {
//       const response = await api.get("/skin-types", {
//         params: {
//           minimal: true
//         }
//       });
      
//       const typesWithData = response.data.map(type => ({
//         value: type.skinTypeId,
//         label: type.skinName
//       }));
      
//       console.log("Loaded skin types:", typesWithData);
//       setSkinTypes(typesWithData);
//     } catch (error) {
//       console.error("Lỗi khi tải danh sách loại da:", error);
//       toast.error("Không thể tải danh sách loại da!");
//     }
//   }, []);

//   const fetchPlans = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/plan-skin-cares");
//       console.log("Raw plan data:", response.data);
      
//       const plansWithSkinType = response.data.map(plan => ({
//         ...plan,
//         key: plan.skinCarePlanId || Math.random().toString(),
//         skinTypeLabel: plan.skinType?.skinName || "Không xác định"
//       }));
      
//       console.log("Processed plans:", plansWithSkinType);
//       setPlanList(plansWithSkinType);
//     } catch (error) {
//       console.error("Error fetching plans:", error);
//       toast.error("Không thể tải danh sách lộ trình chăm sóc da!");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const loadData = async () => {
//       await fetchSkinTypes();
//       await fetchPlans();
//     };
//     loadData();
//   }, [fetchSkinTypes, fetchPlans]);

//   const handleSubmitForm = async (values) => {
//     try {
//       setLoading(true);
//       const payload = {
//         description: values.description.trim(),
//         status: values.status,
//         skinTypeId: values.skinName 
//       };
      
//       console.log("Form values:", values);
//       console.log("Payload:", payload);
  
//       if (editingPlan) {
//         // Update existing plan - Using the correct API endpoint format as per the backend controller
//         const skinTypeName = editingPlan.skinType?.skinName;
        
//         if (!skinTypeName) {
//           console.error("Không tìm thấy tên loại da!");
//           toast.error("Không tìm thấy thông tin loại da");
//           setLoading(false);
//           return;
//         }
        
//         // Correctly construct the URL according to the backend API pattern:
//         // "/plan-skin-cares/{skinTypeName}/{description}"
//         const updateUrl = `/plan-skin-cares/${encodeURIComponent(skinTypeName)}/${encodeURIComponent(editingPlan.description)}`;
        
//         console.log("Update URL:", updateUrl);
        
//         try {
//           const updateResponse = await api.put(updateUrl, payload);
//           console.log("Update response:", updateResponse);
//           toast.success("Đã cập nhật lộ trình thành công!");
//         } catch (putError) {
//           console.error("PUT request failed details:", putError);
//           toast.error(putError.response?.data || "Cập nhật lộ trình không thành công!");
//           setLoading(false);
//           return;
//         }
//       } else {
//         // Create new plan
//         const skinType = skinTypes.find(type => type.value === values.skinName);
//         if (!skinType) {
//           toast.error("Loại da không tồn tại");
//           setLoading(false);
//           return;
//         }
        
//         try {
//           // Use the correct endpoint for creation based on the backend controller
//           // "/plan-skin-cares/{skinCareName}"
//           const createUrl = `/plan-skin-cares/${encodeURIComponent(skinType.label)}`;
          
//           console.log("Create URL:", createUrl);
//           const createResponse = await api.post(createUrl, payload);
//           console.log("Create response:", createResponse);
//           toast.success("Đã thêm lộ trình mới thành công!");
//         } catch (postError) {
//           console.error("POST request failed:", postError);
//           toast.error(postError.response?.data || "Thêm lộ trình mới không thành công!");
//           setLoading(false);
//           return;
//         }
//       }
  
//       await fetchPlans();
//       handleCloseModal();
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       toast.error(
//         error.response?.data || 
//         error.message ||
//         (editingPlan 
//           ? "Cập nhật lộ trình không thành công!" 
//           : "Thêm lộ trình mới không thành công!")
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const columns = [
//     {
//       title: "Loại da",
//       dataIndex: "skinTypeLabel",
//       key: "skinTypeLabel",
//     },
//     {
//       title: "Mô tả",
//       dataIndex: "description",
//       key: "description",
//       render: (text) => text || "Không có mô tả"
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => {
//         const statusData = statusMapping[status] || { text: "KHÔNG XÁC ĐỊNH", color: "gray" };
//         return <Tag color={statusData.color}>{statusData.text}</Tag>;
//       }
//     },
//     {
//       title: "Thao tác",
//       key: "actions",
//       render: (_, record) => (
//         <Space>
//           <Tooltip title="Xem chi tiết">
//             <Button 
//               icon={<EyeOutlined />} 
//               onClick={() => {
//                 setSelectedPlan(record);
//                 setDetailModalOpen(true);
//               }}
//             />
//           </Tooltip>
//           <Tooltip title="Chỉnh sửa">
//             <Button 
//               icon={<EditOutlined />} 
//               onClick={() => handleEditPlan(record)}
//             />
//           </Tooltip>
//           <Popconfirm
//             title="Bạn có chắc muốn vô hiệu hóa lộ trình này?"
//             onConfirm={() => handleDeletePlan(record)}
//             okText="Có"
//             cancelText="Không"
//           >
//             <Tooltip title="Vô hiệu hóa">
//               <Button danger icon={<DeleteOutlined />} />
//             </Tooltip>
//           </Popconfirm>
//         </Space>
//       )
//     }
//   ];

//   return (
//     <div style={{ padding: 24 }}>
//       <ToastContainer />
//       <Spin spinning={loading}>
//         <h1>Quản lý lộ trình chăm sóc da</h1>
        
//         <div style={{ marginBottom: 16 }}>
//           <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
//             Thêm lộ trình mới
//           </Button>
//         </div>

//         <Table
//           dataSource={planList}
//           columns={columns}
//           rowKey="key"
//           bordered
//           loading={loading}
//         />

//         <Modal
//           title={editingPlan ? "Chỉnh sửa lộ trình" : "Tạo lộ trình mới"}
//           open={isModalOpen}
//           onCancel={handleCloseModal}
//           onOk={() => formInstance.submit()}
//           okText={editingPlan ? "Cập nhật" : "Tạo"}
//           cancelText="Hủy"
//           width={800}
//           confirmLoading={loading}
//         >
//           <Form form={formInstance} onFinish={handleSubmitForm} layout="vertical">
//             <Form.Item
//               label="Loại da"
//               name="skinName"
//               rules={[{ required: true, message: "Vui lòng chọn loại da!" }]}
//             >
//               <Select
//                 options={skinTypes}
//                 loading={skinTypes.length === 0}
//                 placeholder="Chọn loại da"
//                 showSearch
//                 optionFilterProp="label"
//                // disabled={!!editingPlan}
//               />
//             </Form.Item>

//             <Form.Item
//               label="Mô tả"
//               name="description"
//               rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
//             >
//               <Input.TextArea rows={4} />
//             </Form.Item>

//             <Form.Item
//               label="Trạng thái"
//               name="status"
//               initialValue={1}
//             >
//               <Select>
//                 <Select.Option value={1}>Hoạt động</Select.Option>
//                 <Select.Option value={0}>Không hoạt động</Select.Option>
//               </Select>
//             </Form.Item>
//           </Form>
//         </Modal>

//         <Modal
//           title="Chi tiết lộ trình"
//           open={isDetailModalOpen}
//           onCancel={() => setDetailModalOpen(false)}
//           footer={null}
//           width={800}
//         >
//           {selectedPlan && (
//             <div>
//               <p><strong>Loại da:</strong> {selectedPlan.skinTypeLabel}</p>
//               <p><strong>Mô tả:</strong> {selectedPlan.description}</p>
//               <p><strong>Trạng thái:</strong> 
//                 <Tag color={statusMapping[selectedPlan.status]?.color || 'gray'}>
//                   {statusMapping[selectedPlan.status]?.text || 'Không xác định'}
//                 </Tag>
//               </p>
//             </div>
//           )}
//         </Modal>
//       </Spin>
//     </div>
//   );
// };

// export default PlanSkincare;


// import React, { useEffect, useState, useCallback } from "react";
// import { Button, Form, Input, Modal, Table, Popconfirm, Tag, Select, Tooltip, Space, Spin } from "antd";
// import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
// import api from "../../../config/api";
// import { toast, ToastContainer } from "react-toastify";

// const PlanSkincare = () => {
//   const [planList, setPlanList] = useState([]);
//   const [skinTypes, setSkinTypes] = useState([]);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [editingPlan, setEditingPlan] = useState(null);
//   const [isDetailModalOpen, setDetailModalOpen] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [formInstance] = Form.useForm();

//   const statusMapping = {
//     0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
//     1: { text: "HOẠT ĐỘNG", color: "green" },
//   };

//   const handleOpenModal = () => {
//     formInstance.resetFields();
//     setEditingPlan(null);
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     formInstance.resetFields();
//     setEditingPlan(null);
//     setModalOpen(false);
//   };

//   const handleEditPlan = (plan) => {
//     setEditingPlan(plan);
//     formInstance.setFieldsValue({
//       skinName: plan.skinType?.skinTypeId || "", // Store skinTypeId for initial value
//       description: plan.description,
//       status: plan.status,
//     });
//     setModalOpen(true);
//   };

//   const handleDeletePlan = async (plan) => {
//     try {
//       setLoading(true);
      
//       if (!plan.skinType?.skinName || !plan.description) {
//         console.error("Missing required skin name or description for deletion!");
//         toast.error("Không tìm thấy đủ thông tin để vô hiệu hóa lộ trình");
//         setLoading(false);
//         return;
//       }
      
//       const updateUrl = `/plan-skin-cares/${encodeURIComponent(plan.skinType.skinName)}/${encodeURIComponent(plan.description)}`;
      
//       await api.put(updateUrl, {
//         description: plan.description,
//         status: 0
//       });
      
//       toast.success("Đã vô hiệu hóa lộ trình thành công!");
//       await fetchPlans();
//     } catch (error) {
//       console.error("Error deactivating plan:", error);
//       toast.error("Vô hiệu hóa lộ trình không thành công!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSkinTypes = useCallback(async () => {
//     try {
//       const response = await api.get("/skin-types", {
//         params: {
//           minimal: true
//         }
//       });
      
//       const typesWithData = response.data.map(type => ({
//         value: type.skinTypeId,
//         label: type.skinName
//       }));
      
//       setSkinTypes(typesWithData);
//     } catch (error) {
//       console.error("Lỗi khi tải danh sách loại da:", error);
//       toast.error("Không thể tải danh sách loại da!");
//     }
//   }, []);

//   const fetchPlans = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/plan-skin-cares");
      
//       const plansWithSkinType = response.data.map(plan => ({
//         ...plan,
//         key: plan.skinCarePlanId || Math.random().toString(),
//         skinTypeLabel: plan.skinType?.skinName || "Không xác định",
//         skinTypeId: plan.skinType?.skinTypeId || null // Ensure we have skinTypeId
//       }));
      
//       setPlanList(plansWithSkinType);
//     } catch (error) {
//       console.error("Error fetching plans:", error);
//       toast.error("Không thể tải danh sách lộ trình chăm sóc da!");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const loadData = async () => {
//       await fetchSkinTypes();
//       await fetchPlans();
//     };
//     loadData();
//   }, [fetchSkinTypes, fetchPlans]);

//   const handleSubmitForm = async (values) => {
//     try {
//       setLoading(true);
      
//       // Find the selected skin type
//       const selectedSkinType = skinTypes.find(type => type.value === values.skinName);
//       if (!selectedSkinType) {
//         toast.error("Loại da không tồn tại");
//         setLoading(false);
//         return;
//       }

//       const payload = {
//         description: values.description.trim(),
//         status: values.status,
//         skinName: selectedSkinType.label // Send the skin name for potential update
//       };
  
//       if (editingPlan) {
//         // For update, we need both current skin name and description
//         const currentSkinName = editingPlan.skinType?.skinName;
//         const currentDescription = editingPlan.description;
        
//         if (!currentSkinName || !currentDescription) {
//           toast.error("Thông tin lộ trình không đầy đủ");
//           setLoading(false);
//           return;
//         }
        
//         const updateUrl = `/plan-skin-cares/${encodeURIComponent(currentSkinName)}/${encodeURIComponent(currentDescription)}`;
        
//         try {
//           await api.put(updateUrl, payload);
//           toast.success("Đã cập nhật lộ trình thành công!");
//         } catch (putError) {
//           console.error("PUT request failed details:", putError);
//           toast.error(putError.response?.data || "Cập nhật lộ trình không thành công!");
//           setLoading(false);
//           return;
//         }
//       } else {
//         // For create, we just need the skin name
//         const createUrl = `/plan-skin-cares/${encodeURIComponent(selectedSkinType.label)}`;
        
//         try {
//           await api.post(createUrl, payload);
//           toast.success("Đã thêm lộ trình mới thành công!");
//         } catch (postError) {
//           console.error("POST request failed:", postError);
//           toast.error(postError.response?.data || "Thêm lộ trình mới không thành công!");
//           setLoading(false);
//           return;
//         }
//       }
  
//       await fetchPlans();
//       handleCloseModal();
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       toast.error(
//         error.response?.data || 
//         error.message ||
//         (editingPlan 
//           ? "Cập nhật lộ trình không thành công!" 
//           : "Thêm lộ trình mới không thành công!")
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     {
//       title: "Loại da",
//       dataIndex: "skinTypeLabel",
//       key: "skinTypeLabel",
//     },
//     {
//       title: "Mô tả",
//       dataIndex: "description",
//       key: "description",
//       render: (text) => text || "Không có mô tả"
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => {
//         const statusData = statusMapping[status] || { text: "KHÔNG XÁC ĐỊNH", color: "gray" };
//         return <Tag color={statusData.color}>{statusData.text}</Tag>;
//       }
//     },
//     {
//       title: "Thao tác",
//       key: "actions",
//       render: (_, record) => (
//         <Space>
//           <Tooltip title="Xem chi tiết">
//             <Button 
//               icon={<EyeOutlined />} 
//               onClick={() => {
//                 setSelectedPlan(record);
//                 setDetailModalOpen(true);
//               }}
//             />
//           </Tooltip>
//           <Tooltip title="Chỉnh sửa">
//             <Button 
//               icon={<EditOutlined />} 
//               onClick={() => handleEditPlan(record)}
//             />
//           </Tooltip>
//           <Popconfirm
//             title="Bạn có chắc muốn vô hiệu hóa lộ trình này?"
//             onConfirm={() => handleDeletePlan(record)}
//             okText="Có"
//             cancelText="Không"
//           >
//             <Tooltip title="Vô hiệu hóa">
//               <Button danger icon={<DeleteOutlined />} />
//             </Tooltip>
//           </Popconfirm>
//         </Space>
//       )
//     }
//   ];

//   return (
//     <div style={{ padding: 24 }}>
//       <ToastContainer />
//       <Spin spinning={loading}>
//         <h1>Quản lý lộ trình chăm sóc da</h1>
        
//         <div style={{ marginBottom: 16 }}>
//           <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
//             Thêm lộ trình mới
//           </Button>
//         </div>

//         <Table
//           dataSource={planList}
//           columns={columns}
//           rowKey="key"
//           bordered
//           loading={loading}
//         />

//         <Modal
//           title={editingPlan ? "Chỉnh sửa lộ trình" : "Tạo lộ trình mới"}
//           open={isModalOpen}
//           onCancel={handleCloseModal}
//           onOk={() => formInstance.submit()}
//           okText={editingPlan ? "Cập nhật" : "Tạo"}
//           cancelText="Hủy"
//           width={800}
//           confirmLoading={loading}
//         >
//           <Form form={formInstance} onFinish={handleSubmitForm} layout="vertical">
//             <Form.Item
//               label="Loại da"
//               name="skinName"
//               rules={[{ required: true, message: "Vui lòng chọn loại da!" }]}
//             >
//               <Select
//                 options={skinTypes}
//                 loading={skinTypes.length === 0}
//                 placeholder="Chọn loại da"
//                 showSearch
//                 optionFilterProp="label"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Mô tả"
//               name="description"
//               rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
//             >
//               <Input.TextArea rows={4} />
//             </Form.Item>

//             <Form.Item
//               label="Trạng thái"
//               name="status"
//               initialValue={1}
//             >
//               <Select>
//                 <Select.Option value={1}>Hoạt động</Select.Option>
//                 <Select.Option value={0}>Không hoạt động</Select.Option>
//               </Select>
//             </Form.Item>
//           </Form>
//         </Modal>

//         <Modal
//           title="Chi tiết lộ trình"
//           open={isDetailModalOpen}
//           onCancel={() => setDetailModalOpen(false)}
//           footer={null}
//           width={800}
//         >
//           {selectedPlan && (
//             <div>
//               <p><strong>Loại da:</strong> {selectedPlan.skinTypeLabel}</p>
//               <p><strong>Mô tả:</strong> {selectedPlan.description}</p>
//               <p><strong>Trạng thái:</strong> 
//                 <Tag color={statusMapping[selectedPlan.status]?.color || 'gray'}>
//                   {statusMapping[selectedPlan.status]?.text || 'Không xác định'}
//                 </Tag>
//               </p>
//             </div>
//           )}
//         </Modal>
//       </Spin>
//     </div>
//   );
// };

// export default PlanSkincare;

import React, { useEffect, useState, useCallback } from "react";
import { Button, Form, Input, Modal, Table, Popconfirm, Tag, Select, Tooltip, Space, Spin } from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import api from "../../../config/api";
import { toast, ToastContainer } from "react-toastify";

const PlanSkincare = () => {
  const [planList, setPlanList] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [formInstance] = Form.useForm();
  
  const statusMapping = {
    0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
    1: { text: "HOẠT ĐỘNG", color: "green" },
  };
  
  const handleOpenModal = () => {
    formInstance.resetFields();
    setEditingPlan(null);
    setModalOpen(true);
  };
  
  const handleCloseModal = () => {
    formInstance.resetFields();
    setEditingPlan(null);
    setModalOpen(false);
  };
  
  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    formInstance.setFieldsValue({
      skinName: plan.skinType?.skinTypeId || "", // Store skinTypeId for initial value
      description: plan.description,
      status: plan.status,
    });
    setModalOpen(true);
  };
  
  const handleDeletePlan = async (plan) => {
    try {
      setLoading(true);
      
      if (!plan.skinType?.skinName || !plan.description) {
        console.error("Missing required skin name or description for deletion!");
        toast.error("Không tìm thấy đủ thông tin để vô hiệu hóa lộ trình");
        setLoading(false);
        return;
      }
      
      // Using the proper DELETE endpoint instead of PUT
      const deleteUrl = `/plan-skin-cares/${encodeURIComponent(plan.skinType.skinName)}/${encodeURIComponent(plan.description)}`;
      
      await api.delete(deleteUrl);
      
      toast.success("Đã vô hiệu hóa lộ trình thành công!");
      await fetchPlans();
    } catch (error) {
      console.error("Error deactivating plan:", error);
      toast.error(error.response?.data || "Vô hiệu hóa lộ trình không thành công!");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSkinTypes = useCallback(async () => {
    try {
      const response = await api.get("/skin-types", {
        params: {
          minimal: true
        }
      });
      
      const typesWithData = response.data.map(type => ({
        value: type.skinTypeId,
        label: type.skinName
      }));
      
      setSkinTypes(typesWithData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách loại da:", error);
      toast.error("Không thể tải danh sách loại da!");
    }
  }, []);
  
  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/plan-skin-cares");
      
      const plansWithSkinType = response.data.map(plan => ({
        ...plan,
        key: plan.skinCarePlanId || Math.random().toString(),
        skinTypeLabel: plan.skinType?.skinName || "Không xác định",
        skinTypeId: plan.skinType?.skinTypeId || null // Ensure we have skinTypeId
      }));
      
      setPlanList(plansWithSkinType);
      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Không thể tải danh sách lộ trình chăm sóc da!");
    } finally {
      setLoading(false);
    }
  }, []);
  
  // New search function to find plans by description
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await fetchPlans();
      return;
    }
    
    setLoading(true);
    setIsSearching(true);
    
    try {
      const response = await api.get(`/plan-skin-cares/search/${encodeURIComponent(searchTerm.trim())}`);
      
      const plansWithSkinType = response.data.map(plan => ({
        ...plan,
        key: plan.skinCarePlanId || Math.random().toString(),
        skinTypeLabel: plan.skinType?.skinName || "Không xác định",
        skinTypeId: plan.skinType?.skinTypeId || null
      }));
      
      setPlanList(plansWithSkinType);
    } catch (error) {
      console.error("Error searching plans:", error);
      toast.error("Không thể tìm kiếm lộ trình chăm sóc da!");
      // If search fails, reset to all plans
      await fetchPlans();
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetSearch = async () => {
    setSearchTerm("");
    setIsSearching(false);
    await fetchPlans();
  };
  
  useEffect(() => {
    const loadData = async () => {
      await fetchSkinTypes();
      await fetchPlans();
    };
    loadData();
  }, [fetchSkinTypes, fetchPlans]);
  
  const handleSubmitForm = async (values) => {
    try {
      setLoading(true);
      
      // Find the selected skin type
      const selectedSkinType = skinTypes.find(type => type.value === values.skinName);
      if (!selectedSkinType) {
        toast.error("Loại da không tồn tại");
        setLoading(false);
        return;
      }
      const payload = {
        description: values.description.trim(),
        status: values.status,
        skinName: selectedSkinType.label // Send the skin name for potential update
      };
  
      if (editingPlan) {
        // For update, we need both current skin name and description
        const currentSkinName = editingPlan.skinType?.skinName;
        const currentDescription = editingPlan.description;
        
        if (!currentSkinName || !currentDescription) {
          toast.error("Thông tin lộ trình không đầy đủ");
          setLoading(false);
          return;
        }
        
        const updateUrl = `/plan-skin-cares/${encodeURIComponent(currentSkinName)}/${encodeURIComponent(currentDescription)}`;
        
        try {
          await api.put(updateUrl, payload);
          toast.success("Đã cập nhật lộ trình thành công!");
        } catch (putError) {
          console.error("PUT request failed details:", putError);
          toast.error(putError.response?.data || "Cập nhật lộ trình không thành công!");
          setLoading(false);
          return;
        }
      } else {
        // For create, we just need the skin name
        const createUrl = `/plan-skin-cares/${encodeURIComponent(selectedSkinType.label)}`;
        
        try {
          await api.post(createUrl, payload);
          toast.success("Đã thêm lộ trình mới thành công!");
        } catch (postError) {
          console.error("POST request failed:", postError);
          toast.error(postError.response?.data || "Thêm lộ trình mới không thành công!");
          setLoading(false);
          return;
        }
      }
  
      await fetchPlans();
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data || 
        error.message ||
        (editingPlan 
          ? "Cập nhật lộ trình không thành công!" 
          : "Thêm lộ trình mới không thành công!")
      );
    } finally {
      setLoading(false);
    }
  };
  
  const columns = [
    {
      title: "Loại da",
      dataIndex: "skinTypeLabel",
      key: "skinTypeLabel",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "Không có mô tả"
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusData = statusMapping[status] || { text: "KHÔNG XÁC ĐỊNH", color: "gray" };
        return <Tag color={statusData.color}>{statusData.text}</Tag>;
      }
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              icon={<EyeOutlined />} 
              onClick={() => {
                setSelectedPlan(record);
                setDetailModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => handleEditPlan(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn vô hiệu hóa lộ trình này?"
            onConfirm={() => handleDeletePlan(record)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Vô hiệu hóa">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];
  
  return (
    <div style={{ padding: 24 }}>
      <ToastContainer />
      <Spin spinning={loading}>
        <h1>Quản lý lộ trình chăm sóc da</h1>
        
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
            Thêm lộ trình mới
          </Button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Input 
              placeholder="Tìm kiếm theo mô tả"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 250 }}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Tìm kiếm
            </Button>
            {isSearching && (
              <Button icon={<ReloadOutlined />} onClick={handleResetSearch}>
                Xem tất cả
              </Button>
            )}
          </div>
        </div>
        
        {isSearching && (
          <div style={{ marginBottom: 16 }}>
            <p>Kết quả tìm kiếm cho: "{searchTerm}"</p>
          </div>
        )}
        
        <Table
          dataSource={planList}
          columns={columns}
          rowKey="key"
          bordered
          loading={loading}
        />
        
        <Modal
          title={editingPlan ? "Chỉnh sửa lộ trình" : "Tạo lộ trình mới"}
          open={isModalOpen}
          onCancel={handleCloseModal}
          onOk={() => formInstance.submit()}
          okText={editingPlan ? "Cập nhật" : "Tạo"}
          cancelText="Hủy"
          width={800}
          confirmLoading={loading}
        >
          <Form form={formInstance} onFinish={handleSubmitForm} layout="vertical">
            <Form.Item
              label="Loại da"
              name="skinName"
              rules={[{ required: true, message: "Vui lòng chọn loại da!" }]}
            >
              <Select
                options={skinTypes}
                loading={skinTypes.length === 0}
                placeholder="Chọn loại da"
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            {editingPlan &&
            <Form.Item
              label="Trạng thái"
              name="status"
              initialValue={1}
            >
              <Select>
                <Select.Option value={1}>Hoạt động</Select.Option>
                <Select.Option value={0}>Không hoạt động</Select.Option>
              </Select>
            </Form.Item>
            }
          </Form>
        </Modal>
        
        <Modal
          title="Chi tiết lộ trình"
          open={isDetailModalOpen}
          onCancel={() => setDetailModalOpen(false)}
          footer={null}
          width={800}
        >
          {selectedPlan && (
            <div>
              <p><strong>Loại da:</strong> {selectedPlan.skinTypeLabel}</p>
              <p><strong>Mô tả:</strong> {selectedPlan.description}</p>
              <p><strong>Trạng thái:</strong> 
                <Tag color={statusMapping[selectedPlan.status]?.color || 'gray'}>
                  {statusMapping[selectedPlan.status]?.text || 'Không xác định'}
                </Tag>
              </p>
            </div>
          )}
        </Modal>
      </Spin>
    </div>
  );
};

export default PlanSkincare;