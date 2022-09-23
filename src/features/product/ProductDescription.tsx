import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useAppSelector } from "../../app/hook";

const ButtonDescriptions = styled(Button)(({ theme }) => ({
  width: "150px",
  // backgroundColor: alpha(theme.palette.primary.main, 0.5),
}));

const DescriptionsContainer = styled(Box)(({ theme, show }) => ({
  maxHeight: show ? "auto" : "80vh",
  overflowY: "hidden",
  position: "relative",
  width: "100%",
  transition: theme.transitions.create("all", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.default,
  }),
}));

function ProductDescription() {
  const { product } = useAppSelector((state) => state.product);
  const { descriptions } = product;
  const ref = useRef<HTMLElement | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current.clientHeight < ref.current.scrollHeight) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [ref.current?.clientHeight, descriptions?.content]);

  return (
    <DescriptionsContainer ref={ref} show={show} showButton={showButton}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        children={descriptions?.content}
      />
      {showButton && (
        <Box
          sx={{
            zIndex: 99,
            position: show ? "relative" : "absolute",
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            width: "100%",
            pt: 4,
            py: 3,
            background: "linear-gradient(to top, white 50%,transparent)",
          }}
        >
          <ButtonDescriptions
            variant="outlined"
            color="primary"
            onClick={() => setShow(show ? false : true)}
          >
            {show ? "Hide" : "Show more"}
          </ButtonDescriptions>
        </Box>
      )}
    </DescriptionsContainer>
  );
}

export default ProductDescription;
