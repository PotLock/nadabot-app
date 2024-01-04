import { useMediaQuery } from "@mui/material";

const useBreakPoints = () => {
  const maxWidth700 = useMediaQuery("(max-width:700px)");

  return {
    maxWidth700,
  };
};

export default useBreakPoints;
