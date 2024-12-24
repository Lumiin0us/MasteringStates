const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const http = require("http");
const { Server } = require("socket.io");
const User = require('./models/User');
const UserAuth = require('./models/UserAuth');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cors())
app.use(express.json())

const userSockets = {};
io.on("connection", (socket) => {
  console.log("Client connected with socket ID:", socket.id);

  // Register the connected user
  socket.on("registerUser", (username) => {
    userSockets[username] = socket.id;
    console.log(`${username} registered with socket ID: ${socket.id}`);
  });

  // Handle incoming messages
  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    console.log(`Sender: ${sender}, Receiver: ${receiver}, Message: ${message}`);

    // Save the message to the database
    try {
      const sender_id = await UserAuth.findOne({ username: sender });
      const receiver_id = await UserAuth.findOne({ username: receiver });
      const newMessage = new Message({
        sender: sender_id.id,
        receiver: receiver_id.id,
        message,
      });
      await newMessage.save();

      // Send the message to the receiver in real-time if they're online
      if (userSockets[receiver]) {
        io.to(userSockets[receiver]).emit("receiveMessage", {
          sender,
          message,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    for (const username in userSockets) {
      if (userSockets[username] === socket.id) {
        delete userSockets[username];
        console.log(`${username} disconnected`);
      }
    }
  });
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.sendStatus(403)
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, "secretKey", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid/Expired Token" });
    }
  })
  req.userId = decoded.id;
  next();
}

app.get("/", (req, res) => { res.send("Hello Express") });
app.get("/users", async (req, res) => {
  try {
    const users = await UserAuth.find();
    return res.status(200).json(users);
  }
  catch (e) {
    console.log("Error fetching users from DB: ", e)
    return res.status(500).json({ message: "Internal Server Error" })
  }

})
app.post("/user", async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Username is required!" })
  }
  const newUser = User({ username })
  const savedUser = await newUser.save()
  return res.status(201).json({ message: `User Sucessfully Created`, user: savedUser })
})

app.post("/userAuth", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Please fill the required fields" })
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = UserAuth({ username: username, password: hashedPassword })
  const savedUser = await newUser.save()
  const token = jwt.sign({ id: savedUser._id }, "secretKey", { expiresIn: "1hr" })
  return res.status(201).json({ message: `User Sucessfully Created`, token: token })
})

app.post("/userLogin", async (req, res) => {
  const { username, password } = req.body
  const foundUser = await User.findOne({ username: username })
  if (foundUser) {
    const validPass = await bcrypt.compare(password, foundUser.password)
    if (validPass) {
      const token = jwt.sign({ id: foundUser._id }, "secretKey", { expiresIn: "1hr" })
      console.log("Token Created: ", token)
      return res.status(200).json({ token: token })
    }
    return res.sendStatus(401)
  }
  return res.sendStatus(404)
})

app.post("/chatMessages", async (req, res) => {
  const { sender, receiver, message } = req.body;
  console.log(req.body)
  if (!sender || !receiver || !message) {
    return res.sendStatus(400)
  }
  const sender_id = await UserAuth.findOne({ username: sender })
  const receiver_id = await UserAuth.findOne({ username: receiver })
  const msg = Message({ sender: sender_id.id, receiver: receiver_id.id, message: message })
  await msg.save()
  return res.sendStatus(200)
})

app.get("/chatMessages/:sender/:receiver", async (req, res) => {
  const { sender, receiver } = req.params;
  try {
    const sender_id = await UserAuth.findOne({ username: sender })
    const receiver_id = await UserAuth.findOne({ username: receiver })

    const messages = await Message.find({
      $or: [
        { sender: sender_id.id, receiver: receiver_id.id },
        { sender: receiver_id.id, receiver: sender_id.id },
      ]
    })
    return res.status(200).json(messages)
  }
  catch (e) {
    return res.status(500)
  }
})

mongoose.connect(
  "mongodb+srv://lumi:hdmi@chatappcluster.efabr.mongodb.net/?retryWrites=true&w=majority&appName=chatAppCluster",
).then(() => {
  console.log("Connected to Atlas!")
}).catch((err) => {
  console.log(err)
})

server.listen(8080)
