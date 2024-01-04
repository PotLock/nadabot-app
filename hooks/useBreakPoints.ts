import { useMediaQuery } from "@mui/material";

const useBreakPoints = () => {
  const maxWidth700 = useMediaQuery("(max-width:700px)");
  const maxWidth805 = useMediaQuery("(max-width:805px)");

  return {
    maxWidth700,
    maxWidth805,
  };
};

export default useBreakPoints;
