import { createContext, useContext, useState, 
  useEffect } from "react";
import supabase from "../supabase-client";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState("manager");

    useEffect(() => {
      const getInitialSession = async () => {
        try {
          const {data, error} = await supabase.auth.getSession();
          if(error){
            throw new Error(error);
          }
          console.log(data)
          setSession(data.session)
        } catch (err) {
          console.error(`Error getting session from supabase ${err}`)
        }
      }

      getInitialSession()
    }, [])
    
    const signInUser = async (email, password) => {
    
      try {
        const {data, error} = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password
        })

        if (error) {
          console.error('Supabase sign-in error:', error.message);
          return { success: false, error: error.message };
        }
        console.log('Supabase sign-in success:', data);
        return { success: true, data };
      } catch (error) {
        console.error('Unexpected error during sign-in:', error.message);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      }
    }

    const signOut = async () => {
      try {
        const { error } = await supabase.auth.signOut()

        if (error) {
          console.error('Supabase sign-out error:', error.message);
          return { success: false, error: error.message };
        }
        console.log('Supabase sign-out success:');
        return { success: true};
      } catch (error) {
        console.error('Unexpected error during sign-out:', error.message);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      }
    }

    return(
    <AuthContext.Provider value={{ session, signInUser, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}