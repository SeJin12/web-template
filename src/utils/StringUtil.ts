export function formatNumber(num: number, locale = "en-US") {
    return new Intl.NumberFormat(locale).format(num);
}