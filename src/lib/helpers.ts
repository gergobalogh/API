export const getPagination = (page: number, size: number) => {
    const limit = size ? +size : 50;
    const from = page ? page * limit : 0;
    const to = page ? from + limit - 1 : limit - 1

    return { from, to };
};