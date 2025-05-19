
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connectDB");
const auth = require("./routes/userRoute");
const message = require("./routes/messagesRoute");
const { authUser } = require("./middlwares/authUser");
const path= require("path");
require('dotenv').config({path:path.resolve(__dirname,'./.env')})
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// CORS for frontend Render URL
app.use(cors({
  origin: ["http://localhost:5173"], // 👈 your actual deployed frontend URL
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/", auth);
app.use("/api/v1/chat/", authUser, message);


// Connect DB and start server



const __dirname1 = path.resolve();

if ( process.env.NODE_ENV=== "production") {
  app.use(express.static(path.join(__dirname1, "../client/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "../client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}


const PORT = process.env.PORT || 5001;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // 👈 same as above
    methods: ["GET", "POST"]
  }
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);
  socket.emit("user-connected");

  socket.on("user-online", (user) => {
    if (user && !onlineUsers.includes(user)) {
      onlineUsers.push(user);
      io.emit("users-online", onlineUsers);
    }
  });

  socket.on("user-loggedout", (username) => {
    onlineUsers = onlineUsers.filter(usr => usr !== username);
    io.emit("users-online", onlineUsers);
  });

  socket.on("send-message", (message) => {
    socket.broadcast.emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(user => user !== socket.id);
    io.emit("users-online", onlineUsers);
  });
});

