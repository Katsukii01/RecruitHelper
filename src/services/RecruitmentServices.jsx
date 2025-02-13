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
  count,
} from 'firebase/firestore';
import { firebaseAuth } from '../firebase/baseconfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import  sendEmail from './MailerServices';

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
    const emails = await fetchAllEmails(); // Fetch all emails from Firestore

    // Check if email already exists
    const existingEmail = emails.find((emailData) => emailData.email === email);

    if (existingEmail) {
      console.log('Existing email found:', existingEmail);
    } else {
      console.log('No existing email found for:', email);
    }

    // If email exists and has a Google sign-in method, don't add it
    if (existingEmail && existingEmail.signInMethod === 'google') {
    
      return;
    }

    // If email exists and has an email/password sign-in method, update to Google
    if (existingEmail && existingEmail.signInMethod === 'email/password') {
    
      const docRef = doc(db, 'emails', email); // Reference to the email document
      await setDoc(docRef, { email, signInMethod: 'google' }); // Update to Google sign-in

      return;
    }

    // If email doesn't exist, create a new document
    const docRef = doc(db, 'emails', email); // Correctly set a unique ID for the document
    await setDoc(docRef, { email, signInMethod });
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

    const q = query(recruitmentCollection); // Fetch all documents from the collection
    const snapshot = await getDocs(q);


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

// **2.2 Get all user applications (with filtering)**
export const getUserApplications = async (searchTerm = '') => {
  try {
    // Ensure the user is authenticated
    const user = await checkAuth();

    if (!user?.uid) {
      throw new Error('User ID is undefined.');
    }

    const userId = user.uid;

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
          // Exclude other applicants from recruitmentData, and only keep the status and stage
          const { Applicants, ...filteredRecruitmentData } = recruitmentData;
          const { status, stage, name, jobTittle } = filteredRecruitmentData;

          return {
            id: doc.id,
            recruitmentData: {
              status, // Only include the status and stage from recruitmentData
              stage,
              name,
              jobTittle,
               // Include the name from recruitmentData
            },
            applicantData: applicant, // Include applicant's data
          };
        }
        return null; // If the user is not an applicant, return null
      })
      .filter((recruitment) => recruitment !== null) // Remove null values where the user is not an applicant
      .filter(
        (recruitment) =>
          Object.values(recruitment.applicantData)
            .join(' ')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) || // Filter by applicant data
          [recruitment.recruitmentData.status, recruitment.recruitmentData.stage]
            .join(' ')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) // Filter by status and stage
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

    // Delete all CV and Cover Letter files for each applicant
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

    // Update the applicants list: check if the applicant with the same ID already exists
    const currentApplicants = recruitmentData.Applicants || [];
    const applicantIndex = currentApplicants.findIndex(applicant => applicant.id === applicantData.id);


    if(applicantData.userUid){
      if(recruitmentData.status == "Private"){
        throw new Error('This recruitment is private, you cant apply');
      }
    }else{
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error('You are not authorized to add applicants to this recruitment');
      }
      if (applicantIndex === -1) {
        if(recruitmentData.status == "Public"){
          throw new Error('You need to cahnge recruitment to private  to add applicants by yourself');
        }
      }
    }
    


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

    // Delete meetings
    const meetings = recruitmentData.MeetingSessions.map(session => session.meetings).flat();
    for (const meeting of meetings) {
      if (String(meeting.applicantId) === String(applicantId)) {
        await deleteMeeting(recruitmentId, meeting.meetingSessionId ,meeting.id);
      }
    }

    // Remove the applicant from the list and update Firestore
    const updatedApplicants = currentApplicants.filter(applicant => applicant.id !== applicantId);
    await updateDoc(recruitmentDoc, { Applicants: updatedApplicants });

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


