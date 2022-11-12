import Document, { Head, Html, Main, NextScript } from 'next/document';
import { useEffect } from 'react';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="/favicon.png" />

          <script defer data-domain="xdevhub.com" src="https://plausible.io/js/script.js"></script>

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

          <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
