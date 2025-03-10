// // import {
// //   Button,
// //   Form,
// //   Input,
// //   Modal,
// //   Table,
// //   Popconfirm,
// //   Select,
// //   Tag,
// // } from "antd";
// // import { useEffect, useState, useCallback } from "react";
// // import api from "../../../config/api";
// // import { toast, ToastContainer } from "react-toastify";
// // import MyEditor from "../../../component/TinyMCE/MyEditor";

// // import React from "react";

// // const QuestionManagement = () => {
// //   const { Option } = Select;
// //   const [questionList, setQuestionList] = useState([]);
// //   const [isModalOpen, setModalOpen] = useState(false);
// //   const [editingQuestion, setEditingQuestion] = useState(null);
// //   const [isDetailModalOpen, setDetailModalOpen] = useState(false);
// //   const [selectedQuestion, setSelectedQuestion] = useState(null);
// //   const [formInstance] = Form.useForm();

// //   const statusMapping = {
// //     0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
// //     1: { text: "HOẠT ĐỘNG", color: "green" },
// //   };

// //   const fetchQuestion = useCallback(async () => {
// //     try {
// //       const response = await api.get("/questions");
// //       setQuestionList(response.data);
// //     } catch (error) {
// //       console.error(error);
// //       toast.error("Không thể tải danh sách câu hỏi!");
// //     }
// //   }, []);

// //   // mỗi lần render là sẽ gọi fetchQuestion
// //   useEffect(() => {
// //     fetchQuestion();
// //   }, [fetchQuestion]);

// //   // nhấn nút mở thì sẽ clear dữ liệu cũ
// //   const handleOpenModal = () => {
// //     formInstance.resetFields(); // reset các filed
// //     setEditingQuestion(null);  // lưu thông tin câu hỏi đang được sửa
// //     setModalOpen(true);
// //   };

// //   const handleCloseModal = () => {
// //     formInstance.resetFields();
// //     setEditingQuestion(null);
// //     setModalOpen(false);
// //   };

// //   const handleEditQuestion = (question) => {
// //     setEditingQuestion(question);
// //     formInstance.setFieldsValue({
// //       questionName: question.questionName,
// //       description: question.description || "",
// //       minScore: question.minScore,
// //       maxScore: question.maxScore,
// //       status: question.status,
// //     });
// //     setModalOpen(true);
// //   };

// //   const handleViewDetails = (question) => {
// //     setSelectedQuestion(question);
// //     setDetailModalOpen(true);
// //   };

// //   const handleCloseDetailModal = () => {
// //     setDetailModalOpen(false);
// //     setSelectedQuestion(null);
// //   };

// //   const handleSubmitForm = async (values) => {
// //     const isDuplicate = questionList.some(  // kiểm tra trùng lặp câu hỏi
// //       (question) =>
// //         question.questionName === values.questionName &&
// //         (!editingQuestion || question.questionId !== editingQuestion.questionId)
// //     );

// //     if (isDuplicate) {
// //       toast.error("Tên câu hỏi đã tồn tại! Vui lòng nhập tên khác."); //ko trùng lặp
// //       return;
// //     }

// //     try {
// //       if (editingQuestion) {
// //         await api.put(`/questions/${editingQuestion.questionId}`, values); // hàm update
// //         toast.success("Đã sửa câu hỏi thành công!");
// //       } else {
// //         await api.post("/questions", values);
// //         toast.success("Đã thêm câu hỏi mới thành công!");
// //       }
// //       await fetchQuestion();
// //       handleCloseModal();
// //     } catch (error) {
// //       toast.error(
// //         editingQuestion
// //           ? "Cập nhật câu hỏi không thành công!"
// //           : "Thêm câu hỏi mới không thành công!"
// //       );
// //     }
// //   };

// //   const handleDeleteQuestion = async (questionId) => {
// //     try {
// //       await api.delete(`/questions/${questionId}`);
// //       await fetchQuestion();
// //       toast.success("Xóa câu hỏi thành công!");
// //     } catch (error) {
// //       console.error(error);
// //       toast.error("Xóa câu hỏi thất bại!");
// //     }
// //   };

