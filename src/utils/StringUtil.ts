export function formatNumber(num: number, locale = "en-US") {
    return new Intl.NumberFormat(locale).format(num);
}

export const formatDate = (input: string | Date): string => {
    let date = undefined;
    if (typeof input === "string") {
        date = new Date(input);
    } else {
        date = input;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const getStateName = (state: string) => {
    let result = "";

    if (state === 'wait') {
        result = '체결 대기';
    } else if (state === 'watch') {
        result = '예약주문 대기';
    } else if (state === 'done') {
        result = '전체 체결 완료';
    } else if (state === 'cancel') {
        result = '주문 취소';
    }

    return result;
}

interface PriceRange {
    min: number;
    max: number;
    unit: number;
    fixed: number;
}

const priceRanges: PriceRange[] = [
    { min: 2000000, max: Infinity, unit: 1000, fixed :0 },
    { min: 1000000, max: 2000000, unit: 500 , fixed :0},
    { min: 500000, max: 1000000, unit: 100 , fixed :0},
    { min: 100000, max: 500000, unit: 50 , fixed :0},
    { min: 10000, max: 100000, unit: 10 , fixed :0},
    { min: 1000, max: 10000, unit: 1 , fixed :0},
    { min: 100, max: 1000, unit: 0.1 , fixed :1},
    { min: 10, max: 100, unit: 0.01 , fixed :2},
    { min: 1, max: 10, unit: 0.001 , fixed :3},
    { min: 0.1, max: 1, unit: 0.0001 , fixed :4},
    { min: 0.01, max: 0.1, unit: 0.00001 , fixed :5},
    { min: 0.001, max: 0.01, unit: 0.000001 , fixed :6},
    { min: 0.0001, max: 0.001, unit: 0.0000001 , fixed :7},
    { min: 0, max: 0.0001, unit: 0.00000001 , fixed :8}
];

export const getOrderPrice = (currentPrice: number): number => {
    let ret = -1;
    try {
        for (const range of priceRanges) {
            if (currentPrice >= range.min && currentPrice < range.max) {
                ret = Number((Math.floor(currentPrice / range.unit) * range.unit).toFixed(range.fixed));
                break;
            }
        }
    } catch (e: unknown) {
        console.log('Price out of range', currentPrice);
    }
    return ret;
}


export function calculatePriceChangePercentage(previousPrice: number, currentPrice: number): number {
    if (previousPrice <= 0) {
        throw new Error('Previous price must be greater than 0');
    }

    const change = currentPrice - previousPrice;
    const changePercentage = (change / previousPrice) * 100;

    return Number(changePercentage.toFixed(2));
}