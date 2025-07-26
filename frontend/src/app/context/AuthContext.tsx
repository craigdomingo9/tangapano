'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'


type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<User>({} as User)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const {
    status,
    data
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => axios.get('/api/verify-token').then(res => {
      if (res.status === 200) {
        setUser(res.data.data)
        setIsAuthenticated(true)
      }
      return res.data.data
    }),
  })

  const logout = async () => {
    try {
      await axios.post('/api/logout')
    } catch {}
    setUser({} as User)
    setIsAuthenticated(false)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user: data, isAuthenticated, loading: status === "pending", logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}


