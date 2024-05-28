import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TelegramIcon from "@mui/icons-material/Telegram";
import XIcon from "@mui/icons-material/X";
import { Container, Divider, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import nearIconImage from "@nadabot/common/assets/images/near-icon.png";
import robotImage from "@nadabot/common/assets/images/robot.png";
import colors from "@nadabot/common/ui/colors";
import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";
import { useUser } from "@nadabot/modules/core/store/useUser";

const Footer = () => {
  const { walletConnected } = useUser();
  const { maxWidth600, maxWidth430 } = useBreakPoints();

  return (
    <Stack sx={{ background: `${colors.NEUTRAL50} url(${robotImage.src})` }}>
      <Container>
        <Stack alignItems="center" py={14}>
          <Typography
            color="#F7CE55"
            fontSize={maxWidth600 ? (maxWidth430 ? "28px" : "42px") : "64px"}
            fontWeight={500}
            lineHeight="48px"
            sx={{ WebkitTextStroke: "#292929 1px" }}
          >
            prove that you are
          </Typography>
          <Typography
            color="#2D6FDB"
            fontSize={maxWidth600 ? (maxWidth430 ? "34px" : "54px") : "72px"}
            fontFamily="Oi"
            sx={{ WebkitTextStroke: "#FAFAFA 1.5px" }}
          >
            nada.bot
          </Typography>

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
            {walletConnected && (
              <>
                <li>
                  <Link href="/add-stamp" target="_self">
                    Submit Check
                  </Link>
                </li>
                <li>
                  <Link href="/#explore">Search Humans</Link>
                </li>
              </>
            )}

            <li>
              <Link href="/rules">See All Rules</Link>
            </li>
          </ul>

          <Divider
            orientation="horizontal"
            sx={{ bgcolor: colors.PRIMARY, mb: 4, mt: 6 }}
            flexItem
          />

          <ul className="u-list-socials">
            <li>
              <Link href="https://www.nada.bot/twitter" target="_blank">
                <XIcon sx={{ width: 32, height: 32 }} />
              </Link>
            </li>
            <li>
              <Link href="https://www.nada.bot/linkedin" target="_blank">
                <LinkedInIcon sx={{ width: 36, height: 36 }} />
              </Link>
            </li>
            <li>
              <Link href="https://www.nada.bot/telegram" target="_blank">
                <TelegramIcon sx={{ width: 36, height: 36 }} />
              </Link>
            </li>
            <li>
              <Link href="https://www.nada.bot/near" target="_blank">
                <Image
                  src={nearIconImage.src}
                  width={36}
                  height={36}
                  alt="NEAR"
                />
              </Link>
            </li>
          </ul>
        </Stack>
      </Container>
    </Stack>
  );
};

export default Footer;
