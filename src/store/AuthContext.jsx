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
import { getRecruitmentsByUserId, deleteRecruitment,  getUserApplications, deleteApplicant, fetchAllEmails, addEmail, deleteEmail, getMeetingsByUserId, deleteMeeting } from '../services/RecruitmentServices'; // Funkcje do pobierania i usuwania rekrutacji


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

// Google Sign-In function
const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(firebaseAuth, provider);
    const user = result.user;
    setCurrentUser(user); // Set the signed-in user
    console.log('Google sign-in successful');

    // Save email and sign-in method (Google) to Firestore
    await addEmail(user.email, 'google');

    console.log('User saved to Firestore');
  } catch (error) {
    let userFriendlyMessage = 'An error occurred during Google sign-in.';
    if (error.code === 'auth/cancelled-popup-request') {
      userFriendlyMessage = 'The sign-in popup was closed before completing the sign-in process.';
    } else if (error.code === 'auth/popup-blocked') {
      userFriendlyMessage = 'The sign-in popup was blocked by your browser.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      userFriendlyMessage = 'The sign-in popup was closed before signing in.';
    } else if (error.code === 'auth/network-request-failed') {
      userFriendlyMessage = 'A network error occurred. Please check your internet connection and try again.';
    }

    console.error('Error during Google sign-in:', error.message);
    throw new Error(userFriendlyMessage); // Propagate a user-friendly error
  }
};

// Email/Password Sign-In function
const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    setCurrentUser(userCredential.user);
    console.log('Email/password sign-in successful');

    console.log('User saved to Firestore');
  } catch (error) {
    let userFriendlyMessage = 'An error occurred during sign-in.';
    if (
      error.code === 'auth/user-not-found' || 
      error.code === 'auth/wrong-password' || 
      error.code === 'auth/invalid-credential'
    ) {
      userFriendlyMessage = 'The email or password you entered is incorrect.';
    } else if (error.code === 'auth/invalid-email') {
      userFriendlyMessage = 'The email address format is invalid. Please check and try again.';
    } else if (error.code === 'auth/network-request-failed') {
      userFriendlyMessage = 'A network error occurred. Please check your internet connection and try again.';
    }

    console.error('Error during sign-in:', error.message);
    throw new Error(userFriendlyMessage); // Propagate a user-friendly error
  }
};

