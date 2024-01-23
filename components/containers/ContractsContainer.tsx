import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import ContractInfo from "../ContractInfo";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import { useUser } from "@nadabot/hooks/store/useUser";
import { useProviders } from "@nadabot/hooks/store/useProviders";
import CustomCircularProgress from "../ui/CustomCircularProgress";
import { ProviderExternal } from "@nadabot/services/web3/interfaces/providers";

type Props = {
  inline?: boolean;
  searchPattern?: string;
};

// Fields to use as search keyword filter
const fuseOptions = {
  keys: ["name", "contract_id"],
};

export default function ContractsContainer({ inline, searchPattern }: Props) {
  const { maxWidth805 } = useBreakPoints();
  const { isAdmin } = useUser();

  // Providers
  const { ready, providers } = useProviders();

  // Fuse
  const [fuse, setFuse] = useState<Fuse<ProviderExternal>>();
  const [filteredProviders, setFilteredProviders] = useState(providers);

  // Init Fuse
  useEffect(() => {
    if (providers) {
      setFuse(new Fuse(providers, fuseOptions));
    }
  }, [providers]);

  // Process Fuse Search
  useEffect(() => {
    if (providers && fuse && searchPattern) {
      const result = fuse.search(searchPattern || " ");
      const _filteredProviders = result.map((fuseItem) => fuseItem.item);

      if (searchPattern.length > 0) {
        setFilteredProviders(_filteredProviders);
        return;
      }
      setFilteredProviders(providers);
    }
  }, [searchPattern, fuse, providers]);

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
      {filteredProviders.map((provider) => (
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
  );
}
