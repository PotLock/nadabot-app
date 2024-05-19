import { Box, SxProps, Theme } from "@mui/material";

import useBreakPoints from "../utils/useBreakPoints";

type Props = {
  children: React.ReactNode;
  centralize?: boolean;
  sx?: SxProps<Theme>;
};

const GridContainer = ({ children, centralize, sx }: Props) => {
  const { maxWidth1189, maxWidth430 } = useBreakPoints();

  return (
    <Box
      display="grid"
      sx={{
        justifyContent: centralize || maxWidth1189 ? "center" : "left",
        gridTemplateColumns: `repeat(auto-fit, minmax(${maxWidth430 ? "min-content" : "352px"}, max-content))`,
        gap: "24px",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default GridContainer;
