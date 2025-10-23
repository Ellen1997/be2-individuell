export type PaginatedListResponse<T> = {
    data: T[];
    count: number;
    limit: number;
    offset: number;
};