// **10. get applicants ranking by score
export const getApplicantsRanking = async (recruitmentId) => {
  const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
  const recruitmentSnapshot = await getDoc(recruitmentDoc);

  if (!recruitmentSnapshot.exists()) {
    throw new Error('Recruitment not found');
  }

  const recruitmentData = recruitmentSnapshot.data();
  const applicants = recruitmentData.Applicants || [];

  const levelOrder = {
    "A1 (Beginner)": 1,
    "A2 (Elementary)": 2,
    "B1 (Intermediate)": 3,
    "B2 (Upper Intermediate)": 4,
    "C1 (Advanced)": 5,
    "C2 (Proficient)": 6,
    "Technician": 1,
    "Engineer": 2,
    "Master": 3,
    "Doctor": 4,
    "Specialist": 5,
    "Undergraduate": 1,
    "Postgraduate": 2,
    "Diploma": 1,
    "Certificate": 1
  };

  const calculateScore = (applicant) => {
    let totalScore = 0;

    // Courses
    const matchedCourses = applicant.courses.filter(course =>
      recruitmentData.courses.includes(course)
    ).length;

    const totalRecruitmentCourses = recruitmentData.courses?.length || 0;
    const weightOfCourses = recruitmentData.weightOfCourses || 0;

    const coursesScore = totalRecruitmentCourses > 0 
      ? (matchedCourses / totalRecruitmentCourses) * weightOfCourses 
      : 0;

    totalScore += coursesScore;

  

    // Skills
    const matchedSkills = applicant.skills.filter(skill =>
      recruitmentData.skills?.includes(skill)
    ).length;

    const totalRecruitmentSkills = recruitmentData.skills?.length || 0;
    const weightOfSkills = recruitmentData.weightOfSkills || 0;

    const skillsScore = totalRecruitmentSkills > 0 
      ? (matchedSkills / totalRecruitmentSkills) * weightOfSkills 
      : 0;
    totalScore += skillsScore;

  

// Languages
const matchedLanguagesScore = applicant.languages.reduce((totalLanguageScore, appLang) => {
  const reqLang = recruitmentData.languages.find(reqLang =>
    reqLang.language === appLang.language
  );

  if (reqLang) {
    const applicantLevel = levelOrder[appLang.level];
    const requiredLevel = levelOrder[reqLang.level];

    let languageScore = 0;
    if (applicantLevel >= requiredLevel) {
      languageScore = 1;  // Full score for matching or exceeding required level
    } else {
      languageScore = applicantLevel / requiredLevel;  // Proportional score for lower level
    }

    return totalLanguageScore + languageScore;
  }

  return totalLanguageScore; // No score if language is not matched
}, 0);

const totalRecruitmentLanguages = recruitmentData.languages?.length || 0;
const weightOfLanguages = recruitmentData.weightOfLanguages || 0;

const languagesScore = totalRecruitmentLanguages > 0 
  ? (matchedLanguagesScore / totalRecruitmentLanguages) * weightOfLanguages 
  : 0;


totalScore += languagesScore;



    // Experience
    const applicantExperience = parseFloat(applicant.experience || "0");
    const requiredExperience = parseFloat(recruitmentData.experienceNeeded || "0");
    const weightOfExperience = parseFloat(recruitmentData.weightOfExperience || "0");

    let experienceScore = 0;

    if (requiredExperience > 0) {
      if (applicantExperience >= requiredExperience) {
        experienceScore = weightOfExperience;
      } else if (applicantExperience > 0) {
        experienceScore = (applicantExperience / requiredExperience) * weightOfExperience;
      }
    }

    totalScore += experienceScore;

  // Education Field & Level
  const applicantEducationField = applicant.educationField;
  const requiredEducationField = recruitmentData.educationField;

  let educationScore = 0;

  // First, check if the education fields match
  if (applicantEducationField === requiredEducationField) {
    const applicantEducationLevel = applicant.educationLevel;
    const requiredEducationLevel = recruitmentData.educationLevel;

    const applicantEducationLevelValue = levelOrder[applicantEducationLevel] || 0; // Default to 0 if level is not found
    const requiredEducationLevelValue = levelOrder[requiredEducationLevel] || 0; // Default to 0 if level is not found

    if (applicantEducationLevelValue >= requiredEducationLevelValue) {
      educationScore = 1; // Full score if education level is sufficient or higher
    } else if (requiredEducationLevelValue > 0) {
      educationScore = applicantEducationLevelValue / requiredEducationLevelValue; // Proportional score if lower
    }

    educationScore *= recruitmentData.weightOfEducationLevel || 0; // Ensure weight is a valid number
  }

  totalScore += educationScore;

    // Return the individual scores for each category along with the final score
    return {
      ...applicant,
      CVscore: parseFloat(totalScore.toFixed(2)),
      stage: applicant.stage || 'To be checked',
      CVscores: {
        courses: parseFloat(((coursesScore * 100) / recruitmentData.weightOfCourses).toFixed(2)) || 0,
        skills: parseFloat(((skillsScore * 100) / recruitmentData.weightOfSkills).toFixed(2)) || 0,
        languages: parseFloat(((languagesScore * 100) / recruitmentData.weightOfLanguages).toFixed(2)) || 0,
        experience: parseFloat(((experienceScore * 100) / recruitmentData.weightOfExperience).toFixed(2)) || 0,
        education: parseFloat(((educationScore * 100) / recruitmentData.weightOfEducationLevel).toFixed(2)) || 0,
      }
    };
    
  };



  // Map applicants and calculate scores
  const applicantsWithScores = applicants.map(applicant => calculateScore(applicant));

  try {
    await updateDoc(recruitmentDoc, { Applicants: applicantsWithScores });
  } catch (error) {
    console.error('Error updating applicants:', error); // Logujemy pełny błąd
    throw error;
  }

  // Sort applicants by score in descending order
  const rankedApplicants = applicantsWithScores.sort((a, b) => b.CVscore - a.CVscore);

  return rankedApplicants;
};

// 11.**change applicant stage
export const changeApplicantStage = async (recruitmentId, applicantId, newStage) => {
  try {
    await checkAuth();
    const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
    }

    const recruitmentData = recruitmentSnapshot.data();

    if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
      throw new Error('You are not authorized to change applicant stage');
    }

    const updatedApplicants = recruitmentData.Applicants.map((applicant) => {
      if (applicant.id === applicantId) {
        return { ...applicant, stage: newStage };
      }
      return applicant;
    });

    await updateDoc(recruitmentDoc, { Applicants: updatedApplicants });

    return { message: 'Applicant stage updated successfully' };
  } catch (error) {
    console.error('Error changing applicant stage:', error.message);
    throw error;
  }
};


