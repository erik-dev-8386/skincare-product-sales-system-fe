// // import {
// //   Button,
// //   Form,
// //   Input,
// //   Modal,
// //   Table,
// //   Popconfirm,
// //   Tag,
// //   InputNumber,
// // } from "antd";
// // import { useEffect, useState, useCallback } from "react";
// // import api from "../../../config/api";
// // import { toast, ToastContainer } from "react-toastify";
// // import MyEditor from "../../../component/TinyMCE/MyEditor";

// // const AnswerManagement = () => {
// //   const [answerList, setAnswerList] = useState([]);
// //   const [isModalOpen, setModalOpen] = useState(false);
// //   const [editingAnswer, setEditingAnswer] = useState(null);
// //   const [isDetailModalOpen, setDetailModalOpen] = useState(false);
// //   const [selectedAnswer, setSelectedAnswer] = useState(null);
// //   const [formInstance] = Form.useForm();
// //   const [searchKeyword, setSearchKeyword] = useState("");

// //   const fetchAnswers = useCallback(async () => {
// //     try {
// //       const response = await api.get("/haven-skin/answers");
// //       setAnswerList(response.data);
// //     } catch (error) {
// //       console.error(error);
// //       toast.error("Không thể tải danh sách câu trả lời!");
// //     }
// //   }, []);

// //   useEffect(() => {
// //     fetchAnswers();
// //   }, [fetchAnswers]);

// //   const handleOpenModal = () => {
// //     formInstance.resetFields();
// //     setEditingAnswer(null);
// //     setModalOpen(true);
// //   };

// //   const handleCloseModal = () => {
// //     formInstance.resetFields();
// //     setEditingAnswer(null);
// //     setModalOpen(false);
// //   };

// //   const handleEditAnswer = (answer) => {
// //     setEditingAnswer(answer);
// //     formInstance.setFieldsValue({
// //       answerContent: answer.answerContent,
// //       mark: answer.mark,
// //       questionId: answer.questionId,
// //     });
// //     setModalOpen(true);
// //   };

// //   const handleViewDetails = (answer) => {
// //     setSelectedAnswer(answer);
// //     setDetailModalOpen(true);
// //   };

// //   const handleCloseDetailModal = () => {
// //     setDetailModalOpen(false);
// //     setSelectedAnswer(null);
// //   };

// //   const handleSearch = async () => {
// //     try {
// //       if (searchKeyword.trim()) {
// //         const response = await api.get(
// //           `/haven-skin/answers/search?keyword=${searchKeyword}`
// //         );
// //         setAnswerList(response.data);
// //       } else {
// //         fetchAnswers();
// //       }
// //     } catch (error) {
// //       console.error(error);
// //       toast.error("Tìm kiếm thất bại!");
// //     }
// //   };

// //   const handleSubmitForm = async (values) => {
// //     try {
// //       if (editingAnswer) {
// //         await api.put(`/haven-skin/answers/${editingAnswer.answerId}`, values);
// //         toast.success("Đã sửa câu trả lời thành công!");
// //       } else {
// //         await api.post("/haven-skin/answers", values);
// //         toast.success("Đã thêm câu trả lời mới thành công!");
// //       }
// //       await fetchAnswers();
// //       handleCloseModal();
// //     } catch (error) {
// //       toast.error(
// //         editingAnswer
// //           ? "Cập nhật câu trả lời không thành công!"
// //           : "Thêm câu trả lời mới không thành công!"
// //       );
// //     }
// //   };

// //   const handleDeleteAnswer = async (answerId) => {
// //     try {
// //       await api.delete(`/haven-skin/answers/${answerId}`);
// //       await fetchAnswers();
// //       toast.success("Xóa câu trả lời thành công!");
// //     } catch (error) {
// //       console.error(error);
// //       toast.error("Xóa câu trả lời thất bại!");
// //     }
// //   };

