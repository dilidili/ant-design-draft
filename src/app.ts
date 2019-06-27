import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import immutableTransform from 'redux-persist-transform-immutable';

const logger = process.env.NODE_ENV !== 'production' ? createLogger() : null;

const persistEnhancer = () => createStore => (reducer, initialState) => {
  const persistedReducer = persistReducer({
    key: 'root',
    storage: storage,
    whitelist: ['save'],
    transforms: [immutableTransform()],
  }, reducer);

  const store = createStore(persistedReducer, initialState);
  const persist = persistStore(store);
  return {
    persist,
    ...store,
  };
};

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      console.error(err.message);
    },
    onAction: [logger],
    extraEnhancers: [persistEnhancer()],
  },
};
