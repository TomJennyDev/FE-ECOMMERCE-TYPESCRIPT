import SearchIcon from "@mui/icons-material/Search";
import { alpha, styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useStoreContext from "../hooks/useStoreContext";
import { FormProvider, FTextField } from "./form";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  border: `0.1px solid ${alpha(theme.palette.common.white, 0.2)}`,
  borderColor: { xs: `${theme.palette.common.white}` },

  backgroundColor: "transparent",
  "&:hover": {
    border: `0.1px solid ${theme.palette.common.white}`,
  },
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
}));

const StyledInputBase = styled(FTextField)(({ theme }) => ({
  "&&& .MuiOutlinedInput-root": {
    outline: "none",
  },
  "& input::placeholder": {
    color: theme.palette.common.white,
  },
  "&&& .MuiOutlinedInput-root fieldset": {
    border: "none",
  },
  "& .MuiInputBase-input": {
    color: "white",
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const defaultValues = {
  with_keywords: "",
};

function MovieSearch() {
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues,
  });

  const { setSearchKeyWords } = useStoreContext();

  const { handleSubmit, reset } = methods;

  const onSubmit = (data) => {
    setSearchKeyWords(data.with_keywords);
    navigate("/search");
    reset();
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search …"
          inputProps={{ "aria-label": "q" }}
          name="with_keywords"
        />
      </Search>
    </FormProvider>
  );
}

export default MovieSearch;
