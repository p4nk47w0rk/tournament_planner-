'use client'

import {createContext, useContext, useState, useCallback, useEffect} from 'react'

interface EditModeContextType {
  editable: boolean
  toggle: () => void
}

const EditModeContext = createContext<EditModeContextType>({
  editable: false,
  toggle: () => {},
})

export function EditModeProvider({children}: {children: React.ReactNode}) {
  const [editable, setEditable] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('edit-mode')
    setEditable(stored === 'true')
  }, [])

  const toggle = useCallback(() => {
    setEditable((prev) => {
      const newState = !prev
      localStorage.setItem('edit-mode', String(newState))
      return newState
    })
  }, [])

  return (
    <EditModeContext.Provider value={{editable, toggle}}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode() {
  return useContext(EditModeContext)
}
