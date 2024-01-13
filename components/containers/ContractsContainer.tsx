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
      <ContractInfo
        details={{
          title: "Lorem Ipsum Contract",
          contractName: "I-am-a-Human.near",
          method: "is_human()",
          description:
            "Lorem ipsum dolor sit amet, consectet adipiscing elit, sed do eiusmod tempor ncididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          submittedByAccountId: "lorem.ipsum.near",
        }}
      />
      <ContractInfo
        details={{
          title: "Lorem Ipsum Contract",
          contractName: "I-am-a-Human.near",
          method: "is_human()",
          description:
            "Lorem ipsum dolor sit amet, consectet adipiscing elit, sed do eiusmod tempor ncididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          submittedByAccountId: "lorem.ipsum.near",
        }}
      />
      <ContractInfo
        details={{
          title: "Lorem Ipsum Contract",
          contractName: "I-am-a-Human.near",
          method: "is_human()",
          description:
            "Lorem ipsum dolor sit amet, consectet adipiscing elit, sed do eiusmod tempor ncididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          submittedByAccountId: "lorem.ipsum.near",
        }}
      />
    </Stack>
  );
}