// //   const columns = [
// //     {
// //       title: "Tên Câu hỏi",
// //       dataIndex: "questionName",
// //       key: "questionName",
// //     },
// //     {
// //       title: "Mô tả",
// //       dataIndex: "description",
// //       key: "description",
// //       render: (text) => (
// //         <div
// //           dangerouslySetInnerHTML={{
// //             __html:
// //               text && typeof text === "string"
// //                 ? text.length > 50
// //                   ? text.substring(0, 50) + "..."
// //                   : text
// //                 : "",
// //           }}
// //         />
// //       ),
// //     },
// //     {
// //       title: "Điểm tối thiểu",
// //       dataIndex: "minScore",
// //       key: "minScore",
// //     },
// //     {
// //       title: "Điểm tối đa",
// //       dataIndex: "maxScore",
// //       key: "maxScore",
// //     },
// //     {
// //       title: "Trạng thái",
// //       dataIndex: "status",
// //       key: "status",
// //       render: (status) => {
// //         const statusInfo = statusMapping[status] || {
// //           text: "KHÔNG BIẾT",
// //           color: "default",
// //         };
// //         return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
// //       },
// //     },
// //     {
// //       title: "Nút điều khiển",
// //       key: "actions",
// //       render: (_, record) => (
// //         <div className="button">
// //           <Button
// //             type="primary"
// //             onClick={() => handleEditQuestion(record)}
// //             style={{ marginRight: 8 }}
// //           >
// //             <i className="fa-solid fa-pen-to-square"></i> Sửa
// //           </Button>
// //           <Button
// //             onClick={() => handleViewDetails(record)}
// //             style={{ marginRight: 8 }}
// //           >
// //             <i className="fa-solid fa-eye"></i> Chi tiết
// //           </Button>
// //           <Popconfirm
// //             title="Bạn có muốn xóa câu hỏi này không?"
// //             onConfirm={() => handleDeleteQuestion(record.questionId)}
// //             okText="Có"
// //             cancelText="Không"
// //           >
// //             <Button danger>
// //               <i className="fa-solid fa-trash"></i> Xóa
// //             </Button>
// //           </Popconfirm>
// //         </div>
// //       ),
// //     },
// //   ];

// //   return (
// //     <div>
// //       <ToastContainer />
// //       <h1>Quản lý câu hỏi</h1>
// //       <Button type="primary" onClick={handleOpenModal}>
// //         <i className="fa-solid fa-plus"></i> Thêm câu hỏi mới
// //       </Button>

// //       <Table
// //         dataSource={questionList}
// //         columns={columns}
// //         rowKey="questionId"
// //         style={{ marginTop: 16 }}
// //       />

// //       <Modal
// //         title={editingQuestion ? "Chỉnh sửa câu hỏi" : "Tạo câu hỏi mới"}
// //         open={isModalOpen}
// //         onCancel={handleCloseModal}
// //         footer={null}
// //         destroyOnClose
// //       >
// //         <Form
// //           form={formInstance}
// //           onFinish={handleSubmitForm}
// //           layout="vertical"
// //           initialValues={{
// //             status: 1,
// //             minScore: 0,
// //             maxScore: 100,
// //           }}
// //         >
// //           <Form.Item
// //             label="Tên câu hỏi"
// //             name="questionName"
// //             rules={[{ required: true, message: "Vui lòng nhập tên câu hỏi!" }]}
// //           >
// //             <Input />
// //           </Form.Item>

// //           <Form.Item
// //             label="Mô tả"
// //             name="description"
// //             rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
// //           >
// //             <MyEditor />
// //           </Form.Item>

// //           <Form.Item
// //             label="Điểm tối thiểu"
// //             name="minScore"
// //             rules={[
// //               { required: true, message: "Vui lòng nhập điểm tối thiểu!" },
// //             ]}
// //           >
// //             <Input type="number" />
// //           </Form.Item>

// //           <Form.Item
// //             label="Điểm tối đa"
// //             name="maxScore"
// //             rules={[{ required: true, message: "Vui lòng nhập điểm tối đa!" }]}
// //           >
// //             <Input type="number" />
// //           </Form.Item>

// //           {editingQuestion && (
// //             <Form.Item
// //               label="Trạng thái"
// //               name="status"
// //               rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
// //             >
// //               <Select>
// //                 <Option value={1}>HOẠT ĐỘNG</Option>
// //                 <Option value={0}>KHÔNG HOẠT ĐỘNG</Option>
// //               </Select>
// //             </Form.Item>
// //           )}

// //           <Form.Item>
// //             <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
// //               {editingQuestion ? "Cập nhật" : "Tạo mới"}
// //             </Button>
// //             <Button onClick={handleCloseModal}>Hủy</Button>
// //           </Form.Item>
// //         </Form>
// //       </Modal>

