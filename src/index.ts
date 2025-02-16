import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";
import {createClient} from "redis"
import dotenv from "dotenv"
dotenv.config();
async function redis(){
    const client=createClient({url:process.env.REDIS_URL});
try{await client.connect();
    console.log("connect to redddis");
}catch(e){
    console.log(e);
}

}
redis();
const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws) => {
    UserManager.getInstance().addUser(ws);
});

