export interface SocketTickType {
    type: string;
    code: string // 마켓 코드 (ex. KRW-BTC)
    opening_price: number; // 시가
    high_price: number // 고가
    low_price: number // 저가
    trade_price: number // 현재가
    prev_closing_price: number // 	전일 종가
    acc_trade_price: number
    change: 'RISE' | 'EVEN' | 'FALL' //  전일 대비 RISE : 상승    EVEN : 보합    FALL : 하락
    change_price: number
    signed_change_price: number
    change_rate: number
    signed_change_rate: number
    ask_bid: string // 매수/매도 구분
    trade_volume: number
    acc_trade_volume: number
    trade_date: string
    trade_time: string
    trade_timestamp: number
    acc_ask_volume: number
    acc_bid_volume: number
    highest_52_week_price: number // 	52주 최고가
    highest_52_week_date: string // 52주 최고가 달성일
    lowest_52_week_price: number // 52주 최저가
    lowest_52_week_date: string // 	52주 최저가 달성일
    market_state: string // 거래상태 PREVIEW : 입금지원     ACTIVE : 거래지원가능    DELISTED : 거래지원종료
    is_trading_suspended: boolean // 거래 정지 여부
    delisting_date: Date // 거래지원 종료일
    market_warning: "NONE" | "CAUTION" // 	유의 종목 여부 NONE : 해당없음     CAUTION : 투자유의
    timestamp: number
    acc_trade_price_24h: number
    acc_trade_volume_24h: number
    stream_type: string // 스트림 타입  SNAPSHOT : 스냅샷     REALTIME : 실시간
}