// //       <Modal
// //         title="Chi tiết câu hỏi"
// //         open={isDetailModalOpen}
// //         onCancel={handleCloseDetailModal}
// //         footer={null}
// //         width={800}
// //       >
// //         {selectedQuestion && (
// //           <div>
// //             <p>
// //               <strong>ID:</strong> {selectedQuestion.questionId}
// //             </p>
// //             <p>
// //               <strong>Tên câu hỏi:</strong> {selectedQuestion.questionName}
// //             </p>
// //             <p>
// //               <strong>Mô tả:</strong>
// //             </p>
// //             <div
// //               dangerouslySetInnerHTML={{ __html: selectedQuestion.description }}
// //             />
// //             <p>
// //               <strong>Điểm tối thiểu:</strong> {selectedQuestion.minScore}
// //             </p>
// //             <p>
// //               <strong>Điểm tối đa:</strong> {selectedQuestion.maxScore}
// //             </p>
// //             <p>
// //               <strong>Trạng thái: </strong>
// //               <Tag color={statusMapping[selectedQuestion.status]?.color}>
// //                 {statusMapping[selectedQuestion.status]?.text}
// //               </Tag>
// //             </p>
// //           </div>
// //         )}
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default QuestionManagement;
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Button,
//   Form,
//   Input,
//   Modal,
//   Table,
//   Popconfirm,
//   Tag,
// } from "antd";
// import api from "../../../config/api";
// import { toast, ToastContainer } from "react-toastify";

// const QuestionManagement = () => {
//   const [questionList, setQuestionList] = useState([]);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [editingQuestion, setEditingQuestion] = useState(null);
//   const [isDetailModalOpen, setDetailModalOpen] = useState(false);
//   const [selectedQuestion, setSelectedQuestion] = useState(null);
//   const [formInstance] = Form.useForm();

//   const statusMapping = {
//     0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
//     1: { text: "HOẠT ĐỘNG", color: "green" },
//   };

//   // Hàm fetch danh sách câu hỏi từ BE
//   const fetchQuestion = useCallback(async () => {
//     try {
//       const response = await api.get("/questions");
//       setQuestionList(response.data);
//     } catch (error) {
//       console.error(error);
//       toast.error("Không thể tải danh sách câu hỏi!");
//     }
//   }, []);

//   // Gọi fetchQuestion mỗi khi component render
//   useEffect(() => {
//     fetchQuestion();
//   }, [fetchQuestion]);

//   // Mở modal để tạo mới hoặc chỉnh sửa câu hỏi
//   const handleOpenModal = () => {
//     formInstance.resetFields();
//     setEditingQuestion(null);
//     setModalOpen(true);
//   };

//   // Đóng modal
//   const handleCloseModal = () => {
//     formInstance.resetFields();
//     setEditingQuestion(null);
//     setModalOpen(false);
//   };

//   // Mở modal chỉnh sửa với dữ liệu câu hỏi hiện tại
//   const handleEditQuestion = (question) => {
//     setEditingQuestion(question);
//     formInstance.setFieldsValue({
//       questionContent: question.questionContent,
//       maxMark: question.maxMark,
//     });
//     setModalOpen(true);
//   };

//   // Xem chi tiết câu hỏi
//   const handleViewDetails = (question) => {
//     setSelectedQuestion(question);
//     setDetailModalOpen(true);
//   };

//   // Đóng modal chi tiết
//   const handleCloseDetailModal = () => {
//     setDetailModalOpen(false);
//     setSelectedQuestion(null);
//   };

//   // Xử lý khi submit form (tạo mới hoặc cập nhật)
//   const handleSubmitForm = async (values) => {
//     try {
//       // Thêm skinTestID vào dữ liệu gửi lên BE
//       const data = {
//         ...values,
//         skinTestID: 1, // skinTestID luôn là 1
//       };

//       if (editingQuestion) {
//         // Nếu đang chỉnh sửa, gọi API PUT
//         await api.put(`/questions/${editingQuestion.questionId}`, data);
//         toast.success("Đã cập nhật câu hỏi thành công!");
//       } else {
//         // Nếu đang tạo mới, gọi API POST
//         await api.post("/questions", data);
//         toast.success("Đã thêm câu hỏi mới thành công!");
//       }

//       // Cập nhật lại danh sách câu hỏi
//       await fetchQuestion();
//       // Đóng modal
//       handleCloseModal();
//     } catch (error) {
//       toast.error(
//         editingQuestion
//           ? "Cập nhật câu hỏi không thành công!"
//           : "Thêm câu hỏi mới không thành công!"
//       );
//     }
//   };

