import React, { useState, useEffect, useRef } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import { toast } from "react-hot-toast";
import { Settings, X, UserPlus, Users, ChevronLeft } from "lucide-react";
const Chat = () => {
  const navigate = useNavigate();

  const openProfile = () => {
    navigate("/profile");
  };
  const [showUsers, setShowUsers] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupIcon, setGroupIcon] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [media, setMedia] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const lastTypingTimeRef = useRef(null);
  // SOCKET
  useEffect(() => {
    socket.emit("setup", user.id || user._id);

    socket.on("connected", () => {
      console.log("Socket Connected");
    });

    socket.on("message received", (newMessage) => {
      if (newMessage.sender._id === (user.id || user._id)) {
        return;
      }

      if (selectedChat && newMessage.chat._id === selectedChat._id) {
        setMessages((prev) => [...prev, newMessage]);
      }

      fetchChats();
    });

    socket.on("typing", () => {
      setIsTyping(true);
    });

    socket.on("stop typing", () => {
      setIsTyping(false);
    });

    fetchUsers();
    fetchChats();

    return () => {
      socket.off("connected");
      socket.off("message received");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [selectedChat]);

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH CHATS
  const fetchChats = async () => {
    try {
      const res = await API.get("/chat");
      setChats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      await API.post("/logout");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      socket.disconnect();

      toast.success("Logged out successfully");

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // CREATE SINGLE CHAT
  const createChat = async (userId) => {
    try {
      const res = await API.post("/chat", {
        userId,
      });

      setSelectedChat(res.data);

      fetchMessages(res.data._id);

      socket.emit("join chat", res.data._id);

      setChats((prev) => {
        const exists = prev.find((c) => c._id === res.data._id);

        if (exists) return prev;

        return [res.data, ...prev];
      });
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH MESSAGES
  const fetchMessages = async (chatId) => {
    try {
      const res = await API.get(`/message/${chatId}`);

      setMessages(res.data);

      socket.emit("join chat", chatId);
    } catch (error) {
      console.log(error);
    }
  };

  // TYPING
  const typingHandler = (e) => {
    setMessage(e.target.value);

    if (!selectedChat) return;

    if (!typing) {
      setTyping(true);

      socket.emit("typing", selectedChat._id);
    }

    lastTypingTimeRef.current = new Date().getTime();

    let timerLength = 2000;

    setTimeout(() => {
      let timeNow = new Date().getTime();

      let timeDiff = timeNow - lastTypingTimeRef.current;

      if (timeDiff >= timerLength) {
        socket.emit("stop typing", selectedChat._id);

        setTyping(false);
      }
    }, timerLength);
  };

  // SEND MESSAGE
  const sendMessage = async () => {
    if ((!message && !media) || !selectedChat) return;

    socket.emit("stop typing", selectedChat._id);

    setTyping(false);

    try {
      const formData = new FormData();

      formData.append("content", message);

      formData.append("chatId", selectedChat._id);

      if (media) {
        formData.append("media", media);
      }

      const res = await API.post("/message", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessages((prev) => [...prev, res.data]);

      socket.emit("new message", res.data);

      fetchChats();

      setMessage("");
      setMedia(null);
    } catch (error) {
      console.log(error);
    }
  };

  // CREATE GROUP
  const createGroupChat = async () => {
    try {
      if (!groupName) {
        return toast.error("Please enter group name");
      }

      if (selectedUsers.length < 2) {
        return toast.error("Select at least 2 users");
      }

      const formData = new FormData();

      formData.append("chatName", groupName);

      formData.append("users", JSON.stringify(selectedUsers));

      if (groupIcon) {
        formData.append("groupIcon", groupIcon);
      }

      const res = await API.post("/chat/group", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setChats((prev) => [res.data, ...prev]);

      setGroupName("");
      setSelectedUsers([]);
      setGroupIcon(null);

      toast.success("Group Created");
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE GROUP
  const deleteGroup = async (groupId) => {
    try {
      const res = await API.delete(`/chat/group/${groupId}`);

      toast.success(res.data.msg);

      setChats((prev) => prev.filter((chat) => chat._id !== groupId));

      if (selectedChat?._id === groupId) {
        setSelectedChat(null);
        setMessages([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const usersDrawer = showUsers && (
    <div className="fixed inset-0 bg-black/40 z-[100]">
      <div className="absolute right-0 top-0 h-full w-[320px] bg-white p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">New Chat</h2>

          <button onClick={() => setShowUsers(false)}>
            <X />
          </button>
        </div>

        {users
          .filter((u) => u._id !== (user.id || user._id))
          .map((u) => (
            <div
              key={u._id}
              onClick={() => {
                createChat(u._id);
                setShowUsers(false);
              }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={
                  u.avtar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                className="w-10 h-10 rounded-full object-cover"
              />

              <p>{u.username}</p>
            </div>
          ))}
      </div>
    </div>
  );
  const groupModal = showGroup && (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-5 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">Create Group</h2>

          <button onClick={() => setShowGroup(false)}>
            <X />
          </button>
        </div>

        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full border p-2 rounded-lg mb-2"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setGroupIcon(e.target.files[0])}
          className="w-full border p-2 rounded-lg mb-2"
        />

        <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
          {users
            .filter((u) => u._id !== (user.id || user._id))
            .map((u) => (
              <div key={u._id} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  value={u._id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers((prev) => [...prev, u._id]);
                    } else {
                      setSelectedUsers((prev) =>
                        prev.filter((id) => id !== u._id),
                      );
                    }
                  }}
                />

                <p>{u.username}</p>
              </div>
            ))}
        </div>

        <button
          onClick={() => {
            createGroupChat();
            setShowGroup(false);
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-xl mt-4"
        >
          Create Group
        </button>
      </div>
    </div>
  );
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 overflow-hidden">
      {/* SIDEBAR */}
      <div
        className={`${selectedChat ? "hidden md:flex" : "flex"}
          w-full
md:w-[380px]
h-full
bg-white
border-r
flex-col
shrink-0
`}
      >
        {/* TOP */}
        <div className="sticky top-0 z-50 flex justify-between items-center p-4 border-b shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h1 className="text-2xl font-bold">Chats</h1>
          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setShowUsers(true)}
              className="bg-white text-blue-600 p-2 rounded-xl"
            >
              <UserPlus size={20} />
            </button>

            <button
              onClick={() => setShowGroup(true)}
              className="bg-white text-blue-600 p-2 rounded-xl"
            >
              <Users size={20} />
            </button>

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-white text-blue-600 p-2 rounded-xl"
            >
              {showMenu ? <X size={20} /> : <Settings size={20} />}
            </button>
            {showMenu && (
              <div className="absolute top-14 right-0 w-64 bg-white rounded-2xl shadow-2xl p-4 z-50">
                <div className="flex flex-col items-center border-b pb-4">
                  <img
                    src={
                      user?.avtar ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt=""
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-500"
                  />

                  <h2 className="mt-3 font-bold text-gray-800 text-lg">
                    {user?.username}
                  </h2>

                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <button
                    onClick={openProfile}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl"
                  >
                    Update Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white py-3 rounded-xl"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div> {/* CHAT LIST */}
      {!showMenu && (
        <div className="flex-1 overflow-y-auto p-2 min-h-0">
          <h2 className="font-bold text-gray-600 mb-2">Your Chats</h2>

          {chats.map((chat) => {
            const otherUser = chat.users.find(
              (u) => u._id !== (user.id || user._id),
            );

            return (
              <div
                key={chat._id}
                onClick={() => {
                  setSelectedChat(chat);
                  fetchMessages(chat._id);
                }}
                className={`flex items-center justify-between gap-2 p-3 rounded-xl mb-2 cursor-pointer transition ${
                  selectedChat?._id === chat._id
                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 shadow-md"
                    : "hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={
                        chat.isGroupChat
                          ? chat.groupIcon
                          : otherUser?.avtar ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    />

                    {!chat.isGroupChat && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-sm md:text-base">
                      {chat.isGroupChat ? chat.chatName : otherUser?.username}
                    </p>

                    <p className="text-xs md:text-sm text-gray-500 truncate w-36 md:w-44">
                      {chat.latestMessage?.content || "No messages"}
                    </p>
                  </div>
                </div>

                {chat.isGroupChat &&
                  chat.groupAdmin === (user.id || user._id) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGroup(chat._id);
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  )}
              </div>
            );
          })}
        </div>
      )}
      </div>
     
      {/* CREATE GROUP */}

      {/* CHAT AREA */}
      <div
        className={`${
          selectedChat ? "flex" : "hidden md:flex"
        } flex-1 flex-col h-full`}
      >
        {/* TOP BAR */}
        <div className="bg-white border-b p-4 flex items-center shadow-sm shrink-0">
          {selectedChat && (
            <button
              onClick={() => setSelectedChat(null)}
              className="md:hidden mr-3 bg-gray-100 p-2 rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {selectedChat && (
            <>
              <img
                src={
                  selectedChat.isGroupChat
                    ? selectedChat.groupIcon
                    : selectedChat.users.find(
                        (u) => u._id !== (user.id || user._id),
                      )?.avtar ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="ml-3">
                <h2 className="font-bold text-sm md:text-lg">
                  {selectedChat.isGroupChat
                    ? selectedChat.chatName
                    : selectedChat.users.find(
                        (u) => u._id !== (user.id || user._id),
                      )?.username}
                </h2>

                {isTyping && (
                  <p className="text-green-500 text-sm">typing...</p>
                )}
              </div>
            </>
          )}
        </div>
        {!selectedChat && (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100">
            <div className="text-center px-6">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
                alt=""
                className="w-28 md:w-36 mx-auto opacity-80"
              />

              <h2 className="text-2xl md:text-4xl font-bold text-gray-700 mt-6">
                Welcome to Real Time Chat
              </h2>

              <p className="text-gray-500 mt-3 text-sm md:text-base">
                Select a chat to start messaging
              </p>
            </div>
          </div>
        )}
        {/* MESSAGES */}
        {selectedChat && (
          <div className="flex-1 overflow-y-auto min-h-0 p-3 md:p-4 bg-[#e5ddd5] pb-24">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  msg.sender?._id === (user.id || user._id)
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[70%] px-4 py-2 rounded-2xl shadow ${
                    msg.sender?._id === (user.id || user._id)
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <p className="text-xs font-bold mb-1">
                    {msg.sender?.username}
                  </p>

                  {msg.content && (
                    <p className="text-sm md:text-base break-words">
                      {msg.content}
                    </p>
                  )}

                  {msg.media && msg.mediaType === "image" && (
                    <img
                      src={msg.media}
                      alt=""
                      className="mt-2 rounded-lg w-full max-w-[250px]"
                    />
                  )}

                  {msg.media && msg.mediaType === "video" && (
                    <video
                      controls
                      className="mt-2 rounded-lg w-full max-w-[250px]"
                    >
                      <source src={msg.media} />
                    </video>
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef}></div>
          </div>
        )}
        {/* INPUT */}
       
       {selectedChat && (
        <div className="p-3 bg-white border-t flex items-center gap-2 shrink-0">
    <input
  type="text"
  value={message}
  onChange={typingHandler}
  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
  placeholder="Type message..."
  className="flex-1 border rounded-lg px-4 py-2 outline-none"
/>

    <input
      type="file"
      onChange={(e) => setMedia(e.target.files[0])}
      className="hidden"
      id="media"
    />
{media && (
  <span className="text-xs text-gray-500">
    {media.name}
  </span>
)}
    <label
      htmlFor="media"
      className="cursor-pointer bg-gray-200 px-3 py-2 rounded-lg"
    >
      📎
    </label>

    <button
      onClick={sendMessage}
      className="bg-blue-600 text-white px-5 py-2 rounded-lg"
    >
      Send
    </button>
  </div>
)}
      </div>
      {usersDrawer}
      {groupModal}
    </div>
  );
};

export default Chat;
