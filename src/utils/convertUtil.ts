import { MarketResponseType } from "../types/MarketResponseType"

export const getEvalutationAmount = (row: MarketResponseType) => {
    return Number(row.ticker.trade_price) *
        (Number(row.balance) + Number(row.locked))
}

export const getEvalutationGainsAndLosses = (row: MarketResponseType) => {
    return Number(row.ticker.trade_price) *
        (Number(row.balance) +
            Number(row.locked)) -
        Number(row.avg_buy_price) *
        (Number(row.balance) + Number(row.locked))
}

export const getProfitPercent = (price: number, avg_buy_price: number) => {
    return (((price - avg_buy_price) / avg_buy_price) * 100).toFixed(2);
}

export const getProfitKrw = (price: number, avg_buy_price: number, volume : number) => {
    return (price - avg_buy_price) * volume;
}