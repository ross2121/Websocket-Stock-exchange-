import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";
import {createClient} from "redis"
import dotenv from "dotenv"
dotenv.config();
const client=createClient({url:process.env.REDIS_URL});
client.connect();
console.log("connect to redddis");
const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws) => {
    UserManager.getInstance().addUser(ws);
});