// 12.**add meetings**
export const addMeetings = async (recruitmentId, meetingsData) => {
  try {
    await checkAuth(); // Sprawdzenie uwierzytelnienia użytkownika
    const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
    }

    const recruitmentData = recruitmentSnapshot.data();
    const meetingSessions = recruitmentData.MeetingSessions || [];
    const applicants = recruitmentData.Applicants || [];

    // **Zapewnij, że meetingsData jest tablicą**
    const meetingsArray = Array.isArray(meetingsData) ? meetingsData : [meetingsData];

    // **Przetwarzanie wszystkich spotkań**
    for (const meetingData of meetingsArray) {
      // Zakładając, że meetingData zawiera tablicę meetings
      const meetings = meetingData.meetings || [];
     for (const singleMeeting of meetings) {


        
        // **Sprawdzenie, czy singleMeeting ma poprawną strukturę**
        if (!singleMeeting || typeof singleMeeting !== "object") {
          console.error("singleMeeting is undefined or not an object!", singleMeeting);
          return;
        }
        
        let IsSessionChanged = '';

        if(singleMeeting.previousSessionId){
          IsSessionChanged= singleMeeting.meetingSessionId !== singleMeeting.previousSessionId;
        }else{
        IsSessionChanged = false;
        }

            // **Sprawdzanie, czy sessionId jest dostępne w singleMeeting**
            const sessionId = Number(singleMeeting.meetingSessionId);


            const sessionIndex = meetingSessions.findIndex(
              session => Number(session.id) === sessionId
            );
            
            if (sessionIndex === -1) {
              console.warn(`Meeting session with ID ${sessionId} not found.`);
              return;
            }
            


            // **Dodaj spotkanie do sesji**
            const session = meetingSessions[sessionIndex];
            const currentMeetings = session.meetings || [];


        if(IsSessionChanged){
          const PreviousSessionId = Number(singleMeeting.previousSessionId);
  
          const PreviousSessionIndex = meetingSessions.findIndex(
            session => Number(session.id) === PreviousSessionId
          );

          const oldSession = meetingSessions[PreviousSessionIndex];
          const oldMeetings = oldSession.meetings || [];
          const indexToRemove = oldMeetings.findIndex(meeting => meeting.id === singleMeeting.id);

          const previousApplicant = oldMeetings[indexToRemove].applicantId;
          const previousApplicantIndex = applicants.findIndex(applicant => applicant.id === previousApplicant);

          if(previousApplicantIndex !== -1){
            sendEmail('REMOVE','MEETING',applicants[previousApplicantIndex], recruitmentData.name, oldSession.meetingSessionName, oldSession.meetingSessionDescription , singleMeeting);
            const meetingCount = await countApplicantMeetings(previousApplicant, recruitmentId);
            if (meetingCount <= 0) {
              applicants[previousApplicantIndex].stage = 'Checked';
            }           
          }

          if (indexToRemove !== -1) { 
              oldMeetings.splice(indexToRemove, 1);
          }

         
          meetingSessions[PreviousSessionIndex].meetings = oldMeetings;

          const maxId = currentMeetings.reduce((max, meeting) => Math.max(max, meeting.id || 0), 0);
          singleMeeting.id = maxId + 1;

          currentMeetings.push(singleMeeting);
        }else{
            if(!singleMeeting.id){
              const maxId = currentMeetings.reduce((max, meeting) => Math.max(max, meeting.id || 0), 0);
              singleMeeting.id = maxId + 1;
            }
            // **Aktualizacja lub dodanie spotkania**
            const existingMeetingIndex = currentMeetings.findIndex(meeting => 
              String(meeting.id) === String(singleMeeting.id)
            );

            if (existingMeetingIndex !== -1) {
              const previousApplicant = currentMeetings[existingMeetingIndex].applicantId;
              const previousApplicantIndex = applicants.findIndex(applicant => String(applicant.id) === String(previousApplicant));
              console.log("previousApplicantIndex",previousApplicantIndex);
              if(previousApplicantIndex !== -1){
                sendEmail('REMOVE','MEETING', applicants[previousApplicantIndex], recruitmentData.name, session.meetingSessionName,session.meetingSessionDescription , singleMeeting);
                const meetingCount = await countApplicantMeetings(previousApplicant, recruitmentId);
                if (meetingCount <= 0) {
                  applicants[previousApplicantIndex].stage = 'Checked';
                }           
              }

              currentMeetings[existingMeetingIndex] = { ...currentMeetings[existingMeetingIndex], ...singleMeeting };
            } else {
              currentMeetings.push(singleMeeting);
            }
          }

          const applicantId = Number(singleMeeting.applicantId); // Przekształć applicantId na liczbę

          // **Aktualizacja etapu aplikanta**
          const applicantIndex = applicants.findIndex(applicant => applicant.id === applicantId);
          if (applicantIndex !== -1) {
            applicants[applicantIndex].stage = 'Invited for interview';
            sendEmail('ADD','MEETING',applicants[applicantIndex], recruitmentData.name, session.meetingSessionName,session.meetingSessionDescription , singleMeeting);
          }

      }
    }

    // **Zapisz zmiany w Firestore**
    await updateDoc(recruitmentDoc, { MeetingSessions: meetingSessions, Applicants: applicants });
    console.log("Meetings and applicants updated successfully!");

  } catch (error) {
    console.error('Error adding or updating meeting:', error.message);
    throw error;
  }
};



