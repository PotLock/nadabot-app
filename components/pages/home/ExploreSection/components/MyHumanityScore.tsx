import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonIcon from "@mui/icons-material/Person";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";

import { ShadowContainer } from "@nadabot/components/containers/ShadowContainer";
import Tag from "@nadabot/components/ui/Tag";
import { useConfig } from "@nadabot/hooks/store/useConfig";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import colors from "@nadabot/theme/colors";

const calcPercentage = (score: number, human_threshold: number) =>
  Math.min((score * 100) / human_threshold, 100);

export default function MyHumanityScore() {
  const { maxWidth1144, maxWidth700, maxWidth480 } = useBreakPoints();
  const { config } = useConfig();

  const { isVerifiedHuman, score } = useUser();
  const [percentageScore] = useState(
    calcPercentage(score, config.default_human_threshold),
  );

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
              color={percentageScore === 100 ? "#06c954" : "#DD3345"}
              fontSize={54}
              fontWeight={900}
              lineHeight="normal"
            >
              {score.toFixed(0)}
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
conic-gradient(${percentageScore === 100 ? "#06c954" : "#DD3345"} ${percentageScore}%, #DBDBDB 0)`,
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
            {isVerifiedHuman
              ? "Congrats, you're a human!"
              : "You are not yet considered a human. Collect more stamps to become a human so other applications can call our contract to grant you permissioness for human-gated benefits."}
          </Typography>
        </Stack>
      </ShadowContainer>
    </Stack>
  );
}
