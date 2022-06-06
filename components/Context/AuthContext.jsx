import { createContext, useContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import Loading from "../Loading";
import Login from "../Login";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const auth = getAuth();
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        console.log("no user");
        setCurrentUser(null);
        setLoading(false);
        return;
      }
      const token = await user.getIdToken().catch((err) => {
        console.log("getIdToken() error: ", err);
      });
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <Loading type="spokes" color="#3e95c2" />;
  }
  if (!currentUser) {
    return <Login />;
  } else {
    return (
      <AuthContext.Provider value={{ currentUser }}>
        {children}
      </AuthContext.Provider>
    );
  }
};

export const useAuth = () => useContext(AuthContext);
