
import React, { useEffect, useState, useCallback } from "react";
import { Button, Form, Input, Modal, Table, Popconfirm, Tag, Select, Tooltip } from "antd";
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
    setNewQuestionContent("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    formInstance.resetFields();
    setEditingQuestion(null);
    setNewQuestionContent("");
    setModalOpen(false);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    formInstance.setFieldsValue({
      questionContent: question.questionContent,
      maxMark: question.maxMark,
      status: question.status
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
        <div className="button" style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "20px", alignItems: "center" }}>
        
            <Tooltip title="Sửa">
          <Button
            color="orange"
            variant="filled"
            onClick={() => handleEditQuestion(record)}
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
            title="Bạn có muốn xóa sản phẩm này không?"
            onConfirm={() => handleDeleteQuestion(record.questionId)}
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
        <Form form={formInstance} onFinish={handleSubmitForm} layout="vertical">
          <Form.Item
            label="Nội dung câu hỏi"
            name="questionContent"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung câu hỏi!" },
            ]}
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

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Select.Option value={1}>Hoạt động</Select.Option>
              <Select.Option value={0}>Không hoạt động</Select.Option>
            </Select>
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
              <strong>Nội dung câu hỏi:</strong>{" "}
              {selectedQuestion.questionContent}
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