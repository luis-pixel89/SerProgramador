import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { loginAdmin } from '@/services'

const AUTH_SESSION_KEY = 'krakedev_admin_session'
const TOKEN_KEY = 'krakedev_admin_token'

interface AuthContextValue {
  isAuthenticated: boolean
  token: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

AuthContext.displayName = 'AuthContext'

function getInitialAuth(): { isAuthenticated: boolean; token: string | null } {
  try {
    const session = sessionStorage.getItem(AUTH_SESSION_KEY) === 'true'
    const token = sessionStorage.getItem(TOKEN_KEY)
    return { isAuthenticated: session, token }
  } catch {
    return { isAuthenticated: false, token: null }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [{ isAuthenticated, token }, setAuth] = useState(getInitialAuth)

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await loginAdmin(username, password)
      setAuth({ isAuthenticated: true, token: result.token })
      try {
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true')
        sessionStorage.setItem(TOKEN_KEY, result.token)
      } catch { /* noop */ }
      return true
    } catch {
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setAuth({ isAuthenticated: false, token: null })
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY)
      sessionStorage.removeItem(TOKEN_KEY)
    } catch { /* noop */ }
  }, [])

  const value = useMemo(
    () => ({ isAuthenticated, token, login, logout }),
    [isAuthenticated, token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
