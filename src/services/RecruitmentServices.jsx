import app, { db, storage, firebaseAuth as auth  } from "../firebase/baseconfig";
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
  arrayUnion,
} from "firebase/firestore";
import { firebaseAuth } from "../firebase/baseconfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import sendEmail from "./MailerServices";
import { GetIsAdmin } from "../store/AuthContext";
import { getFirebaseUsers } from "./recruitmentApi";

//fetch all emails with  signInMethod
export const fetchAllEmails = async () => {
  const emailsCollection = collection(db, "emails");
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
      console.log("Existing email found:", existingEmail);
    } else {
      console.log("No existing email found for:", email);
    }

    // If email exists and has a Google sign-in method, don't add it
    if (existingEmail && existingEmail.signInMethod === "google") {
      return;
    }

    // If email exists and has an email/password sign-in method, update to Google
    if (existingEmail && existingEmail.signInMethod === "email/password") {
      const docRef = doc(db, "emails", email); // Reference to the email document
      await setDoc(docRef, { email, signInMethod: "google" }); // Update to Google sign-in

      return;
    }

    // If email doesn't exist, create a new document
    const docRef = doc(db, "emails", email); // Correctly set a unique ID for the document
    await setDoc(docRef, { email, signInMethod });
  } catch (error) {
    console.error("Error in addEmail function:", error);
  }
};

//delete email from firestore
export const deleteEmail = async (email) => {
  // Get reference to the emails collection
  const emailsCollection = collection(db, "emails");

  // Create a query to find the document based on the email field
  const q = query(emailsCollection, where("email", "==", email));

  // Fetch the documents that match the query
  const querySnapshot = await getDocs(q);

  // Check if the document exists
  if (!querySnapshot.empty) {
    // Get the first matching document (assuming email is unique)
    const docRef = doc(db, "emails", querySnapshot.docs[0].id);

    // Delete the document
    await deleteDoc(docRef);
    console.log("Email document deleted.");
  } else {
    console.log("No document found with this email.");
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
          reject(new Error("User is not authenticated!")); // Reject if no user
        }
        unsubscribe(); // Unsubscribe from the listener after it's triggered
      });
    }
  });
};

// Funkcja do konwersji Base64 na obiekt File z pomiarem czasu
const base64ToFile = (base64, fileName) => {
  console.time(`Base64 to File Conversion Time: ${fileName}`); // Start pomiaru

  const [metadata, data] = base64.split(",");
  const mimeType = metadata.match(/:(.*?);/)[1]; // Wyciągnięcie typu MIME
  const binary = atob(data); // Dekodowanie Base64
  const array = Uint8Array.from(binary, (char) => char.charCodeAt(0)); // Konwersja do Uint8Array
  const file = new File([array], fileName, { type: mimeType });

  console.timeEnd(`Base64 to File Conversion Time: ${fileName}`); // Koniec pomiaru
  return file;
};

// Funkcja do przesyłania pliku do Firebase Storage
const uploadToStorage = async (file, filePath) => {
  const storageRef = ref(storage, filePath);
  const uploadSnapshot = await uploadBytes(storageRef, file);
  const fileUrl = await getDownloadURL(uploadSnapshot.ref);
  return fileUrl;
};

// Reference to the recruitment collection
const recruitmentCollection = collection(db, "recruitments");

// **1. Add a new recruitment**
export const addRecruitment = async (recruitmentData) => {
  try {
    checkAuth(); // Verify authentication
    const userId = firebaseAuth.currentUser.uid; // Get current user's ID
    const docRef = await addDoc(recruitmentCollection, {
      ...recruitmentData,
      userId,
    }); // Add userId to the recruitment document
    await updateUserStat(userId, "AllTimeRecruitmentsCount", "increment");
    return docRef.id;
  } catch (error) {
    console.error("Error adding recruitment:", error.message);
    throw error;
  }
};

// **2. Get all recruitments (with filtering)**
export const getRecruitments = async ( adminpanel = false) => {
  try {
    checkAuth(); // Ensure the user is authenticated
    const isAdmin = GetIsAdmin();
    const userId = firebaseAuth.currentUser.uid; // Get the current user's ID

    const q = query(recruitmentCollection); // Fetch all documents from the collection
    const snapshot = await getDocs(q);

    if (isAdmin && adminpanel) {
      return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    } else {
      // Map and filter recruitments
      return snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(
          (recruitment) =>
            recruitment.userId === userId 
        );
    }
  } catch (error) {
    console.error("Error fetching recruitments:", error.message);
    throw error;
  }
};

// **2.1 Get all public recruitments (with filtering and highest ID)**
export const getPublicRecruitments = async (searchTerm = "") => {
  try {
    // Ensure the user is authenticated
    const user = await checkAuth();

    if (!user?.uid) {
      throw new Error("User ID is undefined.");
    }

    const userId = user.uid;
    console.log("userId", userId);
    const recruitmentCollection = collection(db, "recruitments");
    const q = query(recruitmentCollection);
    const snapshot = await getDocs(q);

    // Map and filter recruitments
    return snapshot.docs
      .map((doc) => {
        const recruitmentData = doc.data();
        const applicants = recruitmentData.Applicants || [];

        // Check if the current user is already an applicant
        const isAlreadyApplicant = applicants.some(
          (applicant) => applicant.userUid === userId
        );

        const isOwner = recruitmentData.userId === userId;
        console.log(isOwner);

        return {
          id: doc.id,
          isAlreadyApplicant,
          isOwner,
          name: recruitmentData.name,
          status: recruitmentData.status,
          jobTittle: recruitmentData.jobTittle,
          educationLevel: recruitmentData.educationLevel,
          educationField: recruitmentData.educationField,
          languages: recruitmentData.languages,
          skills: recruitmentData.skills,
          courses: recruitmentData.courses,
        };
      })
      .filter(
        (recruitment) =>
          recruitment.status === "Public" &&
          !recruitment.isOwner && // Ensure the recruitment is not owned by the current user
          !recruitment.isAlreadyApplicant && // Ensure the current user is not already an applicant
          Object.values(recruitment)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) // Filter by search term
      );
  } catch (error) {
    console.error("Error fetching recruitments:", error.message);
    throw error;
  }
};

// **2.2 Get all user applications (with filtering)**
export const getUserApplications = async (searchTerm = "") => {
  try {
    // Ensure the user is authenticated
    const user = await checkAuth();

    if (!user?.uid) {
      throw new Error("User ID is undefined.");
    }

    const userId = user.uid;

    const recruitmentCollection = collection(db, "recruitments");
    const q = query(recruitmentCollection);
    const snapshot = await getDocs(q);

    // Map and filter recruitments where the user is an applicant
    const userApplications = snapshot.docs
      .map((doc) => {
        const recruitmentData = doc.data();
        const applicants = recruitmentData.Applicants || [];

        // Find the applicant data for the current user
        const applicant = applicants.find(
          (applicant) => applicant.userUid === userId
        );

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
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) || // Filter by applicant data
          [
            recruitment.recruitmentData.status,
            recruitment.recruitmentData.stage,
          ]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) // Filter by status and stage
      );

    return userApplications;
  } catch (error) {
    console.error("Error fetching user applications:", error.message);
    throw error;
  }
};

// **3. Delete a recruitment (with all applicants, their CV files, and optional Covering Letters)**
export const deleteRecruitment = async (recruitmentId) => {
  try {
    await checkAuth();
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    // Ensure the current user is the owner of the recruitment
    const recruitmentData = recruitmentSnapshot.data();

    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error("You are not authorized to delete this recruitment");
      }
    }
    // Delete all CV and Cover Letter files for each applicant
    const applicants = recruitmentData.Applicants || [];
    for (const applicant of applicants) {
      // Call deleteOldFiles for CVs
      if (applicant.cvFileUrls && applicant.cvFileUrls.length > 0) {
        await deleteOldFiles(applicant, "Cv");
      }

      // Call deleteOldFiles for Cover Letters
      if (
        applicant.coverLetterFileUrls &&
        applicant.coverLetterFileUrls.length > 0
      ) {
        await deleteOldFiles(applicant, "CoverLetter");
      }
    }

    // Finally, delete the recruitment document itself
    await deleteDoc(recruitmentDoc);
  } catch (error) {
    console.error("Error deleting recruitment:", error.message);
  }
};

// **4. Update a recruitment**
export const updateRecruitment = async (recruitmentId, updatedData) => {
  try {
    checkAuth();
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    // Ensure the current user is the owner of the recruitment
    const recruitmentData = recruitmentSnapshot.data();
    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error("You are not authorized to update this recruitment");
      }
    }

    await updateDoc(recruitmentDoc, updatedData);
  } catch (error) {
    console.error("Error updating recruitment:", error.message);
    throw error;
  }
};

