
export type SettingBidType = {
    ID: string;
    BID_YN: boolean;
    LIMIT_ASSET_KRW: number;
    BID_PRICE: number;
    BID_LIMIT_HOLDING_VALUATION_KRW: number;
    BID_CANDLE_UNIT: number;
    BID_CANDLE_COUNT: number;
    BID_UNDER_TICK: number;
}

export type SettingAskType = {
    ID: string;
    ASK_YN: boolean;
    ASK_PROFIT_PER: number;
    ASK_OVER_TICK: number;
}

export type SettingType = SettingBidType & SettingAskType;