// 13.**delete meeting by ID**
export const deleteMeeting = async (id, meetingSessionId, meetingId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, 'recruitments', id);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);
    
    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
      }

      const recruitmentData = recruitmentSnapshot.data();
      const applicants = recruitmentData.Applicants || [];
      const meetingSessionIndex = recruitmentData.MeetingSessions.findIndex(meetingSession => 
        String(meetingSession.id) === String(meetingSessionId) 
      );
      if (meetingSessionIndex === -1) {
        throw new Error('Meeting session not found');
      }

      const meetingIndex = recruitmentData.MeetingSessions[meetingSessionIndex].meetings.findIndex(meeting => 
        String(meeting.id) === String(meetingId) 
      );
      if (meetingIndex === -1) {
        throw new Error('Meeting not found');
      }

      const session = recruitmentData.MeetingSessions[meetingSessionIndex];
      const singleMeeting = session.meetings[meetingIndex];
      const applicantId = Number( recruitmentData.MeetingSessions[meetingSessionIndex].meetings[meetingIndex].applicantId); // Przekształć applicantId na liczbę

      // **Aktualizacja etapu aplikanta**
      const applicantIndex = applicants.findIndex(applicant => applicant.id === applicantId);
      if (applicantIndex !== -1) {
        sendEmail('REMOVE','MEETING',applicants[applicantIndex], recruitmentData.name, session.meetingSessionName,session.meetingSessionDescription , singleMeeting);
        const meetingCount = await countApplicantMeetings(applicantId, id);
        if (meetingCount <= 0) {
          applicants[applicantIndex].stage = 'Checked';
        }
      }

      recruitmentData.MeetingSessions[meetingSessionIndex].meetings.splice(meetingIndex, 1);
      await updateDoc(recruitmentDoc, { MeetingSessions: recruitmentData.MeetingSessions, Applicants: applicants });
      return recruitmentData.MeetingSessions[meetingSessionIndex].meetings;
      } catch (error) {
        console.error('Error deleting meeting:', error.message);
        throw error;
      }
    };


// 14.**get meeting by ID**
export const getMeetingById = async (recruitmentId, meetingId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
    }

    const recruitmentData = recruitmentSnapshot.data();

    if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
      throw new Error('You are not authorized to view this recruitment');
    }

    const meetingSessions = recruitmentData.MeetingSessions || [];

    // Find the session and the meeting within the session
    for (let session of meetingSessions) {
      const meeting = session.meetings?.find(meeting => meeting.id === meetingId);
      
      if (meeting) {
        return {
          id: recruitmentSnapshot.id,
          ...recruitmentData,
          meetingSessionId: session.id,
          meetingData: meeting,
        };
      }
    }

    throw new Error('Meeting not found');

  } catch (error) {
    console.error('Error fetching meeting by ID:', error.message);
    throw error;
  }
};



// 15 **get applicants by stage **
export const getApplicantsByStage = async (recruitmentId, stages) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
    }

    const recruitmentData = recruitmentSnapshot.data();

    if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
      throw new Error('You are not authorized to view this recruitment');
    }

    const applicants = recruitmentData.Applicants || [];

    // Filter applicants by stages ['checked','interviewed', 'offer' etc]
    const applicantsByStage = applicants.filter(applicant => stages.includes(applicant.stage));

    return applicantsByStage;
  } catch (error) {
    console.error('Error fetching applicants by stage:', error.message);
    throw error;
  }
};

// 16.**create meeting session
export const createMeetingSession = async (recruitmentId, meetingSessionData) => {
  try {
    await checkAuth(); // Ensure the user is authenticated
    const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
    }

    const recruitmentData = recruitmentSnapshot.data();

    if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
      throw new Error('You are not authorized to create meeting session');
    }

    // Update the meetings list: check if the meeting with the same ID already exists
    const currentMeetings = recruitmentData.MeetingSessions || [];

    // Sprawdź, czy `meetingData.id` istnieje
    if (!meetingSessionData.id) {
      // Znajdź największe istniejące ID w currentMeetings
      const maxId = currentMeetings.reduce((max, meeting) => Math.max(max, meeting.id || 0), 0);
      meetingSessionData.id = maxId + 1; // Ustaw nowe ID jako o 1 większe niż największe
    }

    if(!meetingSessionData.meetings){
      meetingSessionData.meetings = [];
      }

    // Znajdź indeks spotkania o takim samym ID
    const meetingIndex = currentMeetings.findIndex(meetingsession => meetingsession.id === meetingSessionData.id);

    if (meetingIndex !== -1) {
      // Meeting exists, update their information and replace their files
      const updatedMeetings = currentMeetings.map((meetingSession, index) => {
        if (index === meetingIndex) {
          return {
            ...meetingSession,
            ...meetingSessionData,
          };
        }
        return meetingSession;
      });
      await updateDoc(recruitmentDoc, { MeetingSessions: updatedMeetings });
    }
    else {
      // New meeting, add to the list
      const updatedMeetings = [
        ...currentMeetings,
        { 
          ...meetingSessionData, 
        },
      ];

      await updateDoc(recruitmentDoc, { MeetingSessions: updatedMeetings });
    }

  } catch (error) {
    console.error('Error adding or updating meeting session:', error.message);
    throw error;
  }
};


// 17.**delete meeting session by ID**
export const deleteMeetingSession = async (recruitmentId, meetingSessionId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated
    const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
    }

    const recruitmentData = recruitmentSnapshot.data();
    if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
      throw new Error('You are not authorized to delete meeting session from this recruitment');
    }

    const meetingSessionIndex = recruitmentData.MeetingSessions.findIndex(meetingSession => meetingSession.id === meetingSessionId);

    if (meetingSessionIndex === -1) {
      throw new Error('Meeting session not found');
    }


    const CurrentMeetingSession = recruitmentData.MeetingSessions[meetingSessionIndex];
  
    //delete meetings
    for (const meeting of CurrentMeetingSession.meetings) {
       await deleteMeeting(recruitmentId, meeting.meetingSessionId ,meeting.id);
    }

    const updatedMeetingSessions = recruitmentData.MeetingSessions.filter((meetingSession) => meetingSession.id !== meetingSessionId);

    await updateDoc(recruitmentDoc, { MeetingSessions: updatedMeetingSessions });
  } catch (error) {
    console.error('Error deleting meeting session:', error.message);
  }
};

