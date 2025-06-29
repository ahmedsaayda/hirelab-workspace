import {
  DARK_MODE,
  LOADING,
  LOGIN,
  LOGOUT,
  PHONE,
  SET_PARTNER,
} from "./constants";

export const login = (user) => ({
  type: LOGIN,
  payload: user,
});
export const setPartner = (partner) => ({
  type: SET_PARTNER,
  payload: partner,
});

export const logout = () => ({
  type: LOGOUT,
});

export const setLoading = (loading) => ({
  type: LOADING,
  payload: loading,
});

export const setPhoneCandidate = (phone) => ({
  type: PHONE,
  payload: phone,
});

export const setDarkMode = (mode) => ({
  type: DARK_MODE,
  payload: mode,
});
