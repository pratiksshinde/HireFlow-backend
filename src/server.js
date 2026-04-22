const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");          // 👈 NEW: Node's built-in http module
const { Server } = require("socket.io"); // 👈 NEW: Socket.io server

dotenv.config();

const cookieParser = require("cookie-parser");
const { sequelize } = require("./config/db.js");

const app = express();

// 👇 NEW: Create an HTTP server from Express app
// (Socket.io needs a raw http server, not just Express)
const server = http.createServer(app);

// 👇 NEW: Attach Socket.io to the HTTP server
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://hireflow-ai-eight.vercel.app"],
        credentials: true,
    }
});

app.use(cors({
    origin: ["http://localhost:3000", "https://hireflow-ai-eight.vercel.app"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api", require("./routes/index.js"));

// ============================================================
// 👇 ALL SOCKET.IO LOGIC GOES HERE
// ============================================================

// This runs whenever a NEW person connects (client or agent)
io.on("connection", (socket) => {
    console.log("Someone connected:", socket.id);
    // socket.id is a unique ID auto-given to every connected browser tab

    // ── EVENT 1: User joins their personal chat room ──────────
    // Client browser will emit "join_room" with their userId
    // We create a "room" named after their userId
    // A room = a private group where only members get messages
    socket.on("join_room", (userId) => {
        socket.join(userId);  // socket joins the room named userId
        console.log(`User ${userId} joined their room`);

        // Tell all connected AGENTS that a new user is waiting
        // "agents_room" is a special room where all agents sit
        io.to("agents_room").emit("new_user_connected", { userId });
    });

    // ── EVENT 2: Agent joins the agents waiting room ──────────
    // When agent page loads, agent joins "agents_room"
    // so they get notified when new users connect
    socket.on("agent_join", () => {
        socket.join("agents_room");
        console.log("An agent is now online");
    });

    // ── EVENT 3: Agent opens a specific user's chat ───────────
    // Agent clicks "Open Chat" → they join that user's room
    socket.on("agent_join_chat", (userId) => {
        socket.join(userId);  // agent joins the same room as the user
        console.log(`Agent joined room of user: ${userId}`);
    });

    // ── EVENT 4: Someone sends a message ─────────────────────
    // Both client and agent use this same event
    // { roomId, text, sender } — sender is "user" or "agent"
    socket.on("send_message", ({ roomId, text, sender }) => {
        // io.to(roomId) = send to EVERYONE in that room
        // This includes both the user and the agent
        io.to(roomId).emit("receive_message", { text, sender });
        console.log(`Message in room ${roomId} from ${sender}: ${text}`);
    });

    // ── EVENT 5: Someone disconnects ─────────────────────────
    socket.on("disconnect", () => {
        console.log("Someone disconnected:", socket.id);
    });
});

// ============================================================

sequelize.authenticate()
    .then(() => {
        console.log("Database connected...");
        sequelize.sync({ alter: true });
    })
    .catch((err) => console.log("Error: " + err));

const PORT = process.env.PORT || 4000;

// 👇 IMPORTANT: Use `server.listen` NOT `app.listen`
// Because socket.io is attached to `server`, not `app`
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});