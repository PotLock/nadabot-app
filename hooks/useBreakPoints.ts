import { useMediaQuery } from "@mui/material";

const useBreakPoints = () => {
  const maxWidth700 = useMediaQuery("(max-width:700px)");
  const maxWidth805 = useMediaQuery("(max-width:805px)");
  const maxWidth962 = useMediaQuery("(max-width:962px)");

  return {
    maxWidth700,
    maxWidth805,
    maxWidth962,
  };
};

export default useBreakPoints;
