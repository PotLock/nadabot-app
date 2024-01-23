import { Stack, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonIcon from "@mui/icons-material/Person";
import { ShadowContainer } from "@nadabot/components/containers/ShadowContainer";
import { useConfig } from "@nadabot/hooks/store/useConfig";
import colors from "@nadabot/theme/colors";
import Tag from "@nadabot/components/ui/Tag";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import { useStamps } from "@nadabot/hooks/store/useStamps";

export default function MyHumanityScore() {
  const { maxWidth1144, maxWidth700, maxWidth480 } = useBreakPoints();
  const { config } = useConfig();
  const { stamps } = useStamps();
  console.log("MyHumanityScore.tsx STAMPS:", stamps);

  // TODO: Fake for now
  const userStampsScore = 12; // sum all stamp scores then divide by the lenght of stamps
  const weightPoints = (userStampsScore * 100) / config.default_human_threshold;
  const visualWeidghtPoints = weightPoints / 10;

  // TODO: check if it's a verified human
  const isVerifiedHuman = false;

  return (
    <Stack width={maxWidth1144 ? "100%" : "55%"} mt={4}>
      <ShadowContainer
        sx={{
          display: "flex",
          flexDirection: maxWidth700 ? "column" : "row",
          alignItems: "center",
          px: 3,
        }}
      >
        {/* Circle */}
        <Stack width="fit-content" justifyContent="center" alignItems="center">
          <Stack
            width={168}
            height={168}
            zIndex={1}
            justifyContent="center"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center">
              <InfoOutlinedIcon sx={{ color: colors.NEUTRAL300, width: 16 }} />
              <Typography
                color={colors.NEUTRAL300}
                fontSize={8}
                fontWeight={600}
                ml={0.2}
              >
                How to become human
              </Typography>
            </Stack>
            <Typography
              color="#DD3345"
              fontSize={54}
              fontWeight={900}
              lineHeight="normal"
            >
              {visualWeidghtPoints}
            </Typography>
            <Typography
              color={colors.NEUTRAL300}
              fontWeight={600}
              borderTop={`1px solid ${colors.NEUTRAL300}`}
            >
              {config.default_human_threshold} Points
            </Typography>
          </Stack>
          <div
            className="progress-bar"
            style={{
              background: `radial-gradient(closest-side, white 88%, transparent 89% 100%),
conic-gradient(#DD3345 ${weightPoints}%, #DBDBDB 0)`,
            }}
          />
          <div className="circle-limiter" />
        </Stack>

        {/* Right Content */}
        <Stack
          ml={maxWidth700 ? 0 : 4}
          mt={maxWidth700 ? 2 : 0}
          alignItems={maxWidth700 ? "center" : "flex-start"}
        >
          <Stack
            direction={maxWidth480 ? "column" : "row"}
            alignItems="center"
            mb={2}
          >
            <PersonIcon sx={{ width: 28, height: 28, mt: -0.5, mr: 1 }} />
            <Typography
              fontSize={18}
              fontWeight={700}
              lineHeight="normal"
              mr={2}
            >
              My Humanity Score
            </Typography>
            <Tag
              label={isVerifiedHuman ? "Verified Human" : "Not A Human"}
              size="small"
              type={isVerifiedHuman ? "blue" : "red"}
              sx={{ mt: maxWidth480 ? 2 : 0 }}
            />
          </Stack>
          <Typography color={colors.NEUTRAL400} lineHeight="148%">
            You are not yet considered a human. Collect more stamps to become a
            human so other applications can call our contract to grant you
            permissioness for human-gated benefits.
          </Typography>
        </Stack>
      </ShadowContainer>
    </Stack>
  );
}
