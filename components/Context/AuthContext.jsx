import { createContext, useContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import Loading from "../Loading";
import Signin from "../Account/Signin";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    // https://www.reddit.com/r/webdev/comments/us599i/what_is_the_difference_between_firebase/
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        // console.log("no user");
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }
      const token = await user.getIdToken().catch((err) => {
        console.log("getIdToken() error: ", err);
      });
      // console.log(user.emailVerified);
      setCurrentUser(user);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <Loading type="spokes" color="#3e95c2" />;
  }

  if (!currentUser) {
    return <Signin />;
  } else {
    return (
      <AuthContext.Provider value={{ currentUser }}>
        {children}
      </AuthContext.Provider>
    );
  }
};

export const useAuth = () => useContext(AuthContext);
