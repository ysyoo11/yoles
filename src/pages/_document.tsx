import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* <Script src='/js/redirectIE.js' strategy='beforeInteractive' /> */}
      </body>
    </Html>
  );
}
