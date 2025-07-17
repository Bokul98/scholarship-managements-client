import { auth } from '../firebase/firebase.config';

export const getFirebaseToken = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(true);
    return token;
  }
  return null;
}; 