// //   const columns = [
// //     {
// //       title: "Nội dung câu trả lời",
// //       dataIndex: "answerContent",
// //       key: "answerContent",
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
// //       title: "Điểm",
// //       dataIndex: "mark",
// //       key: "mark",
// //     },
// //     {
// //       title: "ID Câu hỏi",
// //       dataIndex: "questionId",
// //       key: "questionId",
// //     },
// //     {
// //       title: "Nút điều khiển",
// //       key: "actions",
// //       render: (_, record) => (
// //         <div className="button">
// //           <Button
// //             type="primary"
// //             onClick={() => handleEditAnswer(record)}
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
// //             title="Bạn có muốn xóa câu trả lời này không?"
// //             onConfirm={() => handleDeleteAnswer(record.answerId)}
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
// //       <h1>Quản lý câu trả lời</h1>

// //       <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
// //         <Input
// //           placeholder="Tìm kiếm câu trả lời..."
// //           value={searchKeyword}
// //           onChange={(e) => setSearchKeyword(e.target.value)}
// //           style={{ width: 300 }}
// //         />
// //         <Button type="primary" onClick={handleSearch}>
// //           <i className="fa-solid fa-search"></i> Tìm kiếm
// //         </Button>
// //         <Button type="primary" onClick={handleOpenModal}>
// //           <i className="fa-solid fa-plus"></i> Thêm câu trả lời mới
// //         </Button>
// //       </div>

// //       <Table
// //         dataSource={answerList}
// //         columns={columns}
// //         rowKey="answerId"
// //         style={{ marginTop: 16 }}
// //       />

// //       <Modal
// //         title={editingAnswer ? "Chỉnh sửa câu trả lời" : "Tạo câu trả lời mới"}
// //         open={isModalOpen}
// //         onCancel={handleCloseModal}
// //         footer={null}
// //         destroyOnClose
// //       >
// //         <Form form={formInstance} onFinish={handleSubmitForm} layout="vertical">
// //           <Form.Item
// //             label="Nội dung câu trả lời"
// //             name="answerContent"
// //             rules={[
// //               {
// //                 required: true,
// //                 message: "Vui lòng nhập nội dung câu trả lời!",
// //               },
// //             ]}
// //           >
// //             <MyEditor />
// //           </Form.Item>

// //           <Form.Item
// //             label="Điểm"
// //             name="mark"
// //             rules={[{ required: true, message: "Vui lòng nhập điểm!" }]}
// //           >
// //             <InputNumber min={0} max={100} style={{ width: "100%" }} />
// //           </Form.Item>

// //           <Form.Item
// //             label="ID Câu hỏi"
// //             name="questionId"
// //             rules={[{ required: true, message: "Vui lòng nhập ID câu hỏi!" }]}
// //           >
// //             <Input />
// //           </Form.Item>

// //           <Form.Item>
// //             <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
// //               {editingAnswer ? "Cập nhật" : "Tạo mới"}
// //             </Button>
// //             <Button onClick={handleCloseModal}>Hủy</Button>
// //           </Form.Item>
// //         </Form>
// //       </Modal>

// //       <Modal
// //         title="Chi tiết câu trả lời"
// //         open={isDetailModalOpen}
// //         onCancel={handleCloseDetailModal}
// //         footer={null}
// //         width={800}
// //       >
// //         {selectedAnswer && (
// //           <div>
// //             <p>
// //               <strong>ID:</strong> {selectedAnswer.answerId}
// //             </p>
// //             <p>
// //               <strong>Nội dung câu trả lời:</strong>
// //             </p>
// //             <div
// //               dangerouslySetInnerHTML={{ __html: selectedAnswer.answerContent }}
// //             />
// //             <p>
// //               <strong>Điểm:</strong> {selectedAnswer.mark}
// //             </p>
// //             <p>
// //               <strong>ID Câu hỏi:</strong> {selectedAnswer.questionId}
// //             </p>
// //           </div>
// //         )}
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default AnswerManagement;
// import {
//   Button,
//   Form,
//   Input,
//   Modal,
//   Table,
//   Popconfirm,
//   Tag,
//   InputNumber,
// } from "antd";
// import { useEffect, useState, useCallback } from "react";
// import api from "../../../config/api";
// import { toast, ToastContainer } from "react-toastify";
// import MyEditor from "../../../component/TinyMCE/MyEditor";

