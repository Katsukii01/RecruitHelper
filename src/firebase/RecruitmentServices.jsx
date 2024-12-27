import { db, storage } from '../firebase/baseconfig';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
} from 'firebase/firestore';
import { firebaseAuth } from '../firebase/baseconfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Check if the user is authenticated
const checkAuth = async () => {
  return new Promise((resolve, reject) => {
    const user = firebaseAuth.currentUser;
    if (user) {
      resolve(user); // If user is already authenticated
    } else {
      // If user is not authenticated, check via onAuthStateChanged
      const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user); // If the user is authenticated, resolve
        } else {
          reject(new Error('User is not authenticated!')); // Reject if no user
        }
        unsubscribe(); // Unsubscribe from the listener after it's triggered
      });
    }
  });
};



// Reference to the recruitment collection
const recruitmentCollection = collection(db, 'recruitments');

// **1. Add a new recruitment**
export const addRecruitment = async (recruitmentData) => {
    try {
      checkAuth(); // Verify authentication
      const userId = firebaseAuth.currentUser.uid;  // Get current user's ID
      const docRef = await addDoc(recruitmentCollection, { ...recruitmentData, userId }); // Add userId to the recruitment document
      console.log('Recruitment added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding recruitment:', error.message);
      throw error;
    }
  };
  

// **2. Get all recruitments (with filtering)**
export const getRecruitments = async (searchTerm = '') => {
  try {
    checkAuth(); // Ensure the user is authenticated
    const userId = firebaseAuth.currentUser.uid; // Get the current user's ID
    console.log('Current User ID:', userId); // Log userId

    const q = query(recruitmentCollection); // Fetch all documents from the collection
    const snapshot = await getDocs(q);

    console.log('Snapshot:', snapshot.docs);

    // Map and filter recruitments
    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (recruitment) =>
          recruitment.userId === userId && // Filter by userId
          Object.values(recruitment)
            .join(' ')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) // Filter by search term
      );
  } catch (error) {
    console.error('Error fetching recruitments:', error.message);
    throw error;
  }
};
  
  
  // **3. Delete a recruitment**
  export const deleteRecruitment = async (recruitmentId) => {
    try {
      checkAuth();
      const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
      const recruitmentSnapshot = await getDoc(recruitmentDoc);
  
      // Ensure the current user is the owner of the recruitment
      const recruitmentData = recruitmentSnapshot.data();
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error('You are not authorized to delete this recruitment');
      }
  
      await deleteDoc(recruitmentDoc);
      console.log('Recruitment deleted:', recruitmentId);
    } catch (error) {
      console.error('Error deleting recruitment:', error.message);
      throw error;
    }
  };
  
  // **4. Update a recruitment**
  export const updateRecruitment = async (recruitmentId, updatedData) => {
    try {
      checkAuth();
      const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
      const recruitmentSnapshot = await getDoc(recruitmentDoc);
  
      // Ensure the current user is the owner of the recruitment
      const recruitmentData = recruitmentSnapshot.data();
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error('You are not authorized to update this recruitment');
      }
  
      await updateDoc(recruitmentDoc, updatedData);
      console.log('Recruitment updated:', recruitmentId);
    } catch (error) {
      console.error('Error updating recruitment:', error.message);
      throw error;
    }
  };
  
  // **5. Add an applicant to a recruitment**
  export const addApplicant = async (recruitmentId, applicantData) => {
    try {
      checkAuth();
      const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
      const recruitmentSnapshot = await getDoc(recruitmentDoc);
  
      // Ensure the current user is the owner of the recruitment
      const recruitmentData = recruitmentSnapshot.data();
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error('You are not authorized to add applicants to this recruitment');
      }
  
      const currentApplicants = recruitmentData.Applicants || [];
      const updatedApplicants = [...currentApplicants, applicantData];
  
      // Update the recruitment document
      await updateDoc(recruitmentDoc, { Applicants: updatedApplicants });
      console.log('Applicant added successfully:', recruitmentId);
    } catch (error) {
      console.error('Error adding applicant:', error.message);
      throw error;
    }
  };
  

// **6. Upload a CV file to Firebase Storage**
export const uploadCVFile = async (file, applicantName) => {
  try {
    checkAuth();
    const filePath = `cvs/${applicantName}_${file.name}`;
    const storageRef = ref(storage, filePath);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('File uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading CV file:', error.message);
    throw error;
  }
  
};

// **7. Get a single recruitment by ID**
export const getRecruitmentById = async (recruitmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, 'recruitments', recruitmentId); // Reference to the specific recruitment document
    const recruitmentSnapshot = await getDoc(recruitmentDoc); // Fetch the document
    
    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
    }

    const recruitmentData = recruitmentSnapshot.data();

    // Ensure the current user is the owner of the recruitment
    if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
      throw new Error('You are not authorized to view this recruitment');
    }

    return {
      id: recruitmentSnapshot.id,
      ...recruitmentData,
    };
  } catch (error) {
    console.error('Error fetching recruitment by ID:', error.message);
    throw error;
  }
};

