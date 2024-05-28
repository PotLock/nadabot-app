import { Stack, Typography } from "@mui/material";
import Fuse from "fuse.js";
import { useEffect, useState } from "react";

import providerSorts from "@nadabot/common/lib/providerSorts";
import {
  ProviderExternalWithIsHuman,
  ProviderId,
} from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";
import CustomCircularProgress from "@nadabot/common/ui/components/CustomCircularProgress";
import GridContainer from "@nadabot/common/ui/components/GridContainer";
import useFilteredProviders from "@nadabot/modules/core/hooks/useFilteredProviders";

import { StampCard } from "./StampCard";

export type StampsOverviewProps = {
  inline?: boolean;
  searchPattern?: string;
  showLoadingState?: boolean;
  providersList?: ProviderExternalWithIsHuman[];
  adminView?: boolean;
  selectedStamps?: ProviderId[];
  stampSelectHandler?: (providerId: ProviderId) => VoidFunction;
};

// Fields to use as search keyword filter
const fuseOptions = {
  keys: [
    "provider_name",
    "description",
    "contract_id",
    "submitted_by",
    "default_weight",
  ],
};

export default function StampsOverview({
  inline,
  searchPattern,
  showLoadingState,
  providersList,
  adminView,
  selectedStamps,
  stampSelectHandler,
}: StampsOverviewProps) {
  const [isAdmin] = useState(adminView || false);

  // Providers (activated ones only)
  const { active, deactivated, ready } = useFilteredProviders({
    sortMethod: providerSorts.higherWeightFirst,
  });

  // Give preference to providersList
  const providers = providersList ?? isAdmin ? deactivated : active;

  // Fuse
  const [fuse, setFuse] = useState<Fuse<ProviderExternalWithIsHuman>>();
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

      // setFilteredProviders(providers);
    } else {
      setFilteredProviders(providers);
    }
  }, [searchPattern, fuse, providers]);

  if (!ready && showLoadingState) {
    return <CustomCircularProgress />;
  }

  if (isAdmin && deactivated.length === 0) {
    return (
      <Stack direction="row" justifyContent="center" my={4}>
        <Typography fontWeight={500}>No providers to approve yet</Typography>
      </Stack>
    );
  }

  if (!isAdmin && providers.length === 0) {
    return (
      <Stack direction="row" justifyContent="center" my={4}>
        <Typography fontWeight={500}>No providers available</Typography>
      </Stack>
    );
  }

  // Use Flex View
  if (inline) {
    return (
      <Stack
        mt={isAdmin ? 0 : 2}
        direction="row"
        justifyContent="space-between"
        gap={2}
        overflow="scroll"
      >
        {filteredProviders.map((provider) => (
          <StampCard
            key={provider.id}
            providerInfo={provider}
            adminView={adminView}
          />
        ))}
      </Stack>
    );
  }

  // Use Grid View
  return (
    <Stack>
      <GridContainer centralize={filteredProviders.length >= 3} sx={{ mt: 2 }}>
        {filteredProviders.map((provider) => (
          <StampCard
            key={provider.id}
            providerInfo={provider}
            adminView={adminView}
            selectable={typeof stampSelectHandler === "function"}
            onSelectClick={stampSelectHandler?.(provider.id)}
            selected={selectedStamps?.includes(provider.id)}
          />
        ))}
      </GridContainer>
    </Stack>
  );
}