// const AnswerManagement = () => {
//   const [answerList, setAnswerList] = useState([]);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [editingAnswer, setEditingAnswer] = useState(null);
//   const [isDetailModalOpen, setDetailModalOpen] = useState(false);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [formInstance] = Form.useForm();
//   const [searchKeyword, setSearchKeyword] = useState("");

//   const fetchAnswers = useCallback(async () => {
//     try {
//       const response = await api.get("/answers");
//       setAnswerList(response.data);
//     } catch (error) {
//       console.error(error);
//       toast.error("Không thể tải danh sách câu trả lời!");
//     }
//   }, []);

//   useEffect(() => {
//     fetchAnswers();
//   }, [fetchAnswers]);

//   const handleOpenModal = () => {
//     formInstance.resetFields();
//     setEditingAnswer(null);
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     formInstance.resetFields();
//     setEditingAnswer(null);
//     setModalOpen(false);
//   };

//   const handleEditAnswer = (answer) => {
//     setEditingAnswer(answer);
//     formInstance.setFieldsValue({
//       answerContent: answer.answerContent,
//       mark: answer.mark,
//       questionContent: answer.questionContent,
//     });
//     setModalOpen(true);
//   };

//   const handleViewDetails = (answer) => {
//     setSelectedAnswer(answer);
//     setDetailModalOpen(true);
//   };

//   const handleCloseDetailModal = () => {
//     setDetailModalOpen(false);
//     setSelectedAnswer(null);
//   };

//   const handleSearch = async () => {
//     try {
//       if (searchKeyword.trim()) {
//         const response = await api.get(
//           `/haven-skin/answers/search?keyword=${searchKeyword}`
//         );
//         setAnswerList(response.data);
//       } else {
//         fetchAnswers();
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Tìm kiếm thất bại!");
//     }
//   };

//   const handleSubmitForm = async (values) => {
//     try {
//       const { answerContent, mark, questionContent } = values;

//       const url = `http://localhost:8080/haven-skin/answers/add-by-question-content?questionContent=${encodeURIComponent(
//         questionContent
//       )}`;

//       const response = await api.post(url, {
//         answerContent,
//         mark,
//       });

//       toast.success("Đã thêm câu trả lời mới thành công!");
//       await fetchAnswers();
//       handleCloseModal();
//     } catch (error) {
//       console.error(error);
//       toast.error("Thêm câu trả lời mới không thành công!");
//     }
//   };

//   const handleDeleteAnswer = async (answerId) => {
//     try {
//       await api.delete(`/answers/${answerId}`);
//       await fetchAnswers();
//       toast.success("Xóa câu trả lời thành công!");
//     } catch (error) {
//       console.error(error);
//       toast.error("Xóa câu trả lời thất bại!");
//     }
//   };

//   const columns = [
//     {
//       title: "Nội dung câu trả lời",
//       dataIndex: "answerContent",
//       key: "answerContent",
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
//       title: "Điểm",
//       dataIndex: "mark",
//       key: "mark",
//     },
//     {
//       title: "Nội dung câu hỏi",
//       dataIndex: "questionContent",
//       key: "questionContent",
//     },
//     {
//       title: "Nút điều khiển",
//       key: "actions",
//       render: (_, record) => (
//         <div className="button">
//           <Button
//             type="primary"
//             onClick={() => handleEditAnswer(record)}
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
//             title="Bạn có muốn xóa câu trả lời này không?"
//             onConfirm={() => handleDeleteAnswer(record.answerId)}
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
//       <h1>Quản lý câu trả lời</h1>

