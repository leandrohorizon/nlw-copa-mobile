import { createContext, useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { api } from "../services/api";

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
  name: string;
  avatar_url: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  is_user_loading: boolean;
  sign_in: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, set_user] = useState<UserProps>({} as UserProps);
  const [is_user_loading, set_is_user_loading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email'],
  })

  async function sign_in(){
    try{
      set_is_user_loading(true);
      await promptAsync()

    } catch(error) {
      console.log(error);
      throw error;
    } finally {
      set_is_user_loading(false);
    }
  }

  async function sign_in_with_google(access_token: string) {
    try {
      set_is_user_loading(true);

      const tokenResponse = await api.post('/users', { access_token });
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`;

      const userInfoResponse = await api.get('/me');
      set_user(userInfoResponse.data.user);

    } catch(error) {
      console.log(error);
      throw error;
    } finally {
      set_is_user_loading(false);
    }
  }

  useEffect(() => {
    if(response?.type === 'success' && response.authentication?.accessToken){
      sign_in_with_google(response.authentication.accessToken);
    }
  }, [response])

  return (
    <AuthContext.Provider value={{
      sign_in,
      is_user_loading,
      user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
