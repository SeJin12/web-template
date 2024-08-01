import { SocketTickType } from "./SocketTickType"

export type MarketResponseType = {
    market: string
    korean_name: string
    english_name: string
    market_warning: string
    CONCENTRATION_OF_SMALL_ACCOUNTS: number
    DEPOSIT_AMOUNT_SOARING: number
    GLOBAL_PRICE_DIFFERENCES: number
    PRICE_FLUCTUATIONS: number
    TRADING_VOLUME_SOARING: number
    ask_yn: number
    avg_buy_price: string
    avg_buy_price_modified: boolean
    balance: string
    bid_yn: number
    bookmark_yn: number
    currency: string
    locked: string
    unit_currency: string
    warning: string
    ticker: SocketTickType;
}

export type MarketResponse = {
    CNT: number;
    result: MarketResponseType[]
}