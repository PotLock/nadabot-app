import { Box } from "@mui/material";

import useBreakPoints from "@nadabot/hooks/useBreakPoints";

type Props = {
  children: React.ReactNode;
  centralize?: boolean;
};

const GridContainer = ({ children, centralize }: Props) => {
  const { maxWidth1144, maxWidth430 } = useBreakPoints();

  return (
    <Box
      display="grid"
      sx={{
        justifyContent: centralize || maxWidth1144 ? "center" : "left",
        borderRadius: "6px",
        border: "2px solid #f0f0f0",
        p: 2,
        mt: 8,
        gridTemplateColumns: `repeat(auto-fit, minmax(${maxWidth430 ? "min-content" : "352px"}, max-content))`,
        gap: "24px",
      }}
    >
      {children}
    </Box>
  );
};

export default GridContainer;
