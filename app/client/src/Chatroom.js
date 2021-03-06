import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import { Link } from "react-router-dom";
import { Route, Routes, useParams } from "react-router";

function Chatroom(props) {
  const [state, setState] = useState({ message: "", name: "" });
  const [chat, setChat] = useState([]);

  const [rooms, setRooms] = useState([]);

  const [connectedRoom, setConnectedRoom] = useState("");

  const socketRef = useRef();
  const params = useParams();
  console.log(params);
  useEffect(() => {
    socketRef.current = io.connect(`http://localhost:4000/${params.chatName}`);
    socketRef.current.on("message", ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
    socketRef.current.on("user_join", function (data) {
      setChat([
        ...chat,
        { name: "ChatBot", message: `${data} has joined the chat` },
      ]);
    });
    // socketRef.current.on('user_leave', function(data) {
    // 	console.log('data', data);
    // 	//setChat([ ...chat, { name: 'ChatBot', message: data } ]);
    // });
    return () => {
      socketRef.current.disconnect();
    };
  }, [chat]);
  const userjoin = (name) => {
    socketRef.current.emit("user_join", name);
  };

  const onMessageSubmit = (e) => {
    let msgEle = document.getElementById("message");
    console.log([msgEle.name], msgEle.value);
    setState({ ...state, [msgEle.name]: msgEle.value });
    socketRef.current.emit("message", {
      name: state.name,
      message: msgEle.value,
    });
    e.preventDefault();
    setState({ message: "", name: state.name });
    msgEle.value = "";
    msgEle.focus();
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <>
      <div>
        {rooms.length === 0 ? (
          <div>
            <h1>Make a room</h1>
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                setRooms(
                  rooms.concat([document.getElementById("room_input").value])
                );
              }}
            >
              <div className="form-group">
                <label>
                  Room Name:
                  <br />
                  <input id="room_input" />
                </label>
              </div>
              <button type="submit"> Click to make room</button>
            </form>
          </div>
        ) : (
          <div>
            <h1>Make a room</h1>
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                setRooms(
                  rooms.concat([document.getElementById("room_input").value])
                );
                alert(rooms);
              }}
            >
              <div className="form-group">
                <label>
                  Room Name:
                  <br />
                  <input id="room_input" />
                </label>
              </div>
              <button type="submit"> Click to make room</button>
            </form>
            {rooms.map((room) => {
              return (
                <div>
                  <Link to={`/${room}`}>
                    <h1>{room}</h1>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {state.name && (
          <div className="card">
            <div className="render-chat">
              <h1>Chat Log</h1>
              {renderChat()}
            </div>
            <form onSubmit={onMessageSubmit}>
              <h1>Messenger</h1>
              <div>
                <input
                  name="message"
                  id="message"
                  variant="outlined"
                  label="Message"
                />
              </div>
              <button>Send Message</button>
            </form>
          </div>
        )}
        {!state.name && (
          <form
            className="form"
            onSubmit={(e) => {
              console.log(document.getElementById("username_input").value);
              e.preventDefault();
              setState({
                name: document.getElementById("username_input").value,
              });
              userjoin(document.getElementById("username_input").value);
              // userName.value = '';
            }}
          >
            <div className="form-group">
              <label>
                User Name:
                <br />
                <input id="username_input" />
              </label>
            </div>
            <br />

            <br />
            <br />
            <button type="submit"> Click to join</button>
          </form>
        )}
      </div>
    </>
  );
}

export default Chatroom;
