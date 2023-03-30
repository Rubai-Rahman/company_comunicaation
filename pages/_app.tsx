import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "react-query/devtools";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "@/components/Layout";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: any) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