// Email/Password SignUp function
const signUp = async (email, password, username) => {
  try {
    console.log('Attempting to create user with email:', email);

    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    console.log('User created successfully:', userCredential);

    const user = userCredential.user;

    // Update user profile
    console.log('Updating user profile with username:', username);
    await updateProfile(user, {
      displayName: username,
    });

   // Save email and sign-in method (email/password) to Firestore
   await addEmail(email, 'email/password');
   
    // Send email verification
    console.log('Sending email verification');
    await sendEmailVerification(user);

    console.log('Email verification sent successfully');
    setCurrentUser(user); // Set the user in the app context state
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.error('The email address is already in use by another account.');
      throw new Error('The email address is already in use by another account.');
    } else if (error.code === 'auth/weak-password') {
      console.error('The password is too weak.');
      throw new Error('The password is too weak.');
    } else if (error.code === 'auth/invalid-email') {
      console.error('The email address is not valid.');
      throw new Error('The email address is not valid.');
    } else if (error.message.includes('Password must contain at least 8 characters')) {
      console.error('The password must be at least 8 characters long.');
      throw new Error('The password must be at least 8 characters long.');
    } else if (error.message.includes('Password must contain a lower case character')) {
      console.error('The password must contain at least one lowercase letter.');
      throw new Error('The password must contain at least one lowercase letter.');
    } else if (error.message.includes('Password must contain an upper case character')) {
      console.error('The password must contain at least one uppercase letter.');
      throw new Error('The password must contain at least one uppercase letter.');
    } else if (error.message.includes('Password must contain a non-alphanumeric character')) {
      console.error('The password must contain at least one non-alphanumeric character.');
      throw new Error('The password must contain at least one non-alphanumeric character.');
    } else {
      console.error('Error during sign up:', error.message);
      throw error; // Propagate the error
    }
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

  
  const forgotPassword = async (email) => {
    setIsLoading(true);
  
    // Check if the email format is valid
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setIsLoading(false);
      throw new Error('Invalid email format. Please enter a valid email address.');
    }
  
    try {
            // Fetch all emails from Firestore
          const emails = await fetchAllEmails();
          console.log(emails);
          
              // Find the email data based on the provided email
              const emailData = emails.find((emailData) => emailData.email.trim().toLowerCase() === email.trim().toLowerCase());

              // Check if the email is found in the Firestore data
              if (!emailData) {
                console.error('No account associated with this email address.');
                throw new Error('No account associated with this email address.');
              }

              // Get the signInMethod associated with the email
              const signInMethod = emailData.signInMethod;
              console.log('Sign-in Method:', signInMethod);

          if (signInMethod  === 'google') {
            console.log('This account was created using Google. Please reset your password through Google.');
            throw new Error('This account was created using Google. Please reset your password through Google.')
          } else  if (signInMethod  === 'email/password') {
            // If the email is associated with email/password sign-in, send reset email
            await sendPasswordResetEmail(firebaseAuth, email);
            console.log('Password reset email sent.');
          } else {
            console.error('Unknown sign-in method for that email address.');
            throw new Error('Unknown sign-in method.');
          }
          setIsLoading(false);
    } catch (error) {
      console.error('Error during password reset:', error.message);
      throw new Error(error.message); // Propagate the error with the message
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const deleteAccount = async (password) => {
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
          console.log("Reauthentication successful for Google account");
        } else {
           // Create credential for reauthentication
          const credential = EmailAuthProvider.credential(currentUser.email, password);
          // Reauthenticate the user with the old password
          await reauthenticateWithCredential(currentUser, credential);
          console.log("Reauthentication successful for email/password account");
        }

        setIsLoading(true);
        // 1. Fetch all recruitments associated with the user
        let recruitments = [];
        try {
          recruitments = await getRecruitmentsByUserId(currentUser.uid);
        } catch (error) {
          console.error("0 recruitments: ", error);
          recruitments = []; // Set recruitments to an empty array on error
        }
  
        // 2. Remove the current user from all recruitments
        if (recruitments && recruitments.length > 0) {
          for (const recruitment of recruitments) {
            try {
              await deleteRecruitment(recruitment.id); // Delete the recruitment
            } catch (err) {
              console.error(`Error deleting recruitment ${recruitment.name}:`, err);
            }
          }
        }
        
        // 3. Fetch all meetings associated with the user
        let meetings = [];
        try {
          meetings = await getMeetingsByUserId(currentUser.uid);
        } catch (error) {
          console.error("Error fetching meetings:", error);
          meetings = [];
        }

        // 4. Delete each meeting
        if (meetings.length > 0) {
          for (const meeting of meetings) {
            try {
              await deleteMeeting(meeting.recruitmentId, meeting.meetingSessionId, meeting.meetingId);
             
            } catch (err) {
              console.error(`Error deleting meeting ${meeting.meetingId}:`, err);
            }
          }
        }
  
        // 5. Fetch all applications associated with the user
        let applications = [];
        try {
          applications = await getUserApplications();
        } catch (error) {
          console.error("0 applications: ", error);
          applications = []; // Set applications to an empty array on error
        }
  
        // 6. Delete each application
        if (applications && applications.length > 0) {
          for (const application of applications) {
            try {
              await deleteApplicant(application.id, application.applicantData.id); // Delete individual application
            } catch (err) {
              console.error(`Error deleting application ${application.recruitmentData.name}:`, err);
            }
          }
        }




  
        // 7. Delete the user account after all recruitments and applications are handled
        await deleteUser(currentUser);
        await deleteEmail(currentUser.email);
        setCurrentUser(null); // Clear the current user after deletion
        console.log("Account deleted successfully.");
      } else {
        throw new Error("No user is logged in.");
      }

    }  catch (error) {
      console.error("Error during account deletion:", error);
      if (
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/missing-password' || 
        error.code === 'auth/invalid-credential'
      ) {
        // Provide a specific error message
        throw new Error("Incorrect credentials. Please try again.");
      } else {
        // Provide a general error message
        throw new Error("There was an error during account deletion. Please try again.");
      }
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
      // Create credential for reauthentication
      const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);

      // Reauthenticate the user with the old password
      await reauthenticateWithCredential(currentUser, credential);

      // Update the password
      await firebaseUpdatePassword(currentUser, newPassword);
      console.log('Password updated successfully.');
    } else {
      throw new Error('No user is logged in.');
    }
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error('No user is logged in.');
      throw new Error('No user is logged in.');
    } else if (error.code === 'auth/wrong-password') {
      console.error('The old password is incorrect.');
      throw new Error('The old password is incorrect.');
    } else if (error.code === 'auth/weak-password') {
      console.error('The new password is too weak.');
      throw new Error('The new password is too weak.');
    } else if (error.message.includes('Password must contain at least 8 characters')) {
      console.error('The new password must be at least 8 characters long.');
      throw new Error('The new password must be at least 8 characters long.');
    } else if (error.message.includes('Password must contain a lower case character')) {
      console.error('The new password must contain at least one lowercase letter.');
      throw new Error('The new password must contain at least one lowercase letter.');
    } else if (error.message.includes('Password must contain an upper case character')) {
      console.error('The new password must contain at least one uppercase letter.');
      throw new Error('The new password must contain at least one uppercase letter.');
    } else if (error.message.includes('Password must contain a non-alphanumeric character')) {
      console.error('The new password must contain at least one non-alphanumeric character.');
      throw new Error('The new password must contain at least one non-alphanumeric character.');
    } else if( error.code === 'auth/invalid-credential'){
      console.error('The password is incorrect.');
      throw new Error('The password is incorrect.');
    }
    else {
      console.error('Password update error:', error.message);
      throw error; // Propagate the error for further handling
    }
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
