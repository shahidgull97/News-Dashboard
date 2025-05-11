import { connectDB } from "@/dbConfig/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connectDB();

export async function POST(req) {
  const { name, email, password, formData } = await req.json();

  // Check if user already exists
  console.log("Checking if user already exists...");

  const existingUser = await User.find({ email });
  if (existingUser.length > 0) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 } // Bad Request
    );
  }
  console.log("User does not exist, creating new user...");

  const hashedPassword = await bcryptjs.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: formData.role,
  });
  await newUser.save();
  return NextResponse.json(
    { message: "User created successfully" },
    { status: 201 }, // Created
    newUser
  );
}
