import { createContext, useContext, useState, 
  useEffect } from "react";
import supabase from "../supabase-client";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [users, setUsers] = useState([]);

    useEffect(() => {
      const getInitialSession = async () => {
        try {
          const {data, error} = await supabase.auth.getSession();
          if(error){
            throw new Error(error);
          }
          
          setSession(data.session)
        } catch (err) {
          console.error(`Error getting session from supabase ${err}`)
        }
      }
      getInitialSession()

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        console.log('Session changed:', session);
      })

    }, [])

    useEffect(() => {
      if(!session) {
        return;
      }

      async function fetchUsers() {
        try {
          const { data, error } = await supabase
          .from('user_profiles')
          .select(`name, id, account_type`);

          if (error) {
            throw error;
          }

          setUsers(data);
          
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }

      fetchUsers()
    }, [session])
    
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

    const signUpNewUser = async (email, password, name, accountType) => {
    
      try {
        const {data, error} = await supabase.auth.signUp({
          email: email.toLowerCase(),
          password,
          options: {
            data: {
              name: name,
              account_type: accountType
            }
          }
        })

        if (error) {
          console.error('Supabase sign-up error:', error.message);
          return { success: false, error: error.message };
        }
        console.log('Supabase sign-up success:', data);
        return { success: true, data };
      } catch (error) {
        console.error('Unexpected error during sign-up:', error.message);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      }
    }
    

    return(
    <AuthContext.Provider value={{ session, signInUser, signOut, signUpNewUser, users}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}