import app, { db, storage } from '../firebase/baseconfig';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  setDoc,
} from 'firebase/firestore';
import { firebaseAuth } from '../firebase/baseconfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

//fetch all emails with  signInMethod
export const fetchAllEmails = async () => {
  const emailsCollection = collection(db, 'emails');
  const q = query(emailsCollection);
  const snapshot = await getDocs(q);
  const emails = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return emails;
};

//add email to firestore
export const addEmail = async (email, signInMethod) => {
  try {
    console.log('Fetching all emails from Firestore...');
    const emails = await fetchAllEmails(); // Fetch all emails from Firestore
    console.log('Fetched emails:', emails);

    // Check if email already exists
    console.log(`Checking if email (${email}) already exists...`);
    const existingEmail = emails.find((emailData) => emailData.email === email);

    if (existingEmail) {
      console.log('Existing email found:', existingEmail);
    } else {
      console.log('No existing email found for:', email);
    }

    // If email exists and has a Google sign-in method, don't add it
    if (existingEmail && existingEmail.signInMethod === 'google') {
      console.log('This email is already associated with a Google account. No action taken.');
      return;
    }

    // If email exists and has an email/password sign-in method, update to Google
    if (existingEmail && existingEmail.signInMethod === 'email/password') {
      console.log('Updating sign-in method from email/password to Google for:', email);
      const docRef = doc(db, 'emails', email); // Reference to the email document
      await setDoc(docRef, { email, signInMethod: 'google' }); // Update to Google sign-in
      console.log('Sign-in method updated successfully.');
      return;
    }

    // If email doesn't exist, create a new document
    console.log('Creating a new email document for:', email);
    const docRef = doc(db, 'emails', email); // Correctly set a unique ID for the document
    await setDoc(docRef, { email, signInMethod });
    console.log('Email added to Firestore with sign-in method:', signInMethod);
  } catch (error) {
    console.error('Error in addEmail function:', error);
  }
};


//delete email from firestore
export const deleteEmail = async (email) => {
  // Get reference to the emails collection
  const emailsCollection = collection(db, 'emails');

  // Create a query to find the document based on the email field
  const q = query(emailsCollection, where('email', '==', email));

  // Fetch the documents that match the query
  const querySnapshot = await getDocs(q);

  // Check if the document exists
  if (!querySnapshot.empty) {
    // Get the first matching document (assuming email is unique)
    const docRef = doc(db, 'emails', querySnapshot.docs[0].id);
    
    // Delete the document
    await deleteDoc(docRef);
    console.log('Email document deleted.');
  } else {
    console.log('No document found with this email.');
  }
};

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

// **2.1 Get all public recruitments (with filtering and highest ID)**
export const getPublicRecruitments = async (searchTerm = '') => {
  try {
    // Ensure the user is authenticated
    const user = await checkAuth();
    
    if (!user?.uid) {
      throw new Error('User ID is undefined.');
    }

    const userId = user.uid;
    console.log('Current User ID:', userId);

    const recruitmentCollection = collection(db, 'recruitments');
    const q = query(recruitmentCollection);
    const snapshot = await getDocs(q);

    // Map and filter recruitments
    return snapshot.docs
      .map((doc) => {
        const recruitmentData = doc.data();
        const applicants = recruitmentData.Applicants || [];

        // Get highest ID from applicants
        const highestId = applicants.reduce((maxId, applicant) => {
          return applicant.id > maxId ? applicant.id : maxId;
        }, 0);

        // Check if the current user is already an applicant
        const isAlreadyApplicant = applicants.some((applicant) => applicant.userUid === userId);

        return {
          id: doc.id,
          highestId,
          isAlreadyApplicant, // Add a flag indicating if the user is already an applicant
          ...recruitmentData,
        };
      })
      .filter(
        (recruitment) =>
          recruitment.status === 'Public' &&
          recruitment.userId !== userId && // Ensure the recruitment is not owned by the current user
          !recruitment.isAlreadyApplicant && // Ensure the current user is not already an applicant
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

// **2.2 Get all user applications(with filtering )**
export const getUserApplications = async (searchTerm = '') => {
  try {
    // Ensure the user is authenticated
    const user = await checkAuth();

    if (!user?.uid) {
      throw new Error('User ID is undefined.');
    }

    const userId = user.uid;
    console.log('Current User ID:', userId);

    const recruitmentCollection = collection(db, 'recruitments');
    const q = query(recruitmentCollection);
    const snapshot = await getDocs(q);

    // Map and filter recruitments where the user is an applicant
    const userApplications = snapshot.docs
      .map((doc) => {
        const recruitmentData = doc.data();
        const applicants = recruitmentData.Applicants || [];

        // Find the applicant data for the current user
        const applicant = applicants.find((applicant) => applicant.userUid === userId);

        if (applicant) {
          // Exclude other applicants from recruitmentData
          const { Applicants, ...filteredRecruitmentData } = recruitmentData;

          return {
            id: doc.id,
            recruitmentData: filteredRecruitmentData, // Recruitment data without other applicants
            applicantData: applicant, // Include applicant's data
          };
        }
        return null; // If the user is not an applicant, return null
      })
      .filter((recruitment) => recruitment !== null) // Remove null values where the user is not an applicant
      .filter(
        (recruitment) =>
          Object.values(recruitment.recruitmentData)
            .join(' ')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) || // Filter by recruitment data
          Object.values(recruitment.applicantData)
            .join(' ')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) // Filter by applicant data
      );

    return userApplications;
  } catch (error) {
    console.error('Error fetching user applications:', error.message);
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
    if(applicantData.userUid){
      if(recruitmentData.status == "Private"){
        throw new Error('This recruitment is private, you cant apply');
      }
    }else{
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error('You are not authorized to add applicants to this recruitment');
      }
      if(recruitmentData.status == "Public"){
        throw new Error('You need to cahnge recruitment toprivate  to add applicants by yourself');
      }
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
    const recruitmentData = recruitmentSnapshot.data();

    // Find the applicant to delete
    const currentApplicants = recruitmentData.Applicants || [];
    const applicantToDelete = currentApplicants.find(applicant => applicant.id === applicantId);


    // Ensure the user is the owner of the recruitment
   
    if (recruitmentData.userId !== firebaseAuth.currentUser.uid ) {
      if (applicantToDelete.userUid!== firebaseAuth.currentUser.uid) {
      throw new Error('You are not authorized to delete applicants from this recruitment');
    }
  }



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
    const recruitmentStatus = recruitmentData.status;
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
    return { applicants: applicantsWithPreviews, totalApplicants, highestId, recruitmentStatus };
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
