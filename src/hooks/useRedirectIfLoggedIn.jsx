import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../components/auth/AuthContext";

const useRedirectIfLoggedIn = (redirectTo = "/") => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) navigate(redirectTo);
  }, [isLoggedIn, navigate, redirectTo]);
};

export default useRedirectIfLoggedIn;
