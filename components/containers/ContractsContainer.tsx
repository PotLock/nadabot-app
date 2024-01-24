import { Stack } from "@mui/material";
import Fuse from "fuse.js";
import { useEffect, useState } from "react";

import { useProviders } from "@nadabot/hooks/store/useProviders";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useFilteredProviders from "@nadabot/hooks/useFilteredProviders";
import { ProviderExternal } from "@nadabot/services/web3/interfaces/providers";

import ContractInfo from "../ContractInfo";
import CustomCircularProgress from "../ui/CustomCircularProgress";

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

  // Providers (activated ones only)
  const { active, deactivated, ready } = useFilteredProviders();
  const providers = isAdmin ? deactivated : active;

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
    } else {
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
        <ContractInfo key={provider.provider_id} providerInfo={provider} />
      ))}
    </Stack>
  );
}
