import { createContext, useContext, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const FirebaseContext = createContext(null);


const firebaseConfig = {
  apiKey: "AIzaSyCcb07YFeFoLUXT0JE6cV4AWiYU-8LFQAg",
  authDomain: "freetime-suggestion.firebaseapp.com",
  databaseURL: "https://freetime-suggestion-default-rtdb.firebaseio.com",
  projectId: "freetime-suggestion",
  storageBucket: "freetime-suggestion.firebasestorage.app",
  messagingSenderId: "1095460771717",
  appId: "1:1095460771717:web:5202438d52c5d95e61d6ec",
  measurementId: "G-XLM29F7DDL",
  databaseURL: "https://freetime-suggestion-default-rtdb.firebaseio.com",
};

const provider = new GoogleAuthProvider();

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const signUpWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = async (user, data) => {
    return updateProfile(user, data);
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    signUpWithEmailAndPassword,
    loginWithEmailAndPassword,
    updateUserProfile,
    signInWithGoogle
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};