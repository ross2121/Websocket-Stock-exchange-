import { WebSocket } from "ws";
import { User } from "./user";
import { SubscriptionManager } from "./SubscriptionManager";
export class UserManager{
    private static instance:UserManager;
    private users:Map<string,User>=new Map();
    private constructor(){

    }
    public static getInstance(){
        if(!this.instance){
            this.instance=new UserManager();
        }
        return this.instance;
    }
    public addUser(ws:WebSocket){
        const id=this.getrandomId();
        const user =new User(id,ws);
        this.users.set(id,user);
        this.registerOnclose(ws,id);
        return user
    }
    private registerOnclose(ws:WebSocket,id:string){
        ws.on("close",()=>{
            this.users.delete(id);
            SubscriptionManager.getInstance().userLeft(id);
        })

    }
    public getUser(id:string){
     return this.users.get(id);
    }
    private getrandomId(){
        return Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2, 15);
    }
}