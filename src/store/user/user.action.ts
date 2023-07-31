import { User } from 'firebase/auth';

import { USER_ACTION_TYPES } from './user.types';
import {
  Action,
  ActionWithPayload,
  createAction,
  withMatcher,
} from '../../utils/reducer/reducer.utils';
import { AdditionalInfo, EmailAccount, UserData } from '../../utils/firebase/firebase.utils';

// Action type
export type CheckUserSession = Action<USER_ACTION_TYPES.CHECK_USER_SESSION>;
export type SetCurrentUser = ActionWithPayload<USER_ACTION_TYPES.SET_CURRENT_USER, UserData>;
export type GoogleSignInStart = Action<USER_ACTION_TYPES.GOOGLE_SIGN_IN_START>;
export type EmailSignInStart = ActionWithPayload<
  USER_ACTION_TYPES.EMAIL_SIGN_IN_START,
  EmailAccount
>;
export type SignInSuccess = ActionWithPayload<USER_ACTION_TYPES.SIGN_IN_SUCCESS, UserData>;
export type SignInFailed = ActionWithPayload<USER_ACTION_TYPES.SIGN_IN_FAILED, Error>;
export type SignUpStart = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_UP_START,
  EmailAccount & { displayName: string }
>;
export type SignUpSuccess = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_UP_SUCCESS,
  { user: User; additionalDetails: AdditionalInfo }
>;
export type SignUpFailed = ActionWithPayload<USER_ACTION_TYPES.SIGN_UP_FAILED, Error>;
export type SignOutStart = Action<USER_ACTION_TYPES.SIGN_OUT_START>;
export type SignOutSuccess = Action<USER_ACTION_TYPES.SIGN_OUT_SUCCESS>;
export type SignOutFailed = ActionWithPayload<USER_ACTION_TYPES.SIGN_OUT_FAILED, Error>;

// Action
export const checkUserSession = withMatcher(
  (): CheckUserSession => createAction(USER_ACTION_TYPES.CHECK_USER_SESSION)
);

export const setCurrentUser = withMatcher(
  (user: UserData): SetCurrentUser => createAction(USER_ACTION_TYPES.SET_CURRENT_USER, user)
);

export const googleSignInStart = withMatcher(
  (): GoogleSignInStart => createAction(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START)
);

export const emailSignInStart = withMatcher(
  (email: string, password: string): EmailSignInStart =>
    createAction(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, { email, password })
);

// Sign in
export const signInSuccess = withMatcher(
  (user: UserData & { id: string }): SignInSuccess =>
    createAction(USER_ACTION_TYPES.SIGN_IN_SUCCESS, user)
);
export const signInFailed = withMatcher((error: Error) =>
  createAction(USER_ACTION_TYPES.SIGN_IN_FAILED, error)
);

// Sign up
export const signUpStart = withMatcher(
  (email: string, password: string, displayName: string): SignUpStart =>
    createAction(USER_ACTION_TYPES.SIGN_UP_START, { email, password, displayName })
);
export const signUpSuccess = withMatcher(
  (user: User, additionalDetails: AdditionalInfo): SignUpSuccess =>
    createAction(USER_ACTION_TYPES.SIGN_UP_SUCCESS, { user, additionalDetails })
);
export const signUpFailed = withMatcher(
  (error: Error): SignUpFailed => createAction(USER_ACTION_TYPES.SIGN_UP_FAILED, error)
);

// Sign out
export const signOutStart = withMatcher(
  (): SignOutStart => createAction(USER_ACTION_TYPES.SIGN_OUT_START)
);
export const signOutSuccess = withMatcher(
  (): SignOutSuccess => createAction(USER_ACTION_TYPES.SIGN_OUT_SUCCESS)
);
export const signOutFailed = withMatcher(
  (error: Error): SignOutFailed => createAction(USER_ACTION_TYPES.SIGN_OUT_FAILED, error)
);
