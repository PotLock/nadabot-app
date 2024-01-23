import { Stack, Typography } from "@mui/material";
import { useStamps } from "@nadabot/hooks/store/useStamps";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import colors from "@nadabot/theme/colors";

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
  const { maxWidth480 } = useBreakPoints();
  const { stamps } = useStamps();
  console.log("RecentCheckItem.tsx STAMPS:", stamps);

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
  let styleItem3 = "hs-item-without-top-radius hs-with-full-border";

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
          Lorem Ipsum Contract
        </Typography>
        <Typography
          fontSize={10}
          fontWeight={500}
          lineHeight="20px"
          sx={{ textDecoration: "underline" }}
          mr={2}
          color={colors.NEUTRAL500}
        >
          I-am-human.near
        </Typography>
        <Typography
          fontSize={10}
          fontWeight={500}
          lineHeight="20px"
          sx={{ textDecoration: "underline" }}
          color={colors.NEUTRAL500}
        >
          IsHuman()
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Typography
          color={colors.NEUTRAL700}
          lineHeight="normal"
          fontWeight={700}
          mr={0.5}
        >
          19
        </Typography>
        <Typography color={colors.NEUTRAL700} lineHeight="normal">
          Pts
        </Typography>
      </Stack>
    </Stack>
  );
}
