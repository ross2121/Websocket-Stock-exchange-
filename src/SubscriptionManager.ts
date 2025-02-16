import { RedisClientType,createClient } from "redis";
import { UserManager } from "./UserManager";

export class SubscriptionManager{
    private redisClient:RedisClientType;
    private subscription:Map<string,string[]>=new Map();
    private reverseSubscription:Map<string,string[]>=new Map();
    private static instance:SubscriptionManager
    
    private constructor(){
      this.redisClient=createClient({url:process.env.REDIS_URL});
      this.redisClient.connect();
    }
    public static getInstance(){
        if(!this.instance){
            this.instance=new SubscriptionManager();
        }
        return this.instance
    }
    public unsubscriber(userId:string,subscription:string){
        const subscriptions=this.subscription.get(userId);
        if(subscriptions){
            this.subscription.set(userId,subscriptions.filter(s=>s!==subscription));
        }
        const reverseSubscriptions=this.reverseSubscription.get(subscription);
        if(reverseSubscriptions){
            this.reverseSubscription.set(subscription,reverseSubscriptions.filter(s=>s!==userId));
            if(this.reverseSubscription.get(subscription)?.length===0){
                this.reverseSubscription.delete(subscription);
                this.redisClient.unsubscribe(subscription);
            }
        }
        console.log("Unsubscribe",reverseSubscriptions,subscription);
    }
     getSubscription(userId:string){
        return this.subscription.get(userId)||[];
     }
     public subscribe(userId:string,subscription:string){
        if(this.subscription.get(userId)?.includes(subscription)){
            return
        }
        this.subscription.set(userId,(this.subscription.get(userId)||[]).concat(subscription));
        this.reverseSubscription.set(subscription,(this.reverseSubscription.get(subscription)||[]).concat(userId));
        if(this.reverseSubscription.get(subscription)?.length===1){
            console.log("check1");
          
            this.redisClient.subscribe(subscription,this.redicallbackHandler);
        }
        console.log("subscribe",this.reverseSubscription,this.subscription);
     }
     private redicallbackHandler=(message:string,channel:string)=>{
        const parsedMessage=JSON.parse(message);
        console.log("check",message);

        this.reverseSubscription.get(channel)?.forEach(s=>UserManager.getInstance().getUser(s)?.emit(parsedMessage));
     }
     public userLeft(userId:string){
        this.subscription.get(userId)?.forEach(s=>this.unsubscriber(userId,s));
     }
    
}