// 5. Add or update an applicant with CV and optional Cover Letter
export const addApplicant = async (
  recruitmentId,
  applicantData,
  cvFiles,
  coverLetterFiles,
  indedx
) => {
  try {
    await checkAuth(); // Ensure the user is logged in
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    // Ensure the user is the owner of the recruitment
    const recruitmentData = recruitmentSnapshot.data();

    // Update the applicants list: check if the applicant with the same ID already exists
    const currentApplicants = recruitmentData.Applicants || [];

    const applicantIndex = currentApplicants.findIndex(
      (applicant) => applicant.id === applicantData.id
    );

    if (applicantIndex === -1) {
      // Get highest id from applicants
      const highestId = currentApplicants.reduce(
        (maxId, applicant) => (applicant.id > maxId ? applicant.id : maxId),
        0
      );

      applicantData.id = highestId + 1 + indedx;
    }

    console.log("applicantData", applicantData);
    console.log("aplicant index", applicantIndex);

    if (applicantData.userUid) {
      if (recruitmentData.status == "Private") {
        throw new Error("This recruitment is private, you cant apply");
      } else {
        await updateUserStat(
          applicantData.userUid,
          "AllTimeApplicationsCount",
          "increment"
        );
      }
    } else {
      if (!isAdmin) {
        if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
          throw new Error(
            "You are not authorized to add applicants to this recruitment"
          );
        }
      }

      if (applicantIndex === -1) {
        if (recruitmentData.status == "Public") {
          throw new Error(
            "You need to cahnge recruitment to private  to add applicants by yourself"
          );
        } else {
        }
      }
    }

    console.log("applicantData id: ", applicantData.id);

    // Convert cvFiles to an array if it's not already
    const cvFilesArray = Array.isArray(cvFiles) ? cvFiles : Array.from(cvFiles);

    // If cvFiles are URLs, skip the upload process entirely
    let cvFileUrls = [];
    if (
      cvFilesArray.every(
        (file) => typeof file === "string" && file.startsWith("https://")
      )
    ) {
      // If all cvFiles are already URLs, just use them directly
      cvFileUrls = cvFilesArray;
    } else {
      if (applicantIndex !== -1) {
        // Remove old CV and Cover Letter files from storage (optional, if needed)
        await deleteOldFiles(currentApplicants[applicantIndex], "Cv");
      }
      // Otherwise, proceed with the conversion and uploading of CV files
      const cvFileUploadPromises = cvFilesArray.map((cvFileBase64, index) => {
        const cvFile = base64ToFile(
          cvFileBase64,
          `${applicantData.id}_cv_${index + 1}.png`
        );
        const cvFilePath = `cv/${recruitmentId}/${applicantData.id}_${
          index + 1
        }.png`;

        return uploadToStorage(cvFile, cvFilePath);
      });

      // Równoczesne przesyłanie plików i oczekiwanie na ich zakończenie
      cvFileUrls = await Promise.all(cvFileUploadPromises);
    }

    // Prepare to upload Cover Letter files (if they exist)
    let coverLetterFileUrls = [];
    if (coverLetterFiles && coverLetterFiles.length > 0) {
      // Check if coverLetterFiles are already URLs (https links)
      if (
        coverLetterFiles.every(
          (file) => typeof file === "string" && file.startsWith("https://")
        )
      ) {
        // If all coverLetterFiles are already URLs, just use them directly
        coverLetterFileUrls = coverLetterFiles;
      } else {
        if (applicantIndex !== -1) {
          // Remove old CV and Cover Letter files from storage (optional, if needed)
          await deleteOldFiles(
            currentApplicants[applicantIndex],
            "CoverLetter"
          );
        }
        // Otherwise, proceed with the conversion and uploading of Cover Letter files
        const coverLetterUploadPromises = coverLetterFiles.map(
          (coverLetterFileBase64, index) => {
            const coverLetterFile = base64ToFile(
              coverLetterFileBase64,
              `${applicantData.id}_coverLetter_${index + 1}.webp`
            );
            const coverLetterFilePath = `coveringletters/${recruitmentId}/${
              applicantData.id
            }_${index + 1}.webp`;

            return uploadToStorage(coverLetterFile, coverLetterFilePath);
          }
        );

        // Równoczesne przesyłanie plików i oczekiwanie na ich zakończenie
        coverLetterFileUrls = await Promise.all(coverLetterUploadPromises);
      }
    } else {
      if (applicantIndex !== -1) {
        const coverLetterUrls =
          currentApplicants[applicantIndex]?.coverLetterFileUrls;
        if (coverLetterUrls && coverLetterUrls.length > 0) {
          await deleteOldFiles(
            currentApplicants[applicantIndex],
            "CoverLetter"
          );
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
      const newApplicant = 
        {
          ...applicantData,
          cvFileUrls,
          coverLetterFileUrls,
        };
      
      await updateDoc(recruitmentDoc, { Applicants: arrayUnion(newApplicant), });
    }
  } catch (error) {
    console.error("Error adding or updating applicant:", error.message);
    throw error;
  }
};

// Function to delete old CV and cover letter files from Firebase Storage
// Function to delete old CV and cover letter files from Firebase Storage
const deleteOldFiles = async (oldApplicantData, type) => {
  try {
    if (type === "Cv") {
      if (
        !oldApplicantData.cvFileUrls ||
        oldApplicantData.cvFileUrls.length === 0
      ) {
        return;
      }

      // Delete old CV files from storage
      for (const cvFileUrl of oldApplicantData.cvFileUrls) {
        const cvFilePath = cvFileUrl.split("?")[0]; // Get the file path from the URL
        const cvRef = ref(storage, cvFilePath);
        await deleteObject(cvRef);
      }
    } else if (type === "CoverLetter") {
      if (
        !oldApplicantData.coverLetterFileUrls ||
        oldApplicantData.coverLetterFileUrls.length === 0
      ) {
        return;
      }

      // Delete old Cover Letter files from storage
      for (const coverLetterFileUrl of oldApplicantData.coverLetterFileUrls) {
        const coverLetterFilePath = coverLetterFileUrl.split("?")[0]; // Get the file path from the URL
        const coverLetterRef = ref(storage, coverLetterFilePath);
        await deleteObject(coverLetterRef);
      }
    } else {
    }
  } catch (error) {
    console.error("Error deleting old files:", error);
  }
};

// 6. Delete an applicant from a recruitment (with CV and optional Cover Letter)
export const deleteApplicant = async (recruitmentId, applicantId) => {
  try {
    await checkAuth(); // Ensure the user is logged in
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);
    const recruitmentData = recruitmentSnapshot.data();

    // Find the applicant to delete
    const currentApplicants = recruitmentData.Applicants || [];
    const applicantToDelete = currentApplicants.find(
      (applicant) => applicant.id === applicantId
    );

    // Ensure the user is the owner of the recruitment

    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        if (applicantToDelete.userUid !== firebaseAuth.currentUser.uid) {
          throw new Error(
            "You are not authorized to delete applicants from this recruitment"
          );
        }
      }
    }

    if (!applicantToDelete) {
      throw new Error("Applicant not found");
    }

    // Delete CV and Cover Letter files from Firebase Storage
    for (const cvFileUrl of applicantToDelete.cvFileUrls) {
      const cvFilePath = cvFileUrl.split("?")[0]; // Get the file path from the URL
      const cvRef = ref(storage, cvFilePath);
      await deleteObject(cvRef);
      console.log(`Deleted CV file: ${cvFilePath}`);
    }

    if (applicantToDelete.coverLetterFileUrls) {
      for (const coverLetterFileUrl of applicantToDelete.coverLetterFileUrls) {
        const coverLetterFilePath = coverLetterFileUrl.split("?")[0]; // Get the file path from the URL
        const coverLetterRef = ref(storage, coverLetterFilePath);
        await deleteObject(coverLetterRef);
        console.log(`Deleted Cover Letter file: ${coverLetterFilePath}`);
      }
    }

    // Delete meetings
    const meetings = recruitmentData.MeetingSessions.map(
      (session) => session.meetings
    ).flat();
    for (const meeting of meetings) {
      if (String(meeting.applicantId) === String(applicantId)) {
        await deleteMeeting(
          recruitmentId,
          meeting.meetingSessionId,
          meeting.id
        );
      }
    }

    // Remove the applicant from the list and update Firestore
    const updatedApplicants = currentApplicants.filter(
      (applicant) => applicant.id !== applicantId
    );
    await updateDoc(recruitmentDoc, { Applicants: updatedApplicants });
  } catch (error) {
    console.error("Error deleting applicant:", error.message);
    throw error;
  }
};

// 7. Get all applicants from a recruitment (with CV and optional Cover Letter previews) and with pagination
export const getApplicants = async (recruitmentId, page, limit) => {
  try {
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();
    const recruitmentStatus = recruitmentData.status;
    const applicants = recruitmentData.Applicants || [];

    // Get total applicants count
    const totalApplicants = applicants.length;

    // Sort applicants by id (ascending order)
    const sortedApplicants = applicants.sort((a, b) => a.id - b.id);

    // Paginate applicants: get the applicants for the current page
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApplicants = sortedApplicants.slice(startIndex, endIndex);

    // Create an array with applicants and their file previews
    const applicantsWithPreviews = await Promise.all(
      paginatedApplicants.map(async (applicant) => {
        const cvPreviewPromises = applicant.cvFileUrls.map(
          async (cvFileUrl) => {
            // Generate preview URLs for CV files
            const previewUrl = await getFilePreview(cvFileUrl);
            return previewUrl;
          }
        );

        const coverLetterPreviewPromises = applicant.coverLetterFileUrls
          ? applicant.coverLetterFileUrls.map(async (coverLetterFileUrl) => {
              // Generate preview URLs for Cover Letter files
              const previewUrl = await getFilePreview(coverLetterFileUrl);
              return previewUrl;
            })
          : [];

        const cvPreviews = await Promise.all(cvPreviewPromises);
        const coverLetterPreviews = await Promise.all(
          coverLetterPreviewPromises
        );

        return {
          ...applicant,
          cvPreviews,
          coverLetterPreviews,
        };
      })
    );

    // Return both applicants, total count for pagination, and the highest applicant id
    return {
      applicants: applicantsWithPreviews,
      totalApplicants,
      recruitmentStatus,
    };
  } catch (error) {
    console.error("Error getting applicants:", error.message);
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
    console.error("Error getting file preview:", error.message);
    throw error;
  }
};

// **8. Get a single recruitment by ID**
export const getRecruitmentById = async (recruitmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", recruitmentId); // Reference to the specific recruitment document
    const recruitmentSnapshot = await getDoc(recruitmentDoc); // Fetch the document

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();

    // Ensure the current user is the owner of the recruitment
    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error("You are not authorized to view this recruitment");
      }
    }

    return {
      id: recruitmentSnapshot.id,
      ...recruitmentData,
    };
  } catch (error) {
    console.error("Error fetching recruitment by ID:", error.message);
    throw error;
  }
};

// **9. Get all recruitments by User ID**
export const getRecruitmentsByUserId = async (userId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously

    const recruitmentsRef = collection(db, "recruitments"); // Reference to the recruitments collection
    const q = query(recruitmentsRef, where("userId", "==", userId)); // Query to fetch recruitments by userId

    const querySnapshot = await getDocs(q); // Get the documents from the query

    if (querySnapshot.empty) {
      console.log("No recruitments found for this user");
      return []; // Return an empty array if no documents are found
    }

    // Map through the documents and return the recruitment data
    const recruitments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return recruitments; // Return the list of recruitments
  } catch (error) {
    console.error("Error fetching recruitments by user ID:", error.message);
    throw error; // Propagate the error for handling in the caller
  }
};