//   // Xóa câu hỏi
//   const handleDeleteQuestion = async (questionId) => {
//     try {
//       await api.delete(`/questions/${questionId}`);
//       await fetchQuestion();
//       toast.success("Xóa câu hỏi thành công!");
//     } catch (error) {
//       console.error(error);
//       toast.error("Xóa câu hỏi thất bại!");
//     }
//   };

//   // Cột của bảng hiển thị danh sách câu hỏi
//   const columns = [
//     {
//       title: "Nội dung câu hỏi",
//       dataIndex: "questionContent",
//       key: "questionContent",
//     },
//     {
//       title: "Điểm tối đa",
//       dataIndex: "maxMark",
//       key: "maxMark",
//     },
//     {
//       title: "Trạng thái",
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
//       title: "Nút điều khiển",
//       key: "actions",
//       render: (_, record) => (
//         <div className="button">
//           <Button
//             type="primary"
//             onClick={() => handleEditQuestion(record)}
//             style={{ marginRight: 8 }}
//           >
//             <i className="fa-solid fa-pen-to-square"></i> Sửa
//           </Button>
//           <Button
//             onClick={() => handleViewDetails(record)}
//             style={{ marginRight: 8 }}
//           >
//             <i className="fa-solid fa-eye"></i> Chi tiết
//           </Button>
//           <Popconfirm
//             title="Bạn có muốn xóa câu hỏi này không?"
//             onConfirm={() => handleDeleteQuestion(record.questionId)}
//             okText="Có"
//             cancelText="Không"
//           >
//             <Button danger>
//               <i className="fa-solid fa-trash"></i> Xóa
//             </Button>
//           </Popconfirm>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <ToastContainer />
//       <h1>Quản lý câu hỏi</h1>
//       <Button type="primary" onClick={handleOpenModal}>
//         <i className="fa-solid fa-plus"></i> Thêm câu hỏi mới
//       </Button>

//       <Table
//         dataSource={questionList}
//         columns={columns}
//         rowKey="questionId"
//         style={{ marginTop: 16 }}
//       />

//       {/* Modal để tạo mới hoặc chỉnh sửa câu hỏi */}
//       <Modal
//         title={editingQuestion ? "Chỉnh sửa câu hỏi" : "Tạo câu hỏi mới"}
//         open={isModalOpen}
//         onCancel={handleCloseModal}
//         footer={null}
//         destroyOnClose
//       >
//         <Form
//           form={formInstance}
//           onFinish={handleSubmitForm}
//           layout="vertical"
//         >
//           <Form.Item
//             label="Nội dung câu hỏi"
//             name="questionContent"
//             rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi!" }]}
//           >
//             <Input.TextArea />
//           </Form.Item>

//           <Form.Item
//             label="Điểm tối đa"
//             name="maxMark"
//             rules={[{ required: true, message: "Vui lòng nhập điểm tối đa!" }]}
//           >
//             <Input type="number" />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
//               {editingQuestion ? "Cập nhật" : "Tạo mới"}
//             </Button>
//             <Button onClick={handleCloseModal}>Hủy</Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Modal để xem chi tiết câu hỏi */}
//       <Modal
//         title="Chi tiết câu hỏi"
//         open={isDetailModalOpen}
//         onCancel={handleCloseDetailModal}
//         footer={null}
//         width={800}
//       >
//         {selectedQuestion && (
//           <div>
//             <p>
//               <strong>ID:</strong> {selectedQuestion.questionId}
//             </p>
//             <p>
//               <strong>Nội dung câu hỏi:</strong> {selectedQuestion.questionContent}
//             </p>
//             <p>
//               <strong>Điểm tối đa:</strong> {selectedQuestion.maxMark}
//             </p>
//             <p>
//               <strong>Trạng thái: </strong>
//               <Tag color={statusMapping[selectedQuestion.status]?.color}>
//                 {statusMapping[selectedQuestion.status]?.text}
//               </Tag>
//             </p>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default QuestionManagement;

import React, { useEffect, useState, useCallback } from "react";
import { Button, Form, Input, Modal, Table, Popconfirm, Tag } from "antd";
import api from "../../../config/api";
import { toast, ToastContainer } from "react-toastify";

