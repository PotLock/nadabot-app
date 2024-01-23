import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Stack, Typography } from "@mui/material";
import Fuse from "fuse.js";
import colors from "@nadabot/theme/colors";
import { ShadowContainer } from "../../containers/ShadowContainer";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import RegularInput from "@nadabot/components/ui/RegularInput";
import { SearchIconA } from "@nadabot/theme/icons";
import FilterButton from "@nadabot/components/ui/FilterButton";
import useFilteredProviders from "@nadabot/hooks/useFilteredProviders";
import ContractInfo from "@nadabot/components/ContractInfo";
import { ProviderExternal } from "@nadabot/services/web3/interfaces/providers";
import CustomButton from "@nadabot/components/ui/CustomButton";
import { Routes } from "@nadabot/routes";

type FilterType = "all" | "active" | "deactivated" | "flagged";

// Fields to use as search keyword filter
const fuseOptions = {
  keys: ["name", "contract_id"],
};

export default function AdminReviewChecksSection() {
  const router = useRouter();
  const { maxWidth1110, maxWidth805, maxWidth600 } = useBreakPoints();

  // Try to get the filterType from url query
  let queryFilterType = (router.query?.filterType || "all") as FilterType;
  if (!["all", "active", "deactivated", "flagged"].includes(queryFilterType)) {
    queryFilterType = "all";
  }

  const [fuse, setFuse] = useState<Fuse<ProviderExternal>>();
  const [filter, setFilter] = useState<FilterType>(queryFilterType);
  const [searchPattern, setSearchPattern] = useState("");
  const providers = useFilteredProviders();
  const [selectedProviders, setSelectedProviders] = useState(providers.all);
  const [filteredProviders, setFilteredProviders] = useState(selectedProviders);

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
    }
  }, [searchPattern, fuse, selectedProviders]);

  const changeFilterHandler = useCallback(
    (type: FilterType) => {
      setFilter(type);
      setSelectedProviders(providers[type]);
    },
    [providers]
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
            rightComponent={<SearchIconA sx={{ width: 16, mr: 2 }} />}
            onChange={(e) => setSearchPattern(e.target.value)}
          />
          <Stack
            direction={maxWidth600 ? "column" : "row"}
            justifyContent="space-between"
            width="100%"
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
            <FilterButton
              label="Flagged"
              counter={providers.flagged.length}
              onClick={() => changeFilterHandler("flagged")}
              active={filter === "flagged"}
              style={{ marginTop: maxWidth600 ? "8px" : "0px" }}
            />
          </Stack>
        </Stack>
        <Stack
          mt={2}
          direction="row"
          justifyContent={maxWidth805 ? "center" : "space-between"}
          gap={2}
          flexWrap="wrap"
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
      </ShadowContainer>
    </Stack>
  );
}
