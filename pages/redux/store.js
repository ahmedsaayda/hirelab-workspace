import { combineReducers, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import themeReducer from './landingPage/themeReducer';
import authReducer from "./auth/reducer";
import mediaUploadReducer from "./landingPage/mediaUploadReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  mediaUpload: mediaUploadReducer,
});

const persistConfig = {
  key: "root",
  storage,
};
const devTools =  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer,devTools);
const persistor = persistStore(store);

export { persistor, store };
