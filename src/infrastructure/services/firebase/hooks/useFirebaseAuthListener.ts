"use client";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { UsersEntity } from "@/core";
import { FirebaseUserMapper } from "@/infrastructure/dto";

export function useFirebaseAuthListener() {
  const [user, setUser] = useState<UsersEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user = FirebaseUserMapper.toDTO(firebaseUser);
        setUser(Object.assign(new UsersEntity(), user));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
