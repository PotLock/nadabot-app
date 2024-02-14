import { Stack, Typography } from "@mui/material";

import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import colors from "@nadabot/theme/colors";
import truncate from "@nadabot/utils/truncate";

type Props = {
  // used the determine the layout
  index: number;
  totalItems: number;
  contractName: string;
  contractId: string;
  method: string;
  points: number;
};

export default function RecentCheckItem({
  index,
  totalItems,
  contractName,
  contractId,
  method,
  points,
}: Props) {
  const { maxWidth1144, maxWidth480 } = useBreakPoints();

  // Style Item 1
  let styleItem1 = "hs-item-full-radius";
  if (totalItems >= 2) {
    styleItem1 = "hs-item-without-bottom-radius";
  }

  // Style Item 2
  let styleItem2 = "hs-item-without-top-radius";
  if (totalItems >= 3) {
    styleItem2 = "hs-item-without-top-bottom-radius";
  }

  // Style Item 3
  const styleItem3 = "hs-item-without-top-radius hs-with-full-border";

  const borderStyles: Record<string, string> = {
    0: styleItem1,
    1: styleItem2,
    2: styleItem3,
  };

  const styleKey = index > 3 ? 3 : index;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      className={borderStyles[styleKey.toString()]}
    >
      <Stack
        direction={maxWidth480 ? "column" : "row"}
        alignItems={maxWidth480 ? "flex-start" : "center"}
      >
        <Typography fontSize={12} fontWeight={600} lineHeight="normal" mr={2}>
          {maxWidth1144 ? contractName : truncate(contractName, 15)}
        </Typography>
        <Typography
          fontSize={10}
          fontWeight={500}
          lineHeight="20px"
          sx={{ textDecoration: "underline" }}
          mr={2}
          color={colors.NEUTRAL500}
        >
          {maxWidth1144 ? contractId : truncate(contractId, 18)}
        </Typography>
        <Typography
          fontSize={10}
          fontWeight={500}
          lineHeight="20px"
          sx={{ textDecoration: "underline" }}
          color={colors.NEUTRAL500}
        >
          {`${method}()`}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" ml={2}>
        <Typography
          color={colors.NEUTRAL700}
          lineHeight="normal"
          fontWeight={700}
          mr={0.5}
        >
          {points}
        </Typography>
        <Typography color={colors.NEUTRAL700} lineHeight="normal">
          Pts
        </Typography>
      </Stack>
    </Stack>
  );
}
