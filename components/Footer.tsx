import { Container, Stack, Typography } from "@mui/material";
import Link from "next/link";

import robotImage from "@nadabot/assets/images/robot.png";
import colors from "@nadabot/theme/colors";

const Footer = () => {
  return (
    <Stack sx={{ background: `${colors.NEUTRAL50} url(${robotImage.src})` }}>
      <Container>
        <Stack alignItems="center" py={14}>
          <Typography className="yellow-strong">prove that you are</Typography>
          <Typography className="blue-strong">nada.bot</Typography>

          <ul className="u-list">
            <li>
              <Link href="https://docs.nada.bot/" target="_blank">
                Docs
              </Link>
            </li>
            <li>
              <Link href="https://docs.nada.bot/" target="_blank">
                Integrate
              </Link>
            </li>
            <li>
              <Link href="/add-stamp" target="_self">
                Submit Check
              </Link>
            </li>
            <li>
              <Link href="/#explore">Search Humans</Link>
            </li>
          </ul>
        </Stack>
      </Container>
    </Stack>
  );
};

export default Footer;
