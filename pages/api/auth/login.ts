import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET!; // Set this in .env.local

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  // Find user by email
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, password, role")
    .eq("email", email)
    .single();

  if (error || !user)
    return res.status(401).json({ message: "Invalid email or password" });

  // Check password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid)
    return res.status(401).json({ message: "Invalid email or password" });

  // Generate JWT Token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );

  res.status(200).json({ message: "Login successful", token });
}
