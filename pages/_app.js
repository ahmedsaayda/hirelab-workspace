import Head from 'next/head'
import Script from 'next/script';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import "./index.css";
import "./style/index.scss";
import "react-phone-input-2/lib/style.css";
import "allotment/dist/style.css";
import "react-chat-widget/lib/styles.css";
import "react-alice-carousel/lib/alice-carousel.css";
import "../src/pages/Landingpage/components/Sharedstyle/customScrollBar.css"
import 'react-international-phone/style.css';
import "react-calendar/dist/Calendar.css";
import "../src/pages/Landingpage/Agenda.calendar.css";
import "react-phone-input-2/lib/style.css";
import "../src/styles/fileViewer.css";
import "../src/styles/chat-fix.css";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ConfigProvider } from "antd";
import { persistor, store } from "../src/redux/store";
import { HoverProvider } from "../src/contexts/HoverContext";
import { WorkspaceProvider } from "../src/contexts/WorkspaceContext";
import ThemeUpdater from "../src/pages/Dashboard/Vacancies/components/ThemeUpdater";
import { FocusProvider } from '../src/contexts/FocusContext';
import AdminReturnButton from "../src/components/AdminReturnButton";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Disable Crisp on public landing pages (lp + lp subpages like apply/thank-you)
  const isPublicLandingPage = useMemo(() => {
    // For dynamic routes, Next.js exposes `router.pathname` like: "/lp/[lpId]" or "/lp/[lpId]/apply"
    return typeof router?.pathname === 'string' && router.pathname.startsWith('/lp/[lpId]');
  }, [router?.pathname]);

  return (
    <div>
      <Head>
        <title>HireLab</title>
        <meta name="description" content="HireLab recruitment platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!isPublicLandingPage && (
        <Script
          id="crisp-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html:
              'window.$crisp=window.$crisp||[];window.CRISP_WEBSITE_ID="cb79e205-2211-45f2-abe2-5ef37c50359e";(function(){var d=document;var s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();',
          }}
        />
      )}

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeUpdater>
            <HoverProvider>
              <ConfigProvider theme={{
                token: {
                  colorPrimary: '#5207CD', // or any other color
                  borderRadius: 15,
                },
              }}>
                <FocusProvider>
                  <WorkspaceProvider>
                    <AdminReturnButton />
                    <Component {...pageProps} />
                  </WorkspaceProvider>
                </FocusProvider>
              </ConfigProvider>
            </HoverProvider>
          </ThemeUpdater>
        </PersistGate>
      </Provider>
    </div>
  )
} 
