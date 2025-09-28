// FirebaseHelperpg.js

//--------------------------------
// 🔹 Imports
//--------------------------------
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,

} from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../../firebase";
import bcrypt from "bcryptjs";

//--------------------------------
// 🔹 Firestore Services
//--------------------------------

// ✅ Add data to collection
export const addData = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document:", e);
  }
};

// ✅ Get all documents from collection
export const getAllData = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (e) {
    console.error("Error getting documents:", e);
  }
};

// ✅ Get a single document by ID
export const getDataById = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document:", e);
  }
};

// ✅ Update document
export const updateData = async (collectionName, id, newData) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, newData);
    console.log("Document updated successfully");
  } catch (e) {
    console.error("Error updating document:", e);
  }
};

// ✅ Delete document
export const deleteData = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    console.log("Document deleted successfully");
  } catch (e) {
    console.error("Error deleting document:", e);
  }
};

//--------------------------------
// 🔹 Firebase Auth Services
//--------------------------------

// ✅ Signup user with hashed password
export const handleSignUp = async (email, password, extraData = {}) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Hash password before storing in Firestore
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      uid: user.uid,
      email: user.email,
      password: hashedPassword, // store hashed
      createdAt: new Date().toISOString(),
      ...extraData,
    };

    await setDoc(doc(db, "users", user.uid), userData);
    return userData;
  } catch (error) {
    console.error("Error signing up:", error.message);
    throw error;
  }
};
export const login = async (email, password) => {
  try {
    // 1️⃣ Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2️⃣ Fetch user data from Firestore
    const docSnap = await getDoc(doc(db, "users", user.uid));
    if (!docSnap.exists()) throw new Error("User data not found");

    return docSnap.data();
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

// ✅ Forgot password
export const forgotPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent!");
  } catch (error) {
    console.error("Error sending reset email:", error.message);
    throw error;
  }
};

// ✅ Logout
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Error logging out:", error.message);
    throw error;
  }
};

//--------------------------------
// 🔹 Cloudinary Image Upload
//--------------------------------
export const uploadImageToCloudinary = async (imageFile) => {
  const CLOUD_NAME = "dumgs9cp4";
  const UPLOAD_PRESET = "react_native_uploads";

  try {
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed", err);
    throw err;
  }
};
