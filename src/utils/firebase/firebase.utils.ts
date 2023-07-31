import { initializeApp } from 'firebase/app';
import {
  getAuth,
  // signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  NextOrObserver,
} from 'firebase/auth';

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { Category } from '../../store/categories/category.types';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDlxkBAi_JILfm96L4ck_KLkQVoxgeEZYM',
  authDomain: 'clothing-v2-16c97.firebaseapp.com',
  projectId: 'clothing-v2-16c97',
  storageBucket: 'clothing-v2-16c97.appspot.com',
  messagingSenderId: '1058904620597',
  appId: '1:1058904620597:web:2875e156cd2ad8fbe07b7c',
};

// Initialize Firebase for database
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'consent',
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
// export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export type ObjToAdd = {
  title: string;
};

export const addCollectionAndDoc = async <T extends ObjToAdd>(
  collectionKey: string,
  objToAdd: T[]
): Promise<void> => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);
  objToAdd.forEach((obj) => {
    const docRef = doc(collectionRef, obj.title.toLowerCase());
    batch.set(docRef, obj);
  });
  await batch.commit();
  console.log('Done');
};

export const getCategoriesAndDoc = async (): Promise<Category[]> => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const categoryMap = querySnapshot.docs.map((docSnapshot) => docSnapshot.data() as Category);
  // const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
  //   const { title, items } = docSnapshot.data();
  //   acc[title.toLowerCase()] = items;
  //   return acc;
  // }, {});
  return categoryMap;
};

export type AdditionalInfo = {
  displayName?: string;
};

export type UserData = {
  displayName: string;
  email: string;
  createAt: Date;
};

export const createUserDocFromAuth = async (
  userAuth: User,
  additionalInfo = {} as AdditionalInfo
): Promise<void | QueryDocumentSnapshot<UserData>> => {
  if (!userAuth) return;
  const userDocRef = doc(db, 'users', userAuth?.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot?.exists()) {
    const { displayName, email } = userAuth ?? {};
    const createAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createAt,
        ...additionalInfo,
      });
    } catch (err) {
      console.log('error for created user', err);
    }
  }

  return userSnapshot as QueryDocumentSnapshot<UserData>;
};

export type EmailAccount = {
  email: string;
  password: string;
};

export const createAuthUserWithEmailAndPassword = async ({ email, password }: EmailAccount) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async ({ email, password }: EmailAccount) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callBack: NextOrObserver<User>) =>
  onAuthStateChanged(auth, callBack);

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        unsubscribe();
        resolve(userAuth);
      },
      reject
    );
  });
};
