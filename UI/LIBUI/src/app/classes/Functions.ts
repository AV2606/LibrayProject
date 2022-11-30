export function hasAny(str: string, lookfor: string): boolean {
    for (let i = 0; i < str.length; i++) {
        for (let j = 0; j < lookfor.length; j++)
            if (str[i] == lookfor[j])
                return true;
    }
    return false;
}