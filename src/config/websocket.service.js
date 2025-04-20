import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000; // 5 giây
  }

  connect = (onMessageReceived, onError) => {
    try {
      // Tạo kết nối SockJS đến endpoint backend
      const socket = new SockJS('http://localhost:8080/haven-skin/ws');
      
      // Tạo STOMP client
      this.stompClient = Stomp.over(socket);
      
      // Tắt debug log (tuỳ chọn)
      this.stompClient.debug = null;
      
      // Kết nối đến WebSocket
      this.stompClient.connect(
        {},
        () => {
          console.log('Kết nối WebSocket thành công');
          this.connected = true;
          this.reconnectAttempts = 0;
          
          // Đăng ký nhận dữ liệu từ kênh
          this.subscribeToSalesData(onMessageReceived);
          
          // Yêu cầu dữ liệu ban đầu
          this.requestSalesData();
        },
        (error) => {
          console.error('Lỗi kết nối WebSocket:', error);
          this.connected = false;
          this.handleReconnect(onMessageReceived, onError);
        }
      );
    } catch (error) {
      console.error('Lỗi khởi tạo SockJS:', error);
      this.handleReconnect(onMessageReceived, onError);
    }
  };

  subscribeToSalesData = (onMessageReceived) => {
    this.stompClient.subscribe('/haven-skin/get/salesData', (message) => {
      try {
        const data = JSON.parse(message.body);
        onMessageReceived(data);
      } catch (error) {
        console.error('Lỗi phân tích dữ liệu:', error);
      }
    });
  };

  requestSalesData = () => {
    if (this.connected) {
      this.stompClient.send(
        '/haven-skin/send/data/requestSalesData',
        {},
        JSON.stringify({})
      );
    }
  };

  handleReconnect = (onMessageReceived, onError) => {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Thử kết nối lại sau ${this.reconnectDelay/1000} giây... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(onMessageReceived, onError);
      }, this.reconnectDelay);
    } else if (onError) {
      onError('Đã đạt số lần thử kết nối tối đa');
    }
  };

  disconnect = () => {
    if (this.stompClient && this.connected) {
      this.stompClient.disconnect(() => {
        console.log('Ngắt kết nối WebSocket');
        this.connected = false;
      });
    }
  };
}

// Xuất instance duy nhất (Singleton)
export const webSocketService = new WebSocketService();

// Hàm hỗ trợ lấy dữ liệu qua HTTP
export const fetchMonthlySales = async () => {
  try {
    const response = await fetch('http://localhost:8080/haven-skin/web-socket/monthly');
    if (!response.ok) throw new Error('Lỗi kết nối');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu bán hàng:', error);
    return [];
  }
};