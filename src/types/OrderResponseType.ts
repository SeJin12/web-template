export type TradeType = {
    market: string;
    uuid: string;
    price: string;
    volume: string;
    funds: string;
    trend: string;
    created_at: string;
    side: string;
}

export type OrderResponseType = {
    uuid: string;
    side: string;
    ord_type: string;
    price: string;
    state: string;
    market: string;
    created_at: string;
    volume: string;
    remaining_volume: string;
    reserved_fee: string;
    remaining_fee: string;
    paid_fee: string;
    locked: string;
    executed_volume: string;
    trades_count: number;
    trades?: TradeType[];
    is_end?: boolean;
    avg_buy_price?: number;
    korean_name: string;
}

export type OrderResponse = {
    CNT : number;
    PROFIT: number;
    result : OrderResponseType[]
}