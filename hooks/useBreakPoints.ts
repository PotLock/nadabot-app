import { useMediaQuery } from "@mui/material";

const useBreakPoints = () => {
  const maxWidth430 = useMediaQuery("(max-width:430px)");
  const maxWidth480 = useMediaQuery("(max-width:480px)");
  const maxWidth600 = useMediaQuery("(max-width:600px)");
  const maxWidth700 = useMediaQuery("(max-width:700px)");
  const maxWidth805 = useMediaQuery("(max-width:805px)");
  const maxWidth962 = useMediaQuery("(max-width:962px)");
  const maxWidth1110 = useMediaQuery("(max-width:1110px)");
  const maxWidth1144 = useMediaQuery("(max-width:1144px)");
  const maxWidth1189 = useMediaQuery("(max-width:1189px)");
  const maxWidth1200 = useMediaQuery("(max-width:1200px)");
  const maxWidth1280 = useMediaQuery("(max-width:1280px)");

  return {
    maxWidth430,
    maxWidth480,
    maxWidth600,
    maxWidth700,
    maxWidth805,
    maxWidth962,
    maxWidth1110,
    maxWidth1144,
    maxWidth1189,
    maxWidth1200,
    maxWidth1280,
  };
};

export default useBreakPoints;