// 18.**get meeting session by ID**
export const getMeetingSessionById = async (recruitmentId, meetingSessionId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
    }

    const recruitmentData = recruitmentSnapshot.data();

    if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
      throw new Error('You are not authorized to view this recruitment');
    }

    const meetingIndex = recruitmentData.MeetingSessions.findIndex(meetingSession => meetingSession.id === meetingSessionId);

    if (meetingIndex === -1) {
      throw new Error('Meeting session not found');
    }

    return {
      MeetingSessions: recruitmentData.MeetingSessions[meetingIndex],
    };
  } catch (error) {
    console.error('Error fetching meeting session by ID:', error.message);
    throw error;
  }
};


// 19.**get meeting sessions by recruitment ID**
export const getMeetingSessionsByRecruitmentId = async (recruitmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
    }
    const recruitmentData = recruitmentSnapshot.data();
    const meetingSessions = recruitmentData.MeetingSessions || [];
    return meetingSessions;
  } catch (error) {
    console.error('Error fetching meeting sessions by recruitment ID:', error.message);
    throw error;
  }
};


// 20 **get meeting sessions for current user**
export const getUserMeetingSessions = async () => {
  try {
    // Ensure the user is authenticated
    const user = await checkAuth();

    if (!user?.uid) {
      throw new Error('User ID is undefined.');
    }

    const userId = user.uid;

    // Fetch recruitments that the user has applied to
    const recruitmentCollection = collection(db, 'recruitments');
    const q = query(recruitmentCollection);
    const snapshot = await getDocs(q);

    const userMeetingSessions = [];

    snapshot.docs.forEach((doc) => {
      const recruitmentData = doc.data();
      const applicants = recruitmentData.Applicants || [];


        if (recruitmentData.userId === userId) {
            const meetingSessions = recruitmentData.MeetingSessions || [];
            
            meetingSessions.forEach((session) => {
                userMeetingSessions.push({
                    meetingSessionName: session.meetingSessionName, // Only session name
                    meetingSessionDescription: session.meetingSessionDescription, // Only session description
                    meetings: (session.meetings || []).map((meeting) => {
                        // Znalezienie aplikanta na podstawie `applicantId`
                        const applicant = applicants.find((app) => String(app.id) === String(meeting.applicantId));

                        return {
                            ...meeting,
                            meetingApplicant: applicant || null, // Dodajemy dane aplikanta, jeśli znaleziono
                        };
                    }),
                });
            });
        }else{
          const applicants = recruitmentData.Applicants || [];

          // Find the applicant data for the current user
          const applicant = applicants.find((applicant) => applicant.userUid === userId);

          if (applicant) {
            console.log(`Applicant found for recruitment ID: ${doc.id}`); // Log if applicant is found
            const meetingSessions = recruitmentData.MeetingSessions || [];
            const applicantId = applicant.id;

            meetingSessions.forEach((session) => {
              const filteredMeetings = session.meetings.filter((meeting) => {
                const meetingApplicantId = Number(meeting.applicantId); // Convert to number
                const currentApplicantId = Number(applicantId); // Already converted applicantId

                return meetingApplicantId === currentApplicantId; // Compare after conversion
              });

              // If the user is part of any meeting in the session, include the session data
              if (filteredMeetings.length > 0) {
                userMeetingSessions.push({
                  meetingSessionName: session.meetingSessionName, // Only session name
                  meetingSessionDescription: session.meetingSessionDescription, // Only session description
                  meetings: filteredMeetings, 
                  recruitmentName: recruitmentData.name,
                  recruitmentjobTittle: recruitmentData.jobTittle,
                });
              }
              
            });  
          }
        }
    });

    return userMeetingSessions;

  } catch (error) {
    console.error('Error fetching user meeting sessions:', error.message);
    throw error;
  }
};

// 21.**get applicants name ,surname, email, overall score**
export const getApplicantsWithOverallScore = async (recruitmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitment = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitment);
    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
      }
      const recruitmentData = recruitmentSnapshot.data();
      const applicants = recruitmentData.Applicants || [];
      const applicantsWithOverallScore = applicants.map(applicant => {
        const applicantScore = parseFloat(applicant.CVscore.toFixed(2));
        return {
          ...applicant,
          totalScore: applicantScore,
        };
      });

      try {
        await updateDoc(recruitment, { Applicants: applicantsWithOverallScore });
      } catch (error) {
        console.error('Error updating applicants:', error); // Logujemy pełny błąd
        throw error;
      }

       const rankedApplicants = applicantsWithOverallScore.sort((a, b) => b.totalScore - a.totalScore);
      
      return rankedApplicants;
}catch (error) {
    console.error('Error fetching applicants overall score:', error.message);
    throw error;
  }
};

// 22.**get applicant name ,surname, email, overall score by ID**

