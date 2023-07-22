// https://redux-saga.js.org/docs/api/
// https://pjchender.dev/react/redux-saga
import { takeLatest, all, call, put } from 'redux-saga/effects';

import { getCategoriesAndDoc } from '../../utils/firebase/firebase.utils';
import { fetchCategoriesSuccess, fetchCategoriesFailure } from './category.action';
import { CATEGORIES_ACTION_TYPES } from './category.types';

export function* fetchCategoriesAsync() {
  try {
    // call() will trigger fun
    // ex: call(fun, ...arg)
    const categoriesArray = yield call(getCategoriesAndDoc, 'categories');
    // put(Action) like dispatch() 
    // ex: put({ type: xxx, payload: xxx })
    yield put(fetchCategoriesSuccess(categoriesArray));
  } catch (error) {
    yield put(fetchCategoriesFailure(error));
  }
};

export function* onFetchCategories() {
  // ex: takeLatest(pattern: string, saga: Generator func, ...args)
  yield takeLatest(CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_START, fetchCategoriesAsync)
};

export function* categoriesSaga() {
  // all([...effects]) like Promise.all()
  // saga: Generator func
  // ex: all([ call(saga) ]) || all([ saga() ])
  yield all([call(onFetchCategories)])
}