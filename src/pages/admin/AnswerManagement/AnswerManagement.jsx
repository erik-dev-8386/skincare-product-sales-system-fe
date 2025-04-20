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
  Tooltip,
  Space,
  Divider
} from "antd";
import { useEffect, useState, useCallback } from "react";
import api from "../../../config/api";
import { toast, ToastContainer } from "react-toastify";
import MyEditor from "../../../component/TinyMCE/MyEditor";

const AnswerManagement = () => {
  const [answerList, setAnswerList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [form] = Form.useForm();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [questionContents, setQuestionContents] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusMapping = {
    0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
    1: { text: "HOẠT ĐỘNG", color: "green" },
  };

  const fetchAnswers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/answers");
      setAnswerList(response.data);
    } catch (error) {
      console.error("Fetch answers error:", error);
      toast.error("Không thể tải danh sách câu trả lời!");
    } finally {
      setLoading(false);
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
        console.error("Fetch questions error:", error);
        toast.error("Không thể tải danh sách câu hỏi!");
      }
    };
    fetchQuestionContents();
  }, []);

  const handleOpenModal = () => {
    form.resetFields();
    setEditingAnswer(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    form.resetFields();
    setEditingAnswer(null);
    setIsModalOpen(false);
  };

  const handleEditAnswer = (answer) => {
    setEditingAnswer(answer);
    form.setFieldsValue({
      answerContent: answer.answerContent,
      mark: answer.mark,
      questionContent: answer.questionContent,
      status: answer.status
    });
    setIsModalOpen(true);
  };

  const handleViewDetails = (answer) => {
    setSelectedAnswer(answer);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedAnswer(null);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/answers/search?keyword=${searchKeyword}`);
      setAnswerList(response.data);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Tìm kiếm thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const stripHtml = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };
  
  const handleSubmitForm = async (values) => {
     // Xoá HTML khỏi phần mô tả
  values.description = stripHtml(values.description);
    try {
      const { answerContent, mark, questionContent, status } = values;

      if (editingAnswer) {
        const updatePayload = {
          answerId: editingAnswer.answerId,
          answerContent,
          mark,
          questionId: editingAnswer.questionId,
          status: status
        };

        const response = await api.put(`/answers/${editingAnswer.answerId}`, updatePayload);
        
        if (response.data) {
          toast.success("Cập nhật câu trả lời thành công!");
          await fetchAnswers();
          handleCloseModal();
        }
      } else {
        const response = await api.post(
          '/answers/add-by-question-content',
          { answerContent, mark, status: 1 }, // Default status is 1 (active) for new answers
          { params: { questionContent } }
        );

        if (response.data) {
          toast.success("Thêm câu trả lời mới thành công!");
          await fetchAnswers();
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error("Submit error:", error.response?.data || error);
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi";
      toast.error(editingAnswer ? `Cập nhật thất bại: ${errorMsg}` : `Thêm mới thất bại: ${errorMsg}`);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      const response = await api.delete(`/answers/${answerId}`);
      if (response.data) {
        toast.success("Xóa câu trả lời thành công!");
        await fetchAnswers();
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error);
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi";
      toast.error(`Xóa thất bại: ${errorMsg}`);
    }
  };

  const handleToggleStatus = async (answer) => {
    try {
      const newStatus = answer.status === 1 ? 0 : 1;
      const response = await api.put(`/answers/${answer.answerId}`, {
        ...answer,
        status: newStatus
      });
      
      if (response.data) {
        toast.success(`Đã chuyển trạng thái thành ${statusMapping[newStatus].text}`);
        await fetchAnswers();
      }
    } catch (error) {
      console.error("Toggle status error:", error);
      toast.error("Thay đổi trạng thái thất bại!");
    }
  };

  const columns = [
    {
      title: "Nội dung câu trả lời",
      dataIndex: "answerContent",
      key: "answerContent",
      render: (text) => (
        <div dangerouslySetInnerHTML={{ __html: text?.length > 50 ? `${text.substring(0, 50)}...` : text || "" }} />
      ),
      width: '40%',
    },
    {
      title: "Điểm",
      dataIndex: "mark",
      key: "mark",
      width: '10%',
      align: 'center',
    },
    {
      title: "Câu hỏi",
      dataIndex: "questionContent",
      key: "questionContent",
      width: '30%',
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: '10%',
      align: 'center',
      render: (status, record) => (
        <Tag 
          color={statusMapping[status]?.color || 'default'}
          style={{ cursor: 'pointer', padding: '4px 8px' }}
          onClick={() => handleToggleStatus(record)}
        >
          {statusMapping[status]?.text || 'KHÔNG BIẾT'}
        </Tag>
      ),
    },
    {
      title: "Nút điều khiển",
      key: "actions",
      width: '10%',
      render: (_, record) => (
        <div className="button" style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "20px", alignItems: "center" }}>
          <Tooltip title="Sửa">
            <Button
              color="orange"
              variant="filled"
              onClick={() => handleEditAnswer(record)}
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
              title="Bạn có muốn xóa câu trả lời này không?"
              onConfirm={() => handleDeleteAnswer(record.answerId)}
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
      <h1>Quản lý câu trả lời</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm câu trả lời..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 300 }}
          allowClear
          onPressEnter={handleSearch}
        />
        <Space>
          <Button type="primary" onClick={handleSearch} loading={loading} icon={<i className="fa-solid fa-search" />}>
            Tìm kiếm
          </Button>
          <Button type="primary" onClick={handleOpenModal} icon={<i className="fa-solid fa-plus" />}>
            Thêm mới
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={answerList}
        rowKey="answerId"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        scroll={{ x: '100%' }}
        style={{ marginTop: 16 }}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editingAnswer ? "Chỉnh sửa câu trả lời" : "Thêm câu trả lời mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form form={form} onFinish={handleSubmitForm} layout="vertical">
          <Form.Item
            label="Câu hỏi"
            name="questionContent"
            rules={[{ required: true, message: "Vui lòng chọn câu hỏi!" }]}
          >
            <Select 
              placeholder="Chọn câu hỏi"
              disabled={!!editingAnswer}
              showSearch
            >
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
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <MyEditor />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              label="Điểm"
              name="mark"
              rules={[{ required: true, message: "Vui lòng nhập điểm!" }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>

            {/* Only show status field when editing */}
            {editingAnswer && (
              <Form.Item
                label="Trạng thái"
                name="status"
                style={{ flex: 1 }}
              >
                <Select>
                  <Select.Option value={1}>Hoạt động</Select.Option>
                  <Select.Option value={0}>Không hoạt động</Select.Option>
                </Select>
              </Form.Item>
            )}
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              {editingAnswer ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button onClick={handleCloseModal}>Hủy</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết câu trả lời"
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={800}
      >
        {selectedAnswer && (
          <div>
            <Divider orientation="left">Thông tin cơ bản</Divider>
            <p><strong>Nội dung:</strong></p>
            <div dangerouslySetInnerHTML={{ __html: selectedAnswer.answerContent }} />
            
            <Divider orientation="left">Thông tin khác</Divider>
            <p><strong>Điểm:</strong> {selectedAnswer.mark}</p>
            <p><strong>Câu hỏi:</strong> {selectedAnswer.questionContent}</p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <Tag color={statusMapping[selectedAnswer.status]?.color}>
                {statusMapping[selectedAnswer.status]?.text}
              </Tag>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AnswerManagement;