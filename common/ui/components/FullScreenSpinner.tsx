import { Stack } from "@mui/material";
import Image from "next/image";

import nadabotIcon from "@nadabot/common/assets/images/nadabot-icon.png";

export default function FullScreenSpinner() {
  return (
    <Stack
      width="100%"
      height="100%"
      position="fixed"
      justifyContent="center"
      alignItems="center"
      bgcolor="#FFFFFF"
      zIndex={999}
    >
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
}
