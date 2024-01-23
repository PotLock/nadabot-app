import { Stack, Typography } from "@mui/material";

import ContractInfo from "@nadabot/components/ContractInfo";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useFilteredProviders from "@nadabot/hooks/useFilteredProviders";
import { ProviderExternal } from "@nadabot/services/web3/interfaces/providers";

type Props = {
  providerInfo: ProviderExternal;
};

export default function NextProviders({ providerInfo }: Props) {
  const { deactivated } = useFilteredProviders(providerInfo!.provider_id);
  const { maxWidth805 } = useBreakPoints();

  if (deactivated.length === 0) {
    return;
  }

  return (
    <Stack mt={4}>
      <Typography fontSize={20} fontWeight={600} mb={2}>
        Next Up:
      </Typography>
      <Stack
        direction="row"
        justifyContent={maxWidth805 ? "center" : "space-between"}
        gap={2}
        flexWrap="wrap"
      >
        {deactivated.slice(0, 3).map((provider) => (
          <ContractInfo
            key={provider.provider_id}
            details={{
              imageURL: provider.icon_url,
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
    </Stack>
  );
}