// **10. get applicants ranking by score
export const getApplicantsRanking = async (recruitmentId) => {
  const recruitmentDoc = doc(db, "recruitments", recruitmentId);
  const recruitmentSnapshot = await getDoc(recruitmentDoc);

  if (!recruitmentSnapshot.exists()) {
    throw new Error("Recruitment not found");
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
    Technician: 1,
    Engineer: 2,
    Master: 3,
    Doctor: 4,
    Specialist: 5,
    Undergraduate: 1,
    Postgraduate: 2,
    Diploma: 1,
    Certificate: 1,
  };

  const calculateScore = async (applicant) => {
    let totalScore = 0;

    // Zamiana list na zbiory (O(n))
    const recruitmentCoursesSet = new Set(recruitmentData.courses || []);
    const recruitmentSkillsSet = new Set(recruitmentData.skills || []);

    // Courses
    const matchedCourses = applicant.courses.reduce(
      (count, course) => count + (recruitmentCoursesSet.has(course) ? 1 : 0),
      0
    );

    const totalRecruitmentCourses = recruitmentCoursesSet.size;
    const weightOfCourses = recruitmentData.weightOfCourses || 0;

    const coursesScore =
      totalRecruitmentCourses > 0
        ? (matchedCourses / totalRecruitmentCourses) * weightOfCourses
        : 0;

    totalScore += coursesScore;

    // Skills
    const matchedSkills = applicant.skills.reduce(
      (count, skill) => count + (recruitmentSkillsSet.has(skill) ? 1 : 0),
      0
    );

    const totalRecruitmentSkills = recruitmentSkillsSet.size;
    const weightOfSkills = recruitmentData.weightOfSkills || 0;

    const skillsScore =
      totalRecruitmentSkills > 0
        ? (matchedSkills / totalRecruitmentSkills) * weightOfSkills
        : 0;

    totalScore += skillsScore;

    // Languages
    const matchedLanguagesScore = applicant.languages.reduce(
      (totalLanguageScore, appLang) => {
        const reqLang = recruitmentData.languages.find(
          (reqLang) => reqLang.language === appLang.language
        );

        if (reqLang) {
          const applicantLevel = levelOrder[appLang.level];
          const requiredLevel = levelOrder[reqLang.level];

          let languageScore = 0;
          if (applicantLevel >= requiredLevel) {
            languageScore = 1; // Full score for matching or exceeding required level
          } else {
            languageScore = applicantLevel / requiredLevel; // Proportional score for lower level
          }

          return totalLanguageScore + languageScore;
        }

        return totalLanguageScore; // No score if language is not matched
      },
      0
    );

    const totalRecruitmentLanguages = recruitmentData.languages?.length || 0;
    const weightOfLanguages = recruitmentData.weightOfLanguages || 0;

    const languagesScore =
      totalRecruitmentLanguages > 0
        ? (matchedLanguagesScore / totalRecruitmentLanguages) *
          weightOfLanguages
        : 0;

    totalScore += languagesScore;

    // Experience
    const applicantExperience = parseFloat(applicant.experience || "0");
    const requiredExperience = parseFloat(
      recruitmentData.experienceNeeded || "0"
    );
    const weightOfExperience = parseFloat(
      recruitmentData.weightOfExperience || "0"
    );

    let experienceScore = 0;

    if (requiredExperience > 0) {
      if (applicantExperience >= requiredExperience) {
        experienceScore = weightOfExperience;
      } else if (applicantExperience > 0) {
        experienceScore =
          (applicantExperience / requiredExperience) * weightOfExperience;
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

      const applicantEducationLevelValue =
        levelOrder[applicantEducationLevel] || 0; // Default to 0 if level is not found
      const requiredEducationLevelValue =
        levelOrder[requiredEducationLevel] || 0; // Default to 0 if level is not found

      if (applicantEducationLevelValue >= requiredEducationLevelValue) {
        educationScore = 1; // Full score if education level is sufficient or higher
      } else if (requiredEducationLevelValue > 0) {
        educationScore =
          applicantEducationLevelValue / requiredEducationLevelValue; // Proportional score if lower
      }

      educationScore *= recruitmentData.weightOfEducationLevel || 0; // Ensure weight is a valid number
    }

    totalScore += educationScore;

    // Return the individual scores for each category along with the final score
    return {
      ...applicant,
      CVscore: parseFloat(totalScore.toFixed(2)),
      stage: applicant.stage || "To be checked",
      CVscores: {
        courses:
          parseFloat(
            ((coursesScore * 100) / recruitmentData.weightOfCourses).toFixed(2)
          ) || 0,
        skills:
          parseFloat(
            ((skillsScore * 100) / recruitmentData.weightOfSkills).toFixed(2)
          ) || 0,
        languages:
          parseFloat(
            (
              (languagesScore * 100) /
              recruitmentData.weightOfLanguages
            ).toFixed(2)
          ) || 0,
        experience:
          parseFloat(
            (
              (experienceScore * 100) /
              recruitmentData.weightOfExperience
            ).toFixed(2)
          ) || 0,
        education:
          parseFloat(
            (
              (educationScore * 100) /
              recruitmentData.weightOfEducationLevel
            ).toFixed(2)
          ) || 0,
      },
    };
  };
  // Map applicants and calculate scores
  const applicantsWithScores = await Promise.all(
    applicants.map(calculateScore)
  );

  // Sort applicants by score in descending order
  const rankedApplicants = applicantsWithScores.sort(
    (a, b) => b.CVscore - a.CVscore
  );

  return rankedApplicants;
};

// 11.**change applicant stage
export const changeApplicantStage = async (
  recruitmentId,
  applicantId,
  newStage
) => {
  try {
    await checkAuth();
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();

    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error("You are not authorized to change applicant stage");
      }
    }

    const updatedApplicants = recruitmentData.Applicants.map((applicant) => {
      if (String(applicant.id) === String(applicantId)) {
        return { ...applicant, stage: newStage };
      }
      return applicant;
    });

    await updateDoc(recruitmentDoc, { Applicants: updatedApplicants });

    return { message: "Applicant stage updated successfully" };
  } catch (error) {
    console.error("Error changing applicant stage:", error.message);
    throw error;
  }
};

// 12.**add meetings**
export const addMeetings = async (recruitmentId, meetingsData) => {
  try {
    await checkAuth(); // Sprawdzenie uwierzytelnienia użytkownika
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();
    const meetingSessions = recruitmentData.MeetingSessions || [];
    const applicants = recruitmentData.Applicants || [];

    // **Zapewnij, że meetingsData jest tablicą**
    const meetingsArray = Array.isArray(meetingsData)
      ? meetingsData
      : [meetingsData];

    // **Przetwarzanie wszystkich spotkań**
    for (const meetingData of meetingsArray) {
      // Zakładając, że meetingData zawiera tablicę meetings
      const meetings = meetingData.meetings || [];
      for (const singleMeeting of meetings) {
        // **Sprawdzenie, czy singleMeeting ma poprawną strukturę**
        if (!singleMeeting || typeof singleMeeting !== "object") {
          console.error(
            "singleMeeting is undefined or not an object!",
            singleMeeting
          );
          return;
        }

        let IsSessionChanged = "";

        if (singleMeeting.previousSessionId) {
          IsSessionChanged =
            singleMeeting.meetingSessionId !== singleMeeting.previousSessionId;
        } else {
          IsSessionChanged = false;
        }

        // **Sprawdzanie, czy sessionId jest dostępne w singleMeeting**
        const sessionId = Number(singleMeeting.meetingSessionId);

        const sessionIndex = meetingSessions.findIndex(
          (session) => Number(session.id) === sessionId
        );

        if (sessionIndex === -1) {
          console.warn(`Meeting session with ID ${sessionId} not found.`);
          return;
        }

        // **Dodaj spotkanie do sesji**
        const session = meetingSessions[sessionIndex];
        const currentMeetings = session.meetings || [];

        if (IsSessionChanged) {
          const PreviousSessionId = Number(singleMeeting.previousSessionId);

          const PreviousSessionIndex = meetingSessions.findIndex(
            (session) => Number(session.id) === PreviousSessionId
          );

          const oldSession = meetingSessions[PreviousSessionIndex];
          const oldMeetings = oldSession.meetings || [];
          const indexToRemove = oldMeetings.findIndex(
            (meeting) => meeting.id === singleMeeting.id
          );

          const previousApplicant = oldMeetings[indexToRemove].applicantId;
          const previousApplicantIndex = applicants.findIndex(
            (applicant) => String(applicant.id) === String(previousApplicant)
          );

          if (previousApplicantIndex !== -1) {
            sendEmail(
              "REMOVE",
              "MEETING",
              applicants[previousApplicantIndex],
              recruitmentData.name,
              oldSession.meetingSessionName,
              oldSession.meetingSessionDescription,
              singleMeeting
            );
            const meetingCount = await countApplicantMeetings(
              previousApplicant,
              recruitmentId
            );
            if (meetingCount <= 0) {
              const taskCount = await countApplicantTasks(
                previousApplicant,
                recruitmentId
              );
              if (taskCount <= -1) {
                applicants[previousApplicantIndex].stage = "Checked";
              } else {
                applicants[previousApplicantIndex].stage = "Tasks";
              }
            }
          }

          if (indexToRemove !== -1) {
            oldMeetings.splice(indexToRemove, 1);
          }

          meetingSessions[PreviousSessionIndex].meetings = oldMeetings;

          const maxId = currentMeetings.reduce(
            (max, meeting) => Math.max(max, meeting.id || 0),
            0
          );
          singleMeeting.id = maxId + 1;

          currentMeetings.push(singleMeeting);
        } else {
          if (!singleMeeting.id) {
            const maxId = currentMeetings.reduce(
              (max, meeting) => Math.max(max, meeting.id || 0),
              0
            );
            singleMeeting.id = maxId + 1;
          }
          // **Aktualizacja lub dodanie spotkania**
          const existingMeetingIndex = currentMeetings.findIndex(
            (meeting) => String(meeting.id) === String(singleMeeting.id)
          );

          if (existingMeetingIndex !== -1) {
            const previousApplicant =
              currentMeetings[existingMeetingIndex].applicantId;
            const previousApplicantIndex = applicants.findIndex(
              (applicant) => String(applicant.id) === String(previousApplicant)
            );
            console.log("previousApplicantIndex", previousApplicantIndex);
            if (previousApplicantIndex !== -1) {
              sendEmail(
                "REMOVE",
                "MEETING",
                applicants[previousApplicantIndex],
                recruitmentData.name,
                session.meetingSessionName,
                session.meetingSessionDescription,
                singleMeeting
              );
              const meetingCount = await countApplicantMeetings(
                previousApplicant,
                recruitmentId
              );
              if (meetingCount <= 0) {
                const taskCount = await countApplicantTasks(
                  previousApplicant,
                  recruitmentId
                );
                if (taskCount <= -1) {
                  applicants[previousApplicantIndex].stage = "Checked";
                } else {
                  applicants[previousApplicantIndex].stage = "Tasks";
                }
              }
            }

            currentMeetings[existingMeetingIndex] = {
              ...currentMeetings[existingMeetingIndex],
              ...singleMeeting,
            };
          } else {
            currentMeetings.push(singleMeeting);
          }
        }

        const applicantId = Number(singleMeeting.applicantId); // Przekształć applicantId na liczbę

        // **Aktualizacja etapu aplikanta**
        const applicantIndex = applicants.findIndex(
          (applicant) => applicant.id === applicantId
        );
        if (applicantIndex !== -1) {
          if (applicants[applicantIndex].userUid) {
            await updateUserStat(
              applicants[applicantIndex].userUid,
              "AllTimeMeetingsCount",
              "increment"
            );
          }

          applicants[applicantIndex].stage = "Invited for interview";
          sendEmail(
            "ADD",
            "MEETING",
            applicants[applicantIndex],
            recruitmentData.name,
            session.meetingSessionName,
            session.meetingSessionDescription,
            singleMeeting
          );
        }
      }
    }

    // **Zapisz zmiany w Firestore**
    await updateDoc(recruitmentDoc, {
      MeetingSessions: meetingSessions,
      Applicants: applicants,
    });
    console.log("Meetings and applicants updated successfully!");
  } catch (error) {
    console.error("Error adding or updating meeting:", error.message);
    throw error;
  }
};

