import React from 'react'
import { DsectionWrapper } from '../../hoc'

const YourOwnScore = () => {
  return (
    <section className="relative w-full h-screen mx-auto p-4 bg-gradient-to-br from-blue-900 to-slate-800 rounded-md">
      <h1>Add your own score</h1>
      
    </section>
  )
}

export default DsectionWrapper(YourOwnScore, 'YourOwnScore');
