import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";
import {createClient} from "redis"

async function redis(){
    const client=createClient({
    url:"rediss://red-cumrnjd6l47c7397qhf0:9ybkrbUwo8EZJraRqJ15mAINVUSNmEWc@oregon-redis.render.com:6379"
});
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

