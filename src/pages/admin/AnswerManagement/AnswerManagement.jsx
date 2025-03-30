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

  // Helper functions for status display
  const getStatusText = (status) => status === 1 ? "ACTIVE" : "INACTIVE";
  const getStatusColor = (status) => status === 1 ? "green" : "red";

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
      status: answer.status // Make sure to set the current status
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

  const handleSubmitForm = async (values) => {
    try {
      const { answerContent, mark, questionContent, status } = values;

      if (editingAnswer) {
        const updatePayload = {
          answerId: editingAnswer.answerId,
          answerContent,
          mark,
          questionId: editingAnswer.questionId,
          status: status // Use the status from form
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
          { answerContent, mark, status: status || 1 },
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
        toast.success(`Đã chuyển trạng thái thành ${getStatusText(newStatus)}`);
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
          color={getStatusColor(status)} 
          style={{ cursor: 'pointer', padding: '4px 8px' }}
          onClick={() => handleToggleStatus(record)}
        >
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: '10%',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <Button 
              onClick={() => handleEditAnswer(record)}
              icon={<i className="fa-solid fa-pen-to-square" />}
            />
          </Tooltip>
          <Tooltip title="Chi tiết">
            <Button 
              onClick={() => handleViewDetails(record)}
              icon={<i className="fa-solid fa-eye" />}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDeleteAnswer(record.answerId)}
          >
            <Tooltip title="Xóa">
              <Button danger icon={<i className="fa-solid fa-trash" />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <ToastContainer />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1>Quản lý câu trả lời</h1>
        <Button type="primary" onClick={handleOpenModal} icon={<i className="fa-solid fa-plus" />}>
          Thêm mới
        </Button>
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <Input
          placeholder="Tìm kiếm câu trả lời..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: '300px' }}
          allowClear
          onPressEnter={handleSearch}
        />
        <Button type="primary" onClick={handleSearch} loading={loading} icon={<i className="fa-solid fa-search" />}>
          Tìm kiếm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={answerList}
        rowKey="answerId"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        scroll={{ x: '100%' }}
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

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              label="Điểm"
              name="mark"
              rules={[{ required: true, message: "Vui lòng nhập điểm!" }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="status"
              initialValue={1}
              style={{ flex: 1 }}
            >
              <Select>
                <Select.Option value={1}>ACTIVE</Select.Option>
                <Select.Option value={0}>INACTIVE</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
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
              <Tag color={getStatusColor(selectedAnswer.status)}>
                {getStatusText(selectedAnswer.status)}
              </Tag>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AnswerManagement;