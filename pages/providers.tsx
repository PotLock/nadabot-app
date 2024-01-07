import React from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "@nadabot/theme/theme";
import Web3AuthProvider from "@nadabot/contexts/Web3AuthProvider";
import NavBar from "@nadabot/components/NavBar";
import DialogsProvider from "@nadabot/contexts/DialogsProvider";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3AuthProvider>
        <DialogsProvider>
          <Box>
            <NavBar />
            {children}
          </Box>
        </DialogsProvider>
      </Web3AuthProvider>
    </ThemeProvider>
  );
}

export default Providers;
