import { useCallback } from "react";
import { Stack, Typography } from "@mui/material";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import Image from "next/image";
import cameraUploadSvg from "@nadabot/assets/svgs/camera-upload.svg";
import colors from "@nadabot/theme/colors";
import Tag from "./ui/Tag";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import ButtonContainer from "./containers/ButtonContainer";

type Props = {};

export default function UploadImage(props: Props) {
  const { maxWidth962, maxWidth600, maxWidth430 } = useBreakPoints();

  const uploadHandler = useCallback(() => {}, []);

  return (
    <Stack
      p={4}
      border={`1px solid ${colors.LIGHTGRAY}`}
      borderRadius="8px"
      direction={maxWidth430 ? "column" : "row"}
      justifyContent="space-between"
      alignItems={maxWidth430 ? "center" : "flex-start"}
      alignSelf={maxWidth962 ? "center" : "flex-start"}
      width="100%"
      maxWidth={405}
    >
      <ButtonContainer onClick={uploadHandler}>
        <Stack
          width={maxWidth600 ? 68 : 152}
          height={maxWidth600 ? 68 : 152}
          borderRadius="8px"
          bgcolor={colors.GRAY_CC}
          alignItems="center"
          justifyContent="center"
        >
          <Image
            width={maxWidth600 ? 50 : 63}
            src={cameraUploadSvg}
            alt="Upload Image"
          />
        </Stack>
      </ButtonContainer>

      <Stack
        alignItems={maxWidth430 ? "center" : "flex-start"}
        mt={maxWidth430 ? 2 : 0}
      >
        <Typography fontWeight={600} mb={0.5}>
          Attach Icon
        </Typography>
        <Tag
          leftContent={
            <AttachFileOutlinedIcon
              sx={{ color: colors.GRAY, width: 17, transform: "rotate(45deg)" }}
            />
          }
          label="Attach Image"
          asButton
          onClick={uploadHandler}
        />
      </Stack>
    </Stack>
  );
}
