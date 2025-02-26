import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Name, Email, Password, and Role required" });
  }

  // ✅ Check if the email already exists
  const { data: existingUser, error: checkError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    // Ignore "no rows found" error
    return res
      .status(500)
      .json({ message: "Database error while checking email" });
  }

  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // 🔒 Hash the password before inserting
  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ Insert new user
  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, password: hashedPassword, role }]);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  res.status(201).json({ message: "User registered successfully", user: data });
}
