
const initialState = {
    mediaLimits: {},
    activeSection: null,
  };
  
  const SET_MEDIA_LIMITS = "SET_MEDIA_LIMITS";
  const SET_ACTIVE_SECTION = "SET_ACTIVE_SECTION";
  
  export const setMediaLimits = (limits) => ({
    type: SET_MEDIA_LIMITS,
    payload: limits,
  });
  
  export const setActiveSection = (section) => ({
    type: SET_ACTIVE_SECTION,
    payload: section,
  });
  
  const mediaUploadReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_MEDIA_LIMITS:
        return {
          ...state,
          mediaLimits: action.payload,
        };
      case SET_ACTIVE_SECTION:
        return {
          ...state,
          activeSection: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default mediaUploadReducer;
  