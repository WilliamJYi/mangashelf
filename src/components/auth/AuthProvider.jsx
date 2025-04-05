import React, { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import supabase from "../../supabase-client/SupabaseClient";

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [userFavourites, setUserFavourites] = useState([]);
  const [userHistory, setUserHistory] = useState([]);

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
        setUserHistory([]);
        setIsLoggedIn(false);
      }

      setIsAuthLoading(false);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          console.log("Session expired or user signed out");
          setIsLoggedIn(false);
          setUserInfo({});
          setUserFavourites([]);
          setUserHistory([]);
        }

        if (event === "SIGNED_IN" && session) {
          console.log("User signed in, fetching user info");
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

            const { data: favs, error: favError } = await supabase
              .from("favorites")
              .select("*")
              .eq("user_id", user.id);
            if (favError) console.log(favError);
            if (favs) setUserFavourites(favs);

            const { data: hist, error: histError } = await supabase
              .from("history")
              .select("*")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false });
            if (histError) console.log(histError);
            if (hist) setUserHistory(hist);
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
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

    if (isLoggedIn && userInfo.id) fetchFavourite();
  }, [isLoggedIn, userInfo.id]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("history")
        .select("*")
        .eq("user_id", userInfo.id)
        .order("created_at", { ascending: false });
      if (error) console.log(error);
      if (data) {
        setUserHistory(data);
      }
    };
    if (isLoggedIn && userInfo.id) fetchHistory();
  }, [isLoggedIn, userInfo.id]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isAuthLoading,
        userInfo,
        userFavourites,
        setUserFavourites,
        userHistory,
        setUserHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
