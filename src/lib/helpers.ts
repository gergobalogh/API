export const getPagination = (page: number, size: number) => {
    const limit = size ? +size : 50;
    const adjustedPage = page > 0 ? page - 1 : 0;
    const from = adjustedPage ? adjustedPage * limit : 0;
    const to = page ? from + limit - 1 : limit - 1
    return { from, to };
};