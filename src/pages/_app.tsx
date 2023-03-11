import '@/assets/main.css';
import { YolesProvider } from '@/components/yoles-context';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <YolesProvider>
      <Component {...pageProps} />
    </YolesProvider>
  );
}

export default MyApp;
