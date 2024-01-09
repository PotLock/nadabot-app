import {
  Avatar,
  Box,
  Button,
  Chip,
  Stack,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import colors from "@nadabot/theme/colors";
import React from "react";

type Props = {
  hidePoints?: boolean;
  sx?: SxProps<Theme>;
};

export default function ContractInfo({ hidePoints, sx }: Props) {
  // TODO: get the real accountId
  const accountId = "wendersonpires.near";

  return (
    <Stack maxWidth={352} width="100%" sx={sx}>
      <Stack
        p={2}
        sx={{
          border: `1px solid ${colors.LIGHTGRAY}`,
          borderRadius: 2,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          {/* Circle */}
          <Box
            bgcolor={"rgba(0, 0,0,.2)"}
            width={80}
            height={80}
            borderRadius={999}
          />
          {!hidePoints && (
            <Stack alignItems="flex-end">
              <Typography fontWeight={600} fontSize={24}>
                19.27
              </Typography>
              <Typography fontSize={17}>Points</Typography>
            </Stack>
          )}
        </Stack>

        {/* Contract Name */}
        <Typography fontWeight={600} fontSize={20} mt={3}>
          Lorem Ipsum Contract
        </Typography>

        {/* Contract's accountId and Method */}
        <Stack direction="row" alignItems="center">
          <Typography
            fontWeight={500}
            fontSize={16}
            color={colors.NEUTRAL}
            mr={1}
          >
            I-am-a-Human.near
          </Typography>
          <Chip label="IsHuman()" variant="outlined" />
        </Stack>

        {/* Description */}
        <Typography
          fontWeight={400}
          className="multiline-ellipsis"
          mt={2}
          mb={2}
        >
          Lorem ipsum dolor sit amet, consectet adi piscing elit, sed do eiusmod
          tempor ncididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
          ea commodo consequat. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </Typography>
      </Stack>

      {/* Author - SUBMITTED BY - section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        p={2}
        sx={{
          border: `1px solid ${colors.LIGHTGRAY}`,
          borderRadius: 2,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderTop: "none",
        }}
      >
        <Stack>
          <Typography fontWeight={700} fontSize={12} color={colors.NEUTRAL700}>
            SUBMITTED BY
          </Typography>
          <Stack direction="row" alignItems="center">
            <Avatar
              sx={{
                background: colors.PRIMARY,
                width: 20,
                height: 20,
                fontSize: 12,
                mr: 1,
              }}
            >
              {accountId[0]}
            </Avatar>
            <Typography
              fontWeight={500}
              color={colors.NEUTRAL400}
              fontSize={16}
              className="ellipsis"
              maxWidth="200px"
            >
              lorem.ipsum.near
            </Typography>
          </Stack>
        </Stack>
        <Button variant="contained" color="warning" size="medium" disableRipple>
          Verify
        </Button>
      </Stack>
    </Stack>
  );
}
