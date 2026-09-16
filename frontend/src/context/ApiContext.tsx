import React, {createContext, useContext, type ReactNode} from 'react'

export const DEFAULT_API_URL = 'http://localhost:8001'

export const ApiContext = createContext<string>(DEFAULT_API_URL)

type ApiProviderProps = {
  children: ReactNode
  apiUrl?: string
}

export const ApiProvider = ({children, apiUrl = DEFAULT_API_URL}: ApiProviderProps) => (
  <ApiContext.Provider value={apiUrl}>{children}</ApiContext.Provider>
)

export const useApiContext = () => {
  const apiUrl = useContext(ApiContext)

  if (!apiUrl) {
    throw new Error('useApiContext must be used within an ApiProvider')
  }

  return apiUrl
}
