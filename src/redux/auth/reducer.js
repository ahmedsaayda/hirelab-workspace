import {
  DARK_MODE,
  LOADING,
  LOGIN,
  LOGOUT,
  PHONE,
  SET_PARTNER,
} from "./constants";

const initialState = {
  user: null,
  partner: null,
  phoneCandidate: null,
  darkMode: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
      };
    case LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_PARTNER:
      return {
        ...state,
        partner: action.payload,
      };
    case PHONE:
      return {
        ...state,
        phoneCandidate: action.payload,
      };
    case DARK_MODE:
      return {
        ...state,
        darkMode: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
