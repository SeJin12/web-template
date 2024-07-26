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