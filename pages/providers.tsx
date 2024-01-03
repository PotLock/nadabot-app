import React from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "@nadabot/theme/theme";
import Web3AuthProvider from "@nadabot/contexts/Web3AuthProvider";
import NavBar from "@nadabot/components/NavBar";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3AuthProvider>
        <Box>
          <NavBar />
          {children}
        </Box>
      </Web3AuthProvider>
    </ThemeProvider>
  );
}

export default Providers;