const QuestionManagement = () => {
  const [questionList, setQuestionList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [formInstance] = Form.useForm();

  const statusMapping = {
    0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
    1: { text: "HOẠT ĐỘNG", color: "green" },
  };

  const fetchQuestion = useCallback(async () => {
    try {
      const response = await api.get("/questions");
      setQuestionList(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách câu hỏi!");
    }
  }, []);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleOpenModal = () => {
    formInstance.resetFields();
    setEditingQuestion(null);
    setNewQuestionContent(""); // Reset nội dung câu hỏi mới
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    formInstance.resetFields();
    setEditingQuestion(null);
    setNewQuestionContent(""); // Reset nội dung câu hỏi mới
    setModalOpen(false);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    formInstance.setFieldsValue({
      questionContent: question.questionContent,
      maxMark: question.maxMark,
    });
    setModalOpen(true);
  };

  const handleViewDetails = (question) => {
    setSelectedQuestion(question);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleQuestionContentChange = (e) => {
    setNewQuestionContent(e.target.value);
  };

  const handleSubmitForm = async (values) => {
    try {
      const data = {
        ...values,
        skinTestID: 1,
      };

      if (editingQuestion) {
        await api.put(`/questions/${editingQuestion.questionId}`, data);
        toast.success("Đã cập nhật câu hỏi thành công!");
      } else {
        await api.post("/questions", data);
        toast.success("Đã thêm câu hỏi mới thành công!");
      }

      await fetchQuestion();
      handleCloseModal();
    } catch (error) {
      toast.error(
        editingQuestion
          ? "Cập nhật câu hỏi không thành công!"
          : "Thêm câu hỏi mới không thành công!"
      );
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await api.delete(`/questions/${questionId}`);
      await fetchQuestion();
      toast.success("Xóa câu hỏi thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Xóa câu hỏi thất bại!");
    }
  };

  const columns = [
    {
      title: "Nội dung câu hỏi",
      dataIndex: "questionContent",
      key: "questionContent",
    },
    {
      title: "Điểm tối đa",
      dataIndex: "maxMark",
      key: "maxMark",
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
      render: (_, record) => (
        <div className="button">
          <Button
            type="primary"
            onClick={() => handleEditQuestion(record)}
            style={{ marginRight: 8 }}
          >
            <i className="fa-solid fa-pen-to-square"></i> Sửa
          </Button>
          <Button
            onClick={() => handleViewDetails(record)}
            style={{ marginRight: 8 }}
          >
            <i className="fa-solid fa-eye"></i> Chi tiết
          </Button>
          <Popconfirm
            title="Bạn có muốn xóa câu hỏi này không?"
            onConfirm={() => handleDeleteQuestion(record.questionId)}
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

  return (
    <div>
      <ToastContainer />
      <h1>Quản lý câu hỏi</h1>
      <Button type="primary" onClick={handleOpenModal}>
        <i className="fa-solid fa-plus"></i> Thêm câu hỏi mới
      </Button>

      <Table
        dataSource={questionList}
        columns={columns}
        rowKey="questionId"
        style={{ marginTop: 16 }}
      />

      <Modal
        title={editingQuestion ? "Chỉnh sửa câu hỏi" : "Tạo câu hỏi mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
      >
        <Form
          form={formInstance}
          onFinish={handleSubmitForm}
          layout="vertical"
        >
          <Form.Item
            label="Nội dung câu hỏi"
            name="questionContent"
            rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi!" }]}
          >
            <Input.TextArea onChange={handleQuestionContentChange} />
          </Form.Item>

          <Form.Item
            label="Điểm tối đa"
            name="maxMark"
            rules={[{ required: true, message: "Vui lòng nhập điểm tối đa!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              {editingQuestion ? "Cập nhật" : "Tạo mới"}
            </Button>
            <Button onClick={handleCloseModal}>Hủy</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết câu hỏi"
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={800}
      >
        {selectedQuestion && (
          <div>
            <p>
              <strong>ID:</strong> {selectedQuestion.questionId}
            </p>
            <p>
              <strong>Nội dung câu hỏi:</strong> {selectedQuestion.questionContent}
            </p>
            <p>
              <strong>Điểm tối đa:</strong> {selectedQuestion.maxMark}
            </p>
            <p>
              <strong>Trạng thái: </strong>
              <Tag color={statusMapping[selectedQuestion.status]?.color}>
                {statusMapping[selectedQuestion.status]?.text}
              </Tag>
            </p>
          </div>
        )}
      </Modal>

      {/* Hiển thị nội dung câu hỏi mới */}
      {newQuestionContent && (
        <div style={{ marginTop: 16 }}>
          <h3>Nội dung câu hỏi mới:</h3>
          <p>{newQuestionContent}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionManagement;