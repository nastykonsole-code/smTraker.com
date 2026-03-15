
export function formatNumbers(str) {
    const num = Number(str);

    if (num < 1000) {
        return num.toFixed(1).toString();
    } else if (num < 1_000_000) {
        // Thousands
        const k = (num / 1000).toFixed(1);
        return `${k}K`;
    } else if (num < 1_000_000_000) {
        // Millions
        const m = (num / 1_000_000).toFixed(1);
        return `${m}M`;
    } else {
        // Billions
        const b = (num / 1_000_000_000).toFixed(1);
        return `${b}B`;
    }
}
