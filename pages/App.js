import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { ConfigProvider } from "antd";
import RouteInit from "./RouteInit";
import { persistor, store } from "./redux/store";
import { HoverProvider } from "./contexts/HoverContext";

import ThemeUpdater from "./components/ThemeUpdater";

function applyScaling(scaleFactor) {
  document.body.style.zoom = scaleFactor * 100 + "%"; // Set zoom to 80%
}
const App = () => {
  useEffect(() => {
    // applyScaling(0.8); // Auto scale to 90% on mount
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeUpdater>
          <HoverProvider>
              <ConfigProvider>
                <RouteInit />
              </ConfigProvider>
          </HoverProvider>
        </ThemeUpdater>
      </PersistGate>
    </Provider>
  );
};

export default App;
