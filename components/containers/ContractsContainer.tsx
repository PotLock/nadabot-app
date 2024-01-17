import { Stack } from "@mui/material";
import ContractInfo from "../ContractInfo";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import { useUser } from "@nadabot/hooks/store/useUser";
import { useProviders } from "@nadabot/hooks/store/useProviders";
import CustomCircularProgress from "../ui/CustomCircularProgress";

type Props = {
  inline?: boolean;
};

export default function ContractsContainer({ inline }: Props) {
  const { maxWidth805 } = useBreakPoints();
  const { isAdmin } = useUser();

  // Providers
  const { ready, providers } = useProviders();

  if (!ready) {
    return <CustomCircularProgress />;
  }

  return (
    <Stack
      mt={isAdmin ? 0 : 2}
      direction="row"
      justifyContent={maxWidth805 ? "center" : "space-between"}
      gap={2}
      flexWrap={inline ? "nowrap" : "wrap"}
      overflow="scroll"
    >
      {providers.map((provider) => (
        <ContractInfo
          key={provider.provider_id}
          details={{
            isFlagged: provider.is_flagged,
            isActive: provider.is_active,
            providerId: provider.provider_id,
            title: provider.name,
            contractName: provider.contract_id,
            method: provider.method_name,
            description: provider.description || "",
            submittedByAccountId: provider.submitted_by,
            points: provider.default_weight,
          }}
        />
      ))}
    </Stack>
  );
}
