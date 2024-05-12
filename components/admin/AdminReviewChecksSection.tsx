import { Stack, Typography } from "@mui/material";
import Fuse from "fuse.js";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import GridContainer from "@nadabot/components/containers/GridContainer";
import { StampCard } from "@nadabot/components/stamp/StampCard";
import CustomButton from "@nadabot/components/ui/CustomButton";
import FilterButton from "@nadabot/components/ui/FilterButton";
import RegularInput from "@nadabot/components/ui/RegularInput";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useFilteredProviders from "@nadabot/hooks/useFilteredProviders";
import { Routes } from "@nadabot/routes";
import { ProviderExternalWithIsHuman } from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";
import colors from "@nadabot/theme/colors";
import { SearchIconA } from "@nadabot/theme/icons";

import { ShadowContainer } from "../containers/ShadowContainer";

type FilterType = "all" | "active" | "deactivated";

// Fields to use as search keyword filter
const fuseOptions = {
  keys: ["name", "contract_id", "submitted_by", "default_weight"],
};

export default function AdminReviewChecksSection() {
  const router = useRouter();
  const { maxWidth1110, maxWidth805, maxWidth600 } = useBreakPoints();

  // Try to get the filterType from url query
  let queryFilterType = (router.query?.filterType || "all") as FilterType;
  if (!["all", "active", "deactivated"].includes(queryFilterType)) {
    queryFilterType = "all";
  }

  const [fuse, setFuse] = useState<Fuse<ProviderExternalWithIsHuman>>();
  const [filter, setFilter] = useState<FilterType>(queryFilterType);
  const [searchPattern, setSearchPattern] = useState("");
  const providers = useFilteredProviders({});
  const [selectedProviders, setSelectedProviders] =
    useState<ProviderExternalWithIsHuman[]>();
  const [filteredProviders, setFilteredProviders] = useState(selectedProviders);

  // Listen to the providers updates to update the selectedProviders
  useEffect(() => {
    if (providers.ready && !selectedProviders) {
      setSelectedProviders(providers.all);
    }
  }, [providers, selectedProviders]);

  // Init Fuse
  useEffect(() => {
    if (selectedProviders) {
      setFuse(new Fuse(selectedProviders, fuseOptions));
    }
  }, [selectedProviders]);

  // Process Fuse Search
  useEffect(() => {
    if (selectedProviders && fuse) {
      const result = fuse.search(searchPattern || " ");
      const _filteredProviders = result.map((fuseItem) => fuseItem.item);

      if (searchPattern.length > 0) {
        setFilteredProviders(_filteredProviders);
        return;
      }
      setFilteredProviders(selectedProviders);
    } else {
      setFilteredProviders(selectedProviders);
    }
  }, [searchPattern, fuse, selectedProviders]);

  const changeFilterHandler = useCallback(
    (type: FilterType) => {
      setFilter(type);
      setSelectedProviders(providers[type]);
    },
    [providers],
  );

  const addCustomCheckHandler = useCallback(() => {
    router.push(Routes.ADD_STAMP);
  }, [router]);

  return (
    <Stack mt={6}>
      <Stack
        direction={maxWidth805 ? "column" : "row"}
        justifyContent="space-between"
        alignItems={maxWidth805 ? "flex-start" : "center"}
      >
        <Stack>
          <Typography variant="h4" fontWeight={700}>
            Review Checks
          </Typography>

          <Typography color={colors.SECONDARY} fontSize={16}>
            Add additional checks for 3rd party providers to become a verified
            human.
          </Typography>
        </Stack>

        <CustomButton
          sx={{ mt: maxWidth805 ? 1 : 0 }}
          bodySize="medium"
          color="blue"
          onClick={addCustomCheckHandler}
        >
          + Add Custom Check
        </CustomButton>
      </Stack>

      <ShadowContainer sx={{ mt: 3 }}>
        <Stack
          direction={maxWidth1110 ? "column" : "row"}
          justifyContent="space-between"
        >
          <RegularInput
            sx={{
              minWidth: maxWidth805 ? "100%" : 486,
              mr: maxWidth1110 ? 0 : 3,
            }}
            placeholder="Search"
            rightComponent={<SearchIconA sx={{ width: 16 }} />}
            onChange={(e) => setSearchPattern(e.target.value)}
          />
          <Stack
            direction={maxWidth600 ? "column" : "row"}
            justifyContent="space-between"
            width={maxWidth600 ? "100%" : "440px"}
            mt={maxWidth1110 ? 2 : 0}
          >
            <FilterButton
              label="All"
              counter={providers.all.length}
              onClick={() => changeFilterHandler("all")}
              active={filter === "all"}
            />
            <FilterButton
              label="Active"
              counter={providers.active.length}
              onClick={() => changeFilterHandler("active")}
              active={filter === "active"}
              style={{ marginTop: maxWidth600 ? "8px" : "0px" }}
            />
            <FilterButton
              label="Deactivated"
              counter={providers.deactivated.length}
              onClick={() => changeFilterHandler("deactivated")}
              active={filter === "deactivated"}
              style={{ marginTop: maxWidth600 ? "8px" : "0px" }}
            />
          </Stack>
        </Stack>
        {filteredProviders && (
          <GridContainer
            centralize={filteredProviders.length >= 3}
            sx={{
              mt: 2,
              gap: 3.6,
            }}
          >
            {filteredProviders.map((provider) => (
              <StampCard key={provider.id} providerInfo={provider} adminView />
            ))}
          </GridContainer>
        )}
      </ShadowContainer>
    </Stack>
  );
}
