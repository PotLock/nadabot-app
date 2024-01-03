import { Button, Container, Stack } from "@mui/material";
import { useCallback } from "react";
import useWeb3Auth from "@nadabot/hooks/useWeb3Auth";
import NadabotLogo from "@nadabot/assets/svgs/nadabot-logo";
import { wallet } from "@nadabot/services/web3";

const NavBar = () => {
  const { isWalletConnected, ready } = useWeb3Auth();

  const connectWalletHandler = useCallback(() => {
    wallet.startUp(true);
  }, []);

  return (
    <Container>
      <Stack
        direction="row"
        height={96}
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Left */}
        <NadabotLogo />

        {/* Right */}
        <Stack>
          <Button variant="contained">Login</Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default NavBar;
