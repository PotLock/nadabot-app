import { Box, Button, Stack } from "@mui/material";
import React from "react";
import SearchInput from "./SearchInput";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import { FilterIcon } from "@nadabot/theme/icons";

export function AddFilterSearchInput() {
  const { maxWidth700 } = useBreakPoints();

  return (
    <Stack
      direction={maxWidth700 ? "column" : "row"}
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack width={maxWidth700 ? "100%" : "80%"}>
        <SearchInput placeholder="Search" />
      </Stack>

      {/* Add Filter button */}
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
    </Stack>
  );
}
