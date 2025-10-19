

export const calculatePaginationData = (total, perPage, page) => {
    const totalPage = Math.ceil(total / perPage);
    const hasNextPage = Boolean(totalPage - page);
    const hasPreviousPage = page !== 1;

    return {
        page,
        perPage,
        totalItems: total,
        totalPage,
        hasNextPage,
        hasPreviousPage
    };
};