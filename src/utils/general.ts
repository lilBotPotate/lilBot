export function formatCount(name: string, count: number) {
    return `${count} ${name}${count == 1 ? '' : 's'}`;
}

export function shuffleArray<T>(array: T[]) {
    let currentIndex: number = array.length;
    let temporaryValue: T;
    let randomIndex: number;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export function randomArrayElement(array: any[] = []) {
    return array[Math.floor(Math.random() * array.length)];
}

export const numberToMonth: { [key: number]: string } = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
};

export function dayWithSuffix(day: number): string {
    const j: number = day % 10;
    const k: number = day % 100;
    if (j == 1 && k != 11) return day + 'st';
    if (j == 2 && k != 12) return day + 'nd';
    if (j == 3 && k != 13) return day + 'rd';
    return day + 'th';
}

export function formatDate(day: number, month: number, year?: number | null): string {
    return `${dayWithSuffix(day)} ${numberToMonth[month]}${year ? ' ' + year : ''}`;
}

export const brandColors = {
    DISCORD: '#7ab8f4',
    TWITCH: '#6441a5',
    STEAM: '#2a475e'
};

export function randomHexColor() {
    const r = numberToHex(Math.floor(Math.random() * 256));
    const g = numberToHex(Math.floor(Math.random() * 256));
    const b = numberToHex(Math.floor(Math.random() * 256));
    return `#${r}${g}${b}`;

    function numberToHex(num: number) {
        let hexNum = num.toString(16);
        return hexNum.length == 1 ? "0" + hexNum : hexNum;
    }
}