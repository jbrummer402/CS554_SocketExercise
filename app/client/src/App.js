import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import { Link } from "react-router-dom";
import { Route, Routes, useParams } from "react-router";
import { Router } from "express";
import Chatroom from "./Chatroom";

function App() {
  return (
    <Router>
      <Routes>
        <Route to="/:chatName" element={Chatroom} />
      </Routes>
    </Router>
  );
}

export default App;
