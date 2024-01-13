import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "@nadabot/theme/theme";
import Web3AuthProvider from "@nadabot/contexts/Web3AuthProvider";
import NavBar from "@nadabot/components/NavBar";
import DialogsProvider from "@nadabot/contexts/DialogsProvider";
import { SpinnerProvider } from "@nadabot/contexts/SpinnerProvider";
import { Suspense } from "react";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<p>Loading...</p>}>
        <SpinnerProvider>
          <Web3AuthProvider>
            <DialogsProvider>
              <Box>
                <NavBar />
                {children}
              </Box>
            </DialogsProvider>
          </Web3AuthProvider>
        </SpinnerProvider>
      </Suspense>
    </ThemeProvider>
  );
}

export default Providers;