// 13.**delete meeting by ID**
export const deleteMeeting = async (id, meetingSessionId, meetingId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, "recruitments", id);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();
    const applicants = recruitmentData.Applicants || [];
    const meetingSessionIndex = recruitmentData.MeetingSessions.findIndex(
      (meetingSession) => String(meetingSession.id) === String(meetingSessionId)
    );
    if (meetingSessionIndex === -1) {
      throw new Error("Meeting session not found");
    }

    const meetingIndex = recruitmentData.MeetingSessions[
      meetingSessionIndex
    ].meetings.findIndex((meeting) => String(meeting.id) === String(meetingId));
    if (meetingIndex === -1) {
      throw new Error("Meeting not found");
    }

    const session = recruitmentData.MeetingSessions[meetingSessionIndex];
    const singleMeeting = session.meetings[meetingIndex];
    const applicantId = Number(
      recruitmentData.MeetingSessions[meetingSessionIndex].meetings[
        meetingIndex
      ].applicantId
    ); // Przekształć applicantId na liczbę

    // **Aktualizacja etapu aplikanta**
    const applicantIndex = applicants.findIndex(
      (applicant) => applicant.id === applicantId
    );
    if (applicantIndex !== -1) {
      sendEmail(
        "REMOVE",
        "MEETING",
        applicants[applicantIndex],
        recruitmentData.name,
        session.meetingSessionName,
        session.meetingSessionDescription,
        singleMeeting
      );
      const meetingCount = await countApplicantMeetings(applicantId, id);
      if (meetingCount <= 0) {
        const taskCount = await countApplicantTasks(applicantId, id);
        if (taskCount <= -1) {
          applicants[applicantIndex].stage = "Checked";
        } else {
          applicants[applicantIndex].stage = "Tasks";
        }
      }
    }

    recruitmentData.MeetingSessions[meetingSessionIndex].meetings.splice(
      meetingIndex,
      1
    );
    await updateDoc(recruitmentDoc, {
      MeetingSessions: recruitmentData.MeetingSessions,
      Applicants: applicants,
    });
    return recruitmentData.MeetingSessions[meetingSessionIndex].meetings;
  } catch (error) {
    console.error("Error deleting meeting:", error.message);
    throw error;
  }
};

// 14.**get meeting by ID**
export const getMeetingById = async (recruitmentId, meetingId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();

    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error("You are not authorized to view this recruitment");
      }
    }

    const meetingSessions = recruitmentData.MeetingSessions || [];

    // Find the session and the meeting within the session
    for (let session of meetingSessions) {
      const meeting = session.meetings?.find(
        (meeting) => meeting.id === meetingId
      );

      if (meeting) {
        return {
          id: recruitmentSnapshot.id,
          ...recruitmentData,
          meetingSessionId: session.id,
          meetingData: meeting,
        };
      }
    }

    throw new Error("Meeting not found");
  } catch (error) {
    console.error("Error fetching meeting by ID:", error.message);
    throw error;
  }
};

// 15 **get applicants by stage **
export const getApplicantsByStage = async (recruitmentId, stages) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();

    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error("You are not authorized to view this recruitment");
      }
    }

    const applicants = recruitmentData.Applicants || [];

    // Filter applicants by stages ['checked','interviewed', 'offer' etc]
    const applicantsByStage = applicants.filter((applicant) =>
      stages.includes(applicant.stage)
    );

    return applicantsByStage;
  } catch (error) {
    console.error("Error fetching applicants by stage:", error.message);
    throw error;
  }
};

// 16.**create meeting session
export const createMeetingSession = async (
  recruitmentId,
  meetingSessionData
) => {
  try {
    await checkAuth(); // Ensure the user is authenticated
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();

    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error("You are not authorized to create meeting session");
      }
    }

    // Update the meetings list: check if the meeting with the same ID already exists
    const currentMeetings = recruitmentData.MeetingSessions || [];

    // Sprawdź, czy `meetingData.id` istnieje
    if (!meetingSessionData.id) {
      // Znajdź największe istniejące ID w currentMeetings
      const maxId = currentMeetings.reduce(
        (max, meeting) => Math.max(max, meeting.id || 0),
        0
      );
      meetingSessionData.id = maxId + 1; // Ustaw nowe ID jako o 1 większe niż największe
    }

    if (!meetingSessionData.meetings) {
      meetingSessionData.meetings = [];
    }

    // Znajdź indeks spotkania o takim samym ID
    const meetingIndex = currentMeetings.findIndex(
      (meetingsession) => meetingsession.id === meetingSessionData.id
    );

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
    } else {
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
    console.error("Error adding or updating meeting session:", error.message);
    throw error;
  }
};

// 17.**delete meeting session by ID**
export const deleteMeetingSession = async (recruitmentId, meetingSessionId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();
    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error(
          "You are not authorized to delete meeting session from this recruitment"
        );
      }
    }

    const meetingSessionIndex = recruitmentData.MeetingSessions.findIndex(
      (meetingSession) => meetingSession.id === meetingSessionId
    );

    if (meetingSessionIndex === -1) {
      throw new Error("Meeting session not found");
    }

    const CurrentMeetingSession =
      recruitmentData.MeetingSessions[meetingSessionIndex];

    //delete meetings
    for (const meeting of CurrentMeetingSession.meetings) {
      await deleteMeeting(recruitmentId, meeting.meetingSessionId, meeting.id);
    }

    const updatedMeetingSessions = recruitmentData.MeetingSessions.filter(
      (meetingSession) => meetingSession.id !== meetingSessionId
    );

    await updateDoc(recruitmentDoc, {
      MeetingSessions: updatedMeetingSessions,
    });
  } catch (error) {
    console.error("Error deleting meeting session:", error.message);
  }
};

// 18.**get meeting session by ID**
export const getMeetingSessionById = async (
  recruitmentId,
  meetingSessionId
) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();

    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error("You are not authorized to view this recruitment");
      }
    }

    const meetingIndex = recruitmentData.MeetingSessions.findIndex(
      (meetingSession) => meetingSession.id === meetingSessionId
    );

    if (meetingIndex === -1) {
      throw new Error("Meeting session not found");
    }

    return {
      MeetingSessions: recruitmentData.MeetingSessions[meetingIndex],
    };
  } catch (error) {
    console.error("Error fetching meeting session by ID:", error.message);
    throw error;
  }
};

// 19.**get meeting sessions by recruitment ID**
export const getMeetingSessionsByRecruitmentId = async (recruitmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }
    const recruitmentData = recruitmentSnapshot.data();
    const meetingSessions = recruitmentData.MeetingSessions || [];
    return meetingSessions;
  } catch (error) {
    console.error(
      "Error fetching meeting sessions by recruitment ID:",
      error.message
    );
    throw error;
  }
};

// 20 **get meeting sessions for current user**
export const getUserMeetingSessions = async () => {
  try {
    // Ensure the user is authenticated
    const user = await checkAuth();

    if (!user?.uid) {
      throw new Error("User ID is undefined.");
    }

    const userId = user.uid;

    // Fetch recruitments that the user has applied to
    const recruitmentCollection = collection(db, "recruitments");
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
              const applicant = applicants.find(
                (app) => String(app.id) === String(meeting.applicantId)
              );

              return {
                ...meeting,
                meetingApplicant: applicant || null, // Dodajemy dane aplikanta, jeśli znaleziono
              };
            }),
          });
        });
      } else {
        const applicants = recruitmentData.Applicants || [];

        // Find the applicant data for the current user
        const applicant = applicants.find(
          (applicant) => applicant.userUid === userId
        );

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
    console.error("Error fetching user meeting sessions:", error.message);
    throw error;
  }
};

export const getApplicantsWithOverallScore = async (recruitmentId) => {
  try {
    await checkAuth(); // 🔐 Sprawdzenie autoryzacji

    const recruitmentRef = doc(db, "recruitments", recruitmentId);

    // 📌 Pobieramy dokumenty jednocześnie, aby było szybciej
    const [recruitmentSnapshot, maxPoints] = await Promise.all([
      getDoc(recruitmentRef),
      getMaxPoints(recruitmentId),
    ]);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    // Pobranie listy aplikantów z rankingiem
    const applicants = await getApplicantsRanking(recruitmentId);

    // 🔄 Mapujemy aplikantów równocześnie
    const applicantsWithOverallScore = await Promise.all(
      applicants.map(async (applicant) => {
        const Scores = await getApplicantScore(recruitmentId, applicant.id);

        return {
          id: applicant.id,
          stage: applicant.stage,
          name: applicant.name,
          surname: applicant.surname,
          email: applicant.email,
          CVscore: applicant.CVscore || 0,
          CLscore: applicant.CLscore || 0,
          Tasksscore:
            maxPoints.tasksPointsWeight > 0
              ? (Scores.Tasksscore / maxPoints.tasksPointsWeight) * 100
              : 0,
          Meetingsscore:
            maxPoints.meetingsPointsWeight > 0
              ? (Scores.Meetingsscore / maxPoints.meetingsPointsWeight) * 100
              : 0,
          adnationalPoints: applicant.adnationalPoints || 0,
          coverLetterFileUrls: applicant.coverLetterFileUrls || [],
        };
      })
    );

    return applicantsWithOverallScore;
  } catch (error) {
    console.error("Error fetching applicants overall score:", error.message);
    throw error;
  }
};

