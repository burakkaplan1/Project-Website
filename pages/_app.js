import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider defaultTheme="system" attribute="class">
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;
