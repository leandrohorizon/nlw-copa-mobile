import { createContext } from "react";

interface UserProps {
  name: string;
  avatar_url: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  sign_in: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
  async function sign_in(){
    console.log('vamos logar');
  }

  return (
    <AuthContext.Provider value={{
      sign_in,
      user: {
        name: 'Leandro',
        avatar_url: 'https://github.com/leandrohorizon.png'
      }
    }}>
      {children}
    </AuthContext.Provider>
  )
}
