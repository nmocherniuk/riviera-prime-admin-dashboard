import { useMemo } from "react";

type Params = {
  page?: number;
  pageSize?: number;
  totalCount?: number;
  data: any[];
};

export default function useTablePagination({
  page,
  pageSize,
  totalCount,
  data,
}: Params) {
  const isValid =
    typeof pageSize === "number" &&
    pageSize > 0 &&
    typeof totalCount === "number" &&
    totalCount >= 0;

  const currentPage = Math.max(page ?? 1, 1);

  const total = totalCount ?? data.length;
  const size = pageSize ?? data.length;

  const from = total === 0 ? 0 : (currentPage - 1) * size + 1;
  const to = total === 0 ? 0 : Math.min(currentPage * size, total);

  const paginatedData = useMemo(() => {
    if (!pageSize) return data;

    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;

    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  return {
    total,
    from,
    to,
    hasPrev: isValid && currentPage > 1,
    hasNext: isValid && currentPage * size < total,
    paginatedData,
  };
}
