import { updateFirebaseUser } from '../services/recruitmentApi';
import { updateUserStats } from '../services/RecruitmentServices';
import React ,{ useState, useEffect } from 'react';
import { useNavigate,  useLocation  } from 'react-router-dom';

const EditFirebaseUserAdmin = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { userData } = state || {};
    const [formData, setFormData] = useState(userData || {}); // Initialize with userData or empty object
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleComeBack = () => {
        navigate(`/Admin`)
    }
    
    const validateForm = (formData) => {
        let errors = {}
        // Validate username
        if (!formData.userName) {
            errors.name = 'Name is required';
            } 
        else if (formData.userName.length > 25) {
            errors.name = 'Name must be less than 25 characters';
            }

        // Validate password
        if (formData.password) {
            if (formData.password.length < 8) {
                errors.password = 'Password must be at least 8 characters long';
            } else if (!/[A-Z]/.test(formData.password)) {
                errors.password = 'Password must contain at least one uppercase letter';
            } else if (!/[a-z]/.test(formData.password)) {
                errors.password = 'Password must contain at least one lowercase letter';
                } else if (!/\d/.test(formData.password)) {
                    errors.password = 'Password must contain at least one number';
                    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
                        errors.password = 'Password must contain at least one special character';
                        }                 
        }

        //validate stats - AllTimeApplicationHired
        if(formData.AllTimeApplicationHired < 0){
            errors.AllTimeApplicationHired = 'All Time Application Hired cannot be less than 0';

        }
        //check if stats - AllTimeApplicationHired is integer
        else if(formData.AllTimeApplicationHired % 1 !== 0){
            errors.AllTimeApplicationHired = 'All Time Application Hired must be an integer';
        }

        //validate stats - AllTimeApplicationRejected
        if(formData.AllTimeApplicationRejected < 0){
            errors.AllTimeApplicationRejected = 'All Time Application Rejected cannot be less than 0';
        }
        //check if stats - AllTimeApplicationRejected is integer
        else if(formData.AllTimeApplicationRejected % 1 !== 0){
            errors.AllTimeApplicationRejected = 'All Time Application Rejected must be an integer';
        }   

        //validate stats - AllTimeApplicationsCount
        if(formData.AllTimeApplicationsCount < 0){
            errors.AllTimeApplicationsCount = 'All Time Applications Count cannot be less than 0';
        }
        //check if stats - AllTimeApplicationsCount is integer
        else if(formData.AllTimeApplicationsCount % 1 !== 0){
            errors.AllTimeApplicationsCount = 'All Time Applications Count must be an integer';
        }

        //validate stats - AllTimeHiredApplicantsCount
        if(formData.AllTimeHiredApplicants < 0){
            errors.AllTimeHiredApplicants = 'All Time Hired Applicants cannot be less than 0';
        }
        //check if stats - AllTimeHiredApplicantsCount is integer
        else if(formData.AllTimeHiredApplicants % 1 !== 0){
            errors.AllTimeHiredApplicants = 'All Time Hired Applicants must be an integer';
        }

        //validate stats - AllTimeMeetingsCount
        if(formData.AllTimeMeetingsCount < 0){
            errors.AllTimeMeetingsCount = 'All Time Meetings Count cannot be less than 0';
        }
        //check if stats - AllTimeMeetingsCount is integer
        else if(formData.AllTimeMeetingsCount % 1 !== 0){
            errors.AllTimeMeetingsCount = 'All Time Meetings Count must be an integer';
                }

        //validate stats - AllTimeRecruitmentsCount
        if(formData.AllTimeRecruitmentsCount < 0){
            errors.AllTimeRecruitmentsCount = 'All Time Recruitments Count cannot be less than 0';
        }
        //check if stats - AllTimeRecruitmentsCount is integer
        else if(formData.AllTimeRecruitmentsCount % 1 !== 0){
            errors.AllTimeRecruitmentsCount = 'All Time Recruitments Count must be an integer';
            }

        return errors
    }




    const handleSubmit = async (e) => {
        e.preventDefault()

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

        navigate(`/Admin`)
    }

  return (
        <section className="min-h-screen flex items-center justify-center p-4 pt-28">
        <form 
            className="space-y-4 p-6 bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-screen-lg"
            onSubmit={handleSubmit}
        >
         <h2 className='text-2xl font-bold text-white mb-6'>
            Edit User Data
         </h2>
         {/*Username */}
        <div className=''>
          <label className="block text-sm font-medium text-gray-300">Name</label>
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
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <input
                type="password"
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                maxLength={25} 
                placeholder="If you dont want to change password leave it blank"
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
          <label className="block text-sm font-medium text-blue-300">All Time Application Hired</label>
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
          <label className="block text-sm font-medium text-blue-300">All Time Application Rejected</label>
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
            <label className="block text-sm font-medium text-blue-300">All Time Applications Count</label>
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
            <label className="block text-sm font-medium text-blue-300">All Time Hired Applicants</label>
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
            <label className="block text-sm font-medium text-blue-300">All Time Meetings Count</label>
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
            <label className="block text-sm font-medium text-blue-300">All Time Recruitments Count</label>
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
            type="submit"
            className="bg-green-500 text-white rounded-lg m-2 p-2 font-medium border border-white shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"

        >
            Save Changes
        </button>
        <button
            onClick={handleComeBack}
            className=" rounded-lg bg-gray-500  font-medium border border-white shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 text-white p-2 m-2 "
          >
            Come Back
          </button>
       </div>
        </form>
    </section>
  )
}

export default EditFirebaseUserAdmin
