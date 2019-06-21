import { createLogger } from 'redux-logger';

const logger = process.env.NODE_ENV !== 'production' ? createLogger() : null;

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      console.error(err.message);
    },
    onAction: [logger],
  },
};
