import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./globals.css";
import "@near-wallet-selector/modal-ui/styles.css";

import type { AppProps } from "next/app";
import Head from "next/head";

import Providers from "./providers";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Nada.Bot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </>
  );
}
