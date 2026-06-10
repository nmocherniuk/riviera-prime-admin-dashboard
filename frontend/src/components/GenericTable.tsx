import {
  useTheme,
  useMediaQuery,
  Paper,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Fragment } from "react/jsx-runtime";
import MobileListContainer from "./MobileListContainer";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import useTablePagination from "../hooks/useTablePaginationRange";
import { useState } from "react";
import { commonContent } from "../content/common";

export type Column<T> = {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
};

type GenericTableProps<T> = {
  title: string;
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  actions?: (e: React.MouseEvent<HTMLButtonElement>, item: T) => void;
  renderMobileCard?: (item: T) => React.ReactNode;
  withPagination?: {
    pageSize: number;
  };
};

const tableCellStyles = {
  fontWeight: 700,
  color: "text.secondary",
  textTransform: "uppercase" as const,
  letterSpacing: 0.8,
  py: 1.5,
};

export function GenericTable<T>({
  title,
  data,
  columns,
  onRowClick,
  actions,
  withPagination,
  renderMobileCard,
}: GenericTableProps<T>) {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const { from, to, total, hasPrev, hasNext, paginatedData } =
    useTablePagination({
      page,
      pageSize: withPagination?.pageSize,
      totalCount: data.length,
      data,
    });

  const entityLabel = title.toUpperCase();

  if (!isDesktop && renderMobileCard) {
    return (
      <MobileListContainer title={title}>
        {data.map((item, i) => (
          <Fragment key={i}>{renderMobileCard(item)}</Fragment>
        ))}
      </MobileListContainer>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography fontWeight={700}>{title}</Typography>
      </Box>
      <Box sx={{ overflowX: "auto" }}>
        <Table size="medium" sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "rgba(255,255,255,0.04)" }}>
              {columns.map((col) => (
                <TableCell key={col.key} sx={tableCellStyles}>
                  {col.label}
                </TableCell>
              ))}
              {actions && (
                <TableCell sx={{ ...tableCellStyles, width: "49px" }}>
                  {commonContent.dataTable.actionsColumn}
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {(withPagination ? paginatedData : data).map((item, i) => (
              <TableRow
                key={i}
                onClick={() => onRowClick?.(item)}
                sx={{
                  cursor: onRowClick ? "pointer" : "default",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
                }}
              >
                {columns.map((col) => (
                  <TableCell sx={{ py: 2 }} key={col.key}>
                    {col.render(item)}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell>
                    <IconButton
                      size="small"
                      sx={{ color: "text.secondary", marginLeft: "12px" }}
                      aria-label={commonContent.aria.actions}
                      onClick={(e) => {
                        e.stopPropagation();
                        actions(e, item);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      {withPagination && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 1.5, md: 2 },
            py: 1.5,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 600 }}
          >
            {commonContent.dataTable.paginationShowing} {from}-{to}{" "}
            {commonContent.dataTable.paginationOf} {total} {entityLabel}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              size="small"
              disabled={!hasPrev}
              onClick={() => setPage(page - 1)}
              sx={{
                cursor: "pointer",
                bgcolor: "rgba(255,255,255,0.06)",
                color: "text.primary",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                "&.Mui-disabled": { color: "text.secondary" },
              }}
            >
              <ArrowLeftIcon />
            </IconButton>
            <IconButton
              size="small"
              disabled={!hasNext}
              onClick={() => setPage(page + 1)}
              sx={{
                cursor: "pointer",
                bgcolor: "rgba(255,255,255,0.06)",
                color: "text.primary",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                "&.Mui-disabled": { color: "text.secondary" },
              }}
            >
              <ArrowRightIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