//21.1 ** get max points for meetings and tasks
export const getMaxPoints = async (recruitmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitment = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitment);
    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }
    const recruitmentData = recruitmentSnapshot.data();
    const meetings = recruitmentData.MeetingSessions || [];
    const tasks = recruitmentData.TaskSessions || [];

    //sum meetings.meetingSessionPointsWeight
    let meetingsPointsWeight = 0;
    meetings.forEach((meeting) => {
      meetingsPointsWeight += parseFloat(meeting.meetingSessionPointsWeight);
    });

    //sum tasks.taskSessionPointsWeight
    let tasksPointsWeight = 0;
    tasks.forEach((task) => {
      tasksPointsWeight += parseFloat(task.taskSessionPointsWeight);
    });

    return { meetingsPointsWeight, tasksPointsWeight };
  } catch (error) {
    console.error("Error fetching max points:", error.message);
    throw error;
  }
};

//21.2 **get applicant score for meetings and tasks**
export const getApplicantScore = async (recruitmentId, applicantId) => {
  try {
    await checkAuth(); // Upewnij się, że użytkownik jest zalogowany
    const recruitmentRef = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentRef);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();

    const meetingSessions = recruitmentData.MeetingSessions || [];
    const taskSessions = recruitmentData.TaskSessions || [];

    let Meetingsscore = 0;
    let Tasksscore = 0;

    meetingSessions.forEach((session) => {
      (session.meetings || []).forEach((meeting) => {
        if (
          meeting.applicantId &&
          String(meeting.applicantId) === String(applicantId)
        ) {
          Meetingsscore +=
            parseFloat(session.meetingSessionPointsWeight) *
              (meeting.points * 0.01) || 0;
        }
      });
    });

    taskSessions.forEach((session) => {
      (session.tasks || []).forEach((task) => {
        if (
          task.applicantId &&
          String(task.applicantId) === String(applicantId)
        ) {
          Tasksscore +=
            parseFloat(session.taskSessionPointsWeight) *
              (task.points * 0.01) || 0;
        }
      });
    });

    return { Meetingsscore, Tasksscore };
  } catch (error) {
    console.error("Error fetching applicant score:", error.message);
    throw error;
  }
};

//21.3 **change count status**
export const changeCountStatus = async (recruitmentId, field) => {
  try {
    await checkAuth(); // Sprawdzenie autoryzacji
    const recruitmentRef = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentRef);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();

    // Jeśli pole nie istnieje, ustaw domyślnie na false
    const currentValue = recruitmentData[field] ?? true;
    const updatedValue = !currentValue; // Odwracamy wartość

    // Aktualizacja tylko jednego pola w Firestore
    await updateDoc(recruitmentRef, { [field]: updatedValue });

    return updatedValue; // Zwracamy nową wartość
  } catch (error) {
    console.error("Error updating count status:", error.message);
    throw error;
  }
};

//21.4 **get count status**
export const getCountStatus = async (recruitmentId) => {
  try {
    await checkAuth(); // Upewnij się, że użytkownik jest zalogowany
    const recruitmentRef = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentRef);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }
    const recruitmentData = recruitmentSnapshot.data();
    return {
      ClCountStatus: recruitmentData.ClCountStatus ?? true,
      CvCountStatus: recruitmentData.CvCountStatus ?? true,
      TasksCountStatus: recruitmentData.TasksCountStatus ?? true,
      MeetingsCountStatus: recruitmentData.MeetingsCountStatus ?? true,
      AdnationalPointsCountStatus:
        recruitmentData.AdnationalPointsCountStatus ?? true,
    };
  } catch (error) {
    console.error("Error fetching count status:", error.message);
    throw error;
  }
};

// 22.**get applicant name ,surname, email, overall score by ID**

export const getAllApplicants = async (recruitmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const isAdmin = GetIsAdmin();
    const recruitment = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitment);
    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }
    const recruitmentData = recruitmentSnapshot.data();

    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error("You are not authorized to view this recruitment");
      }
    }

    const applicants = recruitmentData.Applicants || [];

    if (applicants) {
      return applicants;
    }

    throw new Error("Applicant not found");
  } catch (error) {
    console.error("Error fetching applicant confidential data:", error.message);
    throw error;
  }
};

// 23.**update meeting points**
export const updateMeetingPoints = async (
  id,
  meetingSessionId,
  meetingId,
  updatedValue
) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, "recruitments", id);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);
    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }
    const recruitmentData = recruitmentSnapshot.data();
    const meetingSessionIndex = recruitmentData.MeetingSessions.findIndex(
      (meetingSession) => meetingSession.id === meetingSessionId
    );
    if (meetingSessionIndex === -1) {
      throw new Error("Meeting session not found");
    }
    const meetingIndex = recruitmentData.MeetingSessions[
      meetingSessionIndex
    ].meetings.findIndex((meeting) => meeting.id === meetingId);
    if (meetingIndex === -1) {
      throw new Error("Meeting not found");
    }

    recruitmentData.MeetingSessions[meetingSessionIndex].meetings[
      meetingIndex
    ].points = updatedValue;

    const applicantId =
      recruitmentData.MeetingSessions[meetingSessionIndex].meetings[
        meetingIndex
      ].applicantId;
    await changeApplicantStage(id, applicantId, "Interviewed");

    await updateDoc(recruitmentDoc, {
      MeetingSessions: recruitmentData.MeetingSessions,
    });
  } catch (error) {
    console.error("Error updating meeting points:", error.message);
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
      const applicant = applicants.find(
        (applicant) => String(applicant.userUid) === String(userUid)
      );

      if (applicant) {
        // Find the meetings for the current user
        meetingSessions.forEach((session) => {
          const userMeetingsInSession = session.meetings.filter(
            (meeting) => String(meeting.applicantId) === String(applicant.id)
          );

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
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);
    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
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
    console.error("Error counting applicant meetings:", error.message);
    throw error;
  }
};

// 26.**create tasks session**
export const createTaskSession = async (recruitmentId, taskSessionData) => {
  try {
    await checkAuth(); // Ensure the user is authenticated
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();

    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error("You are not authorized to create task session");
      }
    }

    // Update the tasks list: check if the task with the same ID already exists
    const currentTasks = recruitmentData.TaskSessions || [];

    // Sprawdź, czy `taskData.id` istnieje
    if (!taskSessionData.id) {
      // Znajdź największe istniejące ID w currentTasks
      const maxId = currentTasks.reduce(
        (max, task) => Math.max(max, task.id || 0),
        0
      );
      taskSessionData.id = maxId + 1; // Ustaw nowe ID jako o 1 większe niż największe
    }

    if (!taskSessionData.tasks) {
      taskSessionData.tasks = [];
    }

    const taskIndex = currentTasks.findIndex(
      (tasksession) => tasksession.id === taskSessionData.id
    );

    if (taskIndex !== -1) {
      // Task exists, update their information and replace their files
      const updatedTasks = currentTasks.map((taskSession, index) => {
        if (index === taskIndex) {
          return {
            ...taskSession,
            ...taskSessionData,
          };
        }
        return taskSession;
      });
      await updateDoc(recruitmentDoc, { TaskSessions: updatedTasks });
    } else {
      // New task, add to the list
      const updatedTasks = [
        ...currentTasks,
        {
          ...taskSessionData,
        },
      ];

      await updateDoc(recruitmentDoc, { TaskSessions: updatedTasks });
    }
  } catch (error) {
    console.error("Error adding or updating task session:", error.message);
    throw error;
  }
};

// 27.**delete task session by ID**
export const deleteTaskSession = async (recruitmentId, taskSessionId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();
    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error(
          "You are not authorized to delete task session from this recruitment"
        );
      }
    }

    const taskSessionIndex = recruitmentData.TaskSessions.findIndex(
      (taskSession) => taskSession.id === taskSessionId
    );

    if (taskSessionIndex === -1) {
      throw new Error("Task session not found");
    }

    //update applicants stage
    const CurrentTaskSession = recruitmentData.TaskSessions[taskSessionIndex];

    //delete tasks
    for (const task of CurrentTaskSession.tasks) {
      await deleteTask(recruitmentId, task.taskSessionId, task.id);
    }

    const updatedTaskSessions = recruitmentData.TaskSessions.filter(
      (taskSession) => taskSession.id !== taskSessionId
    );

    await updateDoc(recruitmentDoc, { TaskSessions: updatedTaskSessions });
  } catch (error) {
    console.error("Error deleting task session:", error.message);
  }
};

