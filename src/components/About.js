import React, { useContext, useEffect } from 'react'
import noteContext from '../context/notes/NoteContext'
export default function About() {
    const a=useContext(noteContext)
    useEffect(() => {
    a.update();
    }, [])
  return (

    <div>
      <h1>this is about {a.state.name} and he is in class {a.state.class}</h1>
    </div>
  )
}