//       <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
//         <Input
//           placeholder="Tìm kiếm câu trả lời..."
//           value={searchKeyword}
//           onChange={(e) => setSearchKeyword(e.target.value)}
//           style={{ width: 300 }}
//         />
//         <Button type="primary" onClick={handleSearch}>
//           <i className="fa-solid fa-search"></i> Tìm kiếm
//         </Button>
//         <Button type="primary" onClick={handleOpenModal}>
//           <i className="fa-solid fa-plus"></i> Thêm câu trả lời mới
//         </Button>
//       </div>

//       <Table
//         dataSource={answerList}
//         columns={columns}
//         rowKey="answerId"
//         style={{ marginTop: 16 }}
//       />

//       <Modal
//         title={editingAnswer ? "Chỉnh sửa câu trả lời" : "Tạo câu trả lời mới"}
//         open={isModalOpen}
//         onCancel={handleCloseModal}
//         footer={null}
//         destroyOnClose
//       >
//         <Form form={formInstance} onFinish={handleSubmitForm} layout="vertical">
//           <Form.Item
//             label="Nội dung câu hỏi"
//             name="questionContent"
//             rules={[
//               {
//                 required: true,
//                 message: "Vui lòng nhập nội dung câu hỏi!",
//               },
//             ]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             label="Nội dung câu trả lời"
//             name="answerContent"
//             rules={[
//               {
//                 required: true,
//                 message: "Vui lòng nhập nội dung câu trả lời!",
//               },
//             ]}
//           >
//             <MyEditor />
//           </Form.Item>

//           <Form.Item
//             label="Điểm"
//             name="mark"
//             rules={[{ required: true, message: "Vui lòng nhập điểm!" }]}
//           >
//             <InputNumber min={0} max={100} style={{ width: "100%" }} />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
//               {editingAnswer ? "Cập nhật" : "Tạo mới"}
//             </Button>
//             <Button onClick={handleCloseModal}>Hủy</Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       <Modal
//         title="Chi tiết câu trả lời"
//         open={isDetailModalOpen}
//         onCancel={handleCloseDetailModal}
//         footer={null}
//         width={800}
//       >
//         {selectedAnswer && (
//           <div>
//             <p>
//               <strong>ID:</strong> {selectedAnswer.answerId}
//             </p>
//             <p>
//               <strong>Nội dung câu trả lời:</strong>
//             </p>
//             <div
//               dangerouslySetInnerHTML={{ __html: selectedAnswer.answerContent }}
//             />
//             <p>
//               <strong>Điểm:</strong> {selectedAnswer.mark}
//             </p>
//             <p>
//               <strong>Nội dung câu hỏi:</strong> {selectedAnswer.questionContent}
//             </p>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default AnswerManagement;

import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  Popconfirm,
  Tag,
  InputNumber,
  Select,
} from "antd";
import { useEffect, useState, useCallback } from "react";
import api from "../../../config/api";
import { toast, ToastContainer } from "react-toastify";
import MyEditor from "../../../component/TinyMCE/MyEditor";