// 28.**add tasks**
export const addTasks = async (recruitmentId, tasksData) => {
  try {
    await checkAuth(); // Sprawdzenie uwierzytelnienia użytkownika
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();
    const taskSessions = recruitmentData.TaskSessions || [];
    const applicants = recruitmentData.Applicants || [];

    // **Zapewnij, że tasksData jest tablicą**
    const tasksArray = Array.isArray(tasksData) ? tasksData : [tasksData];

    // **Przetwarzanie wszystkich spotkań**
    for (const taskData of tasksArray) {
      // Zakładając, że taskData zawiera tablicę tasks
      const tasks = taskData.tasks || [];
      for (const singleTask of tasks) {
        // **Sprawdzenie, czy singleMeeting ma poprawną strukturę**
        if (!singleTask || typeof singleTask !== "object") {
          console.error(
            "singleMeeting is undefined or not an object!",
            singleTask
          );
          return;
        }

        let IsSessionChanged = "";

        if (singleTask.previousSessionId) {
          IsSessionChanged =
            singleTask.taskSessionId !== singleTask.previousSessionId;
        } else {
          IsSessionChanged = false;
        }

        // **Sprawdzanie, czy sessionId jest dostępne w singleMeeting**
        const sessionId = Number(singleTask.taskSessionId);

        const sessionIndex = taskSessions.findIndex(
          (session) => Number(session.id) === sessionId
        );

        if (sessionIndex === -1) {
          console.warn(`Meeting session with ID ${sessionId} not found.`);
          return;
        }

        // **Dodaj spotkanie do sesji**
        const session = taskSessions[sessionIndex];
        const currentTasks = session.tasks || [];

        if (IsSessionChanged) {
          const PreviousSessionId = Number(singleTask.previousSessionId);

          const PreviousSessionIndex = taskSessions.findIndex(
            (session) => Number(session.id) === PreviousSessionId
          );

          const oldSession = taskSessions[PreviousSessionIndex];
          const oldTasks = oldSession.tasks || [];
          const indexToRemove = oldTasks.findIndex(
            (task) => task.id === singleTask.id
          );

          const previousApplicant = oldTasks[indexToRemove].applicantId;
          const previousApplicantIndex = applicants.findIndex(
            (applicant) => String(applicant.id) === String(previousApplicant)
          );

          if (previousApplicantIndex !== -1) {
            sendEmail(
              "REMOVE",
              "TASK",
              applicants[previousApplicantIndex],
              recruitmentData.name,
              oldSession.taskSessionName,
              oldSession.taskSessionDescription,
              singleTask
            );
            const taskCount = await countApplicantTasks(
              previousApplicant,
              recruitmentId
            );
            if (taskCount <= 0) {
              const meetingCount = await countApplicantMeetings(
                previousApplicant,
                recruitmentId
              );
              if (meetingCount <= -1) {
                applicants[previousApplicantIndex].stage = "Checked";
              } else {
                applicants[previousApplicantIndex].stage =
                  "Invited for interview";
              }
            }
          }

          if (indexToRemove !== -1) {
            oldTasks.splice(indexToRemove, 1);
          }

          taskSessions[PreviousSessionIndex].tasks = oldTasks;

          const maxId = currentTasks.reduce(
            (max, task) => Math.max(max, task.id || 0),
            0
          );
          singleTask.id = maxId + 1;

          currentTasks.push(singleTask);
        } else {
          if (!singleTask.id) {
            const maxId = currentTasks.reduce(
              (max, task) => Math.max(max, task.id || 0),
              0
            );
            singleTask.id = maxId + 1;
          }
          // **Aktualizacja lub dodanie spotkania**
          const existingTaskIndex = currentTasks.findIndex(
            (task) => String(task.id) === String(singleTask.id)
          );

          if (existingTaskIndex !== -1) {
            const previousApplicant =
              currentTasks[existingTaskIndex].applicantId;
            const previousApplicantIndex = applicants.findIndex(
              (applicant) => String(applicant.id) === String(previousApplicant)
            );

            if (previousApplicantIndex !== -1) {
              sendEmail(
                "REMOVE",
                "TASK",
                applicants[previousApplicantIndex],
                recruitmentData.name,
                session.taskSessionName,
                session.taskSessionDescription,
                singleTask
              );
              const taskCount = await countApplicantTasks(
                previousApplicant,
                recruitmentId
              );
              if (taskCount <= 0) {
                const meetingCount = await countApplicantMeetings(
                  previousApplicant,
                  recruitmentId
                );
                if (meetingCount <= -1) {
                  applicants[previousApplicantIndex].stage = "Checked";
                } else {
                  applicants[previousApplicantIndex].stage =
                    "Invited for interview";
                }
              }
            }

            currentTasks[existingTaskIndex] = {
              ...currentTasks[existingTaskIndex],
              ...singleTask,
            };
          } else {
            currentTasks.push(singleTask);
          }
        }

        const applicantId = Number(singleTask.applicantId); // Przekształć applicantId na liczbę
        const DeadlineData = {
          taskSessionDeadlineDate: session.taskSessionDeadline,
          taskSessionDeadlineTime: session.taskSessionDeadlineTime,
        };
        // **Aktualizacja etapu aplikanta**
        const applicantIndex = applicants.findIndex(
          (applicant) => applicant.id === applicantId
        );
        if (applicantIndex !== -1) {
          applicants[applicantIndex].stage = "Tasks";
          sendEmail(
            "ADD",
            "TASK",
            applicants[applicantIndex],
            recruitmentData.name,
            session.taskSessionName,
            session.taskSessionDescription,
            DeadlineData
          );
        }
      }
    }

    // **Zapisz zmiany w Firestore**
    await updateDoc(recruitmentDoc, {
      TaskSessions: taskSessions,
      Applicants: applicants,
    });
    console.log("Tasks and applicants updated successfully!");
  } catch (error) {
    console.error("Error adding or updating task:", error.message);
    throw error;
  }
};

// 29.**delete task by ID**
export const deleteTask = async (id, taskSessionId, taskId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, "recruitments", id);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();
    const applicants = recruitmentData.Applicants || [];
    const TaskSessionIndex = recruitmentData.TaskSessions.findIndex(
      (taskSession) => String(taskSession.id) === String(taskSessionId)
    );
    if (TaskSessionIndex === -1) {
      throw new Error("Task session not found");
    }

    const TaskIndex = recruitmentData.TaskSessions[
      TaskSessionIndex
    ].tasks.findIndex((task) => String(task.id) === String(taskId));
    if (TaskIndex === -1) {
      throw new Error("Task not found");
    }

    const session = recruitmentData.TaskSessions[TaskSessionIndex];
    const singleTask = session.tasks[TaskIndex];
    const applicantId = Number(
      recruitmentData.TaskSessions[TaskSessionIndex].tasks[TaskIndex]
        .applicantId
    ); // Przekształć applicantId na liczbę

    // **Aktualizacja etapu aplikanta**
    const applicantIndex = applicants.findIndex(
      (applicant) => applicant.id === applicantId
    );
    if (applicantIndex !== -1) {
      sendEmail(
        "REMOVE",
        "TASK",
        applicants[applicantIndex],
        recruitmentData.name,
        session.taskSessionName,
        session.taskSessionDescription,
        singleTask
      );
      const taskCount = await countApplicantTasks(applicantId, id);
      if (taskCount <= 0) {
        const meetingCount = await countApplicantMeetings(applicantId, id);
        if (meetingCount <= -1) {
          applicants[applicantIndex].stage = "Checked";
        } else {
          applicants[applicantIndex].stage = "Invited for interview";
        }
      }
    }

    recruitmentData.TaskSessions[TaskSessionIndex].tasks.splice(TaskIndex, 1);
    await updateDoc(recruitmentDoc, {
      TaskSessions: recruitmentData.TaskSessions,
      Applicants: applicants,
    });
    return recruitmentData.TaskSessions[TaskSessionIndex].tasks;
  } catch (error) {
    console.error("Error deleting task:", error.message);
    throw error;
  }
};

// 30.**get task by ID**
export const getTaskById = async (recruitmentId, taskId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();

    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error("You are not authorized to view this recruitment");
      }
    }

    const taskSessions = recruitmentData.TaskSessions || [];

    // Find the session and the task within the session
    for (let session of taskSessions) {
      const task = session.tasks?.find((task) => task.id === taskId);

      if (task) {
        return {
          id: recruitmentSnapshot.id,
          ...recruitmentData,
          taskSessionId: session.id,
          taskData: task,
        };
      }
    }

    throw new Error("Task not found");
  } catch (error) {
    console.error("Error fetching task by ID:", error.message);
    throw error;
  }
};

// 31.**count tasks by user ID**
export const countApplicantTasks = async (userId, recruitmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);
    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }
    const recruitmentData = recruitmentSnapshot.data();
    const taskSessions = recruitmentData.TaskSessions || [];
    let taskCount = -1;
    taskSessions.forEach((session) => {
      session.tasks.forEach((task) => {
        if (String(task.applicantId) === String(userId)) {
          taskCount++;
        }
      });
    });
    console.log(taskCount);
    return taskCount;
  } catch (error) {
    console.error("Error counting applicant tasks:", error.message);
    throw error;
  }
};

// 32.**get tasks session by recruitment ID**
export const getTasksSessionsByRecruitmentId = async (recruitmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();

    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error("You are not authorized to view this recruitment");
      }
    }

    const taskSessions = recruitmentData.TaskSessions || [];

    if (taskSessions) {
      return taskSessions;
    }

    throw new Error("Task session not found");
  } catch (error) {
    console.error("Error fetching task session by ID:", error.message);
    throw error;
  }
};

// 33.**get task session by ID**
export const getTaskSessionById = async (recruitmentId, taskSessionId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);
    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }
    const recruitmentData = recruitmentSnapshot.data();
    const taskSessionIndex = recruitmentData.TaskSessions.findIndex(
      (taskSession) => taskSession.id === taskSessionId
    );
    if (taskSessionIndex === -1) {
      throw new Error("Task session not found");
    }
    return {
      TaskSessions: recruitmentData.TaskSessions[taskSessionIndex],
    };
  } catch (error) {
    console.error("Error fetching task session by ID:", error.message);
    throw error;
  }
};

// 32.**update task points**
export const updateTaskPoints = async (
  id,
  taskSessionId,
  taskId,
  updatedValue
) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, "recruitments", id);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();
    const taskSessionIndex = recruitmentData.TaskSessions.findIndex(
      (taskSession) => taskSession.id === taskSessionId
    );

    const taskIndex = recruitmentData.TaskSessions[
      taskSessionIndex
    ].tasks.findIndex((task) => task.id === taskId);
    console.log(taskIndex);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    recruitmentData.TaskSessions[taskSessionIndex].tasks[taskIndex].points =
      updatedValue;
    await updateDoc(recruitmentDoc, {
      TaskSessions: recruitmentData.TaskSessions,
    });
  } catch (error) {
    console.error("Error updating task points:", error.message);
    throw error;
  }
};

// 33. **set/update Adnational Points**
export const setAdnationalPoints = async (id, applicantId, updatedValue) => {
  try {
    const recruitmentDoc = doc(db, "recruitments", id);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);
    const recruitmentData = recruitmentSnapshot.data();
    console.log(recruitmentData);
    const applicantIndex = recruitmentData.Applicants.findIndex(
      (applicant) => applicant.id === applicantId
    );
    recruitmentData.Applicants[applicantIndex].adnationalPoints = updatedValue;
    await updateDoc(recruitmentDoc, {
      Applicants: recruitmentData.Applicants,
    });
  } catch (error) {
    console.error("Error updating adnational points:", error.message);
    throw error;
  }
};

