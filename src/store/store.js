import {
  compose,
  legacy_createStore as createStore,
  applyMiddleware,
} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
// import thunk from 'redux-thunk';
// import { loggerMiddleware } from './middleware/logger';
import { rootSaga } from './root-saga';
import { rootReducer } from './root-reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'],
};
const devMode = process.env.NODE_ENV !== 'production';

const sagaMiddleware = createSagaMiddleware();

const middleWares = [
  devMode && logger,
  // thunk,
  sagaMiddleware,
].filter(Boolean);

const composedEnhancer = (devMode && window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const composedEnhancers = composedEnhancer(applyMiddleware(...middleWares));

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, undefined, composedEnhancers);

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);