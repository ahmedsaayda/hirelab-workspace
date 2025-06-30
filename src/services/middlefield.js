import { message } from "antd";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { logout, setLoading } from "../redux/auth/actions";
import { store } from "../redux/store";
import { getBackendUrl } from "./getBackendUrl";

export const middleField = (api) => {
  api.interceptors.response.use(
    (response) => {
      store.dispatch(setLoading(false));
      if (response?.data?.message) message.success(response.data.message, [8]);
      return response;
    },
    (error) => {
      store.dispatch(setLoading(false));
      const { response } = error;
      if (response) {
        const { data } = response;
        if (data && data.message) {
          if (
            ["Invalid access_token", "Access blocked!!"].includes(data.message)
          ) {
            store.dispatch(logout());
            window.location.href = "/";
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            return;
          }

          if (
            ![
              "jwt expired",
              "jwt_expired",
              "jwt must be provided",
              "Access blocked!!",
            ].includes(data.message)
          )
            message.error(data.message);
        }
      }
      return Promise.reject(error);
    }
  );

  api.interceptors.request.use(
    async (config) => {
      store.dispatch(setLoading(true));

      let access_token = Cookies.get("accessToken");
      let refresh_token = Cookies.get("refreshToken");

      if (access_token) {
        const decodedToken = jwt_decode(access_token);
        if (5000 + decodedToken.exp * 1000 <= new Date()) {
          var raw = JSON.stringify({
            accessToken: access_token,
            refreshToken: refresh_token,
          });

          var requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: raw,
          };
          const result = await fetch(
            getBackendUrl() + "/auth/refresh",
            requestOptions
          );

          const response = await result.json();

          if (!response?.accessToken) {
            store.dispatch(logout());
            window.location.href = "/";
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            return;
          }

          Cookies.set("accessToken", response?.accessToken);
          Cookies.set("refreshToken", response?.refreshToken);

          access_token = response?.accessToken;
          refresh_token = response?.refreshToken;
        }
      }

      const currentData = config?.data ?? {};
      return {
        ...config,
        data: {
          ...currentData,
          domain: window.location.host,
        },
        params: {
          ...config.params,
          domain: window.location.host,
        },
        headers: {
          access_token,
          refresh_token,
        },
      };
    },
    (error) => {
      store.dispatch(setLoading(false));
      return Promise.reject(error);
    }
  );
};
