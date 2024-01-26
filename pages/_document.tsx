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
        <link rel="icon" href="/favicon.ico" sizes="32x32" />

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
