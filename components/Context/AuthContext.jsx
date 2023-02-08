import { createContext, useContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import Loading from "../Loading";
import Signin from "../Account/Signin";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [signinFlag, setSigninFlag] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    // https://www.reddit.com/r/webdev/comments/us599i/what_is_the_difference_between_firebase/
    return auth.onIdTokenChanged(async (user) => {
      // unset flags
      setIsLoading(false);
      setSigninFlag(false);

      // return if no user
      if (!user) {
        setCurrentUser(null);
        return;
      }
      // const token = await user.getIdToken().catch((error) => {
      //   console.log(error?.message);
      // });
      // console.log(user.emailVerified);
      setCurrentUser(user);
    });
  }, []);

  if (isLoading) {
    return <Loading type="spokes" color="#193773" />;
  }

  const url = new URL(window.location.href);
  if (
    !signinFlag &&
    (currentUser || url.pathname === "/" || url.pathname === "/events/")
  ) {
    return (
      <AuthContext.Provider value={{ currentUser, setSigninFlag }}>
        {children}
      </AuthContext.Provider>
    );
  } else {
    return <Signin />;
  }
};

export const useAuth = () => useContext(AuthContext);
