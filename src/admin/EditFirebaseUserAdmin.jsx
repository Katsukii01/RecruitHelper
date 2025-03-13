import { updateFirebaseUser } from '../services/recruitmentApi';
import { updateUserStats } from '../services/RecruitmentServices';
import React ,{ useState, useEffect } from 'react';
import { useNavigate,  useLocation  } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext';
import { useTranslation } from 'react-i18next';

const EditFirebaseUserAdmin = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { userData } = state || {};
    const [formData, setFormData] = useState(userData || {}); // Initialize with userData or empty object
    const [errors, setErrors] = useState({});
    const { isAdmin } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (isAdmin === false) {
      navigate('/'); 
    }
  }, [isAdmin, navigate]); // Zależność dodana

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleComeBack = () => {
        navigate(`/Admin`)
    }
    
    const validateForm = (formData, t) => {
      let errors = {};
  
      // Validate username
      if (!formData.userName) {
          errors.name = t("Manage users.Validation Errors.Name is required");
      } else if (formData.userName.length > 25) {
          errors.name = t("Manage users.Validation Errors.Name must be less than 25 characters");
      }
  
      // Validate password
      if (formData.password) {
          if (formData.password.length < 8) {
              errors.password = t("Manage users.Validation Errors.Password must be at least 8 characters long");
          } else if (!/[A-Z]/.test(formData.password)) {
              errors.password = t("Manage users.Validation Errors.Password must contain at least one uppercase letter");
          } else if (!/[a-z]/.test(formData.password)) {
              errors.password = t("Manage users.Validation Errors.Password must contain at least one lowercase letter");
          } else if (!/\d/.test(formData.password)) {
              errors.password = t("Manage users.Validation Errors.Password must contain at least one number");
          } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(formData.password)) {
              errors.password = t("Manage users.Validation Errors.Password must contain at least one special character");
          }
      }
  
      // Validate AllTimeApplicationHired
      if (formData.AllTimeApplicationHired < 0) {
          errors.AllTimeApplicationHired = t("Manage users.Validation Errors.All Time Application Hired cannot be less than 0");
      } else if (formData.AllTimeApplicationHired % 1 !== 0) {
          errors.AllTimeApplicationHired = t("Manage users.Validation Errors.All Time Application Hired must be an integer");
      }
  
      // Validate AllTimeApplicationRejected
      if (formData.AllTimeApplicationRejected < 0) {
          errors.AllTimeApplicationRejected = t("Manage users.Validation Errors.All Time Application Rejected cannot be less than 0");
      } else if (formData.AllTimeApplicationRejected % 1 !== 0) {
          errors.AllTimeApplicationRejected = t("Manage users.Validation Errors.All Time Application Rejected must be an integer");
      }
  
      // Validate AllTimeApplicationsCount
      if (formData.AllTimeApplicationsCount < 0) {
          errors.AllTimeApplicationsCount = t("Manage users.Validation Errors.All Time Applications Count cannot be less than 0");
      } else if (formData.AllTimeApplicationsCount % 1 !== 0) {
          errors.AllTimeApplicationsCount = t("Manage users.Validation Errors.All Time Applications Count must be an integer");
      }
  
      // Validate AllTimeHiredApplicants
      if (formData.AllTimeHiredApplicants < 0) {
          errors.AllTimeHiredApplicants = t("Manage users.Validation Errors.All Time Hired Applicants cannot be less than 0");
      } else if (formData.AllTimeHiredApplicants % 1 !== 0) {
          errors.AllTimeHiredApplicants = t("Manage users.Validation Errors.All Time Hired Applicants must be an integer");
      }
  
      // Validate AllTimeMeetingsCount
      if (formData.AllTimeMeetingsCount < 0) {
          errors.AllTimeMeetingsCount = t("Manage users.Validation Errors.All Time Meetings Count cannot be less than 0");
      } else if (formData.AllTimeMeetingsCount % 1 !== 0) {
          errors.AllTimeMeetingsCount = t("Manage users.Validation Errors.All Time Meetings Count must be an integer");
      }
  
      // Validate AllTimeRecruitmentsCount
      if (formData.AllTimeRecruitmentsCount < 0) {
          errors.AllTimeRecruitmentsCount = t("Manage users.Validation Errors.All Time Recruitments Count cannot be less than 0");
      } else if (formData.AllTimeRecruitmentsCount % 1 !== 0) {
          errors.AllTimeRecruitmentsCount = t("Manage users.Validation Errors.All Time Recruitments Count must be an integer");
      }
  
      return errors;
  };
  
    const handleSubmit = async (e) => {
        try {
        e.preventDefault()
        setIsLoading(true);

        // Validate form data
        const validationErrors = validateForm(formData)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        //clear zeros at beginning of numbers
        formData.AllTimeApplicationHired = formData.AllTimeApplicationHired.toString().replace(/^0+/, '');
        formData.AllTimeApplicationRejected = formData.AllTimeApplicationRejected.toString().replace(/^0+/, '');
        formData.AllTimeApplicationsCount = formData.AllTimeApplicationsCount.toString().replace(/^0+/, '');
        formData.AllTimeHiredApplicants = formData.AllTimeHiredApplicants.toString().replace(/^0+/, '');
        formData.AllTimeMeetingsCount = formData.AllTimeMeetingsCount.toString().replace(/^0+/, '');
        formData.AllTimeRecruitmentsCount = formData.AllTimeRecruitmentsCount.toString().replace(/^0+/, '');

        //convert to numbers
        formData.AllTimeApplicationHired = Number(formData.AllTimeApplicationHired)
        formData.AllTimeApplicationRejected = Number(formData.AllTimeApplicationRejected)
        formData.AllTimeApplicationsCount = Number(formData.AllTimeApplicationsCount)
        formData.AllTimeHiredApplicants = Number(formData.AllTimeHiredApplicants)
        formData.AllTimeMeetingsCount = Number(formData.AllTimeMeetingsCount)
        formData.AllTimeRecruitmentsCount = Number(formData.AllTimeRecruitmentsCount)

        //userStats 
        const userStats = {
            AllTimeApplicationHired: formData.AllTimeApplicationHired,
            AllTimeApplicationRejected: formData.AllTimeApplicationRejected,
            AllTimeApplicationsCount: formData.AllTimeApplicationsCount,
            AllTimeHiredApplicants: formData.AllTimeHiredApplicants,
            AllTimeMeetingsCount: formData.AllTimeMeetingsCount,
            AllTimeRecruitmentsCount: formData.AllTimeRecruitmentsCount,
            id: formData.userId,
        }
        

        await updateUserStats(userStats)

        const user = {
            uid: formData.userId,  // Ensure 'uid' instead of 'UID'
            userName: formData.userName,
          };
          
          if (formData.password) {
            user.password = formData.password;
          }
          
          console.log(user);
          await updateFirebaseUser(user);
          alert(
            t("Manage users.User updated successfully!")
          );
          navigate(`/Admin`)
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            setIsLoading(false);
        }
    }

  return (
        <section className="min-h-screen flex items-center justify-center p-4 pt-28">
        <form 
            className="space-y-4 p-6 bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-screen-lg"
            onSubmit={handleSubmit}
        >
         <h2 className='text-2xl font-bold text-white mb-6'>
            {t("Manage users.Edit User Data")}
         </h2>
         {/*Username */}
        <div className=''>
          <label className="block text-sm font-medium text-gray-300">
              {t("Manage users.User Name")}
            </label>
          <input
            type="text"
            name="userName"
            value={formData.userName || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="up to 25 signs"  
          />
          {errors.name &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.name}</p>}
        </div>

            {/* Password */}
            {formData.signInMethod === 'email/password' && (
            <div className="">
                <label className="block text-sm font-medium text-gray-300">
                    {t("Manage users.Password")}
                </label>
                <input
                type="password"
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                maxLength={25} 
                placeholder={t("Manage users.If you dont want to change password leave it blank")}
                />
                {errors.password && (
                <p className="text-red-500 bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">
                    {errors.password}
                </p>
                )}
            </div>
            )}


        {/*Stats - All Time Application Hired */}
        <div className='border-2 border-gray-500 rounded-md p-2'>
          <label className="block text-sm font-medium text-blue-300">
              {t("Manage users.All Time Application Hired")}
          </label>
          <input
            type="number"
            name="AllTimeApplicationHired"
            value={formData.AllTimeApplicationHired || 0}
            onChange={handleChange}
            className="mt-1 block w-1/2 px-3 py-2 border border-sky rounded-md shadow-sm bg-blue-50 text-blue-400"
          />
          {errors.AllTimeApplicationHired &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.AllTimeApplicationHired}</p>}
        </div>  

        {/*Stats - All Time Application Rejected */}
        <div className='border-2 border-gray-500 rounded-md p-2'>        
          <label className="block text-sm font-medium text-blue-300">
              {t("Manage users.All Time Application Rejected")}
          </label>
          <input
            type="number"
            name="AllTimeApplicationRejected"
            value={formData.AllTimeApplicationRejected || 0}
            onChange={handleChange}
            className="mt-1 block w-1/2 px-3 py-2 border border-sky rounded-md shadow-sm bg-blue-50 text-blue-400"
          />
          {errors.AllTimeApplicationRejected &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.AllTimeApplicationRejected}</p>}
        </div>  

        {/*Stats - All Time Applications Count*/}
        <div className='border-2 border-gray-500 rounded-md p-2'>
            <label className="block text-sm font-medium text-blue-300">
                {t("Manage users.All Time Applications Count")}
            </label>
            <input
              type="number"
              name="AllTimeApplicationsCount"
              value={formData.AllTimeApplicationsCount || 0}
              onChange={handleChange}
              className="mt-1 block w-1/2 px-3 py-2 border border-sky rounded-md shadow-sm bg-blue-50 text-blue-400"
            />
            {errors.AllTimeApplicationsCount &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.AllTimeApplicationsCount}</p>}
        </div>

        {/*Stats - All Time Hired Applicants*/}
        <div className='border-2 border-gray-500 rounded-md p-2'>
            <label className="block text-sm font-medium text-blue-300">
                    {t("Manage users.All Time Hired Applicants")}
            </label>
            <input
              type="number"
              name="AllTimeHiredApplicants"
              value={formData.AllTimeHiredApplicants || 0}
              onChange={handleChange}
              className="mt-1 block w-1/2 px-3 py-2 border border-sky rounded-md shadow-sm bg-blue-50 text-blue-400"
            />
            {errors.AllTimeHiredApplicants &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.AllTimeHiredApplicants}</p>}
        </div>

        {/*Stats - All Time Meetings Count*/}
        <div className='border-2 border-gray-500 rounded-md p-2'>
            <label className="block text-sm font-medium text-blue-300">
                      {t("Manage users.All Time Meetings Count")}
            </label>
            <input
              type="number"
              name="AllTimeMeetingsCount"
              value={formData.AllTimeMeetingsCount || 0}
              onChange={handleChange}
              className="mt-1 block w-1/2 px-3 py-2 border border-sky rounded-md shadow-sm bg-blue-50 text-blue-400"
              />
              {errors.AllTimeMeetingsCount &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.AllTimeMeetingsCount}</p>}
        </div>

        {/*Stats - All Time Recruitments Coun*/}
        <div className='border-2 border-gray-500 rounded-md p-2'>
            <label className="block text-sm font-medium text-blue-300">
                  {t("Manage users.All Time Recruitments Count")}
            </label>
            <input
              type="number"
              name="AllTimeRecruitmentsCount"
              value={formData.AllTimeRecruitmentsCount || 0} 
              onChange={handleChange}
              className="mt-1 block w-1/2 px-3 py-2 border border-sky rounded-md shadow-sm bg-blue-50 text-blue-400"
              />        
              {errors.AllTimeRecruitmentsCount &&   <p className="text-red-500  bg-red-100 mt-2 border-l-4 border-red-500 p-2 mb-4 rounded animate-pulse">{errors.AllTimeRecruitmentsCount}</p>}
        </div>

        {/*submit button*/}
        <div className="flex justify-center">
        <button
            disabled={isLoading}
            type="submit"
            className="bg-green-500 text-white rounded-lg m-2 p-2 font-medium border border-white shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"

        >
            {t("Manage users.Save Changes")}
        </button>
        <button
            disabled={isLoading}
            onClick={handleComeBack}
            className=" rounded-lg bg-gray-500  font-medium border border-white shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 text-white p-2 m-2 "
          >
            {t("Manage users.Come Back")}
          </button>
       </div>
        </form>
    </section>
  )
}

export default EditFirebaseUserAdmin
