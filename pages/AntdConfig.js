import React from "react";
import "./style/index.scss";

import { ThemeProvider, createMuiTheme } from "@mui/material";
import { ConfigProvider, theme } from "antd";
import { useSelector } from "react-redux";
import RouteInit from "./RouteInit";
import { brandColor } from "./data/constants";
import { getPartner, selectDarkMode } from "./redux/auth/selectors";

const themeMUI = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: brandColor,
      // dark: will be calculated from palette.primary.main,
    },
  },
  overrides: {
    MuiButton: {
      contained: {
        color: brandColor,
        backgroundColor: brandColor,
        "&:hover": {
          backgroundColor: brandColor,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: brandColor,
          },
        },
      },
    },
  },
});

const AntdConfig = () => {
  const darkMode = useSelector(selectDarkMode);
  const { defaultAlgorithm, darkAlgorithm } = theme;

  return (
    <>
      <ConfigProvider
        theme={{
          token: { colorPrimary: brandColor },
          algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
          components: {
            Modal: {
              titleFontSize: 28,
              titleFontWeight: 700,
            },
          },
        }}
      >
        <ThemeProvider theme={themeMUI}>
            <RouteInit />
        </ThemeProvider>
      </ConfigProvider>
    </>
  );
};

export default AntdConfig;
