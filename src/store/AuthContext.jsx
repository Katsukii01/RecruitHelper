import React, { createContext, useState, useEffect } from 'react';
import { firebaseAuth } from '../firebase/baseconfig'; // Firebase config
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  deleteUser,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider, 
  signInWithPopup,
   reauthenticateWithPopup,
   updatePassword as firebaseUpdatePassword,
} from 'firebase/auth';
import { getRecruitmentsByUserId, deleteRecruitment } from '../firebase/RecruitmentServices'; // Funkcje do pobierania i usuwania rekrutacji

// Create AuthContext
export const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
  forgotPassword: () => {},
  deleteAccount: () => {},
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
const signUp = async (email, password, username) => {
  try {
    // Tworzenie użytkownika za pomocą e-mail i hasła
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;

    // Aktualizacja profilu użytkownika z podanym username
    await updateProfile(user, {
      displayName: username,
    });

    // Wysyłanie e-maila weryfikacyjnego
    await sendEmailVerification(user); // Sprawdź czy user jest prawidłowy

    console.log('E-mail weryfikacyjny został wysłany');
    setCurrentUser(user); // Ustawienie użytkownika w stanie kontekstu aplikacji
  } catch (error) {
    console.error('Błąd podczas rejestracji:', error.message);
    throw error; // Propagacja błędu
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

  const deleteAccount = async () => {
    setIsLoading(true);
    try {
      if (currentUser) {
        // Check if the user logged in with Google
        const isGoogleAccount = currentUser.providerData?.some(
          (provider) => provider.providerId === "google.com"
        );
  
        if (isGoogleAccount) {
          // Reauthenticate the user using a Google sign-in popup
          const provider = new GoogleAuthProvider();
          await reauthenticateWithPopup(currentUser, provider);
          console.log("Reauthentication successful");
        }
  
        // 1. Pobranie wszystkich rekrutacji użytkownika
        const recruitments = await getRecruitmentsByUserId(currentUser.uid);
        
        // 2. Usunięcie każdej rekrutacji
        for (const recruitment of recruitments) {
          try {
            await deleteRecruitment(recruitment.id); // Usunięcie pojedynczej rekrutacji
            console.log(`Recruitment ${recruitment.name} deleted successfully.`);
          } catch (err) {
            console.error(`Error deleting recruitment ${recruitment.name}:`, err);
          }
        }
  
        // 3. Usunięcie konta użytkownika po usunięciu rekrutacji
        await deleteUser(currentUser);
        setCurrentUser(null); // Clear the current user after deletion
        console.log("Account deleted successfully.");
      } else {
        throw new Error("No user is logged in.");
      }
    } catch (error) {
      console.error("Error during account deletion:", error);
      alert("Wystąpił błąd podczas usuwania konta."); // Inform the user of the error
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

// Update Password function
  const updatePassword = async (oldPassword, newPassword) => {
    try {
      if (currentUser) {
        const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await firebaseUpdatePassword(currentUser, newPassword);
        console.log('Password updated successfully.');
      } else {
        throw new Error('No user is logged in.');
      }
    } catch (error) {
      console.error('Password update error:', error.message);
      throw error;
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
    updateName: updateDisplayName, // Add the updateName function
    updatePassword, // Add the updatePassword function
    googleSignIn,
  };

  return <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
