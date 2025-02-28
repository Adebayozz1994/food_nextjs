// pages/_app.tsx
import { UserProvider } from '../../components/Usercontext/page'; 
import type { AppProps } from 'next/app'; 
import "./globals.css";


function MyApp({ Component, pageProps }: AppProps) { 
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