export const getAllApplicants= async (recruitmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitment = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitment);
    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
      }
      const recruitmentData = recruitmentSnapshot.data();
      
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error('You are not authorized to view this recruitment');
      }

      const applicants = recruitmentData.Applicants || [];

      if (applicants) {
        return applicants;
      }
      
      throw new Error('Applicant not found');
    } catch (error) {
      console.error('Error fetching applicant confidential data:', error.message);
      throw error;
    }
  };


  // 23.**update meeting points**
  export const updateMeetingPoints = async (id, meetingSessionId, meetingId, updatedValue) => {
    try {
      await checkAuth(); // Ensure the user is authenticated asynchronously
      const recruitmentDoc = doc(db, 'recruitments', id);
      const recruitmentSnapshot = await getDoc(recruitmentDoc);
      if (!recruitmentSnapshot.exists()) {
        throw new Error('Recruitment not found');
        }
        const recruitmentData = recruitmentSnapshot.data();
        const meetingSessionIndex = recruitmentData.MeetingSessions.findIndex(meetingSession => meetingSession.id === meetingSessionId);
        if (meetingSessionIndex === -1) {
          throw new Error('Meeting session not found');
        }
        const meetingIndex = recruitmentData.MeetingSessions[meetingSessionIndex].meetings.findIndex(meeting => meeting.id === meetingId);
        if (meetingIndex === -1) {
          throw new Error('Meeting not found');
        }
        //c
        recruitmentData.MeetingSessions[meetingSessionIndex].meetings[meetingIndex].points = updatedValue;
        await updateDoc(recruitmentDoc, { MeetingSessions: recruitmentData.MeetingSessions });
        
        } catch (error) {
          console.error('Error updating meeting points:', error.message);
          throw error;
        }
      };

  // 24.**get meetings by user UID**
  export const getMeetingsByUserId = async (userUid) => {
    try {
      await checkAuth(); // Ensure the user is authenticated asynchronously
      const recruitmentCollection = collection(db, "recruitments");
      const q = query(recruitmentCollection);
      const snapshot = await getDocs(q);
      const userMeetings = [];
  
      snapshot.docs.forEach((doc) => {
        const recruitmentData = doc.data();
        const applicants = recruitmentData.Applicants || [];
        const meetingSessions = recruitmentData.MeetingSessions || [];
  
        // Find the applicant data for the current user
        const applicant = applicants.find((applicant) => String(applicant.userUid) === String(userUid));
  
        if (applicant) {
          // Find the meetings for the current user
          meetingSessions.forEach((session) => {
            const userMeetingsInSession = session.meetings.filter((meeting) => String(meeting.applicantId) === String(applicant.id));
  
            userMeetingsInSession.forEach((meeting) => {
              userMeetings.push({
                recruitmentId: doc.id, // ID dokumentu rekrutacji
                meetingSessionId: session.id, // ID sesji spotkań
                meetingId: meeting.id, // ID konkretnego spotkania
                meetingDetails: meeting, // Szczegóły spotkania
              });
            });
          });
        }
      });
  
      return userMeetings;
    } catch (error) {
      console.error("Error fetching meetings by user UID:", error.message);
      throw error;
    }
  };

  // 25.**count applicant meetings**
  export const countApplicantMeetings = async (userId, recruitmentId) => {
    try {
      await checkAuth(); // Ensure the user is authenticated asynchronously
      const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
      const recruitmentSnapshot = await getDoc(recruitmentDoc);
      if (!recruitmentSnapshot.exists()) {
        throw new Error('Recruitment not found');
      }
      const recruitmentData = recruitmentSnapshot.data();
      const meetingSessions = recruitmentData.MeetingSessions || [];
      let meetingCount = -1; 
      meetingSessions.forEach((session) => {
          session.meetings.forEach((meeting) => {
            if (String(meeting.applicantId) === String(userId)) {
              meetingCount++;
            }
          });
        });
        console.log(meetingCount);
        return meetingCount;
      } catch (error) {
        console.error('Error counting applicant meetings:', error.message);
        throw error;
      }
    };

  // 26.**create assessments session**
  export const createAssessmentSession = async (recruitmentId, assessmentSessionData) => {
    try {
      await checkAuth(); // Ensure the user is authenticated
      const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
      const recruitmentSnapshot = await getDoc(recruitmentDoc);
  
      if (!recruitmentSnapshot.exists()) {
        throw new Error('Recruitment not found');
      }
  
      const recruitmentData = recruitmentSnapshot.data();
  
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error('You are not authorized to create assessment session');
      }
  
      // Update the assessments list: check if the assessment with the same ID already exists
      const currentAssessments = recruitmentData.AssessmentSessions || [];
  
      // Sprawdź, czy `assessmentData.id` istnieje
      if (!assessmentSessionData.id) {
        // Znajdź największe istniejące ID w currentAssessments
        const maxId = currentAssessments.reduce((max, assessment) => Math.max(max, assessment.id || 0), 0);
        assessmentSessionData.id = maxId + 1; // Ustaw nowe ID jako o 1 większe niż największe
      }
  
      if(!assessmentSessionData.assessments){
        assessmentSessionData.assessments = [];
        }
  

      const assessmentIndex = currentAssessments.findIndex(assessmentsession => assessmentsession.id === assessmentSessionData.id);
  
      if (assessmentIndex !== -1) {
        // Assessment exists, update their information and replace their files
        const updatedAssessments = currentAssessments.map((assessmentSession, index) => {
          if (index === assessmentIndex) {
            return {
              ...assessmentSession,
              ...assessmentSessionData,
            };
          }
          return assessmentSession;
        });
        await updateDoc(recruitmentDoc, { AssessmentSessions: updatedAssessments });
      }
      else {
        // New assessment, add to the list
        const updatedAssessments = [
          ...currentAssessments,
          { 
            ...assessmentSessionData, 
          },
        ];
  
        await updateDoc(recruitmentDoc, { AssessmentSessions: updatedAssessments });
      }
  
    } catch (error) {
      console.error('Error adding or updating assessment session:', error.message);
      throw error;
    }
  };
  
  // 27.**delete assessment session by ID**
  export const deleteAssessmentSession = async (recruitmentId, assessmentSessionId) => {
    try {
      await checkAuth(); // Ensure the user is authenticated
      const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
      const recruitmentSnapshot = await getDoc(recruitmentDoc);
  
      if (!recruitmentSnapshot.exists()) {
        throw new Error('Recruitment not found');
      }
  
      const recruitmentData = recruitmentSnapshot.data();
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error('You are not authorized to delete assessment session from this recruitment');
      }
  
      const assessmentSessionIndex = recruitmentData.AssessmentSessions.findIndex(assessmentSession => assessmentSession.id === assessmentSessionId);
  
      if (assessmentSessionIndex === -1) {
        throw new Error('Assessment session not found');
      }
  
      //update applicants stage
      const CurrentAssessmentSession = recruitmentData.AssessmentSessions[assessmentSessionIndex];
      
  
      //delete assessments
      for (const assessment of CurrentAssessmentSession.assessments) {
         await deleteAssessment(recruitmentId, assessment.assessmentSessionId ,assessment.id);
      }
  
      const updatedAssessmentSessions = recruitmentData.AssessmentSessions.filter((assessmentSession) => assessmentSession.id !== assessmentSessionId);
  
      await updateDoc(recruitmentDoc, { AssessmentSessions: updatedAssessmentSessions});
    } catch (error) {
      console.error('Error deleting assessment session:', error.message);
    }
  };

  // 28.**add assessments**
