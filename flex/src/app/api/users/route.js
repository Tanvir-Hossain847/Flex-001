import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function POST(request) {
  try {
    const body = await request.json();
    const { uid, email, displayName, photoURL } = body;

    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid,
        email,
        displayName,
        photoURL,
        createdAt: new Date().toISOString(),
        role: "user",
        preferences: [],
        loyaltyParams: {
          points: 0,
          tier: "Bronze",
          nextTierPoints: 500,
        },
      });
      return NextResponse.json(
        { message: "User created successfully" },
        { status: 201 },
      );
    }

    return NextResponse.json(
      { message: "User already exists" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
