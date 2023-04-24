import NextNProgress from 'nextjs-progressbar';

import '@/assets/main.css';
import BaseLayout from '@/components/layout/Base';
import { YolesProvider } from '@/components/yoles-context';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).layout || BaseLayout;

  return (
    <>
      <NextNProgress
        color='#E01922'
        showOnShallow={false}
        height={2}
        startPosition={0.3}
        options={{ easing: 'ease', speed: 500, showSpinner: false }}
      />
      <YolesProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </YolesProvider>
    </>
  );
}

export default MyApp;
