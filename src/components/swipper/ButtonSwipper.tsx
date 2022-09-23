import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Button } from "@mui/material";
import { styled } from "@mui/system";
import { useSwiper } from "swiper/react";

const ButtonStyled = styled(Button)(({ theme }) => ({
  borderRadius: "50%",
  border: "1px solid",
  width: 40,
  minWidth: 40,
  height: 40,
  zIndex: 999,
}));

interface ButtonSwipperProps {
  property: "left" | "right";
}

function ButtonSwipper({ property }: ButtonSwipperProps) {
  const swiper = useSwiper();

  return (
    <ButtonStyled
      onClick={() =>
        property === "left" ? swiper.slideNext() : swiper.slidePrev()
      }
    >
      {property === "left" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
    </ButtonStyled>
  );
}
export default ButtonSwipper;
