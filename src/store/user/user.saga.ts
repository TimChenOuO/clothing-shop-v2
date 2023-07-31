// import { takeLatest, all, call, put } from 'redux-saga/effects';
import { takeLatest, all, call, put } from 'typed-redux-saga/macro';
import { User } from 'firebase/auth';

import { USER_ACTION_TYPES } from './user.types';
import {
  signInFailed,
  signInSuccess,
  signOutFailed,
  signOutSuccess,
  signUpFailed,
  signUpSuccess,
  EmailSignInStart,
  SignUpStart,
  SignUpSuccess,
} from './user.action';
import {
  createUserDocFromAuth,
  getCurrentUser,
  signInAuthUserWithEmailAndPassword,
  signInWithGooglePopup,
  createAuthUserWithEmailAndPassword,
  signOutUser,
  AdditionalInfo,
} from '../../utils/firebase/firebase.utils';

export function* getSnapshotFromUserAuth(userAuth: User, additionalInfo?: AdditionalInfo) {
  try {
    const userSnapshot = yield* call(createUserDocFromAuth, userAuth, additionalInfo);
    // console.log(userSnapshot);
    // console.log(userSnapshot.data());
    if (userSnapshot) {
      yield* put(signInSuccess({ ...userSnapshot.data(), id: userSnapshot?.id }));
    }
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

export function* signInWithEmail({ payload }: EmailSignInStart) {
  try {
    const userCredential = yield* call(signInAuthUserWithEmailAndPassword, payload);
    if (userCredential) {
      yield* call(getSnapshotFromUserAuth, userCredential.user);
    }
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

export function* signInWithGoogle() {
  try {
    const { user } = yield* call(signInWithGooglePopup);
    yield* call(getSnapshotFromUserAuth, user);
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

export function* signUp({ payload: { displayName, ...account } }: SignUpStart) {
  try {
    const userCredential = yield* call(createAuthUserWithEmailAndPassword, account);
    if (userCredential) {
      yield* put(signUpSuccess(userCredential.user, { displayName }));
    }
  } catch (error) {
    yield* put(signUpFailed(error as Error));
  }
}

export function* signInAfterSignUp({ payload: { user, additionalDetails } }: SignUpSuccess) {
  yield* call(getSnapshotFromUserAuth, user, additionalDetails);
}

export function* signOut() {
  try {
    yield* call(signOutUser);
    yield* put(signOutSuccess());
  } catch (error) {
    yield* put(signOutFailed(error as Error));
  }
}

export function* isUserAuthenticated() {
  try {
    const userAuth = yield* call(getCurrentUser);
    if (!userAuth) return;
    yield* call(getSnapshotFromUserAuth, userAuth);
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

// Listener
export function* onSignUpStart() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* onEmailSignInStart() {
  yield* takeLatest(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onGoogleSignInStart() {
  yield* takeLatest(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onSignOutStart() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut);
}

export function* onCheckUserSession() {
  yield* takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* userSaga() {
  yield* all([
    call(onCheckUserSession),
    call(onGoogleSignInStart),
    call(onEmailSignInStart),
    call(onSignUpStart),
    call(onSignUpSuccess),
    call(onSignOutStart),
  ]);
}
