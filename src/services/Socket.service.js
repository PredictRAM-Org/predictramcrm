import socketIOClient from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = socketIOClient('');
    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => {
        console.log('Connected to server');
        resolve();
      });

      this.socket.on('connect_error', (err) => {
        console.error('Failed to connect to server:', err);
        reject(err);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Disconnected from server');
    }
  }

  sendMessage(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.error('Socket is not connected');
    }
  }

  sendMessageToRoom(room, event, data) {
    if (this.socket) {
      this.socket.emit(event, { room, data });
    } else {
      console.error('Socket is not connected');
    }
  }

  addEventListener(event, handler) {
    if (this.socket) {
      this.socket.on(event, handler);
    } else {
      console.error('Socket is not connected');
    }
  }

  removeEventListener(event, handler) {
    if (this.socket) {
      this.socket.off(event, handler);
    } else {
      console.error('Socket is not connected');
    }
  }
}

export default new SocketService();
