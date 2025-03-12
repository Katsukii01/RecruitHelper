import { existingLanguages } from "../constants";

//recuitment validation
export const RecruitmentValidateForm = (formData, t) => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = t('AddApplicants.ValidationErrors.name_required');
    } else if (formData.name.length > 45) {
      newErrors.name = t('AddApplicants.ValidationErrors.name_max');
    }

    if (!formData.jobTitle) {
      newErrors.jobTitle = t('AddApplicants.ValidationErrors.jobTitle_required')
    } else if (formData.jobTitle.length > 45) {
      newErrors.jobTitle = t('AddApplicants.ValidationErrors.jobTitle_max');
    }

    if (!formData.experienceNeeded) {
    
    } else if (Number(formData.experienceNeeded) < 0 || Number(formData.experienceNeeded) > 99) {
      newErrors.experienceNeeded = t('AddApplicants.ValidationErrors.experience_invalid');
    }
    
    if(formData.educationLevel){
      if(!formData.educationField){
        newErrors.educationField = t('AddApplicants.ValidationErrors.education_field_required');
      }
      }
    
      if(!formData.location){
        newErrors.location = t('AddApplicants.ValidationErrors.location_required');
      }

    if (!formData.weightOfExperience) {
      newErrors.weightOfExperience =  t('AddApplicants.ValidationErrors.weight_of_experience_required');
    } else if (Number(formData.weightOfExperience) < 0 || Number(formData.weightOfExperience) > 100) {
      newErrors.weightOfExperience =  t('AddApplicants.ValidationErrors.weight_of_experience_invalid');
    }

    if (!formData.weightOfSkills) {
      newErrors.weightOfSkills =  t('AddApplicants.ValidationErrors.weight_of_skills_required');
    } else if (Number(formData.weightOfSkills) < 0|| Number(formData.weightOfSkills) > 100) {
      newErrors.weightOfSkills = t('AddApplicants.ValidationErrors.weight_of_skills_invalid');
    }

    if(!formData.weightOfEducationLevel) {
       newErrors.weightOfEducationLevel = t('AddApplicants.ValidationErrors.weight_of_education_level_required');
    } else if (Number(formData.weightOfEducationLevel) < 0 || Number(formData.weightOfEducationLevel) > 100) {
      newErrors.weightOfEducationLevel = t('AddApplicants.ValidationErrors.weight_of_education_level_invalid');
    }

    if(!formData.weightOfCourses) {
       newErrors.weightOfCourses = t('AddApplicants.ValidationErrors.weight_of_courses_required');
    } else if (Number(formData.weightOfCourses) < 0 || Number(formData.weightOfCourses) > 100) {
      newErrors.weightOfCourses = t('AddApplicants.ValidationErrors.weight_of_courses_invalid');
    }

    if(!formData.weightOfLanguages) {
       newErrors.weightOfLanguages = t('AddApplicants.ValidationErrors.weight_of_languages_required');
    } else if (Number(formData.weightOfLanguages) < 0 || Number(formData.weightOfLanguages) > 100) {
      newErrors.weightOfLanguages = t('AddApplicants.ValidationErrors.weight_of_languages_invalid');
    }

    let sumOfWeights = 
    Number(formData.weightOfCourses) + 
    Number(formData.weightOfLanguages) + 
    Number(formData.weightOfEducationLevel) + 
    Number(formData.weightOfSkills) + 
    Number(formData.weightOfExperience);
  
  
  if (sumOfWeights < 100 || sumOfWeights > 100) {
    newErrors.sumOfWeights = t('AddApplicants.ValidationErrors.sum_of_weights_invalid');
  }
  
    if (!formData.experienceNeeded) {
    } else if (Number(formData.experienceNeeded) < 0 || Number(formData.experienceNeeded) > 99) {
      newErrors.experienceNeeded = t('AddApplicants.ValidationErrors.experience_needed_invalid');
    } else if (!/^(\d+(\.\d{1})?)$/.test(formData.experienceNeeded)) {
      newErrors.experienceNeeded =  t('AddApplicants.ValidationErrors.experience_needed_format');
    }

    
    if (formData.languages.length === 0) {
      
    } else {
      formData.languages.forEach((language, index) => {
        // Zamiana nazwy języka na małe litery
        const languageName = language.language.toLowerCase();
    
        // Sprawdzenie, czy język znajduje się na liście (po zamianie na małe litery)
        if (!language.language) {
          newErrors[`languages-${index}-language`] = t('AddApplicants.ValidationErrors.language_name_required');
        } else if (!existingLanguages.includes(languageName)) {
          newErrors[`languages-${index}-language`] = t('AddApplicants.ValidationErrors.language_invalid');
        }
    
        // Sprawdzenie poprawności poziomu
        if (!language.level) {
          newErrors[`languages-${index}-level`] = t('AddApplicants.ValidationErrors.language_level_required');
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
          newErrors[`languages-${index}-level`] = t('AddApplicants.ValidationErrors.language_level_invalid');
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