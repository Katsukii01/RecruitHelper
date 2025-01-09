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
  where
} from 'firebase/firestore';
import { firebaseAuth } from '../firebase/baseconfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

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

// Funkcja do konwersji base64 na obiekt File
const base64ToFile = (base64, fileName) => {
  const [metadata, data] = base64.split(',');
  const mimeType = metadata.match(/:(.*?);/)[1]; // Wyciągnięcie typu MIME
  const binary = atob(data); // Dekodowanie Base64
  const array = Uint8Array.from(binary, char => char.charCodeAt(0)); // Bezpośrednia konwersja
  return new File([array], fileName, { type: mimeType });
};


// Funkcja do przesyłania pliku do Firebase Storage
const uploadToStorage = async (file, filePath) => {
  const storageRef = ref(storage, filePath);
  const uploadSnapshot = await uploadBytes(storageRef, file);
  const fileUrl = await getDownloadURL(uploadSnapshot.ref);
  return fileUrl;
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
  
// **3. Delete a recruitment (with all applicants, their CV files, and optional Covering Letters)**
export const deleteRecruitment = async (recruitmentId) => {
  try {
    await checkAuth();
    const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    // Ensure the current user is the owner of the recruitment
    const recruitmentData = recruitmentSnapshot.data();
    if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
      throw new Error('You are not authorized to delete this recruitment');
    }

    // Delete all applicants' CV files and optional Covering Letter files
    const applicants = recruitmentData.Applicants || [];
    for (const applicant of applicants) {
      // Call deleteOldFiles for CVs
      if (applicant.cvFileUrls && applicant.cvFileUrls.length > 0) {
        await deleteOldFiles({ cvFileUrls: applicant.cvFileUrls }, recruitmentId, 'Cv');
      }

      // Call deleteOldFiles for Cover Letters
      if (applicant.coverLetterFileUrls && applicant.coverLetterFileUrls.length > 0) {
        await deleteOldFiles({ coverLetterFileUrls: applicant.coverLetterFileUrls }, recruitmentId, 'CoverLetter');
      }
    }

    // Finally, delete the recruitment document itself
    await deleteDoc(recruitmentDoc);
    console.log(`Recruitment with ID: ${recruitmentId} has been successfully deleted.`);
  } catch (error) {
    console.error('Error deleting recruitment:', error.message);
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
  
// 5. Add or update an applicant with CV and optional Cover Letter
export const addApplicant = async (recruitmentId, applicantData, cvFiles, coverLetterFiles) => {
  try {
    await checkAuth(); // Ensure the user is logged in

    const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    // Ensure the user is the owner of the recruitment
    const recruitmentData = recruitmentSnapshot.data();
    if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
      throw new Error('You are not authorized to add applicants to this recruitment');
    }

    // Update the applicants list: check if the applicant with the same ID already exists
    const currentApplicants = recruitmentData.Applicants || [];
    const applicantIndex = currentApplicants.findIndex(applicant => applicant.id === applicantData.id);

    // Convert cvFiles to an array if it's not already
    const cvFilesArray = Array.isArray(cvFiles) ? cvFiles : Array.from(cvFiles);


    // If cvFiles are URLs, skip the upload process entirely
    let cvFileUrls = [];
    if (cvFilesArray.every(file => typeof file === "string" && file.startsWith("https://"))) {
      // If all cvFiles are already URLs, just use them directly
      cvFileUrls = cvFilesArray;
    } else {
      if (applicantIndex !== -1) {
        // Remove old CV and Cover Letter files from storage (optional, if needed)
        console.log("deleteCV");
        await deleteOldFiles(currentApplicants[applicantIndex], recruitmentId, 'Cv');
        }
      // Otherwise, proceed with the conversion and uploading of CV files
      for (const [index, cvFileBase64] of cvFilesArray.entries()) {
        const cvFile = base64ToFile(cvFileBase64, `${applicantData.id}_cv_${index + 1}.png`);
        const cvFilePath = `cv/${recruitmentId}/${applicantData.id}_${index + 1}.png`;
        const uploadedCvFileUrl = await uploadToStorage(cvFile, cvFilePath);
        cvFileUrls.push(uploadedCvFileUrl);
      }
    }

    

  
    // Prepare to upload Cover Letter files (if they exist)
    let coverLetterFileUrls = [];  
    if (coverLetterFiles && coverLetterFiles.length > 0) {
      // Check if coverLetterFiles are already URLs (https links)
      if (coverLetterFiles.every(file => typeof file === "string" && file.startsWith("https://"))) {
        // If all coverLetterFiles are already URLs, just use them directly
        coverLetterFileUrls = coverLetterFiles;
      } else {
        if (applicantIndex !== -1) {
          // Remove old CV and Cover Letter files from storage (optional, if needed)
          console.log("deleteCl");
          await deleteOldFiles(currentApplicants[applicantIndex], recruitmentId, 'CoverLetter');
          }
        // Otherwise, proceed with the conversion and uploading of Cover Letter files
        for (const [index, coverLetterFileBase64] of coverLetterFiles.entries()) {
          const coverLetterFile = base64ToFile(coverLetterFileBase64, `${applicantData.id}_coverLetter_${index + 1}.png`);
          const coverLetterFilePath = `coveringletters/${recruitmentId}/${applicantData.id}_${index + 1}.png`;
          const uploadedCoverLetterFileUrl = await uploadToStorage(coverLetterFile, coverLetterFilePath);
          coverLetterFileUrls.push(uploadedCoverLetterFileUrl);
        }
      }
    }else{
        if (applicantIndex !== -1) {
          const coverLetterUrls = currentApplicants[applicantIndex]?.coverLetterFileUrls;
          if (coverLetterUrls && coverLetterUrls.length > 0) {
              await deleteOldFiles(currentApplicants[applicantIndex], recruitmentId, 'CoverLetter');
          }
      }
    }

    if (applicantIndex !== -1) {
      // Applicant exists, update their information and replace their files
      const updatedApplicants = currentApplicants.map((applicant, index) => {
        if (index === applicantIndex) {
          return {
            ...applicant,
            ...applicantData,
            cvFileUrls,
            coverLetterFileUrls,
          };
        }
        return applicant;
      });
      await updateDoc(recruitmentDoc, { Applicants: updatedApplicants });
      console.log('Applicant updated successfully:', recruitmentId);
    } else {
      // New applicant, add to the list
      const updatedApplicants = [
        ...currentApplicants,
        { 
          ...applicantData, 
          cvFileUrls, 
          coverLetterFileUrls 
        },
      ];

      await updateDoc(recruitmentDoc, { Applicants: updatedApplicants });
      console.log('Applicant added successfully:', recruitmentId);
    }

  } catch (error) {
    console.error('Error adding or updating applicant:', error.message);
    throw error;
  }
};

// Function to delete old CV and cover letter files from Firebase Storage
const deleteOldFiles = async (oldApplicantData, recruitmentId, type) => {
  try {
    if (type === 'Cv') {  // Poprawione na '===' do porównania
      // Delete old CV files from storage
      for (const cvFileUrl of oldApplicantData.cvFileUrls) {
        const cvFilePath = cvFileUrl.split('?')[0]; // Get the file path from the URL
        const cvRef = ref(storage, cvFilePath);
        await deleteObject(cvRef);
        console.log(`Deleted old CV file: ${cvFilePath}`);
      }
    } else if (type === 'CoverLetter') {  // Poprawione na '===' do porównania
      // Delete old Cover Letter files from storage
      for (const coverLetterFileUrl of oldApplicantData.coverLetterFileUrls) {
        const coverLetterFilePath = coverLetterFileUrl.split('?')[0]; // Get the file path from the URL
        const coverLetterRef = ref(storage, coverLetterFilePath);
        await deleteObject(coverLetterRef);
        console.log(`Deleted old Cover Letter file: ${coverLetterFilePath}`);
      }
    }
  } catch (error) {
    console.error('Error deleting old files:', error.message);
  }
};


// 6. Delete an applicant from a recruitment (with CV and optional Cover Letter)
export const deleteApplicant = async (recruitmentId, applicantId) => {
  try {
    await checkAuth(); // Ensure the user is logged in

    const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    // Ensure the user is the owner of the recruitment
    const recruitmentData = recruitmentSnapshot.data();
    if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
      throw new Error('You are not authorized to delete applicants from this recruitment');
    }

    // Find the applicant to delete
    const currentApplicants = recruitmentData.Applicants || [];
    const applicantToDelete = currentApplicants.find(applicant => applicant.id === applicantId);

    if (!applicantToDelete) {
      throw new Error('Applicant not found');
    }

    // Delete CV and Cover Letter files from Firebase Storage
    for (const cvFileUrl of applicantToDelete.cvFileUrls) {
      const cvFilePath = cvFileUrl.split('?')[0]; // Get the file path from the URL
      const cvRef = ref(storage, cvFilePath);
      await deleteObject(cvRef);
      console.log(`Deleted CV file: ${cvFilePath}`);
    }

    if (applicantToDelete.coverLetterFileUrls) {
      for (const coverLetterFileUrl of applicantToDelete.coverLetterFileUrls) {
        const coverLetterFilePath = coverLetterFileUrl.split('?')[0]; // Get the file path from the URL
        const coverLetterRef = ref(storage, coverLetterFilePath);
        await deleteObject(coverLetterRef);
        console.log(`Deleted Cover Letter file: ${coverLetterFilePath}`);
      }
    }

    // Remove the applicant from the list and update Firestore
    const updatedApplicants = currentApplicants.filter(applicant => applicant.id !== applicantId);
    await updateDoc(recruitmentDoc, { Applicants: updatedApplicants });

    console.log('Applicant deleted successfully:', applicantId);
  } catch (error) {
    console.error('Error deleting applicant:', error.message);
    throw error;
  }
};


