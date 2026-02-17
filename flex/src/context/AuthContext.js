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

const USERS_API = "http://localhost:4000/users";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: save or update user in backend (prevents duplicates by email)
  const saveUserToServer = async (userInfo) => {
    try {
      // First check if user already exists
      const res = await axios.get(USERS_API);
      const allUsers = Array.isArray(res.data) ? res.data : [];
      const existingUser = allUsers.find((u) => u.email === userInfo.email);

      if (existingUser) {
        // User already exists — don't create duplicate, just return existing data
        setUserData(existingUser);
        return existingUser;
      }

      // New user — save to server
      const response = await axios.post(USERS_API, userInfo);
      const savedUser = response.data;
      setUserData(savedUser);
      return savedUser;
    } catch (error) {
      console.error("Failed to save user to server:", error);
    }
  };

  // Helper: fetch user data from server by email
  const fetchUserData = async (email) => {
    try {
      const res = await axios.get(USERS_API);
      const allUsers = Array.isArray(res.data) ? res.data : [];
      const found = allUsers.find((u) => u.email === email);
      if (found) {
        setUserData(found);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
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
      const firebaseUser = userCredential.user;

      // Update Firebase Auth Profile
      await updateProfile(firebaseUser, {
        displayName: name,
        photoURL: photoURL || "https://i.ibb.co/MgsTCcv/avater.jpg",
      });

      // Save to backend server with role
      await saveUserToServer({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: name,
        photoURL: photoURL || "https://i.ibb.co/MgsTCcv/avater.jpg",
        role: "user",
        createdAt: new Date().toISOString(),
      });

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

  // Google Login — saves to server and prevents duplicates
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Save to backend (will skip if already exists)
      await saveUserToServer({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: "user",
        createdAt: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      console.error("Error with Google login:", error);
      throw error;
    }
  };

  // Update User Profile
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

      // Find the user in the backend by email and update
      if (userData?._id) {
        await axios.put(`${USERS_API}/${userData._id}`, data);
      }
      
      // Update local state immediately
      setUserData(prev => ({ ...prev, ...data }));
      
      // Reload user to refresh auth object
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });

      return data;
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
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No user logged in");
      
      await currentUser.delete();
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
      if (currentUser?.email) {
        await fetchUserData(currentUser.email);
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
