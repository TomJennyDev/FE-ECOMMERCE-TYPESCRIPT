import {
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  RadioGroupProps,
  Rating,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type IProps = {
  name: string;
  options: number[];
};
type FRatingProps = IProps & RadioGroupProps;

function FRating({ name, options }: FRatingProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <RadioGroup {...field}>
            {options.map((option: number, index: number) => (
              <FormControlLabel
                key={option}
                value={option}
                control={
                  <Radio
                    disableRipple
                    color="default"
                    icon={<Rating readOnly value={4 - index} />}
                    checkedIcon={<Rating readOnly value={4 - index} />}
                  />
                }
                label="& Up"
                sx={{
                  my: 0.5,
                  borderRadius: 1,
                  "& > :first-of-type": { py: 0.5 },
                  "&:hover": {
                    opacity: 0.48,
                    "& > *": { bgcolor: "transparent" },
                  },
                }}
              />
            ))}
          </RadioGroup>

          {!!error && (
            <FormHelperText error sx={{ px: 2 }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

export default FRating;
