import React, { createContext, useState, useEffect } from 'react';
import { firebaseAuth } from '../firebase/baseconfig'; // Firebase config
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateEmail,
  deleteUser,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Create AuthContext
export const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
  forgotPassword: () => {},
  deleteAccount: () => {},
  updateEmail: () => {},
  updateName: () => {},
  googleSignIn: () => {},
});

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  // Google SignIn function
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      setCurrentUser(user); // Set the signed-in user
    } catch (error) {
      console.error('Error during Google sign-in:', error.message);
      throw new Error(error.message); // Propagate the error
    }
  };

  // Email/Password SignIn function
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      setCurrentUser(userCredential.user);
    } catch (error) {
      console.error('Error during sign-in:', error.message);
      throw new Error(error.message); // Propagate the error
    }
  };

  // Email/Password SignUp function
  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      setCurrentUser(userCredential.user);
    } catch (error) {
      console.error('Error during sign-up:', error.message);
      throw new Error(error.message); // Propagate the error
    }
  };

  // Sign Out function
  const signOut = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(firebaseAuth);
      setCurrentUser(null); // Clear current user
    } catch (error) {
      console.error('Error during sign-out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password function
  const forgotPassword = async (email) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      console.log('Password reset email sent.');
    } catch (error) {
      console.error('Error during password reset:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Account function
  const deleteAccount = async () => {
    setIsLoading(true);
    try {
      if (currentUser) {
        await deleteUser(currentUser);
        setCurrentUser(null); // Clear current user after deletion
        console.log('Account deleted successfully.');
      } else {
        throw new Error('No user is logged in.');
      }
    } catch (error) {
      console.error('Error during account deletion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update Email function
  const updateEmailAddress = async (newEmail) => {
    setIsLoading(true);
    try {
      if (currentUser) {
        await updateEmail(currentUser, newEmail);
        console.log('Email updated successfully.');
      } else {
        throw new Error('No user is logged in.');
      }
    } catch (error) {
      console.error('Error during email update:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

// Update Display Name function
const updateDisplayName = async (newName) => {
    setIsLoading(true);
    try {
      if (currentUser) {
        // Update display name
        await updateProfile(currentUser, { displayName: newName });
  
        // Reload the user object to fetch the latest profile data
        await currentUser.reload();
  
        // Re-fetch the updated user object from Firebase
        const updatedUser = firebaseAuth.currentUser;
  
        // Set the updated user object to state
        setCurrentUser(updatedUser);
  
        console.log('Name updated successfully.');
      } else {
        throw new Error('No user is logged in.');
      }
    } catch (error) {
      console.error('Error during name update:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Monitor Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setCurrentUser(user);
      setIsLoading(false); // Stop loading once user is retrieved
    });

    return () => unsubscribe();
  }, []);

  // Context Values
  const authValues = {
    user: currentUser,
    loading: isLoading,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    deleteAccount,
    updateEmail: updateEmailAddress,
    updateName: updateDisplayName, // Add the updateName function
    googleSignIn,
  };

  return <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
