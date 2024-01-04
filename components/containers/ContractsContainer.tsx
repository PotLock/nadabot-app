import { Stack } from "@mui/material";
import React from "react";
import ContractInfo from "../ContractInfo";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";

type Props = {};

export default function ContractsContainer({}: Props) {
  const { maxWidth805 } = useBreakPoints();

  return (
    <Stack
      mt={2}
      direction="row"
      justifyContent={maxWidth805 ? "center" : "space-between"}
      gap={2}
      flexWrap="wrap"
    >
      <ContractInfo />
      <ContractInfo />
      <ContractInfo />
    </Stack>
  );
}
