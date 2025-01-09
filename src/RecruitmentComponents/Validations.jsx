import { existingLanguages } from "../constants";

//recuitment validation
export const RecruitmentValidateForm = (formData) => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 25) {
      newErrors.name = 'Name cannot exceed 25 characters';
    }

    if (!formData.jobTittle) {
      newErrors.jobTittle = 'Job Title is required';
    } else if (formData.jobTittle.length > 30) {
      newErrors.jobTittle = 'Job Title cannot exceed 30 characters';
    }

    if (!formData.experienceNeeded) {
    
    } else if (Number(formData.experienceNeeded) < 0 || Number(formData.experienceNeeded) > 60) {
      newErrors.experienceNeeded = 'Experience needed must be between 0 and 60 years';
    }


    if (!formData.weightOfExperience) {
      newErrors.weightOfExperience = 'Weight of experience is required';
    } else if (Number(formData.weightOfExperience) < 0 || Number(formData.weightOfExperience) > 100) {
      newErrors.weightOfExperience = 'Weight of experience must be between 0 and 100';
    }

    if (!formData.weightOfSkills) {
      newErrors.weightOfSkills = 'Weight of skills is required';
    } else if (Number(formData.weightOfSkills) < 0|| Number(formData.weightOfSkills) > 100) {
      newErrors.weightOfSkills = 'Weight of skills must be between 0 and 100';
    }

    if(!formData.weightOfEducationLevel) {
       newErrors.weightOfEducationLevel = 'Weight of education level is required';
    } else if (Number(formData.weightOfEducationLevel) < 0 || Number(formData.weightOfEducationLevel) > 100) {
      newErrors.weightOfEducationLevel = 'Weight of education level must be between 0 and 100';
    }

    if(!formData.weightOfCourses) {
       newErrors.weightOfCourses = 'Weight of courses is required';
    } else if (Number(formData.weightOfCourses) < 0 || Number(formData.weightOfCourses) > 100) {
      newErrors.weightOfCourses = 'Weight of courses must be between 0 and 100';
    }

    if(!formData.weightOfLanguages) {
       newErrors.weightOfLanguages = 'Weight of languages is required';
    } else if (Number(formData.weightOfLanguages) < 0 || Number(formData.weightOfLanguages) > 100) {
      newErrors.weightOfLanguages = 'Weight of languages must be between 0 and 100';
    }

    let sumOfWeights = 
    Number(formData.weightOfCourses) + 
    Number(formData.weightOfLanguages) + 
    Number(formData.weightOfEducationLevel) + 
    Number(formData.weightOfSkills) + 
    Number(formData.weightOfExperience);
  
  
  if (sumOfWeights < 100 || sumOfWeights > 100) {
    newErrors.sumOfWeights = "Sum of weights must be equal to 100";
  }
  
    if (!formData.experienceNeeded) {
    } else if (Number(formData.experienceNeeded) < 0 || Number(formData.experienceNeeded) > 99) {
      newErrors.experienceNeeded = "Experience must be between 0 and 99 years";
    } else if (!/^(\d+(\.\d{1})?)$/.test(formData.experienceNeeded)) {
      newErrors.experienceNeeded = "Experience must be a number, e.g., 1, 1.5, 20";
    }

    
    if (formData.languages.length === 0) {
      
    } else {
      formData.languages.forEach((language, index) => {
        // Zamiana nazwy języka na małe litery
        const languageName = language.language.toLowerCase();
    
        // Sprawdzenie, czy język znajduje się na liście (po zamianie na małe litery)
        if (!language.language) {
          newErrors[`languages-${index}-language`] = "Language name is required";
        } else if (!existingLanguages.includes(languageName)) {
          newErrors[`languages-${index}-language`] = "Invalid or non-existent language";
        }
    
        // Sprawdzenie poprawności poziomu
        if (!language.level) {
          newErrors[`languages-${index}-level`] = "Language level is required";
        } else if (
          ![
            "A1 (Beginner)",
            "A2 (Elementary)",
            "B1 (Intermediate)",
            "B2 (Upper Intermediate)",
            "C1 (Advanced)",
            "C2 (Proficient)",
          ].includes(language.level)
        ) {
          newErrors[`languages-${index}-level`] = "Invalid language level";
        }
      });


    }

    return newErrors;
  };

  export const handleDeleteSkill = (formData, setFormData, skill) => {
    if (window.confirm(`Are you sure you want to remove the skill: ${skill}?`)) {
      setFormData({
        ...formData,
        skills: formData.skills.filter((s) => s !== skill),
      });
    }
  };
  
  export const handleDeleteCourse = (formData, setFormData, course) => {
    if (window.confirm(`Are you sure you want to remove the course: ${course}?`)) {
      setFormData({
        ...formData,
        courses: formData.courses.filter((c) => c !== course),
      });
    }
  };
  
  export const addLanguage = (formData, setFormData) => {
    setFormData({
      ...formData,
      languages: [...formData.languages, { name: "", level: "" }],
    });
  };
  
  export const removeLanguage = (formData, setFormData, index) => {
    const updatedLanguages = formData.languages.filter((_, i) => i !== index);
    setFormData({ ...formData, languages: updatedLanguages });
  };