import { Grid, Link } from "@mui/material";
import { useAppSelector } from "../../app/hook";
import { Category } from "../../interface";

interface CategoryListProps {
  handleSetFilters: (categoryId: string) => void;
}

function CategoryList({ handleSetFilters }: CategoryListProps) {
  const { subCategories } = useAppSelector((state) => state.category);
  return (
    <Grid container>
      {subCategories?.map((subCateL2) => {
        return (
          <Grid item xs={4} md={4} key={subCateL2._id}>
            <Link
              sx={{
                cursor: "pointer",
                textAlign: "center",
                display: "block",
                pb: 2,

                fontSize: "1.3rem",
                color: "text.primary",
              }}
              onClick={() => handleSetFilters(subCateL2._id)}
            >
              {subCateL2?.title}
            </Link>
            <SubCategoryChildL2
              subCatesL3={subCateL2?.children}
              handleSetFilters={handleSetFilters}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}

interface SubCategoryChildL2Props {
  subCatesL3?: Category[];
  handleSetFilters: (categoryId: string) => void;
}

function SubCategoryChildL2({
  subCatesL3,
  handleSetFilters,
}: SubCategoryChildL2Props) {
  return (
    <>
      {subCatesL3?.map((subCateL3) => {
        return (
          <Link
            sx={{
              display: "block",
              cursor: "pointer",
              textAlign: "center",
              p: 1,
              color: "text.primary",
            }}
            key={subCateL3._id}
            onClick={() => handleSetFilters(subCateL3._id)}
          >
            {subCateL3.title}
          </Link>
        );
      })}
    </>
  );
}

export default CategoryList;
