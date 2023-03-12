import '@/assets/main.css';
import BaseLayout from '@/components/layout/Base';
import { YolesProvider } from '@/components/yoles-context';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).layout || BaseLayout;

  return (
    <YolesProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </YolesProvider>
  );
}

export default MyApp;
