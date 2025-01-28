import React from 'react'
import { useState, useEffect } from 'react'
import { DsectionWrapper } from '../../hoc/index'

const MeetingPoints = ( {id, refresh}) => {
  return (
    <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">
    <h1 className="text-2xl font-bold text-white mb-4">Meetings Points</h1>

    
    </section>
  )
}

export default  DsectionWrapper(MeetingPoints, 'MeetingsPoints')

