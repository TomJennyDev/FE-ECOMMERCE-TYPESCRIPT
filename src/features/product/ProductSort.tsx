// material
import SortIcon from "@mui/icons-material/Sort";
import { InputAdornment } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppSelector } from "../../app/hook";
import { FormProvider, FSelect } from "../../components/form";

export const SORT_BY_OPTIONS = [
  { value: "", label: "Sort" },
  { value: "new", label: "Newest" },
  { value: "discount.desc", label: "Sale: High-Low" },
  { value: "discount.asc", label: "Sale: Low-High" },
  { value: "price.desc", label: "Price: High-Low" },
  { value: "price.asc", label: "Price: Low-High" },
];

const defaultValues = {
  sortBy: "",
};
export default function ProductSort({ handleDispatch }) {
  const { filters } = useAppSelector((state) => state.product);
  const methods = useForm({ defaultValues, mode: "onChange" });
  const { handleSubmit, reset, watch } = methods;

  useEffect(() => {
    if (!filters.sortBy) {
      reset();
    }
    const subscription = watch((value) => handleDispatch(value));
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data) => console.log(data);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <FSelect
        name="sortBy"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SortIcon />
            </InputAdornment>
          ),
        }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </FSelect>
    </FormProvider>
  );
}
