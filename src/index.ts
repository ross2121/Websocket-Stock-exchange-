import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";
import {createClient} from "redis"
const client=createClient();
client.connect();
console.log("connect to redddis");
const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws) => {
    UserManager.getInstance().addUser(ws);
});

