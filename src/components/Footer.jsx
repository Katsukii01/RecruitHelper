import React from 'react'
import BlueMoon from './BlueMoon'

const Footer = () => {
  return (
    <footer className="text-white w-full h-full relative">
      
      <BlueMoon />
      <section className='bg-glass-dark w-full h-full text-white p-6 '>
        
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 ">
        {/* Linki po lewej */}
        <div className="md:space-x-16 flex flex-col md:flex-row items-start">
        <div> 
            <h2 className="text-2xl font-bold text-sky">Contact</h2>
            <ul className="space-y-2 mt-2">
            <li className="hover:underline hover:text-blue-300">
                <a href="mailto:recruithelpercontact@gmail.com" className="hover:underline">recruithelpercontact@gmail.com</a>
            </li>
            <li className="hover:underline hover:text-blue-300">
                <a href="tel:+48123456789" className="hover:underline">+48 XXX XXX XXX</a>
            </li>
            </ul>
        </div>

        <div className="mt-4 md:mt-0 ml-0">
            <h2 className="text-2xl font-bold text-sky">Links</h2>
            <ul className="space-y-2 mt-2">
            <li className="hover:underline hover:text-blue-300">
                <a href="/FAQ" className="hover:underline">FAQ</a>
            </li>
            <li className="hover:underline hover:text-blue-300">
                <a href="/terms" className="hover:underline">Terms of Service</a>
            </li>
            <li className="hover:underline hover:text-blue-300">
                <a href="/help" className="hover:underline">Help</a>
            </li>
            <li className="hover:underline hover:text-blue-300">
                <a href="/#Contact" className="hover:underline">Contact</a>
            </li>
            </ul>
        </div>
        </div>


        {/* Ikonki mediów społecznościowych po prawej */}
        <div className="flex space-x-6">
          <div className='flex items-center'>
            <ul className="wrapperlink">
              <a href="https://www.facebook.com/" target='_blank'>
                <li className="icon facebook group">
                  <span className="tooltip">Facebook</span>
                  <svg
                    viewBox="0 0 320 512"
                    height="1.2em"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                    ></path>
                  </svg>
                </li>
              </a>
              <a href="https://www.linkedin.com/in/" target='_blank'>
                <li className="icon linkedin group">
                  <span className="tooltip">LinkedIn</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1.2em"
                    fill="currentColor"
                    viewBox="0 0 448 512"
                  >
                    <path d="M100.28 448H7.4V150.8h92.88V448zm-46.44-305.4c-29.8 0-54.06 24.3-54.06 54.06s24.3 54.06 54.06 54.06 54.06-24.3 54.06-54.06-24.3-54.06-54.06-54.06zm391.96 305.4h-92.8V317.6c0-31.56-11.2-53.08-39.12-53.08-21.3 0-33.92 14.36-39.52 28.28-2.04 4.92-2.56 11.76-2.56 18.68v145.08H174.4V150.8h89.6v40.44c12-18.6 33.64-45.2 82.48-45.2 60.72 0 106.2 39.88 106.2 125.44v176.16z"></path>
                  </svg>
                </li>
              </a>
              <a href="https://github.com/Katsukii01" target='_blank'>
                <li className="icon github group">
                  <span className="tooltip">GitHub</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1.2em"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.53 2.29 6.5 5.44 7.56.4.07.55-.17.55-.38v-1.4c-2.22.48-2.68-1.07-2.68-1.07-.36-.92-.88-1.16-.88-1.16-.72-.49.05-.48.05-.48.8.06 1.24.81 1.24.81.71 1.22 1.86.86 2.31.66.07-.51.28-.86.51-1.06-1.78-.2-3.65-.89-3.65-3.97 0-.88.31-1.6.81-2.16-.08-.2-.35-1.02.08-2.12 0 0 .67-.22 2.19.84.63-.18 1.32-.27 2-.27.68 0 1.37.09 2 .27 1.51-1.06 2.18-.84 2.18-.84.43 1.1.17 1.92.08 2.12.5.56.81 1.28.81 2.16 0 3.09-1.87 3.77-3.66 3.97.29.25.55.74.55 1.49v2.21c0 .21.15.46.55.38C13.71 14.5 16 11.53 16 8c0-4.42-3.58-8-8-8z"></path>
                  </svg>
                </li>
              </a>
            </ul>
          </div>
        </div>
      </div>

      <p className="text-sm text-center mt-6">© 2024 RecruitHelper. All rights reserved.</p>
      </section>
    </footer>
  )
}

export default Footer
