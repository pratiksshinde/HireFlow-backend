const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const cookieParser = require("cookie-parser");
const { sequelize } = require("./config/db.js");

const app = express();
const server = http.createServer(app);

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

// ─── Track which socket IDs belong to agents ──────────────
// When agent disconnects we need to know they were an agent
// so we can update the online status for client pages
const agentSockets = new Set();
// ──────────────────────────────────────────────────────────

io.on("connection", (socket) => {
    console.log("Someone connected:", socket.id);

    // ── EVENT 1: User joins their personal room (silent) ──
    // This just sets up the room — does NOT ring the agent
    socket.on("join_room", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    // ── EVENT 2: User sends their FIRST message ────────────
    // THIS is what rings the agent — not joining the room
    // { userId, text } — text is shown on the alert popup
    socket.on("user_first_message", ({ userId, text }) => {
        console.log(`First message from ${userId}: ${text}`);

        // Also put message in the room so agent sees it when they join
        io.to("agents_room").emit("incoming_request", { userId, text });

        // Also send the message to the room already
        // (so when agent joins the room, the message is already there via chat)
        io.to(userId).emit("receive_message", { text, sender: "user" });
    });

    // ── EVENT 3: Agent comes online ────────────────────────
    socket.on("agent_join", () => {
        agentSockets.add(socket.id); // remember this socket is an agent
        socket.join("agents_room");
        console.log("Agent online. Total agents:", agentSockets.size);

        // Tell ALL clients an agent is now online
        io.emit("agent_status", { online: true });
    });

    // ── EVENT 4: Agent opens a specific user's chat ────────
    socket.on("agent_join_chat", (userId) => {
        socket.join(userId);
        console.log(`Agent joined room of user: ${userId}`);
    });

    // ── EVENT 5: Send message (both sides use this) ────────
    socket.on("send_message", ({ roomId, text, sender }) => {
        io.to(roomId).emit("receive_message", { text, sender });
        console.log(`Message in room ${roomId} from ${sender}: ${text}`);
    });

    // ── EVENT 6: Disconnect ────────────────────────────────
    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);

        // Was this socket an agent?
        if (agentSockets.has(socket.id)) {
            agentSockets.delete(socket.id);
            console.log("Agent went offline. Remaining agents:", agentSockets.size);

            // If NO agents left online, tell all clients
            if (agentSockets.size === 0) {
                io.emit("agent_status", { online: false });
            }
        }
    });
});

sequelize.authenticate()
    .then(() => {
        console.log("Database connected...");
        sequelize.sync({ alter: true });
    })
    .catch((err) => console.log("Error: " + err));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});