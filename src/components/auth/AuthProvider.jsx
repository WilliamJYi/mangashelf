import React, { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import supabase from "../../supabase-client/SupabaseClient";

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [userFavourites, setUserFavourites] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: info } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        setUserInfo(info);
        setIsLoggedIn(true);
      } else {
        setUserInfo({});
        setUserFavourites([]);
        setIsLoggedIn(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchFavourite = async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userInfo.id);
      if (error) console.log(error);
      if (data) {
        setUserFavourites(data);
      }
    };

    if (isLoggedIn) fetchFavourite();
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, userInfo, userFavourites }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
