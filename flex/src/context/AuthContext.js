"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // Extended user data
  const [loading, setLoading] = useState(true);

  // Helper to fetch extended user data
  const fetchUserData = async (uid) => {
    try {
      const response = await axios.get(`/api/users/${uid}`);
      if (response.data) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch extended user data:", error);
    }
  };

  // Register User
  const createUser = async (email, password, name, photoURL) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update Firebase Auth Profile
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL || "https://i.ibb.co/MgsTCcv/avater.jpg",
      });

      // Sync with database
      try {
        const newUser = {
          uid: user.uid,
          email: user.email,
          displayName: name,
          photoURL: photoURL || "https://i.ibb.co/MgsTCcv/avater.jpg",
          createdAt: new Date().toISOString(),
        };
        await axios.post("/api/users", newUser);
        setUserData(newUser); // Set initial user data
      } catch (axiosError) {
        console.error("Failed to sync user with database:", axiosError);
      }

      return userCredential;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  // Login User
  const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Login
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Sync with database
      try {
        const payload = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        await axios.post("/api/users", payload);
        // After syncing, fetch latest data which might include phone/address if user existed
        fetchUserData(user.uid);
      } catch (axiosError) {
        console.error("Failed to sync user with database:", axiosError);
      }

      return result;
    } catch (error) {
      console.error("Error with Google login:", error);
      throw error;
    }
  };

  // Update User Profile (Name, Phone, Address, Bio, etc.)
  const updateUserProfile = async (uid, data) => {
    try {
      if (!uid) throw new Error("User ID is required");

      // Update Auth Profile if displayName/photoURL changed
      if (data.displayName || data.photoURL) {
        await updateProfile(auth.currentUser, {
          displayName: data.displayName || auth.currentUser.displayName,
          photoURL: data.photoURL || auth.currentUser.photoURL,
        });
      }

      // Update Database via API
      const response = await axios.put(`/api/users/${uid}`, data);
      
      // Update local state immediately
      setUserData(prev => ({ ...prev, ...data }));
      
      // Reload user to refresh auth object if needed
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });

      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Reset Password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Logout
  const logout = () => {
    setUserData(null);
    return signOut(auth);
  };

  // Delete User Account
  const deleteUserAccount = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");
      
      // Implement additional clean up logic here (e.g. delete from database)
      // For now, we just delete from Firebase Auth
      await user.delete();
      setUserData(null);
      setUser(null);
    } catch (error) {
       console.error("Error deleting user account:", error);
       throw error;
    }
  };

  // Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    userData,
    loading,
    createUser,
    loginUser,
    googleLogin,
    resetPassword,
    logout,
    updateUserProfile,
    deleteUserAccount,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
