import Head from 'next/head'
import "./index.css";
import "./style/index.scss";
import "react-phone-input-2/lib/style.css";
import "allotment/dist/style.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-chat-widget/lib/styles.css";
import "react-alice-carousel/lib/alice-carousel.css";
import "./pages/Landingpage/components/Sharedstyle/customScrollBar.css"
import 'react-international-phone/style.css';
import "react-calendar/dist/Calendar.css";
import "./pages/Landingpage/Agenda.calendar.css";
import "react-phone-input-2/lib/style.css";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ConfigProvider } from "antd";
import { persistor, store } from "../src/redux/store";
import { HoverProvider } from "../src/contexts/HoverContext";
import ThemeUpdater from "../src/components/ThemeUpdater";
import { FocusProvider } from '../src/contexts/FocusContext';

export default function App({Component, pageProps}) {
  return (
    <div>
      <Head>
        <title>HireLab</title>
        <meta name="description" content="HireLab recruitment platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ThemeUpdater>
                <HoverProvider>
                  <ConfigProvider>
                  <FocusProvider>
        <Component {...pageProps} />
                  </FocusProvider>
                  </ConfigProvider>
                </HoverProvider>
              </ThemeUpdater>
            </PersistGate>
          </Provider>
    </div>
  )
} 
