import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";

const Chat = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  // socket setup + fetch users
  useEffect(() => {
    socket.emit("setup", user.id || user._id);

    socket.on("connected", () => {
      console.log("Socket connected");
    });

   socket.on(
  "message received",
  (newMessage) => {
    if (
       newMessage.sender._id ===
      (user.id ||user._id)
    ) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      newMessage,
    ]);

  }
);

    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");

        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();

    return () => {
      socket.off("message received");
    };
  }, []);

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logout Successful");

    navigate("/");
  };

  // create chat
  const createChat = async (userId) => {
    try {
      const res = await API.post(
        "/chat",
        { userId },
       
      );

      setSelectedChat(res.data);
      socket.emit(
  "join chat",
  res.data._id
);
      fetchMessages(res.data._id);

      setChats((prev) => {
        const exists = prev.find(
          (c) => c._id === res.data._id
        );

        if (exists) return prev;

        return [res.data, ...prev];
      });
    } catch (error) {
      console.log(error);
    }
  };

  // fetch old messages
 const fetchMessages = async (chatId) => {
  try {

    const res = await API.get(
      `/message/${chatId}`,
      
    );

    console.log(res.data);

    if (Array.isArray(res.data)) {

      setMessages(res.data);

    } else {

      setMessages([]);

    }

    socket.emit("join chat", chatId);

  } catch (error) {

    console.log(error);

    setMessages([]);

  }
};

  // send message
  const sendMessage = async () => {
    if (!message || !selectedChat) return;

    try {
      const res = await API.post("/message", {
        content: message,
        chatId: selectedChat._id,
      });

      setMessages((prev) => [
        ...prev,
        res.data,
      ]);
      if (res.data.chat) {
  socket.emit(
    "new message",
    res.data
  );
}
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users</h2>

      {users
        .filter((u) => u._id !== (user.id || user._id))
        .map((u) => (
          <div
            key={u._id}
            onClick={() => createChat(u._id)}
            style={{
              border: "1px solid black",
              padding: "10px",
              margin: "5px",
              cursor: "pointer",
            }}
          >
            {u.username}
          </div>
        ))}

      <hr />

      <h2>Messages</h2>

      <h3>Welcome {user?.username}</h3>

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />

      <div>
        {Array.isArray(messages) &&
        messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
            }}
          >
            <strong>
              {msg.sender?.username}
            </strong>
             &nbsp;
            : {msg.content}
          </div>
        ))}
      </div>

      <br />

      <input
        type="text"
        placeholder="Enter message"
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
      />

      <button onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default Chat;