const AnswerManagement = () => {
  const [answerList, setAnswerList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [formInstance] = Form.useForm();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [questionContents, setQuestionContents] = useState([]);

  const fetchAnswers = useCallback(async () => {
    try {
      const response = await api.get("/answers");
      setAnswerList(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách câu trả lời!");
    }
  }, []);

  useEffect(() => {
    fetchAnswers();
  }, [fetchAnswers]);

  useEffect(() => {
    const fetchQuestionContents = async () => {
      try {
        const response = await api.get("/questions/find-by-content-question");
        setQuestionContents(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải danh sách câu hỏi!");
      }
    };

    fetchQuestionContents();
  }, []);

  const handleOpenModal = () => {
    formInstance.resetFields();
    setEditingAnswer(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    formInstance.resetFields();
    setEditingAnswer(null);
    setModalOpen(false);
  };

  const handleEditAnswer = (answer) => {
    setEditingAnswer(answer);
    formInstance.setFieldsValue({
      answerContent: answer.answerContent,
      mark: answer.mark,
      questionContent: answer.questionContent,
    });
    setModalOpen(true);
  };

  const handleViewDetails = (answer) => {
    setSelectedAnswer(answer);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedAnswer(null);
  };

  const handleSearch = async () => {
    try {
      if (searchKeyword.trim()) {
        const response = await api.get(
          `/answers/search?keyword=${searchKeyword}`
        );
        setAnswerList(response.data);
      } else {
        fetchAnswers();
      }
    } catch (error) {
      console.error(error);
      toast.error("Tìm kiếm thất bại!");
    }
  };

  const handleSubmitForm = async (values) => {
    try {
      const { answerContent, mark, questionContent } = values;

      const url = `/answers/add-by-question-content?questionContent=${encodeURIComponent(
        questionContent
      )}`;

      const response = await api.post(url, {
        answerContent,
        mark,
      });

      toast.success("Đã thêm câu trả lời mới thành công!");
      await fetchAnswers();
      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast.error("Thêm câu trả lời mới không thành công!");
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      await api.delete(`/answers/${answerId}`);
      await fetchAnswers();
      toast.success("Xóa câu trả lời thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Xóa câu trả lời thất bại!");
    }
  };

  const columns = [
    {
      title: "Nội dung câu trả lời",
      dataIndex: "answerContent",
      key: "answerContent",
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
      title: "Điểm",
      dataIndex: "mark",
      key: "mark",
    },
    {
      title: "Nội dung câu hỏi",
      dataIndex: "questionContent",
      key: "questionContent",
    },
    {
      title: "Nút điều khiển",
      key: "actions",
      render: (_, record) => (
        <div className="button">
          <Button
            type="primary"
            onClick={() => handleEditAnswer(record)}
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
            title="Bạn có muốn xóa câu trả lời này không?"
            onConfirm={() => handleDeleteAnswer(record.answerId)}
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
      <h1>Quản lý câu trả lời</h1>

      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <Input
          placeholder="Tìm kiếm câu trả lời..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleSearch}>
          <i className="fa-solid fa-search"></i> Tìm kiếm
        </Button>
        <Button type="primary" onClick={handleOpenModal}>
          <i className="fa-solid fa-plus"></i> Thêm câu trả lời mới
        </Button>
      </div>

      <Table
        dataSource={answerList}
        columns={columns}
        rowKey="answerId"
        style={{ marginTop: 16 }}
      />

      <Modal
        title={editingAnswer ? "Chỉnh sửa câu trả lời" : "Tạo câu trả lời mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
      >
        <Form form={formInstance} onFinish={handleSubmitForm} layout="vertical">
          <Form.Item
            label="Nội dung câu hỏi"
            name="questionContent"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn nội dung câu hỏi!",
              },
            ]}
          >
            <Select placeholder="Chọn nội dung câu hỏi">
              {questionContents.map((content, index) => (
                <Select.Option key={index} value={content}>
                  {content}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Nội dung câu trả lời"
            name="answerContent"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập nội dung câu trả lời!",
              },
            ]}
          >
            <MyEditor />
          </Form.Item>

          <Form.Item
            label="Điểm"
            name="mark"
            rules={[{ required: true, message: "Vui lòng nhập điểm!" }]}
          >
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              {editingAnswer ? "Cập nhật" : "Tạo mới"}
            </Button>
            <Button onClick={handleCloseModal}>Hủy</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết câu trả lời"
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={800}
      >
        {selectedAnswer && (
          <div>
            <p>
              <strong>ID:</strong> {selectedAnswer.answerId}
            </p>
            <p>
              <strong>Nội dung câu trả lời:</strong>
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: selectedAnswer.answerContent }}
            />
            <p>
              <strong>Điểm:</strong> {selectedAnswer.mark}
            </p>
            <p>
              <strong>Nội dung câu hỏi:</strong>{" "}
              {selectedAnswer.questionContent}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AnswerManagement;