const calculateTotalScore = (applicant, countStatus) => {
  if (!countStatus) return 0;

  const {
    AdnationalPointsCountStatus,
    ClCountStatus,
    CvCountStatus,
    MeetingsCountStatus,
    TasksCountStatus,
  } = countStatus;

  const Cvscore = CvCountStatus ? applicant.CVscore || 0 : 0;
  const CLscore = ClCountStatus ? applicant.CLscore || 0 : 0;
  const adnationalPoints = applicant.adnationalPoints || 0;
  const AddMeetingscore = MeetingsCountStatus
    ? applicant.Meetingsscore || 0
    : 0;
  const AddTasksscore = TasksCountStatus ? applicant.Tasksscore || 0 : 0;

  // Liczba aktywnych czynników
  const activeFactors = [
    ClCountStatus,
    CvCountStatus,
    MeetingsCountStatus,
    TasksCountStatus,
  ].filter(Boolean).length;
  const baseScore =
    activeFactors > 0
      ? (Cvscore + CLscore + AddTasksscore + AddMeetingscore) / activeFactors
      : 0;
  let totalScore = parseFloat(baseScore);

  // Dodatkowe punkty
  if (AdnationalPointsCountStatus) {
    totalScore += adnationalPoints * 0.2;
  }

  return totalScore;
};

//34.05 **get applicants with overall score**
export const getApplicantsWithTotalScores = async (recruitmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);
    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }
    const recruitmentData = recruitmentSnapshot.data();
    const applicants = await getApplicantsWithOverallScore(recruitmentId);

    const countStatus = {
      ClCountStatus: recruitmentData.ClCountStatus ?? true,
      CvCountStatus: recruitmentData.CvCountStatus ?? true,
      TasksCountStatus: recruitmentData.TasksCountStatus ?? true,
      MeetingsCountStatus: recruitmentData.MeetingsCountStatus ?? true,
      AdnationalPointsCountStatus:
        recruitmentData.AdnationalPointsCountStatus ?? true,
    };

    // Mapujemy aplikantów i liczymy `totalScore`
    const updatedApplicants = await Promise.all(
      applicants.map(async (applicant) => ({
        ...applicant,
        totalScore: await calculateTotalScore(applicant, countStatus),
      }))
    );
    const sortedApplicants = updatedApplicants.sort(
      (a, b) => b.totalScore - a.totalScore
    );
    return sortedApplicants;
  } catch (error) {
    console.error("Error fetching applicants overall score:", error);
    throw error;
  }
};

//34. **get recruitment stats**
export const getRecruitmentStats = async (recruitmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);
    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }
    const recruitmentData = recruitmentSnapshot.data();

    const updatedApplicants = await getApplicantsWithTotalScores(recruitmentId);

    const totalApplicants = updatedApplicants.length || 0;

    const highestTotalScore = updatedApplicants.reduce((max, applicant) => {
      return applicant.totalScore > max ? applicant.totalScore : max;
    }, 0);

    const averageTotalScore =
      updatedApplicants.length > 0
        ? (() => {
            const totalScore = updatedApplicants.reduce((total, applicant) => {
              const score = applicant.totalScore ?? 0;
              return total + score;
            }, 0);

            if (totalScore === 0 || updatedApplicants.length === 0) return 0;
            return totalScore / updatedApplicants.length;
          })()
        : 0;

    const ApplicantsInEachStage = updatedApplicants.reduce((acc, applicant) => {
      const stage = applicant.stage || "To be checked";
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {});

    let totalMeetings = 0;
    if (recruitmentData.MeetingSessions) {
      totalMeetings = recruitmentData.MeetingSessions.length;
    }

    let totalTasks = 0;
    if (recruitmentData.TaskSessions) {
      totalTasks = recruitmentData.TaskSessions.length;
    }

    const CurrentStage = recruitmentData.stage || "Collecting applicants";

    //count where coverLetterFileUrls is not empty
    const TotalCoverLetters = updatedApplicants.reduce((total, applicant) => {
      if (applicant.coverLetterFileUrls.length > 0) {
        return total + 1;
      }
      return total;
    }, 0);

    const TotalCoverLettersPercentage =
      updatedApplicants.length > 0
        ? (TotalCoverLetters / updatedApplicants.length) * 100
        : 0;

    return {
      totalApplicants,
      highestTotalScore,
      totalMeetings,
      totalTasks,
      averageTotalScore,
      ApplicantsInEachStage,
      CurrentStage,
      TotalCoverLettersPercentage,
    };
  } catch (error) {
    console.error("Error fetching recruitment stats:", error.message);
    throw error;
  }
};

//35 **set/update cover letter points**
export const setCoverLetterPoints = async (id, applicantId, updatedValue) => {
  try {
    await checkAuth(); // Ensure the user is authenticated
    const recruitmentDoc = doc(db, "recruitments", id);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);
    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }
    const recruitmentData = recruitmentSnapshot.data();
    const applicantIndex = recruitmentData.Applicants.findIndex(
      (applicant) => applicant.id === applicantId
    );
    recruitmentData.Applicants[applicantIndex].CLscore = updatedValue;
    await updateDoc(recruitmentDoc, {
      Applicants: recruitmentData.Applicants,
    });
  } catch (error) {
    console.error("Error updating cover letter points:", error.message);
    throw error;
  }
};

//36 **set/update recruitment stage**
export const changeRecruitmentStage = async (id, newStage) => {
  try {
    await checkAuth(); // Ensure the user is authenticated
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", id);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();

    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error("You are not authorized to change recruitment stage");
      }
    }

    recruitmentData.stage = newStage;

    await updateDoc(recruitmentDoc, {
      stage: newStage,
    });
  } catch (error) {
    console.error("Error changing recruitment stage:", error.message);
    throw error;
  }
};

//37 **get user stats**
export const getUserStats = async () => {
  try {
    const userId = firebaseAuth.currentUser.uid;
    const userStatsCollection = collection(db, "userStats");
    const q = query(userStatsCollection, where("id", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null; // Jeśli nie ma rekordu, nie tworzymy nowego
    }

    const userStatsData = querySnapshot.docs[0].data();
    return { id: querySnapshot.docs[0].id, ...userStatsData };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return null;
  }
};

// 38 **create user stats**
export const createUserStats = async (userId) => {
  try {
    const userStatsCollection = collection(db, "userStats");
    const newDocRef = doc(userStatsCollection); // Losowe ID

    const newStats = {
      id: userId,
      AllTimeMeetingsCount: 0,
      AllTimeRecruitmentsCount: 0,
      AllTimeApplicationsCount: 0,
      AllTimeApplicationRejected: 0,
      AllTimeApplicationHired: 0,
      AllTimeHiredApplicants: 0,
    };

    await setDoc(newDocRef, newStats);
    return { id: newDocRef.id, ...newStats };
  } catch (error) {
    console.error("Error creating user stats:", error);
    return null;
  }
};

// 39 **check and create user stats**
export const checkAndCreateUserStats = async () => {
  const stats = await getUserStats();
  if (!stats) {
    const userId = firebaseAuth.currentUser.uid;
    return await createUserStats(userId);
  }
  return stats;
};

// 40 **update user stats**
export const updateUserStat = async (
  userId,
  whatToCount,
  action = "increment"
) => {
  try {
    const userStatsCollection = collection(db, "userStats");
    const q = query(userStatsCollection, where("id", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("User stats not found, creating new stats...");
      await createUserStats(userId);
      return;
    }

    const userDoc = querySnapshot.docs[0].ref;
    const userData = querySnapshot.docs[0].data();
    const currentCount = userData[whatToCount] || 0;

    // Decyzja o akcji
    const newCount =
      action === "increment" ? currentCount + 1 : Math.max(0, currentCount - 1);

    await updateDoc(userDoc, { [whatToCount]: newCount });
    console.log(
      `${
        action === "increment" ? "Incremented" : "Decremented"
      } ${whatToCount} for user ${userId}`
    );
  } catch (error) {
    console.error("Error updating user stats:", error);
  }
};

//41 **get recruitment offer data
export const getRecruitmentOfferData = async (recruitmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);

    const recruitmentSnapshot = await getDoc(recruitmentDoc);
    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();

    const DataToExport = {
      recruitmentjobTittle: recruitmentData.jobTittle,
      recruitmentCourses: recruitmentData.courses,
      recruitmentSkills: recruitmentData.skills,
      recruitmentLanguages: recruitmentData.languages,
      recruitmentExperience: recruitmentData.experienceNeeded,
      recruitmentEducationField: recruitmentData.educationField,
      recruitmentEducationLevel: recruitmentData.educationLevel,
    };
    return DataToExport;
  } catch (error) {
    console.error("Error fetching recruitment offer data:", error.message);
    throw error;
  }
};

//42 **finish recruitment**
export const finishRecruitment = async (recruitmentId) => {
  try {
    await checkAuth(); // Ensure the user is authenticated asynchronously
    const isAdmin = GetIsAdmin();
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);
    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }
    const recruitmentData = recruitmentSnapshot.data();

    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error("You are not authorized to finish recruitment");
      }
    }

    const recruitmentStats = await getRecruitmentStats(recruitmentId);

    const countStatus = {
      ClCountStatus: recruitmentData.ClCountStatus ?? true,
      CvCountStatus: recruitmentData.CvCountStatus ?? true,
      TasksCountStatus: recruitmentData.TasksCountStatus ?? true,
      MeetingsCountStatus: recruitmentData.MeetingsCountStatus ?? true,
      AdnationalPointsCountStatus:
        recruitmentData.AdnationalPointsCountStatus ?? true,
    };

    const applicants = await getApplicantsWithOverallScore(recruitmentId);

    // Mapujemy aplikantów i liczymy `totalScore`
    const updatedApplicants = await Promise.all(
      applicants.map(async (applicant) => ({
        ...applicant,
        totalScore: await calculateTotalScore(applicant, countStatus),
      }))
    );

    const sortedApplicants = updatedApplicants.sort(
      (a, b) => b.totalScore - a.totalScore
    );

    const meetings = recruitmentData.MeetingSessions || [];
    const tasks = recruitmentData.TaskSessions || [];
    const offerData = {
      jobTittle: recruitmentData.jobTittle,
      experienceNeeded: recruitmentData.experienceNeeded,
      educationLevel: recruitmentData.educationLevel,
      educationField: recruitmentData.educationField,
      courses: recruitmentData.courses,
      skills: recruitmentData.skills,
      languages: recruitmentData.languages,
    };

    await updateDoc(recruitmentDoc, { stage: "Finished" });

    return {
      recruitmentStats,
      sortedApplicants,
      meetings,
      tasks,
      offerData,
    };
  } catch (error) {
    console.error("Error finishing recruitment:", error);
    throw error;
  }
};

