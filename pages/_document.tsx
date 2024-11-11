import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Making your contracts human compatible"
        />

        {/* og */}
        <meta property="og:title" content="Nada.Bot" />
        <meta
          property="og:description"
          content="Making sure your users are not bot, built on NEAR"
        />

        <meta property="twitter:card" content="summary_large_image"></meta>
        <meta name="image" content="/preview.png" />
        <meta property="og:image" content="/preview.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta charSet="utf-8"></meta>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Font weights: 400, 500, 600, 700 */}
        <link
          href="https://fonts.cdnfonts.com/css/mona-sans?styles=144345,144339,144351,144321"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Oi&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