// 7. Get all applicants from a recruitment (with CV and optional Cover Letter previews) and with pagination
export const getApplicants = async (recruitmentId, page, limit) => {
  try {
    const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
    }

    const recruitmentData = recruitmentSnapshot.data();
    const applicants = recruitmentData.Applicants || [];

    // Get total applicants count
    const totalApplicants = applicants.length;

    // Get highest id from applicants
    const highestId = applicants.reduce((maxId, applicant) => {
      return applicant.id > maxId ? applicant.id : maxId;
    }, 0); // Starting with 0 as initial value for maxId

    // Sort applicants by id (ascending order)
    const sortedApplicants = applicants.sort((a, b) => a.id - b.id);

    // Paginate applicants: get the applicants for the current page
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApplicants = sortedApplicants.slice(startIndex, endIndex);

    // Create an array with applicants and their file previews
    const applicantsWithPreviews = await Promise.all(
      paginatedApplicants.map(async (applicant) => {
        const cvPreviewPromises = applicant.cvFileUrls.map(async (cvFileUrl) => {
          // Generate preview URLs for CV files
          const previewUrl = await getFilePreview(cvFileUrl);
          return previewUrl;
        });

        const coverLetterPreviewPromises = applicant.coverLetterFileUrls
          ? applicant.coverLetterFileUrls.map(async (coverLetterFileUrl) => {
              // Generate preview URLs for Cover Letter files
              const previewUrl = await getFilePreview(coverLetterFileUrl);
              return previewUrl;
            })
          : [];

        const cvPreviews = await Promise.all(cvPreviewPromises);
        const coverLetterPreviews = await Promise.all(coverLetterPreviewPromises);

        return {
          ...applicant,
          cvPreviews,
          coverLetterPreviews,
        };
      })
    );

    // Return both applicants, total count for pagination, and the highest applicant id
    return { applicants: applicantsWithPreviews, totalApplicants, highestId };
  } catch (error) {
    console.error('Error getting applicants:', error.message);
    throw error;
  }
};



// Helper function to get file preview (this can be adjusted to suit how you want to generate previews)
const getFilePreview = async (fileUrl) => {
  try {
    const fileRef = ref(storage, fileUrl);
    const fileSnapshot = await getDownloadURL(fileRef);
    return fileSnapshot; // Return the download URL or a preview URL
  } catch (error) {
    console.error('Error getting file preview:', error.message);
    throw error;
  }
};


// **8. Get a single recruitment by ID**
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

// **9. Get all recruitments by User ID**
export const getRecruitmentsByUserId = async (userId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously

    const recruitmentsRef = collection(db, 'recruitments'); // Reference to the recruitments collection
    const q = query(recruitmentsRef, where('userId', '==', userId)); // Query to fetch recruitments by userId

    const querySnapshot = await getDocs(q); // Get the documents from the query

    if (querySnapshot.empty) {
      throw new Error('No recruitments found for this user');
    }

    // Map through the documents and return the recruitment data
    const recruitments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return recruitments; // Return the list of recruitments
  } catch (error) {
    console.error('Error fetching recruitments by user ID:', error.message);
    throw error; // Propagate the error for handling in the caller
  }
};