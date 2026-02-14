import { NextResponse } from "next/server";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function GET(request, { params }) {
  try {
    const { uid } = params;

    if (!uid) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data());
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { uid } = params;

    if (!uid) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const userRef = doc(db, "users", uid);
    
    // Validate updates (optional: add joi/zod validation)
    await updateDoc(userRef, body);

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
