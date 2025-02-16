import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";
import { createClient } from "redis";
import dotenv from "dotenv";
import express from "express";
import http from "http";

dotenv.config();

async function redis() {
    const client = createClient({ url: process.env.REDIS_URL });
    try {
        await client.connect();
        console.log("Connected to Redis");
    } catch (e) {
        console.error("Redis Connection Error:", e);
    }
}
redis();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("New WebSocket Connection");
    UserManager.getInstance().addUser(ws);

    ws.on("message", (message) => {
        console.log("Received:", message);
    });

    ws.on("close", () => console.log("Client Disconnected"));
});

const PORT =3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
