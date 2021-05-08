export const getNumberWithLeadingZeros = (num: number): string => {
    return num % 1 === 0 ? String(num) + ".00" : String(num.toFixed(2));
};