export const addAssessments = async (recruitmentId, assessmentsData) => {
  try {
    await checkAuth(); // Sprawdzenie uwierzytelnienia użytkownika
    const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
    }

    const recruitmentData = recruitmentSnapshot.data();
    const assessmentSessions = recruitmentData.AssessmentSessions || [];
    const applicants = recruitmentData.Applicants || [];

    // **Zapewnij, że meetingsData jest tablicą**
    const assessmentsArray = Array.isArray(assessmentsData) ? assessmentsData : [assessmentsData];

    // **Przetwarzanie wszystkich spotkań**
    for (const assessmentData of assessmentsArray) {
      // Zakładając, że meetingData zawiera tablicę meetings
      const assessments = assessmentData.assessments  || [];
     for (const singleAssessment  of assessments ) {


        
        // **Sprawdzenie, czy singleMeeting ma poprawną strukturę**
        if (!singleAssessment || typeof singleAssessment !== "object") {
          console.error("singleMeeting is undefined or not an object!", singleAssessment);
          return;
        }
        
        let IsSessionChanged = '';

        if(singleAssessment.previousSessionId){
          IsSessionChanged= singleAssessment.meetingSessionId !== singleAssessment.previousSessionId;
        }else{
        IsSessionChanged = false;
        }

            // **Sprawdzanie, czy sessionId jest dostępne w singleMeeting**
            const sessionId = Number(singleAssessment.assessmentSessionId);


            const sessionIndex = assessmentSessions.findIndex(
              session => Number(session.id) === sessionId
            );
            
            if (sessionIndex === -1) {
              console.warn(`Meeting session with ID ${sessionId} not found.`);
              return;
            }
            


            // **Dodaj spotkanie do sesji**
            const session = assessmentSessions[sessionIndex];
            const currentAssessments = session.assessments || [];


        if(IsSessionChanged){
          const PreviousSessionId = Number(singleAssessment.previousSessionId);
  
          const PreviousSessionIndex = assessmentSessions.findIndex(
            session => Number(session.id) === PreviousSessionId
          );

          const oldSession = assessmentSessions[PreviousSessionIndex];
          const oldAssessments = oldSession.assessments || [];
          const indexToRemove = oldAssessments.findIndex(assessment => assessment.id === singleAssessment.id);

          const previousApplicant = oldAssessments[indexToRemove].applicantId;
          const previousApplicantIndex = applicants.findIndex(applicant => applicant.id === previousApplicant);

          if(previousApplicantIndex !== -1){
            sendEmail('REMOVE','ASSESSMENT',applicants[previousApplicantIndex], recruitmentData.name, oldSession.assessmentSessionName, oldSession.assessmentSessionDescription , singleAssessment);
            const assessmentCount = await countApplicantAssessments(previousApplicant, recruitmentId);
            if (assessmentCount <= 0) {
              applicants[previousApplicantIndex].stage = 'Checked';
            }           
          }

          if (indexToRemove !== -1) { 
              oldAssessments.splice(indexToRemove, 1);
          }

         
          assessmentSessions[PreviousSessionIndex].assessments = oldAssessments;

          const maxId = currentAssessments.reduce((max, assessment) => Math.max(max, assessment.id || 0), 0);
          singleAssessment.id = maxId + 1;

          currentAssessments.push(singleAssessment);
        }else{
            if(!singleAssessment.id){
              const maxId = currentAssessments.reduce((max, assessment) => Math.max(max, assessment.id || 0), 0);
              singleAssessment.id = maxId + 1;
            }
            // **Aktualizacja lub dodanie spotkania**
            const existingAssessmentIndex = currentAssessments.findIndex(assessment =>
              String(assessment.id) === String(singleAssessment.id)
            );

            if (existingAssessmentIndex !== -1) {
              const previousApplicant = currentAssessments[existingAssessmentIndex].applicantId;
              const previousApplicantIndex = applicants.findIndex(applicant => String(applicant.id) === String(previousApplicant));
             
              if(previousApplicantIndex !== -1){
                sendEmail('REMOVE','ASSESSMENT', applicants[previousApplicantIndex], recruitmentData.name, session.assessmentSessionName,session.assessmentSessionDescription , singleAssessment);
                const assessmentCount = await countApplicantAssessments(previousApplicant, recruitmentId);
                if (assessmentCount <= 0) {
                  applicants[previousApplicantIndex].stage = 'Checked';
                }           
              }

              currentAssessments[existingAssessmentIndex] = { ...currentAssessments[existingAssessmentIndex], ...singleAssessment };
            } else {
              currentAssessments.push(singleAssessment);
            }
          }

          const applicantId = Number(singleAssessment.applicantId); // Przekształć applicantId na liczbę

          // **Aktualizacja etapu aplikanta**
          const applicantIndex = applicants.findIndex(applicant => applicant.id === applicantId);
          if (applicantIndex !== -1) {
            applicants[applicantIndex].stage = 'Invited for interview';
            sendEmail('ADD','ASSESSMENT',applicants[applicantIndex], recruitmentData.name, session.assessmentSessionName,session.assessmentSessionDescription , singleAssessment);
          }

      }
    }

    // **Zapisz zmiany w Firestore**
    await updateDoc(recruitmentDoc, { AssessmentSessions: assessmentSessions, Applicants: applicants });
    console.log("Assessments and applicants updated successfully!");

  } catch (error) {
    console.error('Error adding or updating assessment:', error.message);
    throw error;
  }
};



