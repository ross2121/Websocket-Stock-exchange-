export type TickerUpdateMessage={
    type:"ticker",
    data:{
        c?:string,
        h?:string,
        l?:string,
        v?:string,
        V?:string,
        s?:string,
        id:number,
        e:"ticker"
    }
}
export type DepthUpdateMessge={
    type:"depth",
    data:{
        b?:[string,string][],
        a?:[string,string][],
        id:number,
        e:"depth"
    }
}
export type TradeAddedMessage={
    type:"trade",
    data:{
        t:number,
        m:boolean,
        p:string,
        q:string,
        s:string
    }
}
export type outgoingMessage=TickerUpdateMessage|DepthUpdateMessge