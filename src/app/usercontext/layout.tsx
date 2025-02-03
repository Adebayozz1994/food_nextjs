// pages/_app.tsx
import { UserProvider } from '../usercontext/page'; 
import type { AppProps } from 'next/app'; 
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) { 
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