// 29.**delete assessment by ID**
export const deleteAssessment = async (id, assessmentSessionId, assessmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, 'recruitments', id);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);
    
    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
      }

      const recruitmentData = recruitmentSnapshot.data();
      const applicants = recruitmentData.Applicants || [];
      const AssessmentSessionIndex = recruitmentData.AssessmentSessions.findIndex(assessmentSession =>
        String(assessmentSession.id) === String(assessmentSessionId) 
      );
      if (AssessmentSessionIndex === -1) {
        throw new Error('Assessment session not found');
      }

      const AssessmentIndex = recruitmentData.AssessmentSessions[AssessmentSessionIndex].assessments.findIndex(assessment => 
        String(assessment.id) === String(assessmentId)
      );
      if (AssessmentIndex === -1) {
        throw new Error('Assessment not found');
      }

      const session = recruitmentData.AssessmentSessions[AssessmentSessionIndex];
      const singleAssessment = session.assessments[AssessmentIndex];
      const applicantId = Number( recruitmentData.AssessmentSessions[AssessmentSessionIndex].assessments[AssessmentIndex].applicantId); // Przekształć applicantId na liczbę

      // **Aktualizacja etapu aplikanta**
      const applicantIndex = applicants.findIndex(applicant => applicant.id === applicantId);
      if (applicantIndex !== -1) {
        sendEmail('REMOVE','ASSESSMENT',applicants[applicantIndex], recruitmentData.name, session.assessmentSessionName,session.assessmentSessionDescription , singleAssessment);
        const assessmentCount = await countApplicantAssessments(applicantId, id);
        if (assessmentCount <= 0) {
          applicants[applicantIndex].stage = 'Checked';
        }
      }

      recruitmentData.AssessmentSessions[AssessmentSessionIndex].assessments.splice(AssessmentIndex, 1);
      await updateDoc(recruitmentDoc, { AssessmentSessions: recruitmentData.AssessmentSessions, Applicants: applicants });
      return recruitmentData.AssessmentSessions[AssessmentSessionIndex].assessments;
      } catch (error) {
        console.error('Error deleting assessment:', error.message);
        throw error;
      }
    };


// 30.**get assessment by ID**
export const getAssessmentById = async (recruitmentId, assessmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
    }

    const recruitmentData = recruitmentSnapshot.data();

    if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
      throw new Error('You are not authorized to view this recruitment');
    }

    const assessmentSessions = recruitmentData.AssessmentSessions || [];

    // Find the session and the meeting within the session
    for (let session of assessmentSessions) {
      const assessment = session.assessments?.find(assessment => assessment.id === assessmentId);
      
      if (assessment) {
        return {
          id: recruitmentSnapshot.id,
          ...recruitmentData,
          assessmentSessionId: session.id,
          assessmentData: assessment,
        };
      }
    }

    throw new Error('Assessment not found');

  } catch (error) {
    console.error('Error fetching assessment by ID:', error.message);
    throw error;
  }
};



// 31.**count assessments by user ID**
export const countApplicantAssessments = async (userId, recruitmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);
    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
      }
      const recruitmentData = recruitmentSnapshot.data();
      const assessmentSessions = recruitmentData.AssessmentSessions || [];
      let assessmentCount = -1; 
      assessmentSessions.forEach((session) => {
          session.assessments.forEach((assessment) => {
            if (String(assessment.applicantId) === String(userId)) {
              assessmentCount++;
            }
          });
        });
        console.log(assessmentCount);
        return assessmentCount;
      } catch (error) {
        console.error('Error counting applicant assessments:', error.message);
        throw error;
      }
    };

    // 32.**get assessments session by recruitment ID**
export const getAssessmentsByRecruitmentId = async (recruitmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, 'recruitments', recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error('Recruitment not found');
    }

    const recruitmentData = recruitmentSnapshot.data();

    if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
      throw new Error('You are not authorized to view this recruitment');
    }

    const assessmentSessions = recruitmentData.AssessmentSessions || [];

    if (assessmentSessions) {
      return assessmentSessions;
    }
    
    throw new Error('Assessment session not found');
  } catch (error) {
    console.error('Error fetching assessment session by ID:', error.message);
    throw error;
  }
};

    









  

  