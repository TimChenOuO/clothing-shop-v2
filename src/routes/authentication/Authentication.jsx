import { useEffect } from "react";
import {
  // auth,
  createUserDocFromAuth,
  signInWithGooglePopup,
  // signInWithGoogleRedirect,
} from "../../utils/firebase/firebase.utils";
import SignUpForm from "../../components/sign-up-form/SignUpForm";
import SignInForm from "../../components/sign-in-form/SignInForm";
// import { getRedirectResult } from "firebase/auth";

import './authentication.scss';

const Authentication = () => {

  // useEffect(() => {
  //   const fetchAuth = async () => {
  //     const res = await getRedirectResult(auth);
  //     if (res) {
  //       const userDocRef = await createUserDocFromAuth(res?.user);
  //     }
  //   };
  //   fetchAuth();
  // }, []);

  const logGoogleUser = async () => {
    const res = await signInWithGooglePopup();
    const userDocRef = await createUserDocFromAuth(res?.user);
  };


  return (
    <div className="authentication-container">
      <SignInForm />
      <SignUpForm />
    </div>
  );
};

export default Authentication;
