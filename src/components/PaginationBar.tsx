import { Pagination, Stack } from "@mui/material";
import { ChangeEvent, useEffect } from "react";
const Scroll = require("react-scroll");
const scroll = Scroll.animateScroll;

interface PaginationBarProps {
  page: number;
  setPage: (page: number) => void;
  totalPage: number;
}

function PaginationBar({ page, setPage, totalPage }: PaginationBarProps) {
  const handleChange = (event: ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  useEffect(() => {
    scroll.scrollToTop({ smooth: true });
  }, [page]);

  return (
    <Stack spacing={2}>
      <Pagination
        count={totalPage}
        page={page}
        onChange={handleChange}
        showFirstButton
        showLastButton
      />
    </Stack>
  );
}

export default PaginationBar;
