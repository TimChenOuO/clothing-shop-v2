import { Middleware } from 'redux';

import { RootState } from '../store';

export const loggerMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  if (!action.type) {
    return next(action);
  }

  console.log('type: ', action.type);
  console.log('payload: ', action.payload);
  console.log('currentState(old): ', store.getState());

  next(action);

  console.log('next state(new): ', store.getState());
};