export const addOpinion = async (recruitmentId, opinion) => {
  try {
    await checkAuth(); // Upewnij się, że użytkownik jest zalogowany
    const isAdmin = GetIsAdmin();
    // Pobranie dokumentu rekrutacji
    const recruitmentDoc = doc(db, "recruitments", recruitmentId);
    const recruitmentSnapshot = await getDoc(recruitmentDoc);

    if (!recruitmentSnapshot.exists()) {
      throw new Error("Recruitment not found");
    }

    const recruitmentData = recruitmentSnapshot.data();
    if (!isAdmin) {
      if (recruitmentData.userId !== firebaseAuth.currentUser.uid) {
        throw new Error("You are not authorized to add an opinion");
      }
    }

    const opinionsCollection = collection(db, "opinions");

    // Pobranie wszystkich opinii, aby znaleźć największe ID
    const opinionsSnapshot = await getDocs(opinionsCollection);
    let maxId = 0;

    opinionsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.id && data.id > maxId) {
        maxId = data.id;
      }
    });

    if (opinion.id === undefined) {
      opinion.id = maxId + 1; // Jeśli nie ma opinii, zacznie od 1
    }

    // Sprawdzenie, czy opinia już istnieje
    const opinionQuery = query(
      opinionsCollection,
      where("id", "==", opinion.id)
    );
    const opinionSnapshot = await getDocs(opinionQuery);

    const formattedDate = new Date().toLocaleString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    if (opinionSnapshot.empty) {
      // Dodanie nowej opinii
      const newOpinion = {
        ...opinion,
        recruitmentName: recruitmentData.name,
        recruitmentId: recruitmentId,
        jobTittle: recruitmentData.jobTittle,
        date: formattedDate, // Sformatowana data
      };
      await addDoc(opinionsCollection, newOpinion);
      return newOpinion;
    } else {
      // Aktualizacja istniejącej opinii
      const existingOpinionRef = opinionSnapshot.docs[0].ref;
      const updatedOpinion = {
        ...opinion,
        recruitmentId: recruitmentId,
        recruitmentName: recruitmentData.name,
        jobTittle: recruitmentData.jobTittle,
        date: formattedDate, // Sformatowana data
      };
      await updateDoc(existingOpinionRef, updatedOpinion);
      return updatedOpinion;
    }
  } catch (error) {
    console.error("Error adding opinion:", error.message);
    throw error;
  }
};

//45 **get opinion by recruitmentId**
export const findOpinionById = async (recruitmentId) => {
  try {
    await checkAuth(); // Upewnij się, że użytkownik jest zalogowany
    const opinionsCollection = collection(db, "opinions");
    const opinionQuery = query(
      opinionsCollection,
      where("recruitmentId", "==", recruitmentId)
    );
    const opinionSnapshot = await getDocs(opinionQuery);
    if (opinionSnapshot.empty) {
      return null;
    }
    return opinionSnapshot.docs[0].data();
  } catch (error) {
    console.error("Error fetching opinion by ID:", error.message);
    throw error;
  }
};

//46 **get random opinions**
export const getRandomOpinions = async () => {
  try {
    const opinionsSnapshot = await getDocs(collection(db, "opinions"));
    if (opinionsSnapshot.empty) {
      return []; // Return an empty array if no opinions exist
    }

    const allOpinions = opinionsSnapshot.docs.map((opinion) => opinion.data());

    // Shuffle array and get up to 9 random opinions
    const shuffledOpinions = allOpinions.sort(() => Math.random() - 0.5);
    const randomOpinions = shuffledOpinions.slice(0, 9);

    return randomOpinions;
  } catch (error) {
    console.error("Error fetching random opinions:", error.message);
    throw error;
  }
};

//47 **colse recruitment**
export const closeRecruitment = async (recruitmentId) => {
  try {
    const recruitmentDoc = await getDoc(doc(db, "recruitments", recruitmentId));
    if (!recruitmentDoc.exists()) {
      return null;
    }
    const recruitmentData = recruitmentDoc.data();

    const applicants = recruitmentData.Applicants || [];

    for (const applicant of applicants) {
      if (applicant.stage == "Hired") {
        await updateUserStat(
          firebaseAuth.currentUser.uid,
          "AllTimeHiredApplicants",
          "increment"
        );
        if (applicant.userUid) {
          await updateUserStat(
            applicant.userUid,
            "AllTimeApplicationHired",
            "increment"
          );
        }
      } else {
        if (applicant.userUid) {
          await updateUserStat(
            applicant.userUid,
            "AllTimeApplicationRejected",
            "increment"
          );
        }
      }
    }
    // Delete recruitment
    await deleteRecruitment(recruitmentId);
  } catch (error) {
    console.error("Error closing recruitment:", error.message);
    throw error;
  }
};

//48 **delete user stats**
export const deleteUserStats = async (userId) => {
  try {
    const userStatsCollection = collection(db, "userStats");
    const q = query(userStatsCollection, where("id", "==", userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("User stats not found");
      return;
    }
    const userDoc = querySnapshot.docs[0].ref;
    await deleteDoc(userDoc);
    console.log(`Deleted user stats for user ${userId}`);
  } catch (error) {
    console.error("Error deleting user stats:", error);
  }
};

//49 **get all users stats with user name and email**
export const getAllUsersStats = async () => {
  try {
    // Fetch users from Firebase Authentication
    const firebaseUsers = await getFirebaseUsers();  // Assumes this returns an array of users
    console.log(firebaseUsers);

    // Store users and their stats
    const usersStats = [];

    // Loop through each Firebase user and fetch their stats from Firestore
    for (const user of firebaseUsers) {
      const userId = user.uid;
      const email = user.email;
      const userName = user.displayName || 'No Name';  // Default to 'No Name' if no displayName

      // 1. Fetch user stats by userId (in userStats collection)
      const userStatsRef = collection(db, "userStats"); // Reference to the 'userStats' collection
      const q = query(userStatsRef, where("id", "==", userId)); // Query filtering by 'id' field

      // Fetch the documents that match the query
      const userStatsSnapshot = await getDocs(q);

      // Process the snapshot
      let userStatsData = {
        AllTimeApplicationHired: 0,
        AllTimeApplicationRejected: 0,
        AllTimeApplicationsCount: 0,
        AllTimeHiredApplicants: 0,
        AllTimeMeetingsCount: 0,
        AllTimeRecruitmentsCount: 0,
      };

      // If a matching document exists
      if (!userStatsSnapshot.empty) {
        const statsData = userStatsSnapshot.docs[0].data(); // Assuming only one document matches
        userStatsData = {
          AllTimeApplicationHired: statsData.AllTimeApplicationHired || 0,
          AllTimeApplicationRejected: statsData.AllTimeApplicationRejected || 0,
          AllTimeApplicationsCount: statsData.AllTimeApplicationsCount || 0,
          AllTimeHiredApplicants: statsData.AllTimeHiredApplicants || 0,
          AllTimeMeetingsCount: statsData.AllTimeMeetingsCount || 0,
          AllTimeRecruitmentsCount: statsData.AllTimeRecruitmentsCount || 0,
        };
      }

      // 2. Check the 'signInMethod' from the 'emails' collection by email
      const emailRef = doc(db, "emails", email);  // Assuming you store emails in 'emails' collection
      const emailSnapshot = await getDoc(emailRef);

      let signInMethod = 'Unknown'; // Default value if not found
      if (emailSnapshot.exists()) {
        const emailData = emailSnapshot.data();
        signInMethod = emailData.signInMethod || 'Unknown';
      }

      // Add user and their stats to the list
      usersStats.push({
        userId,
        userName,
        email,
        signInMethod,  // Add signInMethod to the stats
        ...userStatsData, // Merge user stats
      });
    }

    console.log("Users stats:", usersStats);
    return usersStats;

  } catch (error) {
    console.error("Error getting users stats:", error);
    return [];  // Return an empty array in case of an error
  }
};


//50 **update user stats**
export const updateUserStats = async (stats) => {
  try {
    await checkAuth(); // Ensure the user is authenticated
    const isAdmin = GetIsAdmin();
    if (!isAdmin) {
      throw new Error("You are not authorized to update user stats.");
    }

    if (!stats.id) {
      throw new Error("User ID is missing in the stats data.");
    }

    // Reference the collection
    const userStatsQuery = query(collection(db, "userStats"), where("id", "==", stats.id));
    const querySnapshot = await getDocs(userStatsQuery);

    if (!querySnapshot.empty) {
      // If the document exists, update it
      const userStatsDoc = querySnapshot.docs[0];
      const userStatsRef = userStatsDoc.ref;

      await updateDoc(userStatsRef, {
        AllTimeApplicationHired: stats.AllTimeApplicationHired || 0,
        AllTimeApplicationRejected: stats.AllTimeApplicationRejected || 0,
        AllTimeApplicationsCount: stats.AllTimeApplicationsCount || 0,
        AllTimeHiredApplicants: stats.AllTimeHiredApplicants || 0,
        AllTimeMeetingsCount: stats.AllTimeMeetingsCount || 0,
        AllTimeRecruitmentsCount: stats.AllTimeRecruitmentsCount || 0,
      });

      console.log(`User stats updated successfully for ID: ${stats.id}`);
    } else {
      // If the document does not exist, create a new one
      const newStatsRef = doc(collection(db, "userStats")); // Generate a new document reference

      await setDoc(newStatsRef, {
        id: stats.id,
        AllTimeApplicationHired: stats.AllTimeApplicationHired || 0,
        AllTimeApplicationRejected: stats.AllTimeApplicationRejected || 0,
        AllTimeApplicationsCount: stats.AllTimeApplicationsCount || 0,
        AllTimeHiredApplicants: stats.AllTimeHiredApplicants || 0,
        AllTimeMeetingsCount: stats.AllTimeMeetingsCount || 0,
        AllTimeRecruitmentsCount: stats.AllTimeRecruitmentsCount || 0,
      });

      console.log(`User stats created successfully for ID: ${stats.id}`);
    }

  } catch (error) {
    console.error("Error updating/creating user stats:", error);
    return { success: false, error: error.message };
  }
};

