import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./globals.css";
import "@near-wallet-selector/modal-ui/styles.css";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Suspense } from "react";

import { GlobalSpinnerOverlay } from "@nadabot/common/ui/components/GlobalSpinnerOverlay";
import SnackbarProvider from "@nadabot/common/ui/components/SnackbarProvider";
import { theme } from "@nadabot/common/ui/theme";
import Web3AuthProvider from "@nadabot/modules/auth/Web3AuthProvider";

import DialogsProvider from "./_layout/DialogsProvider";
import Footer from "./_layout/Footer";
import NavBar from "./_layout/NavBar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Nada.Bot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<p>Loading...</p>}>
          <GlobalSpinnerOverlay>
            <Web3AuthProvider>
              <SnackbarProvider>
                <DialogsProvider>
                  <Box>
                    <NavBar />
                    <Component {...pageProps} />
                    <Footer />
                  </Box>
                </DialogsProvider>
              </SnackbarProvider>
            </Web3AuthProvider>
          </GlobalSpinnerOverlay>
        </Suspense>
      </ThemeProvider>
    </>
  );
}
