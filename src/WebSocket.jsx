import React, { useState, useEffect, useRef } from "react";

function WebSocketChat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    // Khởi tạo kết nối WebSocket và lưu vào ws.current
    ws.current = new WebSocket("ws://34.126.91.225:1506/data");

    // Lắng nghe sự kiện onmessage từ WebSocket
    ws.current.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
      console.log(event.data);
    };

    // Đóng kết nối WebSocket khi component bị unmount
    return () => {
      ws.current.close();
    };
    s;
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    // Gửi tin nhắn thông qua ws.current
    if (ws.current) {
      ws.current.send(inputValue);
    }
    setInputValue("");
  };
  // console.log("len", messages.length);
  return (
    <div>
      <h1>WebSocket Chat</h1>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoComplete="off"
        />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

export default WebSocketChat;
