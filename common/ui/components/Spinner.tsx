import { Stack, SxProps, Theme } from "@mui/material";
import Image from "next/image";

import nadabotIcon from "@nadabot/common/assets/images/nadabot-icon.png";

export type SpinnerProps = {
  sx?: SxProps<Theme>;
};

export const Spinner: React.FC<SpinnerProps> = ({ sx }) => (
  <Stack direction="row" {...{ sx }}>
    <div className="nadabot-spinner">
      <Image
        src={nadabotIcon.src}
        priority={true}
        width={50}
        height={50}
        alt="Nada.Bot"
        style={{ marginRight: "8px" }}
      />
    </div>
  </Stack>
);
