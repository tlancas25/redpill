import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from '../types';

const googleProvider = new GoogleAuthProvider();

const requireAuth = () => {
  if (!auth) throw new Error('Firebase is not configured. Please add your Firebase config to .env');
  return auth;
};

const requireDb = () => {
  if (!db) throw new Error('Firebase is not configured. Please add your Firebase config to .env');
  return db;
};

export const loginWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(requireAuth(), email, password);
  return result.user;
};

export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  const result = await createUserWithEmailAndPassword(requireAuth(), email, password);
  await updateProfile(result.user, { displayName });
  await createUserProfile(result.user, displayName);
  return result.user;
};

export const loginWithGoogle = async () => {
  const a = requireAuth();
  const d = requireDb();
  const result = await signInWithPopup(a, googleProvider);
  const userDoc = await getDoc(doc(d, 'users', result.user.uid));
  if (!userDoc.exists()) {
    await createUserProfile(result.user, result.user.displayName || 'User');
  }
  return result.user;
};

export const logout = async () => {
  await signOut(requireAuth());
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(requireAuth(), email);
};

export const createUserProfile = async (user: User, displayName: string) => {
  const d = requireDb();
  const userProfile: Omit<UserProfile, 'createdAt'> & { createdAt: any } = {
    uid: user.uid,
    email: user.email || '',
    displayName: displayName,
    photoURL: user.photoURL || '',
    createdAt: serverTimestamp(),
    purchasedProducts: [],
    courseProgress: {},
    savedArticles: [],
    subscription: {
      plan: 'free',
      validUntil: null,
    },
  };
  await setDoc(doc(d, 'users', user.uid), userProfile);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const d = requireDb();
  const userDoc = await getDoc(doc(d, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (
  user: User,
  data: { displayName?: string; photoURL?: string }
) => {
  const a = requireAuth();
  const d = requireDb();
  // Update Firebase Auth profile
  await updateProfile(user, data);
  // Update Firestore document
  await updateDoc(doc(d, 'users', user.uid), data);
  // Force auth state refresh so context picks up new data
  await a.currentUser?.reload();
};

export const changePassword = async (
  user: User,
  currentPassword: string,
  newPassword: string
) => {
  // Re-authenticate before changing password
  const credential = EmailAuthProvider.credential(user.email!, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};

export const deleteAccount = async (user: User) => {
  const d = requireDb();
  // Delete Firestore profile first
  await deleteDoc(doc(d, 'users', user.uid));
  // Then delete the Firebase Auth account
  await deleteUser(user);
};
