import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";

import cameraUploadSvg from "@nadabot/common/assets/svgs/camera-upload.svg";
import colors from "@nadabot/common/ui/colors";
import useBreakPoints from "@nadabot/common/ui/lib/useBreakPoints";

import ButtonContainer from "./ButtonContainer";
import Tag from "./Tag";

type Props = {
  onClick?: () => void;
  previewFileContent?: string;
  errorMessage?: string;
};

export default function UploadImage({
  onClick,
  previewFileContent,
  errorMessage,
}: Props) {
  const { maxWidth962, maxWidth600, maxWidth430 } = useBreakPoints();

  return (
    <>
      <Stack
        p={4}
        border={`1px solid ${errorMessage ? colors.ERROR_RED : colors.LIGHTGRAY}`}
        borderRadius="8px"
        direction={maxWidth430 ? "column" : "row"}
        justifyContent="space-between"
        alignItems={maxWidth430 ? "center" : "flex-start"}
        alignSelf={maxWidth962 ? "center" : "flex-start"}
        width="100%"
        maxWidth={405}
      >
        <ButtonContainer onClick={onClick}>
          <Stack
            width={maxWidth600 ? 68 : 152}
            height={maxWidth600 ? 68 : 152}
            borderRadius="8px"
            bgcolor={colors.GRAY_CC}
            alignItems="center"
            justifyContent="center"
            sx={{
              ...(previewFileContent
                ? {
                    backgroundImage: `url(${previewFileContent})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }
                : {}),
            }}
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
                sx={{
                  color: colors.GRAY,
                  width: 17,
                  transform: "rotate(45deg)",
                }}
              />
            }
            label="Attach Image"
            asButton
            onClick={onClick}
          />
        </Stack>
      </Stack>
      {errorMessage && (
        <Typography mt={1} fontSize={13} color={colors.ERROR_RED}>
          {errorMessage}
        </Typography>
      )}
    </>
  );
}
