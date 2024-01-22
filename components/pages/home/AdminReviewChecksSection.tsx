import { useCallback, useState } from "react";
import { Stack, Typography } from "@mui/material";
import colors from "@nadabot/theme/colors";
import { ShadowContainer } from "../../containers/ShadowContainer";
import { AddFilterSearchInput } from "../../ui/AddFilterSearchInput";
import ContractsContainer from "../../containers/ContractsContainer";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import Input from "@nadabot/components/ui/Input";
import RegularInput from "@nadabot/components/ui/RegularInput";
import { SearchIconA } from "@nadabot/theme/icons";
import FilterButton from "@nadabot/components/ui/FilterButton";
import useFilteredProviders from "@nadabot/hooks/useFilteredProviders";
import ContractInfo from "@nadabot/components/ContractInfo";

type FilterType = "all" | "active" | "deactivated" | "flagged";

export default function AdminReviewChecksSection() {
  const { isAdmin } = useUser();
  const { maxWidth805 } = useBreakPoints();

  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const providers = useFilteredProviders();
  const [selectedProviders, setSelectedProviders] = useState(providers.all);

  const changeFilterHandler = useCallback(
    (type: FilterType) => {
      setFilter(type);
      setSelectedProviders(providers[type]);
    },
    [providers]
  );

  return (
    <Stack mt={6}>
      <Typography variant="h4" fontWeight={700}>
        Review Checks
      </Typography>

      <Typography color={colors.SECONDARY} fontSize={16}>
        Add additional checks for 3rd party providers to become a verified
        human.
      </Typography>

      <ShadowContainer sx={{ mt: 3 }}>
        <Stack direction="row" justifyContent="space-between">
          <RegularInput
            sx={{ minWidth: 486 }}
            placeholder="Search"
            rightComponent={<SearchIconA sx={{ width: 16, mr: 2 }} />}
          />
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
          />
          <FilterButton
            label="Deactivated"
            counter={providers.deactivated.length}
            onClick={() => changeFilterHandler("deactivated")}
            active={filter === "deactivated"}
          />
          <FilterButton
            label="Flagged"
            counter={providers.flagged.length}
            onClick={() => changeFilterHandler("flagged")}
            active={filter === "flagged"}
          />
        </Stack>
        <Stack
          mt={2}
          direction="row"
          justifyContent={maxWidth805 ? "center" : "space-between"}
          gap={2}
          flexWrap="wrap"
        >
          {selectedProviders.map((provider) => (
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
