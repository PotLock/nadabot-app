import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { Suspense } from "react";

import Footer from "@nadabot/components/Footer";
import NavBar from "@nadabot/components/NavBar";
import DialogsProvider from "@nadabot/contexts/DialogsProvider";
import SnackbarProvider from "@nadabot/contexts/SnackbarProvider";
import { SpinnerProvider } from "@nadabot/contexts/SpinnerProvider";
import Web3AuthProvider from "@nadabot/contexts/Web3AuthProvider";
import { theme } from "@nadabot/theme/theme";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<p>Loading...</p>}>
        <SpinnerProvider>
          <Web3AuthProvider>
            <SnackbarProvider>
              <DialogsProvider>
                <Box>
                  <NavBar />
                  {children}
                  <Footer />
                </Box>
              </DialogsProvider>
            </SnackbarProvider>
          </Web3AuthProvider>
        </SpinnerProvider>
      </Suspense>
    </ThemeProvider>
  );
}

export default Providers;
