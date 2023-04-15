import supabase from "lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useState,useEffect } from "react";

const useAuth = () => {
  const [session, setSession] = useState<Session|null>(null);// ログイン状態を管理
  const [error, setError] = useState("");// エラー状況を管理

  useEffect(() => {
    // ログイン状態の変化を監視
    const {data:authData} = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });
    
    return () => authData.subscription.unsubscribe();
  },[]);

    

  // githubでサインイン
  const signInWithGithub = async () => {
    try {
        const{error} = await supabase.auth.signInWithOAuth({provider: "github"});
        if(error) {
          setError(error.message);
        }
    }catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }else if (typeof error === "string") {
        setError(error);
      }else{
        console.error("Githubとの連携に失敗しました")
      }
    }
  };

  const profileFromGithub: {
    nickname: string;
    avatarUrl: string;
  } = {
    nickname: session?.user?.user_metadata.user_name,
    avatarUrl: session?.user?.user_metadata.avatar_url,
  };

  const signOut = async() => {
    await supabase.auth.signOut();
  }

  return {
    session,
    error,
    profileFromGithub,
    signInWithGithub,
    signOut,
  };
};

export default useAuth;