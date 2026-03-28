export const toNumber = (v: string | number | null | undefined) => {
    if (v === null || v === undefined || v === "") return undefined;

    const num = Number(v);
    return Number.isNaN(num) ? undefined : num;
};