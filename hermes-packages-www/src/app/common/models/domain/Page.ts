export interface PageResult<T> {
  hasMore: boolean;
  items: T[];
  totalCount: number;
  totalPages: number;
}

export interface PageRequest {
  query?: object;
  sort?: {property: string, direction: string};
  pageNumber?: number;
  pageSize?: number;
  distinct?: string;
}
