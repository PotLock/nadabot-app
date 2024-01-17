import {
  Avatar,
  Box,
  Button,
  Chip,
  Slider,
  Stack,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import colors from "@nadabot/theme/colors";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import CustomCircularProgress from "./ui/CustomCircularProgress";
import * as contract from "@nadabot/services/web3/contract-interface";

type Props = {
  hidePoints?: boolean;
  sx?: SxProps<Theme>;
  details: {
    providerId: string;
    title: string;
    imageURL?: string;
    contractName: string;
    method: string;
    description: string;
    submittedByAccountId: string;
    points?: number;
  };
  isPreview?: boolean;
};

export default function ContractInfo({
  hidePoints,
  sx,
  details,
  isPreview,
}: Props) {
  const { maxWidth430 } = useBreakPoints();

  const verifyHandler = useCallback(() => {
    if (!isPreview) {
      // Handle here
    }
  }, [isPreview]);

  const [points, setPoints] = useState(details.points);
  const [previousPoints, setPreviousPoints] = useState(details.points);
  const debouncedPoints = useDebounce(points, 1200);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (debouncedPoints !== previousPoints) {
      setPreviousPoints(debouncedPoints);

      // Update this Provider points
      (async () => {
        setUpdating(true);
        await contract.update_provider({ provider_id: details.providerId });
        setUpdating(false);
      })();
    }
  }, [debouncedPoints, points, previousPoints, details.providerId]);

  const changePointsHandler = useCallback(async (newValue: number) => {
    setPoints(newValue);
  }, []);

  return (
    <Stack maxWidth={maxWidth430 ? "100%" : 352} width="100%" sx={sx}>
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
            sx={{
              ...(details.imageURL
                ? {
                    backgroundImage: `url(${details.imageURL})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }
                : {}),
            }}
          />
          {!hidePoints && (
            <Stack alignItems="flex-end">
              <Typography fontWeight={600} fontSize={24}>
                {points}
              </Typography>
              <Typography fontSize={17}>Points</Typography>
            </Stack>
          )}
        </Stack>

        {/* Contract Name */}
        <Typography fontWeight={600} fontSize={20} mt={3}>
          {details.title || "Contract Title"}
        </Typography>

        {/* Contract's accountId and Method */}
        <Stack direction="row" alignItems="center">
          <Typography
            fontWeight={500}
            fontSize={16}
            color={colors.NEUTRAL}
            mr={1}
            className="stamp-contractid-multiline-ellipsis"
          >
            {details.contractName || "contract.name.near"}
          </Typography>
          <Chip
            label={details.method ? `${details.method}()` : "IsHuman()"}
            variant="outlined"
          />
        </Stack>

        {/* Description */}
        <Typography
          fontWeight={400}
          className="stamp-description-multiline-ellipsis"
          mt={2}
          mb={2}
        >
          {details.description ||
            "Lorem ipsum dolor sit amet, consectet adipiscing elit, sed do eiusmod tempor ncididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
        </Typography>

        {/* Edit Points */}
        <Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row">
              <Typography fontWeight={600} mr={1}>
                Edit Points
              </Typography>
              <InfoOutlinedIcon sx={{ color: colors.NEUTRAL300, width: 16 }} />
            </Stack>
            <Stack borderRadius="4px" border={`1px solid ${colors.NEUTRAL100}`}>
              <Typography fontWeight={600} color={colors.NEUTRAL500} px={1}>
                {points} pts
              </Typography>
            </Stack>
          </Stack>
          {updating ? (
            <CustomCircularProgress sx={{ py: 1 }} size={30} />
          ) : (
            <Slider
              value={points}
              // NOTE: Check this with Lachlan
              max={100}
              min={0}
              aria-label="Default"
              valueLabelDisplay="auto"
              onChange={(_, newValue) =>
                changePointsHandler(newValue as number)
              }
            />
          )}
        </Stack>
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
              {/* First letter only */}
              {details.submittedByAccountId[0]}
            </Avatar>
            <Typography
              fontWeight={500}
              color={colors.NEUTRAL400}
              fontSize={16}
              className="ellipsis"
              maxWidth="180px"
            >
              {details.submittedByAccountId}
            </Typography>
          </Stack>
        </Stack>
        <Button
          variant="contained"
          color="warning"
          size="medium"
          disableRipple
          onClick={verifyHandler}
        >
          Verify
        </Button>
      </Stack>
    </Stack>
  );
}
