import { Box, Button, Stack } from "@mui/material";
import React from "react";

import RegularInput from "@nadabot/common/ui/components/RegularInput";
import { FilterIcon, SearchIconA } from "@nadabot/common/ui/icons";
import useBreakPoints from "@nadabot/common/ui/lib/useBreakPoints";

type Props = {
  hideAddFilterButton?: boolean;
  onChange: (value: string) => void;
};

export function AddFilterSearchInput({ hideAddFilterButton, onChange }: Props) {
  const { maxWidth962, maxWidth700 } = useBreakPoints();

  return (
    <Stack
      direction={maxWidth700 ? "column" : "row"}
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack
        width={
          !hideAddFilterButton
            ? maxWidth700
              ? "100%"
              : maxWidth962
                ? "70%"
                : "80%"
            : "100%"
        }
      >
        <RegularInput
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search"
          rightComponent={<SearchIconA sx={{ width: 16 }} />}
        />
      </Stack>

      {/* Add Filter button */}
      {!hideAddFilterButton && (
        <Box mt={maxWidth700 ? 2 : 0}>
          <Button
            variant="contained"
            color="warning"
            size="medium"
            disableRipple
            sx={{
              pl: 2,
              pr: 2,
            }}
          >
            <Stack direction="row" alignItems="center">
              <FilterIcon sx={{ width: 18, mt: "-2px", mr: 1 }} />
              Add Filter
            </Stack>
          </Button>
        </Box>
      )}
    </Stack>
  );
}
