import { connectDB } from "@/dbConfig/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(req) {
  const { email, password } = await req.json();

  // Check if user already exists
  console.log("Checking if user already exists...");

  const existingUser = await User.find({ email });
  if (existingUser.length === 0) {
    return NextResponse.json(
      { message: "User does not exist" },
      { status: 400 } // Bad Request
    );
  }
  console.log("User exists, checking password...");
  // Check if password is correct
  const isPasswordCorrect = await bcryptjs.compare(
    password,
    existingUser[0].password
  );
  if (!isPasswordCorrect) {
    return NextResponse.json(
      { message: "Invalid password" },
      { status: 401 } // Unauthorized
    );
  }

  console.log("Password is correct, returning user data...");
  // Return user data without password
  //   const { password: _, ...userData } = existingUser[0].toObject();
  //   return NextResponse.json(
  //     { message: "Login successful", user: userData },
  //     { status: 200 } // OK
  //   );
  const tokenData = {
    id: existingUser[0]._id,
    name: existingUser[0].name,
    email: existingUser[0].email,
    role: existingUser[0].role,
  };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const respones = NextResponse.json(
    { message: "Login successful", user: existingUser },
    { status: 200 } // OK
  );
  respones.cookies.set("token", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
  });
  return respones;
}
